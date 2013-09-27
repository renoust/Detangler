#!/usr/bin/env python


import tornado.ioloop
import tornado.web
import cgi
import json
import sys
import random as rd
import os
import pandas as pd
import numpy as np
from Cython.Shadow import typeof
from StringIO import StringIO

from tulip import *

from graphManager import *
from session import *

globalSessionMan = TPSession()


class importDF():
    
    dicoDF = {}
    currentDF = pd.DataFrame() 
    listNodes = []
    listEdges = []
  
    def buildDataFrame(self, csvFile,fileName):
        fi = csvFile
        df =pd.DataFrame()
        try:
            df = pd.read_csv(StringIO(str(fi)))
            self.dicoDF[str(fileName)] = []
            self.currentDF = df
            self.dicoDF[str(fileName)].append(df)
            print '----------------------------------------------------------------------------'
            print self.dicoDF
        except:
            print 'gold on the ceiling'
        return df
    
    
    
    def buildJSONFromParameters(self, request):
        self.listNodes = []
        self.listEdges = []
        name = request['name'][0]
        opt = request['option'][0]
        node = request['node'][0]
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        nbN = 0
        nbE = 0
        if opt == 'start':
            listAlreadyNoded = []
            for i in range(len(df.index)-1):
                print 'jkrjrjrjrjrjrjrjrjrjrjrjj'
                id1 = nbN
                lab1 = str(list(df.index)[i])
                posX1 = rd.uniform(0,30)
                posY1 = rd.uniform(0,30)
                listDesc1 = []
                for col in df.columns:
                    listDesc1.append(str(df.ix[list(df.index)[i],col]))
                for j in range(i+1, len(df.index)):
                    id2 = nbN+1
                    lab2 = str(list(df.index)[j])
                    posX2 = rd.uniform(0,30)
                    posY2 = rd.uniform(0,30)
                    listDesc2 = []
                    for col in df.columns:
                        listDesc2.append(str(df.ix[list(df.index)[j],col]))
                        lou = list(set(listDesc1) & set(listDesc2))
                    if len(lou) >0:
                        if lab1 not in listAlreadyNoded:
                            dico = {'id': id1,'label':lab1, 'x': posX1, 'y':posY1, 'descriptors':';'.join(listDesc1)}
                            print dico
                            listAlreadyNoded.append(lab1)
                            print 'pass by the first'
                            self.listNodes.append(dico)
                            nbN =nbN+1
                        if lab2 not in listAlreadyNoded:
                            dico2 = {'id': id2,'label':lab2, 'x': posX2, 'y':posY2, 'descriptors':';'.join(listDesc2)}
                            print 'pass by the second'
                            print dico2
                            listAlreadyNoded.append(lab2)
                            self.listNodes.append(dico2)
                            nbN =nbN+1
                        print 'kkrkrkrkrkrkr'    
                        dicoE = {'id': nbE, 'source': id1, 'target': id2, 'descriptors': ';'.join(lou)}
                        print dicoE
                        self.listEdges.append(dicoE)
                        nbE =nbE+1
                    nbN = nbN+1
                            
                            
        dictFin = {}
        dictFin['nodes'] = []
        dictFin['links']= []
        dictFin['nodes'] = self.listNodes
        dictFin['links'] = self.listEdges                       
                                                                
        return json.dumps(dictFin)                    
                                
                                
    def removeFromDico(self, listEdge,listNode):
        res = []
        listNodeLinked = []
        for le in listEdge:
            sou = le['source']
            tar = le['target']
            listNodeLinked.append(sou)
            listNodeLinked.append(tar)
        listNodeLinked = list(set(listNodeLinked))
        for sln in listNode:
            to = sln['id']
            if to in listNodeLinked:
                print to
                res.append(sln)
        return res


            
        
              
                    
    
    def buildNodesFromParameters(self, request):
        self.listNodes = []
        name = request['name'][0]
        opt = request['option'][0]
        node = request['node'][0]
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        dictNodes = {}
        keyLab = request['label'][0]
        nbN = 0
        for ind in df.index: 
            idNode = nbN
            posX = rd.uniform(0,30)
            posY = rd.uniform(0,30)
            if keyLab == 'default':
                lab = str(ind)
            else:
                lab = str(df.ix[ind,keyLab])
            listDesc= {}
            listRou = []
            for col in df.columns:
                re= str(df.ix[ind,col])
                if re == 'nan':
                    listDesc[col] = ''
                    listRou.append('')
                else:
                    listDesc[col] = re
                    listRou.append(re)
            dictNodes[idNode] = listDesc
            dico = {'id': idNode,'label':lab, 'x': posX, 'y':posY, 'descriptors':';'.join(listRou)}
            self.listNodes.append(dico) 
            nbN = nbN +1  
        return dictNodes
    
    def buildLinksFromParameters(self, request, dictNodes):
        self.listEdges = []
        lab = ''
        nbE = 0
        opt = request['option'][0]
        
        if opt == 'start':
            for i in range(len(dictNodes) - 1):
                id1 = dictNodes.keys()[i]
                listDesc1 = []
                for rro in dictNodes[id1]:
                    listDesc1.append(dictNodes[id1][rro])
                
                print 'iguess thats why i have got the blues'
                for j in range(i+1, len(dictNodes)):
                    id2 = dictNodes.keys()[j]
                    listDesc2 = []
                    for rro in dictNodes[id2]:   
                        listDesc2.append(dictNodes[id2][rro])
                    

                    listInter = list(set(listDesc1) & set(listDesc2))
                    
                    if len(listInter) >0:
                        print 'half full glass of wine'
                        dico = {'id': nbE, 'source': id1, 'target': id2, 'descriptors': ';'.join(listInter)}
                        self.listEdges.append(dico)
                        nbE =nbE+1
        
        elif opt == 'coefficient':
            coef = request['coefficient'][0]
            for i in range(len(dictNodes) - 1):
                id1 = dictNodes.keys()[i]
                listDesc1 = []
                for rro in dictNodes[id1]:
                    listDesc1.append(dictNodes[id1][rro])
                
                for j in range(i+1, len(dictNodes)):
                    id2 = dictNodes.keys()[j]
                    listDesc2 = []
                    for rro in dictNodes[id2]:   
                        listDesc2.append(dictNodes[id2][rro])
                    
                    listInter = list(set(listDesc1) & set(listDesc2))
                    
                    if len(listInter) >int(coef):
                        print 'dont give up on one thing'
                        dico = {'id': nbE, 'source': id1, 'target': id2, 'descriptors': ';'.join(listInter)}
                        self.listEdges.append(dico)
                        nbE =nbE+1
                
        elif opt == 'equat':
            lin = request['equation'][0]
            print lin
            print 'la la lala lala lalal allaa hallal'
            tab = lin.split('+')
            tabCol = self.currentDF.columns.values
            for tb in tab:
                tabET = tb.split('.')
                listRes = []
                for i in range(len(dictNodes) - 1):
                    id1 = dictNodes.keys()[i]
                    for j in range(i+1, len(dictNodes)):
                        id2 = dictNodes.keys()[j]
                        ok = True
                        for tet in tabET:
                            tet = tet.strip() 
                            if str((dictNodes[id1])[tet]) == str((dictNodes[id2])[tet]):
                                listRes.append(str((dictNodes[id2])[tet]))
                                ok = True
                            else:
                                ok = False
                                break
                                               
                        if ok:
                            dico = {'id': nbE, 'source': id1, 'target': id2, 'descriptors': ';'.join(listRes)} 
                            self.listEdges.append(dico)
                            nbE =nbE +1
        
        
        elif opt == 'jacquard':
            coefLeft = float(request['borneLeft'][0])
            coefRight = float(request['borneRight'][0])
            for i in range(len(dictNodes) - 1):
                id1 = dictNodes.keys()[i]
                listDesc1 = []
                for rro in dictNodes[id1]:
                    listDesc1.append(dictNodes[id1][rro])
                
                print 'i wanna go'
                for j in range(i+1, len(dictNodes)):
                    id2 = dictNodes.keys()[j]
                    listDesc2 = []
                    for rro in dictNodes[id2]:   
                        listDesc2.append(dictNodes[id2][rro])
                    
                    
                    listInter = list(set(listDesc1) & set(listDesc2))
                    listUnion = list(set(listDesc1) | set(listDesc2))
                    print 'listInter' + str(len(listInter))
                    print 'listUnion' + str(len(listUnion))
                    
                    
                    coefSize = float(len(listInter))/float(len(listUnion))
                    if (coefSize >= coefLeft) and (coefSize <= coefRight):
                        print 'half full glass of wine'
                        dico = {'id': nbE, 'source': id1, 'target': id2, 'descriptors': ';'.join(listInter)}
                        self.listEdges.append(dico)
                        nbE =nbE+1
                        
        elif opt== 'shannon':
            for i in range(len(dictNodes) - 1):
                id1 = dictNodes.keys()[i]
                for j in range(i+1, len(dictNodes)):
                    id2 = dictNodes.keys()[j]
                    sum = 0
                    for tb in df.columns.values:
                        ro = list(df.ix[:,tb])
                        if str((dictNodes[id1])[tb]) == str((dictNodes[id2])[tb]):
                            pro = ro.count((dictNodes[id1])[tb])/len(ro)
                            
        
            
        print len(self.listNodes) 
        opl = request['optPart'][0]
        if opl == 'no linked':
            listDup =self.listNodes                                                              
            listDup2= self.removeFromDico(self.listEdges, listDup) 
            self.listNodes = listDup2 
        print 'this is captain america calling'
        print len(self.listNodes)                 
        dictFin = {}
        dictFin['nodes'] = []
        dictFin['links']= []
        dictFin['nodes'] = self.listNodes
        dictFin['links'] = self.listEdges                       
                                                                
        return json.dumps(dictFin)
                

    
    def buildJSONDefFromParameters(self,request):
        dictNodes = self.buildNodesFromParameters(request)
        opt = request['option'][0]
        if opt == 'start':
            print 'start first edge construction'
            for i in range(len(dictNodes)-1):
                id1 = dictNodes.keys()[i]
                for j in range(i+1, len(dictNodes)):
                    id2 =dictNodes.keys()[j]
                    

    def goToJson(self, df, fileName): 
        dicoField = {}
        dictCol = {}
        dictDF = {}
        dictDFField = {}
        dictSID = {}
        print df
        size = len(df)
        dictSize = {'size': str(size)}
        
        list= df.columns.values
        
        for line in df.index:
            dictDFField[str(line)] = {}
            ser = df.ix[line,:]
            for se in ser.index.values:
                dictDFField[str(line)][str(se)] = str(ser[se]) 
        
        dictDF = {'df': dictDFField}
        for l in list:
            typ = str(df.dtypes[l])

            if str(typ) == 'float64' or str(typ) == 'int64':
                mean = ''
            else:
                mean = ''
            sete = set(df[l].dropna().values)
            tab = []
            for se in sete:
                tab.append(str(se))
            print tab
            dicoField[l] = {'type': typ, 'mean': mean, 'missingValue': str(not df[l].notnull().all()), 'length':str(len(df[l].dropna())), 'tabDiff': ';'.join(tab),'sizeDifferent': str(len(set(df[l].dropna().values))) } 
        dictCol = {'columns': dicoField}
        dictName = {'name': fileName} 
        #self.dicoDF[fileName] = df     
        #dictSID = {'sid': sidMap['sid'][0],'adja': False}
        dictCol.update(dictName)
        dictCol.update(dictSize)
        dictDF.update(dictCol)
        return dictDF   
    
    def adjustDataFrameFromPrec(self,name):
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        try:
            dfPrec = self.dicoDF[name][len(self.dicoDF[name])-2]
            i=1
            self.dicoDF[name] = np.roll(self.dicoDF[name],i)
        except:
            print 'dgdgdghdghdgh'
        return dfPrec
    
    def adjustDataFrameFromSuiv(self, name):
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        try: 
            dfSuiv = self.dicoDF[name][0]
            i=-1
            self.dicoDF[name]=np.roll(self.dicoDF[name],i)
        except:
            print 'suiv dont work'
        return dfSuiv
    
    def adjustDataFrameFromSubsetLines(self, firstLine, secondLine, name):
        
        print '|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'
        print name
        print self.dicoDF[name]
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        #df = self.dicoDF[name]
        df2 =df.ix[int(firstLine):int(secondLine), :]
        self.dicoDF[name].append(df2)
        print 'ohohoohohohoh cest le geant bleu'
        print self.dicoDF[name]
        return df2
    
         
    def adjustDataFrameFromEdit(self, expr, name):
        
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        print expr
        try:
            dfTot = eval(str(expr))
            self.dicoDF[name].append(dfTot)
            print dfTot
        except:
            print 'rkkrkrkrkr'
        return dfTot
    
    
    
    def adjustDataFrameFromSubsetColumns(self, txt, name):
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        tabSpl = str(txt).strip().split('and')
        tabCol = []
        for ts in tabSpl:
            tabCol.append(ts.strip())
        try:
            df2 = df.ix[:,tabCol]
            self.dicoDF[name].append(df2)
        except:
            print 'did you forget to smoke your weed'
        
        return df2
    
    
    def adjustDataFrameFromKeepinSpeValues(self, mode, column, txt, operator, name):
        df = self.dicoDF[name][len(self.dicoDF[name])-1]
        try:
            st = str((df.dtypes)[str(column)])
            if st == 'object':
                if str(operator) != '==':
                    print 'fuck you we are done'
                else:
                    if str(mode) == 'drop':
                        df2 = df.drop(df[df[str(column)]== str(txt)].index) 
                    else:
                        df2 = df.drop(df[df[str(column)]!= str(txt)].index)
            else:
                if str(operator) == '==':
                    print 'fuck we are done'
                else:
                    if str(operator) == '=':
                        if(str(mode)) == 'drop':
                            df2 = df.drop(df[df[str(column)]== float(txt)].index)
                        else:
                            df2 = df.drop(df[df[str(column)]!= float(txt)].index)
                    elif str(operator) == '<':
                        if(str(mode)) == 'drop':
                            df2 = df.drop(df[df[str(column)] < float(txt)].index)
                        else:
                            df2 = df.drop(df[df[str(column)] >= float(txt)].index)
                    elif str(operator) == '>':
                        if(str(mode)) == 'drop':
                            df2 = df.drop(df[df[str(column)]  >float(txt)].index)
                        else:
                            df2 = df.drop(df[df[str(column)] <= float(txt)].index)
            self.dicoDF[name].append(df2)
            print 'when you fuck your mum call me'
        except:
            print 'wrong idea to do this code when you screw up every time'
        return df2
        
    def adjustDataFrameFromDropLines(self, nameColumn, name):
        dfTot = self.dicoDF[name][len(self.dicoDF[name])-1]
        #self.currentDF = dfTot
        try:
            print 'you better run fast'
            dfTot2 = dfTot.drop(dfTot[dfTot[str(nameColumn).strip()].isnull()].index)
            self.dicoDF[name].append(df2)
        except:
            print 'its all over now baby blue'
        return dfTot2   
    
    
    def exportDFInCSV(self, name, path):
        dfTot = self.dicoDF[name][len(self.dicoDF[name])-1]        
        print 'take a moment to relax'
        f = dfTot.to_csv(str(path))
        print f
        print 'i wanna talk tonight'
        
        
    def exportDFINJSON(self, name, path):
        dictFin['nodes'] = []
        dictFin['links']= []
        dictFin['nodes'] = self.listNodes
        dictFin['links'] = self.listEdges
        
        t = json.dumps(dictFin)
        
        
        
        