import cherrypy
import json
import helpers
import devices
from classes.Position import Position

# Adds the ability to use a spoon
class Spoon():
    selectedProfile = 'Default'
    profiles = None

    def __init__(self): 
        self.loadProfiles()
        self.loadProfile(profileName = self.selectedProfile)
        cherrypy.engine.subscribe('addon-broadcast', self.listen)
        return

    def listen(self, m): 
        if m['type'] == 'addon-command' and m['addon'] == 'spoon':
            if m['command'] == 'up': self.up(**m)
            elif m['command'] == 'back': self.back(**m)
            elif m['command'] == 'down': self.down(**m)
            elif m['command'] == 'scoopPosition': self.scoopPosition(**m)
            elif m['command'] == 'lower': self.lower(**m)
            elif m['command'] == 'scoop': self.scoop(**m)
            elif m['command'] == 'raise': self.raiseArm(**m)
            elif m['command'] == 'loadProfile': self.loadProfile(**m)
            elif m['command'] == 'loadProfiles': self.loadProfiles(**m)
        return

    @cherrypy.expose(['spoon', 'Spoon', 'SPOON'])
    def index(self):
        return helpers.loadTemplate('addons/spoon', profiles=self.profiles)

    @cherrypy.expose
    def up(self, **args):
        devices.device.move_to_p(self.upPos)
        return 'up'

    @cherrypy.expose
    def back(self, **args):
        devices.device.move_to_p(self.backPos)
        return 'back'

    @cherrypy.expose
    def down(self, **args):
        devices.device.move_to_p(self.downPos)
        return 'down'

    @cherrypy.expose
    def scoopPosition(self, **args):
        devices.device.move_to_p(self.scoopPos)
        return 'scoopPos'

    @cherrypy.expose
    def lower(self, **args):
        sequence = [self.backPos, self.downPos]
        for pos in sequence:
            devices.device.move_to_p(pos)
        return 'lower'

    @cherrypy.expose
    def scoop(self, **args):
        sequence = [self.downPos, self.scoopPos]
        for pos in sequence:
            devices.device.move_to_p(pos)
        return 'scoop'

    @cherrypy.expose(['raise'])
    def raiseArm(self, **args):
        sequence = [self.scoopPos, self.upPos]
        for pos in sequence:
            devices.device.move_to_p(pos)
        return 'raise'

    @cherrypy.expose
    def loadProfile(self, profileName, **args):
        for p in self.profiles: 
            if p['name'] == profileName:
                for pos in p['positions']:
                    setattr(self, pos.name +'Pos', pos)
                return 'loaded ' + profileName
        print('failed to load ' + profileName)
        return 'failed to load ' + profileName
    
    @cherrypy.expose
    def loadProfiles(self, useWs=False, **args):
        with open('addons/spoon.json', 'r') as f:
            j = json.load(f)
            self.selectedProfile = j['defaultProfile']
            self.profiles = j['profiles']
        for i in range(len(self.profiles)):
            for j in range(len(self.profiles[i]['positions'])):
                self.profiles[i]['positions'][j] = Position().fromDict(self.profiles[i]['positions'][j])
        if useWs:
            d = json.dumps({
                'addon': 'spoon',
                'type': 'loadProfiles',
                'profiles': self.profiles
            })
            cherrypy.engine.publish('websocket-broadcast', d)
        return json.dumps(self.profiles)
