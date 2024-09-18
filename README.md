# CC-User-API

Dieses Projekt ist eine auf NestJS basierende API, die Benutzer verwaltet. Sie enthält Endpunkte zum Abrufen aller Benutzer, zum Finden eines Benutzers anhand der ID und nutzt verschiedene Decorators für Fehlerbehandlung, Validierung und Logging. Die API wird mit Swagger dokumentiert.

## Inhaltsverzeichnis

- [Installation](#installation)
- [API starten](#api-starten)
- [Swagger API Dokumentation](#swagger-api-dokumentation)
- [Endpunkte](#endpunkte)
- [Tests ausführen](#tests-ausführen)

## Installation

Um das Projekt lokal einzurichten, müssen folgende Schritte beachtet werden:

1. **Repository klonen**:

   ```bash
   git clone <repository-url>

   ```

1. **Abhängigkeiten installieren**:

   ```bash
   npm install

   ```

1. **.env Datei erstellen**:

Eine .env Datei im Ordner src/config muss erstellt werden. In dieser Datei muss der Pfad zur users.json Datei angegeben werden:

```bash
USERS_JSON_PATH=src/core/data/users.json
```

## API starten

Um die API zu starten, führe den folgenden Befehl aus:

```bash
npm run start
```
Dies startet die NestJS-Anwendung unter http://localhost:3000.

### API im Entwicklungsmodus (watch mode) starten:

```bash
npm run start:dev
```

Dies lädt den Server automatisch neu, wenn Änderungen an den Quelldateien vorgenommen werden.


## Swagger API Dokumentation

Sobald die API läuft, kann die Swagger-Dokumentation aufgerufen werden, um die verfügbaren Endpunkte zusehen.

- Swagger UI: http://localhost:3000/api

Swagger bietet eine interaktive Oberfläche, um die API-Endpunkte zu testen und die detaillierte Dokumentation anzusehen.


### Endpunkte

Die folgenden Endpunkte sind in der API verfügbar:

- GET /v1/users

    - Beschreibung: Ruft alle Benutzer ab.
    - Antwort:
      - 200: Erfolgreich, gibt ein Array von Benutzern zurück.
      - 404: Keine Benutzer gefunden.

- GET /v1/users/{id}

  - Beschreibung: Ruft einen Benutzer anhand der ID ab.
  - Parameter:
    - id (integer): Die ID des Benutzers.
  - Antwort:
    - 200: Erfolgreich, gibt den Benutzer zurück.
    - 404: Benutzer nicht gefunden.

## Tests ausführen

Das Projekt enthält sowohl Unit-Tests als auch einen End-to-End (e2e)-Test. Um die Tests auszuführen, werden folgenden Befehle benötigt:

### Unit Tests

```bash
npm run test:unit
```

Dieser Befehl führt die Unit-Tests im Verzeichnis test/unit aus.

### End-to-End (e2e) Tests

```bash
npm run test:e2e
```

Dieser Befehl führt die e2e-Tests aus, die sich im Verzeichnis test/e2e befinden.


### Test Coverage

Um einen Testabdeckungsbericht zu generieren, folgender Befehl:

```bash
npm run test:cov
```

Der Coverage-Bericht wird im Verzeichnis coverage generiert.

## Verzeichnisstruktur


```plaintext
cc-user-api
│
├── coverage
├── dist
├── node_modules
├── src
│   ├── app
│   │   ├── modules
│   │   │   └── users
│   │   │       ├── controllers
│   │   │       │   └── users.controller.ts
│   │   │       ├── dto
│   │   │       │   └── user.dto.ts
│   │   │       ├── entities
│   │   │       │   └── user.entity.ts
│   │   │       ├── mapper
│   │   │       │   └── user.mapper.ts
│   │   │       ├── repositories
│   │   │       │   └── users.repository.ts
│   │   │       ├── services
│   │   │       │   └── users.service.ts
│   │   │       ├── validators
│   │   │       │   └── users.validator.ts
│   │   │       └── users.module.ts
│   ├── app.module.ts
│   ├── config
│   │   └── .env
│   ├── core
│   │   ├── decorators
│   │   │   ├── combine-repository-decorators.decorator.ts
│   │   │   ├── file-not-found.decorator.ts
│   │   │   ├── invalid-json.decorator.ts
│   │   │   ├── io-error.decorator.ts
│   │   │   ├── throw-if-empty-list.decorator.ts
│   │   │   ├── throw-if-mapping-error.decorator.ts
│   │   │   ├── throw-if-null-or-undefined.decorator.ts
│   │   │   ├── validate-dto.decorator.ts
│   │   ├── exceptions
│   │   │   └── global-exception.filter.ts
│   │   ├── filters
│   │   │   └── http-exception.filter.ts
│   │   ├── http
│   │   │   └── error-response.ts
│   ├── data
│   │   ├── users.json
│   │   └── database
│   │       └── shared
│   ├── main.ts
├── test
│   ├── setup.ts
│   ├── e2e
│   │   ├── app.e2e-spec.ts
│   │   ├── unit
│   │   └── setup.ts
│   └── unit
│       └── users
│            ├── controllers
|            |   └── users.controller.spec.ts
│            ├── mapper
|            |   └── users.mapper.spec.ts
│            ├── repositories
|            |   └── users.repositories.spec.ts
│            ├── services
|            |   └── users.services.spec.ts
│            ├── validators
|            |   └── user.validators.spec.ts
```


- controllers/: Enthält die Controller-Klassen, die die API-Endpunkte definieren.
- dto/: Definiert die Data Transfer Objects (DTOs) für die Benutzerdaten.
- entities/: Enthält die Entitätsklassen für Benutzer.
- mapper/: Implementiert Mapping-Funktionen zwischen den DTOs und Entitäten.
- repositories/: Verwaltet den Zugriff auf Datenquellen (z.B. JSON-Dateien).
- services/: Enthält die Geschäftslogik der Anwendung.
- validators/: Definiert die Validatoren, die DTO-Daten validieren.

## Konfiguration

Die Anwendung verwendet Umgebungsvariablen, die in der Datei `.env` im Ordner `config/` definiert sind. Um den Pfade oder andere Umgebungsvariablen zu ändern muss die Datei angepasst werden.

- **USERS_JSON_PATH**: Definiert den Pfad zur `users.json` Datei, die als Datenquelle für die Benutzer verwendet wird.

Beispiel einer `.env` Datei:

```plaintext
USERS_JSON_PATH=src/core/data/users.json
```

Diese Umgebungsvariable wird verwendet, um den Speicherort der Benutzer-Datenquelle anzugeben. Anpassung des Pfades, wenn sich die Datei an einem anderen Ort befindet oder eine andere Quelle verwendet wird.

## Data Ordner

**users.json**: Eine Datei, die als Datenquelle für Benutzerinformationen verwendet wird. Diese JSON-Datei speichert eine Liste von Benutzern mit ihren Attributen wie ID, Name, E-Mail, etc.

```plaintext
[
  {
    "id": 1,
    "name": "Peter",
    "email": "john.doe@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  }
]

```

