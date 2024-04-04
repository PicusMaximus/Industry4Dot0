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
from generated.client.openapi_client import DeviceApi
from generated.client.openapi_client import api_client
from generated.client.openapi_client import configuration as client_config
from generated.client.openapi_client import models as client_models
import time


def api_device_notstop_delete():  # noqa: E501
    """stops the jobs

     # noqa: E501


    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    stopJob()
    return 'Job stopped!'


def api_device_set_job_order_post(set_jobs):  # noqa: E501
    """sets the order of the jobs

     # noqa: E501

    :param set_jobs: set job order
    :type set_jobs: dict | bytes

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        set_jobs = SetJobs.from_dict(connexion.request.get_json())  # noqa: E501
        triggerJob(set_jobs.id)
        # todo wait for job to be done
        print("attempting to reach next device")
        deviceApi = DeviceApi(api_client.ApiClient(client_config.Configuration(set_jobs.next_device_ip + ":3000")))
        while (isBusy(set_jobs.job_id)):
            time.sleep(0.25)
        deviceApi.api_device_start_job_post(client_models.StartJob(id=set_jobs.next_job_id),10)
    return 'job order is set!'


def api_device_set_monitor_ip_post(ip):  # noqa: E501
    """gets the ip from the monitor

     # noqa: E501

    :param ip: monitor ip
    :type ip: str

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    return 'NOT NEEDED!'


def api_device_start_job_post(start_job):  # noqa: E501
    """start job

     # noqa: E501

    :param start_job: start job
    :type start_job: dict | bytes

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        start_job = StartJob.from_dict(connexion.request.get_json())  # noqa: E501
        triggerJob(start_job.id)
    return "das hat bestimmt funktioniert"


def get_monitor_jobs():  # noqa: E501
    """Gets the jobs of the device

    Retrieves the jobs of the device. # noqa: E501


    :rtype: Union[JobsVomGeraet, Tuple[JobsVomGeraet, int], Tuple[JobsVomGeraet, int, Dict[str, str]]
    """
    
    return JobsVomGeraet(jobs=map(lambda j: j.job,jobConfig.jobList))
