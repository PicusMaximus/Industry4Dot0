import sys
import os
import runpy

# python module path bullcrap cause i don't know how to do it properly
current_dir = os.path.dirname(os.path.abspath(__file__))
client_dir = os.path.join(current_dir,"generated","client")
server_dir = os.path.join(current_dir,"server","server")
sys.path.append(client_dir)
sys.path.append(server_dir)
print("adjusted sys paths")

# imports after modifying sys path
from dotenv import load_dotenv
from generated.client.openapi_client import MonitorApi
from generated.client.openapi_client import models as client_models
from generated.client.openapi_client import api_client
from generated.client.openapi_client import configuration as client_config


# config
load_dotenv()

monitorIP = os.getenv("MONITOR_IP")
registrationDevicename = os.getenv("DEVICENAME")
myIP = os.getenv("MY_IP")


monitorApi = MonitorApi(api_client.ApiClient(client_config.Configuration(monitorIP)))
print("attempting registration")
monitorApi.device_registration(client_models.Login(id="b805b5ce-43fd-4d42-b6c9-db40ce8a95d9",ip=myIP,name=registrationDevicename,type="SPS"),10)

print("registration done")
print("starting server")
runpy.run_path(server_dir)
