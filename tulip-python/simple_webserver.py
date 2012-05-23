#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import cgi

class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
	print self.path
	paramStr = self.path.split('?')[1]
	params = {}
	if len(paramStr) > 1:
		params = cgi.parse_qs(paramStr, True, True)
		print params
	return
        #if self.path == '/':
        #    self.path = '/simplehttpwebpage_content.html'
        #return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)


def main():
	try:
		Handler = MyRequestHandler
		server = SocketServer.TCPServer(('0.0.0.0', 8080), Handler)
		#server = HTTPServer(('', int(port)), MainHandler)
		print 'started httpserver...'
		server.serve_forever()
	except KeyboardInterrupt:
		print '^C received, shutting down server'
		server.socket.close()

#Handler = MyRequestHandler
#server = SocketServer.TCPServer(('0.0.0.0', 8080), Handler)

#server.serve_forever()
main()
