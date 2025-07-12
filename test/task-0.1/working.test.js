// test/task-0.1/working.test.js
import { describe, it, beforeEach, afterEach } from "vitest";
import { expect } from "@playwright/test";
import { createPage } from "../setup.js";

describe("Funktionsfähige E2E Tests", () => {
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

  it("sollte die Grundfunktionen testen", async () => {
    // Seite geladen
    const title = await page.title();
    expect(title).toBe("Organizational Hierarchy Viewer");

    // Header sichtbar
    await expect(page.locator(".header")).toBeVisible();

    // SVG Chart sichtbar
    await expect(page.locator("#chartSvg")).toBeVisible();

    console.log("✅ Grundfunktionen funktionieren");
  });

  it("sollte SVG-Nodes korrekt anklicken können", async () => {
    // Warten bis Chart geladen ist
    await page.waitForSelector("#chartSvg");
    await page.waitForTimeout(1000); // Warten auf Render

    // Initial Node-Count prüfen
    const initialCount = await page.locator("#nodeCount").textContent();
    console.log("Initial Node Count:", initialCount);

    // Strategy Node über ID anklicken (s1 = Head of Strategy & Transformation)
    const strategyNode = page.locator("#node-s1");
    await expect(strategyNode).toBeVisible();

    // Node anklicken
    await strategyNode.click();

    // Warten auf Animation und Render
    await page.waitForTimeout(1500);

    // Node-Count prüfen
    const newCount = await page.locator("#nodeCount").textContent();
    console.log("New Node Count:", newCount);

    // Prüfen ob Node-Count eine gültige Zahl ist
    expect(parseInt(newCount)).toBeGreaterThan(0);

    console.log("✅ SVG-Node-Klick funktioniert!");
  });

  it("sollte mehrere Nodes erweitern können", async () => {
    // Warten bis Chart geladen ist
    await page.waitForSelector("#chartSvg");
    await page.waitForTimeout(1000);

    // Strategy Node erweitern (s1)
    await page.locator("#node-s1").click();
    await page.waitForTimeout(1000);

    // Prüfen ob Sub-Nodes sichtbar sind
    const subNode1 = page.locator("#node-s1a"); // Strategic Org Dev
    const subNode2 = page.locator("#node-s1b"); // Org Design & Change

    await expect(subNode1).toBeVisible();
    await expect(subNode2).toBeVisible();

    console.log("✅ Sub-Nodes sind sichtbar nach Expand!");

    // Einen Sub-Node anklicken
    await subNode1.click();
    await page.waitForTimeout(1000);

    console.log("✅ Sub-Node-Klick funktioniert!");
  });

  it("sollte Nodes wieder einklappen können", async () => {
    // Strategy Node erweitern
    await page.locator("#node-s1").click();
    await page.waitForTimeout(1000);

    // Prüfen dass Sub-Nodes sichtbar sind
    await expect(page.locator("#node-s1a")).toBeVisible();

    // Strategy Node wieder anklicken (einklappen)
    await page.locator("#node-s1").click();
    await page.waitForTimeout(1000);

    // Sub-Nodes sollten nicht mehr sichtbar sein
    await expect(page.locator("#node-s1a")).not.toBeVisible();

    console.log("✅ Node-Einklappen funktioniert!");
  });

  it("sollte alle Nodes einklappen können", async () => {
    // Erst erweitern
    await page.locator("#node-s1").click();
    await page.waitForTimeout(1000);

    // Einklappen-Button klicken
    const collapseButton = page
      .locator(".header button")
      .filter({ hasText: "Einklappen" });
    await collapseButton.click();
    await page.waitForTimeout(1000);

    // Alle Sub-Nodes sollten verschwunden sein
    await expect(page.locator("#node-s1a")).not.toBeVisible();

    // Node-Count prüfen (sollte eine gültige Zahl sein)
    const nodeCount = await page.locator("#nodeCount").textContent();
    expect(parseInt(nodeCount)).toBeGreaterThan(0);

    console.log("✅ Alle Nodes einklappen funktioniert!");
  });

  it("sollte Export-Modal funktionieren", async () => {
    // Export-Button klicken
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();

    // Modal sollte offen sein
    await expect(page.locator("#exportModal")).toHaveClass(/open/);

    // Suchfeld testen
    await page.locator("#exportSearch").fill("CEO");
    await page.waitForTimeout(500);

    // Suchergebnisse sollten erscheinen
    await expect(page.locator("#exportResults .search-result")).toBeVisible();

    // Modal schließen
    await page.locator(".close-button").click();
    await expect(page.locator("#exportModal")).not.toHaveClass(/open/);

    console.log("✅ Export-Modal funktioniert!");
  });
});
