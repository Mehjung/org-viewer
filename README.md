# Vanilla Organizational Hierarchy Viewer

Ein interaktiver Viewer für Organisationsstrukturen mit Vanilla JavaScript.

## Features

- 🌳 Interaktive Hierarchie-Darstellung
- 🔍 Zoom und Pan-Funktionalität
- 📁 Drag & Drop JSON-Import
- 🔄 Expand/Collapse Nodes
- 📊 Export-Funktionalität
- 📱 Responsive Design

## E2E Tests mit Vitest & Playwright

### Installation

```bash
npm install
npm run test:setup
```

### Tests ausführen

```bash
# Alle E2E Tests ausführen (headless)
npm run test:e2e

# Tests mit UI (Browser sichtbar)
npm run test:e2e:headed

# Tests mit Debug-Modus (langsam + sichtbar)
npm run test:e2e:debug

# Test UI (interaktiv)
npm run test:e2e:ui

# Lokalen Server starten (für manuelle Tests)
npm run serve
```

### Test-Struktur

```
tests/
├── e2e/
│   ├── setup.js                    # Browser & Server Setup
│   ├── hierarchy-viewer.test.js    # Haupttests
│   └── test-data.json             # Test-Daten
├── vitest.e2e.config.js           # Vitest Konfiguration
└── test-results/                   # Test-Reports
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
# Tests mit sichtbarem Browser (Windows/PowerShell)
npm run test:e2e:headed

# Tests verlangsamt ausführen für Debugging
npm run test:e2e:debug

# Manuell mit Umgebungsvariablen (Linux/Mac)
HEADED=true npm run test:e2e
SLOW_MO=100 HEADED=true npm run test:e2e
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
