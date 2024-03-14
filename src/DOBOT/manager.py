import requests
from classes import Dobot
from devices import deviceId, posDict, orderedPositionsDict, monitorIp
from serial.tools import list_ports
from jobOrders import position
from classes.Enums import PTPMode

def getServerIp():
    return request.host.split(':')[0]

def getPose2():
    global position

    if dobot is None:
        return "Missing Dobot."

    position = dobot.pose_p()
    return jsonify({ 
        "deviceId": deviceId,
        "pose": [
            {
                "xCoordinate": position.x,
                "yCoordinate": position.y,
                "zCoordinate": position.z,
                "rCoordinate": position.r
            }
        ],
        }
    ), 200

def move_to_p():
    global position

    if position != None: 
        dobot.move_to_p(position)
    
    return jsonify(position), 200

def setJobs2():
    job = job(jobName, [])
    orderedPositionsDict.update(jobName, positions)
    return jsonify("Job was successfully set."), 200

def startJob2():
    # Start job with given ip

    return jsonify("Success"), 200

def notStop2():
    # Force stop the queue from executing
    if dobot.forceStop():
        # Clear the queue
        # This makes the behavior more calculatable...
        dobot.clear()
        return jsonify("Successfully stoped the running task."), 200
    else:
        return jsonify("Failed to stop the running task."), 400

def start2():
    if dobot.start():
        return jsonify("Successfully started the Dobot."), 200
    else:
        return jsonify("Failed to start the Dobot."), 400

def home2():
    if dobot.home():
        return jsonify("Successfully moved to home position."), 200
    else:
        return jsonify("Failed to move to home position."), 400

def setSuctionCupStatus2():
    #This enables or disables the Suction-Cup
    if dobot.suck(suctionStatus):
        return jsonify("Successfuly set the suction cup status."), 200
    else:
        return jsonify("Failed to set the suction cup status."), 400

def setGripperStatus2():
    #This enables or disables the Gripper
    if dobot.grip(suctionStatus):
        return jsonify("Successfully set the gripper status."), 200
    else:
        return jsonify("Failed to set the gripper status."), 400

def getJobs2():
    #This is just for debugging purposeses...
    return jsonify({ 
        "deviceId": str(deviceId),
        "jobs": [
            {
                "id": str(uuid.uuid4()),
                "name": "Job 1"
            }
        ],
        }
    ), 200

def login2():
    try:
        response = requests.post(url='{base_path}/api/monitor/login'.format(base_path=monitorIp), json={
        "ip": getServerIp(),
        "id": str(deviceId),
        "type": "dobot",
        "name": "dobot 1",
    })
        print(response.raw)
    except Exception as e:
        print(e)

    return jsonify("Login successful."), 200
    # return json, 200

def log2Monitor2():
    json = jsonify({
        "ip": getServerIp(),
        "id": deviceId,
        "type": "dobot",
        "name": "dobot 1",
    })

    requests.post(url='http://{ip}/api/monitor/log'.format(ip=monitorIp), json=json)
    return jsonify("Log successful."), 200

def moveDobot2():
    steps = 20

    pos = dobot.pose_p()

    if mode == 'XYZ':
        if direction == 'xp': pos.x += float(steps)
        elif direction == 'xn': pos.x -= float(steps)
        elif direction == 'yp': pos.y += float(steps)
        elif direction == 'yn': pos.y -= float(steps)
        elif direction == 'zp': pos.z += float(steps)
        elif direction == 'zn': pos.z -= float(steps)
        elif direction == 'rp': pos.r += float(steps)
        elif direction == 'rn': pos.r -= float(steps)
        dobot.move_to_p(pos)
    elif mode == 'ANGLE': 
        if direction == 'j1p': pos.j1 += float(steps)
        elif direction == 'j1n': pos.j1 -= float(steps)
        elif direction == 'j2p': pos.j2 += float(steps)
        elif direction == 'j2n': pos.j2 -= float(steps)
        elif direction == 'j3p': pos.j3 += float(steps)
        elif direction == 'j3n': pos.j3 -= float(steps)
        elif direction == 'j4p': pos.j4 += float(steps)
        elif direction == 'j4n': pos.j4 -= float(steps)
        dobot.move_to_p(pos, mode=PTPMode.MOVJ_ANGLE)
    return jsonify("Successfully moved."), 200

def reconnectDevice2():
    global dobot
    if len(list_ports.comports()) > 0:
        dobot = Dobot.Dobot(list_ports.comports()[0].device)
        return "Successfully reconnected.", 200
    else:
        return "Bad Request.", 500