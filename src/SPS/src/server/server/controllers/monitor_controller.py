import connexion
from typing import Dict
from typing import Tuple
from typing import Union

from server.server.models.login import Login  # noqa: E501
from server.server.models.status_changed import StatusChanged  # noqa: E501
from server.server import util


def api_log_post(status_changed=None):  # noqa: E501
    """status changed

     # noqa: E501

    :param status_changed: post status changed
    :type status_changed: dict | bytes

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        status_changed = StatusChanged.from_dict(connexion.request.get_json())  # noqa: E501
    return 'NOT NEEDED!'


def device_registration(login):  # noqa: E501
    """registration

    registration # noqa: E501

    :param login: post login
    :type login: dict | bytes

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        login = Login.from_dict(connexion.request.get_json())  # noqa: E501
    return 'NOT NEEDED!'
