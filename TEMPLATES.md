# TEMPLATES - Erwartete Dateiformatierungen

## Allgemeine Regeln für alle Dateitypen

- Diese Datei enthält die erwarteten Dateiformatierungen für die verschiedenen Dateitypen.

- Diese Vorlagen müssen IMMER, bei der Erstellung und dem Bearbeiten der Dateien, befolgt werden.

- Vorlagen enthalten Platzhalter für die zu setzenden Werte.

- Wenn Platzhalter unklar sind → wird der User vor dem Erstellen und Bearbeiten der Dateien aufgefordert,
  Werte für die Platzhalter zu wählen.

- Vorlagen die sich überschneiden → müssen so kombiniert werden,
  dass keine Duplikate entstehen und keine Informationen verloren gehen.

=====

## MARKDOWN TEMPLATES

### YML HEADER

- Für alle YML Header (Markdown) gilt:
  
  - Muss mit `---` beginnen und mit `---` enden.
  
  - Muss in der ersten Zeile beginnen.
  
  - Strings werden mit `'` gekennzeichnet.
  
  - Platzhalter werden mit `<>` gekennzeichnet.

  - Datums- und Uhrzeit-Werte werden im Format `<YYYY-MM-DD HH:MM>` gekennzeichnet.

### Minimaler YML Header (Markdown)
  
```md
---
title: '<Zweck_der_Datei>'
author: '<Vorname/GitHub_Username>'
created: '<YYYY-MM-DD HH:MM>'
---

<Kurzbeschreibung_der_Datei (2 Sätze max.)>

<Markdown-Inhalte>
```

### YML Header für Moodle Aufgaben (Markdown)

```md
---
title: '<Fach> <Aufgabe/Projekt>'
exercise_name: '<Kurzname_der_Übung/Projekt>'
exercise_number: <Nummer/Kennung int>
created: '<YYYY-MM-DD HH:MM>'
author: '<Vorname/GitHub_Username>'
course: '<Fach-Langname>'
school_year: '<YYYY/YY>'
moodle_link: '<URL>'
due_date: '<YYYY-MM-DD HH:MM>'
---

<Kurzbeschreibung_der_Datei (2 Sätze max.)>

<Markdown-Inhalte>
```

=====

### MARKDOWN INHALTE

- **FÜR ALLE MARKDOWN INHALTE GILT**:

  - Die Inhalte müssen IMMER in Englisch geschrieben sein.

  - Markdonwn-lint darf keine Fehler oder Warnungen ausgeben.

  - Abkürzungen müssen beim ersten Auftreten vollständig ausgeschrieben werden.

- **ÜBERSCHRIFTEN / UNTERÜBERSCHRIFTEN**:

  - Müssen mit leeren Zeilen getrennt werden.

  - Müssen mit `#` , `##` , `###` , `####` , `#####` , `######` beginnen.

  - Müssen mit leeren Zeilen getrennt werden.

  - Müssen bei längeren Dokumenten nummeriert werden
    → `<Nummer>. <Überschrift>` , `<Nummer>.<Nummer>. <Überschrift>` , etc.

- **CODEBLÖCKE**:

  - Code-Block-Typen müssen in Kleinbuchstaben geschrieben werden.

  - Codeblöcke ohne klaren Typ → Müssen entsprechend ihrem Inhalt nach gekennzeichnet werden (z.B. `file-tree`).

  - Müssen mit leeren Zeilen getrennt werden.

- **LISTEN**:

  - Müssen mit leeren Zeilen getrennt werden.
  
- **LISTENELEMENTE**:

  - Müssen mit leeren Zeilen getrennt werden.
  
  - Müssen mit `-` beginnen.
  
- **BILDER**:

  - Müssen im Ordner `img` abgelegt werden.

  - Müssen mit `![<Bildbeschreibung>]( <img>/<Bildname>.<Dateierweiterung> )` gekennzeichnet werden.
  
- **DIAGRAMME**:

  - Müssen als Mermaid-Diagramme eingebettet und mit `mermaid` gekennzeichnet werden.
  
  - Müssen mit leeren Zeilen getrennt werden.
  
  - Müssen ausschließlich gültige Mermaid-Syntaxen verwenden und müssen richtig gerendert werden.
  
  - Müssen ein einheitliches Farbschema über alle Dateien eines Projektes verwenden.

- **UNTERDOKUMENTE**:
  
  - Müssen im Ordner `docs` abgelegt werden.
  
  - Müssen mit `[<Dokumentbeschreibung>]( <docs>/<Dokumentname>.<Dateierweiterung> )` gekennzeichnet werden.

- **PLATZHALTER**:

  - Müssen mit `<>` gekennzeichnet werden.

  - Platzhalter können auf weitere Templates oder Inhalte verweisen.

- **LETZTEN ZEILEN**:

  - Müssen mit einer leeren Zeile gefolgt von `---`, vom restlichen Inhalt getrennt werden.
  
  - Müssen mit `<!--` und `-->` gekennzeichnet werden.

  - Müssen bei jedem Verändern der Datei aktualisiert werden.

  - Enthalten folgende Informationen:

    ```md
    Letzte Änderung

      - Beschreibung : <Beschreibung_der_Änderung>

      - Datum        : <YYYY-MM-DD HH:MM> 

      - Ursprung     : <GitHub_Username/Generator_Bezeichnung/Programm_Bezeichnung/AI_Identifizierung>

      - Dateiversion : <Version_Nummer>
    ```

---

<!--

Letzte Änderung

  - Beschreibung : <Änderungsbeschreibung>

  - Datum        : <YYYY-MM-DD HH:MM> 

  - Ursprung     : <GitHub_Username/Generator_Bezeichnung/Programm_Bezeichnung/AI_Identifizierung>

  - Dateiversion : <Version_Nummer>

-->