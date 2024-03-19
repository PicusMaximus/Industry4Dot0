from time import sleep
import cherrypy, os, threading, traceback

from ws4py.server.cherrypyserver import WebSocketPlugin, WebSocketTool
from ws4py.websocket import WebSocket
# from ws4py.messaging import TextMessage

import json
import manager

class StatusWebSocketHandler(WebSocket):
    def received_message(self, m):
        print("Message received: %s" % m)
        if m == 'connected' or m == 'disconnected': return
        try:
            if m.is_text: 
                m = json.loads(m.data)
            if m['type'] == 'control-command':
                cherrypy.engine.publish('control-broadcast', m)
        except Exception as e:
            print(e)
            traceback.print_exc()

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
        message = json.dumps({
            'type': 'connection closed',
            'code': code,
            'reason': reason
        })
        cherrypy.engine.publish('websocket-broadcast', message)
        
class DobotServer(object):
    @cherrypy.expose
    def index(self): 
        return 'Hello World'

    @cherrypy.expose
    def ws(self):
        cherrypy.log("Handler created: %s" % repr(cherrypy.request.ws_handler))
        return
    
    def update_connection_state(self):
        # Start update timer here...
        threading.Thread(target=connection_state, args=(cherrypy.request.config['dobot.updateConnectionDetailsInterval'],), daemon=True).start()
        return
    

def connection_state(time):
    while(True):
        if manager.check_connection_status():
            message = json.dumps({
                'type': 'connected',
                'status': 'success',
                'error': '',
                'message': 'The dobot is connected.',
            })

            cherrypy.engine.publish('websocket-broadcast', message)

            sleep(time)

            continue

        message = json.dumps({
            'type': 'disconnected',
            'status': 'error',
            'error': 'The dobot is no longer connected',
            'message': '',
        })

        cherrypy.engine.publish('websocket-broadcast', message)

        sleep(time)
        
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
    # The server will app will be mounted to the cherrypy here...
    app = cherrypy.tree.mount(root, '/', config='dobot.conf')
    app.merge(wsConfig)

    # # load controls
    from webSocketManager import SocketManager
    cherrypy.tree.mount(SocketManager(), '/handler')

    cherrypy.engine.start()

    root.update_pose()
    root.update_connection_state()

    cherrypy.engine.block()