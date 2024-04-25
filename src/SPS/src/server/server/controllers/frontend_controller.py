import connexion
from typing import Dict
from typing import Tuple
from typing import Union

from server.server import util

@route("/")
def start_frontend():

    return render_template('/src/SPS/static/index.html')