from http.server import BaseHTTPRequestHandler, HTTPServer
from socket import socket,AF_INET , SOCK_DGRAM


def sendToPd(raw_msg):
    raw_msg = raw_msg.decode()
    raw_msg = raw_msg.strip('{}')
    a, b = raw_msg.split(':')
    a = a[1:-1]
    b = b[1:-1]
    
    if b == '-1':
        msg = a + ';\n'
    else:
        msg = a + ' ' + b + ';\n'
    print(msg)
    sobj = socket(AF_INET,SOCK_DGRAM)
    ip = 'localhost'
    port = 1000
    sobj.sendto(msg.encode(),(ip,port))

class S(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself

        sendToPd(post_data)
        self._set_response()
        self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=S, port=5678):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    run()
