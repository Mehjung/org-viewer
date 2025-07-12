#!/usr/bin/env node
// scripts/test-runner.js
import { spawn } from "child_process";
import { readdir } from "fs/promises";
import path from "path";
import process from "process";

/**
 * Flexibler Test-Runner für E2E Tests
 *
 * Verwendung:
 * npm test                    # Alle Tests
 * npm test searchbar          # Alle Ordner mit "searchbar"
 * npm test task-0.1           # Spezifischer Ordner
 * npm test:headed searchbar   # Mit Browser-Fenster
 */

async function findTestFolders(searchString = "") {
  const testDir = "./test";

  try {
    const entries = await readdir(testDir, { withFileTypes: true });

    // Alle Ordner finden die den Suchstring enthalten
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => name.includes(searchString));

    return folders.map((folder) => path.join(testDir, folder));
  } catch (error) {
    console.error("❌ Fehler beim Lesen des test/ Ordners:", error.message);
    return [];
  }
}

async function runTests(searchString = "") {
  const folders = await findTestFolders(searchString);

  if (folders.length === 0) {
    console.log(`❌ Keine Test-Ordner gefunden für: "${searchString}"`);
    console.log("💡 Verfügbare Ordner:");
    const allFolders = await findTestFolders();
    allFolders.forEach((folder) => console.log(`   - ${folder}`));
    process.exit(1);
  }

  console.log(`🎯 Gefundene Test-Ordner für "${searchString}":`);
  folders.forEach((folder) => console.log(`   - ${folder}`));
  console.log("");

  // Vitest-Befehl zusammenbauen
  const isHeaded = process.env.HEADED === "true";
  const vitestCmd = "npx";
  const vitestArgs = [
    "vitest",
    "run",
    ...folders,
    "--config",
    "vitest.e2e.config.js",
  ];

  // Umgebungsvariablen
  const env = { ...process.env };
  if (isHeaded) {
    env.HEADED = "true";
    env.SLOW_MO = "50"; // Sichtbare Geschwindigkeit
    console.log("🖥️  Modus: HEADED (mit Browser-Fenster)");
  } else {
    console.log("⚡ Modus: HEADLESS (schnelle Ausführung)");
  }

  console.log(`📋 Befehl: ${vitestCmd} ${vitestArgs.join(" ")}`);
  console.log("");

  // Tests ausführen
  const child = spawn(vitestCmd, vitestArgs, {
    stdio: "inherit",
    env,
    shell: true,
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log("✅ Tests erfolgreich abgeschlossen!");
    } else {
      console.log(`❌ Tests fehlgeschlagen (Exit Code: ${code})`);
    }
    process.exit(code);
  });

  child.on("error", (error) => {
    console.error("❌ Fehler beim Ausführen der Tests:", error.message);
    process.exit(1);
  });
}

// Hauptfunktion
async function main() {
  const searchString = process.argv[2] || "";

  console.log("🧪 E2E Test Runner");
  console.log("==================");

  if (searchString) {
    console.log(`🔍 Suche nach: "${searchString}"`);
  } else {
    console.log("🔍 Alle Tests ausführen");
  }

  await runTests(searchString);
}

main().catch((error) => {
  console.error("❌ Unerwarteter Fehler:", error);
  process.exit(1);
});
