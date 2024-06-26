import uuid
from UuidGeneration import generate_uuid_with_mac_seed
import requests
from classes import Dobot
import devices
from serial.tools import list_ports
from classes.Enums import ConnectState, PTPMode

dobot = None

def connect():
    if len(list_ports.comports()) > 0:
        return Dobot.Dobot(list_ports.comports()[0].device)

def reconnect():
    global dobot
    dobot = connect()

    return dobot

def get_dobot():
    global dobot

    if dobot is None:
        dobot = connect()
        if dobot is None: return None
    
    if dobot.ser.isOpen() == False:
        dobot = connect()

    return dobot
    


def get_pose():
    d = get_dobot()

    pos = d.pose_p()

    return pos

def move_to_p(pos):
    d = get_dobot()

    d.move_to_p(pos)
    
    return

def emergency_stop():
    d = get_dobot()
    # Force stop the queue from executing
    if d.force_stop():
        # Clear the queue
        # This makes the behavior more calculatable...

        # This clears the queue, so that no more task are run, after stop - after starting the queue again!
        d.clear()
    return

def stop():
    d = get_dobot()
    #Stop executing new tasks but finish current task
    d.stop()
    return

def start():
    d = get_dobot()
    d.start()

    return

def home():
    d = get_dobot()
    d.home()

    return

def toggle_suck(state):
    d = get_dobot()

    if state is not True or False:
        if state == 'true':
            state = True
        else: state = False

    #This enables or disables the Suction-Cup
    d.suck(state)

    return


def update_gripper_status(state):
    d = get_dobot()
    #This enables or disables the Gripper
    d.grip(state)

def get_jobs():
    #This is just for debugging purposeses...
    return { 
        "deviceId": str(devices.deviceId),
        "jobs": [
            {
                "id": str(generate_uuid_with_mac_seed(devices.deviceId)),
                "name": "Job 1"
            }
        ],
    }

def login():

    response = requests.post(url='{base_path}/api/monitor/login'.format(base_path=monitorIP), json={
        "ip": devices.getServerIp(),
        "id": str(devices.deviceId),
        "type": "dobot",
        "name": "last dobot standing",
    })

    return
    # return json, 200

def send_log():
    json = {
        "ip": devices.getServerIp(),
        "id": devices.deviceId,
        "type": "dobot",
        "name": "dobot 1",
    }

    requests.post(url='http://{ip}/api/monitor/log'.format(ip=devices.monitorIp), json=json)

    return

def move_step(mode, direction, steps):
    d = get_dobot()

    pos = d.pose_p()

    if mode == 'XYZ':
        if direction == 'xp': pos.x += float(steps)
        elif direction == 'xn': pos.x -= float(steps)
        elif direction == 'yp': pos.y += float(steps)
        elif direction == 'yn': pos.y -= float(steps)
        elif direction == 'zp': pos.z += float(steps)
        elif direction == 'zn': pos.z -= float(steps)
        elif direction == 'rp': pos.r += float(steps)
        elif direction == 'rn': pos.r -= float(steps)
        d.move_to_p(pos)
    elif mode == 'ANGLE': 
        if direction == 'j1p': pos.j1 += float(steps)
        elif direction == 'j1n': pos.j1 -= float(steps)
        elif direction == 'j2p': pos.j2 += float(steps)
        elif direction == 'j2n': pos.j2 -= float(steps)
        elif direction == 'j3p': pos.j3 += float(steps)
        elif direction == 'j3n': pos.j3 -= float(steps)
        elif direction == 'j4p': pos.j4 += float(steps)
        elif direction == 'j4n': pos.j4 -= float(steps)
        d.move_to_p(pos, mode=PTPMode.MOVJ_ANGLE)
    return

def check_connection_status():
    if len(list_ports.comports()) > 0:
        try:
            d = get_dobot()
        except:
            return False

        if d and d.ser and d.state == ConnectState.CONNECTED:
            return True

    return False

def god_speed(velocity, acceleration, **args):
    d = get_dobot()
    d.set_speed(float(velocity), float(acceleration))
    return

def wait(ms, **args):
    d = get_dobot()
    d.wait(ms)
    return

def run_task(subtasks):
    for subtask in subtasks:
        for step in subtask.steps:
            if hasattr(step, 'command'):
                if step.command == 'speed': god_speed(step.data.speed)
                elif step.command == 'move': move_to_p(step.data.pos)
                elif step.command == 'settings': toggle_suck(step.data.settings)
                elif step.command == 'wait': wait(step.data.wait)
                # elif subtask['command'] == 'grip': 
    return