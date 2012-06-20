
from tulip import *
from GraphHandler import *

class CatalystProjector:
	'''
	this class takes as input a bipartite graph
	and projects it on entities of one type
	projected paths e1 - f - e2 induce edges e1 - e2
	weights on edges e1 - f, f - e2 combine and define
	weights on edges e1 - e2
	
	the class requires that:
	- nodes of the original graph have an "id" attribute (string)
	- nodes of the original graph have a two-value "type" attribute (string)
	- edges have weights (positive real numbers) stored in a 'edgeWeight' property (double)
	
	used to sort out entities, one of these value is used to compute the projected graph
	edges of the resulting graph moreover  will hold an attribute ";" concatenating id's of all
	entities f leading to edge e1 - e2 (under a property names name catalystTypeName)
	'''
	
	def __init__(self, bipartiteGraph, substrateGraph, substrateTypeName = 'substrate', catalystTypeName = 'catalyst'):
		
		self.bipartiteGraph = bipartiteGraph
		self.superGraph = self.bipartiteGraph.getSuperGraph()
		self.substrateGraph = substrateGraph
		self.catalystGraph = None
		self.substrateTypeName = substrateTypeName
		self.catalystTypeName = catalystTypeName
		self.type = self.bipartiteGraph.getStringProperty('type')
		self.ids = self.bipartiteGraph.getStringProperty('rcmnId')
		self.weights = self.bipartiteGraph.getDoubleProperty('edgeWeight')
		self.graphHandler = GraphHandler()
		
	def catalystProjection(self):
		'''
		create catalyst subgraph, insert all necessary nodes
		'''
		selected = self.bipartiteGraph.getBooleanProperty('selected')
		selected.setAllNodeValue(False)
		for n in self.bipartiteGraph.getNodes():
			if self.type[n] == self.catalystTypeName:
				selected[n] = True
		self.catalystGraph = self.superGraph.addSubGraph(selected)
		self.catalystGraph.setName(self.catalystTypeName + 'Projection')

		'''
		assign weights to catalyst nodes
		'''
		catalystIds = self.catalystGraph.getStringProperty('rcmnId')
		catalystWeights = self.catalystGraph.getDoubleProperty('edgeWeight')
		substrateIds = self.substrateGraph.getStringProperty('rcmnId')
		substrateWeights = self.substrateGraph.getDoubleProperty('edgeWeight')
		for e in self.substrateGraph.getEdges():
			catalystList = substrateIds[e].split(';')
			for id in catalystList:
				n = self.graphHandler.findNodeById(id, self.catalystGraph, catalystIds, False)
				catalystIds[n] = id
				catalystWeights[n] += substrateWeights[e]

		'''
		scan catalyst (as attributes of edges in substrate subgraph)
		and accordingly instantiate edges in catalyst subgraph
		assign weights to catalyst edges
		'''
		for e in self.substrateGraph.getEdges():
			catalystList = substrateIds[e].split(';')
			for i in range(len(catalystList)):
				for j in range(i + 1, len(catalystList)):
					n1 = self.graphHandler.findNodeById(catalystList[i], self.catalystGraph, catalystIds, False)
					n2 = self.graphHandler.findNodeById(catalystList[j], self.catalystGraph, catalystIds, False)
					f = self.graphHandler.findEdge(n1, n2, self.catalystGraph, True)
					catalystWeights[f] += substrateWeights[e]
		
