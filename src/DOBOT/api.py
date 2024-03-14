from flask import Flask, jsonify, request, render_template
from flask_swagger_ui import get_swaggerui_blueprint
from devices import ws_url, app
import manager

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

### api endpoints
@app.route("/api/device/getPose", methods=['GET'])
def getPose():
    return manager.getPose2()

@app.route("/api/device/move", methods=['POST'])
def move_to():
    return manager.move_to_p()

@app.route("/api/device/setJob", methods=['POST'])
def setJob():
    jobName = request.json['job']
    return manager.setJob2(jobName)

@app.route("/api/device/startJob", methods=['POST'])
def startJob():
    id = request.args.get('ip')
    return manager.startJob2()

@app.route("/api/device/notstop", methods=['Delete'])
def notstop():
    return manager.notStop2()

@app.route("/api/device/start", methods=['POST'])
def start():
    return manager.start2()

@app.route("/api/device/home", methods=['POST'])
def home():
    return manager.home2()

@app.route("/api/device/setSuctionCupStatus", methods=["POST"])
def setSuctionCupStatus():
    suctionStatus = request.json['status']
    return manager.setSuctionCupStatus2()

@app.route("/api/device/setGripperStatus", methods=["POST"])
def setGripperStatus():
    gripperStatus = request.json['status']
    return manager.setGripperStatus2()

@app.route("/api/device/getJobs", methods=['GET'])
def getJobs():
    return manager.getJobs2()

@app.route("/api/monitor/login", methods=['POST'])
def login():
    return manager.login2()

@app.route("/api/monitor/log", methods=['POST'])
def log2Monitor():
    return manager.log2Monitor2()

@app.route("/api/device/move-step", methods=['POST'])
def moveDobot():
    mode = request.args.get('mode')
    direction = request.args.get('direction')
    return manager.moveDobot2()

@app.route("/api/device/reconnect", methods=['POST'])
def reconnectDevice():
    return manager.reconnectDevice2()


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
