#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import cgi
import json

import sys
sys.path.append("/work/tulip-dev/tulip_3_6_maint-build/release/install/lib")
from tulip import *

sys.path.append("/home/brenoust/Dropbox/OTMedia/lighterPython")
import clusterAnalysisLgt
from graphManager import *
import searchQuery


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
		print "this section should deliver probably the JS of the API"
		if "n" in params.keys():
			print params["n"][0]
			try:
				print "doing silly things with n"
				#self.graphMan.createGraph(int(params["n"][0]))
				#returnJSON = self.graphMan.graphToJSON()
                                #print "this is to return: ",returnJSON

			except:
				print "wrong parameter n"
		else:
                    print "parameter n should be set to integer: ?n=XX"
		
		print "GET parameters: ",params

	self.sendJSON(returnJSON)

    def do_POST(self):
	print "These are the headers: ",self.headers
	ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
	print ctype
	print pdict
	if ctype == 'application/x-www-form-urlencoded':
        	length = int(self.headers.getheader('content-length'))
        	postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
		print postvars.keys()
		graphJSON = ""

		self.handleRequest(postvars)
	if ctype == 'application/octet-stream':
		
		length = int(self.headers.getheader('content-length'))
		f = ""
		try :
			fStr = self.rfile.read(length)
			f = json.loads(fStr)
			#print "gonna print the file:"
			#print fStr
			#print "gonna print the dict:"
			#print json.dumps(f)
		except:
			print 'cannot read input file'

		self.handleFileUpload(json.dumps(f))

		#length = int(self.headers.getheader('content-length'))
        	#postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)


    def handleFileUpload(self, jsonFile):
	self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        #print "this is the original json to return: ",jsonFile
        self.wfile.write(jsonFile)#.encode('utf-8'))
		

    def sendJSON(self, jsonF):
	self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        print "this is to return: ",jsonF
        self.wfile.write(jsonF)

	
    def algorithmRequest(self, request):
	if 'parameters' in request.keys():
		params = request['parameters'][0]
		params = json.loads(params)
		print 'parameters:', params
		if 'type' in params and 'name' in params:
			if params['type'] == 'layout':
				g = self.graphMan.callLayoutAlgorithm(params['name'].encode("utf-8"), params['target'].encode("utf-8"))
				graphJSON = self.graphMan.graphToJSON(g)					
				self.sendJSON(graphJSON)

			if params['type'] == 'float':
				g = self.graphMan.callDoubleAlgorithm(params['name'].encode("utf-8"), params['target'].encode("utf-8"))
				graphJSON = self.graphMan.graphToJSON(g, {'nodes':[{'type':'float', 'name':'viewMetric'}]})					
				self.sendJSON(graphJSON)


    def updateGraphRequest(self, request):
	print "update request: ",request
	graphSelection = json.loads(request['graph'][0]) 
	g = self.graphMan.inducedSubGraph(graphSelection, request['target'][0])
	#g = self.graphMan.modifyGraph(g)
	print 'recieved this list: ',graphSelection
	graphJSON = self.graphMan.graphToJSON(g,{'nodes':[{'type':'string', 'name':'label'}]})
	#graphJSON = self.graphMan.graphToJSON(g)
	#print 'sending this list: ',graphJSON
	self.sendJSON(graphJSON)


    def creationRequest(self, request):
	if 'search' in request.keys():
		print 'search is in request: ',request
		query = request['search'][0]
		g = searchQuery.main(query)
		baseIDP = g.getDoubleProperty('baseID')
		idP = g.getDoubleProperty('id')
		label = g.getStringProperty('label')
		vLabel = g.getStringProperty('viewLabel')
		for n in g.getNodes():
			baseIDP[n] = n.id
			idP[n] = n.id
			label[n] = vLabel[n]

			
		for e in g.getEdges():
			baseIDP[e] = e.id
			idP[e] = e.id

		graphJSON = self.graphMan.graphToJSON(g,{'nodes':[{'type':'string', 'name':'label'}, {'type':'float', 'name':'id'}], 'edges':[{'type':'float', 'name':'id'}, {'type':'string', 'name':'descripteurs'}]})
		self.sendJSON(graphJSON)

	if 'graph' in request.keys():
		#print postvars['graph'][0]
		graphJSON = json.loads(request['graph'][0])

		g = self.graphMan.addGraph(graphJSON)
		self.graphMan.substrate = g
		g = self.graphMan.randomizeGraph(g)
		graphJSON = self.graphMan.graphToJSON(g)					
		self.sendJSON(graphJSON)

    def analysisRequest(self, request):
	selection = 0
	result = 0

	#print 'the request : ',request

	if 'graph' in request:
		selection = json.loads(request['graph'][0])

	if request['target'][0] == 'substrate':
		result = self.graphMan.analyseGraph(selection)
		graphJSON = self.graphMan.graphToJSON(result[0], {'nodes':[{'type':'string', 'name':'label'}], 'data':{'cohesion intensity':result[1], 'cohesion homogeneity':result[2]}})
		#print "Analysis return: "					


	if request['target'][0] == 'catalyst':
		graphJSON = self.graphMan.synchronizeFromCatalyst(selection)
		
	self.sendJSON(graphJSON)



    def handleRequest(self, request):
	if 'type' in request.keys():
		if request['type'][0] == 'creation':
			self.creationRequest(request)

		if request['type'][0] == 'analyse':
			self.analysisRequest(request)

		if request['type'][0] == 'algorithm':
			#print 'algo requested'
			self.algorithmRequest(request)

		if request['type'][0] == 'update':
			self.updateGraphRequest(request)



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
