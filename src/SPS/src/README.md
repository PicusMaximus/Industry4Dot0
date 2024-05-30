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

In den Einstellungen unter Schutz und Sicherheit muss Voller Zugriff aktiviert sein:
![Voller Zugriff](https://private-user-images.githubusercontent.com/18513746/258165938-5fcf864c-757e-4225-a4e7-aa86c70e00cf.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTcwNTEwMzIsIm5iZiI6MTcxNzA1MDczMiwicGF0aCI6Ii8xODUxMzc0Ni8yNTgxNjU5MzgtNWZjZjg2NGMtNzU3ZS00MjI1LWE0ZTctYWE4NmM3MGUwMGNmLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA1MzAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNTMwVDA2MzIxMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTg0NTVmYTVlNjk1M2UyOGIwZGQxOTdkOWY4N2MyMWJiMTAwYmQxMzFhMzI5NWRlZjQ0YjNmZjA2MGU5MTRkYTImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.W5KlNgJDIeggZJorL5gPcqQKgLHHsWwIQhf1_l6Sc8E)



Unter Verbindungsmechanismus muss PUT/GET erlaubt sein:
![PUT GET Aktivieren](https://private-user-images.githubusercontent.com/18513746/258166061-2e21079b-59b7-4db3-bca3-3c4f692619e9.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTcwNTEwMzIsIm5iZiI6MTcxNzA1MDczMiwicGF0aCI6Ii8xODUxMzc0Ni8yNTgxNjYwNjEtMmUyMTA3OWItNTliNy00ZGIzLWJjYTMtM2M0ZjY5MjYxOWU5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA1MzAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNTMwVDA2MzIxMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTVjZDQzNWQzODNhN2NmOWI3ODczOWJlYTk4YTJlZGU0OTE4YWQzYzc0ZmY3MDUxMWY0ODEzM2Y0NDUzMDYzYzkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.Mg4W4BlaWfC-ri1OzWxi_oM9-FdBz6ph39Vts8F12Zo)

Im Tia Projekt muss ein Datenblock angelegt werden. Dieser sollte mehrere Boolean Werte beeinhalten.
