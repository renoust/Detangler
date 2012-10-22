class Application(tornado.web.Application):
    def __init__(self):
        tornado.web.Application.__init__(self, handlers, **settings)
        self.db_session = db_session
        self.redis = redis.StrictRedis()
        self.session_store = RedisSessionStore(self.redis)



class BaseHandler(tornado.web.RequestHandler):

    def get_current_user(self):
        return self.session['user'] if self.session and 'user' in self.session else None

    @property
    def session(self):
        sessionid = self.get_secure_cookie('sid')
        return Session(self.application.session_store, sessionid)
