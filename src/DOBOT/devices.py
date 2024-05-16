from flask import request
from UuidGenerartor import generate_uuid_with_mac_seed

def getServerIp():
    return request.host.split(':')[0]

seed = 666

deviceId = generate_uuid_with_mac_seed(seed)