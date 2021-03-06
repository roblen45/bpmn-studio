# BPMN-Studio

BPMN-Studio ist eine Web-Applikation zur Erstellung, Verwaltung,
Ausführung und Auswertung von BPMN-Prozessen.
Es setzt auf dem BPMN.io auf und den BPMN-Standard 2.x um.

## Was sind die Ziele dieses Projekts?

BPMN-Studio soll es dem Anwender so leicht wie möglich machen BPMN-Diagramme
zu erstellen und zu pflegen.
Des Weiteren kann BPMN-Studio mit einer Workflow Engine verbunden werden,
um diese Diagramme auszuführen.

## Relevante URLs

* https://github.com/process-engine/process_engine - Process Engine
* https://github.com/process-engine/documentation - Dokumentation
* https://github.com/process-engine/skeleton - Minimaler Seketon

## Wie kann ich das Projekt aufsetzen?

### Voraussetzungen

* Node `>= 6.1.0`
* Laufende ProcessEngine

### Setup/Installation

```shell
npm install
```

## Wie kann ich das Projekt benutzen?


### Benutzung

**Zum bauen:**

```shell
npm run build
```

Dieses Skript baut die Anwendung, das Ergebnis ist produktionsreif.

**Zum starten:**

```shell
npm start
```

Dieses Skript startet die statische Auslieferung der Anwendung auf Port 9000.
Zuerst muss die Anwendung gebaut sein.

**Zum starten (Entwicklung)**

```shell
npm run start_dev
```

Dieses Skript startet die Auslieferung der Anwendung für die Entwicklung.
Bei Änderungen im Quelltext wird die Anwendung neugebaut und der Webbrowser
automatisch neugeladen.

**End-to-End-Test**

Start the webserver:

```shell
npm start
```
Open another terminal and start the Selenium server:

```shell
npm run integration-test-init
```

Finally run your tests:

```shell
npm run integration-test
```

## Was muss ich sonst noch wissen?

Die Konfiguration liegt unter `aurelia_project/environments/dev|stage|prod.ts`.

### Wen kann ich auf das Projekt ansprechen?

* Alexander Kasten <alexander.kasten@5minds.de>
* Paul Heidenreich <paul.heidenreich@5minds.de>

### Verwandte Projekte

* https://github.com/process-engine/process_engine - Process Engine
* https://github.com/process-engine/documentation - Dokumentation
* https://github.com/process-engine/skeleton - Minimaler Seketon

### Lizenzen

> **TODO:**
