import { chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsRoot = path.join(__dirname, "screenshots");

// --- Clean up existing flat screenshots and (re)create subdirs ---
const existing = fs.existsSync(screenshotsRoot)
  ? fs.readdirSync(screenshotsRoot, { withFileTypes: true })
  : [];
for (const entry of existing) {
  if (entry.isFile()) {
    fs.unlinkSync(path.join(screenshotsRoot, entry.name));
  } else if (entry.isDirectory()) {
    // Remove all files inside each subdir
    const subEntries = fs.readdirSync(path.join(screenshotsRoot, entry.name));
    for (const sf of subEntries) {
      fs.unlinkSync(path.join(screenshotsRoot, entry.name, sf));
    }
  }
}
fs.mkdirSync(path.join(screenshotsRoot, "web"), { recursive: true });
fs.mkdirSync(path.join(screenshotsRoot, "mobile"), { recursive: true });

const BASE_URL = "http://localhost:5177/TeachWatch/";
const LANG_KEY = "teachwatch-language";

const VIEWPORTS = [
  { name: "web", width: 1280, height: 800 },
  { name: "mobile", width: 375, height: 667 },
];

const LANGS = [
  { code: "he", prefix: "01" },
  { code: "en", prefix: "05" },
];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Set localStorage language and reload so the app picks it up. */
async function setLang(page, lang) {
  await page.evaluate((l) => localStorage.setItem("teachwatch-language", l), lang);
  await page.reload({ waitUntil: "networkidle" });
  await delay(600);
}

async function captureViewport(viewport) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await ctx.newPage();
  const dir = path.join(screenshotsRoot, viewport.name);

  console.log(`\n=== ${viewport.name.toUpperCase()} (${viewport.width}×${viewport.height}) ===`);

  for (const lang of LANGS) {
    const { code, prefix } = lang;
    const numOffset = code === "he" ? 0 : 0; // prefix already encodes order
    console.log(`\n  [${code.toUpperCase()}]`);

    // ---- 1. Level Select ----
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await delay(600);
    await setLang(page, code);
    const ls = `${prefix}-level-select-${code}.png`;
    await page.screenshot({ path: path.join(dir, ls) });
    console.log(`    Saved ${ls}`);

    // ---- 2. Game Session ----
    // Language is already set in localStorage; navigate fresh to level select
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await delay(500);
    // Click first level card
    await page.waitForSelector("button.level-card", { timeout: 8000 });
    await page.locator("button.level-card").first().click();
    // Wait for clock and answer buttons
    await page.waitForSelector(".clock-svg", { timeout: 8000 });
    await page.waitForSelector(".answer-grid", { timeout: 8000 });
    await delay(800);
    const gs = `${String(Number(prefix) + 1).padStart(2, "0")}-game-session-${code}.png`;
    await page.screenshot({ path: path.join(dir, gs) });
    console.log(`    Saved ${gs}`);

    // ---- 3. High Scores ----
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await delay(500);
    await page.waitForSelector("button.level-select__scores", { timeout: 8000 });
    await page.locator("button.level-select__scores").click();
    await delay(700);
    const hs = `${String(Number(prefix) + 2).padStart(2, "0")}-high-scores-${code}.png`;
    await page.screenshot({ path: path.join(dir, hs) });
    console.log(`    Saved ${hs}`);

    // ---- 4. Settings ----
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await delay(500);
    await page.waitForSelector("button.app__settings-button", { timeout: 8000 });
    await page.locator("button.app__settings-button").click();
    await delay(700);
    const st = `${String(Number(prefix) + 3).padStart(2, "0")}-settings-${code}.png`;
    await page.screenshot({ path: path.join(dir, st) });
    console.log(`    Saved ${st}`);
  }

  await browser.close();
}

for (const vp of VIEWPORTS) {
  await captureViewport(vp);
}

// --- Report file sizes ---
console.log("\n=== Captured screenshots ===");
for (const sub of ["web", "mobile"]) {
  const subDir = path.join(screenshotsRoot, sub);
  const files = fs.readdirSync(subDir).sort();
  for (const f of files) {
    const stat = fs.statSync(path.join(subDir, f));
    console.log(`  ${sub}/${f}  (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}
console.log("\nDone!");
