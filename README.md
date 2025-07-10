# DB Org Chart Viewer

Ein interaktiver Organisationsdiagramm-Viewer für die Deutsche Bahn mit modernen UX-Features und intelligentem Viewport-Management.

## ✨ Features

### 🎯 **Kern-Funktionalität**
- **Interaktive Organisationsdiagramme** mit Zoom, Pan und Navigation
- **JSON-Import** für Organisationsstrukturen
- **Accordion-Style Expansion** - nur ein Geschwister-Node zur Zeit
- **Multi-Export** mit alphabetischer OE-Sortierung
- **Intelligente Suchfunktion** mit Highlight

### 🎨 **Moderne UX**
- **Deutsche Bahn Corporate Design** mit offiziellen Farben
- **Gestrichelte Ring-Indikatoren** für expandierbare Nodes
- **Smooth Animations** mit adaptiver Geschwindigkeit
- **Auto-Zoom-Management** respektiert User-Präferenzen
- **Responsive Design** für alle Bildschirmgrößen

### ⚡ **Intelligente Features**
- **Smart Viewport-Logic** - zoomt automatisch für optimale Sicht
- **User-Zoom-Awareness** - blockiert Auto-Zoom nach manueller Anpassung
- **Child-State-Memory** - saubere Expansion/Kollaps-Zyklen
- **OE-Code-Sortierung** - sortiert nach Organisationsbezeichnung vor letztem `-`

## 🚀 **Installation & Nutzung**

### **Einfacher Start**
1. Repository klonen oder `index.html` herunterladen
2. `index.html` im Browser öffnen
3. Fertig! Keine Installation oder Build-Tools erforderlich

### **JSON-Import**
```json
{
  "id": "root",
  "name": "CEO – Geschäftsführung",
  "person": "Max Mustermann",
  "children": [
    {
      "id": "it",
      "name": "R.RR-MI-BB-HE - IT-Abteilung",
      "person": "Anna Schmidt",
      "children": []
    }
  ]
}
```

### **Demo-Modus**
Öffne `index.html` direkt - enthält Demo-Daten zum Ausprobieren.

## 🎛️ **Bedienung**

### **Navigation**
- **Klick auf Node**: Expandieren/Kollabieren
- **Strg + Mausrad**: Zoomen
- **Drag**: Viewport verschieben
- **Einklappen-Button**: Alle Nodes schließen

### **Export**
1. **Export-Button** klicken
2. **Abteilungen suchen** (alphabetisch sortiert nach OE-Code)
3. **→ Button**: Zur Export-Liste hinzufügen
4. **Format wählen**: Hierarchisch oder Flache Liste
5. **Multi-Export**: Alle Elemente in einer Datei

### **Zoom-Management**
- **Manueller Zoom**: 2 Sekunden "Ruhe" vor Auto-Features
- **Auto-Zoom-Out**: Bei zu großen Child-Sets
- **Auto-Zoom-In**: Beim Kollabieren großer Nodes
- **Zoom-Anzeige**: Aktueller Level rechts oben

## 🛠️ **Technische Details**

### **Architektur**
- **Single-File-App**: Alles in `index.html`
- **Vanilla JavaScript**: Keine Frameworks oder Dependencies
- **SVG-basiert**: Skalierbare Vektorgrafiken
- **CSS Custom Properties**: Deutsche Bahn Design System

### **Browser-Support**
- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Browser

### **Performance**
- **Effiziente Rendering**: Nur sichtbare Elemente
- **Smart Caching**: Position und State-Management
- **Optimierte Animationen**: RequestAnimationFrame
- **Memory-Efficient**: Minimale DOM-Manipulation

## 📊 **OE-Code-Sortierung**

Das System erkennt automatisch Organisationsbezeichnungen:

```
R.RR-MI-BB-HE - Betriebszentrum Hamburg
```

**Sortier-Key**: `R.RR-MI-BB-HE` (Text vor letztem `-`)
**Ignoriert**: `Betriebszentrum Hamburg` (Funktionsbeschreibung)

## 🎨 **Design-System**

### **Farben**
- **DB Rot**: `#EC0016` (Logo, Akzente)
- **DB Blau**: `#0066CC` (Interaktive Elemente)
- **DB Grau**: `#646973` (Text, Inaktive States)

### **Expand-Indikatoren**
- **Expandiert**: Blauer gestrichelter Ring (`opacity: 0.7`)
- **Kollabiert**: Grauer gestrichelter Ring (`opacity: 0.5`)
- **Hover**: Verstärkte Stroke-Width für Feedback

## 🔧 **Entwicklung**

### **Lokaler Test**
```bash
# Einfach im Browser öffnen
start index.html

# Oder lokaler Server (optional)
python -m http.server 8000
# Dann: http://localhost:8000
```

### **Code-Style**
- **Moderne ES6+**: Arrow Functions, Template Literals
- **Funktionale Architektur**: Module Pattern mit Closures
- **Kompakte Syntax**: Optimiert für Single-File
- **Deutsche Kommentare**: Konsistent mit UI-Sprache

## 📋 **Roadmap**

- [ ] **Drag & Drop** Node-Reorganisation
- [ ] **Keyboard Navigation** für Accessibility
- [ ] **Print-Optimierung** für Organigramm-Ausdrucke
- [ ] **CSV-Import** zusätzlich zu JSON
- [ ] **Theme-Switcher** für andere Corporate Designs

## 🤝 **Contributing**

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 **Lizenz**

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🎯 **Credits**

Entwickelt für die Deutsche Bahn AG mit Fokus auf moderne UX und Performance.

---

**🚀 Ready to explore your organization!**
