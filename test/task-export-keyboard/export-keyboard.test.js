import { describe, it, beforeEach, afterEach } from "vitest";
import { expect } from "@playwright/test";
import { createPage } from "../setup.js";

describe("Export Modal Keyboard Navigation Tests", () => {
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

  it("should open export modal with proper labels", async () => {
    // Click export button to open modal
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();

    // Modal should be visible
    await expect(page.locator("#exportModal")).toHaveClass(/open/);

    // Check that labels exist and have proper styling (no text cursor)
    const leftLabel = page.locator('label[for="exportSearch"]');
    const rightLabel = page.locator('label:has-text("Export-Liste")');

    await expect(leftLabel).toBeVisible();
    await expect(rightLabel).toBeVisible();

    // Check that labels have user-select: none (no text cursor)
    const leftLabelStyle = await leftLabel.evaluate(
      (el) => getComputedStyle(el).userSelect
    );
    const rightLabelStyle = await rightLabel.evaluate(
      (el) => getComputedStyle(el).userSelect
    );

    expect(leftLabelStyle).toBe("none");
    expect(rightLabelStyle).toBe("none");
  });

  it("should navigate search results with arrow keys", async () => {
    // Open export modal
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    // Type search query to get results
    const searchInput = page.locator("#exportSearch");
    await searchInput.fill("head");
    await page.waitForTimeout(500);

    // Check that results are visible
    const searchResults = page.locator("#exportResults .search-result");
    const resultCount = await searchResults.count();
    expect(resultCount).toBeGreaterThan(0);

    // Press Arrow Down to navigate
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);

    // First result should be selected
    const firstResult = searchResults.first();
    await expect(firstResult).toHaveClass(/selected/);

    // Press Arrow Down again if there are multiple results
    if (resultCount > 1) {
      await searchInput.press("ArrowDown");
      await page.waitForTimeout(300);

      const secondResult = searchResults.nth(1);
      await expect(secondResult).toHaveClass(/selected/);
      await expect(firstResult).not.toHaveClass(/selected/);
    }
  });

  it("should add items to export list with Right arrow", async () => {
    // Open export modal
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    // Search for an item
    const searchInput = page.locator("#exportSearch");
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);

    // Navigate to first result (switches focus to exportResults)
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);

    // Check initial export list count
    const exportCount = page.locator("#exportCount");
    const initialCount = await exportCount.textContent();
    expect(initialCount).toBe("0");

    // Now focus is on exportResults, press Right arrow to add to export list
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    // Export count should increase
    const newCount = await exportCount.textContent();
    expect(parseInt(newCount)).toBeGreaterThan(parseInt(initialCount));

    // Item should appear in export list
    const exportListItems = page.locator("#exportList .search-result");
    const exportItemCount = await exportListItems.count();
    expect(exportItemCount).toBeGreaterThan(0);
  });

  it("should switch focus between search and export list with Tab", async () => {
    // Open export modal and add an item first
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    const searchInput = page.locator("#exportSearch");
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    // Clear search to remove search results, then Tab should go to export list
    await searchInput.fill("");
    await page.waitForTimeout(300);
    await searchInput.press("Tab");
    await page.waitForTimeout(300);

    // Export list should now be focused and have a selected item
    const exportListItems = page.locator("#exportList .search-result");
    if ((await exportListItems.count()) > 0) {
      const firstExportItem = exportListItems.first();
      await expect(firstExportItem).toHaveClass(/selected/);
    }
  });

  it("should navigate export list with arrow keys", async () => {
    // Open export modal and add multiple items
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    const searchInput = page.locator("#exportSearch");

    // Add first item
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    // Add second item
    await searchInput.fill("digital");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    // Clear search to remove search results, then switch to export list
    await searchInput.fill("");
    await page.waitForTimeout(300);
    await searchInput.press("Tab");
    await page.waitForTimeout(300);

    const exportListItems = page.locator("#exportList .search-result");
    const itemCount = await exportListItems.count();

    if (itemCount > 1) {
      // First item should be selected
      await expect(exportListItems.first()).toHaveClass(/selected/);

      // Press Arrow Down to move to next item
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(300);

      // Second item should now be selected
      await expect(exportListItems.nth(1)).toHaveClass(/selected/);
      await expect(exportListItems.first()).not.toHaveClass(/selected/);
    }
  });

  it("should remove items from export list with Left arrow", async () => {
    // Open export modal and add an item
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    const searchInput = page.locator("#exportSearch");
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    // Check that item was added
    const exportCount = page.locator("#exportCount");
    const countAfterAdd = await exportCount.textContent();
    expect(parseInt(countAfterAdd)).toBeGreaterThan(0);

    // Clear search to remove search results, then switch to export list
    await searchInput.fill("");
    await page.waitForTimeout(300);
    await searchInput.press("Tab");
    await page.waitForTimeout(300);

    // Press Left arrow to remove item
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(500);

    // Export count should decrease
    const countAfterRemove = await exportCount.textContent();
    expect(parseInt(countAfterRemove)).toBeLessThan(parseInt(countAfterAdd));
  });

  it("should close modal with Escape key", async () => {
    // Open export modal
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    // Modal should be open
    await expect(page.locator("#exportModal")).toHaveClass(/open/);

    // Press Escape
    const searchInput = page.locator("#exportSearch");
    await searchInput.press("Escape");
    await page.waitForTimeout(300);

    // Modal should be closed
    await expect(page.locator("#exportModal")).not.toHaveClass(/open/);
  });

  it("should handle mouse hover synchronization", async () => {
    // Open export modal
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    // Search for items
    const searchInput = page.locator("#exportSearch");
    await searchInput.fill("head");
    await page.waitForTimeout(500);

    const searchResults = page.locator("#exportResults .search-result");
    const resultCount = await searchResults.count();

    if (resultCount > 1) {
      // Hover over second result
      await searchResults.nth(1).hover();
      await page.waitForTimeout(300);

      // Second result should be selected
      await expect(searchResults.nth(1)).toHaveClass(/selected/);

      // Use keyboard to navigate
      await searchInput.press("ArrowDown");
      await page.waitForTimeout(300);

      // Keyboard navigation should work and update selection
      // (The exact behavior depends on implementation - it might wrap or stay)
      const selectedResults = await page
        .locator("#exportResults .search-result.selected")
        .count();
      expect(selectedResults).toBe(1);
    }
  });

  it("should maintain focus and selection state properly", async () => {
    // Open export modal
    const exportButton = page
      .locator(".header button")
      .filter({ hasText: "Export" });
    await exportButton.click();
    await page.waitForTimeout(500);

    // Add an item to export list
    const searchInput = page.locator("#exportSearch");
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    // Clear search to remove search results, then switch to export list
    await searchInput.fill("");
    await page.waitForTimeout(300);
    await searchInput.press("Tab");
    await page.waitForTimeout(300);

    // Should have selection in export list
    const exportListItems = page.locator("#exportList .search-result");
    if ((await exportListItems.count()) > 0) {
      await expect(exportListItems.first()).toHaveClass(/selected/);
    }

    // Switch back to search
    await page.keyboard.press("Tab");
    await page.waitForTimeout(300);

    // Search input should be focused
    const focusedElement = await page.evaluate(() => document.activeElement.id);
    expect(focusedElement).toBe("exportSearch");
  });
});
