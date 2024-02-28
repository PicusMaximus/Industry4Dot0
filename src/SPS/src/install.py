import subprocess
import os

script_dir = os.path.dirname(os.path.realpath(__file__))
print("if something goes wrong, the script will continue anyway. Good luck!")

print("installing base requirements")
subprocess.run(['pip', 'install', '-r', 'requirements.txt', '--user'], cwd=script_dir)

print("installing client requirements")
subprocess.run(['pip', 'install', '-r', os.path.join(script_dir, 'generated', 'client', 'requirements.txt'), '--user'])

print("installing server requirements")
subprocess.run(['pip', 'install', '-r', os.path.join(script_dir, 'server', 'requirements.txt'), '--user'])

print("running client setup")
subprocess.run(['python', os.path.join(script_dir, 'generated', 'client', 'setup.py'), 'install', '--user'])

print("running server setup")
subprocess.run(['python', os.path.join(script_dir, 'server', 'setup.py'), 'install', '--user'])
print("install.py reached the end. Maybe it worked, maybe it didn't ¯\_(ツ)_/¯")
