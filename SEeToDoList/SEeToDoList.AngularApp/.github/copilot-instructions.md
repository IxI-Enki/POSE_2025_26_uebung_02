# GitHub Copilot Instructions für SEeToDoList

## Projektübersicht

SEeToDoList ist ein Basis-Template für die Erstellung der Anwendung mit Code-Generierung:
- **Backend**: .NET 8.0 mit Entity Framework Core
- **Frontend**: Angular 18 mit Bootstrap und standalone Komponenten
- **Code-Generierung**: Template-gesteuerte Erstellung aller CRUD-Operationen
- **Architektur**: Clean Architecture mit strikter Trennung von manuellen und generierten Code

## Kernprinzipien

### 1. Code-Generierung First
**⚠️ NIEMALS manuell Controllers, Services oder CRUD-Operationen erstellen!**
```bash
# Code-Generierung ausführen:
dotnet run --project TemplateTools.ConApp -- AppArg=4,9,x,x
```

### 2. Code-Marker System
- `//@AiCode` - Generierter Code, nicht bearbeiten
- `//@GeneratedCode` - Zeigt an, dass dieser Code vom Generator generiert wurde und bei der nächsten Generierung überschrieben wird.
- `//@CustomCode` - Falls in einer generierten Datei (@GeneratedCode) eine Änderung erfolgt, dann wird der Label @GeneratedCode zu @CustomCode geändert. Damit wird verhindert, dass der Code vom Generator überschrieben wird.
- `#if GENERATEDCODE_ON` - Conditional Compilation für Features

## Entity-Entwicklung

Die Entitäten werden immer mit englischen Bezeichner benannt.

### Dateistruktur
- **Stammdaten**: `SEeToDoList.Logic/Entities/Data/`
- **Anwendungsdaten**: `SEeToDoList.Logic/Entities/App/`
- **Account**: `SEeToDoList.Logic/Entities/Account/`

### Entity Template

- Erstelle die Klasse mit dem Modifier *public* und *partial*.
- Die Klasse erbt von `EntityObject`.  
- Dateiname: **EntityName.cs**.  

```csharp
//@AiCode
namespace SEeToDoList.Logic.Entities[.SubFolder]
{
    using System.... // Required usings

#if SQLITE_ON
    [Table("EntityNames")]
#else
    [Table("EntityNames", Schema = "app")]
#endif
    [Index(...)] // Add index attributes if required.
    public partial class EntityName : EntityObject 
    {
        #region fields
        private PropertyType _fullPropertyName = default!; // Initialize only if necessary
        #endregion fields

        #region properties
        /// <summary>
        /// Example of an auto property.
        /// </summary>
        public PropertyType AutoPropertyName { get; set; } = default!; // Initialize only if necessary

        /// <summary>
        /// Example of a full property.
        /// </summary>
        public PropertyType FullPropertyName 
        { 
            get
            {
                var result = _fullPropertyName;
                OnFullPropertyNameReading(ref result);
                return result;
            }
            set
            {
                bool handled = false;
                OnFullPropertyNameChanging(ref handled, value);
                if (!handled)
                {
                    _fullPropertyName = value;
                }
                OnFullPropertyNameChanged(_fullPropertyName);
            }
        }
        #endregion properties

        #region navigation properties
        #endregion navigation properties

        #region partial methods
        partial void OnFullPropertyNameReading(ref PropertyType value);
        partial void OnFullPropertyNameChanging(ref bool handled, PropertyType value);
        partial void OnFullPropertyNameChanged(PropertyType value);
        #endregion partial methods
    }
}
```

## Struktur für Validierungsklassen

- Lege eine separate *partial* Klasse für die Validierung im **gleichen Namespace** wie die Entität an.  
- Die Klasse implementiert `IValidatableEntity`.  
- Dateiname: **EntityName.Validation.cs**.  
- Erkennbare Validierungsregeln aus der Beschreibung müssen implementiert werden.

```csharp
//@AiCode
namespace SEeToDoList.Logic.Entities[.SubFolder]
{
    using System.... // Required usings
    using SEeToDoList.Logic.Modules.Exceptions;

    partial class EntityName : SEeToDoList.Logic.Contracts.IValidatableEntity 
    {
        public void Validate(SEeToDoList.Logic.Contracts.IContext context, EntityState entityState)
        {
            bool handled = false;
            BeforeExecuteValidation(ref handled, context, entityState);

            if (!handled)
            {
                // Implement validation logic here
                if (!IsPropertyNameValid(PropertyName))
                {
                    throw new BusinessRuleException(
                        $"The value of {nameof(PropertyName)} '{PropertyName}' is not valid.");
                }
            }
        }
        
        #region methods
        public static bool IsPropertyNameValid(PropertyType value)
        {
            // Implement validation logic here
            return true;
        }
        #endregion methods

        #region partial methods
        partial void BeforeExecuteValidation(ref bool handled, SEeToDoList.Logic.Contracts.IContext context, EntityState entityState);
        #endregion partial methods
    }
}
```

## Validierungsregeln

- Keine Validierungen für Id-Felder (werden von der Datenbank verwaltet).

## Struktur für Views

```csharp
//@AiCode
namespace SEeToDoList.Logic.Entities.Views[.SubFolder]
{
    using System.... // Required usings

    [CommonModules.Attributes.View("ViewNames")]
    public partial class ViewName : ViewObject 
    {
        #region properties
        #endregion properties

        #region navigation properties
        #endregion navigation properties
    }
}
```

## Using-Regeln

- `using System` wird **nicht** explizit angegeben.

## Entity-Regeln

- Kommentar-Tags (`/// <summary>` usw.) sind für jede Entität erforderlich.  
- `SEeToDoList.Logic` ist fixer Bestandteil des Namespace.  
- `[.SubFolder]` ist optional und dient der Strukturierung.

## Property-Regeln

- Primärschlüssel `Id` wird von `EntityObject` geerbt.  
- **Auto-Properties**, wenn keine zusätzliche Logik benötigt wird.  
- **Full-Properties**, wenn Lese-/Schreiblogik erforderlich ist.  
- Für Id-Felder: Typ `IdType`.  
- Bei Längenangabe: `[MaxLength(n)]`.  
- Nicht-nullable `string`: `= string.Empty`.  
- Nullable `string?`: keine Initialisierung.

## Navigation Properties-Regeln

- In der Many-Entität: `EntityNameId`.  
- Navigation Properties immer vollqualifiziert:  
  `ProjectName.Entities.EntityName EntityName`  
- **1:n**:

```csharp
  public List<Type> EntityNames { get; set; } = [];
```  

- **1:1 / n:1**:  

```csharp
  Type? EntityName { get; set; }
```

## Dokumentation

- Jede Entität und Property erhält englische XML-Kommentare.

**Beispiel:**

```csharp
/// <summary>
/// Name of the entity.
/// </summary>
public string Name { get; set; } = string.Empty;
```

## CSV-Import System

### Import Template

1. **Namespace:** Der Namespace `SolutionName.ConApp.Apps` ist verpflichtend und darf nicht geändert werden.
2. **Dateiname:** Der Import-Code wird in der Datei `StarterApp.Import.cs` implementiert.
3. **Dateistruktur:** Alle CSV-Dateien werden im Unterordner `data` gespeichert.
4. **CSV-Datei:** Jede Entität hat eine eigene CSV-Datei, benannt nach der Entität, z.B. `entityName_set.csv`.
   - Die erste Zeile der CSV-Datei enthält die Spaltennamen.
   - Die Datenzeilen folgen dem Format: `Property1;Property2;...;PropertyN`.
   - Kommentare in der CSV-Datei beginnen mit `#` und werden ignoriert.
   - Alle CSV-Dateien werden automatisch in das Ausführungsverzeichnis kopiert.
5. **Code-Struktur:**  
   - Die Import-Logik wird als **partial-Methode** in der Klasse `StarterApp` implementiert.  
   - **Jede Entität** erhält ihren eigenen Import-Block in der Datei `Program.Import.cs`.  
6. **Fehlerbehandlung:**  
   - Alle Importvorgänge sind asynchron (`async/await`).  
   - Fehler werden per `try/catch` behandelt, mit Rollback über `RejectChangesAsync()`.  

```csharp
//@AiCode
#if GENERATEDCODE_ON
namespace SEeToDoList.ConApp.Apps
{
    partial class StarterApp
    {
        partial void AfterCreateMenuItems(ref int menuIdx, List<MenuItem> menuItems)
        {
            menuItems.Add(new()
            {
                Key = "----",
                Text = new string('-', 65),
                Action = (self) => { },
                ForegroundColor = ConsoleColor.DarkGreen,
            });

            menuItems.Add(new()
            {
                Key = $"{++menuIdx}",
                Text = ToLabelText($"{nameof(ImportData).ToCamelCaseSplit()}", "Started the import of the csv-data"),
                Action = (self) =>
                {
#if DEBUG && DEVELOP_ON
                    ImportData();
#endif
                },
#if DEBUG && DEVELOP_ON
                ForegroundColor = ConsoleApplication.ForegroundColor,
#else
                ForegroundColor = ConsoleColor.Red,
#endif
            });
        }

        private static void ImportData()
        {
            Task.Run(async () =>
            {
                try
                {
                    await ImportDataAsync();
                }
                catch (Exception ex)
                {
                    var saveColor = ForegroundColor;
                    PrintLine();
                    ForegroundColor = ConsoleColor.Red;
                    PrintLine($"Error during data import: {ex.Message}");
                    ForegroundColor = saveColor;
                    PrintLine();
                    ReadLine("Continue with the Enter key...");
                }
            }).Wait();
        }

        private static async Task ImportDataAsync()
        {
            Logic.Contracts.IContext context = CreateContext();
            var filePath = Path.Combine(AppContext.BaseDirectory, "data", "entityName_set.csv");

            foreach (var line in File.ReadLines(filePath).Skip(1).Where(l => !l.StartsWith('#')))
            {
                var parts = line.Split(';');
                var entity = new Logic.Entities.EntityName
                {
                    PropertyName = parts[0],
                    // ... weitere Properties
                };
                try
                {
                    await context.EntityNameSet.AddAsync(entity);
                    await context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    await context.RejectChangesAsync();
                    Console.WriteLine($"Error in line: {ex.Message}");
                }
            }
        }
    }
}
#endif
```

### CSV Format
```csv
#Name;Description
Developer;Software Developer
Manager;Project Manager
```

## Angular Komponenten

Die Generierung der Komponenten erfolgt für die Listen die sich im Ordner 'src/app/pages/entities/' befinden. Die dazugehörigen Edit Komponenten befinden sich im Ordner 'src/app/components/entities'.

### List Component Template
```html
<!--@AiCode-->
<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4 p-3" style="background-color: #f8f9fa; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 4px;">
        <h3 class="mb-0 flex-grow-1">
          {{ 'ENTITYNAME_LIST.TITLE' | translate }}
        </h3>
        <a routerLink="/dashboard" class="btn btn-outline-secondary d-none d-sm-inline" title="{{ 'ENTITYNAME_LIST.BACK_TO_DASHBOARD' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
            <i class="bi bi-arrow-left-circle"></i>
        </a>
        <a routerLink="/dashboard" class="btn btn-outline-secondary btn-lg d-inline d-sm-none" title="{{ 'ENTITYNAME_LIST.BACK_TO_DASHBOARD' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
            <i class="bi bi-arrow-left-circle"></i>
        </a>
    </div>
    <div class="d-flex mb-3">
        <button *ngIf="canAdd" class="btn btn-primary me-2 d-none d-sm-inline" (click)="addCommand()" data-bs-toggle="tooltip" [title]="'ENTITYNAME_LIST.ADD_LIST' | translate">
            <i class="bi bi-plus"></i>
        </button>
        <button *ngIf="canAdd" class="btn btn-primary btn-lg me-2 d-inline d-sm-none" (click)="addCommand()" data-bs-toggle="tooltip" [title]="'ENTITYNAME_LIST.ADD_LIST' | translate">
            <i class="bi bi-plus"></i>
        </button>
        <input *ngIf="canSearch" type="text" class="form-control me-2" [(ngModel)]="searchTerm" [placeholder]="'ENTITYNAME_LIST.SEARCH_PLACEHOLDER' | translate" />
        <button *ngIf="canRefresh" class="btn btn-success" (click)="reloadData()" data-bs-toggle="tooltip" [title]="'ENTITYNAME_LIST.REFRESH' | translate">
            <i class="bi bi-arrow-clockwise"></i>
        </button>
    </div>
    <ul class="list-group">
        <li *ngFor="let item of dataItems" class="list-group-item d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-2">
            <!-- Display the item details -->
            <div class="flex-grow-1">
                <div class="fw-bold mb-1"><i class="bi bi-list"></i> {{ item.name }}</div>
                <div class="text-muted small mb-1">{{ item.description }}</div>
                <div class="small">
                    <div class="row mb-1">
                        <div class="col-4 col-md-3 col-lg-2"><strong>{{ 'ENTITYNAME_LIST.PROPERTYNAME' | translate }}</strong></div>
                        <div class="col"><span class="fw-semibold">{{ item.propertyName }}</span></div>
                    </div>
                </div>
            </div>
            <!-- Action buttons -->
            <div class="d-flex gap-2 mt-2 mt-md-0">
                <button *ngIf="canEdit" class="btn btn-sm btn-outline-secondary d-none d-sm-inline" (click)="editCommand(item)" [title]="'ENTITYNAME_LIST.EDIT' | translate">
                    <i class="bi bi-pencil"></i>
                </button>
                <button *ngIf="canDelete" class="btn btn-sm btn-outline-danger d-none d-sm-inline" (click)="deleteCommand(item)" [title]="'ENTITYNAME_LIST.DELETE' | translate">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </li>
    </ul>
</div>
```

### Bearbeitungsansicht (Edit-Formular)

* Für die Ansicht ist eine **Bootstrap-Card-Ansicht** zu verwenden.
* Die Komponenten sind bereits erstellt und befinden sich im Ordner `src/app/components/entities`.
* Alle Komponenten sind `standalone` Komponenten.
* **Dateiname:** `entity-name-edit.component.html`
* **Übersetzungen:** Ergänze die beiden Übersetzungsdateien `de.json` und `en.json` um die hinzugefügten Labels.
* Beispielstruktur:

```html
<!--@AiCode-->
<div *ngIf="dataItem" class="card mt-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h3>{{ title }}</h3>
        <button type="button" class="btn btn-sm btn-danger" [ariaLabel]="'ENTITYNAME_EDIT.CLOSE' | translate" (click)="dismiss()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="card-body">
        <form (ngSubmit)="submitForm()" #editForm="ngForm">
            <div class="mb-3">
                <label for="name" class="form-label">{{ 'ENTITYNAME_EDIT.NAME' | translate }}</label>
                <input id="name" class="form-control" [(ngModel)]="dataItem.name" name="name" required maxlength="100" />
            </div>
            <!-- Fields of entity -->
            <div class="mb-3">
                <label for="description" class="form-label">{{ 'ENTITYNAME_EDIT.DESCRIPTION' | translate }}</label>
                <textarea id="description" class="form-control" [(ngModel)]="dataItem.description" name="description" maxlength="500"></textarea>
            </div>
            <div class="mb-3">
                <label for="createdOn" class="form-label">{{ 'ENTITYNAME_EDIT.CREATED_ON' | translate }}</label>
                <input
                    id="createdOn"
                    type="date"
                    class="form-control"
                    [ngModel]="getDateString('createdOn')"
                    (ngModelChange)="setDateString('createdOn', $event)"
                    name="createdOn"
                    required
                />
            </div>
            <button class="btn btn-success" type="submit">{{ 'ENTITYNAME_EDIT.SAVE' | translate }}</button>
            <button class="btn btn-secondary ms-2" type="button" (click)="cancelForm()">{{ 'ENTITYNAME_EDIT.CANCEL' | translate }}</button>
        </form>
    </div>
</div>
```

### Master-Details

In manchen Fällen ist eine Master/Details Ansicht sehr hilfreich. Diese Anzeige besteht aus einer Master-Ansicht. Diese kann nicht bearbeitet werden. Die Details zu diesem Master werden unter der Master-Ansicht als 'List-group' angezeigt. Die Generierung soll nur nach Aufforderung des Benutzers erfolgen. Nachfolgend ist die Struktur skizziert:

```html
<!--@AiCode-->
<div class="container mt-4" *ngIf="data">
    <!-- Master: Listendaten (readonly) -->
    <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0"><i class="bi bi-list-task"></i> {{ data.propertyName }}</h4>
            <a routerLink="/tdlists" class="btn btn-outline-secondary btn-sm d-none d-sm-inline" title="{{ 'ENTITYNAME.BACK_TO_LIST' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                <i class="bi bi-arrow-left-circle"></i>
            </a>
            <a routerLink="/tdlists" class="btn btn-outline-secondary btn-lg d-inline d-sm-none" title="{{ 'ENTITYNAME.BACK_TO_LIST' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                <i class="bi bi-arrow-left-circle"></i>
            </a>
        </div>
        <div class="card-body">
            <p>{{ data.propertyName2 }}</p>
            <div class="row mb-1">
                <div class="col-4 col-md-3 col-lg-2"><strong>{{ 'ENTITYNAME.PROPERTYNAME2' | translate }}</strong></div>
                <div class="col">{{ data.propertyName2 }}</div>
            </div>
        </div>
    </div>

    <!-- Detail: Liste -->
    <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap">
        <h5 class="mb-2 mb-md-0 ms-2"><i class="bi bi-card-checklist"></i> {{ 'ENTITYNAME.DETAILS' | translate }}</h5>
        <div class="mt-2 mt-md-0 me-2">
            <button class="btn btn-primary btn-sm d-none d-sm-inline" (click)="addCommand()" title="{{ 'ENTITYNAME.ADD_DETAILNAME' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                <i class="bi bi-plus"></i>
            </button>
            <button class="btn btn-primary btn-lg d-inline d-sm-none" (click)="addCommand()" title="{{ 'ENTITYNAME.ADD_DETAILNAME | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                <i class="bi bi-plus"></i>
            </button>
        </div>
    </div>
    <ul class="list-group mb-3">
        <li *ngFor="let item of dataItems" class="list-group-item">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <span class="fw-semibold text-primary">{{ item.propertyName }}</span>
                    <span class="text-muted small d-block text-truncate mb-2 mt-1" style="max-width: 400px;" [title]="item.description">{{ item.propewrtyName2 }}</span>
                    <div class="row">
                        <div class="col-4 col-md-3 col-lg-2"><strong>{{ 'DETAILNAME.PROPERTYNAME' | translate }}</strong></div>
                        <div class="col">{{ item.propertyName }}</div>
                    </div>
                    <!-- Weitere Eigenschaften-->
                </div>
                <div class="mt-2 mt-md-0 ms-md-2">
                    <button class="btn btn-sm btn-outline-secondary me-1 d-none d-sm-inline" (click)="editCommand(item)" title="{{ 'ENTITYNAME.EDIT_DETAILNAME' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-lg btn-outline-secondary me-1 d-inline d-sm-none" (click)="editCommand(item)" title="{{ 'ENTITYNAME.EDIT_DETAILNAME' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger d-none d-sm-inline" (click)="deleteCommand(item)" title="{{ 'ENTITYNAME.DELETE_DETAILNAME' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-lg btn-outline-danger d-inline d-sm-none" (click)="deleteCommand(item)" title="{{ 'ENTITYNAME.DELETE_DETAILNAME' | translate }}" data-bs-toggle="tooltip" data-bs-placement="top">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </li>
        <li *ngIf="dataItems.length === 0" class="list-group-item">{{ 'ENTITYNAME.NO_DETAILNAME' | translate }}</li>
    </ul>
</div>
```

## Entwicklungs-Workflow

### 1. Entity erstellen
1. Entity-Klasse in `Logic/Entities/{Data|App}/` erstellen
2. Validierung in separater `.Validation.cs` Datei
3. Das Entity-Modell mit dem Benutzer abklären und bestätigen lassen.

### 2. Code-Generierung
3. Code-Generierung ausführen: `dotnet run --project TemplateTools.ConApp -- AppArg=4,9,x,x`

### 3. Daten-Import
1. CSV-Datei in `ConApp/data/entityname_set.csv` erstellen
2. Einstellen, dass die CSV-Datei ins Ausgabeverzeichnis kopiert wird
3. Import-Logic in `StarterApp.Import.cs` hinzufügen
4. Console-App ausführen und Import starten

### 4. Angular-Komponenten
1. List- und Edit-Komponenten werden von der Code-Generierung generiert
2. Falls du Komponenten manuell erstellst: 
   - Bitte im Ordner 'src/app/pages/' bzw. 'src/app/components/' ablegen.
   - Immer 'standalone' komponenten verwenden.
   - Immer mit HTML-Templates in einer separaten Datei arbeiten.
   - Immer mit CSS-Templates in einer separaten Datei arbeiten.
3. Routing in `app-routing.module.ts` eintragen
4. Dashboard anpassen für Navigation die Page-Listen eintragen
5. Übersetzungen in `de.json` und `en.json` ergänzen

### 5. Anpassungen
- Custom Code in `//@CustomCode` Bereichen
- Separate `.Custom.cs` Dateien für erweiterte Logik
- `editMode` boolean für Create/Edit-Unterscheidung

## Konventionen

### Naming
- Entities: PascalCase, Englisch
- Properties: PascalCase mit XML-Dokumentation
- Navigation Properties: Vollqualifiziert

### Validierung
- Keine Validierung für Id-Felder
- BusinessRuleException für Geschäftsregeln
- Async-Pattern mit RejectChangesAsync()

### Internationalisierung
- Alle Labels in i18n-Dateien
- Format: `ENTITYNAME_LIST.TITLE`
- Unterstützung für DE/EN

## Troubleshooting

### Häufige Probleme
- **Build-Fehler**: Code-Generierung ausführen nach Entity-Änderungen
- **Import-Fehler**: CSV-Format und Beziehungen prüfen
- **Routing**: Komponenten in `app-routing.module.ts` registrieren

### Debugging
- Generated Code über `//@AiCode` Marker identifizieren
- Custom Code in separaten Bereichen isolieren
- Console-App für Datenbank-Tests nutzen
