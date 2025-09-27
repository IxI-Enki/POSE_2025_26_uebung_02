# ├£bung

Quelle: [https://edufs.edu.htl-leonding.ac.at/moodle/mod/assign/view.php?id=214265](https://edufs.edu.htl-leonding.ac.at/moodle/mod/assign/view.php?id=214265)

## Details
Assignment:
- Title: 2526_78ABIF_78ACIF_POS_GEHR
- URL: https://edufs.edu.htl-leonding.ac.at/moodle/mod/assign/view.php?id=214265
- F├ñllig: Dienstag, 30. September 2025, 00:00
- Description:
  # SEeToDoList

  **Inhaltsverzeichnis:**

  - [SEeToDoList](#seetodolist)
    - [Einleitung](#einleitung)
    - [Projektstruktur](#projektstruktur)
    - [Datenstruktur](#datenstruktur)
    - [Backend](#backend)
      - [CSV-Import](#csv-import)
    - [Frontend](#frontend)
      - [Angular Web App](#angular-web-app)
      - [MVVM Desktop App (Avalonia)](#mvvm-desktop-app-avalonia)
    - [API](#api)
    - [Test](#test)

  ---

  ## Einleitung

  Das Projekt **SEeToDoList** ist eine umfassende Anwendung zur Verwaltung von Aufgabenlisten und deren Aufgaben.
  Benutzer k├Ânnen Listen erstellen, Aufgaben hinzuf├╝gen, bearbeiten, als erledigt markieren und priorisieren.

  Die Anwendung bietet mehrere Frontend-Optionen:
  - **Angular Web-Anwendung** f├╝r moderne Browser
  - **Avalonia MVVM Desktop-Anwendung** f├╝r plattform├╝bergreifende Desktop-Nutzung
  - **REST API** f├╝r Integration mit anderen Systemen

  ---

  ## Projektstruktur

  Das Solution umfasst folgende Projekte:

  | Projekt | Beschreibung |
  |---------|-------------|
  | **SEeToDoList.Logic** | Kernlogik mit Entit├ñten, Datenkontext und Gesch├ñftslogik |
  | **SEeToDoList.Common** | Gemeinsame Contracts, Modelle und Utilities |
  | **SEeToDoList.WebApi** | REST API f├╝r Frontend-Anbindung |
  | **SEeToDoList.AngularApp** | Angular-Frontend mit Bootstrap |
  | **SEeToDoList.MVVMApp** | Avalonia Desktop-Anwendung |
  | **SEeToDoList.ConApp** | Konsolenanwendung f├╝r Datenimport und Tests |
  | **SEeToDoList.CodeGenApp** | Code-Generator f├╝r Template-basierte Entwicklung |
  | **TemplateTools.*** | Template- und Code-Generator Tools |

  ---

  ## Datenstruktur

  Das System besteht aus den folgenden Haupt-Entit├ñten:

  ### **Tabelle:** **TdList** (Aufgabenlisten)

  | Name | Type | Nullable | MaxLength | Beschreibung |
  |------|------|----------|-----------|--------------|
  | Name | String | No | 100 | Name der Aufgabenliste |
  | Description | String | Yes | 500 | Beschreibung der Liste |
  | CreatedOn | DateTime | No | --- | Datum der Erstellung |
  | CompletedOn | DateTime | Yes | --- | Berechnetes Datum der Fertigstellung (abgeleitet) |

  ### **Tabelle:** **TdTask** (Aufgaben)

  | Name | Type | Nullable | MaxLength | Beschreibung |
  |------|------|----------|-----------|--------------|
  | Title | String | No | 200 | Titel der Aufgabe |
  | Description | String | Yes | 1000 | Detaillierte Beschreibung der Aufgabe |
  | DueDate | DateTime | Yes | --- | F├ñlligkeitsdatum der Aufgabe |
  | CompletedOn | DateTime | Yes | --- | Datum der Fertigstellung |
  | IsCompleted | Boolean | No | --- | Gibt an, ob die Aufgabe abgeschlossen ist |
  | Priority | Int32 | No | --- | Priorit├ñt als Zahl (1=hoch, 3=niedrig) |
  | TdListId | IdType | No | --- | Fremdschl├╝ssel zu **TdList** |

  ### **Validierung**

  Das System implementiert umfassende Validierungsregeln auf mehreren Ebenen:

  #### **TdList Validierungsregeln:**
  -  **Name (erforderlich)**: Darf nicht leer oder nur Leerzeichen enthalten
  -  **Eindeutigkeit**: Der `Name` muss systemweit eindeutig sein (Unique Index)
  -  **Task-Titel Eindeutigkeit**: Alle Task-Titel innerhalb einer Liste m├╝ssen eindeutig sein
  -  **BusinessRuleException**: Bei Verletzung wird eine spezifische Gesch├ñftsregel-Exception geworfen

  #### **TdTask Validierungsregeln:**
  -  **Title (erforderlich)**: Darf nicht leer oder nur Leerzeichen enthalten
  -  **Eindeutigkeit**: Kombination aus `TdListId` + `Title` muss eindeutig sein (Composite Unique Index)
  -  **Konsistenz**: Wenn `IsCompleted = true`, dann muss `CompletedOn` einen Wert haben
  -  **Referenzielle Integrit├ñt**: `TdListId` muss auf eine existierende Liste verweisen
  -  **BusinessRuleException**: Bei Verletzung wird eine spezifische Gesch├ñftsregel-Exception geworfen

  #### **Datenbank-Constraints:**
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

  #### **Frontend-Validierung:**
  - **Angular**: Reactive Forms mit Built-in und Custom Validators
  - **Avalonia MVVM**: Data Annotations mit CommunityToolkit Validation
  - **Echtzeit-Feedback**: Sofortige Anzeige von Validierungsfehlern
  - **Benutzerfreundlich**: Lokalisierte Fehlermeldungen (DE/EN)

  **Besonderheiten:**
  - Eindeutige Indizes auf `TdList.Name` und `TdTask(TdListId, Title)`
  - `TdList.CompletedOn` wird automatisch berechnet basierend auf den zugeh├Ârigen Tasks
  - Partial Methods f├╝r erweiterte Custom-Validierung verf├╝gbar
  - Validierung erfolgt sowohl bei Entity Framework-Operationen als auch bei API-Aufrufen

  ---

  ## Backend

  Das Backend wurde mit **.NET 8.0** und **Entity Framework Core** erstellt.
  Alle Entit├ñten folgen einem einheitlichen Template-basierten Ansatz mit automatischer Code-Generierung.

  **Technologie-Stack:**
  - Entity Framework Core mit SQLite (Standard)
  - Repository Pattern mit generischen EntitySets
  - Automatische Validierung und Fehlerbehandlung

  ### CSV-Import

  Das System unterst├╝tzt den Import von Testdaten ├╝ber CSV-Dateien:

  - **Dateien:**
    - `data/tdlist_set.csv` - Aufgabenlisten (7 g├╝ltige, 3 ung├╝ltige)
    - `data/tdtask_set.csv` - Aufgaben (je 5ÔÇô8 Aufgaben pro g├╝ltiger Liste)

  - **Import-Implementierung:** `SEeToDoList.ConApp/Apps/StarterApp.Import.cs`
    Die Import-Klasse liest CSV-Dateien, validiert die Daten und speichert sie ├╝ber das Context-Interface.

  **Import ausf├╝hren:**
  ```bash
  # ├£ber ConApp Men├╝
  dotnet run --project SEeToDoList.ConApp
  # Option: ImportData ausw├ñhlen
  ```

  ---

  ## Frontend

  ### Angular Web App

  Das Angular-Frontend (`SEeToDoList.AngularApp`) bietet eine moderne, responsive Benutzeroberfl├ñche:

  **Features:**
  - **Dashboard** mit ├£bersicht aller Listen
  - **Listen-Verwaltung** (`TdListListComponent`)
  - **Aufgaben-Details** (`TdListDetailsComponent`) mit Drill-Down-Ansicht
  - **Bearbeitungs-Formulare** mit Validierung
  - **Internationalisierung** (Deutsch/Englisch)
  - **Bootstrap 5** f├╝r responsive Design
  - **Authentifizierung** mit Guard-Protection

  **Hauptrouten:**
  - `/dashboard` - Haupt├╝bersicht
  - `/tdlists` - Listen-Verwaltung
  - `/tdListDetails/:id` - Aufgaben einer spezifischen Liste

  **Starten:**
  ```bash
  cd SEeToDoList.AngularApp
  ng serve
  ```

  ### MVVM Desktop App (Avalonia)

  Die Desktop-Anwendung (`SEeToDoList.MVVMApp`) nutzt **Avalonia UI** f├╝r plattform├╝bergreifende Kompatibilit├ñt:

  **Features:**
  - **Avalonia UI** Framework f├╝r Windows, macOS, Linux
  - **MVVM Pattern** mit CommunityToolkit
  - **Generische ViewModels** f├╝r Listen- und Detail-Ansichten
  - **Dialog-basierte Bearbeitung**
  - **Responsive Layout**

  **Starten:**
  ```bash
  dotnet run --project SEeToDoList.MVVMApp
  ```

  ---

  ## API

  Die REST API (`SEeToDoList.WebApi`) bietet vollst├ñndige CRUD-Operationen:

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
     # "ImportData" ausw├ñhlen
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
  - 7 g├╝ltige Listen mit jeweils 5-8 Aufgaben
  - Verschiedene Priorit├ñten und F├ñlligkeitsdaten
  - Teilweise abgeschlossene Aufgaben f├╝r realistische Tests

  **Entwicklung:**
  - Code-Generatoren f├╝r schnelle Template-Erweiterungen
  - Template-basierte Entwicklung f├╝r konsistente Patterns
  - Umfassende Logging- und Debugging-Unterst├╝tzung

  > **Viel Erfolg mit SEeToDoList!**
- Abgabestatus:
  - Nummer Dies ist Versuch 1.
  - Abgabestatus Bisher wurden keine Aufgaben abgegeben
  - Bewertungsstatus Nicht bewertet
  - Verbleibende Zeit Verbleibend: 2 Tage 10 Stunden
  - Zuletzt ge├ñndert -
  - Abgabekommentare ___picture___ ___name___ - ___time___ ___content___ Kommentare anzeigen Kommentare ( 0 ) Kommentar Kommentar speichern | Abbrechen

## Anh├ñnge
No file links found on this page
