# Design Guidelines - Vanilla Viewer

## Deutsche Bahn Corporate Design
- **Primärfarbe**: DB Rot (#EC0016) für Logo und Akzente
- **Sekundärfarbe**: DB Blau (#0066CC) für interaktive Elemente
- **Schriftart**: "DB Sans" als Hauptschrift, Fallback auf System-Fonts
- **Graustufen**: Konsistente Abstufungen für Text und Hintergründe

## Layout-Prinzipien
- **Header-Navigation**: Feste Leiste mit Logo und Hauptfunktionen
- **Vollbild-Canvas**: Maximaler Platz für Diagramm-Darstellung
- **Modal-Dialoge**: Overlay-Pattern für Export und Einstellungen
- **Responsive Grid**: Flexible Anpassung an verschiedene Bildschirmgrößen

## Interaktions-Design
- **Hover-States**: Dezente Farbwechsel und Schatten
- **Active States**: Klare visuelle Rückmeldung bei Selektion
- **Transitions**: Sanfte 0.2s-Übergänge für alle Interaktionen
- **Cursor-Changes**: Grab/Grabbing für Pan-Modus

## Typografie
- **Hierarchie**: Verschiedene Schriftgrößen für Name/Person/Titel
- **Line-Height**: 16px für optimale Lesbarkeit
- **Text-Wrapping**: Automatisches Umbrechen bei langen Titel
- **Contrast**: WCAG-konforme Kontrastverhältnisse

## Icon-System
- **Feather Icons**: Konsistente 16px SVG-Icons
- **Stroke-Width**: 2px für alle Icons
- **Semantik**: Upload, Download, Expand, Collapse, Close

## Accessibility
- **Keyboard-Navigation**: Tab-Order und Focus-States
- **Screen-Reader**: Semantische HTML-Struktur
- **Color-Blind**: Nicht nur Farbe für Information verwenden
- **Touch-Targets**: Mindestens 44px für mobile Geräte