from tulip import *
from math import *
from random import *
import os
import sys

#for specific imports as numpy
#sys.path.append("/usr/lib/python2.6/dist-packages/PIL")
#sys.path.append("/usr/lib/python2.6/dist-packages")
#sys.path.append("/work/svn/renoust/python/lighter")
#sys.path.append("C:\Users\melancon\Documents\Dropbox\OTMedia\lighterPython")

import os

dir = "C:\Users\melancon\Documents\Dropbox\OTMedia\lighterPython"
if not os.path.isdir(dir) :
	dir = "/work/svn/renoust/lighterPython"

if not os.path.isdir(dir) :
	dir = "/home/brenoust/Dropbox/OTMedia/lighterPython"

if not os.path.isdir(dir) :
	print "cannot find the required library folder"

import datetime
import numpy as np

from clusterAnalysisLgt import *

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

'''
'''
class graphAnalysisLgt():
	'''
	Initializes some parameters, and starts the analysis
	'''
	def __init__(self, _graph, _descriptorListFile, _clusterProperty):
		starttime = datetime.datetime.now()
		
		self.layoutAlgorithm = "GEM (Frick)"
	
		if _descriptorListFile != "":
			self.fullTypeList = self.readTypeList(_descriptorListFile)
		else:
			self.fullTypeList = set()
			descP = _graph.getStringProperty("descripteurs")
			for n in _graph.getNodes():
				self.fullTypeList.update(descP.getNodeValue(n).split(';'))
			self.fullTypeList = list(self.fullTypeList)
		
		self.analyseGraph = tlp.newSubGraph(_graph.getSuperGraph(), _graph.getName()+" Analysis")
		#self.docGraph = tlp.newSubGraph(self.analyseGraph, "documents")
		self.clusterGraph = tlp.newSubGraph(self.analyseGraph, "clusters")
		self.detailGraph = tlp.newSubGraph(self.analyseGraph, "details")

		currentTime = datetime.datetime.now()  - starttime
		starttime = datetime.datetime.now()
		print "execution1: ",currentTime
		
		#tlp.copyToGraph(self.docGraph, _graph)
		
		currentTime = datetime.datetime.now()  - starttime
		starttime = datetime.datetime.now()
		print "execution1.1: ",currentTime

		clusterProperty = _graph.getDoubleProperty(_clusterProperty)
		minP = clusterProperty.getNodeMin(_graph)
		maxP = clusterProperty.getNodeMax(_graph) +1
		
		currentTime = datetime.datetime.now()  - starttime
		starttime = datetime.datetime.now()
		print "execution1.2: ",currentTime

		self.clusterToNodes = {}
		for c in range(int(minP), int(maxP)):
			self.clusterToNodes[c] = []
		
		currentTime = datetime.datetime.now()  - starttime
		starttime = datetime.datetime.now()
		print "execution1.3: ",currentTime
		
		for n in _graph.getNodes():
			cluster = clusterProperty.getNodeValue(n)
			self.clusterToNodes[int(cluster)].append(n)
			#print clusterToNodes

		currentTime = datetime.datetime.now()  - starttime
		starttime = datetime.datetime.now()
		print "execution1.4: ",currentTime

		currentTime = datetime.datetime.now() - starttime
		starttime = datetime.datetime.now()
		print "execution2: ",currentTime

		
		self.clusterToClusterNode = {} #nodes in the cluster subgraph corresponding to the cluster
		self.clusterToSubGraph = {} #subgraph in the detail subgraph corresponding to the cluster
		self.clusterToTypeList = {}
		
		clusterCount = 0
		for c in self.clusterToNodes.keys():
			#if c >1:
			#	break
			print "handling cluster ",clusterCount
			clusterCount = clusterCount+1
			currentTime = datetime.datetime.now() - starttime
			starttime = datetime.datetime.now()
			print "execution: ",currentTime

			clustercount= clusterCount+1

			self.clusterToClusterNode[c] = self.clusterGraph.addNode()
			cGraph =_graph.inducedSubGraph(self.clusterToNodes[c])
			
			# builds the subgraph hierarchy
			self.clusterToSubGraph[c] = [tlp.newSubGraph(self.detailGraph, "%d"%c)]
			self.clusterToSubGraph[c].append(tlp.newSubGraph(self.clusterToSubGraph[c][0], "Documents"))
			self.clusterToSubGraph[c].append(tlp.newSubGraph(self.clusterToSubGraph[c][0], "Descriptors"))
			self.copyToGraph(self.clusterToSubGraph[c][1], cGraph)
						
			#analyse the graph
			cAnalysis = clusterAnalysisLgt(cGraph, self.fullTypeList)
			
			
			cAnalysis.typeGraph.computeLayoutProperty(self.layoutAlgorithm,cAnalysis.typeGraph.getLayoutProperty("viewLayout"))
			tlp.copyToGraph(self.clusterToSubGraph[c][2], cAnalysis.typeGraph)
			self.clusterToTypeList[c] = cAnalysis.typeList
			title = " ".join(cAnalysis.typeList)
			self.clusterToSubGraph[c][0].setName(title)
			self.clusterToSubGraph[c][0].computeLayoutProperty("Connected Component Packing", self.clusterToSubGraph[c][0].getLayoutProperty("viewLayout"))
			self.clusterGraph.getStringProperty("viewLabel").setNodeValue(self.clusterToClusterNode[c], title)
			self.clusterGraph.getStringProperty("clusterName").setNodeValue(self.clusterToClusterNode[c], title)
			self.clusterGraph.getStringProperty("clusterTypeList").setNodeValue(self.clusterToClusterNode[c], title)
			self.clusterGraph.getDoubleProperty("clusterCoherence").setNodeValue(self.clusterToClusterNode[c], cAnalysis.globalCoherence)
			self.clusterGraph.getDoubleProperty("clusterGraphID").setNodeValue(self.clusterToClusterNode[c], self.clusterToSubGraph[c][0].getId())
			self.clusterGraph.getDoubleProperty("clusterCosine").setNodeValue(self.clusterToClusterNode[c], cAnalysis.globalCosine)			
			self.clusterGraph.getDoubleProperty("dateBegin").setNodeValue(self.clusterToClusterNode[c], cAnalysis.dateBegin)
			self.clusterGraph.getDoubleProperty("dateEnd").setNodeValue(self.clusterToClusterNode[c], cAnalysis.dateEnd)
			self.clusterGraph.getDoubleProperty("numberOfDocuments").setNodeValue(self.clusterToClusterNode[c], cAnalysis.nbDocuments)
			self.clusterGraph.getDoubleProperty("numberOfDocEdges").setNodeValue(self.clusterToClusterNode[c], cAnalysis.nbDocLinks)
			self.clusterGraph.getDoubleProperty("numberOfDescriptors").setNodeValue(self.clusterToClusterNode[c], cAnalysis.nbTypes)
			self.clusterGraph.getDoubleProperty("numberOfDescEdges").setNodeValue(self.clusterToClusterNode[c], cAnalysis.nbTypeLinks)
			self.clusterGraph.getDoubleProperty("documentsDensity").setNodeValue(self.clusterToClusterNode[c], cAnalysis.documentsDensity)
			self.clusterGraph.getDoubleProperty("descriptorsDensity").setNodeValue(self.clusterToClusterNode[c], cAnalysis.descriptorsDensity)
			self.clusterGraph.getLayoutProperty("gravityCenter").setNodeValue(self.clusterToClusterNode[c], tlp.Coord(cAnalysis.gravityCenter[0],cAnalysis.gravityCenter[1],cAnalysis.gravityCenter[2]))
			self.clusterGraph.getBooleanProperty("isComplex").setNodeValue(self.clusterToClusterNode[c], cAnalysis.isComplex)


			#self.detailGraph.createMetaNode(self.clusterToSubGraph[c])
			_graph.delSubGraph(cGraph)
		
		#create links between clusters
		currentTime = datetime.datetime.now() - starttime
		starttime = datetime.datetime.now()
		print "execution after loop: ",currentTime
		
		self.createClusterProximities()

		currentTime = datetime.datetime.now()- starttime 
		starttime = datetime.datetime.now()
		print "execution after building proximities: ",currentTime

		self.dumpToFile("clusterDump.csv")
		currentTime = datetime.datetime.now() - starttime
		starttime = datetime.datetime.now()
		print "execution after file dump: ",currentTime

		self.clusterGraphVisu()
		currentTime =  datetime.datetime.now()- starttime 
		starttime = datetime.datetime.now()
		print "execution after visualisation: ",currentTime

	def copyToGraph(self, target, source):
		for n in source.getNodes():
			target.addNode(n)
		for e in source.getEdges():
			target.addEdge(e)

	def readTypeList(self, path):
		
		wList = []
		with open(path) as f:
		    for line in f:
			wList.extend(line.split())
		
		return wList


	def createClusterProximities(self):
		
		incP = self.clusterGraph.getDoubleProperty("clusterInclusion")
		proxP = self.clusterGraph.getDoubleProperty("clusterProximity")

		for i in range(len(self.clusterToClusterNode.keys())):
			c1 = self.clusterToClusterNode.keys()[i]
			n1 = self.clusterToClusterNode[c1]
			list1 = self.clusterToTypeList[c1]

			for j in range(i+1, len(self.clusterToClusterNode.keys())):
				c2 = self.clusterToClusterNode.keys()[j]
				n2 = self.clusterToClusterNode[c2]
				list2 = self.clusterToTypeList[c2]
				count = sum([1.0 for t in list1 if t in list2])
				inclusion = 0
				if(min(len(list1),len(list2)) >0):
					inclusion = count/min(len(list1),len(list2))
				proximity = 0
				if(max(len(list1),len(list2))>0):
					proximity = count/max(len(list1),len(list2))

				if (inclusion > 0.9 and min(len(list1),len(list2))>1) or proximity > 0.5:
					e = self.clusterGraph.addEdge(n1,n2)
					incP.setEdgeValue(e, inclusion)
					proxP.setEdgeValue(e, proximity)





	def dumpToFile(self, filename):
		
		cId = self.clusterGraph.getDoubleProperty("clusterGraphID")
		cName = self.clusterGraph.getStringProperty("clusterName")
		cList =	self.clusterGraph.getStringProperty("clusterTypeList")
		cCoh = self.clusterGraph.getDoubleProperty("clusterCoherence")
		cCos = self.clusterGraph.getDoubleProperty("clusterCosine")
		cDateB = self.clusterGraph.getDoubleProperty("dateBegin")
		cDateE = self.clusterGraph.getDoubleProperty("dateEnd")
		cNDoc = self.clusterGraph.getDoubleProperty("numberOfDocuments")
		cNDocE = self.clusterGraph.getDoubleProperty("numberOfDocEdges")
		cNDes = self.clusterGraph.getDoubleProperty("numberOfDescriptors")
		cNDesE = self.clusterGraph.getDoubleProperty("numberOfDescEdges")
		cDocD = self.clusterGraph.getDoubleProperty("documentsDensity")
		cDesD = self.clusterGraph.getDoubleProperty("descriptorsDensity")
		cInc = self.clusterGraph.getDoubleProperty("clusterInclusion")
		cProx = self.clusterGraph.getDoubleProperty("clusterProximity")
		cGrav = self.clusterGraph.getLayoutProperty("gravityCenter")

		with open(filename,"w") as f:
			f.write("ID\t[descriptors]\tcoherence\tcosine\tdate begin\tdate end\tn docs\tn docs links\tdocs density\tn descr\tn descr links\tdescr density\tgravity center\t[related cluster/inclusion/proximity]\n")
			for c in self.clusterToClusterNode.values():
				f.write("%d\t"%cId.getNodeValue(c))
				f.write(cName.getNodeValue(c)+"\t")
				f.write("%f\t"%cCoh.getNodeValue(c))
				f.write("%f\t"%cCos.getNodeValue(c))
				f.write("%d\t"%cDateB.getNodeValue(c))
				f.write("%d\t"%cDateE.getNodeValue(c))
				f.write("%d\t"%cNDoc.getNodeValue(c))
				f.write("%d\t"%cNDocE.getNodeValue(c))
				f.write("%f\t"%cDocD.getNodeValue(c))
				f.write("%d\t"%cNDes.getNodeValue(c))
				f.write("%d\t"%cNDesE.getNodeValue(c))
				f.write("%f\t"%cDesD.getNodeValue(c))
				center = cGrav.getNodeValue(c)
				f.write("(%f,%f,%f)\t"%(center[0],center[1],center[2]))

				inOut = []
		
				for cn in self.clusterGraph.getInOutNodes(c):
					e = self.clusterGraph.existEdge(c, cn)
					if e.isValid():
						inOut.append("%d/%f/%f"%(cId.getNodeValue(cn),cInc.getEdgeValue(e),cProx.getEdgeValue(e)))
				f.write(" ".join(inOut))
				f.write("\n")

	def clusterGraphVisu(self):
		cGrav = self.clusterGraph.getLayoutProperty("gravityCenter")
		vLayout = self.clusterGraph.getLayoutProperty("viewLayout")
		nbDocuments = self.clusterGraph.getDoubleProperty("numberOfDocuments")
		clusterCoherence = self.clusterGraph.getDoubleProperty("clusterCoherence")
		clusterCosine = self.clusterGraph.getDoubleProperty("clusterCosine")
		viewSize = self.clusterGraph.getSizeProperty("viewSize")
		viewColor = self.clusterGraph.getColorProperty("viewColor")

		for clusterNode in self.clusterToClusterNode.values():
			
			self.clusterGraph.getIntegerProperty("viewShape").setNodeValue(clusterNode, 14)
			
			minSize = 1.0
			maxSize = 40.0
			maxOcc = nbDocuments.getNodeMax()
			
			nd = nbDocuments.getNodeValue(clusterNode)
			s = 1
			if nd >0:
				s = minSize+(maxSize-minSize)*math.log(nd, maxOcc)
			
			viewSize.setNodeValue(clusterNode, tlp.Size(s,s,0))

			nodeLayout = cGrav.getNodeValue(clusterNode)
			nodeLayout[2] = nd;
			vLayout.setNodeValue(clusterNode, nodeLayout)

			cos = clusterCosine.getNodeValue(clusterNode)
			if abs(cos) > 1.0:
				cos = 1
			
			angle = 0.3+0.7*(2*math.acos(abs(cos)) / math.pi)
			a = angle*255.0
			coh = clusterCoherence.getNodeValue(clusterNode)
			c = tlp.Color(int(255.0*(1.0-coh)), 0, int(255.0*coh), int(a))
			viewColor.setNodeValue(clusterNode, c)
			
			
			'''
			self.clusterGraph.getIntegerProperty("viewShape").setNodeValue(c, 14)
			cSize = self.clusterGraph.getDoubleProperty("numberOfDocuments").getNodeValue(c)
			minSize = 1.0
			maxSize = 40.0
			maxOcc = self.clusterGraph.getDoubleProperty("numberOfDocuments").getNodeMax()
			s = minSize+(maxSize-minSize)*math.log(cSize, maxOcc)
			self.clusterGraph.getSizeProperty("viewSize").setNodeValue(c,tlp.Size(s,s,0))
			
			nodeLayout = cGrav.getNodeValue(c)
			nodeLayout[2] = -cSize*10;
			self.clusterGraph.getLayoutProperty("viewLayout").setNodeValue(c, nodeLayout)

			cCol = tlp.Color(0,0,0,0)
			cCoh = self.clusterGraph.getDoubleProperty("clusterCoherence").getNodeValue(c)
			cCos = self.clusterGraph.getDoubleProperty("clusterCosine").getNodeValue(c)
			if cCos > 0:
				cCol.setR(int(255*cCoh))
				cCol.setB(int(255-255*cCoh))

			cCol.setA(int(255*(0.3+0.7*abs(cCos))))
			self.clusterGraph.getColorProperty("viewColor").setNodeValue(c,cCol)
			'''
		self.clusterGraph.computeLayoutProperty("Fast Overlap Removal", self.clusterGraph.getLayoutProperty("viewLayout"))
				
				
					


		

def main(graph) : 

	location = "/work/data/wordlist_0911_1111"
	details = graph
	for g in graph.getSuperGraph().getSubGraphs():
		if g.getName() == "details":
			details = g
	viewMetric = graph.getDoubleProperty("viewMetric")
	data = tlp.DataSet()
	graph.computeDoubleProperty("Connected Component", viewMetric, data)
	a = graphAnalysisLgt(graph, "", "viewMetric")
	return
	
	if details != graph:
		count=1
		for cluster in details.getSubGraphs():
			timeGraph = graph
			for g in cluster.getSubGraphs():
				if g.getName() == "Time":
					timeGraph = g
			if timeGraph != graph:
				a = graphAnalysis(timeGraph, location, "viewMetric")
				count += 1
			cluster.delAllSubGraphs(timeGraph)
			if count % 10 == 0:
				tlp.saveGraph(graph, "/work/data/tlp/nov_2011_time.tlp")
						

	tlp.saveGraph(graph, "/work/data/tlp/nov_2011_time.tlp")


