import { chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../../..");
const screenshotsDir = path.join(projectRoot, "screenshots");

// Parse CLI arguments
function parseArgs(args) {
  const opts = {
    url: "http://localhost:5173",
    name: "screenshot",
    width: 1280,
    height: 800,
    fullpage: false,
    mobile: false,
    delay: 500,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--url":
        opts.url = args[++i];
        break;
      case "--name":
        opts.name = args[++i];
        break;
      case "--width":
        opts.width = parseInt(args[++i], 10);
        break;
      case "--height":
        opts.height = parseInt(args[++i], 10);
        break;
      case "--fullpage":
        opts.fullpage = true;
        break;
      case "--mobile":
        opts.mobile = true;
        opts.width = 375;
        opts.height = 667;
        break;
      case "--delay":
        opts.delay = parseInt(args[++i], 10);
        break;
    }
  }

  return opts;
}

async function takeScreenshot() {
  const opts = parseArgs(process.argv.slice(2));

  fs.mkdirSync(screenshotsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: opts.width, height: opts.height },
    isMobile: opts.mobile,
  });
  const page = await context.newPage();

  try {
    await page.goto(opts.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(opts.delay);

    const filename = `${opts.name}.png`;
    const filepath = path.join(screenshotsDir, filename);

    await page.screenshot({
      path: filepath,
      fullPage: opts.fullpage,
    });

    console.log(filepath);
  } catch (error) {
    console.error(`Screenshot failed: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

await takeScreenshot();
