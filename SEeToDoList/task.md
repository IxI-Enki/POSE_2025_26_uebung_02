# SEeToDoList

## Projektbeschreibung

Kurze allgemeine Beschreibung des Projekts.

## Anforderungen

Hier die zusätzlichen Anforderungen definieren.

## Technische Details

Setze die Anforderungen in den folgenden Schritten um:

1. **Datenmodell erstellen**
   - Definiere die entsprechenden Entitäten mit den jeweiligen Einschränkungen.
     Orientiere dich an den Vorgaben in `entities_template.md`.
   - Lege Entitäten für Bewegungsdaten im Unterordner `App` an.
   - Lege alle anderen Entitäten im Unterordner `Data` an.

2. **Entity-Modell prüfen**
   - Überprüfe das Entity-Modell gemeinsam mit dem Team.
     Fahre erst nach Freigabe mit den nächsten Schritten fort.

3. **Codegenerierung ausführen**
   - Führe die Codegenerierung mit folgendem Befehl aus:

     ```bash
     dotnet run --project TemplateTools.ConApp -- AppArg=4,9,x,x
     ```

4. **CSV-Import erstellen**
   - Implementiere eine Klasse für den Import von CSV-Dateien gemäß den Vorgaben in `import_template.md`.

5. **Benutzeroberfläche erstellen**
   - Entwickle eine einfache Benutzeroberfläche zur Verwaltung der Daten. Beachte die Vorgaben in `forms_template.md`.

6. **Routing-Module**
   - Füge alle Komponenten aus dem Ordner `src/app/pages/entities` in das Routing-Modul ein.

7. **Dashboard anpassen**
   - Ergänze das Dashboard um die Komponenten aus `src/app/pages/entities`.

8. **README erstellen**
   - Erstelle eine README-Datei, die das Projekt beschreibt und
     Installations- sowie Nutzungshinweise enthält. Orientiere dich an `readme_template.md`.

Viel Erfolg bei der Umsetzung des Projekts!
