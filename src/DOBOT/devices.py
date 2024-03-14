import uuid
import cherrypy
from serial.tools import list_ports
from classes import Dobot
from manager import connect2Dobot

deviceId = uuid.uuid4()

app = Flask(__name__, template_folder='./templates')

posDict = {}

orderedPositionsDict = {}

monitorIp = 'http://10.5.101.129:3000'

dobot = connect2Dobot()

ws_url = '{socket_host}:{port}'.format(socket_host= cherrypy.server.socket_host, port = str(cherrypy.server.socket_port))