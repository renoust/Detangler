from tulip import *


def applyRedraw(graph) : 
    docG = graph
    descG = graph
    for g in docG.getSuperGraph().getSubGraphs():
        if g.getName() == "Descriptors":
            descG = g
    draw(docG, descG, occPName='occurence', catPName="typeName")



def draw(docG, descG, descPName="descripteurs", occPName='weight', catPName = "catalystName") :
    
    occP = descG.getDoubleProperty(occPName)
    typeN = descG.getStringProperty(catPName)
    viewLayoutDescG = descG.getLayoutProperty("viewLayout")
    vLDesc = descG.getStringProperty("viewLabel")
    bIDDesc = descG.getDoubleProperty("baseID")

    bIDDoc = docG.getDoubleProperty("baseID")
    descP = docG.getStringProperty(descPName)    
    vLDoc = docG.getStringProperty("viewLabel")
    viewLayoutDocG = docG.getLayoutProperty("viewLayout")
    
    

    resGraph = tlp.newGraph() #docG.addSubGraph()
    viewLayout = resGraph.getLayoutProperty("viewLayout")
    vLF = resGraph.getStringProperty("viewLabel")
    bID = resGraph.getDoubleProperty("baseID")
    _type = resGraph.getStringProperty("_type")
    skipNodeP = tlp.BooleanProperty(resGraph)
    
    totalWeight = 0    

    descGNToN = {}
    
    for n in descG.getNodes():
        newNode = resGraph.addNode()
        descGNToN[n] = newNode
        c = viewLayoutDescG[n]
        viewLayout[newNode] = tlp.Coord(c[0], c[1], c[2])
        vLF[newNode] = vLDesc[n]
        skipNodeP[newNode] = True
        totalWeight += occP[n]
        bID[newNode] = bIDDesc[n]
        _type[newNode] = "catalyst"
        
    tToN = {typeN[n]: n for n in descG.getNodes()}
    
    
    nToDocGN = {}
    DocGNToN = {}
    for n in docG.getNodes():
        newNode = resGraph.addNode()   
        DocGNToN[n] = newNode
        nToDocGN[newNode] = n
        c = viewLayoutDocG[n]
        viewLayout[newNode] = tlp.Coord(c[0], c[1], c[2])
        vLF[newNode] = vLDoc[n]
        bID[newNode] = bIDDoc[n]
        _type[newNode] = "substrate"

    docNToN = {}
    # storing the catalysts associated to a node's edges
    for n in docG.getNodes():
        if descP[n] != "":
            nodeDescList = frozenset([t for tt in [descP.getEdgeValue(e).split(';') for e in docG.getInOutEdges(n)] for t in tt])
            if len(nodeDescList) == 0:
                nodeDescList = frozenset(descP.getNodeValue(n).split(';'))
            if nodeDescList not in docNToN:
                docNToN[nodeDescList] = []
            docNToN[nodeDescList].append(DocGNToN[n])


    docNToDescN = {}
    descNToDocN = {}
    
    #here the condition is on the weight of a catalyst
    for docN in docNToN:
        for n1 in docNToN[docN]:
            for t in docN:
                if t in tToN:                
                    if occP.getNodeValue(tToN[t]) <= totalWeight/2:
                        resGraph.addEdge(n1, descGNToN[tToN[t]])
            
            if resGraph.deg(n1) == 0:
                for t in docN:
                    if t in tToN:
                        resGraph.addEdge(n1, descGNToN[tToN[t]])
                    
    
    if (tlp.getTulipRelease().split(".")[0] == '3'):        
        dataSet = tlp.getDefaultPluginParameters("LinLog Layout (Noack)", resGraph)
        dataSet["skip nodes"] = skipNodeP
        dataSet["result"] = viewLayout

        ##### update for tulip-4.10
        #resGraph.computeLayoutProperty("LinLog Layout (Noack)", viewLayout, dataSet)
        resGraph.applyLayoutAlgorithm("LinLog Layout (Noack)", dataSet)

    
    if (int(tlp.getTulipRelease().split(".")[0]) > 3):
        dataSet = tlp.getDefaultPluginParameters("LinLog", resGraph)
        dataSet["skip nodes"] = skipNodeP
        dataSet["initial layout"] = viewLayout
        dataSet["result"] = viewLayout

        ##### update for tulip-4.10
        #resGraph.computeLayoutProperty("LinLog", viewLayout, dataSet)
        resGraph.applyLayoutAlgorithm("LinLog", dataSet)
    

    '''
    dataSet = tlp.getDefaultPluginParameters("Anchored GEM (Frick)", resGraph)
    dataSet["skip nodes"] = skipNodeP
    dataSet["initial layout"] = viewLayout
    ##### update for tulip-4.10
    #resGraph.computeLayoutProperty("Anchored GEM (Frick)", viewLayout, dataSet)
    resGraph.applyLayoutAlgorithm("Anchored GEM (Frick)", dataSet)
    '''
    
    if (tlp.getTulipRelease().split(".")[0] == '3'):
        tlp.loadPlugin("/home/brenoust/.Tulip-3.8/plugins/libfastoverlapremoval-3.8.0.so")

    ##### update for tulip-4.10
    #resGraph.computeLayoutProperty("Fast Overlap Removal", viewLayout)
    dataSet = tlp.getDefaultPluginParameters("Fast Overlap Removal", resGraph)
    resGraph.applyLayoutAlgorithm("Fast Overlap Removal", dataSet)

            
    for n in resGraph.getNodes():
            if n in nToDocGN :
                c = viewLayout[n]
                viewLayoutDocG[nToDocGN[n]] = tlp.Coord(c[0], c[1], c[2])
    for e in resGraph.getEdges():
        bID[e] = e.id

    pairDoc = docG.ends(docG.getOneEdge())
    pairDesc = descG.ends(descG.getOneEdge())
    
    docOut = [{'baseID':bIDDoc[n],'x':viewLayoutDocG[n][0],'y':viewLayoutDocG[n][1]} for n in pairDoc]
    descOut = [{'baseID':bIDDesc[n],'x':viewLayoutDescG[n][0], 'y':viewLayoutDescG[n][1]} for n in pairDesc]
    return {"substrate":docOut, "catalyst":descOut, "graph":resGraph}
    
    
    
def main(graph):
    for gg in graph.getSubGraphs():
        if 1:#gg.getId() == 52:
            for g in gg.getSubGraphs():
                if g.getName() == "Documents":
                    applyRedraw(g)
