# SPS

Diese Anwendung nutzt Snap7 (<https://snap7.sourceforge.net/>) um mit einer SPS zu kommunizieren.

## Requirements

- Python 3.12.3
- pip 24.0

## Setup

1. Navigiere zu /src/sps/src
2. Starte install.py

```python
python install.py
```

3. Erstelle eine .env und  füge Konfiguration hinzu, siehe `.env.example` für Konfigurationsmöglichkeiten

## Run

1. Navigiere zu /src/sps/src
2. Starte main.py

```python
python main.py
```

## Wie "Jobs" an der SPS gestarten werden

Wenn das SPS Python Projekt einen Job starten möchte, wird über die Snap7 Libary eine TCP Verbindung erstellt und auf dem Speicherbereich der Konfigurierten (.env) SPS Datenbank zugegriffen.
Der genaue Wert auf dem Zugegriffen wird, wird über die Jobconfig entschieden (https://github.com/PicusMaximus/Industry4Dot0/blob/main/src/SPS/src/jobConfig.py). Das sind die IN/OUT Werte.
Wobei nur SPS IN gerade verwendet wird. Der Wert in der SPS Datenbank wird dann auf 1 gesetzt.
Ein Netzwerke in dem SPS Programmbaustein kann dann auf den veränderten Wert reagieren -> irgendetwas ausführen -> und **muss** dan selber den Wert wieder auf 0 setzen.
Das SPS Python Projekt sieht dann, dass dieser Wert wieder 0 ist und sieht den Job als abgeschlossen an. 

## TIA Portal Setup

Das in diesem Repo befindliche Tia Projekt ist bereits komplett eingerichtet und beeinhaltet Bausteine zur Steuerung von Fliesbändern.
Sollte jemand selber ein Tia Projekt von Grund auf erstellen wollen, folgendes muss gemacht werden damit das Funktioniert:

- In den Einstellungen unter Schutz und Sicherheit muss Voller Zugriff aktiviert sein
- Unter Verbindungsmechanismus muss PUT/GET erlaubt sein
- Im Tia Projekt muss ein Datenbank angelegt werden. Dieser sollte mehrere Boolean Werte beeinhalten. Diese werden später Referenziert bei der Definition von Jobs.
