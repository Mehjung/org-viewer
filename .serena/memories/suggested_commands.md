# Suggested Commands - Vanilla Viewer

## Windows-System Befehle
- **Verzeichnis auflisten**: `dir` oder `ls` (wenn Git Bash installiert)
- **Verzeichnis wechseln**: `cd <pfad>`
- **Datei suchen**: `dir /s /b *.html` oder `findstr /s "text" *.html`
- **Git-Befehle**: `git status`, `git add .`, `git commit -m "message"`

## Entwicklung
- **Datei öffnen**: `start index.html` (öffnet im Standard-Browser)
- **Code-Editor**: `code .` (VS Code) oder `notepad index.html`
- **Browser-Entwicklertools**: F12 in Browser für Debugging

## Testen
- **Lokaler Test**: Einfach `index.html` im Browser öffnen
- **HTTP-Server** (optional): `python -m http.server` oder `npx serve`
- **JSON-Testdaten**: Eigene JSON-Dateien zum Testen der Import-Funktion

## Deployment
- **Statische Bereitstellung**: Datei direkt auf Webserver kopieren
- **GitHub Pages**: Repository pushen und Pages aktivieren
- **Zip-Archiv**: Für einfache Verteilung

## Browser-Kompatibilität testen
- **Chrome/Edge**: Hauptentwicklung und Test
- **Firefox**: Cross-Browser-Kompatibilität
- **Safari**: Falls Mac-Zugang verfügbar

## Backup/Versionierung
- **Git init**: `git init` für Versionskontrolle
- **Commit**: `git add . && git commit -m "Beschreibung"`
- **Remote**: `git remote add origin <url>` und `git push`