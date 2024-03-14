import cherrypy, os, sys, threading, traceback
from cherrypy._cpdispatch import Dispatcher

from ws4py.server.cherrypyserver import WebSocketPlugin, WebSocketTool
from ws4py.websocket import WebSocket
# from ws4py.messaging import TextMessage

from serial.tools import list_ports
import json
from classes.Enums import ConnectState
import devices

class StatusWebSocketHandler(WebSocket):
    def received_message(self, m):
        # print("Message received: %s" % m)
        if m == 'connected' or m == 'disconnected': return
        try:
            if m.is_text: 
                m = json.loads(m.data)
            if m['type'] == 'control-command':
                cherrypy.engine.publish('control-broadcast', m)
            elif m['type'] == 'addon-command':
                cherrypy.engine.publish('addon-broadcast', m)
        except Exception as e:
            print(e)
            traceback.print_exc()
        # cherrypy.engine.publish('websocket-broadcast', m)
        fsize = os.path.getsize('app.log')
        if fsize > 20000: 
            f = open('app.log', 'r')
            d = f.readlines()
            f.close()
            del d[0:-100]
            f = open('app.log', 'w')
            f.writelines(d)
            f.close()
        # pass

    def closed(self, code, reason="A client left the room without a proper explanation."):
        if type(reason) == bytes: reason = reason.decode('utf-8')
        m = json.dumps({
            'type': 'connection closed',
            'code': code,
            'reason': reason
        })
        cherrypy.engine.publish('websocket-broadcast', m)
        
class DobotServer(object):
    @cherrypy.expose
    def index(self): 
        return "Hello World"

    @cherrypy.expose
    def ws(self):
        cherrypy.log("Handler created: %s" % repr(cherrypy.request.ws_handler))
        return

    def update(self):
        threading.Timer(cherrypy.request.config['dobot.updateInterval'], self.update).start()
        ports = list_ports.comports()
        # ports = [p.device for p in ports]
        ports = [{'value': p.device, 'name': f'{p.device}: {p.description}'} for p in ports]
        # print(ports)

        if devices.device and devices.device.ser and devices.device.state == ConnectState.CONNECTED:
            try:
                pos = devices.device.pose_p()
            except:
                m = json.dumps({
                    'type': 'update',
                    'status': 'disconnected',
                    'ports': ports.__dict__
                })
                cherrypy.engine.publish('websocket-broadcast', m)
                return
            m = json.dumps({
                'type': 'update',
                'status': 'connected',
                'ports': [] if devices.device else ports.__dict__,
                'position': pos.__dict__
            })
            cherrypy.engine.publish('websocket-broadcast', m)
        else:
            m = json.dumps({
                'type': 'update',
                'status': 'disconnected',
                'ports': ports,
            })
            cherrypy.engine.publish('websocket-broadcast', m)
        return 
        
if __name__ == '__main__':
    WebSocketPlugin(cherrypy.engine).subscribe()
    cherrypy.tools.websocket = WebSocketTool()
    cherrypy.config.update('cherrypy.conf')
    cherrypy.config.namespaces['dobot'] = {}

    wsConfig = {
        '/ws': {'tools.websocket.on': True,
            'tools.websocket.handler_cls': StatusWebSocketHandler
        }
    }
    cherrypy.config.update(wsConfig)
    
    root = DobotServer()
    app = cherrypy.tree.mount(root, '/', config='dobot.conf')
    app.merge(wsConfig)

    # load controls
    from Controls import Controls
    cherrypy.tree.mount(Controls(), '/controls')

    # load addons
    from addons.Spoon import Spoon
    cherrypy.tree.mount(Spoon(), '/spoon')

    cherrypy.engine.start()
    root.update()
    cherrypy.engine.block()