// Copyright (c) 2026 agens-sh. All Rights Reserved.
const { test, expect } = require("@playwright/test");

test("homepage loads", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  const response = await page.goto("/");
  expect(response, "navigation should produce a response").toBeTruthy();
  expect(response.status(), "GET / should be 200").toBe(200);
  await expect(page).toHaveTitle("agens: tag line here");
  await expect(page.getByRole("heading", { name: /agens/i })).toBeVisible();
  expect(pageErrors, "page should not throw").toEqual([]);
});
