'''
Created on 15 juin 2012

@author: melancon
'''

class GraphHandler:
    '''
    gathers a bunch of methods dealing with graphs
    the idea is to complement the API
    for specific needs
    this class does not aim to be general nor generic
    '''


    def __init__(self):
        '''
        Constructor
        '''
    
    def findNodeById(self, id, graph, idProperty, create = True):
        '''
        finds a node if it exists,
        if not return a newly created node unless stated otherwise
        '''
        type = graph.getStringProperty('type')
        for n in graph.getNodes():
            if idProperty[n] == id:
                return n
        
        if create:
            n = graph.addNode()
            idProperty[n] = id
            if "Group" in id:
                type[n] = "group"
            else:
                type[n] = "member"
            return n
        else:
            return None
        
    def findEdge(self, node1, node2, graph, create = True):
        '''
        finds an edge if it exists,
        if not return a newly created edge unless stated otherwise
        '''

        e = graph.existEdge(node1, node2)
        if e.isValid():
            return e
        else:
            e = graph.existEdge(node2, node1)
            if e.isValid():
                return e
        
        if create:    
            e = graph.addEdge(node1, node2)
            return e
        else:
            return None

    def commonNeighbors(self, node1, node2, graph):
        s1 = set()
        for n in graph.getInOutNodes(node1):
            s1.add(n)
        s2 = set()
        for n in graph.getInOutNodes(node2):
            s2.add(n)
        return s1 & s2
