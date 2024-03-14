from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401
from server.server import util
from server.server.models.base_model import Model

class Job(Model):
    def __init__(self, id=None, name=None):  # noqa: E501
        self.openapi_types = {
            'id': str,
            'name': str,
        }
        self.attribute_map = {
            'id': 'id',
            'name': 'name'
        }
        self._id = id
        self._name = name

    @classmethod
    def from_dict(cls, dikt) -> 'Job':
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> str:
        return self._id

    @id.setter
    def id(self, id: str):
        self._id = id

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, name: str):
        self._name = name
