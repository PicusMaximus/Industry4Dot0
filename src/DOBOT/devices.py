import cherrypy
from flask import request
from UuidGeneration import generate_uuid_with_mac_seed
import dbManager

def getServerIp():
    return request.host.split(':')[0]

deviceId = generate_uuid_with_mac_seed(0)

posDict = {}

orderedPositionsDict = {}

monitorIP = dbManager.getMonitorIP()

if monitorIP is None:
    monitorIP = 'http://10.5.101.115:3000'

ws_url = '{socket_host}:{port}'.format(socket_host= cherrypy.server.socket_host, port = str(cherrypy.server.socket_port))