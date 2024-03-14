from dotenv import load_dotenv
import snap7
import os
load_dotenv()
dbnumber = os.getenv("DB_NUMBER")
rack = os.getenv("RACK")
slot = os.getenv("SLOT")
spsIP = os.getenv("SPS_IP")

print(spsIP,rack,slot,dbnumber)

client = snap7.client.Client()
client.connect(spsIP, int(rack), int(slot))

def triggerJob(): {
    client.db_write(int(dbnumber),0,bytearray(b'\x01'))
}

def readJobStatus(): {
    client.db_read(dbnumber,0,1)
}
