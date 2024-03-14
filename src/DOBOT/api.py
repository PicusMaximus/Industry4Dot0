import requests
from flask import Flask, jsonify, request, render_template
from flask_swagger_ui import get_swaggerui_blueprint
from jobOrders import position
from devices import deviceId, ws_url
from classes.Enums import PTPMode
import uuid
from serial.tools import list_ports
from classes import Dobot

app = Flask(__name__, template_folder='./templates')
thisdict = {}
posDict = {}
orderedPositionsDict = {}

def connect2Dobot():
    if len(list_ports.comports()) > 0:
        return Dobot.Dobot(list_ports.comports()[0].device)

def connect2Dobot2():
    if len(list_ports.comports()) > 0:
        global dobot
        dobot = Dobot.Dobot(list_ports.comports()[0].device)

dobot = connect2Dobot()

if dobot == None:
    dobot = connect2Dobot2()

# __SERVER_IP__ = request.host.split(':')[0]
# This is is another possible way to get the server ip address... without staticly type it.
# __SERVER_IP__ = request.environ['SERVER_NAME']


#https://improved-giggle-5r4pwq4jx9349pq-3000.preview.app.github.dev/
# monitorIp = '10.231.70.82:3000'
monitorIp = 'http://10.5.101.129:3000'

### swagger specific ###
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger/swagger.config.yaml'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "DOBOT-API"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
### end swagger specific ###

#helper function
def getServerIp():
    return request.host.split(':')[0]
    # return request.environ['SERVER_NAME']Bin


### api endpoints
    
@app.route("/api/device/setPose", methods=['POST'])
def setPose(posname):
    global position

    position = dobot.pose_p()
    posDict.update(posName, position)
    return jsonify("Pose was successfully set"), 200

@app.route("/api/device/getPose", methods=['GET'])
def getPose():
    global position


    if dobot is None:
        return "hello world"

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

@app.route("/api/device/move", methods=['POST'])
def move_to():
    global position


    if position != None: 
        dobot.move_to_p(position)
    
    return jsonify(position), 200

@app.route("/api/device/setJob", methods=['POST'])
def setJob():
    jobName = request.json['job']
    job = job(jobName, [])
    orderedPositionsDict.update(jobName, positions)
    return jsonify("Job was successfully set"), 200

@app.route("/api/device/startJob", methods=['POST'])
def startJob():

    id = request.args.get('ip')
    # Start job with given ip

    return jsonify("Success"), 200

@app.route("/api/device/notstop", methods=['Delete'])
def notstop():

    # Force stop the queue from executing
    if dobot.forceStop():
        # Clear the queue
        # This makes the behavior more calculatable...
        dobot.clear()
        return jsonify("Successfully stoped the running task."), 200
    else:
        return jsonify("Failed to stop the running task."), 400

@app.route("/api/device/start", methods=['POST'])
def start():
    if dobot.start():
        return jsonify("Successfully stoped the running task."), 200
    else:
        return jsonify("Failed to stop the running task."), 400

@app.route("/api/device/home", methods=['POST'])
def home():
    if dobot.home():
        return jsonify("Successfully stoped the running task."), 200
    else:
        return jsonify("Failed to stop the running task."), 400


@app.route("/api/device/setSuctionCupStatus", methods=["POST"])
def setSuctionCupStatus():
    #This enables or disables the Suction-Cup
    suctionStatus = request.json['status']
    if dobot.suck(suctionStatus):
        return jsonify("Setting suction cup status successful."), 200
    else:
        return jsonify("Setting suction cup status unsuccessful."), 400


@app.route("/api/device/setGripperStatus", methods=["POST"])
def setGripperStatus():
    #This enables or disables the Gripper
    gripperStatus = request.json['status']
    if dobot.grip(suctionStatus):
        return jsonify("Setting Gripper status successful."), 200
    else:
        return jsonify("Setting Gripper status unsuccessful."), 400


@app.route("/api/device/getJobs", methods=['GET'])
def getJobs():
    #This is just for debugging purpose...
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

@app.route("/api/monitor/login", methods=['POST'])
def login():
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

    return jsonify("response"), 200
    # return json, 200

@app.route("/api/monitor/log", methods=['POST'])
def log2Monitor():

    json = jsonify({
        "ip": getServerIp(),
        "id": deviceId,
        "type": "dobot",
        "name": "dobot 1",
    })

    requests.post(url='http://{ip}/api/monitor/log'.format(ip=monitorIp), json=json)
    return jsonify("Success"), 200

@app.route("/api/device/move-step", methods=['POST'])
def moveDobot():
    mode = request.args.get('mode')
    direction = request.args.get('direction')
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
    return jsonify("Success"), 200

@app.route("/api/device/reconnect", methods=['POST'])
def reconnectDevice():
    global dobot
    if len(list_ports.comports()) > 0:
        dobot = Dobot.Dobot(list_ports.comports()[0].device)
        return "Success", 200
    else:
        return "Bad Request", 500

#### HTML SECTION ####

@app.route('/', methods=['GET'])
def getIndexPage():
    print(ws_url)
    return render_template('home.html', data = { "wsUrl": ws_url })

@app.route('/task', methods=['GET'])
def getTaskPage():
    print(ws_url)
    return render_template('task.html', data = { "wsUrl": ws_url })

@app.route('/movement-card', methods=['GET'])
def getMovementCardPartial():
    return render_template('movement-card.html')

@app.route('/about', methods=['GET'])
def getAboutPage():
    return render_template('about.html', data = { "wsUrl": ws_url })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port="3000") #host='192.168.178.95'
