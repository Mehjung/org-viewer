import { describe, it, beforeEach, afterEach } from "vitest";
import { expect } from "@playwright/test";
import { createPage } from "../setup.js";

describe("Debug Export Modal Tests", () => {
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

  it("should debug export modal loading", async () => {
    // Enable console logging
    page.on('console', msg => {
      console.log('BROWSER:', msg.text());
    });

    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });

    // Check if openExportModal function exists
    const hasFunction = await page.evaluate(() => {
      return typeof window.openExportModal === 'function';
    });

    console.log("openExportModal function exists:", hasFunction);

    // Try to find the Export button
    const exportButton = page.locator('.header button').filter({ hasText: "Export" });
    const exportButtonExists = await exportButton.count() > 0;
    console.log("Export button exists:", exportButtonExists);

    if (exportButtonExists) {
      // Try to click it
      try {
        await exportButton.click();
        console.log("Export button clicked successfully");
        
        // Check modal state
        const modal = page.locator("#exportModal");
        const modalClass = await modal.getAttribute("class");
        console.log("Modal class after click:", modalClass);
        
      } catch (error) {
        console.log("Error clicking export button:", error.message);
      }
    }
  });
});
