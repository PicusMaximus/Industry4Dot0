# SPS

Diese Anwendung nutzt Snap7 (<https://snap7.sourceforge.net/>) um mit einer SPS zu kommunizieren.

## Requirements

- Python 3.12.3
- pip 24.0

## Setup

Run

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

## TIA Portal Setup

Sollte jemand selber ein Tia Projekt von Grund auf erstellen wollen, folgendes muss gemacht werden damit das Funktioniert:

- In den Einstellungen unter Schutz und Sicherheit muss Voller Zugriff aktiviert sein
- Unter Verbindungsmechanismus muss PUT/GET erlaubt sein
- Im Tia Projekt muss ein Datenbank angelegt werden. Dieser sollte mehrere Boolean Werte beeinhalten. Diese werden später Referenziert bei der Definition von Jobs.
