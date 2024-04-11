# Dobot Service Guide

## dobot.service (and dobotapi.service) Setup (Autostart):
1. sudo mv dobot.service (and dobotapi.service) /etc/systemd/system/
2. sudo systemctl daemon-reload
3. sudo systemctl enable dobot.service (and dobotapi.service)
4. sudo systemctl start dobot.service (and dobotapi.service)

## dobot.service Docu:
User: The user that should run the dobot python script

WorkingDirectory: The folder containing the python script
