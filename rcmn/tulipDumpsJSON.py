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
        fileName = "cluster1.json"
	#chapeau =  graph.getStringProperty("chapeau")
	#date =  graph.getIntegerProperty("date")
	#dateString =  graph.getStringProperty("dateString")
	descripteurs =  graph.getStringProperty("descripteurs")
	titre_propre =  graph.getStringProperty("titre_propre")
	viewLayout =  graph.getLayoutProperty("viewLayout")

	nodeList = {"nodes":[{"id":n.id, "label":titre_propre[n], "descriptors":descripteurs[n], "x":viewLayout[n][0], "y":viewLayout[n][1]} for n in graph.getNodes()]}
	edgeList = {"links":[{"id":e.id, "source":graph.ends(e)[0].id, "target":graph.ends(e)[1].id, "descriptors":descripteurs[e]} for e in graph.getEdges()]}		

	nodeList.update(edgeList)
	print json.dumps(nodeList)
	
	f = open("/work/kublai/d3/"+fileName, "w")
	f.write(json.dumps(nodeList))
	f.close()
