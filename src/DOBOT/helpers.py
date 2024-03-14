from addons.conf import addons
import devices
import classes.DobotArm as DobotArm
import classes.Enums as Enums
from serial.tools import list_ports
from jinja2 import Environment, PackageLoader, select_autoescape

env = Environment(
    loader=PackageLoader('DobotServer', 'views'),
    autoescape=select_autoescape(['html', 'xml'])
)

def loadTemplate(templatName, **args): 
    ports = list_ports.comports()
    template = env.get_template(templatName+'.html.jinja')
    # print(devices.device)
    # if devices.device:
    #     print(devices.device.state)
    #     print(devices.device.ser.isOpen())
    # print(DobotArm.device.state)
    return template.render(args, addons=addons, device=devices.device, Enums=Enums, ports=ports)