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



class graphManager():

    root_deprecated = 0
    graph_deprecated = 0
    substrate = 0
    catalyst = 0


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
		if 'data' in properties.keys():
			nList.update({'data':properties['data']})
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
			for n in nodeList:
				#v = {"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]}
				v = {"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]}
				v.update(getValue(n))
				nList.append(v)			
	    		nList = {"nodes":nList}
			print nList
		else:
		    	#nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]} for n in graph.getNodes()]}
		    	nList = {"nodes":[{"x":vLayout[n][0],"y":vLayout[n][1], "baseID":bID[n]} for n in nodeList()]}



		#nToI = {nList["nodes"][i]["baseID"]:i for i in range(len(nList["nodes"]))}

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
			for e in edgeList:
				v = {"source":bID[graph.source(e)], "target":bID[graph.target(e)], "value":1, "baseID":bID[e]}
				v.update(getValue(e))
				eList.append(v)			
	    		eList = {"links":eList}
			print eList
		
		else:
		    	eList = {"links":[{"source":bID[graph.source(e)], "target":bID[graph.target(e)], "value":1, "baseID":bID[e]} for e in edgeList]}
	    		#nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]}.update(getValue(n)) for n in graph.getNodes()]}
		
		print 'this is eList before appending: ',eList	
		print 'this is nList before appending: ',nList	
	    	nList.update(eList)
		if 'data' in properties.keys():
			nList.update({'data':properties['data']})
	    	print "dumping: ", nList
	    	return json.dumps(nList)




    def inducedSubGraph(self, jsonGraph, target):	
	nodeList = []
	graphNList = []
	for n in jsonGraph[u'nodes']:
		nodeList.append(n[u'baseID'])

	graph = self.substrate
	if target == 'catalyst':
		graph = self.catalyst

	print target,' graph: ', [n for n in graph.getNodes()],' ', [e for e in graph.getEdges()]," with ", nodeList

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
	#	self.graph.addNode(n)
	#for e in g.getEdges():
	#	self.graph.addEdge(e)
	#self.graph = g
	return graph


    def randomizeGraph(self, graph=0):
	if not graph:
		graph = self.substrate

	viewL = graph.getLayoutProperty("viewLayout")
	graph.computeLayoutProperty("Random", viewL)
	
	for n in graph.getNodes():
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
		idToNode[n[u'baseID']] = u

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

    def callLayoutAlgorithm(self, layoutName, graphTarget):
	g = self.substrate
	if graphTarget == 'catalyst':
		g = self.catalyst		

	vL = g.getLayoutProperty("viewLayout")
	g.computeLayoutProperty(layoutName, vL)
	return g


    def callDoubleAlgorithm(self, doubleName, graphTarget):
	g = self.substrate
	if graphTarget == 'catalyst':
		g = self.catalyst
	
	print 'computing double algorithm: ',g.numberOfNodes(), ' / ', g.numberOfEdges()		

	vM = g.getDoubleProperty("viewMetric")
	g.computeDoubleProperty(doubleName, vM)
	return g



    #*******************************************************************************************************************************************
    # deprecated area

    def graphToJSON_deprecated(self, graph=0):
	if not graph:
		graph = self.root
 	vLayout = graph.getLayoutProperty("viewLayout")
    	nList = {"nodes":[{"name":n.id,"x":vLayout[n][0],"y":vLayout[n][1]} for n in graph.getNodes()]}
    	nToI = {nList["nodes"][i]["name"]:i for i in range(len(nList["nodes"]))}
    	eList = {"links":[{"source":nToI[graph.source(e).id], "target":nToI[graph.target(e).id], "value":1} for e in graph.getEdges()]}
    	nList.update(eList)
    	print "dumping: ", json.dumps(nList)
    	return json.dumps(nList)

    def createGraph_deprecated(self, nbNodes):
	#deprecated original request	
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

    def modifyGraph_deprecated(self, graph=0):
	if not graph:
		graph = self.substrate

	viewL = graph.getLayoutProperty("viewLayout")
	graph.computeLayoutProperty("Random", viewL)
	
	for n in self.graph.getNodes():
		viewL[n] *= 10
	return graph



    def analyseGraph_deprecated(self, jsonGraph = 0):

	graph = self.substrate
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
			print 'node ', descP[n]
		for e in graph.getEdges():
			descP[e] = o_descP[e]
			print 'edge ', descP[e]
						
	c = clusterAnalysisLgt.clusterAnalysisLgt(graph)

	if not jsonGraph:
		return c.typeGraph

	if not self.catalyst:
		self.catalyst = tlp.newGraph()
	else:
		self.catalyst.clear()

	tlp.copyToGraph(self.catalyst, c.typeGraph)


	# those settings are needed for transmission to d3

	vL = self.catalyst.getLayoutProperty("viewLayout")
	self.catalyst.computeLayoutProperty("GEM (Frick)", vL)

	tName = self.catalyst.getStringProperty("typeName")
	label = self.catalyst.getStringProperty("label")
	baseID = self.catalyst.getDoubleProperty("baseID")

	for n in self.catalyst.getNodes():
		label[n] = tName[n]
		baseID[n] = n.id

	for e in self.catalyst.getEdges():
		baseID[e] = e.id


	return self.catalyst

