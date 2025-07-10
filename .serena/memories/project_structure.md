# Projektstruktur - Vanilla Viewer

## Dateien-Übersicht
```
Vanilla Viewer/
├── index.html          # Haupt-Anwendung (HTML + CSS + JS)
├── .serena/           # Serena-Konfiguration
│   ├── project.yml    # Projekt-Einstellungen
│   └── memories/      # Onboarding-Informationen
```

## Einzeldatei-Architektur
Das Projekt folgt einem **Single-File-Ansatz**:
- **Alles in index.html**: HTML-Struktur, CSS-Styles und JavaScript-Code
- **Embedded Styling**: CSS im `<style>`-Tag im Head
- **Inline JavaScript**: JS-Code im `<script>`-Tag vor `</body>`

## Code-Bereiche in index.html
1. **HTML Head**: Meta-Tags, Titel, vollständiges CSS
2. **HTML Body**: 
   - Header mit Navigation und Buttons
   - Container für SVG-Chart
   - Modals für Export-Funktionalität
   - Hidden File Input
3. **JavaScript**: 
   - Konstanten und State-Management
   - Layout-Algorithmen
   - Rendering-Engine
   - Event-Handler
   - Export-Funktionalität

## Datenstruktur
- **JSON-Import**: Hierarchische Organisationsstrukturen
- **Demo-Daten**: Eingebettete Beispieldaten für sofortigen Test
- **In-Memory-Storage**: Keine persistente Datenspeicherung

## Vorteile dieser Struktur
- **Einfache Bereitstellung**: Eine Datei kopieren und fertig
- **Keine Build-Tools**: Direkt im Browser lauffähig
- **Offline-fähig**: Keine externen Abhängigkeiten