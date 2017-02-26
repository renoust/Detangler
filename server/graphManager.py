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
#libtulip_dir = "/work/tulip-dev/tulip_3_8-build/release/install/lib/python"
#sys.path.append(libtulip_dir)
#libtulip_dir = "/work/svn/renoust/workspace/tulip_3_6_maint-build/release/install/lib"
#sys.path.append(libtulip_dir)

from tulip import *

# path to custom scripts that perform the analysis
#lgtPython_dir = "/home/brenoust/Dropbox/OTMedia/lighterPython/entanglement" 
#sys.path.append(lgtPython_dir)
import entanglementAnalysisLgt
import entanglementSynchronization

#lgtPython_dir = "/home/brenoust/Dropbox/OTMedia/lighterPython" 
#sys.path.append(lgtPython_dir)
import bipartiteLayout

'''
This class stores the graphs, and performs the manipulations on it.
I guess we want in the future to propose only one graph per session, and maybe store different graphs.
'''
class graphManager():

    root_deprecated = 0
    graph_deprecated = 0
    substrate = 0
    catalyst = {}

    '''
    This method converts a graph to a JSON string, given some parameters:
    graph, the graph to convert (if null, substrate is considered)
    properties, a map of the properties that should be included in the JSON {nodes|links:[{name:xxx,type:yyy}]}
    nodeList, a selection of nodes (array)
    edgeList, a selection of edges (array)
    Returns the new JSON string.

    The method can then restrict the amount of information dumped in the JSON to only what it is passed beforehand.
    Default is 'baseID', 'x', 'y', 'source', 'target'.
    Extra data can be passed through the 'data' member of 'properties'
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

                edgesProp = None
                if 'edges' in properties:
                        edgesProp = properties['edges']
                if 'links' in properties:
                        edgesProp = properties['links']
                if edgesProp:
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
    def inducedSubGraph(self, jsonGraph, target, multiplex_property="descriptors"):        
        nodeList = []
        graphNList = []
        for n in jsonGraph[u'nodes']:
                nodeList.append(n[u'baseID'])

        graph = self.substrate
        if target == 'catalyst':
                graph = self.catalyst[multiplex_property]

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
        
        gNodeList = [n for n in g.getNodes()]
        gEdgeList = [e for e in g.getEdges()]
        
        if graph.numberOfNodes() != len(gNodeList):
            for n in graph.getNodes():
                if n not in gNodeList:
                    graph.delNode(n)
        if graph.numberOfEdges() != len(gEdgeList):
            for e in graph.getEdges():
                if e not in gEdgeList:
                    graph.delEdge(e)
        
        return graph

    def updateLayout(self, jsonGraph, target, multiplex_property="descriptors"):
        
        
        print "updating the layout:"
        print "target: ", target
        print "jsonGraph: ",jsonGraph 
        
        
        nodeList = {}

        for n in jsonGraph[u'nodes']:
                nodeList[n[u'baseID']] = [n[u'x'], n[u'y']]

        graph = self.substrate
        if target == 'catalyst':
                graph = self.catalyst[multiplex_property]
                
        baseIDP = graph.getDoubleProperty("baseID")
        vLayoutP = graph.getLayoutProperty("viewLayout")
        for n in graph.getNodes():
                if baseIDP[n] in nodeList:
                        c = tlp.Coord(nodeList[baseIDP[n]][0], nodeList[baseIDP[n]][1], 0)
                        vLayoutP[n] = c


    '''
    Returns a graph with a randomized layout
    graph, the graph to apply the random layout algorithm to (default is substrate)
    '''
    def randomizeGraph(self, graph=0):
        if not graph:
                graph = self.substrate

        ##### update for tulip-4.10
        #viewL = graph.getLayoutProperty("viewLayout")
        #graph.computeLayoutProperty("Random", viewL)
        layoutDataSet = tlp.getDefaultPluginParameters("Random", graph)
        graph.applyLayoutAlgorithm("Random", layoutDataSet)
        
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
        #typeP = self.substrate.getStringProperty("_type")
        #typeP.setAllNodesValue("substrate")
        #typeP.setAllEdgesValue("substrate")
        return g



    '''
    Analyse a graph (or a selection of a graph) copies it to 'catalyst' and send it
    back together with the corresponding entanglement values.
    jsonGraph, a JSON graph object of a selection of nodes to analyse
    return an array containing [the catalyst graph, entanglement intensity, entanglement homogeneity]
    '''        
    def analyseGraph(self, jsonGraph = 0, multiplex_property = "descriptors", weightProperty = ""):

        graph = self.substrate
        entanglementIntensity = 0
        entanglementHomogeneity = 0
        onlyOneNode = False
        onlySingleEdges = False
        print "in graphManager, the weight property: ",weightProperty

        if jsonGraph:
                nodeList = []
                graphNList = []
                #print 'the selection: ',jsonGraph
                for n in jsonGraph[u'nodes']:
                        nodeList.append(n[u'baseID'])

                baseIDP = self.substrate.getDoubleProperty("baseID")
                for n in self.substrate.getNodes():
                        if baseIDP[n] in nodeList:
                                graphNList.append(n)
                if len(graphNList) > 1:
                        graph = self.substrate.inducedSubGraph(graphNList)

                elif len(graphNList) == 1:
                        onlyOneNode = True
                        print "there is only one node in the selection"

        # this has to be set because of the clusterAnalysis script
        '''
        if True:#not graph.existProperty("descripteurs"):                
                descP = graph.getStringProperty("descripteurs")
                o_descP = graph.getStringProperty(multiplex_property)
                for n in graph.getNodes():
                        descP[n] = o_descP[n]
                        #print 'node ', descP[n]
                for e in graph.getEdges():
                        descP[e] = o_descP[e]
                        #print 'edge ', descP[e]
        '''

        labelList = []

        if not onlyOneNode:                                        
            #c = entanglementAnalysisLgt.EntanglementAnalysis(graph, "descripteurs", _weightProperty = weightProperty)
            c = entanglementAnalysisLgt.EntanglementAnalysis(graph, multiplex_property, _weightProperty = weightProperty)

            if c.catalystGraph.numberOfNodes() > 0:
                resLen = [len(k) for k in c.catalystToEntIndex]
                mainComponent = resLen.index(max(resLen))
                

                entanglementIntensity = float(c.entanglementIntensity[mainComponent])
                entanglementHomogeneity = float(c.entanglementHomogeneity[mainComponent])

                
                ##### update for tulip-4.10
                #vL = c.catalystGraph.getLayoutProperty("viewLayout")
                #c.catalystGraph.computeLayoutProperty("GEM (Frick)", vL)
                layoutDataSet = tlp.getDefaultPluginParameters("GEM (Frick)", c.catalystGraph)
                c.catalystGraph.applyLayoutAlgorithm("GEM (Frick)", layoutDataSet)

                tName = c.catalystGraph.getStringProperty("catalystName")
                label = c.catalystGraph.getStringProperty("label")
                baseID = c.catalystGraph.getDoubleProperty("baseID")
                #occ = c.catalystGraph.getStringProperty("occurence")


                labelToCatalystGraphNode = {}
                labelToCatalystGraphEdge = {}
                # sets the baseID for persistence
                # this should be changed at some point because it is computationnally heavy
                for n in c.catalystGraph.getNodes():
                        label[n] = tName[n]
                        baseID[n] = n.id
                        labelToCatalystGraphNode[tName[n]] = n

                for e in c.catalystGraph.getEdges():
                        baseID[e] = e.id
                        sL = label[c.catalystGraph.source(e)]
                        tL = label[c.catalystGraph.target(e)]
                        edgeLabel = sL+';'+tL
                        if sL > tL:
                            edgeLabel = tL+';'+sL
                        label[e] = edgeLabel
                        labelToCatalystGraphEdge[edgeLabel] = e

                #for n in c.catalystGraph.getNodes():
                #for n in c.catalystGraph.getEdges():
                #    print "baseID:", baseID[n], " label:",label[n]
            
                labelList = [label[n] for n in c.catalystGraph.getNodes()]
                labelEList = [label[e] for e in c.catalystGraph.getEdges()]


                # associates the right baseIDs
                #if self.catalyst:
                if multiplex_property in self.catalyst:

                    labelCatalystP = self.catalyst[multiplex_property].getStringProperty("label")
                    baseIDCatalystP = self.catalyst[multiplex_property].getDoubleProperty("baseID")
                    
                    nbAssign = 0
                    for n in self.catalyst[multiplex_property].getNodes():
                        if labelCatalystP[n] in labelList:
                            baseID[labelToCatalystGraphNode[labelCatalystP[n]]] = baseIDCatalystP[n]
                            nbAssign += 1
                        if nbAssign == len(labelList):
                            break

                    nbAssign = 0
                    for e in self.catalyst[multiplex_property].getEdges():
                        edgeLabel = labelCatalystP[e]
                        if edgeLabel in labelEList:
                            baseID[labelToCatalystGraphEdge[edgeLabel]] = baseIDCatalystP[e] 
                            nbAssign += 1
                        if nbAssign == len(labelEList):
                            break       

                    #baseIDcopy = lambda n: baseID[labelToCatalystGraphNode[labelCatalyst[n]]] = baseIDCatalystP[n] 
                    #[baseIDcopy(n) for n in self.catalyst.getNodes() if labelCatalyst[n] in labelList]        

                #returnGraph = c.typeGraph


                if jsonGraph:
                        return [c.catalystGraph, entanglementIntensity, entanglementHomogeneity]

                #if not self.catalyst:
                if not multiplex_property in self.catalyst:
                        self.catalyst[multiplex_property] = tlp.newGraph()
                else:
                        self.catalyst[multiplex_property].clear()

                tlp.copyToGraph(self.catalyst[multiplex_property], c.catalystGraph)
               

                return [self.catalyst[multiplex_property], entanglementIntensity, entanglementHomogeneity]



            else:
                onlySingleEdges = True



        if onlyOneNode or onlySingleEdges:
            #descP = graph.getStringProperty("descripteurs")
            descP = graph.getStringProperty(multiplex_property)
            returnGraph = tlp.newGraph()
            labelList = []
            if onlyOneNode:
                labelList = descP[graphNList[0]].split(';')
            if onlySingleEdges:
                #descP = graph.getStringProperty("descripteurs")
                descP = graph.getStringProperty(multiplex_property)
                for e in graph.getEdges():
                    labelList.extend(descP[e].split(';'))
                labelList = list(set(labelList))

            if multiplex_property in self.catalyst:
            #if self.catalyst:
                labelCatalystP = self.catalyst[multiplex_property].getStringProperty("label")
                baseIDCatalystP = self.catalyst[multiplex_property].getDoubleProperty("baseID")
                label = returnGraph.getStringProperty("label")
                baseID = returnGraph.getDoubleProperty("baseID")

                nbAssign = 0
                for n in self.catalyst[multiplex_property].getNodes():
                    if labelCatalystP[n] in labelList:
                        nn = returnGraph.addNode()
                        label[nn] = labelCatalystP[n]
                        baseID[nn] = baseIDCatalystP[n]
                        nbAssign += 1
                    if nbAssign == len(labelList):
                        break

            if jsonGraph:
                    return [returnGraph, entanglementIntensity, entanglementHomogeneity]

            if multiplex_property not in self.catalyst:
            #if not self.catalyst:
                    self.catalyst[multiplex_property] = tlp.newGraph()
            else:
                    self.catalyst[multiplex_property].clear()

            return [self.catalyst[multiplex_property], entanglementIntensity, entanglementHomogeneity]




    '''
    Returns a selection of corresponding substrate nodes from a selection of catalyst nodes.
    jsonGraph, a JSON graph object of a selection of nodes to analyse
    In the future we should include the entanglement calculation and send it back too.
    '''
    def synchronizeFromCatalyst(self, jsonGraph, operator, weightProperty=None, multiplex_property="descriptors"):

        nodeList = []
        graphNList = []
        cataList = []

        for n in jsonGraph[u'nodes']:
                nodeList.append(n[u'baseID'])

        baseIDP = self.catalyst[multiplex_property].getDoubleProperty("baseID")
        label = self.catalyst[multiplex_property].getStringProperty("label")

        for n in self.catalyst[multiplex_property].getNodes():
                if baseIDP[n] in nodeList:
                        graphNList.append(n)
                        cataList.append(label[n])

        nList = []
        eList = []

        #### adapting for multiple multiplex
        #descP = self.substrate.getStringProperty("descripteurs")
        #sync = entanglementSynchronization.EntanglementSynchronization(self.substrate, "descripteurs", _weightProperty = weightProperty)
        
        descP = self.substrate.getStringProperty(multiplex_property)
        sync = entanglementSynchronization.EntanglementSynchronization(self.substrate, multiplex_property, _weightProperty = weightProperty)

        syncRes = sync.synchronizeFromCatalyst(cataList, _operator=operator)
        toPrint = [n for n in syncRes['substrate'].getNodes()]
        resLen = [len(k) for k in syncRes['catalystAnalysis'].catalystToEntIndex]
        mainComponent = resLen.index(max(resLen))
        entanglementIntensity = float(syncRes['catalystAnalysis'].entanglementIntensity[mainComponent])
        entanglementHomogeneity = float(syncRes['catalystAnalysis'].entanglementHomogeneity[mainComponent])
        
        return self.graphToJSON(syncRes['substrate'], {'nodes':[{'type':'string', 'name':'label'}], 'data':{'entanglement intensity':entanglementIntensity, 'entanglement homogeneity':entanglementHomogeneity}})
    
   
    def synchronizeLayouts(self, multiplex_property="descriptors"):
        bLResult = bipartiteLayout.draw(self.substrate, self.catalyst[multiplex_property], descPName=multiplex_property)
        #print "layout synchronized ",vectors
        #vector = {k:v for k,v in bLResult.items() if k != "graph"}
        resGraph = bLResult['graph']
        #source of the resultint graph edges are always of type 'substrate'
        jsresgraph = self.graphToJSON(resGraph, {'nodes':[{'type':'string', 'name':'label'}, {'type':'string', 'name':'_type'}]})
        bLResult['graph'] = jsresgraph 
        return self.graphToJSON(self.substrate, {'nodes':[{'type':'float', 'name':'weight'}, {'type':'string', 'name':'label'}, {'type':'float', 'name':'entanglementIndex'}], 'data':bLResult})
        

    '''
    Applies a layout algorithm on a graph and returns it.
    layoutName, the name of the layout algorithm to call
    graphTarget, the string value of the graph onto apply the algorithm (substrate or catalyst)
    '''
    def callLayoutAlgorithm(self, layoutName, graphTarget, multiplex_property="descriptors"):
        g = self.substrate
        if graphTarget == 'catalyst':
                g = self.catalyst[multiplex_property]                

        ##### update for tulip-4.10
        #vL = g.getLayoutProperty("viewLayout")
        #g.computeLayoutProperty(layoutName, vL)
        layoutDataSet = tlp.getDefaultPluginParameters(layoutName, g)
        g.applyLayoutAlgorithm(layoutName, layoutDataSet)

        return g


    '''
    Applies a double (metric) algorithm on a graph and returns it.
    doubleName, the name of the double algorithm to call
    graphTarget, the string value of the graph onto apply the algorithm (substrate or catalyst)
    '''
    def callDoubleAlgorithm(self, doubleName, graphTarget, multiplex_property="descriptors"):
        g = self.substrate
        if graphTarget == 'catalyst':
                g = self.catalyst[multiplex_property]
        
        print 'computing double algorithm: ',doubleName,' on ',graphTarget,' with ' ,g.numberOfNodes(), ' / ', g.numberOfEdges()
        vM = g.getDoubleProperty("viewMetric")
        viewLabel = g.getStringProperty("catalyst")
        ##### update for tulip-4.10
        #g.computeDoubleProperty(doubleName, vM)
        doubleDataSet = tlp.getDefaultPluginParameters(doubleName, g)
        g.applyDoubleAlgorithm(doubleName, doubleDataSet)

        #print "the computation result"
        #print [vM[n] for n in g.getNodes()]
        #print [[e.id, g.source(e), g.target(e)] for e in g.getEdges()]
        print {viewLabel[n]: vM[n] for n in g.getNodes()}
        return g

