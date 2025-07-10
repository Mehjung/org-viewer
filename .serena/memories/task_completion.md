# Task Completion Guidelines - Vanilla Viewer

## Nach Code-Änderungen
1. **Browser-Test**: index.html im Browser öffnen und Funktionalität testen
2. **JSON-Import testen**: Test-JSON-Datei laden und Darstellung prüfen
3. **Responsive Design**: Browser-Fenster verkleinern/vergrößern
4. **Cross-Browser-Test**: Chrome, Firefox, Edge testen

## Code-Validierung
- **HTML-Validation**: W3C Markup Validator verwenden
- **JavaScript-Syntax**: Browser-Konsole auf Fehler prüfen (F12)
- **CSS-Validation**: W3C CSS Validator für Styling-Probleme

## Performance-Checks
- **Ladezeit**: Datei-Größe und Rendering-Performance beachten
- **Memory-Leaks**: Bei großen Org-Charts auf Browser-Performance achten
- **SVG-Performance**: Rendering-Zeit bei vielen Knoten testen

## Funktionalitäts-Tests
- **Zoom/Pan**: Maus-Interaktionen testen
- **Expand/Collapse**: Organisationsbaum-Navigation
- **Export**: Markdown-Export in beiden Formaten testen
- **Search**: Suchfunktion mit verschiedenen Begriffen

## Deployment-Vorbereitung
1. **Backup erstellen**: Git commit oder Kopie anlegen
2. **Komprimierung prüfen**: Optional CSS/JS minifizieren
3. **Dokumentation aktualisieren**: README oder Kommentare anpassen

## Git-Workflow (falls verwendet)
```bash
git add index.html
git commit -m "Feature: Beschreibung der Änderung"
git push origin main
```

## Finaler Check
- **Demo-Modus**: Ohne JSON-Import funktionsfähig
- **Error-Handling**: Ungültige JSON-Dateien abfangen
- **UI-Feedback**: Benutzer-Interaktionen klar sichtbar