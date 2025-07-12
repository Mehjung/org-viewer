# Test Setup Anleitung für Agents

## Überblick

Diese Anleitung beschreibt, wie Tests für das Vanilla HTML Organizational Hierarchy Viewer Projekt erstellt werden müssen, um mit dem bestehenden Test-Setup zu funktionieren.

## Projekt-Struktur

```
test/
├── setup.js           # Gemeinsame Browser/Server Setup-Logik
├── test-setup.js      # Gemeinsame beforeAll/afterAll Hooks
├── task-X.Y/          # Task-spezifische Tests (z.B. task-1.0, task-1.1)
│   └── *.test.js      # Eigentliche Test-Dateien
└── testContext.md     # Diese Anleitung
```

## Test-Datei Template

### 1. Grundstruktur einer Test-Datei

```javascript
// test/task-X.Y/feature-name.test.js
import { describe, it, beforeEach, afterEach } from "vitest";
import { expect } from "@playwright/test";
import { createPage } from "../setup.js";

describe("Feature Name Tests", () => {
  let page, context;

  beforeEach(async () => {
    const pageContext = await createPage();
    page = pageContext.page;
    context = pageContext.context;

    await page.goto(globalThis.baseURL);
    await page.waitForLoadState("networkidle");
  });

  afterEach(async () => {
    if (context) {
      await context.close();
    }
  });

  it("should test basic functionality", async () => {
    // Test-Code hier - page ist bereits verfügbar
  });
});
```

### 2. Wichtige Imports

```javascript
// IMMER verwenden für Vitest + Playwright E2E Tests:
import { describe, it, beforeEach, afterEach } from "vitest";
import { expect } from "@playwright/test";
import { createPage } from "../setup.js";

// NICHT verwenden:
// import { test, expect } from '@playwright/test'; // Falsch für Vitest!
// import { expect } from 'vitest'; // Falsch für E2E Tests!
```

### 3. Page Setup und Navigation

```javascript
describe("Test Suite", () => {
  let page, context;

  beforeEach(async () => {
    // Page-Setup in jedem Test
    const pageContext = await createPage();
    page = pageContext.page;
    context = pageContext.context;

    // Zur Seite navigieren
    await page.goto(globalThis.baseURL);
    await page.waitForLoadState("networkidle");
  });

  afterEach(async () => {
    // Cleanup nach jedem Test
    if (context) {
      await context.close();
    }
  });

  it("test name", async () => {
    // Die Seite ist bereits geladen durch beforeEach
    // Direkt mit Tests beginnen!

    // Beispiel: Element finden und klicken
    await page.click("#node-s1");
  });
});
```

## Anwendungs-spezifische Informationen

### SVG Organisationsdiagramm

Die Hauptanwendung ist ein interaktives SVG-Organisationsdiagramm mit folgenden Elementen:

#### Node-IDs (für Selektoren):

- `#node-root` - CEO (Root-Node)
- `#node-s1` - Head of Strategy & Transformation
- `#node-s1a` - Strategy Lead
- `#node-s1b` - Transformation Lead
- `#node-s2` - Chief Digital & Tech Officer

#### Wichtige UI-Elemente:

- `#export-btn` - Export Button
- `#export-modal` - Export Modal Dialog
- `#close-modal` - Modal schließen Button
- `#file-input` - File Upload Input
- `#drop-zone` - Drag & Drop Zone

### Timing und Animationen

```javascript
// SVG-Animationen benötigen Wartezeiten:
await page.click("#node-s1");
await page.waitForTimeout(1000); // Warten auf Animation

// Für komplexe Animationen:
await page.waitForTimeout(1500);
```

### Selektoren Best Practices

```javascript
// ✅ GUT - Element-IDs verwenden:
await page.click("#node-s1");
await expect(page.locator("#node-s1a")).toBeVisible();

// ❌ SCHLECHT - Text-Selektoren bei SVG:
await page.click("text=Strategy Lead"); // Funktioniert nicht zuverlässig
```

## Beispiel-Test

```javascript
// test/task-1.0/example.test.js
import { describe, it, beforeEach, afterEach } from "vitest";
import { expect } from "@playwright/test";
import { createPage } from "../setup.js";

describe("Organizational Chart Tests", () => {
  let page, context;

  beforeEach(async () => {
    const pageContext = await createPage();
    page = pageContext.page;
    context = pageContext.context;

    await page.goto(globalThis.baseURL);
    await page.waitForLoadState("networkidle");
  });

  afterEach(async () => {
    if (context) {
      await context.close();
    }
  });

  it("should expand node when clicked", async () => {
    // Node sollte initial sichtbar sein
    await expect(page.locator("#node-s1")).toBeVisible();

    // Klick auf Node
    await page.click("#node-s1");
    await page.waitForTimeout(1000); // Animation abwarten

    // Child-Nodes sollten sichtbar werden
    await expect(page.locator("#node-s1a")).toBeVisible();
    await expect(page.locator("#node-s1b")).toBeVisible();
  });

  it("should open export modal", async () => {
    // Export Button klicken
    await page.click("#export-btn");

    // Modal sollte erscheinen
    await expect(page.locator("#export-modal")).toBeVisible();

    // Modal schließen
    await page.click("#close-modal");
    await expect(page.locator("#export-modal")).not.toBeVisible();
  });
});
```

## Konfiguration

### Test-Ausführung

```bash
# Alle Tests ausführen (headless):
npm test

# Mit Browser-Fenster (headed):
npm run test:headed

# Spezifischen Task testen:
npm test searchbar          # Alle Ordner mit "searchbar"
npm test task-1.0           # Spezifischer Ordner
npm test 0.1                # Alle mit "0.1"

# Mit Browser-Fenster:
npm run test:headed searchbar
```

### Timeouts

- Standard Timeout: 60 Sekunden (konfiguriert in vitest.e2e.config.js)
- Animation Timeouts: 1000-1500ms je nach Komplexität
- Server Start: Automatisch verwaltet durch setup.js

## Häufige Fehler vermeiden

### 1. Falsche Expect-Imports

```javascript
// ❌ FALSCH:
import { expect } from "vitest";

// ✅ RICHTIG:
import { expect } from "@playwright/test";
```

### 2. Fehlende Timeouts

```javascript
// ❌ FALSCH - Keine Wartezeit für Animationen:
await page.click("#node-s1");
await expect(page.locator("#node-s1a")).toBeVisible();

// ✅ RICHTIG - Mit Timeout:
await page.click("#node-s1");
await page.waitForTimeout(1000);
await expect(page.locator("#node-s1a")).toBeVisible();
```

### 3. Überflüssige Navigation

```javascript
// ❌ FALSCH - Page ist bereits geladen:
test("test", async ({ page }) => {
  await page.goto("http://localhost:3000"); // Nicht nötig!
});

// ✅ RICHTIG - Direkt testen:
test("test", async ({ page }) => {
  await page.click("#node-s1"); // Page ist bereits geladen
});
```

## Debugging-Tipps

### Screenshots bei Fehlern

```javascript
test("debug test", async ({ page }) => {
  // Bei Problemen Screenshot machen:
  await page.screenshot({ path: "debug.png" });

  // Oder nur bei Fehlern:
  try {
    await expect(page.locator("#element")).toBeVisible();
  } catch (error) {
    await page.screenshot({ path: "error.png" });
    throw error;
  }
});
```

### Console Logs prüfen

```javascript
// Browser Console Logs anzeigen:
page.on("console", (msg) => console.log("Browser:", msg.text()));
```

## Zusammenfassung für Agents

1. **Immer** Vitest-Imports verwenden: `import { describe, it, beforeEach, afterEach } from "vitest"`
2. **Immer** `@playwright/test` für expect verwenden: `import { expect } from "@playwright/test"`
3. **Immer** `createPage` aus setup.js verwenden: `import { createPage } from "../setup.js"`
4. **Immer** beforeEach/afterEach für Page-Setup verwenden
5. **Immer** Timeouts für SVG-Animationen verwenden (1000-1500ms)
6. **Immer** Element-IDs statt Text-Selektoren für SVG verwenden
7. Tests in `test/task-X.Y/` Ordner erstellen
8. Gemeinsame Setup-Dateien im `test/` Root verwenden
9. **Niemals** `test.describe` oder `test()` verwenden - das ist reines Playwright!
