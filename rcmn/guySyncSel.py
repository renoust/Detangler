# -*- coding: ISO-8859-1 -*-

from tulip import *
import sys
#sys.path.append("/work/svn/renoust/lighterPython")
#sys.path.append("C:\Users\melancon\Documents\Dropbox\OTMedia\lighterPython")
#sys.path.append("/home/brenoust/Dropbox/OTMedia/lighterPython")

import os

dir = "C:\Users\melancon\Documents\Dropbox\OTMedia\lighterPython"
if not os.path.isdir() :
	dir = "/work/svn/renoust/lighterPython"

if not os.path.isdir() :
	dir = "/home/brenoust/Dropbox/OTMedia/lighterPython"

if not os.path.isdir() :
	print "cannot find the required library folder"

from clusterAnalysisLgt import *

class guySyncSel():
	def __init__(self, graph):
		self.graph = graph
		#tlp.Algorithm.__init__(self, context)
		#tlp.BooleanAlgorithm.__init__(self, context)
		
		#self.addStringCollectionParameter("Descriptors Selection","Where to look for the descriptors","Documents Links;Documents Nodes;Documents Links and Nodes")
		#self.addStringCollectionParameter("Documents Selection","What to look for with the documents","From Nodes;From Links;Shared in Nodes;Shared in Links")


	def check(self):
		# This method is called before applying the algorithm on the input graph.
		# You can perform some precondition checks here.
		# See comments in the run method to know how to access to the input graph.
		
		if self.graph.getName() == "Descriptors":
			self.descGraph = self.graph
			brothers = self.graph.getSuperGraph().getSubGraphs()
			self.docGraph = 0
			for s in brothers:
				if s.getName() == "Documents":
					self.docGraph = s
			if self.docGraph:
				return (True, "Ok")
				
		if self.graph.getName() == "Documents":
			self.docGraph = self.graph
			brothers = self.graph.getSuperGraph().getSubGraphs()
			self.descGraph = 0
			for s in brothers:
				if s.getName() == "Descriptors":
					self.descGraph = s
			if self.descGraph:
				return (True, "Ok")

		return (False, "Wrong graph")
		# Must return a tuple (boolean, string). First member indicates if the algorithm can be applied
		# and the second one can be used to provide an error message
		return (True, "Ok")

	def compute(self, graph, secondRound):
		#print "calling compute"
		
		
		#self.descGraph = graph

		self.brewerScale = [tlp.Color(255, 255, 229), tlp.Color(255, 247, 188), tlp.Color(254, 227, 145), tlp.Color(254, 196, 79), tlp.Color(254, 153, 41), tlp.Color(236, 112, 20), tlp.Color(204, 76, 2), tlp.Color(153, 52, 4), tlp.Color(102, 37, 6)]

		viewColorDoc = self.docGraph.getColorProperty("viewColor")
		viewColorDesc = self.descGraph.getColorProperty("viewColor")
		viewColorBcpDoc = self.docGraph.getColorProperty("viewColorBcp")
		viewColorBcpDesc = self.descGraph.getColorProperty("viewColorBcp")
		viewBorderColorDoc = self.docGraph.getColorProperty("viewBorderColor")
		viewBorderColorDesc = self.descGraph.getColorProperty("viewBorderColor")
		viewBorderWidthDoc = self.docGraph.getDoubleProperty("viewBorderWidth")
		viewBorderWidthDesc = self.descGraph.getDoubleProperty("viewBorderWidth")
		viewLayoutDoc = self.docGraph.getLayoutProperty("viewLayout")
		viewLayoutDesc = self.descGraph.getLayoutProperty("viewLayout")
		viewLabelDoc = self.docGraph.getStringProperty("viewLabel")
		viewLabelDesc = self.descGraph.getStringProperty("viewLabel")
		labelDoc = self.docGraph.getStringProperty("titre_propre")
		labelDesc = self.descGraph.getStringProperty("typeName")


		
		basicNode = tlp.Color(125,164,200,50)
		basicEdge = tlp.Color(229,206,160,50)
		basicBorder = tlp.Color(0,0,0,255)
		basicWidth = 0
		basicDepth = 0

		for n in self.docGraph.getNodes():
			viewColorDoc.setNodeValue(n, viewColorBcpDoc.getNodeValue(n))
			viewBorderColorDoc.setNodeValue(n, basicBorder)
			viewBorderWidthDoc.setNodeValue(n, basicWidth)
			pos = viewLayoutDoc.getNodeValue(n)
			pos[2] = basicDepth
			viewLayoutDoc.setNodeValue(n, pos)
			viewLabelDoc[n] = ""#labelDoc[n]
			
		for e in self.docGraph.getEdges():
			viewColorDoc.setEdgeValue(e, viewColorBcpDoc.getEdgeValue(e))
			#viewBorderColorDoc.setEdgeValue(e, basicBorder)
			viewBorderWidthDoc.setEdgeValue(e, basicWidth)
		
		for n in self.descGraph.getNodes():
			viewColorDesc.setNodeValue(n, viewColorBcpDesc.getNodeValue(n))
			viewBorderColorDesc.setNodeValue(n, basicBorder)
			viewBorderWidthDesc.setNodeValue(n, basicWidth)
			pos = viewLayoutDesc.getNodeValue(n)
			pos[2] = basicDepth
			viewLayoutDesc.setNodeValue(n, pos)
			viewLabelDesc[n] = ""#labelDesc[n]
		
		for e in self.descGraph.getEdges():
			viewColorDesc.setEdgeValue(e, viewColorBcpDesc.getEdgeValue(e))
			#viewBorderColorDesc.setEdgeValue(e, basicBorder)
			viewBorderWidthDesc.setEdgeValue(e, basicWidth)
		


		#if self.docGraph.getName() == "Documents":
		if graph.getName() == "Descriptors":
			#self.descGraph = graph
			
			selectionType = "Documents Links"#self.dataSet["Descriptors Selection"] .getCurrentString()
		
			typeName = self.descGraph.getStringProperty("typeName")
			descSel = self.descGraph.getBooleanProperty("viewSelection")
		
			selectedDesc = []
			selectedNodes = []
		
			typeS = False
			typeN = ""
			for n in self.descGraph.getNodes():
				typeS = descSel.getNodeValue(n)
				typeN = typeName.getNodeValue(n)
			
				if typeS and typeN != "":
					selectedDesc.append(typeN)
					selectedNodes.append(n)
			
			if not len(selectedDesc):

				basicNode = tlp.Color(125,164,200,150)
				basicEdge = tlp.Color(229,206,160,150)
				basicBorder = tlp.Color(0,0,0,255)
				basicWidth = 0
				basicDepth = 0

				for n in self.docGraph.getNodes():
					viewColorDoc.setNodeValue(n, viewColorBcpDoc.getNodeValue(n))
					viewBorderColorDoc.setNodeValue(n, basicBorder)
					viewBorderWidthDoc.setNodeValue(n, basicWidth)
					pos = viewLayoutDoc.getNodeValue(n)
					pos[2] = basicDepth
					viewLayoutDoc.setNodeValue(n, pos)
					viewLabelDoc[n] = labelDoc[n]
					
				for e in self.docGraph.getEdges():
					viewColorDoc.setEdgeValue(e, viewColorBcpDoc.getEdgeValue(e))
					#viewBorderColorDoc.setEdgeValue(e, basicBorder)
					viewBorderWidthDoc.setEdgeValue(e, basicWidth)

				for n in self.descGraph.getNodes():
					viewColorDesc.setNodeValue(n, viewColorBcpDesc.getNodeValue(n))
					viewBorderColorDesc.setNodeValue(n, basicBorder)
					viewBorderWidthDesc.setNodeValue(n, basicWidth)
					pos = viewLayoutDesc.getNodeValue(n)
					pos[2] = basicDepth
					viewLayoutDesc.setNodeValue(n, pos)
					viewLabelDesc[n] = labelDesc[n]
					
				for e in self.descGraph.getEdges():
					viewColorDesc.setEdgeValue(e, viewColorBcpDesc.getEdgeValue(e))
					#viewBorderColorDesc.setEdgeValue(e, basicBorder)
					viewBorderWidthDesc.setEdgeValue(e, basicWidth)


				return True

			docSel = self.docGraph.getBooleanProperty("viewSelection")
			docSel.setAllNodeValue(False)
			docSel.setAllEdgeValue(False)
		
			for n in selectedNodes:
				descSel.setNodeValue(n,True)
		
			#selectionType = self.dataSet["Descriptors Selection"] .getCurrentString()
			#print selectionType
			if selectionType == "Documents Links":
				itMax = self.docGraph.numberOfEdges()
			if selectionType == "Documents Nodes":
				itMax = self.docGraph.numberOfNodes()
			if selectionType == "Documents Links and Nodes":
				itMax = self.docGraph.numberOfEdges() + self.docGraph.numberOfNodes()
			
			itCur = 0
			descP = self.docGraph.getStringProperty("descripteurs")
			
			if selectionType == "Documents Links" or selectionType == "Documents Links and Nodes":
			
				#self.pluginProgress.progress(itCur, itMax)
				itCur = itCur + 1
				for e in self.docGraph.getEdges():
					dList = descP[e].split(";")
					for d in selectedDesc:
						#dSimilarity = self.docGraph.getDoubleProperty(d+"Similarity")	
						#if (docSel.getEdgeValue(e) == False and dSimilarity.getEdgeValue(e) > 0):
						if (docSel.getEdgeValue(e) == False and d in dList):
							nodeIn = self.docGraph.source(e)
							nodeOut = self.docGraph.target(e)
							docSel.setNodeValue(nodeIn, True)
							docSel.setNodeValue(nodeOut, True)
							docSel.setEdgeValue(e, True)
						
							break;

			if selectionType == "Documents Nodes" or selectionType == "Documents Links and Nodes":

				figures = [0,1,2,3,4,5,6,7,8,9]
				#self.pluginProgress.progress(itCur, itMax)
				itCur = itCur + 1
			
				
				for n in self.docGraph.getNodes() :
					if not docSel.getNodeValue(n) :
					#if not self.booleanResult.getNodeValue(n) :
						descList = descP.getNodeValue(n).replace("'",";").replace("-","")
						descList = descList.split(";")
						for i in range(len(descList)):
							word = descList[i]
							if word != "" and word[0] in figures:
								descList[i] = "_"+word
						for d in descList:
							if d in selectedDesc:
								docSel.setNodeValue(n,True)
								#print True
								break;
								
								
		#if self.docGraph.getName() == "Descriptors":
		if graph.getName() == "Documents":
			
			#docGraph = self.docGraph
			#self.descGraph = self.docGraph
			#self.docGraph = graph
			
			selectionType = "From Links" #self.dataSet["Documents Selection"] .getCurrentString()

			descP = self.docGraph.getStringProperty("descripteurs")
			selection = self.docGraph.getBooleanProperty("viewSelection")
			nDescList = []
			eDescList = []
			figures = [0,1,2,3,4,5,6,7,8,9]
			
			for n in selection.getNodesEqualTo(True, self.docGraph) :
				#if not docSel.getNodeValue(n) :
					#if not self.booleanResult.getNodeValue(n) :
				descList = descP.getNodeValue(n).replace("'",";").replace("-","").split(";")
				for i in range(len(descList)):
					word = descList[i]
					if word != "" and word[0] in figures:
						descList[i] = "_"+word
				nDescList.extend(descList)
			nDescList = set(nDescList)
			
			if selectionType == "From Links" or selectionType == "Shared in Links":
				for e in selection.getEdgesEqualTo(True, self.docGraph) :
					dList = descP[e].split(";")
					if len(nDescList) == len(eDescList):
						break;
					for d in nDescList:
						if not d in eDescList:
							#pSim = self.docGraph.getDoubleProperty(d+"Similarity")
							#if pSim.getEdgeValue(e) > 0:
							if d in dList:
								eDescList.append(d)
			
			typeName = self.descGraph.getStringProperty("typeName")
			descSel = self.descGraph.getBooleanProperty("viewSelection")
			
			for n in self.descGraph.getNodes():
				descSel.setNodeValue(n, False)

			for e in self.descGraph.getEdges():
				descSel.setEdgeValue(e, False)

			if selectionType == "From Nodes":
				for n in self.descGraph.getNodes():
					if not descSel.getNodeValue(n):
						cType = typeName.getNodeValue(n)
						if cType in nDescList:
							descSel.setNodeValue(n, True)
						

			if selectionType == "From Links":
				for n in self.descGraph.getNodes():
					if not descSel.getNodeValue(n):
						cType = typeName.getNodeValue(n)
						if cType in eDescList:
							descSel.setNodeValue(n, True)
							

			if selectionType == "Shared in Links":
				typeToEdges = {}
				for d in eDescList:
					typeToEdges[d] = []
					
				for e in selection.getEdgesEqualTo(True, self.docGraph) :
					dList = descP[e].split(";")
					for d in eDescList:
						#dSim = self.docGraph.getDoubleProperty(d+"Similarity")
						#if dSim.getEdgeValue(e)>0:
						if d in dList:
							typeToEdges[d].append(e)
							
				for e in self.descGraph.getEdges():
					s = self.descGraph.source(e)
					t = self.descGraph.target(e)
					sType = typeName.getNodeValue(s)
					tType = typeName.getNodeValue(t)
					
					if sType in eDescList and tType in eDescList:
						sList = typeToEdges[sType]
						tList = typeToEdges[tType]
						for d in sList:
							if d in tList:
								descSel.setNodeValue(s, True)
								descSel.setNodeValue(t, True)
								descSel.setEdgeValue(e, True)
								break;
								
			if selectionType == "Shared in Nodes":
				typeToNodes = {}
				for d in nDescList:
					typeToNodes[d] = []
				
				for n in selection.getNodesEqualTo(True, self.docGraph) :
					descList = descP.getNodeValue(n)
					#print descList.decode("UTF-8","replace")
					#print descList.encode("UTF-8","replace")
					descList = descList.replace("'",";").replace("-","").split(";")
					for i in range(len(descList)):
						word = descList[i]
						if word != "" and word[0] in figures:
							descList[i] = "_"+word
					for d in descList:
						if d in nDescList:
							typeToNodes[d].append(n)
					
				#print sys.getdefaultencoding()
				#print typeToNodes
				
				for e in self.descGraph.getEdges():
					s = self.descGraph.source(e)
					t = self.descGraph.target(e)
					sType = typeName.getNodeValue(s)
					tType = typeName.getNodeValue(t)
					
					if sType in nDescList and tType in nDescList:
						sList = typeToNodes[sType]
						tList = typeToNodes[tType]
						for d in sList:
							if d in tList:
								descSel.setNodeValue(s, True)
								descSel.setNodeValue(t, True)
								descSel.setEdgeValue(e, True)
								break;
		
		
		
		brothers = graph.getSuperGraph().getSubGraphs()
		docGraph = 0
		descGraph = 0
		for s in brothers:
			if s.getName() == "Descriptors":
				descGraph = s
			if s.getName() == "Documents":
				docGraph = s
				
		viewS = descGraph.getBooleanProperty("viewSelection")
		typeNP = descGraph.getStringProperty("typeName")

		descList = [typeNP.getNodeValue(n) for n in descGraph.getNodes() if viewS.getNodeValue(n)]
				
		viewSDoc = docGraph.getBooleanProperty("viewSelection")
		viewSDesc = descGraph.getBooleanProperty("viewSelection")
		tmpGraph = docGraph.inducedSubGraph([n for n in docGraph.getNodes() if viewSDoc.getNodeValue(n)])
		
		tmpDescGraph = descGraph.inducedSubGraph([n for n in descGraph.getNodes() if viewSDesc.getNodeValue(n)])
		
		
		c = clusterAnalysisLgt(tmpGraph, descList)
		print "DESCLIST:",descList
		
		newNodeColor = tlp.Color(255,0,0,255)
		if c.nbTypeComponents == 1:
			#k=int((1-c.globalCoherence)*255)
			#newNodeColor[0] = k
			#newNodeColor[1] = k
			#newNodeColor[2] = k
			#newNodeColor[3] = 255
			k = int(c.globalCoherence*8.999)
			newNodeColor = self.brewerScale[k]
		
		newBorderWidth = 2
		newDepth = 100
		if secondRound:
			newDepth = 50
		newBorderColor = tlp.Color(0,150,150,255)#tlp.Color(0,0,0,255)
	
		#if not secondRound:
		#	newBorderColor = tlp.Color(0,150,150,255)
		
		
		for n in tmpGraph.getNodes():
			viewColorDoc.setNodeValue(n, newNodeColor)
			viewBorderWidthDoc.setNodeValue(n,newBorderWidth)
			viewBorderColorDoc.setNodeValue(n,newBorderColor)
			pos = viewLayoutDoc.getNodeValue(n)
			pos[2] = newDepth
			viewLayoutDoc.setNodeValue(n, pos)
			viewLabelDoc[n] = labelDoc[n]
				
		for e in tmpGraph.getEdges():
			viewColorDoc.setEdgeValue(e, newNodeColor)
			#viewBorderWidthDoc.setEdgeValue(e,newBorderWidth)
			viewBorderColorDoc.setEdgeValue(e,newBorderColor)
		
		
		
		if secondRound:
			viewSDoc.setAllNodeValue(False)
			viewSDoc.setAllEdgeValue(False)
			
				
		if graph.getName() == "Descriptors":
			strCol = tlp.StringCollection()
			strCol.push_back("From Links")
			strCol.setCurrent("From Links")
			#self.dataSet["Documents Selection"] = strCol
			#self.compute(docGraph, True)
		

		if secondRound:
			newBorderColor = tlp.Color(0,0,0,255)
		
		
		
		for n in tmpDescGraph.getNodes():
			viewColorDesc.setNodeValue(n, newNodeColor)
			viewBorderWidthDesc.setNodeValue(n,newBorderWidth)
			viewBorderColorDesc.setNodeValue(n,newBorderColor)
			#viewSDesc.setNodeValue(n,False)
			pos = viewLayoutDesc.getNodeValue(n)
			pos[2] = newDepth
			viewLayoutDesc.setNodeValue(n, pos)
			viewLabelDesc[n] = labelDesc[n]
		
		for e in tmpDescGraph.getEdges():
			viewColorDesc.setEdgeValue(e, newNodeColor)
			viewBorderWidthDesc.setEdgeValue(e,newBorderWidth)
			#viewBorderColorDoc.setEdgeValue(e,newBorderColor)
			#viewSDesc.setEdgeValue(e,False)
			
			
		viewSDesc.setAllNodeValue(False)
		viewSDesc.setAllEdgeValue(False)

		if len(descList) == 0:
			basicNode = tlp.Color(125,164,200,150)
			basicEdge = tlp.Color(229,206,160,150)
			basicBorder = tlp.Color(0,0,0,255)
			basicWidth = 0
			basicDepth = 0

			for n in self.docGraph.getNodes():
				viewColorDoc.setNodeValue(n, viewColorBcpDoc.getNodeValue(n))
				viewBorderColorDoc.setNodeValue(n, basicBorder)
				viewBorderWidthDoc.setNodeValue(n, basicWidth)
				pos = viewLayoutDoc.getNodeValue(n)
				pos[2] = basicDepth
				viewLayoutDoc.setNodeValue(n, pos)
				viewLabelDoc[n] = labelDoc[n]
				
			for e in self.docGraph.getEdges():
				viewColorDoc.setEdgeValue(e, viewColorBcpDoc.getEdgeValue(e))
				#viewBorderColorDoc.setEdgeValue(e, basicBorder)
				viewBorderWidthDoc.setEdgeValue(e, basicWidth)

			for n in self.descGraph.getNodes():
				viewColorDesc.setNodeValue(n, viewColorBcpDesc.getNodeValue(n))
				viewBorderColorDesc.setNodeValue(n, basicBorder)
				viewBorderWidthDesc.setNodeValue(n, basicWidth)
				pos = viewLayoutDesc.getNodeValue(n)
				pos[2] = basicDepth
				viewLayoutDesc.setNodeValue(n, pos)
				viewLabelDesc[n] = labelDesc[n]
				
			for e in self.descGraph.getEdges():
				viewColorDesc.setEdgeValue(e, viewColorBcpDesc.getEdgeValue(e))
				#viewBorderColorDesc.setEdgeValue(e, basicBorder)
				viewBorderWidthDesc.setEdgeValue(e, basicWidth)
		
		
		
		docGraph.delSubGraph(tmpGraph)
		descGraph.delSubGraph(tmpDescGraph)
		
		print "\nREPORT:\n"
		print descList
		print "coherence ", c.globalCoherence
		print "cosine ",c.globalCosine
		print "gamma_i ",c.typeToIntrications
		print "raw Matrix ",c.rawMatrix
		print "c Matrix ",c.cMatrix
		
		print "nb components ", c.nbTypeComponents
		print c.typeIsConnected
		print c.typeList





	def run(self):
		#self.pluginProgress.setComment("Looking for elements from "+self.graph.getName())
		#self.pluginProgress.showPreview(False)
		#print "starting edges"
		self.check()
		self.compute(self.graph, False)
		
		
		#print c.typeList
		
		# The graph on which the algorithm is applied can be accessed through
		# the "graph" class attribute (see documentation of class tlp.Graph).

		# The parameters provided by the user are stored in a Tulip DataSet 
		# and can be accessed through the "dataSet" class attribute
		# (see documentation of class tlp.DataSet).

		# The method must return a boolean indicating if the algorithm
		# has been successfully applied on the input graph.
		#self.pluginProgress.stop()
		return True

def main(graph):
	c = guySyncSel(graph)
	c.run()

