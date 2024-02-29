import json

class Position(dict):
    def __init__(self, x=0.0, y=0.0, z=0.0, r=0.0, j1=0.0, j2=0.0, j3=0.0, j4=0.0, name='') :
        self.x = x
        self.y = y
        self.z = z
        self.r = r
        self.j1 = j1
        self.j2 = j2
        self.j3 = j3
        self.j4 = j4
        self.name = name
        super().__init__(
            self, 
            x = x,
            y = y,
            z = z,
            r = r,
            j1 = j1,
            j2 = j2,
            j3 = j3,
            j4 = j4,
            name = name
        )
        return

    def toJSON(self):
        return json.dumps(self.__dict__)

    def toDict(self):
        return self.__dict__

    def fromJSON(self, p):
        self.x = p.x if hassattr(p, 'x') else 0
        self.y = p.y if hassattr(p, 'y') else 0
        self.z = p.z if hassattr(p, 'z') else 0
        self.r = p.r if hassattr(p, 'r') else 0
        self.j1 = p.j1 if hassattr(p, 'j1') else 0
        self.j2 = p.j2 if hassattr(p, 'j2') else 0
        self.j3 = p.j3 if hassattr(p, 'j3') else 0
        self.j4 = p.j4 if hassattr(p, 'j4') else 0
        self.name = p.name if hassattr(p, 'name') else ''
        super().__init__(
            self, 
            x = self.x,
            y = self.y,
            z = self.z,
            r = self.r,
            j1 = self.j1,
            j2 = self.j2,
            j3 = self.j3,
            j4 = self.j4,
            name = self.name
        )
        return self

    def fromDict(self, p):
        x = p['x'] if 'x' in p else 0
        y = p['y'] if 'y' in p else 0
        z = p['z'] if 'z' in p else 0
        r = p['r'] if 'r' in p else 0
        j1 = p['j1'] if 'j1' in p else 0
        j2 = p['j2'] if 'j2' in p else 0
        j3 = p['j3'] if 'j3' in p else 0
        j4 = p['j4'] if 'j4' in p else 0
        name = p['name'] if 'name' in p else ''
        super().__init__(
            self, 
            x = self.x,
            y = self.y,
            z = self.z,
            r = self.r,
            j1 = self.j1,
            j2 = self.j2,
            j3 = self.j3,
            j4 = self.j4,
            name = self.name
        )
        self.x = x
        self.y = y
        self.z = z
        self.r = r
        self.j1 = j1
        self.j2 = j2
        self.j3 = j3
        self.j4 = j4
        self.name = name
        return self