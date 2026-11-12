// Copyright (c) 2026 agens-sh. All Rights Reserved.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 15_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    headless: true,
    trace: "off",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "mkdir -p _site && cp index.html .nojekyll _site/ && python3 -m http.server 4173 --bind 127.0.0.1 --directory _site",
    url: "http://127.0.0.1:4173",
    timeout: 10_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
