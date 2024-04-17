import os
import threading
import schedule
import time
from sps.sps import readJobStatus

def send_status():
    try:
        monitor_ip = os.getenv("MONITOR_IP")
        if monitor_ip:
            response = requests.post(monitor_ip, json={"status": readJobStatus()})
            if response.status_code == 200:
                print("Status erfolgreich an die Webadresse gesendet.")
            else:
                print("Fehler beim Senden des Status. Statuscode:", response.status_code)
        else:
            print("Die Umgebungsvariable MONITOR_IP ist nicht gesetzt.")
    except Exception as e:
        print("Fehler beim Senden des Status:", e)

def schedule_task():
    schedule.every(1).minutes.do(send_status)
    while True:
        schedule.run_pending()
        time.sleep(1)

schedule_thread = threading.Thread(target=schedule_task)
schedule_thread.daemon = True
schedule_thread.start()