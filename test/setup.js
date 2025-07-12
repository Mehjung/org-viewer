// tests/e2e/setup.js
import { chromium } from "playwright";
import { spawn } from "child_process";
import { promisify } from "util";
import process from "process";

const sleep = promisify(setTimeout);

// Globale Browser-Instanz
let browser = null;
let server = null;

// Server starten vor allen Tests
export async function setup() {
  console.log("🚀 Starte lokalen Server...");

  // Lokalen Server starten
  server = spawn("npx", ["serve", ".", "-p", "3000"], {
    stdio: "pipe",
    shell: true,
  });

  // Warten bis Server bereit ist und testen
  let serverReady = false;
  let attempts = 0;
  const maxAttempts = 30;

  while (!serverReady && attempts < maxAttempts) {
    try {
      await sleep(1000);
      const response = await fetch("http://localhost:3000");
      if (response.ok) {
        serverReady = true;
        console.log("🌐 Server läuft auf http://localhost:3000");
      }
    } catch {
      attempts++;
      console.log(`⏳ Warte auf Server... (${attempts}/${maxAttempts})`);
    }
  }

  if (!serverReady) {
    throw new Error("Server konnte nicht gestartet werden");
  }

  // Browser starten
  console.log("🔧 Starte Browser...");
  browser = await chromium.launch({
    headless: process.env.HEADED !== "true",
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
  });

  // Browser global verfügbar machen
  globalThis.browser = browser;
  globalThis.baseURL = "http://localhost:3000";

  console.log("✅ Setup abgeschlossen");
}

// Cleanup nach allen Tests
export async function teardown() {
  console.log("🧹 Cleanup...");

  if (browser) {
    await browser.close();
  }

  if (server) {
    server.kill();
  }

  console.log("✅ Cleanup abgeschlossen");
}

// Für jeden Test eine neue Page erstellen
export async function createPage() {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Debugging: Console-Logs abfangen
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log("❌ Browser Error:", msg.text());
    }
  });

  // Debugging: Fehler abfangen
  page.on("pageerror", (error) => {
    console.log("❌ Page Error:", error.message);
  });

  return { page, context };
}
