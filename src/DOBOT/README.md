# Dobot Guide

## Publish to pi
1. Move DOBOT folder into the pi user folder
2. Follow the steps in service README file to start the DOBOT API automaticly on pi startup

## Setup project
1. Go into the project folder
2. sudo apt install python3 npm
3. pip3 install cherrypy ws4py pyserial jinja2 requests flask flask_swagger_ui --break-system-packages
4. Go into static folder and run:
   
   npm install
   
   npm run build

## Run via terminal
Go into the project folder and run this command: python3 ./api.py

