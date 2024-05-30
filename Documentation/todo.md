# TODO SPS

- Die Konfigurationen in der .env Datei. Sollten im Frontend des SPS Projektes konfigurierbar gemacht werden:

MONITOR_IP=192.168.0.1
DEVICENAME=SPS
DB_NUMBER=1
RACK=0
SLOT=1

- Python venv einrichten um das ganze einfacher zu deployen und nicht alles global installieren zu müssen. Mach die Installation auf einen RaspberryiPI auch einfacher.
- Statusmeldungen nicht mehr in regelmäßigen Abständen an den Monitor senden, sondern nur bei Statusänderungen
- Implemenetation des NotStops testen
- Das Frontend für die SPS ist gerade nur eine View. Es verschickt momentan keine HTTP-Requests. Das bedeutet es muss noch im Backend implementiert oder aufgerufen werden muss.
- Einfach verständliche Log nachrichten im Frontend. (job x wurde gestartet, Gerät x wurde angesprochen)
- Aktiver Job in der Job Liste des Frontends sollte erkennbar sein. Z.B. Aufleuchten während dieser ausgeführt wird.
- Die IP-Adresse des eigenen Geräts sollte automatisch erkannt werden. Momentan wird diese Konfiguriert.
- Die Jobs sind momentan hier hinterlegt: https://github.com/PicusMaximus/Industry4Dot0/blob/main/src/SPS/src/jobConfig.py. Diese müssen im Frontent Konfigurierbar sein.
  - SPS IN / SPS OUT wird nicht mehr verwendet. Es wird nur einer dieser Werte genutzt.
  - Die Zahl die bei SPS IN/ OUT steht verweist auf den Offset in der Datenbank der SPS.
