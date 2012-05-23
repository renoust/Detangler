import datetime
import math
import sys

#for specific imports as numpy
#sys.path.append("/usr/lib/python2.6/dist-packages/PIL")
#sys.path.append("/usr/lib/python2.6/dist-packages")

import numpy as np


'''
Computes the coherence metric from a specifically formatted graph and
also offers the possibility to synchronize selections with a subgraph and its dual
from selecting types in the dual graph.

The graph must be multilayer with each layer of the edge formatted as "nameSimilarity"
where name is the name of the layer (in our case, a descriptor).
The list of all names must contained in a text file specified in RCMN.loadWordList().

After patching over patches, the code has been poorly redesigned to apply to all 
subgraphs available in the current graph selection.

'''


class coherenceComputationLgt():
	'''
	'''
	def __init__(self, _types, _rawMatrix, _cMatrix):
		'''
		'''
		#the number of types
		self.nbTypes = 0
		#the list of types
		self.typeList = []
		#the map from types to intrication values
		self.intricationValues = {}
		#the map from types to occurence values
		self.occurenceValues = {}
		#the coherence metric (lambda)
		self.coherenceMetric = 0.0
		#the cosine distance from the vector [1...1]
		self.cosineDistance = 0.0
		#the conditionnal probabilities matrix
		self.cMatrix = [[]]
		#the raw occurences matrix
		self.rawMatrix = [[]]

		self.complexResult = False

		#sets the number of types
		self.nbTypes = len(_types)

		#init the matrices
		self.cMatrix = [[0.0]*self.nbTypes for x in range(self.nbTypes)]
		self.rawMatrix = [[0.0]*self.nbTypes for x in range(self.nbTypes)]

		#init the type list
		self.typeList = _types
		
		#fills the matrices and sets the occurences map
		for i in range(self.nbTypes):
			for j in range(self.nbTypes):
				self.cMatrix[i][j] = _cMatrix[i][j]
				self.rawMatrix[i][j] = _rawMatrix[i][j]
			self.occurenceValues[self.typeList[i]] = _rawMatrix[i][i]

		#computes the coherence metric
		#eigenvals, eigenvects = np.linalg.eig(np.transpose(self.cMatrix))
		eigenvals, eigenvects = np.linalg.eig(self.cMatrix)
		maxEigenval = max(eigenvals)
		indexMax = np.argmax(eigenvals)#eigenvals.index(maxEigenval)
		
		self.coherenceMetric = maxEigenval/self.nbTypes
		#print "eigenvalues:",eigenvals
		#print "eigenvect=",eigenvects
		
		#fills the intrication map
		for i in range(self.nbTypes):
			self.intricationValues[self.typeList[i]] = abs(eigenvects[i][indexMax])

		#sets the cosine distance with the [1...1] vector
		sumT = sum(self.intricationValues.values())
		if np.iscomplexobj(self.intricationValues.values()):
			self.complexResult = True
		sqSum = math.sqrt(sum([x*x for x in self.intricationValues.values()]))
		self.cosineDistance = sumT / (sqSum * math.sqrt(self.nbTypes))

