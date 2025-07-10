# Animation-System Details - Vanilla Viewer

## 🎬 Node-Click-Animation (Komplex-System)

### **Gesamte Sequenz**
```
0ms          100ms      900ms     1300ms
|              |          |         |
Sister-Reset → Linie    → Node    → Alles
+Selection     zeichnet   morpht    fertig
+Viewport      sich       von Weiß  
parallel       (800ms)    zu Blau   
               parallel   (400ms)   
```

### **Code-Ablauf bei Node-Click**

#### **1. Sofortige Actions (0ms)**
```javascript
grp.onclick = () => {
  resetSisterNodes(p.id);    // Sister-Nodes/Linien sofort weiß
  collapseSiblings(p.id);    // Logik-Update
  expanded.add(p.id);        // Logik-Update
  sel = p.id;                // Selection SOFORT setzen
  render();                  // DOM neu + Viewport parallel
  animateToClickedNode(p.id); // Animation startet
};
```

#### **2. Sister-Node-Reset (0ms)**
```javascript
function resetSisterNodes(nodeId) {
  // Für jeden Sister-Node:
  siblingCircle.style.fill = '#ffffff';           // Sofort weiß
  siblingCircle.style.stroke = 'var(--db-gray-light)'; // Grauer Rand
  
  // Für jede Sister-Connection:
  siblingConnection.style.stroke = 'var(--db-gray-light)'; // Grau
  siblingConnection.style.strokeWidth = '1';               // Dünn
  siblingConnection.classList.remove('animating', 'animated'); // Clean
}
```

#### **3. Animation-Start (100ms Delay)**
```javascript
function animateToClickedNode(nodeId) {
  setTimeout(() => {
    // Linie-Animation (800ms)
    connection.classList.add('animating');
    setTimeout(() => {
      connection.classList.remove('animating');
      connection.classList.add('animated'); // Linie bleibt sichtbar
    }, 800);
    
    // Node-Animation (startet nach Linie)
    setTimeout(() => createColorMorphEffect(nodeGroup, nodePos), 800);
  }, 100);
}
```

#### **4. Node-Morph (nach 800ms)**
```javascript
function createColorMorphEffect(nodeGroup, nodePos) {
  const originalCircle = nodeGroup.querySelector('circle');
  originalCircle.classList.add('node-morphing'); // CSS-Animation startet
  
  setTimeout(() => {
    originalCircle.classList.remove('node-morphing'); // Clean-up
  }, 400);
}
```

## 🎨 CSS-Animation-Definitionen

### **Linie-Zeichnung**
```css
.connection.animating {
  stroke: var(--db-blue);
  stroke-width: 3;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 0.8s ease-in-out forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

.connection.animated {
  stroke: var(--db-blue);
  stroke-width: 3;
  stroke-dasharray: none; /* Normale durchgezogene Linie */
}
```

### **Node-Morph**
```css
@keyframes colorMorph {
  0% { fill: #ffffff; }    /* Startet weiß */
  100% { fill: var(--db-blue); } /* Endet blau */
}

.node-morphing {
  animation: colorMorph 0.4s ease-in-out forwards;
}

/* Verhindert sofortiges Blau bei Selection */
.node-circle.active:not(.node-morphing),
.node-circle.in-path:not(.node-morphing) {
  fill: var(--db-blue);
  stroke: var(--db-blue);
}

/* Während Animation: nur Stroke blau */
.node-circle.node-morphing {
  stroke: var(--db-blue);
}
```

## ⚡ Parallele Viewport-Bewegung

### **render() Integration**
```javascript
function render() {
  svg.innerHTML = '';
  // ... Layout-Aufbau
  updateScrollBounds();
  ensureVisible(); // ← Läuft parallel zur Animation
}

function ensureVisible() {
  if (!sel) return; // sel ist bereits gesetzt!
  // Auto-Zoom und Smooth-Scroll startet sofort
}
```

### **Timing-Koordination**
- **Selection sofort**: `sel = p.id` vor render()
- **Viewport sofort**: `ensureVisible()` läuft parallel
- **Animation parallel**: Linie + Node-Morph laufen während Viewport-Movement

## 🔧 Technische Details

### **DOM-Manipulation-Timing**
1. **Vor render()**: Sister-Nodes im alten DOM manipuliert
2. **render()**: Neuer DOM erstellt mit korrekter Selection
3. **Nach render()**: Animation auf neuem DOM

### **CSS-Klassen-Management**
- **`.animating`**: Temporär während Linie-Animation
- **`.animated`**: Permanent nach Linie-Animation
- **`.node-morphing`**: Temporär während Node-Animation
- **`.active`**: Permanent für Selected-State (aber blockiert während Morph)

### **Performance-Optimierungen**
- **requestAnimationFrame**: Smooth 60fps für Custom-Animationen
- **CSS-Transitions**: Hardware-beschleunigte Animationen
- **setTimeout-Koordination**: Präzise Timing-Kontrolle
- **Parallele Execution**: Keine blockierenden Operationen

## 🎯 Warum dieses System funktioniert

### **Problem-Lösung**
- **render() überschreibt DOM**: Animation startet NACH render()
- **CSS-Konflikte**: `:not(.node-morphing)` verhindert sofortiges Blau
- **Timing-Issues**: Selection vor render() ermöglicht paralleles Viewport
- **Sister-Node-Reset**: Vor render() im alten DOM, bevor es gelöscht wird

### **User-Experience**
- **Sofortiges Feedback**: Sisters werden sofort weiß
- **Smooth Performance**: Alles läuft parallel ohne Blockierung
- **Visuelle Kontinuität**: Linie bleibt nach Animation sichtbar
- **Responsive Feel**: Keine Wartezeiten zwischen Actions

Dieses Animation-System ist hochoptimiert für Performance und UX!