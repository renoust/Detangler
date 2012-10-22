
from uuid import uuid4
import time
import threading
import sys
libtulip_dir = "/work/github/TulipPosy/tulip-server"
sys.path.append(libtulip_dir)
from graphManager import *
        


class TPSession():#threading.Thread):

    def __init__(self, expire = 72000000):
        self.expire = expire
        self.sidList = []
        self.timeTrack = {}
        self.sidToGraphManager = {}

    def update_session(self, sid):
        print "updating one:",sid, " in ",self.sidList, "/", self.timeTrack, "/", self.sidToGraphManager
        if sid in self.timeTrack:
            self.timeTrack[sid] = int(round(time.time() * 1000))
        self.check_all()

    def generate_sid(self):
        sid = str(uuid4().get_hex())
        while sid in self.sidList:
            sid = str(uuid4().get_hex())
        return sid 

    def get_session(self, sid):
        graphMan = None
        print "getting one:",sid, " in ",self.sidList, "/", self.timeTrack, "/", self.sidToGraphManager
        if str(sid) in self.sidList:
            graphMan = self.sidToGraphManager[sid]
            self.update_session(sid)
        return graphMan

    def create_session(self):
        sid = self.generate_sid()
        self.sidList.append(sid)
        self.timeTrack[sid] = int(round(time.time() * 1000))
        self.sidToGraphManager[sid] = graphManager()
        print "creating one:",sid, " in ",self.sidList, "/", self.timeTrack, "/", self.sidToGraphManager
        return sid
        
    def is_registered(self, sid):
        print "is resgistered:",sid, " in ",self.sidList, "/", self.timeTrack, "/", self.sidToGraphManager
        return str(sid) in self.sidList

    def delete_session(self, sid):
        print "deleting one:",sid, " in ",self.sidList, "/", self.timeTrack, "/", self.sidToGraphManager
        if sid in timeTrack:
            sidTime = self.timeTrack.pop(sid)
            del(sidTime)
            sidGraphMan = self.sidToGraphManager.pop(sid)
            del(sidGraphMan)
            sidinList = self.sidList.pop(self.sidList.index(sid))
            del(sidinList)

    def check_expired(self, sid):
        print "cheking one:",sid, " in ",self.sidList, "/", self.timeTrack, "/", self.sidToGraphManager
        now = int(round(time.time() * 1000))
        if now - self.timeTrack[sid] > self.expire:
            self.delete_session(sid)

    def check_all(self):
        print "checking all:", " in ",self.sidList, "/", self.timeTrack, "/", self.sidToGraphManager
        for sid in self.sidList:
            self.check_expired(sid)

    def run(self):
        self.check_all()
        sleep(3)
        print 'checking the map'
    


