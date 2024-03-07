import snap7
import os

dbnumber = os.getenv("DB_NUMBER")
rack = os.getenv("RACK")
slot = os.getenv("SLOT")
spsIP = os.getenv("SPS_IP")

client = snap7.client.Client()
client.connect(spsIP, rack, slot)

def triggerJob(): {
    client.db_write(dbnumber,0,bytearray(b'\x01'))
}

def readJobStatus(): {
    client.db_read(dbnumber,0,1)
}
