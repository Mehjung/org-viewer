# Vanilla Organizational Hierarchy Viewer

Ein interaktiver Viewer für Organisationsstrukturen mit Vanilla JavaScript.

## Features

- 🌳 Interaktive Hierarchie-Darstellung
- 🔍 Zoom und Pan-Funktionalität
- 📁 Drag & Drop JSON-Import
- 🔄 Expand/Collapse Nodes
- 📊 Export-Funktionalität
- 📱 Responsive Design

## Tests

### Installation

```bash
npm install
```

### Tests ausführen

Die Tests laufen jetzt über einen integrierten Testrunner:

```bash
# Tests starten
npm test

# Tests mit spezifischen Optionen
npm run test:headed     # Browser sichtbar
npm run test:debug      # Langsam + sichtbar für Debugging
npm run test:ui         # Interaktive Test UI
```

### Getestete Funktionalitäten

- ✅ Grundlegende Seitenfunktionalität
- ✅ Demo-Daten Anzeige
- ✅ Node Expand/Collapse
- ✅ Zoom & Pan Interaktionen
- ✅ Export-Modal Funktionalität
- ✅ Drag & Drop Datei-Upload
- ✅ Responsive Design
- ✅ Fehlerbehandlung

### Debugging

```bash
# Tests mit sichtbarem Browser
npm run test:headed

# Tests verlangsamt ausführen für Debugging
npm run test:debug

# Interaktive Test-Oberfläche
npm run test:ui
```

## Verwendung

1. Öffne `index.html` in einem Browser
2. Lade eine JSON-Datei mit der Organisationsstruktur
3. Navigiere durch die Hierarchie mit Klicks
4. Verwende Zoom (Ctrl+Scroll) und Pan (Drag)
5. Exportiere Teilbereiche über das Export-Modal

## JSON-Format

```json
{
  "id": "root",
  "name": "CEO",
  "person": "Name",
  "children": [
    {
      "id": "dept1",
      "name": "Department",
      "person": "Manager",
      "children": []
    }
  ]
}
```
