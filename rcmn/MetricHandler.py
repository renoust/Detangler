'''
Created on 14 juin 2012

@author: melancon
'''

from math import sqrt

class MetricHandler:
    '''
    gathers a bunch of methods dealing with metrics
    the idea is to complement the API
    '''

    def __init__(self, graph):
        '''
        Constructor
        '''
        
        self.graph = graph

    def average(self, doubleMetric, which = 'nodes'):
        '''
        accepts nodes, edges or both as second argument
        '''
        average = 0.0
        denominator = 0.0
        
        if (which == 'nodes') or (which == 'both'):
            for n in self.graph.getNodes():
                average += doubleMetric[n]
            denominator += self.graph.numberOfNodes()
        
        if (which == 'edges') or (which == 'both'):
            for e in self.graph.getEdges():
                average += doubleMetric[e]
            denominator += self.graph.numberOfEdges()
        
        return average / denominator
    
    def variance(self, doubleMetric, which = 'nodes'):
        '''
        accepts nodes, edges or both as second argument
        '''
        average = self.average(doubleMetric, which)
        variance = 0.0
        denominator = 0.0
        
        if (which == 'nodes') or (which == 'both'):
            for n in self.graph.getNodes():
                variance += (average - doubleMetric[n]) ** 2
            denominator += self.graph.numberOfNodes()
        
        if (which == 'edges') or (which == 'both'):
            for e in self.graph.getEdges():
                variance += (average - doubleMetric[e]) ** 2
            denominator += self.graph.numberOfEdges()
        
        return variance / denominator
                
    def normalize(self, doubleMetric, which = 'nodes'):
        '''
        assumes the metric already exists
        doubleMetric is a Tulip DoubleMetric object
        send distribution to 0 mean and 1 standDev
        '''
        average = self.average(doubleMetric, which)
        standDev = sqrt(self.variance(doubleMetric, which))
        
        if standDev == 0.0:
            if (which == 'nodes') or (which == 'both'):
                doubleMetric.setAllNodeValue(0.0)
            if (which == 'edges') or (which == 'both'):
                doubleMetric.setAllEdgeValue(0.0)
        else:
            if (which == 'nodes') or (which == 'both'):
                for n in self.graph.getNodes():
                    doubleMetric[n] -= average
                    doubleMetric[n] /= standDev
        
            if (which == 'edges') or (which == 'both'):
                for e in self.graph.getEdges():
                    doubleMetric[e] -= average
                    doubleMetric[e] /= standDev
        
        return True
        
    def rescale(self, doubleMetric, mapInterval, which = 'nodes'):
        '''
        assumes the metric already exists
        doubleMetric is a Tulip DoubleMetric object
        send values from [min, max] to map interval
        '''
        
        homotheticFactor = mapInterval[1] - mapInterval[0]
        translationFactor = mapInterval[0]
        nodeMin = float(doubleMetric.getNodeMin())
        nodeMax = float(doubleMetric.getNodeMax())
        edgeMin = float(doubleMetric.getEdgeMin())
        edgeMax = float(doubleMetric.getEdgeMax())
        
        if (which == 'nodes'):
            min = nodeMin
            max = nodeMax
        elif (which == 'edges'):
            min = edgeMin
            max = edgeMax
        else:
            min = min(nodeMin, edgeMin)
            max = max(nodeMax, edgeMax)
        print 'min ', min, ', max ', max
        if not min == max:
            if (which == 'nodes') or (which == 'both'):
                for n in self.graph.getNodes():
                    doubleMetric[n] -= min
                    doubleMetric[n] /= (max - min)
                    doubleMetric[n] *= homotheticFactor
                    doubleMetric[n] += translationFactor
            if (which == 'edges') or (which == 'both'):
                for e in self.graph.getEdges():
                    doubleMetric[e] -= min
                    doubleMetric[e] /= (max - min)
                    doubleMetric[e] *= homotheticFactor
                    doubleMetric[e] += translationFactor
        
        return True
