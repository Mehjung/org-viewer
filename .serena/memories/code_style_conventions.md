# Code-Style und Konventionen - Vanilla Viewer

## JavaScript-Stil
- **Moderne ES6+ Syntax**: Arrow Functions, const/let, Template Literals
- **Funktionale Programmierung**: Closures und Module-Pattern
- **Kurze Variablennamen**: `sel` für selection, `pos` für position, `PAD` für padding
- **Kompakte Syntax**: Minimalistische Schreibweise für bessere Performance

## Namenskonventionen
- **camelCase**: Für Funktionen und Variablen (`expandSelected`, `nodeCount`)
- **UPPER_CASE**: Für Konstanten (`PAD`, `R`, `LH`, `MAX_CHARS`)
- **kebab-case**: Für CSS-Klassen (`node-circle`, `search-result`)

## CSS-Organisation
- **CSS Custom Properties**: Zentrale Design-Token (--db-red, --db-blue)
- **BEM-ähnliche Struktur**: Klare Namensgebung für Komponenten
- **Mobile-First**: Responsive Design-Prinzipien
- **Deutsche Bahn Design System**: Konsistente Corporate Identity

## Code-Struktur
- **IIFE Pattern**: Sofortige Funktionsausführung für Scope-Isolation
- **Funktionale Trennung**: Layout, Rendering, Events getrennt
- **Konstanten am Anfang**: Alle Konfigurationswerte zentral definiert
- **Event-Handler**: Globale window-Funktionen für HTML-Events

## Dokumentation
- **Inline-Kommentare**: Sparsam, nur bei komplexer Logik
- **Funktionsgruppierung**: Logische Blöcke mit Kommentar-Headern
- **Deutsche Sprache**: UI-Texte und Kommentare auf Deutsch