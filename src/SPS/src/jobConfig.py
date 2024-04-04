from server.server.models.job import Job
import uuid


class InternalJob:
    def __init__(self, id : int | None = None,spsIn: int | None = None, spsOut: int | None =None, job: Job | None = None):
        self.spsIn = spsIn
        self.spsOut = spsOut
        self.job = job

jobList : list[InternalJob] = [
    InternalJob(spsIn=0,spsOut=0, job=Job(id=uuid.uuid4(), name="vor")),
    InternalJob(spsIn=1,spsOut=1, job=Job(id=uuid.uuid4(), name="zurueck")),
]
