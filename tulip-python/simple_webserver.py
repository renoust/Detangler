#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import cgi

import sys
sys.path.append("/work/tulip-dev/tulip_3_6_maint-build/release/install/lib")
from tulip import *


class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
	print self.path
	paramStr = self.path.split('?')[1]
	params = {}
	if len(paramStr) > 1:
		params = cgi.parse_qs(paramStr, True, True)
		if "n" in params.keys():
			print params["n"][0]
			try:
				createGraph(int(params["n"][0]))
			except:
				print "wrong parameter n"
		else:
			print "parameter n should be set to integer: ?n=XX"
		print params
	return
        #if self.path == '/':
        #    self.path = '/simplehttpwebpage_content.html'
        #return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)



def createGraph(nbNodes):
	g = tlp.newGraph()
	nodeList = [g.addNode() for i in range(nbNodes)]
	edgeList = [g.addEdge(nodeList[i],nodeList[j]) for j in range(nbNodes) for i in range(0,nbNodes)]#j+1, n)]
	print nodeList
	print edgeList
	tlp.SimpleTest.makeSimple(g)
	print [e for e in g.getEdges()]
	viewL = g.getLayoutProperty("viewLayout")
	for n in g.getNodes():
		print viewL[n]
	g.computeLayoutProperty("GEM (Frick)", viewL)

	for n in g.getNodes():
		print viewL[n]
	

	
		

def main():
	try:
		Handler = MyRequestHandler
		server = SocketServer.TCPServer(('0.0.0.0', 8080), Handler)
		#server = HTTPServer(('', int(port)), MainHandler)
		print 'started httpserver...'
		server.serve_forever()
	except KeyboardInterrupt:
		print '^C received, shutting down server'
		server.socket.close()

#Handler = MyRequestHandler
#server = SocketServer.TCPServer(('0.0.0.0', 8080), Handler)

#server.serve_forever()
tlp.initTulipLib()
tlp.loadPlugins()
main()
