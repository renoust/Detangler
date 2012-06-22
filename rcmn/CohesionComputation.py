
from tulip import *
import math
import numpy as np

class CohesionComputation:
	'''
	this class takes as input a weighted graph
	builds the corresponding Burt-Schott matrices
	and computes the cohesion index for each node,
	network intensity and homogeneity
	
	the resulting matrix have a size equal to the number
	of nodes in the network
	each node gets assigned a cohesion value stored in a metric
	(doubleProperty) named cohesion
	
	caution: the graph on which the classe operates needs to be connected
	otherwise raises division by zero exception
	'''
	
	def __init__(self, graph, weightProperty):
		self.graph = graph
		self.weights = weightProperty
		self.ids = self.graph.getStringProperty('rcmnId')
		self.cohesionMetric = self.graph.getDoubleProperty('cohesion')
		self.networkIntensity = 0.0
		self.networkHomogeneity = 0.0

		self.BurtMatrix = [[0.0] * self.graph.numberOfNodes() for x in range(self.graph.numberOfNodes())]
		self.rawMatrix = [[0.0] * self.graph.numberOfNodes() for x in range(self.graph.numberOfNodes())]

	def __buildRawMatrix__(self):
		i = 0
		nodeHash = {}
		for n in self.graph.getNodes():
			self.rawMatrix[i][i] = self.weights[n]
			nodeHash[n] = i
			i += 1
		
		for e in self.graph.getEdges():
			p = nodeHash[self.graph.source(e)]
			q = nodeHash[self.graph.target(e)]
			self.rawMatrix[p][q] = self.weights[e]
			self.rawMatrix[q][p] = self.weights[e]

	def __buildBurtMatrix__(self):
		for i in range(self.graph.numberOfNodes()):
			for j in range(self.graph.numberOfNodes()):
				self.BurtMatrix[i][j] = float(self.rawMatrix[i][j]) / float(self.rawMatrix[j][j])

	def computeCohesion(self):
		self.__buildRawMatrix__()
		self.__buildBurtMatrix__()
		
		eigenvals, eigenvects = np.linalg.eig(np.transpose(self.BurtMatrix))
		maxEigenval = max(eigenvals)
		indexMax = np.argmax(eigenvals) #eigenvals.index(maxEigenval)
		
		self.networkIntensity = float(maxEigenval) / float(self.graph.numberOfNodes())
		
		i = 0
		for n in self.graph.getNodes():
			self.cohesionMetric[n] = abs(eigenvects[i][indexMax])
			i += 1

		#sets the cosine distance with the [1...1] vector
		scalarProd = 0.0
		norm = 0.0
		for n in self.graph.getNodes():
			scalarProd += self.cohesionMetric[n]
			norm += self.cohesionMetric[n] ** 2			
		norm = math.sqrt(norm)
		
		if np.iscomplexobj(scalarProd):
			self.complexResult = True
			print 'Complex numbers'
			
		self.networkHomogeneity = scalarProd / (norm * math.sqrt(self.graph.numberOfNodes()))

