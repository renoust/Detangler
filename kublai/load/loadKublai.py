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
import json

# the updateVisualization(centerViews = True) function can be called
# during script execution to update the opened views

# the pauseScript() function can also be called to pause the script execution.
# To resume the script execution, you will have to click on the "Run script " button.

# the main(graph) function must be defined 
# to run the script on the current graph

def main(graph) :
	
	graph.clear()
	
	viewBorderColor =  graph.getColorProperty("viewBorderColor")
	viewBorderWidth =  graph.getDoubleProperty("viewBorderWidth")
	viewColor =  graph.getColorProperty("viewColor")
	viewFont =  graph.getStringProperty("viewFont")
	viewFontSize =  graph.getIntegerProperty("viewFontSize")
	viewLabel =  graph.getStringProperty("viewLabel")
	viewLabelColor =  graph.getColorProperty("viewLabelColor")
	viewLabelPosition =  graph.getIntegerProperty("viewLabelPosition")
	viewLayout =  graph.getLayoutProperty("viewLayout")
	viewMetaGraph =  graph.getGraphProperty("viewMetaGraph")
	viewRotation =  graph.getDoubleProperty("viewRotation")
	viewSelection =  graph.getBooleanProperty("viewSelection")
	viewShape =  graph.getIntegerProperty("viewShape")
	viewSize =  graph.getSizeProperty("viewSize")
	viewSrcAnchorShape =  graph.getIntegerProperty("viewSrcAnchorShape")
	viewSrcAnchorSize =  graph.getSizeProperty("viewSrcAnchorSize")
	viewTexture =  graph.getStringProperty("viewTexture")
	viewTgtAnchorShape =  graph.getIntegerProperty("viewTgtAnchorShape")
	viewTgtAnchorSize =  graph.getSizeProperty("viewTgtAnchorSize")
	descP = graph.getStringProperty("descripteurs")
	nbSimP = graph.getDoubleProperty("nbSimilarities")
	titreP = graph.getStringProperty("titre_propre")
	f = open("/work/data/kublai/ning-groups-anonymized.json", "r")
	obj = json.loads(f.read())
	groups = [g for g in obj]
	#for g in groups:
	#	print g[u'members']
		
	
	gToMembers = {g[u'id'].encode('UTF-8'):g[u"members"] for g in groups}
	gToNodes = {}
	gToDesc = {}
	
	for g in gToMembers:
		n = graph.addNode()
		gToNodes[g] = n
		descList = [m[u"contributorName"].encode('UTF-8') for m in gToMembers[g]]
		descP[n] = ";".join(descList)
		titreP[n] = g
		gToDesc[g] = descList
	
	for i in range(len(gToDesc)):
		g1 = gToDesc.keys()[i]
		s1 = set(gToDesc[g1])
		for j in range(i, len(gToDesc)):
			g2 = gToDesc.keys()[j]
			s2 = set(gToDesc[g2])
			
			inter = s1 & s2
			
			if len(inter)>10:
				e = graph.addEdge(gToNodes[g1], gToNodes[g2])
				descP[e] = ";".join(inter)
				