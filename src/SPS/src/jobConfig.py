from server.server.models.job import Job
import UuidGeneration


class InternalJob:
    def __init__(self, id : int | None = None,spsIn: int | None = None, spsOut: int | None =None, job: Job | None = None):
        self.spsIn = spsIn
        self.spsOut = spsOut
        self.job = job

jobList : list[InternalJob] = [
    InternalJob(spsIn=0,spsOut=0, job=Job(id=UuidGeneration.generate_uuid_with_mac_seed(0), name="vor")),
    InternalJob(spsIn=1,spsOut=1, job=Job(id=UuidGeneration.generate_uuid_with_mac_seed(1), name="zurueck")),
]
