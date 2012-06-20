# Powered by Python 2.7

# To cancel the modifications performed by the script
# on the current graph, click on the undo button.

# Some useful keyboards shortcuts : 
#   * Ctrl + D : comment selected lines.
#   * Ctrl + Shift + D  : uncomment selected lines.
#   * Ctrl + Space  : run script.
#   * Ctrl + F  : find selected text.
#   * Ctrl + R  : replace selected text.

from tulip import *
from MetricHandler import *
from GraphHandler import *
import json

# the updateVisualization(centerViews = True) function can be called
# during script execution to update the opened views

# the pauseScript() function can also be called to pause the script execution.
# To resume the script execution, you will have to click on the "Run script " button.

# the main(graph) function must be defined 
# to run the script on the current graph


class KublaiLoader:
	
	def __init__(self, graph, fileName):
		
		self.graph = graph
		self.fileName = fileName
		self.type = self.graph.getStringProperty('type')
		self.ids = self.graph.getStringProperty('rcmnId')
		self.weights = self.graph.getDoubleProperty('edgeWeight')
		self.substrate = 'group'
		self.catalyst = 'member'
		self.graphHandler = GraphHandler()
						
	def processFile(self):
		'''
		builds a bipartite graph with edges connecting substrates (documents/grups)
		to catalysts (terms/members) -- substrates interact through catalysts
		
		todo/wishlist: would need to process time data as well (post dates)
		'''
		self.graph.clear()
		
		f = open(self.fileName, "r")
		obj = json.loads(f.read())
		topics = [t for t in obj]
		
		for t in topics:
			self.__processTopic__(t)
		
		mh = MetricHandler(self.graph)
		mh.rescale(self.weights, [1.0, 10.0], 'edges')
		
	def __processTopic__(self, topic):
		idContributor = topic["contributorName"].encode('UTF-8')
		if "groupId" not in topic.keys():
			return None
		idGroup = topic["groupId"].encode('UTF-8')
		content = topic["description"].encode('UTF-8')
		
		nContrib = self.graphHandler.findNodeById(idContributor, self.graph, self.ids, True)
		nGroup = self.graphHandler.findNodeById(idGroup, self.graph, self.ids, True)
		e = self.graphHandler.findEdge(nContrib, nGroup, self.graph)
		self.weights[e] += len(content)			
				
		if "comments" in topic.keys():
			for c in topic["comments"]:
				if self.__processComment__(c, idGroup, nGroup) == None:
					print c
			
	def __processComment__(self, comment, idGroup, nodeGroup):
		idContributor = comment["contributorName"].encode('UTF-8')
		if comment["description"] == None:
			print idGroup
			print idContributor
			return None
		content = comment["description"].encode('UTF-8')

		nContrib = self.graphHandler.findNodeById(idContributor, self.graph, self.ids, True)
		e = self.graphHandler.findEdge(nContrib, nodeGroup, self.graph, True)
		self.weights[e] += len(content)
		return True	
