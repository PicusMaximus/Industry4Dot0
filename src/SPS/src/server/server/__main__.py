#!/usr/bin/env python3

import connexion

from server.server import encoder
from flask import render_template
from flask_cors import CORS


def main():
    print("server is starting")
    app = connexion.App(__name__, specification_dir='./openapi/')
    app.app.json_encoder = encoder.JSONEncoder
    CORS(app.app)
    app.add_api('openapi.yaml',
                arguments={'title': 'Swagger Maschinenpark'},
                pythonic_params=True)
    @app.route("/")
    def frontend_dinge():
        return render_template('index.html')
    app.run(port=3000)
main()