
from tulip import *
from MetricHandler import *
from GraphHandler import *

class SubstrateProjector:
	'''
	this class takes as input a bipartite graph
	(typically obtained using a loader class, see KublaiLoader for example)
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
	
	caution: the graph should have been obtained form whatever convenient loader class
	and then needs to be cloned -- the code should operate on the clone graph (new
	entities will be added to he original graph)
	'''
	
	def __init__(self, analysisGraph, substrateTypeName = 'substrate', catalystTypeName = 'catalyst'):
		
		self.superGraph = analysisGraph
		self.bipartiteGraph = analysisGraph.addCloneSubGraph()
		self.bipartiteGraph.setName('bipartiteGraph')
		self.substrateGraph = None
		self.substrateTypeName = substrateTypeName
		self.catalystTypeName = catalystTypeName
		self.type = self.bipartiteGraph.getStringProperty('type')
		self.ids = self.bipartiteGraph.getStringProperty('rcmnId')
		self.weights = self.bipartiteGraph.getDoubleProperty('edgeWeight')
		
		self.graphHandler = GraphHandler()

	def substrateProjection(self):
		selected = self.bipartiteGraph.getBooleanProperty('selected')
		selected.setAllNodeValue(False)
		for n in self.bipartiteGraph.getNodes():
			if self.type[n] == self.substrateTypeName:
				selected[n] = True
		self.substrateGraph = self.superGraph.addSubGraph(selected)
		self.substrateGraph.setName(self.substrateTypeName + 'Projection')
		
		weights = self.substrateGraph.getDoubleProperty('edgeWeight')
		catalystIds = self.substrateGraph.getStringProperty('rcmnId')
		for s1 in self.substrateGraph.getNodes():
			for s2 in self.substrateGraph.getNodes():
				if (not s1.id == s2.id) and (self.graphHandler.findEdge(s1, s2, self.substrateGraph, False) == None):
					catalystSet = self.graphHandler.commonNeighbors(s1, s2, self.bipartiteGraph)
					if len(catalystSet) > 0:
						e = self.substrateGraph.addEdge(s1, s2)
						catalystIds.setEdgeValue(e, self.__catalystListValue__(catalystSet))
						weights[e] = self.__scalarProduct__(s1, s2, catalystSet)

	def __scalarProduct__(self, s1, s2, catalystSet):
		prod = 0.0
		for c in catalystSet:
			e1 = self.graphHandler.findEdge(c, s1, self.bipartiteGraph, False)
			e2 = self.graphHandler.findEdge(c, s2, self.bipartiteGraph, False)
			prod += self.weights[e1] * self.weights[e2]
		return prod

	def __catalystListValue__(self, catalystSet):
		cIds = []
		for c in catalystSet:
			cIds.append(self.ids.getNodeValue(c))
		return ';'.join(cIds)
		
