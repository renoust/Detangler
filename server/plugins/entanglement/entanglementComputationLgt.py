import datetime
import math
import sys

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


class EntanglementComputation():
    '''
    '''
    def __init__(self, _catalysts, _rawMatrix, _cMatrix):
        '''
        '''
        #the number of types
        self.nbCatalysts = 0
        #the list of types
        self.catalystList = []
        #the map from catalysts to entanglement indices
        self.entanglementIndices = {}
        #the map from types to occurrence values
        self.occurrenceValues = {}
        #the coherence metric (lambda)
        self.entanglementIntensity = 0.0
        #the cosine distance from the vector [1...1]
        self.entanglementHomogeneity = 0.0
        #the conditionnal probabilities matrix
        self.cMatrix = [[]]
        #the raw occurrences matrix
        self.rawMatrix = [[]]

        self.complexResult = False

        #sets the number of types
        self.nbCatalysts = len(_catalysts)
        #print "The types involved:",
        #print _catalysts

        #init the matrices
        self.cMatrix = [[0.0]*self.nbCatalysts for x in range(self.nbCatalysts)]
        self.rawMatrix = [[0.0]*self.nbCatalysts for x in range(self.nbCatalysts)]

        #init the type list
        self.catalystList = _catalysts

        #self.computeMetrics()
        
        #def computeMetrics(self):
        #fills the matrices and sets the occurrences map
        for i in range(self.nbCatalysts):
            for j in range(self.nbCatalysts):
                self.cMatrix[i][j] = _cMatrix[i][j]
                self.rawMatrix[i][j] = _rawMatrix[i][j]
            self.occurrenceValues[self.catalystList[i]] = _rawMatrix[i][i]


        #print "The matrices: "
        #print self.rawMatrix
        #print self.cMatrix


        #computes the coherence metric
        #eigenvals, eigenvects = np.linalg.eig(np.transpose(self.cMatrix))
        eigenvals, eigenvects = np.linalg.eig(self.cMatrix)
        maxEigenval = max(eigenvals.real)
        indexMax = np.argmax(eigenvals)#eigenvals.index(maxEigenval)
        #print "The eigen values: ",eigenvals
        #print "Quotient: ",maxEigenval, " / ",self.nbCatalysts
        self.entanglementIntensity = maxEigenval/self.nbCatalysts
        #print "The intensity: ", self.entanglementIntensity

        #print "eigenvalues:",eigenvals
        #print "eigenvect=",eigenvects
        
        #fills the intrication map
        for i in range(self.nbCatalysts):
            self.entanglementIndices[self.catalystList[i]] = abs(eigenvects[i][indexMax].real)

        #sets the cosine distance with the [1...1] vector
        sumT = sum(self.entanglementIndices.values())
        if np.iscomplexobj(self.entanglementIndices.values()):
            self.complexResult = True
        sqSum = math.sqrt(sum([x*x for x in self.entanglementIndices.values()]))
        self.entanglementHomogeneity = abs(sumT / (sqSum * math.sqrt(self.nbCatalysts)))

