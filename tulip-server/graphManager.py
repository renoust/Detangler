#!/usr/bin/env python

'''
 **************************************************************************
 * This class performs most of the graph manipulations.
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 **************************************************************************
'''

import json
import sys

# path to the tulip library
libtulip_dir = "/work/tulip-dev/tulip_3_6_maint-build/release/install/lib"
sys.path.append(libtulip_dir)
libtulip_dir = "/work/svn/renoust/workspace/tulip_3_6_maint-build/release/install/lib"
sys.path.append(libtulip_dir)

from tulip import *

# path to custom scripts that perform the analysis
lgtPython_dir = "/home/brenoust/Dropbox/OTMedia/lighterPython" 
sys.path.append(lgtPython_dir)
import clusterAnalysisLgt


'''
This class stores the graphs, and performs the manipulations on it.
I guess we want in the future to propose only one graph per session, and maybe store different graphs.
'''
class graphManager():

    root_deprecated = 0
    graph_deprecated = 0
    substrate = 0
    catalyst = 0

    '''
    This method converts a graph to a JSON string, given some parameters:
    graph, the graph to convert (if null, substrate is considered)
    properties, a map of the properties that should be included in the JSON {nodes|links:[{name:xxx,type:yyy}]}
    nodeList, a selection of nodes (array)
    edgeList, a selection of edges (array)
    Returns the new JSON string.

    The method can then restrict the amount of information dumped in the JSON to only what it is passed beforehand.
    Default is 'baseID', 'x', 'y', 'source', 'target'.
    Extra data can be passed through the 'data' member of properties
    '''
    def graphToJSON(self, graph=0, properties={}, nodeList=0, edgeList=0):

        if not graph:
                graph = self.substrate

        if not nodeList:
                nodeList = graph.getNodes()

        if not edgeList:
                edgeList = graph.getEdges()

        nList = {}
        eList= {}

        bID = graph.getDoubleProperty("baseID")
        
        if not properties:
                    vLayout = graph.getLayoutProperty("viewLayout")
                    nList = {"nodes":[{"id":n.id,"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]} for n in nodeList]}
                    #nToI = {nList["nodes"][i]["baseID"]:i for i in range(len(nList["nodes"]))}
                    eList = {"links":[{"source":bID[graph.source(e)], "target":bID[graph.target(e)], "value":1, "baseID":bID[e]} for e in edgeList]}
                    nList.update(eList)
                    #print "dumping: ", json.dumps(nList)
                    return json.dumps(nList)
        else:
                if 'nodes' in properties:
                        nodesProp = properties['nodes']
                        propInterface = {}
                        #print nodesProp
                        for k in nodesProp:
                                if 'type' in k and 'name' in k:
                                        if k['type'] == 'bool':
                                                propInterface[k['name']] = graph.getBooleanProperty(k['name'])
                                        if k['type'] == 'float':
                                                propInterface[k['name']] = graph.getDoubleProperty(k['name'])
                                        if k['type'] == 'string':
                                                propInterface[k['name']] = graph.getStringProperty(k['name'])
                        
                        vLayout = graph.getLayoutProperty("viewLayout")
                        #print propInterface
                        #getValue = lambda n, propInterface: {prop:propInterface[prop][n] for prop in propInterface }
                        getValue = lambda x: {prop:propInterface[prop][x] for prop in propInterface }
                        nList = []
                        for n in nodeList:
                                #v = {"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]}
                                v = {"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]}
                                v.update(getValue(n))
                                nList.append(v)                        
                        nList = {"nodes":nList}
                        #print nList
                else:
                        #nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]} for n in graph.getNodes()]}
                        nList = {"nodes":[{"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]} for n in nodeList]}



                #nToI = {nList["nodes"][i]["baseID"]:i for i in range(len(nList["nodes"]))}

                if 'edges' in properties:
                        edgesProp = properties['edges']
                        propInterface = {}
                        #print edgesProp
                        for k in edgesProp:
                                if 'type' in k and 'name' in k:
                                        if k['type'] == 'bool':
                                                propInterface[k['name']] = graph.getBooleanProperty(k['name'])
                                        if k['type'] == 'float':
                                                propInterface[k['name']] = graph.getDoubleProperty(k['name'])
                                        if k['type'] == 'string':
                                                propInterface[k['name']] = graph.getStringProperty(k['name'])                                                
                        
                        vLayout = graph.getLayoutProperty("viewLayout")
                        #print propInterface
                        #getValue = lambda n, propInterface: {prop:propInterface[prop][n] for prop in propInterface }
                        getValue = lambda x: {prop:propInterface[prop][x] for prop in propInterface }
                        eList = []
                        for e in edgeList:
                                v = {"source":bID[graph.source(e)], "target":bID[graph.target(e)], "value":1, "baseID":bID[e]}
                                v.update(getValue(e))
                                #print v
                                #print json.dumps(v)#str(v).decode().encode('utf-8', 'backslashreplace'))
                                eList.append(v)                        
                        eList = {"links":eList}
                        #print eList
                
                else:
                            eList = {"links":[{"source":bID[graph.source(e)], "target":bID[graph.target(e)], "value":1, "baseID":bID[e]} for e in edgeList]}
                            #nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]}.update(getValue(n)) for n in graph.getNodes()]}
                
                #print 'this is nList before appending: ',json.dumps(nList)        
                #print 'this is eList before appending: ',str(eList)        

                nList.update(eList)
                if 'data' in properties.keys():
                    nList.update({'data':properties['data']})
                #print "dumping: ", nList
                #return json.dumps(nList) #json.loads(str(nList))) #.decode().encode('utf-8', 'backslashreplace'))
                return json.dumps(nList)


    '''
    This method applies an inducedSubGraph algorithm to a selection of nodes of a given graph.
    jsonGraph, the JSON graph object of the selection
    target, the graph to target ('substrate' or 'catalyst')
    Returns the induced subgraph
    '''
    def inducedSubGraph(self, jsonGraph, target):        
        nodeList = []
        graphNList = []
        for n in jsonGraph[u'nodes']:
                nodeList.append(n[u'baseID'])

        graph = self.substrate
        if target == 'catalyst':
                graph = self.catalyst

        #print target,' graph: ', [n for n in graph.getNodes()],' ', [e for e in graph.getEdges()]," with ", nodeList

        baseIDP = graph.getDoubleProperty("baseID")
        for n in graph.getNodes():
                if baseIDP[n] in nodeList:
                        graphNList.append(n)

        #self.graph.clear() 
        #sg = self.graph.addSubGraph()
        g = graph.inducedSubGraph(graphNList)
        nList = [n for n in g.getNodes()]
        eList = [e for e in g.getEdges()]

        for n in graph.getNodes():
                if n not in nList:
                        graph.delNode(n)
        
        for e in graph.getEdges():
                if e not in eList:
                        graph.delEdge(e)

        #for n in g.getNodes():
        #        self.graph.addNode(n)
        #for e in g.getEdges():
        #        self.graph.addEdge(e)
        #self.graph = g
        return graph


    '''
    Returns a graph with a randomized layout
    graph, the graph to apply the random layout algorithm to (default is substrate)
    '''
    def randomizeGraph(self, graph=0):
        if not graph:
                graph = self.substrate

        viewL = graph.getLayoutProperty("viewLayout")
        graph.computeLayoutProperty("Random", viewL)
        
        for n in graph.getNodes():
                viewL[n] *= 10
        return graph



    ''' 
    Adds a new graph (copied to substrate) and returns it
    It iterates over the properties that are passed in the JSON file and accordingly sets the tulip
    property interface and values that correspond.
    json, the JSON of the graph to add
    Returns the new graph
    '''
    def addGraph(self, json):
        g = tlp.newGraph()
        
        #for d3.force.layout import
        idToNode = {}
        idIndex = 0

        for n in json[u'nodes']:
                u = g.addNode()
                idToNode[n[u'baseID']] = u

                # here we should add protection for properties automatic load (warning will crash when diff type w/ same name)
                for k in n.keys():
                        prop = 0
                        kType = type(n[k])
                        if kType == int or kType == float:
                                prop = g.getDoubleProperty(k.encode("utf-8"))
                        if kType == str:
                                prop = g.getStringProperty(k.encode("utf-8"))
                        if kType == bool:
                                prop = g.getBooleanProperty(k.encode("utf-8"))
                        if kType == unicode:
                                propU = g.getStringProperty(k.encode("utf-8"))
                                propU[u] = n[k].encode("utf-8")
                                        
                        if prop:
                                prop[u] = n[k]
                if u'id' not in n.keys():
                        prop = g.getDoubleProperty("id")
                        prop[u] = u.id
                
        
        for e in json[u'links']:
                if u'source' in e.keys() and u'target' in e.keys():
                        #print 'edge: ',e
                        v = g.addEdge(idToNode[e[u'source']], idToNode[e[u'target']])
                        #print e
                        for k in e.keys():
                                if k not in [u'source', u'target']:
                                        prop = 0
                                        kType = type(e[k])
                                        #print 'type: ', type(e[k])
                                        if kType == int or kType == float:
                                                prop = g.getDoubleProperty(k.encode("utf-8"))
                                        if kType == str:
                                                prop = g.getStringProperty(k.encode("utf-8"))
                                        if kType == unicode:
                                                propU = g.getStringProperty(k.encode("utf-8"))
                                                propU[v] = e[k].encode("utf-8")
                                        if kType == bool:
                                                prop = g.getBooleanProperty(k.encode("utf-8"))
                                        if prop:
                                                prop[v] = e[k]        

                        if 'id' not in e.keys():
                                prop = g.getDoubleProperty("id")
                                prop[v] = v.id

        #self.root = g #temporary, we should manage sessions and graphIDs
        #self.graph = g
        self.substrate = g
        return g



    '''
    Analyse a graph (or a selection of a graph) copies it to 'catalyst' and send it
    back together with the corresponding cohesion values.
    jsonGraph, a JSON graph object of a selection of nodes to analyse
    return an array containing [the catalyst graph, cohesion intensity, cohesion homogeneity]
    '''        
    def analyseGraph(self, jsonGraph = 0):

        graph = self.substrate
        cohesionIntensity = 0
        cohesionHomogeneity = 0

        if jsonGraph:
                nodeList = []
                graphNList = []
                print 'the selection: ',jsonGraph
                for n in jsonGraph[u'nodes']:
                        nodeList.append(n[u'baseID'])

                baseIDP = self.substrate.getDoubleProperty("baseID")
                for n in self.substrate.getNodes():
                        if baseIDP[n] in nodeList:
                                graphNList.append(n)
                if len(graphNList) > 1:
                        graph = self.substrate.inducedSubGraph(graphNList)



        # this has to be set because of the clusterAnalysis script
        
        if not graph.existProperty("descripteurs"):
                descP = graph.getStringProperty("descripteurs")
                o_descP = graph.getStringProperty("descriptors")
                for n in graph.getNodes():
                        descP[n] = o_descP[n]
                        #print 'node ', descP[n]
                for e in graph.getEdges():
                        descP[e] = o_descP[e]
                        #print 'edge ', descP[e]
                                                
        c = clusterAnalysisLgt.clusterAnalysisLgt(graph)
        cohesionIntensity = float(c.globalCoherence)
        cohesionHomogeneity = float(c.globalCosine)

        vL = c.typeGraph.getLayoutProperty("viewLayout")
        c.typeGraph.computeLayoutProperty("GEM (Frick)", vL)

        tName = c.typeGraph.getStringProperty("typeName")
        label = c.typeGraph.getStringProperty("label")
        baseID = c.typeGraph.getDoubleProperty("baseID")

        # sets the baseID for persistence
        for n in c.typeGraph.getNodes():
                label[n] = tName[n]
                baseID[n] = n.id

        for e in c.typeGraph.getEdges():
                baseID[e] = e.id


        if jsonGraph:
                return [c.typeGraph, cohesionIntensity, cohesionHomogeneity]

        if not self.catalyst:
                self.catalyst = tlp.newGraph()
        else:
                self.catalyst.clear()

        tlp.copyToGraph(self.catalyst, c.typeGraph)

        return [self.catalyst, cohesionIntensity, cohesionHomogeneity]




    '''
    Returns a selection of corresponding substrate nodes from a selection of catalyst nodes.
    jsonGraph, a JSON graph object of a selection of nodes to analyse
    In the future we should include the cohesion calculation and send it back too.
    '''
    def synchronizeFromCatalyst(self, jsonGraph):

        nodeList = []
        graphNList = []
        cataList = []
        print 'the selection: ',jsonGraph
        for n in jsonGraph[u'nodes']:
                nodeList.append(n[u'baseID'])

        baseIDP = self.catalyst.getDoubleProperty("baseID")
        typeName = self.catalyst.getStringProperty("typeName")

        for n in self.catalyst.getNodes():
                if baseIDP[n] in nodeList:
                        graphNList.append(n)
                        cataList.append(typeName[n])

        nList = []
        eList = []

        descP = self.substrate.getStringProperty("descripteurs")
        for n in self.substrate.getNodes():
                dList = descP[n].split(';')
                for d in cataList:
                        if d in dList:
                                nList.append(n)
                                break

        for e in self.substrate.getEdges():
                dList = descP[n].split(';')
                for d in cataList:
                        if d in dList:
                                eList.append(e)
                                break

        return self.graphToJSON(self.substrate, {'nodes':[{'type':'string', 'name':'label'}]}, nList, eList)


    '''
    Applies a layout algorithm on a graph and returns it.
    layoutName, the name of the layout algorithm to call
    graphTarget, the string value of the graph onto apply the algorithm (substrate or catalyst)
    '''
    def callLayoutAlgorithm(self, layoutName, graphTarget):
        g = self.substrate
        if graphTarget == 'catalyst':
                g = self.catalyst                

        vL = g.getLayoutProperty("viewLayout")
        g.computeLayoutProperty(layoutName, vL)
        return g


    '''
    Applies a double (metric) algorithm on a graph and returns it.
    doubleName, the name of the double algorithm to call
    graphTarget, the string value of the graph onto apply the algorithm (substrate or catalyst)
    '''
    def callDoubleAlgorithm(self, doubleName, graphTarget):
        g = self.substrate
        if graphTarget == 'catalyst':
                g = self.catalyst
        
        print 'computing double algorithm: ',g.numberOfNodes(), ' / ', g.numberOfEdges()                

        vM = g.getDoubleProperty("viewMetric")
        g.computeDoubleProperty(doubleName, vM)
        return g

