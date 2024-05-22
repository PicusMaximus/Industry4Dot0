from types import SimpleNamespace
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
                elif m['command'] == 'goto_pos': self.goto_pos(**m)
                elif m['command'] == 'execute_settings': self.execute_settings(**m)
        return
    
    @cherrypy.expose
    def move(self, direction='xn', steps=10, mode='XYZ', **args):
        manager.move_step(mode, direction, steps)
        return 'move'
    
    @cherrypy.expose
    def goto_pos(self, pos, **args):
        posDict = SimpleNamespace(**dict(pos))
        manager.move_to_p(posDict)
        return 'goto_pos'

    @cherrypy.expose
    def execute_settings(self, settings, **args):
        settingsDict = SimpleNamespace(**dict(settings))
        manager.toggle_suck(settingsDict.suckState)
        return 'execute_settings'

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