# Dobot Service Guide

## dobot.service Setup (Autostart):
1. Move the dobot.service file to /etc/systemd/system/
2. sudo systemctl daemon-reload
3. sudo systemctl enable dobot.service
4. sudo systemctl start dobot.service

## dobot.service Docu:
User: The user that should run the dobot python script

WorkingDirectory: The folder containing the python script
