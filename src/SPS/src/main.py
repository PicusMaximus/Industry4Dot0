import sys
import os

# python module path bullcrap cause i don't know how to do it properly
current_dir = os.path.dirname(os.path.abspath(__file__))
client_dir = os.path.join(current_dir,"generated","client")
sys.path.append(client_dir)
print("adjusted sys paths")

# imports after modifying sys path
from dotenv import load_dotenv
from generated.client.openapi_client import MonitorApi
from generated.client.openapi_client import models as client_models
from generated.client.openapi_client import api_client
from generated.client.openapi_client import configuration as client_config

# config
load_dotenv()

monitorApi = MonitorApi(api_client.ApiClient(client_config.Configuration(os.getenv("MONITOR_IP"))))
print("attempting registration")
monitorApi.device_registration(client_models.Login(),10)
print("registration done")