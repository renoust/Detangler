#!/usr/bin/env python

'''
 **************************************************************************
 * This class provides an http server that waits for JSON formatted orders
 * to operate on graphs, and returns answers unders JSON format too.
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 **************************************************************************
'''

import SimpleHTTPServer
import SocketServer
import cgi
import json
import sys

# this should point to your tulip directory
libtulip_dir = "/work/tulip-dev/tulip_3_6_maint-build/release/install/lib"
sys.path.append(libtulip_dir)
libtulip_dir = "/work/svn/renoust/workspace/tulip_3_6_maint-build/release/install/lib"
sys.path.append(libtulip_dir)
from tulip import *

# custom python scripts for graph and query analysis, might be released soon
lgtPython_dir = "/home/brenoust/Dropbox/OTMedia/lighterPython" 
sys.path.append(lgtPython_dir)
import searchQuery

from graphManager import *


'''
This class handles all the requests given through POST queries
GET queries are also managed but basically do nothing
We might in the future use a different webserver such as 'tornado'
'''
class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    # the graph manager instance allows many pure graph manipulation
    graphMan = graphManager() 

    '''
    This method handles a GET request but doesn't do anything with it
    (it used to create a random graph of n nodes, n argument of the get query)
    '''
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


    '''
    This method handles post queries. The POST content should be a well formatted JSON
    file containing instructions or a file to upload to the server.
    '''
    def do_POST(self):
        #print "These are the headers: ",self.headers
        ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
        #print ctype
        #print pdict

        # handles a graph manipulation request
        if ctype == 'application/x-www-form-urlencoded':
                length = int(self.headers.getheader('content-length'))
                postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                #print postvars.keys()
                graphJSON = ""
                self.handleRequest(postvars)


        # handles a file upload
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



    '''
    Forks any type of graph manipulation request to the right handler
    request, the JSON object of the request
    '''
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



    '''
    For now, a file upload just resend it to the d3 interface as it is, which will treat it.
    We might want to do some file check before anything.
    jsonFile, the file that has been uploaded
    '''
    def handleFileUpload(self, jsonFile):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        #print "this is the original json to return: ",jsonFile
        self.wfile.write(jsonFile)#.encode('utf-8'))
                

    '''
    Sends a json string to the d3 interface.
    jsonF, the JSON formatted answer to send.
    '''    
    def sendJSON(self, jsonF):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        #print "this is to return: ",jsonF
        self.wfile.write(jsonF)


    '''
    Handles an algorithm request, gathers the parameters and calls the algorithm process and send back the updated graph.
    request, the JSON object of the request
    '''        
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



    '''
    Handles an induced subgraph request, gathers the parameters and calls the process and send back the updated graph.
    request, the JSON object of the request
    '''
    def updateGraphRequest(self, request):
        #print "update request: ",request
        graphSelection = json.loads(request['graph'][0]) 
        g = self.graphMan.inducedSubGraph(graphSelection, request['target'][0])
        #g = self.graphMan.modifyGraph(g)
        #print 'recieved this list: ',graphSelection
        graphJSON = self.graphMan.graphToJSON(g,{'nodes':[{'type':'string', 'name':'label'}]})
        #graphJSON = self.graphMan.graphToJSON(g)
        #print 'sending this list: ',graphJSON
        self.sendJSON(graphJSON)


    '''
    Handles a graph creation request. 'search' for a SE query, 'graph' for a tulip graph creation.
    request, the JSON object of the request
    '''
    def creationRequest(self, request):
        # handles a search request, gathers the result and formats the graph in order to send to d3
        if 'search' in request.keys():
                #print 'search is in request: ',request
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

        # creates in tulip a graph sent by d3 (and randomizes its layout just for the show), sends it back
        if 'graph' in request.keys():
                #print postvars['graph'][0]
                graphJSON = json.loads(request['graph'][0])

                g = self.graphMan.addGraph(graphJSON)
                self.graphMan.substrate = g
                g = self.graphMan.randomizeGraph(g)
                graphJSON = self.graphMan.graphToJSON(g)                                        
                self.sendJSON(graphJSON)

    '''
    Handles an analysis of the graph that generates the second graph that is sent to d3.
    Analysis and synchronizations are quite the same, so the parameters will tell the difference.
    The target should be given in the JSON request parameters.
    A synchronization from a substrate selection, will pass a selection of the graph as argument.
    request, the JSON object of the request
    '''
    def analysisRequest(self, request):
        selection = 0
        result = 0

        #print 'the request : ',request

        # get the selection
        if 'graph' in request:
                selection = json.loads(request['graph'][0])

        # request the analysis for the given substrate selection 
        if request['target'][0] == 'substrate':
                result = self.graphMan.analyseGraph(selection)
                graphJSON = self.graphMan.graphToJSON(result[0], {'nodes':[{'type':'string', 'name':'label'}], 'data':{'cohesion intensity':result[1], 'cohesion homogeneity':result[2]}})
                #print "Analysis return: "                                        

        # request the synchronization for the given catalyst selection
        if request['target'][0] == 'catalyst':
                graphJSON = self.graphMan.synchronizeFromCatalyst(selection)
         
        # send back the resulting graph
        self.sendJSON(graphJSON)


'''
The main function launches the HTTP server on a given address and port until it recieves the interruption ^C signal.
'''
def main():
        try:
                server_address = '0.0.0.0'
                server_port = 8085 
                Handler = MyRequestHandler
                server = SocketServer.TCPServer((server_address, server_port), Handler)
                #server = HTTPServer(('', int(port)), MainHandler)
                print 'started httpserver...'
                server.serve_forever()
        except KeyboardInterrupt:
                print '^C received, shutting down server'
                server.socket.close()


# This initializes some tulip variables we need and loads the basic plugins
tlp.initTulipLib()
tlp.loadPlugins()
main()
