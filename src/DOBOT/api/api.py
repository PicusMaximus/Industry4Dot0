from flask import Flask, jsonify, request
from flask_swagger_ui import get_swaggerui_blueprint

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


### api endpoints

@app.route("/start", methods=['POST'])
def startDoBot():
    # Do the stuff you need to do
    return jsonify(processResult)

@app.route("/stop", methods=['POST'])
def stopDoBot():
    # Do the stuff you need to do
    return jsonify(processResult), 200

@app.route("/emergency-stop", methods=['POST'])
def emergencyStop():
    # Do the stuff you need to do
    return jsonify(), 200

@app.route("/position", methods=['POST'])
def position():
    # Do the stuff you need to do
    return jsonify(), 200

@app.route("/login", methods=['POST'])
def login():
    # Do the stuff you need to do
    return jsonify(), 200

if __name__ == '__main__':
    app.run(debug=True)