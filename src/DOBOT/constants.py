from UuidGenerartor import generate_uuid_with_mac_seed

LOG_STATUS = [ 'job-gestartet', 'job-beendet' ]

SEED = 666

DEVICE_ID = generate_uuid_with_mac_seed(SEED)