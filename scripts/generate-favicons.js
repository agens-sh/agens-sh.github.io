#!/usr/bin/env node
// Copyright (c) 2026 agens-sh. All Rights Reserved.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const svg = fs.readFileSync(path.join(root, "brand", "agens-favicon.svg"), "utf8");
const dataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

function icoFromPngs(pngBuffers) {
  const count = pngBuffers.length;
  let offset = 6 + 16 * count;
  const entries = [];
  const payloads = [];
  for (const png of pngBuffers) {
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    payloads.push(png);
    offset += png.length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  return Buffer.concat([header, ...entries, ...payloads]);
}

async function rasterize(page, size, dest) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<!DOCTYPE html><html><body style="margin:0;background:#0c0c0c">
      <img src="${dataUri}" width="${size}" height="${size}" alt="">
    </body></html>`,
    { waitUntil: "load" },
  );
  await page.locator("img").screenshot({ path: dest, omitBackground: false });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const tmp = path.join(root, "_favicon-tmp");
  fs.mkdirSync(tmp, { recursive: true });
  const icoSizes = [16, 32, 48];
  for (const size of icoSizes) {
    await rasterize(page, size, path.join(tmp, `${size}.png`));
  }
  await rasterize(page, 180, path.join(root, "apple-touch-icon.png"));
  await browser.close();
  const pngs = icoSizes.map((size) => fs.readFileSync(path.join(tmp, `${size}.png`)));
  fs.writeFileSync(path.join(root, "favicon.ico"), icoFromPngs(pngs));
  fs.rmSync(tmp, { recursive: true, force: true });
})();
