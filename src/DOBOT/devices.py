import uuid
import cherrypy
from serial.tools import list_ports
from classes import Dobot

deviceId = uuid.uuid4()
# ports = list_ports.comports()   

# device = None
# dobot = None

# def connect2Dobot():
#     if len(list_ports.comports()) > 0:
#         return Dobot.Dobot(list_ports.comports()[0].device)

# def connect2Dobot2():
#     if len(list_ports.comports()) > 0:
#         global device
#         device = Dobot.Dobot(list_ports.comports()[0].device)

# def connect2Dobot22():
#     if len(list_ports.comports()) > 0:
#         global device
#         device = Dobot.Dobot(list_ports.comports()[0].device)

# device = connect2Dobot()

# if device == None:
#     connect2Dobot2()

# dobot = connect2Dobot()

# if dobot == None:
#     connect2Dobot22()


ws_url = '{socket_host}:{port}'.format(socket_host= cherrypy.server.socket_host, port = str(cherrypy.server.socket_port))

# ports = list_ports.comports()
# dobot = Dobot.Dobot(ports[0].device)