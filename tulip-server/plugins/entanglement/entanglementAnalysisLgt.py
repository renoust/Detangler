from tulip import *
from math import *
from random import *
import os
import sys

#for specific imports as numpy
#sys.path.append("/usr/lib/python2.6/dist-packages/PIL")
#sys.path.append("/usr/lib/python2.6/dist-packages")
#sys.path.append("C:\Users\melancon\Documents\Dropbox\OTMedia\lighterPython")
#sys.path.append("/home/brenoust/Dropbox/OTMedia/lighterPython")

import os

dir = "C:\Users\melancon\Documents\Dropbox\OTMedia\lighterPython\entanglement"
#if not os.path.isdir(dir) :
#    dir = "/work/svn/renoust/lighterPython"

if not os.path.isdir(dir) :
    dir = "/home/brenoust/Dropbox/OTMedia/lighterPython/entanglement"

if not os.path.isdir(dir) :
    print "cannot find the required library folder"

import numpy as np

import entanglementComputationLgt
reload(entanglementComputationLgt)
#from entanglementComputationLgt import *

'''
Computes the coherence metric from a specifically formatted graph and
also offers the possibility to synchronize selections with a subgraph and its dual
from selecting types in the dual graph.

The graph must be multilayer with each layer of the edge formatted as "nameSimilarity"
where name is the name of the layer (in our case, a descriptor).
The list of all names must contained in a text file specified in RCMN.loadWorcList().

After patching over patches, the code has been poorly redesigned to apply to all 
subgraphs available in the current graph selection.

'''

class EntanglementError(Exception):

    def __init__(self, _message = None, _value = None):
        self.message = _message
        self.value = _value

    def __str__(self):
        errorMessage = "Error while computing the entanglement:\n"
        if self.message:
            errorMessage += self.message+'\n'
        if self.value:
            errorMessage += repr(self.value)

        return errorMessage

'''
                                        TODO: VALIDATE THE ENTANGLEMENT INTENSITY MEASURE!!

'''
class EntanglementAnalysis():
    '''
    Initializes some parameters, and starts the analysis
    '''
    def __init__(self, _substrateGraph, _catalystProperty=None, _catalystSeparator=";", _minCatalystNumber=0, _weightProperty=None, _catalystSubset=[], _constrainSubstrateTopologyFromCatalysts=False, _noEdgeRaiseError=False, _noNodeRaiseError=False):

        self.checkParameters(_substrateGraph, _catalystProperty, _weightProperty, _catalystSubset, _noEdgeRaiseError, _noNodeRaiseError)

        self.constrainSubstrateTopologyFromCatalysts = _constrainSubstrateTopologyFromCatalysts
        
        # the list of descriptors
        self.catalystList = []
        # the raw matrix of co-Weights
        self.rawMatrix = [[]]
        # the probability matrix of co-Weights
        self.cMatrix = [[]]
        
        self.minCatalystNumber = _minCatalystNumber
        self.catalystSeparator = _catalystSeparator

        # data for cluster stats
        self.entanglementIntensity = []
        self.entanglementHomogeneity = []
        self.nbSubstrates = 0.0
        self.nbSubstratesLinks = 0.0
        self.totalWeight = 0.0
        self.catalystToEntIndex = []
        

        # a map from descriptors to their number of Weights in links
        self.catalystToWeight = {}
        self.catalystToWeight = {}
        self.pairToWeight = {}
        self.pairToWeight = {}

        # the graph of descriptors (description graph)
        self.catalystGraph = tlp.newGraph()
        self.catalystName = self.catalystGraph.getStringProperty("catalystName")

        # desciption graph parameters
        self.nbCatalystComponents = 0
        self.catalystComponents = []

        # fills the catalystList
        if len(_catalystSubset)>1:
            self.catalystList = _catalystSubset
        self.getCurrentCatalysts()        

        # initializations
        self.nbCatalysts = len(self.catalystList)
        
        
        #/!\ what do we do if nbCatalysts < 2 ?
        if self.nbCatalysts > 1 and self.totalWeight > 0:

            self.analyse()
            self.setCatalystGraph()                
        else:
            print "catalysts are empty: ",self.nbCatalysts, '/', self.totalWeight
            self.entanglementIntensity = [0.0]
            self.entanglementHomogeneity = [0.0]
            self.nbSubstrates = 0.0
            self.nbSubstratesLinks = 0.0
            self.totalWeight = 0.0
            self.catalystToEntIndex = [{c:0.0 for c in self.catalystList}]
            self.nbCatalystComponents = 0
            #print "the cluster has less than 2 types"



    def checkParameters(self, _substrateGraph, _catalystProperty=None, _weightProperty=None, _catalystSubset=[], _noEdgeRaiseError=False, _noNodeRaiseError=False):
        # the substrate graph
        self.substrateGraph = _substrateGraph
        if not self.substrateGraph:
            raise EntanglementError("in init, substrate graph is None")

        if self.substrateGraph.numberOfNodes() == 0:
            if _noNodeRaiseError:
                raise EntanglementError("in init, substrate graph has no node")

        if self.substrateGraph.numberOfEdges() == 0:
            if _noEdgeRaiseError:
                raise EntanglementError("in init, substrate graph has no edge")


        # the catalyst property attached to the substrate graph
        self.catalystProperty = None

        if not _catalystProperty:
            self.catalystProperty = self.substrateGraph.getStringProperty("catalysts")

        if isinstance(_catalystProperty, str) or isinstance(_catalystProperty, unicode):
            self.catalystProperty = self.substrateGraph.getStringProperty(_catalystProperty)

        if isinstance(_catalystProperty, tlp.StringProperty):
            if self.substrateGraph.existProperty(_catalystProperty.getName()):
                self.catalystProperty = _catalystProperty
            else:
                raise EntanglementError("the catalyst property does not exist in the substrate graph pool", _catalystProperty)

        if not self.catalystProperty:
            raise EntanglementError("in init, catalystProperty cannot be initiated", _catalystProperty)                

        
        
        # the full list of possible catalysts
        if len(_catalystSubset) > 0:
            if isinstance(_catalystSubset[0], str) or isInstance(_catalystSubset[0], unicode):
                self.catalystSubset = _catalystSubset
            else:
                raise EntanglementError("the catalyst subset should be a list of strings or unicode strings")

        # the edge weight property
        self.weightProperty = None

        if isinstance(_weightProperty, str) or isinstance(_weightProperty, unicode):
            if _weightProperty != "" and _weightProperty != "null":
                self.weightProperty = self.substrateGraph.getDoubleProperty(_weightProperty)
            else:
                _weightProperty = ""

        if isinstance(_weightProperty, tlp.DoubleProperty):
            if self.substrateGraph.existProperty(_weightProperty.getName()):
                self.weightProperty = _weightProperty
            else:
                raise EntanglementError("the weight property does not exist in the substrate graph pool", _weightProperty)

        if _weightProperty and not self.weightProperty:
            raise EntanglementError("the weight property is of uncompatible type", _weightProperty)                

        

    '''
    gets the current relevant descriptors by looking for each descriptor in the list 
    whether they exist as properties having at least an edge value>0 in the considered graph
    '''
    def getCurrentCatalysts(self):
        
        if self.weightProperty:
            print 'during analysis, the weight property: ',self.weightProperty
        self.catalystToWeight = {}
        self.pairToWeight = {}
        foundCatalysts = set()

        for e in self.substrateGraph.getEdges():

	    cList = self.catalystProperty[e].split(self.catalystSeparator)
	    
            if len(cList) >= self.minCatalystNumber:

                skipRound = False
                if self.constrainSubstrateTopologyFromCatalysts:
                    containedCatalystFromSubset = 0
                    for c in cList:
                        if c in self.catalystList:
                            containedCatalystFromSubset += 1
                    #print containedCatalystFromSubset, " / ", self.minCatalystNumber
                    if containedCatalystFromSubset < self.minCatalystNumber:
                        skipRound = True

                else:
                    foundCatalysts.update(cList)
                    #print 'found:',foundCatalysts
                
                if not skipRound:

                    delta = 1.0
                    if self.weightProperty:
                        delta = self.weightProperty[e]
                        print "there is a weight property ", delta

                    self.totalWeight += delta

                    for i in range(len(cList)):
                        c1 = cList[i]
                        if c1 not in self.catalystToWeight:
                            self.catalystToWeight[c1] = 0.0
                        self.catalystToWeight[c1] += delta

                        for j in range(i+1, len(cList)):
                            c2 = cList[j]
                            key = frozenset([c1, c2])
                            if key not in self.pairToWeight:
                                self.pairToWeight[key] = 0.0
                            self.pairToWeight[key] += delta
        
        if len(self.catalystList) == 0:        
            self.catalystList = list(foundCatalysts)

        #print "pair to weigth: ", self.pairToWeight

        #--print self.catalystList
        #--print (set(self.catalystList) - set(self.catalystToWeight.keys()))
        print 'the total weight: ', self.totalWeight
        #on voudra peut etre inclure la liste des types dans la structure du cluster?
        #utiliser des stringVector?



    '''
    builds the raw matrix (considering an edge value of a descriptor is either 0 or 1)
    it also fills by the way the map of types to their Weights and helps initializing
    the probability matrix
    '''        
    def buildRawMatrix(self):

        #we should include here the weight managament

        for i in range(self.nbCatalysts):
            cI = self.catalystList[i] 
            nI = self.catalystToWeight[cI]
            self.catalystToWeight[cI] = nI
            self.rawMatrix[i][i] = nI
            self.cMatrix[i][i] = nI

            for j in range(i+1, self.nbCatalysts):
                cJ = self.catalystList[j]
                key = frozenset([cI, cJ])
                nIJ = 0.0
                if key in self.pairToWeight:
                    nIJ = self.pairToWeight[key]
                    self.pairToWeight[key] = nIJ

                self.rawMatrix[i][j] = nIJ
                self.rawMatrix[j][i] = nIJ
                self.cMatrix[i][j] = nIJ
                self.cMatrix[j][i] = nIJ


    '''
    builds the probability matrix of co-Weights of descriptors on links
    rMatrix: the raw matrix to build the probability matrix with
    cMatrix: the probability matrix
    nbCatalysts: the number of involved types
    totalWeight: the number of edges for normalization    
    '''
    def buildCMatrix(self, rMatrix, cMatrix, nbCatalysts):

        tFreq = self.catalystGraph.getDoubleProperty("frequency")
        tFreqStr = self.catalystGraph.getStringProperty("conditionalFrequency")
        for i in range(nbCatalysts):
            cMatrix[i][i] /= self.totalWeight
            cI = self.catalystList[i]
            nI = self.catalystToNode[cI]
            tFreq[nI] = cMatrix[i][i]    
        
        for i in range(nbCatalysts-1):
            cI = self.catalystList[i]
            nI = self.catalystToNode[cI]
                
            for j in range(i+1, nbCatalysts):
                cMatrix[i][j] /= rMatrix[j][j] 
                cMatrix[j][i] /= rMatrix[i][i]
                if cMatrix[i][j] != 0 or cMatrix[j][i] != 0:
                    cJ = self.catalystList[j]
                    nJ = self.catalystToNode[cJ]
                    tFreqStr[self.catalystGraph.existEdge(nI,nJ,False)] = '{"order":["%s","%s"], "values":[%f,%f]}'%(cI,cJ,cMatrix[i][j],cMatrix[j][i])
                    #print ">>>>>>>>>> ",tFreqStr[self.catalystGraph.existEdge(nI,nJ,False)]   


    '''
    builds the graph of descriptors and fills some properties such as descriptors names 
    and labels, and Weights
    gets the number of components of the description graph
    '''
    def buildCatalystGraph(self):

        self.catalystToNode = {}
        
        tLabel = self.catalystGraph.getStringProperty("catalyst")
        tWeight = self.catalystGraph.getDoubleProperty("weight")

        for i in range(self.nbCatalysts):
            nI = self.catalystGraph.addNode()
            cI = self.catalystList[i]
            self.catalystToNode[cI] = nI
            self.catalystName.setNodeValue(nI, cI)
            tLabel.setNodeValue(nI, cI)
            tWeight.setNodeValue(nI, self.rawMatrix[i][i])#self.catalystToWeight[cI])
                        
            
        for i in range(self.nbCatalysts-1):
            cI = self.catalystList[i]
            nI = self.catalystToNode[cI]
            for j in range(i+1, self.nbCatalysts):
                cJ = self.catalystList[j]
                nJ = self.catalystToNode[cJ]
                weight = self.rawMatrix[i][j]
                if weight > 0.0:
                    e = self.catalystGraph.addEdge(nI, nJ)
                    tWeight.setEdgeValue(e,weight)

        #/!\we can also get the list of lists of nodes, or just get the number of nodes
        #self.typeIsConnected = tlp.ConnectedTest.isConnected(self.catalystGraph)
        self.catalystComponents = tlp.ConnectedTest.computeConnectedComponents(self.catalystGraph)
        
                
            

    def analyse(self):

        self.cMatrix = [[0.0]*self.nbCatalysts for x in range(self.nbCatalysts)]
        self.rawMatrix = [[0.0]*self.nbCatalysts for x in range(self.nbCatalysts)]
        

        # creates the raw matrix
        self.buildRawMatrix()
        
        #/!\ detect diagonal blocks (laplacian, Dulmage-Mendelsohn decomposition, build the type graph)
        # creates the descriptors graph
        self.buildCatalystGraph()

        #/!\controls the number connected components
        # if there are more than one connected component

        if len(self.catalystComponents) > 1:
            print "Multiple components analysis"
        else:
            print "Single component analysis"

        #for n in self.catalystGraph.getNodes():
        #    print self.catalystGraph.getStringProperty("catalyst")[n]

        if len(self.catalystComponents) == 1:
            self.singleComponentAnalysis()
        else:
            self.multipleComponentsAnalysis()

        return


        
    # creates the probability matrix if there is only 1 connected component        
    def singleComponentAnalysis(self):
        self.buildCMatrix(self.rawMatrix, self.cMatrix, self.nbCatalysts)#, self.substrateGraph.numberOfEdges())
        entanglement = entanglementComputationLgt.EntanglementComputation(self.catalystList, self.rawMatrix, self.cMatrix)
        self.entanglementIntensity = [entanglement.entanglementIntensity]
        self.entanglementHomogeneity = [entanglement.entanglementHomogeneity]
        self.catalystToEntIndex = [entanglement.entanglementIndices]
        self.isComplex = [entanglement.complexResult]

    def multipleComponentsAnalysis(self):
        #retrouver les paires composants de catalyseur/composants de substrats
        viewLabel = self.catalystGraph.getStringProperty("catalyst")
        for comp in self.catalystComponents:
            if len(comp) > 1:
                #retrieve related nodes
                #compute the associated matrix
                
                catalystSubsetComponent = [viewLabel[n] for n in comp]
                componentAnalysis = EntanglementAnalysis(self.substrateGraph, self.catalystProperty, self.catalystSeparator, self.minCatalystNumber, self.weightProperty, catalystSubsetComponent, True)
                self.entanglementIntensity.extend(componentAnalysis.entanglementIntensity)
                self.entanglementHomogeneity.extend(componentAnalysis.entanglementHomogeneity)
                self.catalystToEntIndex.extend(componentAnalysis.catalystToEntIndex)
            else:
                self.entanglementIntensity.extend([0.0])
                self.entanglementHomogeneity.extend([0.0])
                self.catalystToEntIndex.extend([{viewLabel[c]:0.0 for c in comp}])


    def setCatalystGraph(self):
        self.nbSubstrates = self.substrateGraph.numberOfNodes()
        self.nbSubstratesLinks = self.substrateGraph.numberOfEdges()

        entP = self.catalystGraph.getDoubleProperty("entanglementIndice")
            
        for t in self.catalystList:
            n = self.catalystToNode[t]
            entP.setNodeValue(n, 0.0)
            for comp in self.catalystToEntIndex: 
                if t in comp:
                    entP.setNodeValue(n, comp[t])
           
    
        

        

def main(graph) : 

    print 'foo'
    return



