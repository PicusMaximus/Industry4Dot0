from flask import Flask, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from time import sleep
from multiprocessing import Process
from DobotControl import runDobot
from DobotControl import forceStop
import DobotDllType as dType

app = Flask(__name__)

### swagger specific ###
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger.config.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "DOBOT-API"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
### end swagger specific ###

processes = []

def run():
    runDobot()

def emergencyStop():
    forceStop()


### api endpoints

@app.route("/start", methods=['POST'])
def startDoBot():
    proc = Process(target=run, daemon=True)
    processes.append(proc)
    proc.start()

    return jsonify("Hello World")

@app.route("/stop", methods=['POST'])
def stopDoBot():
    #dType.SetQueuedCmdStopExec(api)
    #ggf. die Query notfalls clearen um einen frischen Start zu haben
    return jsonify("Hello World"), 200

@app.route("/emergency-stop", methods=['POST'])
def emergencyStop():
    proc = Process(target=emergencyStop, daemon=True)
    process.append(proc)

    return jsonify("Hello World"), 200

@app.route("/position", methods=['POST'])
def position():
    # Do the stuff you need to do
    return jsonify("Hello World"), 200

@app.route("/login", methods=['POST'])
def login():
    # Do the stuff you need to do
    return jsonify("Hello World"), 200

if __name__ == '__main__':
    app.run(debug=True)