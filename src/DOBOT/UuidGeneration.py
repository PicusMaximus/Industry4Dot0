import uuid
 
def generate_uuid_with_mac_seed(seed):
    mac_address = uuid.getnode()
    namespace = uuid.UUID(int=mac_address)
    uuid_with_mac_seed = uuid.uuid5(namespace, str(seed))
    return uuid_with_mac_seed