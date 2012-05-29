#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import cgi
import json

import sys
sys.path.append("/work/tulip-dev/tulip_3_6_maint-build/release/install/lib")
from tulip import *


class graphManager():

    graph = tlp.newGraph()

    def JSONtoGraph(self, json):	
	nodeList = []
	graphNList = []
	for n in json[u'nodes']:
		nodeList.append(n[u'name'])
	for n in self.graph.getNodes():
		if n.id in nodeList:
			graphNList.append(n)

	g = self.graph.inducedSubGraph(graphNList)
	return g

    def modifyGraph(self, graph):
	viewL = graph.getLayoutProperty("viewLayout")
	graph.computeLayoutProperty("Random", viewL)
	graph.computeLayoutProperty("Circular", viewL)
	
	for n in self.graph.getNodes():
		viewL[n] *= 10
	return graph


    def createGraph(self, nbNodes):

	nodeList = [self.graph.addNode() for i in range(nbNodes)]
	edgeList = [self.graph.addEdge(nodeList[i],nodeList[j]) for j in range(nbNodes) for i in range(0,nbNodes)]#j+1, n)]
	tlp.SimpleTest.makeSimple(self.graph)
	viewL = self.graph.getLayoutProperty("viewLayout")
	self.graph.computeLayoutProperty("Random", viewL)
	self.graph.computeLayoutProperty("Circular", viewL)

	for n in self.graph.getNodes():
		viewL[n] *= 10

        return self.graph

    def graphToJSON(self, graph=0):
	if not graph:
		graph = self.graph
 	vLayout = graph.getLayoutProperty("viewLayout")
    	nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]} for n in graph.getNodes()]}
    	nToI = {nList["nodes"][i]["name"]:i for i in range(len(nList["nodes"]))}
    	eList = {"links":[{"source":nToI[graph.source(e).id], "target":nToI[graph.target(e).id], "value":1} for e in graph.getEdges()]}
    	nList.update(eList)
    	print "dumping: ", json.dumps(nList)
    	return json.dumps(nList)




class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    graphMan = graphManager() 

    def do_GET(self):
	print "path=",self.path
        if len(self.path.split('?'))<2:
            return
	paramStr = self.path.split('?')[1]
        if len(paramStr) == 1:
            return
	params = {}
        
        returnJSON = ""

	if len(paramStr) > 1:
		params = cgi.parse_qs(paramStr, True, True)
		if "n" in params.keys():
			print params["n"][0]
			try:
				self.graphMan.createGraph(int(params["n"][0]))
				returnJSON = self.graphMan.graphToJSON()
                                print "this is to return: ",returnJSON

			except:
				print "wrong parameter n"
		else:
                    print "parameter n should be set to integer: ?n=XX"
		
		print "GET parameters: ",params

	self.sendJSON(returnJSON)

    def do_POST(self):
	ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
	print ctype
	print pdict
	if ctype == 'application/x-www-form-urlencoded':
        	length = int(self.headers.getheader('content-length'))
        	postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
		graphJSON = ""
		if 'json_string' in postvars.keys():
			graphJSON = json.loads(postvars['json_string'][0])

		g = self.graphMan.JSONtoGraph(graphJSON)
		g = self.graphMan.modifyGraph(g)
		graphJSON = self.graphMan.graphToJSON(g)
		self.sendJSON(graphJSON)

    def sendJSON(self,json):
	self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        print "this is to return: ",json
        self.wfile.write(json)
	
        
	

def main():
	try:
		Handler = MyRequestHandler
		server = SocketServer.TCPServer(('0.0.0.0', 8085), Handler)
		#server = HTTPServer(('', int(port)), MainHandler)
		print 'started httpserver...'
		server.serve_forever()
	except KeyboardInterrupt:
		print '^C received, shutting down server'
		server.socket.close()

tlp.initTulipLib()
tlp.loadPlugins()
main()
