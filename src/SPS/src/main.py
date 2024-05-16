import sys
import os
import runpy
import asyncio
from UuidGeneration import generate_uuid_with_mac_seed
import threading
import schedule
import time

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
from datetime import datetime
from server.server.controllers.device_controller import job_running
from server.server.controllers.device_controller import last_job_id
# config
load_dotenv()

monitorIP = os.getenv("MONITOR_IP")
registrationDevicename = os.getenv("DEVICENAME")
myIP = os.getenv("MY_IP")

monitorApi = MonitorApi(api_client.ApiClient(client_config.Configuration(monitorIP)))
async def registration():
    print("attempting registration")
    monitorApi.device_registration(client_models.Login(id=str(generate_uuid_with_mac_seed(999999)),ip=myIP,name=registrationDevicename,type="SPS"),5)
    print("registration done")
asyncio.run(registration())

def send_status():
    print("sending status")
    if job_running:
        status = "job-gestartet"
    else:
        status = "job-beendet"
    monitorApi.api_monitor_log_post(
        client_models.StatusChanged(
            device_id=str(generate_uuid_with_mac_seed(999999)),
            timestamp=str(datetime.now().timestamp()),
            message="ganz schöner status",
            status=status,
            job_id=last_job_id
        )
    )

def schedule_task():
    schedule.every(1).seconds.do(send_status)
    while True:
        schedule.run_pending()
        time.sleep(1)

async def send_status_to_mfs():
    schedule_thread = threading.Thread(target=schedule_task)
    schedule_thread.daemon = True
    schedule_thread.start()
asyncio.run(send_status_to_mfs())

print("starting server")
runpy.run_path(server_dir)
