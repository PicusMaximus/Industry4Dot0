import uuid
import cherrypy
from flask import request

def getServerIp():
    return request.host.split(':')[0]

deviceId = uuid.uuid4()

monitorIp = 'http://10.5.101.129:3000'

ws_url = '{socket_host}:{port}'.format(socket_host= cherrypy.server.socket_host, port = str(cherrypy.server.socket_port))