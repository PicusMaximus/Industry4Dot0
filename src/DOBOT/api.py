from flask import Flask, jsonify, request, render_template
from flask_swagger_ui import get_swaggerui_blueprint
from devices import ws_url
import manager

### -------------------------------------------------------------------------------------------------- ###

app = Flask(__name__, template_folder='./templates')

### -------------------------------------------------------------------------------------------------- ###

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

### -------------------------------------------------------------------------------------------------- ###

### api endpoints

### -------------------------------------------------------------------------------------------------- ###

### extern ###

### -------------------------------------------------------------------------------------------------- ###

### GET ###

@app.route("/api/device/getJobs", methods=['GET'])
def getJobs():
    res = manager.get_jobs()
    return jsonify(res), 200

### END GET ###

### -------------------------------------------------------------------------------------------------- ###

### POST ###

# @app.route("/api/device/setJobOrder", methods=['POST'])
# def setJobOrder():
#     jobName = request.json['job']
#     return

@app.route("/api/device/startJob", methods=['POST'])
def startJob():
    id = request.args.get('ip')
    res = manager.start_job()
    return jsonify(res), 200        

@app.route("/api/device/start", methods=['POST'])
def start():
    manager.start()
    return jsonify("Successfully started the Dobot."), 200

@app.route("/api/monitor/login", methods=['POST'])
def login():
    manager.login()
    return jsonify("Login successful."), 200

@app.route("/api/monitor/log", methods=['POST'])
def log2Monitor():
    manager.send_log()
    return jsonify("Log successful."), 200

### END POST ###

### -------------------------------------------------------------------------------------------------- ###

### DELETE ###

@app.route("/api/device/notstop", methods=['Delete'])
def notstop():
    manager.emergency_stop()
    return jsonify("Successfully stoped the running task."), 200

### END DELETE ###

### -------------------------------------------------------------------------------------------------- ###

### internal api ###

### -------------------------------------------------------------------------------------------------- ###

### GET ###

@app.route("/api/device/pose", methods=['GET'])
def getPose():
    pos = manager.get_pose()

    return jsonify(pos), 200

### END GET ###

### -------------------------------------------------------------------------------------------------- ###

### POST ###

@app.route("/api/device/home", methods=['POST'])
def home():
    manager.home()
    return jsonify("Successfully moved to home position."), 200

@app.route("/api/device/move", methods=['POST'])
def move_to():
    manager.move_to_p()
    return jsonify("Successfully moved to position"), 200

@app.route("/api/device/suction-cup/status", methods=["POST"])
def setSuctionCupStatus():
    status = request.json['status']
    manager.update_suction_cup_status(status)
    return jsonify("Successfuly set the suction cup status."), 200

@app.route("/api/device/gripper/status", methods=["POST"])
def setGripperStatus():
    status = request.json['status']
    manager.update_gripper_status(status)
    return jsonify("Successfully set the gripper status."), 200


@app.route("/api/device/move-step", methods=['POST'])
def moveDobot():
    mode = request.args.get('mode')
    direction = request.args.get('direction')
    steps = request.args.get('steps')

    manager.move_step(mode, direction, steps)

    return jsonify("Success"), 200

@app.route("/api/device/reconnect", methods=['POST'])
def reconnectDevice():
    manager.reconnect()
    return jsonify("Successfully reconnected"), 200

### END POST ###

### -------------------------------------------------------------------------------------------------- ###

### internal api ###

### -------------------------------------------------------------------------------------------------- ###

### HTML SECTION ###

@app.route('/', methods=['GET'])
def getIndexPage():
    return render_template('home.html', data = { "wsUrl": ws_url })

@app.route('/task', methods=['GET'])
def getTaskPage():
    return render_template('task.html', data = { "wsUrl": ws_url })

@app.route('/movement-card', methods=['GET'])
def getMovementCardPartial():
    return render_template('movement-card.html')

@app.route('/movement-card', methods=['GET'])
def getMovementCardPartial():
    return render_template('movement-card.html')

@app.route('/about', methods=['GET'])
def getAboutPage():
    return render_template('about.html', data = { "wsUrl": ws_url })

### END HTML SECTION ###

### -------------------------------------------------------------------------------------------------- ###

if __name__ == '__main__':
    app.run(host='0.0.0.0', port="3000")
