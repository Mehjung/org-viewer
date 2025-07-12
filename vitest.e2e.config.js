// vitest.e2e.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // E2E Tests in neuer Struktur
    include: ["test/**/*.{test,spec}.js"],
    // Timeout für E2E Tests erhöhen
    testTimeout: 60000,
    // Sequenziell ausführen für stabilere E2E Tests
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Setup für Playwright
    setupFiles: ["./test/test-setup.js"],
    // Globale Test-Variablen
    globals: true,
    // Reporter
    reporter: ["verbose", "html"],
    outputFile: {
      html: "./test-results/e2e-report.html",
    },
  },
});
