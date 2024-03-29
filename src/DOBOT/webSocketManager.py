import cherrypy, json
import manager

class SocketManager(object):
    def __init__(self): 
        cherrypy.engine.subscribe('control-broadcast', self.listen)
        return
    
    def listen(self, m): 
        if m['type'] == 'control-command':
            if 'command' in m.keys():
                if m['command'] == 'home': self.home(**m)
                elif m['command'] == 'pose': self.pose(**m)
                elif m['command'] == 'move': self.move(**m)
                elif m['command'] == 'speed': self.setSpeed(**m)
                elif m['command'] == 'emergency_stop': self.emergency_stop(**m)
        return
    
    @cherrypy.expose
    def move(self, direction='xn', steps=10, mode='XYZ', **args):
        manager.move_step(mode, direction, steps)
        return 'move'

    @cherrypy.expose
    def home(self, **args): 
        manager.home()
        return 'home'
    
    @cherrypy.expose
    def setSpeed(self, velocity, acceleration, **args): 
        manager.god_speed(float(velocity), float(acceleration))
        return 'setSpeed'

    @cherrypy.expose
    def pose(self, **args): 
        pos = manager.get_pose()

        message = json.dumps({
            'type': 'pose',
            'status': 'success',
            'error': '',
            'data': pos.__dict__,
        })

        cherrypy.engine.publish('websocket-broadcast', message)

    @cherrypy.expose
    def emergency_stop(self, **args):
        manager.emergency_stop()
        return 'emergency_stop'