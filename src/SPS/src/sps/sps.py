from dotenv import load_dotenv
import snap7
import os
from jobConfig import InternalJob, jobList
load_dotenv()
dbnumber = os.getenv("DB_NUMBER")
rack = os.getenv("RACK")
slot = os.getenv("SLOT")
spsIP = os.getenv("SPS_IP")
client = snap7.client.Client()
def connect():
    client.connect(spsIP, int(rack), int(slot))

def login_if_needed():
    if not client.get_connected:
        connect()
        
def get_internal_job(id):
    def filter_id(internaljob):
        return internaljob.job.id == id
    internalJob : InternalJob = filter(filter_id,jobList)[0]
    return internalJob

def triggerJob(id):
    login_if_needed()
    client.db_write(int(dbnumber),get_internal_job(id).spsIn,bytearray(b'\x01'))


def readJobStatus(): 
    login_if_needed()
    client.db_read(dbnumber,0,1)

def stopJob():
    print("stopping of jobs not implemented")
    
def isBusy(id):
    internalJob : InternalJob = get_internal_job(id)
    login_if_needed()
    client.db_read(dbnumber,internalJob.spsOut,internalJob.spsOut + 1)