#Copyright Jon Berg , turtlemeat.com

import string,cgi,time
from os import curdir, sep
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
#import pri
import sys
from subprocess import call

class MyHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            if ctype == 'multipart/form-data':
                query=cgi.parse_multipart(self.rfile, pdict)

            self.send_response(200)
            self.send_header('Content-type',  'application/pdf')
            self.send_header('Content-Disposition', 'attachment')
            self.end_headers()
            
            tmp_src = "/tmp/convert-inkscape.svg"
            tmp_dst = "/tmp/convert-inkscape.pdf"
            try:
              with open(tmp_src, "w") as f:
                f.write(query.get('content')[0])
            except Exception as e:
              print "Open tmp file failed:", e
             
            call(['inkscape', tmp_src, '-C', '-d', '600', '-E', tmp_dst])
            
            with open(tmp_dst, "r") as f:     
              s = f.read()
              self.wfile.write(s)
            
        except:
            pass

def main():
    if len(sys.argv) > 1:
      port = int(sys.argv[1])
    else:
      port = 7777

    try:
        server = HTTPServer(('', port), MyHandler)
        print 'started httpserver...'
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        server.socket.close()

if __name__ == '__main__':
    main()

