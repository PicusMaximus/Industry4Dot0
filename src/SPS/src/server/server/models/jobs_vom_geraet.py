from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from server.server.models.base_model import Model
from server.server.models.job import Job
from server.server import util

from server.server.models.job import Job  # noqa: E501

class JobsVomGeraet(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, device_id=None, jobs=None):  # noqa: E501
        """JobsVomGeraet - a model defined in OpenAPI

        :param device_id: The device_id of this JobsVomGeraet.  # noqa: E501
        :type device_id: str
        :param jobs: The jobs of this JobsVomGeraet.  # noqa: E501
        :type jobs: List[Job]
        """
        self.openapi_types = {
            'device_id': str,
            'jobs': List[Job]
        }

        self.attribute_map = {
            'device_id': 'deviceId',
            'jobs': 'jobs'
        }

        self._device_id = device_id
        self._jobs = jobs

    @classmethod
    def from_dict(cls, dikt) -> 'JobsVomGeraet':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The JobsVomGeraet of this JobsVomGeraet.  # noqa: E501
        :rtype: JobsVomGeraet
        """
        return util.deserialize_model(dikt, cls)

    @property
    def device_id(self) -> str:
        """Gets the device_id of this JobsVomGeraet.


        :return: The device_id of this JobsVomGeraet.
        :rtype: str
        """
        return self._device_id

    @device_id.setter
    def device_id(self, device_id: str):
        """Sets the device_id of this JobsVomGeraet.


        :param device_id: The device_id of this JobsVomGeraet.
        :type device_id: str
        """
        if device_id is None:
            raise ValueError("Invalid value for `device_id`, must not be `None`")  # noqa: E501

        self._device_id = device_id

    @property
    def jobs(self) -> List[Job]:
        """Gets the jobs of this JobsVomGeraet.


        :return: The jobs of this JobsVomGeraet.
        :rtype: List[Job]
        """
        return self._jobs

    @jobs.setter
    def jobs(self, jobs: List[Job]):
        """Sets the jobs of this JobsVomGeraet.


        :param jobs: The jobs of this JobsVomGeraet.
        :type jobs: List[Job]
        """
        if jobs is None:
            raise ValueError("Invalid value for `jobs`, must not be `None`")  # noqa: E501

        self._jobs = jobs
