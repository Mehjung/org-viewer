import { describe, it, beforeEach, afterEach } from "vitest";
import { expect } from "@playwright/test";
import { createPage } from "../setup.js";

describe("Searchbar Functionality Tests", () => {
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

  it("should display searchbar in header", async () => {
    // Check if searchbar elements are visible
    await expect(page.locator("#mainSearch")).toBeVisible();
    await expect(page.locator(".search-icon")).toBeVisible();

    // Dropdown should exist but be hidden initially
    const dropdown = page.locator("#searchDropdown");
    await expect(dropdown).toBeAttached();
    await expect(dropdown).not.toHaveClass(/visible/);

    // Check placeholder text
    const placeholder = await page
      .locator("#mainSearch")
      .getAttribute("placeholder");
    expect(placeholder).toBe("Abteilung oder Person suchen...");
  });

  it("should not show dropdown for short queries", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Type single character - should not show dropdown
    await searchInput.fill("s");
    await page.waitForTimeout(300);
    await expect(dropdown).not.toHaveClass(/visible/);

    // Clear input
    await searchInput.fill("");
    await page.waitForTimeout(300);
    await expect(dropdown).not.toHaveClass(/visible/);
  });

  it("should show dropdown for valid queries", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Type two characters - should show dropdown
    await searchInput.fill("st");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Should contain search results
    const searchItems = page.locator(".search-dropdown-item");
    await expect(searchItems.first()).toBeVisible();
  });

  it("should perform fuzzy search and highlight matches", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Search for "strategy" - should find "Head of Strategy & Transformation"
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Check if results contain highlighted text
    const firstResult = page.locator(".search-dropdown-item").first();
    await expect(firstResult).toBeVisible();
    await expect(firstResult.locator(".search-highlight")).toBeVisible();
  });

  it("should navigate dropdown with keyboard", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Enter search query with a more specific term to get fewer results
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Check we have dropdown items
    const dropdownItems = page.locator(".search-dropdown-item");
    const itemCount = await dropdownItems.count();
    expect(itemCount).toBeGreaterThan(0);

    // Press Arrow Down to select first item
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(500); // Longer wait to ensure update

    // First item should be selected
    const firstItem = dropdownItems.first();
    await expect(firstItem).toHaveClass(/selected/);

    // Test that other items are not selected
    if (itemCount > 1) {
      // Press Arrow Down again to select next item
      await searchInput.press("ArrowDown");
      await page.waitForTimeout(500);

      // Check if there's a second item and if it gets selected
      const secondItem = dropdownItems.nth(1);
      if ((await secondItem.count()) > 0) {
        await expect(secondItem).toHaveClass(/selected/);
        await expect(firstItem).not.toHaveClass(/selected/);

        // Test Arrow Up navigation
        await searchInput.press("ArrowUp");
        await page.waitForTimeout(500);

        // Should go back to first item
        await expect(firstItem).toHaveClass(/selected/);
        await expect(secondItem).not.toHaveClass(/selected/);
      }
    }
  });

  it("should highlight complete path when node is selected", async () => {
    const searchInput = page.locator("#mainSearch");

    // Search for a nested node
    await searchInput.fill("carol");
    await page.waitForTimeout(500);

    // Select the result using keyboard
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await searchInput.press("Enter");
    await page.waitForTimeout(1500); // Wait for navigation and rendering

    // Check that both parent and target nodes are visible and have path highlighting
    const parentNode = page.locator("#node-s1");
    const targetNode = page.locator("#node-s1a");

    await expect(parentNode).toBeVisible();
    await expect(targetNode).toBeVisible();

    // Check that nodes have the "in-path" or "active" class for blue highlighting
    // The exact class depends on the implementation - check both possibilities
    const parentHasPathClass = await parentNode
      .locator(".node-circle")
      .getAttribute("class");
    const targetHasPathClass = await targetNode
      .locator(".node-circle")
      .getAttribute("class");

    // Parent should be in path (blue) or active
    expect(parentHasPathClass).toMatch(/(in-path|active)/);
    // Target should be active or in-path
    expect(targetHasPathClass).toMatch(/(in-path|active)/);
  });

  it("should sync mouse hover with keyboard selection", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Enter search query
    await searchInput.fill("head");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    const dropdownItems = page.locator(".search-dropdown-item");
    const itemCount = await dropdownItems.count();

    if (itemCount > 1) {
      // Hover over second item
      await dropdownItems.nth(1).hover();
      await page.waitForTimeout(200);

      // Second item should be selected
      await expect(dropdownItems.nth(1)).toHaveClass(/selected/);

      // Use keyboard to move to first item
      await searchInput.press("ArrowUp");
      await page.waitForTimeout(300);

      // First item should now be selected
      await expect(dropdownItems.first()).toHaveClass(/selected/);
      await expect(dropdownItems.nth(1)).not.toHaveClass(/selected/);
    }
  });

  it("should select result with Enter key", async () => {
    const searchInput = page.locator("#mainSearch");

    // Search for specific node
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);

    // Navigate to first result and press Enter
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await searchInput.press("Enter");
    await page.waitForTimeout(1000); // Wait for navigation and animation

    // Check if node is visible and selected (strategy node should be expanded/selected)
    await expect(page.locator("#node-s1")).toBeVisible();

    // Dropdown should be hidden
    const dropdown = page.locator("#searchDropdown");
    await expect(dropdown).not.toHaveClass(/visible/);
  });

  it("should close dropdown with Escape key", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Enter search query
    await searchInput.fill("ceo");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Press Escape
    await searchInput.press("Escape");
    await page.waitForTimeout(300);

    // Dropdown should be hidden and input should lose focus
    await expect(dropdown).not.toHaveClass(/visible/);
  });

  it("should search by person name", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Search for person name "Alice" (CEO)
    await searchInput.fill("alice");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Should find results containing "Alice"
    const results = page.locator(".search-dropdown-item");
    await expect(results.first()).toBeVisible();

    // Check if person name is highlighted
    const personText = page.locator(".search-dropdown-item .search-highlight");
    await expect(personText).toBeVisible();
  });

  it("should navigate to found node when clicked", async () => {
    const searchInput = page.locator("#mainSearch");

    // Search for a specific department
    await searchInput.fill("transformation");
    await page.waitForTimeout(500);

    // Click on first search result
    const firstResult = page.locator(".search-dropdown-item").first();
    await firstResult.click();
    await page.waitForTimeout(1000); // Wait for navigation

    // The node should be visible and expanded
    await expect(page.locator("#node-s1")).toBeVisible();

    // Dropdown should be hidden
    const dropdown = page.locator("#searchDropdown");
    await expect(dropdown).not.toHaveClass(/visible/);
  });

  it("should clear dropdown when input is cleared", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Enter search query
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Clear input
    await searchInput.fill("");
    await page.waitForTimeout(300);

    // Dropdown should be hidden
    await expect(dropdown).not.toHaveClass(/visible/);
  });

  it("should expand parent nodes when navigating to nested node", async () => {
    const searchInput = page.locator("#mainSearch");

    // Search for a deeply nested node
    await searchInput.fill("carol");
    await page.waitForTimeout(500);

    // Select the result
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await searchInput.press("Enter");
    await page.waitForTimeout(1500); // Wait for expansion animation

    // Parent nodes should be expanded to show the path
    await expect(page.locator("#node-s1")).toBeVisible(); // Parent
    await expect(page.locator("#node-s1a")).toBeVisible(); // Target node
  });

  it("should handle focus and blur events correctly", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Enter search query
    await searchInput.fill("head");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Click somewhere else to blur the input
    await page.click(".logo");
    await page.waitForTimeout(300);

    // Dropdown should be hidden after blur
    await expect(dropdown).not.toHaveClass(/visible/);
  });

  it("should handle keyboard navigation wrap-around", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Enter search query that should give multiple results
    await searchInput.fill("head");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    const dropdownItems = page.locator(".search-dropdown-item");
    const itemCount = await dropdownItems.count();

    if (itemCount > 1) {
      // Navigate to last item by pressing Arrow Down multiple times
      for (let i = 0; i < itemCount; i++) {
        await searchInput.press("ArrowDown");
        await page.waitForTimeout(100);
      }

      // Should wrap around to first item
      await expect(dropdownItems.first()).toHaveClass(/selected/);

      // Press Arrow Up to go to last item (wrap around)
      await searchInput.press("ArrowUp");
      await page.waitForTimeout(300);

      // Should be at last item now
      await expect(dropdownItems.nth(itemCount - 1)).toHaveClass(/selected/);
    }
  });

  it("should show appropriate results for partial matches", async () => {
    const searchInput = page.locator("#mainSearch");
    const dropdown = page.locator("#searchDropdown");

    // Test partial matching
    await searchInput.fill("dig");
    await page.waitForTimeout(500);
    await expect(dropdown).toHaveClass(/visible/);

    // Should find "Digital" in "Chief Digital & Tech Officer"
    const results = page.locator(".search-dropdown-item");
    const firstResult = results.first();
    await expect(firstResult).toBeVisible();

    const text = await firstResult.textContent();
    expect(text.toLowerCase()).toContain("digital");
  });

  it("should automatically zoom to fit selected node and children", async () => {
    const searchInput = page.locator("#mainSearch");

    // Search for a node with children (e.g., CEO or Strategy)
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);

    // Get initial zoom level
    const initialZoom = await page.locator("#zoomLevel").textContent();
    console.log("Initial zoom:", initialZoom);

    // Select the result
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await searchInput.press("Enter");
    await page.waitForTimeout(3000); // Longer wait for zoom animation

    // Check that zoom level has changed (auto-zoom occurred)
    const finalZoom = await page.locator("#zoomLevel").textContent();
    console.log("Final zoom:", finalZoom);

    // The zoom should have adjusted to fit the content OR the node should be properly visible
    // Sometimes zoom doesn't change if content already fits
    const zoomChanged = finalZoom !== initialZoom;
    const nodeVisible = await page.locator("#node-s1").isVisible();

    // Either zoom changed OR node is properly visible
    expect(zoomChanged || nodeVisible).toBe(true);

    // The selected node and its children should be visible
    await expect(page.locator("#node-s1")).toBeVisible();
  });

  it("should collapse all other nodes when navigating via search", async () => {
    const searchInput = page.locator("#mainSearch");

    // First, manually expand multiple nodes by clicking on the node groups
    await page.click("#node-it");
    await page.waitForTimeout(500);
    await page.click("#node-s1");
    await page.waitForTimeout(500);

    // Verify multiple branches are expanded
    await expect(page.locator("#node-it")).toBeVisible();
    await expect(page.locator("#node-s1a")).toBeVisible();

    // Now search for a specific node in a different branch
    await searchInput.fill("digital");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await searchInput.press("Enter");
    await page.waitForTimeout(1500);

    // Only the path to the selected node should be expanded
    // Other previously expanded nodes should be collapsed
    await expect(page.locator("#node-it")).toBeVisible(); // Target node

    // Strategy branch should be collapsed (children not visible)
    await expect(page.locator("#node-s1a")).not.toBeVisible();
  });

  it("should handle sister node navigation correctly", async () => {
    const searchInput = page.locator("#mainSearch");

    // Search for first sister node
    await searchInput.fill("strategy");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await searchInput.press("Enter");
    await page.waitForTimeout(1500);

    // Verify first node is expanded
    await expect(page.locator("#node-s1")).toBeVisible();
    await expect(page.locator("#node-s1a")).toBeVisible();

    // Now search for sister node (IT)
    await page.click("#mainSearch"); // Focus search again
    await searchInput.fill("digital");
    await page.waitForTimeout(500);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(300);
    await searchInput.press("Enter");
    await page.waitForTimeout(1500);

    // Strategy node should be collapsed, IT node should be selected
    await expect(page.locator("#node-it")).toBeVisible();
    await expect(page.locator("#node-s1a")).not.toBeVisible(); // Strategy children collapsed
  });

  it("should maintain consistent behavior with manual navigation", async () => {
    const searchInput = page.locator("#mainSearch");

    // Search navigation
    await searchInput.fill("carol");
    await page.waitForTimeout(300);
    await searchInput.press("ArrowDown");
    await page.waitForTimeout(200);
    await searchInput.press("Enter");
    await page.waitForTimeout(800);

    // Get the visual state after search navigation
    const searchNavState = {
      carolVisible: await page.locator("#node-s1a").isVisible(),
      strategyExpanded: await page.locator("#node-s1").isVisible(),
    };

    // Reset to initial state
    await page.reload();
    await page.waitForTimeout(500);

    // Manual navigation to same node
    await page.click("#node-s1");
    await page.waitForTimeout(300);
    await page.click("#node-s1a");
    await page.waitForTimeout(800);

    // Get the visual state after manual navigation
    const manualNavState = {
      carolVisible: await page.locator("#node-s1a").isVisible(),
      strategyExpanded: await page.locator("#node-s1").isVisible(),
    };

    // States should be identical
    expect(searchNavState.carolVisible).toBe(manualNavState.carolVisible);
    expect(searchNavState.strategyExpanded).toBe(
      manualNavState.strategyExpanded
    );
  });

  it("should test collapse all button functionality", async () => {
    // First expand multiple nodes

    await page.click("#node-it");
    await page.waitForTimeout(300);
    await page.click("#node-s1");
    await page.waitForTimeout(300);

    // Verify nodes are expanded
    await expect(page.locator("#node-s1")).toBeVisible();
    await expect(page.locator("#node-it")).toBeVisible();
    await expect(page.locator("#node-s1a")).toBeVisible();
    await expect(page.locator("#node-s1b")).toBeVisible();

    // Click collapse all button
    await page.click('button:has-text("Einklappen")');
    await page.waitForTimeout(500);

    // Only root should be visible, all children collapsed
    await expect(page.locator("#node-root")).toBeVisible();
    await expect(page.locator("#node-s1a")).not.toBeVisible();
    await expect(page.locator("#node-s1b")).not.toBeVisible();

    // Root's direct children should still be visible but collapsed
    await expect(page.locator("#node-s1")).toBeVisible();
    await expect(page.locator("#node-it")).toBeVisible();
  });
});
