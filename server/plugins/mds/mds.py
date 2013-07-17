import numpy as np
from sklearn.manifold import mds
from tulip import *


class MDS():

    def __init__(self, graph, catalystProperty):
        nNodes = graph.numberOfNodes()
        if not nNodes: return
        self.graph = graph
        self.distanceMatrix = [[0]*nNodes for i in range(nNodes)]
        nodeList  = [n for n in graph.getNodes()]
        self.indexToNodes = {}
        for i in range(len(nodeList)-1):
            n1 = nodeList[i]
            set1 = set(catalystProperty[n1].split(';'))
            if i not in self.indexToNodes:
                self.indexToNodes[i] = n1

            for j in range(i+1, len(nodeList)):
                n2 = nodeList[j]
                set2 = set(catalystProperty[n2].split(';'))
                if j not in self.indexToNodes:
                    self.indexToNodes[j] = n2

                inter = set1 & set2
                s0 = len(inter)
                union = set1 | set2
                s1 = len(union)
                

                distance = 1-float(s0)/float(s1)
                self.distanceMatrix[i][j] = distance
                self.distanceMatrix[j][i] = distance



    def sklearn_mds(self):
        mds_clf = mds.MDS(metric=True, n_jobs=3, dissimilarity="precomputed")
        self.distanceMatrix = np.array(self.distanceMatrix)
        #print self.distanceMatrix
        res = mds_clf.fit_transform(self.distanceMatrix)
        #print mds_clf
        #print res
        self.assign(res)
        



    def assign(self, array):
        vL = self.graph.getLayoutProperty("viewLayout")
        for i in range(len(array)):
            coord = tlp.Coord(array[i][0], array[i][1], 0)
            vL[self.indexToNodes[i]] = coord
        return array



