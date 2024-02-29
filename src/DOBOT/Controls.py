import cherrypy, os, sys, json

from serial.tools import list_ports
from classes.Dobot import Dobot
from classes.Enums import ConnectState, PTPMode

import devices
import helpers

class Controls(object):
    def __init__(self): 
        cherrypy.engine.subscribe('control-broadcast', self.listen)
        return

    def listen(self, m): 
        if m['type'] == 'control-command':
            if 'command' in m.keys():
                if m['command'] == 'connect': self.connect(**m)
                elif m['command'] == 'disconnect': self.disconnect(**m)
                elif m['command'] == 'home': self.home(**m)
                elif m['command'] == 'setSpeed': self.setSpeed(**m)
                elif m['command'] == 'pose': self.pose(**m)
                elif m['command'] == 'jog': self.jog(**m)
        return

    @cherrypy.expose
    def index(self): 
        return helpers.loadTemplate('home')
    
    @cherrypy.expose
    def connect(self, port, **args): 
        ports = list_ports.comports()
        ports = [p.device for p in ports]
        if not devices.device or not devices.device.ser or not devices.device.ser.isOpen():
            devices.device = Dobot(port, verbose=False)
        m = None
        if devices.device.state == ConnectState.CONNECTED:
            pos = devices.device.pose_p()
            m = json.dumps({
                'type': 'update',
                'status': 'connected',
                'ports': ports,
                'position': pos.__dict__
            })
            cherrypy.engine.publish('websocket-broadcast', m)
        return m

    @cherrypy.expose
    def disconnect(self, **args): 
        ports = list_ports.comports()
        ports = [p.device for p in ports]
        m = None
        devices.device.close()
        if devices.device.state == ConnectState.NOT_CONNECTED:
            m = json.dumps({
                'type': 'update',
                'status': 'disconnected',
                'ports': ports,
            })
            cherrypy.engine.publish('websocket-broadcast', m)
        return m

    @cherrypy.expose
    def home(self, **args): 
        devices.device.home()
        return 'home'

    @cherrypy.expose
    def setSpeed(self, velocity, acceleration, **args): 
        devices.device.set_speed(float(velocity), float(acceleration))
        return 'setSpeed'

    @cherrypy.expose
    def pose(self, steps=10, **args): 
        pos = devices.device.pose_p()
        m = json.dumps({
            'type': 'pose',
            'position': pos
        })
        print(m)
        cherrypy.engine.publish('websocket-broadcast', m)
        return json.dumps(pos)

    @cherrypy.expose
    def jog(self, direction='xn', steps=10, mode='XYZ', **args): 
        try:
            pos = devices.device.pose_p()
            if mode == 'XYZ':
                if direction == 'xp': pos.x += float(steps)
                elif direction == 'xn': pos.x -= float(steps)
                elif direction == 'yp': pos.y += float(steps)
                elif direction == 'yn': pos.y -= float(steps)
                elif direction == 'zp': pos.z += float(steps)
                elif direction == 'zn': pos.z -= float(steps)
                elif direction == 'rp': pos.r += float(steps)
                elif direction == 'rn': pos.r -= float(steps)
                devices.device.move_to_p(pos)
            elif mode == 'ANGLE': 
                if direction == 'j1p': pos.j1 += float(steps)
                elif direction == 'j1n': pos.j1 -= float(steps)
                elif direction == 'j2p': pos.j2 += float(steps)
                elif direction == 'j2n': pos.j2 -= float(steps)
                elif direction == 'j3p': pos.j3 += float(steps)
                elif direction == 'j3n': pos.j3 -= float(steps)
                elif direction == 'j4p': pos.j4 += float(steps)
                elif direction == 'j4n': pos.j4 -= float(steps)
                devices.device.move_to_p(pos, mode=PTPMode.MOVJ_ANGLE)
            return 'jog'
        except Exception as e:
            print(e)
            traceback.print_exc()
            return e
        return
