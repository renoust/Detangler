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

import numbers
import numpy as np

import entanglementAnalysisLgt
reload(entanglementAnalysisLgt)
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
'''
class EntanglementSynchronization():
    '''
    Initializes some parameters, and starts the analysis
    '''
    def __init__(self, _substrateGraph, _catalystProperty=None, _catalystSeparator=";", _minCatalystNumber=0, _weightProperty=None, _catalystSubset=[], _constrainSubstrateTopologyFromCatalysts=False):
        self.catalystSubset = []
        self.checkParameters(_substrateGraph, _catalystProperty, _weightProperty, _catalystSubset)
        
        self.constrainSubstrateTopologyFromCatalysts = _constrainSubstrateTopologyFromCatalysts
        
        self.catalystList = []
        
        self.minCatalystNumber = _minCatalystNumber
        self.catalystSeparator = _catalystSeparator





    def checkParameters(self, _substrateGraph, _catalystProperty=None, _weightProperty=None, _catalystSubset=[]):
        # the substrate graph
        self.substrateGraph = _substrateGraph
        if not self.substrateGraph:
            raise EntanglementError("in init, substrate graph is None")

        if self.substrateGraph.numberOfNodes() == 0:
            raise EntanglementError("in init, substrate graph has no node")

        if self.substrateGraph.numberOfEdges() == 0:
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



    def synchronizeFromSubstrate(self, _substrateSubset, _idProperty=None, _inducedSubgraph=False, _uncompleteGraphHandler='REMOVE'):
        #plus simple, appel du calcul sur le sous graphe
        #tester _substrateSubset: liste de noeuds, sous-graphe, liste d'ids
        substrateSubgraph = None
        substrateNodeList = []
        
        if _uncompleteGraphHandler not in ['REMOVE', 'ADD', 'ERROR']:
            raise EntanglementError("_uncompleteGraphHandlerValue should be 'REMOVE' 'ADD' or 'ERROR'", _operator)        

        # a tlp.Graph defines the subset
        if isinstance(_substrateSubset, tlp.Graph):
            #verifier que _substrateSubset est bien un sous graphe de self.substrateGraph
            nodeList = []
            for n in _substrateSubset.getNodes():
                if not self.substrateGraph.isElement(n):
                    raise EntanglementError("Some nodes do not belong to the original substrate graph", _substrateSubset)
                nodeList.append(n)
                
            for e in _substrateSubset.getEdges():
                if not self.substrateGraph.isElement(e):
                    raise EntanglementError("Some edges do not belong to the original substrate graph", _substrateSubset)
                if self.substrateGraph.source(e) not in nodeList or self.substrateGraph.target(e) not in nodeList:
                    if _uncompleteGraphHandler == 'ERROR':
                        raise EntanglementError("Some edges are not connected to a pair of nodes", _substrateSubset)
                    elif _uncompleteGraphHandler == 'ADD':
                        if self.substrateGraph.source(e) not in nodeList:
                            nodeList.append(self.substrateGraph.source(e))
                            _substrateSubset.addNode(self.substrateGraph.source(e))
                        if self.substrateGraph.target(e) not in nodeList:
                            nodeList.append(self.substrateGraph.target(e))
                            _substrateSubset.addNode(self.substrateGraph.target(e))
                    elif _uncompleteGraphHandler == 'REMOVE':
                        _substrateSubset.delEdge(e)

                    #we can add an option to discard those edges or add up some nodes?
            
            substrateSubgraph = _substrateSubset            
            substrateNodeList = [n for n in substrateSubgraph.getNodes()]
        

        # a list of nodes (or ids) defines the subset (should we be able to give a list of edges as well?)
        elif isinstance(_substrateSubset, list) and len(_substrateSubset)>0:

            if isinstance(_idProperty, str) or isinstance(_idProperty, unicode):
                if not self.substrateGraph.existProperty(_idProperty):
                    raise EntanglementError("The given property for Ids does not belong to the original substrate graph", _idProperty)

                idType = graph.getProperty(_idProperty).getTypename()

                if idType == "string":
                    _idProperty = self.substrateGraph.getStringProperty(_idProperty)
                elif idType == "double":
                    _idProperty = self.substrateGraph.getDoubleProperty(_idProperty)
                else:
                    raise EntanglementError("The given property for Ids is of no matching type", [_idProperty, idType])

            if isinstance(_substrateSubset[0], tlp.node):
                for n in _substrateSubset:
                    if not self.substrateGraph.isElement(n):
                        raise EntanglementError("Some nodes do not belong to the original substrate graph", _substrateSubset)
                substrateNodeList = _substrateSubset

            elif isinstance(_substrateSubset[0], numbers.Number):
                if not _idProperty and not isinstance(_substrateSubset[0], float):
                    idToNode = {n.id:n for n in self.substrateGraph.getNodes()}
                    for i in _substrateSubset:
                        if not i in idToNode:
                            raise EntanglementError("The node do not belong to the original substrate graph", i)
                        substrateNodeList.append(idToNode[i])

                elif isinstance(_idProperty, tlp.DoubleProperty):
                    if not self.substrateGraph.existProperty(_idProperty.getName()):
                        raise EntanglementError("The property does not belong to the original substrate graph", _idProperty)
                    idToNode = {_idProperty[n]:n for n in self.substrateGraph.getNodes()}
                    if len(idToNode) != self.substrateGraph.numberOfNodes():
                        raise EntanglementError("Multiple instances of the same id(s), right property?", _idProperty)

                    for i in _substrateSubset:
                        if not i in idToNode:
                            raise EntanglementError("The node do not belong to the original substrate graph", i)
                        substrateNodeList.append(idToNode[i])
                else:
                    raise EntanglementError("'Float' ids with wrong type of property", [_substrateSubset, _idProperty])


            elif isinstance(_substrateSubset[0], str) or isinstance(_substrateSubset[0], unicode):
                if not isinstance(_idProperty, tlp.StringProperty):
                    raise EntanglementError("'String' ids with wrong type of property", [_substrateSubset, _idProperty])

                if not self.substrateGraph.existProperty(_idProperty.getName()):
                    raise EntanglementError("The property does not belong to the original substrate graph", _idProperty)

                idToNode = {_idProperty[n]:n for n in self.substrateGraph.getNodes()}
                if len(idToNode) != self.substrateGraph.numberOfNodes():
                    raise EntanglementError("Multiple instances of the same id(s), right property?", _idProperty)

                for i in _substrateSubset:
                    if not i in idToNode:
                        raise EntanglementError("The node do not belong to the original substrate graph", i)
                    substrateNodeList.append(idToNode[i])

            else:
                raise EntanglementError("Cannot handle ids type",_substrateSubset)

            _inducedSubgraph = True

        else:
            raise EntanglementError("Cannot handle subset type, should be graph or list",_substrateSubset)
            
        
        if _inducedSubgraph:
            substrateSubgraph = self.substrateGraph.inducedSubgraph(substrateNodeList)

        subsetAnalysis = entanglementAnalysisLgt.EntanglementAnalysis(substrateSubgraph, self.catalystProperty, self.catalystSeparator, self.minCatalystNumber, self.weightProperty, self.catalystSubset, self.constrainSubstrateTopologyFromCatalysts)
        return {'catalystAnalysis':subsetAnalysis}    
        
        
    def synchronizeFromCatalyst(self, _catalystSubset, _inducedSubgraph=False, _twoStepAnalysis=False, _operator='OR'):
        
        #self.substrateGraph.delAllSubGraphs()

        if _operator not in ['AND', 'OR']:
            raise EntanglementError("Operator _operator value should be 'AND' or 'OR'", _operator)

        #appel du calcul a partir du sous graph concernant ces catalyseurs
        #parametrage (limiter a l'ensemble?)
        #1. retrouver tous les substrats concernes par le sous ensemble de catalyseurs
        #2. mesurer l'intrication sur ce sous ensemble de substrats limite au sous ensemble de catalyseurs
        #3. mesurer l'intrication du substrat avec tous leurs catalyseurs
        
        #on suppose que les catalyseurs sont fournis dans une liste en l'etat, on verra plus tard pour la souplesse
        #on va commencer par un 'ou' logique des catalyseurs sur les noeuds
        substrateSubgraph = None
        subsetAnalysis = None
        secondAnalysis = None
        nodeList = []
        edgeList = []

        
        for n in self.substrateGraph.getNodes():
            cList = self.catalystProperty[n].split(self.catalystSeparator)
            if _operator == 'OR':
                for c in _catalystSubset:
                    if c in cList:
                        nodeList.append(n)
                        break
            elif _operator == 'AND':
                containmentTest = [c in cList for c in _catalystSubset]
                if False not in containmentTest:
                    nodeList.append(n)
        
        if _inducedSubgraph:
            substrateSubgraph = self.substrateGraph.inducedSubgraph(nodeList)
        else:
            for e in self.substrateGraph.getEdges():
                cList = self.catalystProperty[e].split(self.catalystSeparator)
                if _operator == 'OR':
                    for c in _catalystSubset:
                        if c in cList:
                            edgeList.append(e)
                            break
                elif _operator == 'AND':
                    containmentTest = [c in cList for c in _catalystSubset]
                    if False not in containmentTest:
                        nodeList.append(e)
            
            subgraphSelector = self.substrateGraph.getLocalBooleanProperty("_entanglementSelector")
            for n in nodeList:
                subgraphSelector[n] = True
            for e in edgeList:
                s,t = self.substrateGraph.ends(e)
                if subgraphSelector[s] == True and subgraphSelector[t] == True:
                    subgraphSelector[e] = True
                
            
            substrateSubgraph = self.substrateGraph.addSubGraph(subgraphSelector)
            if self.substrateGraph.existLocalProperty("_entanglementSelector"):
                self.substrateGraph.delLocalProperty("_entanglementSelector")
            if substrateSubgraph.existLocalProperty("_entanglementSelector"):
                substrateSubgraph.delLocalProperty("_entanglementSelector")

        if substrateSubgraph:
            subsetAnalysis = entanglementAnalysisLgt.EntanglementAnalysis(substrateSubgraph, self.catalystProperty, self.catalystSeparator, self.minCatalystNumber, self.weightProperty, _catalystSubset, self.constrainSubstrateTopologyFromCatalysts)

            if _twoStepAnalysis:
                secondAnalysis = entanglementAnalysisLgt.EntanglementAnalysis(substrateSubgraph, self.catalystProperty, self.catalystSeparator, self.minCatalystNumber, self.weightProperty, self.catalystSubset, self.constrainSubstrateTopologyFromCatalysts)
        return {'substrate': substrateSubgraph, 'catalystAnalysis':subsetAnalysis, 'secondAnalysis':secondAnalysis}

def main(graph) : 

    print 'foo'
    return



