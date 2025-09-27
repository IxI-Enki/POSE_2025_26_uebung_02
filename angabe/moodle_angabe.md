# Übung

Quelle: [https://edufs.edu.htl-leonding.ac.at/moodle/mod/assign/view.php?id=214265](https://edufs.edu.htl-leonding.ac.at/moodle/mod/assign/view.php?id=214265)

## Details

### Assignment

- Title: 2526_78ABIF_78ACIF_POS_GEHR
- URL: <https://edufs.edu.htl-leonding.ac.at/moodle/mod/assign/view.php?id=214265>
- Fällig: Dienstag, 30. September 2025, 00:00

#### Description

Siehe die folgenden Abschnitte für die vollständige Beschreibung.

## SEeToDoList

**Inhaltsverzeichnis:**

- [Übung](#übung)
  - [Details](#details)
    - [Assignment](#assignment)
      - [Description](#description)
  - [SEeToDoList](#seetodolist)
  - [Einleitung](#einleitung)
  - [Projektstruktur](#projektstruktur)
  - [Datenstruktur](#datenstruktur)
    - [Tabelle: TdList (Aufgabenlisten)](#tabelle-tdlist-aufgabenlisten)
    - [Tabelle: TdTask (Aufgaben)](#tabelle-tdtask-aufgaben)
    - [Validierung](#validierung)
      - [TdList Validierungsregeln](#tdlist-validierungsregeln)
      - [TdTask Validierungsregeln](#tdtask-validierungsregeln)
      - [Datenbank-Constraints](#datenbank-constraints)
      - [Frontend-Validierung](#frontend-validierung)
  - [Backend](#backend)
    - [CSV-Import](#csv-import)
  - [Frontend](#frontend)
    - [Angular Web App](#angular-web-app)
    - [MVVM Desktop App (Avalonia)](#mvvm-desktop-app-avalonia)
  - [API](#api)
  - [Test](#test)
  - [Abgabestatus](#abgabestatus)
  - [Anhänge](#anhänge)

---

## Einleitung

Das Projekt **SEeToDoList** ist eine umfassende Anwendung zur Verwaltung von Aufgabenlisten und deren Aufgaben.
Benutzer können Listen erstellen, Aufgaben hinzufügen, bearbeiten, als erledigt markieren und priorisieren.

Die Anwendung bietet mehrere Frontend-Optionen:

- **Angular Web-Anwendung** für moderne Browser
- **Avalonia MVVM Desktop-Anwendung** für plattformübergreifende Desktop-Nutzung
- **REST API** für Integration mit anderen Systemen

---

## Projektstruktur

Das Solution umfasst folgende Projekte:

| Projekt | Beschreibung |
|---------|-------------|
| **SEeToDoList.Logic** | Kernlogik mit Entitäten, Datenkontext und Geschäftslogik |
| **SEeToDoList.Common** | Gemeinsame Contracts, Modelle und Utilities |
| **SEeToDoList.WebApi** | REST API für Frontend-Anbindung |
| **SEeToDoList.AngularApp** | Angular-Frontend mit Bootstrap |
| **SEeToDoList.MVVMApp** | Avalonia Desktop-Anwendung |
| **SEeToDoList.ConApp** | Konsolenanwendung für Datenimport und Tests |
| **SEeToDoList.CodeGenApp** | Code-Generator für Template-basierte Entwicklung |
| `TemplateTools.*` | Template- und Code-Generator Tools |

---

## Datenstruktur

Das System besteht aus den folgenden Haupt-Entitäten:

### Tabelle: TdList (Aufgabenlisten)

| Name | Type | Nullable | MaxLength | Beschreibung |
|------|------|----------|-----------|--------------|
| Name | String | No | 100 | Name der Aufgabenliste |
| Description | String | Yes | 500 | Beschreibung der Liste |
| CreatedOn | DateTime | No | --- | Datum der Erstellung |
| CompletedOn | DateTime | Yes | --- | Berechnetes Datum der Fertigstellung (abgeleitet) |

### Tabelle: TdTask (Aufgaben)

| Name | Type | Nullable | MaxLength | Beschreibung |
|------|------|----------|-----------|--------------|
| Title | String | No | 200 | Titel der Aufgabe |
| Description | String | Yes | 1000 | Detaillierte Beschreibung der Aufgabe |
| DueDate | DateTime | Yes | --- | Fälligkeitsdatum der Aufgabe |
| CompletedOn | DateTime | Yes | --- | Datum der Fertigstellung |
| IsCompleted | Boolean | No | --- | Gibt an, ob die Aufgabe abgeschlossen ist |
| Priority | Int32 | No | --- | Priorität als Zahl (1=hoch, 3=niedrig) |
| TdListId | IdType | No | --- | Fremdschlüssel zu **TdList** |

### Validierung

Das System implementiert umfassende Validierungsregeln auf mehreren Ebenen:

#### TdList Validierungsregeln

- **Name (erforderlich)**: Darf nicht leer oder nur Leerzeichen enthalten
- **Eindeutigkeit**: Der `Name` muss systemweit eindeutig sein (Unique Index)
- **Task-Titel Eindeutigkeit**: Alle Task-Titel innerhalb einer Liste müssen eindeutig sein
- **BusinessRuleException**: Bei Verletzung wird eine spezifische Geschäftsregel-Exception geworfen

#### TdTask Validierungsregeln

- **Title (erforderlich)**: Darf nicht leer oder nur Leerzeichen enthalten
- **Eindeutigkeit**: Kombination aus `TdListId` + `Title` muss eindeutig sein (Composite Unique Index)
- **Konsistenz**: Wenn `IsCompleted = true`, dann muss `CompletedOn` einen Wert haben
- **Referenzielle Integrität**: `TdListId` muss auf eine existierende Liste verweisen
- **BusinessRuleException**: Bei Verletzung wird eine spezifische Geschäftsregel-Exception geworfen

#### Datenbank-Constraints

```sql
-- Eindeutige Indizes
CREATE UNIQUE INDEX IX_TdLists_Name ON TdLists (Name);
CREATE UNIQUE INDEX IX_TdTasks_TdListId_Title ON TdTasks (TdListId, Title);

-- MaxLength Constraints
TdList.Name: MAX 100 Zeichen
TdList.Description: MAX 500 Zeichen
TdTask.Title: MAX 200 Zeichen
TdTask.Description: MAX 1000 Zeichen
```

#### Frontend-Validierung

- **Angular**: Reactive Forms mit Built-in und Custom Validators
- **Avalonia MVVM**: Data Annotations mit CommunityToolkit Validation
- **Echtzeit-Feedback**: Sofortige Anzeige von Validierungsfehlern
- **Benutzerfreundlich**: Lokalisierte Fehlermeldungen (DE/EN)

**Besonderheiten:**

- Eindeutige Indizes auf `TdList.Name` und `TdTask(TdListId, Title)`
- `TdList.CompletedOn` wird automatisch berechnet basierend auf den zugehörigen Tasks
- Partial Methods für erweiterte Custom-Validierung verfügbar
- Validierung erfolgt sowohl bei Entity Framework-Operationen als auch bei API-Aufrufen

---

## Backend

Das Backend wurde mit **.NET 8.0** und **Entity Framework Core** erstellt.
Alle Entitäten folgen einem einheitlichen Template-basierten Ansatz mit automatischer Code-Generierung.

**Technologie-Stack:**

- Entity Framework Core mit SQLite (Standard)
- Repository Pattern mit generischen EntitySets
- Automatische Validierung und Fehlerbehandlung

### CSV-Import

Das System unterstützt den Import von Testdaten über CSV-Dateien:

- **Dateien:**
  - `data/tdlist_set.csv` - Aufgabenlisten (7 gültige, 3 ungültige)
  - `data/tdtask_set.csv` - Aufgaben (je 5–8 Aufgaben pro gültiger Liste)

- **Import-Implementierung:** `SEeToDoList.ConApp/Apps/StarterApp.Import.cs`
  Die Import-Klasse liest CSV-Dateien, validiert die Daten und speichert sie über das Context-Interface.

**Import ausführen:**

```bash
dotnet run --project SEeToDoList.ConApp
# Option: ImportData auswählen
```

---

## Frontend

### Angular Web App

Das Angular-Frontend (`SEeToDoList.AngularApp`) bietet eine moderne, responsive Benutzeroberfläche:

**Features:**

- **Dashboard** mit Übersicht aller Listen
- **Listen-Verwaltung** (`TdListListComponent`)
- **Aufgaben-Details** (`TdListDetailsComponent`) mit Drill-Down-Ansicht
- **Bearbeitungs-Formulare** mit Validierung
- **Internationalisierung** (Deutsch/Englisch)
- **Bootstrap 5** für responsive Design
- **Authentifizierung** mit Guard-Protection

**Hauptrouten:**

- `/dashboard` - Hauptübersicht
- `/tdlists` - Listen-Verwaltung
- `/tdListDetails/:id` - Aufgaben einer spezifischen Liste

**Starten:**

```bash
cd SEeToDoList.AngularApp
ng serve
```

### MVVM Desktop App (Avalonia)

Die Desktop-Anwendung (`SEeToDoList.MVVMApp`) nutzt **Avalonia UI** für plattformübergreifende Kompatibilität:

**Features:**

- **Avalonia UI** Framework für Windows, macOS, Linux
- **MVVM Pattern** mit CommunityToolkit
- **Generische ViewModels** für Listen- und Detail-Ansichten
- **Dialog-basierte Bearbeitung**
- **Responsive Layout**

**Starten:**

```bash
dotnet run --project SEeToDoList.MVVMApp
```

---

## API

Die REST API (`SEeToDoList.WebApi`) bietet vollständige CRUD-Operationen:

**Basis-URL:** `https://localhost:7000/api/`

**Hauptendpunkte:**

- `GET/POST/PUT/DELETE /api/TdLists` - Listen-Verwaltung
- `GET/POST/PUT/DELETE /api/TdTasks` - Aufgaben-Verwaltung
- `POST /api/System` - System-Initialisierung
- `POST /api/Accounts/login` - Authentifizierung (falls aktiviert)

**Features:**

- OpenAPI/Swagger Dokumentation
- JSON-basierte Kommunikation
- Umfassende Fehlerbehandlung
- Optional: Authentifizierung und Autorisierung

**Starten:**

```bash
dotnet run --project SEeToDoList.WebApi
```

---

## Test

**Testen der Anwendung:**

1. **Datenbank initialisieren:**

    ```bash
    dotnet run --project SEeToDoList.ConApp
    # "ImportData" auswählen
    ```

2. **API testen:**

    ```bash
    dotnet run --project SEeToDoList.WebApi
    # Swagger UI: https://localhost:7000/swagger
    ```

3. **Angular App testen:**

    ```bash
    cd SEeToDoList.AngularApp
    ng serve
    # Browser: http://localhost:4200
    ```

4. **Desktop App testen:**

    ```bash
    dotnet run --project SEeToDoList.MVVMApp
    ```

**Testdaten:**

- 7 gültige Listen mit jeweils 5-8 Aufgaben
- Verschiedene Prioritäten und Fälligkeitsdaten
- Teilweise abgeschlossene Aufgaben für realistische Tests

**Entwicklung:**

- Code-Generatoren für schnelle Template-Erweiterungen
- Template-basierte Entwicklung für konsistente Patterns
- Umfassende Logging- und Debugging-Unterstützung

> **Viel Erfolg mit SEeToDoList!**

## Abgabestatus

- Nummer: Dies ist Versuch 1.
- Abgabestatus: Bisher wurden keine Aufgaben abgegeben
- Bewertungsstatus: Nicht bewertet
- Verbleibende Zeit: Verbleibend: 2 Tage 10 Stunden
- Zuletzt geändert: -
- Abgabekommentare:
  - `___picture___` `___name___` - `___time___` `___content___`
  - Kommentare anzeigen
  - Kommentare (0)
  - Kommentar
  - Kommentar speichern
  - Abbrechen

## Anhänge

No file links found on this page
