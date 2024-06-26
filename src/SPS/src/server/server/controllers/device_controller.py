import connexion
from typing import Dict
from typing import Tuple
from typing import Union

from server.server.models.jobs_vom_geraet import JobsVomGeraet  # noqa: E501
from server.server.models.set_jobs import SetJobs  # noqa: E501
from server.server.models.start_job import StartJob  # noqa: E501
from server.server import util
import jobConfig
from sps.sps import triggerJob
from sps.sps import stopJob
from sps.sps import isBusy
from generated.client.openapi_client.api.device_api import DeviceApi
from generated.client.openapi_client import api_client
from generated.client.openapi_client import configuration as client_config
from generated.client.openapi_client import models as client_models
import time
import threading
from datetime import datetime

job_order = {}
last_stop = datetime.now()
job_running = False
last_job_id = None

def api_device_notstop_post():  # noqa: E501
    """instantly stops the job chain

     # noqa: E501


    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    # stopJob()
    last_stop = datetime.now()
    return 'Job stopped!'


def api_device_set_job_order_post(body):  # noqa: E501
    """sets the order of the jobs

     # noqa: E501

    :param set_jobs: set job order
    :type set_jobs: dict | bytes

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        set_jobs = SetJobs.from_dict(connexion.request.get_json())  # noqa: E501
        job_order[set_jobs.job_id] = set_jobs
    return 'job order is set!'


def api_device_set_monitor_ip_post(ip):  # noqa: E501
    """gets the ip from the monitor

     # noqa: E501

    :param ip: monitor ip
    :type ip: str

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    return 'NOT NEEDED!'


def api_device_start_job_post(body):  # noqa: E501
    """start job

     # noqa: E501

    :param start_job: start job
    :type start_job: dict | bytes

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        start_job = StartJob.from_dict(connexion.request.get_json())  # noqa: E501
        start_time = datetime.now()
        print("starting job: " + str(start_job.id))
        try:
            context : SetJobs = job_order[start_job.id]
        except KeyError:
            return ("Failed starting the job. Wrong UUID")
        job_thread = threading.Thread(target=trigger_and_send_job, args=(start_job, context,start_time))
        job_thread.start()
    return "Job gestartet"


def get_monitor_jobs():  # noqa: E501
    """Gets the jobs of the device

    Retrieves the jobs of the device. # noqa: E501


    :rtype: Union[JobsVomGeraet, Tuple[JobsVomGeraet, int], Tuple[JobsVomGeraet, int, Dict[str, str]]
    """
    
    return JobsVomGeraet(jobs=list(map(lambda j: j.job,jobConfig.jobList)))

# service functions

def trigger_and_send_job(start_job : StartJob, context : SetJobs,start_time : datetime):
    triggerJob(start_job.id)
    print("waiting until not busy")
    job_running = True
    last_job_id = start_job.id
    while isBusy(start_job.id):
        time.sleep(0.25)
    job_running = False
    print("*yay* its ready")
    deviceApi = DeviceApi(api_client.ApiClient(client_config.Configuration(context.next_device_ip + ":3000")))
    print("attempting to reach next device")
    if last_stop > start_time:
        return "Not Stopp"
    deviceApi.api_device_start_job_post(client_models.StartJob(id=context.next_job_id), 10)