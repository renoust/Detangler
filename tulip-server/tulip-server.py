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

    def modifyGraph(self, graph=0):
	if not graph:
		graph = self.graph

	viewL = graph.getLayoutProperty("viewLayout")
	graph.computeLayoutProperty("Random", viewL)
	
	for n in self.graph.getNodes():
		viewL[n] *= 10
	return graph


    ''' here we should add protection for properties automatic load (warning will crash when diff type w/ same name)
    '''
    def addGraph(self, json):
	g = tlp.newGraph()
	
	#for d3.force.layout import
	idToNode = {}
        idIndex = 0

	for n in json[u'nodes']:
		u = g.addNode()
		idToNode[idIndex] = u
		idIndex += 1
		for k in n.keys():
			prop = 0
			kType = type(n[k])
			if kType == int or kType == float:
				prop = g.getDoubleProperty(k.encode("utf-8"))
			if kType == str:
				prop = g.getStringProperty(k.encode("utf-8"))
			if kType == bool:
				prop = g.getBooleanProperty(k.encode("utf-8"))
			if prop:
				prop[u] = n[k]
		if u'id' not in n.keys():
			prop = g.getDoubleProperty("id")
			prop[u] = u.id
		
	
	for e in json[u'links']:
		if u'source' in e.keys() and u'target' in e.keys():
			print e
			v = g.addEdge(idToNode[e[u'source']], idToNode[e[u'target']])

			for k in e.keys():
				if k not in [u'source', u'target']:
					prop = 0
					kType = type(e[k])
					if kType == int or kType == float:
						prop = g.getDoubleProperty(k.encode("utf-8"))
					if kType == str:
						prop = g.getStringProperty(k.encode("utf-8"))
					if kType == bool:
						prop = g.getBooleanProperty(k.encode("utf-8"))
					if prop:
						prop[v] = e[k]	

			if 'id' not in e.keys():
				prop = g.getDoubleProperty("id")
				prop[v] = v.id

	self.graph = g #temporary, we should manage sessions and graphIDs
	return g


	

    def createGraph(self, nbNodes):
	
	if not self.graph.numberOfNodes():
		nodeList = [self.graph.addNode() for i in range(nbNodes)]
		edgeList = [self.graph.addEdge(nodeList[i],nodeList[j]) for j in range(nbNodes) for i in range(0,nbNodes)]#j+1, n)]
		tlp.SimpleTest.makeSimple(self.graph)
		viewL = self.graph.getLayoutProperty("viewLayout")
		self.graph.computeLayoutProperty("Random", viewL)
		self.graph.computeLayoutProperty("Circular", viewL)

		for n in self.graph.getNodes():
			viewL[n] *= 10

        return self.graph

    def graphToJSONO(self, graph=0):
	if not graph:
		graph = self.graph
 	vLayout = graph.getLayoutProperty("viewLayout")
    	nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]} for n in graph.getNodes()]}
    	nToI = {nList["nodes"][i]["name"]:i for i in range(len(nList["nodes"]))}
    	eList = {"links":[{"source":nToI[graph.source(e).id], "target":nToI[graph.target(e).id], "value":1} for e in graph.getEdges()]}
    	nList.update(eList)
    	print "dumping: ", json.dumps(nList)
    	return json.dumps(nList)


    def graphToJSON(self, graph=0, properties={}):
	if not graph:
		graph = self.graph
	nList = {}
	eList= {}

	if not properties:
	 	vLayout = graph.getLayoutProperty("viewLayout")
	    	nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]} for n in graph.getNodes()]}
	    	nToI = {nList["nodes"][i]["name"]:i for i in range(len(nList["nodes"]))}
	    	eList = {"links":[{"source":nToI[graph.source(e).id], "target":nToI[graph.target(e).id], "value":1} for e in graph.getEdges()]}
	    	nList.update(eList)
	    	print "dumping: ", json.dumps(nList)
	    	return json.dumps(nList)
	else:
		if 'nodes' in properties:
			nodesProp = properties['nodes']
			propInterface = {}
			print nodesProp
			for k in nodesProp:
				if 'type' in k and 'name' in k:
					if k['type'] == 'bool':
						propInterface[k['name']] = graph.getBooleanProperty(k['name'])
					if k['type'] == 'float':
						propInterface[k['name']] = graph.getDoubleProperty(k['name'])
					if k['type'] == 'string':
						propInterface[k['name']] = graph.getStringProperty(k['name'])
			
			vLayout = graph.getLayoutProperty("viewLayout")
			print propInterface
			#getValue = lambda n, propInterface: {prop:propInterface[prop][n] for prop in propInterface }
			getValue = lambda x: {prop:propInterface[prop][x] for prop in propInterface }
			nList = []
			for n in graph.getNodes():
				v = {"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]}
				v.update(getValue(n))
				nList.append(v)			
	    		nList = {"nodes":nList}
			print nList
		else:
		    	nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]} for n in graph.getNodes()]}

		nToI = {nList["nodes"][i]["name"]:i for i in range(len(nList["nodes"]))}

		if 'edges' in properties:
			edgesProp = properties['edges']
			propInterface = {}
			print edgesProp
			for k in edgesProp:
				if 'type' in k and 'name' in k:
					if k['type'] == 'bool':
						propInterface[k['name']] = graph.getBooleanProperty(k['name'])
					if k['type'] == 'float':
						propInterface[k['name']] = graph.getDoubleProperty(k['name'])
					if k['type'] == 'string':
						propInterface[k['name']] = graph.getStringProperty(k['name'])
			
			vLayout = graph.getLayoutProperty("viewLayout")
			print propInterface
			#getValue = lambda n, propInterface: {prop:propInterface[prop][n] for prop in propInterface }
			getValue = lambda x: {prop:propInterface[prop][x] for prop in propInterface }
			eList = []
			for e in graph.getEdges():
				v = {"source":nToI[graph.source(e).id], "target":nToI[graph.target(e).id], "value":1}
				v.update(getValue(e))
				eList.append(v)			
	    		eList = {"edges":nList}
			print eList
		
		else:
		    	eList = {"links":[{"source":nToI[graph.source(e).id], "target":nToI[graph.target(e).id], "value":1} for e in graph.getEdges()]}
	    		#nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]}.update(getValue(n)) for n in graph.getNodes()]}
			
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
		print postvars.keys()
		graphJSON = ""

		if 'type' in postvars.keys():
			if postvars['type'][0] == 'creation':
		
				if 'graph' in postvars.keys():
					#print postvars['graph'][0]
					graphJSON = json.loads(postvars['graph'][0])

					#if 'json_string' in postvars.keys():
					#	graphJSON = json.loads(postvars['json_string'][0])
					g = self.graphMan.addGraph(graphJSON)
					vL = g.getLayoutProperty("viewLayout")
					g.computeLayoutProperty("FM^3 (OGDF)", vL)
					g = self.graphMan.modifyGraph(g)
					graphJSON = self.graphMan.graphToJSON(g)					
					self.sendJSON(graphJSON)


			if postvars['type'][0] == 'algorithm':
					print 'algo requested'
					
					if 'parameters' in postvars.keys():
						params = postvars['parameters'][0]
						params = json.loads(params)
						if 'type' in params and 'name' in params:
							if params['type'] == 'layout':
								g = self.graphMan.graph
								vL = g.getLayoutProperty("viewLayout")
								g.computeLayoutProperty(params['name'].encode("utf-8"), vL)
								graphJSON = self.graphMan.graphToJSON(g)					
								self.sendJSON(graphJSON)
							if params['type'] == 'float':
								g = self.graphMan.graph
								vM = g.getDoubleProperty("viewMetric")
								g.computeDoubleProperty(params['name'].encode("utf-8"), vM)
								graphJSON = self.graphMan.graphToJSON(g, {'nodes':[{'type':'float', 'name':'viewMetric'}]})					
								self.sendJSON(graphJSON)

			if postvars['type'][0] == 'update':
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
