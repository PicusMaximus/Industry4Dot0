import requests
from flask import Flask, jsonify, request, render_template
from flask_swagger_ui import get_swaggerui_blueprint
from jobOrders import jobOrder 
from devices import deviceId
from classes import Dobot
from serial.tools import list_ports
import uuid

app = Flask(__name__, template_folder='./templates')
ports = list_ports.comports()
dobot = Dobot.Dobot(ports[0])
thisdict = {}

# __SERVER_IP__ = request.host.split(':')[0]
# This is is another possible way to get the server ip address... without staticly type it.
# __SERVER_IP__ = request.environ['SERVER_NAME']


#https://improved-giggle-5r4pwq4jx9349pq-3000.preview.app.github.dev/
# monitorIp = '10.231.70.82:3000'
monitorIp = 'https://improved-giggle-5r4pwq4jx9349pq-3000.preview.app.github.dev'

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
    
# @app.route("/api/device/setMonitorIp", methods=['POST'])
# def setMonitorIp():
#     monitorIp = request.args.get('ip')
#     print('The monitor with the ip of {ip} tryed to connect to this Dobot.'.format(ip=monitorIp))
#     return jsonify("Success"), 200

@app.route("/api/device/setJobOrder", methods=['POST'])
def setJobOrder(orderedJobs):
    jobOrder = orderedJobs
    return jsonify("New job order was successfully saved"), 200

@app.route("/api/device/setSuctionCupStatus", methods=['POST'])
def setSuctionCupStatus(suctionCupStatus):
    statusOfSuctionSup = suctionCupStatus
    return jsonify("Status of suction cup was successfully set"), 200

@app.route("/api/device/setPose", methods=['POST'])
def setPose(posname):
    position = dobot.pose_p()
    #thisdict.update(posname, position)
    print(position)
    return jsonify("Pose was successfully set"), 200

@app.route("/api/device/getPose", methods=['GET'])
def getPose():
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

@app.route("/api/device/startJob", methods=['POST'])
def startJob():

    id = request.args.get('ip')
    # Start job with given ip

    return jsonify("Success"), 200

@app.route("/api/device/notstop", methods=['Delete'])
def notstop():
    # Add function to stop the dobot here...
    return jsonify("Successfully stoped the running task."), 200

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
    json = jsonify({
        "ip": getServerIp(),
        "id": deviceId,
        "type": "dobot",
        "name": "dobot 1",
    })

    print('{base_path}/api/job'.format(base_path=monitorIp))

    try:
        response = requests.post(url='{base_path}/api/monitor/login'.format(base_path=monitorIp), json={
        "ip": getServerIp(),
        "id": str(deviceId),
        "type": "dobot",
        "name": "dobot 1",
    })
    except Exception as e:
        print(e)

    print(response.status_code)

    # return jsonify(response), 200
    return json, 200

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
    # return json, 200


@app.route('/', methods=['GET'])
def getIndexPage():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0') #host='192.168.178.95'
