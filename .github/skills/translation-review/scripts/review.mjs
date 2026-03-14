/**
 * Translation Review Script
 * Generates a side-by-side markdown comparison for human review.
 *
 * Usage: node .github/skills/translation-review/scripts/review.mjs --lang he
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../../..");
const translationsPath = path.join(projectRoot, "src/i18n/translations.ts");
const outputPath = path.join(projectRoot, "TRANSLATION_REVIEW.md");

function parseArgs(args) {
  const opts = { lang: "he" };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--lang" && args[i + 1]) {
      opts.lang = args[++i];
    }
  }
  return opts;
}

function extractStrings(content, lang) {
  const entries = {};

  // Match simple string assignments: key: 'value' or key: "value"
  const stringRegex = new RegExp(
    `(?<=\\b${lang}:\\s*\\{[\\s\\S]*?)^\\s{4}(\\w+):\\s*['"\`]([^'"\`]*?)['"\`]`,
    "gm"
  );
  let match;
  while ((match = stringRegex.exec(content)) !== null) {
    entries[match[1]] = match[2];
  }

  // Match function assignments: key: (params) => `template`
  const funcRegex = new RegExp(
    `(?<=\\b${lang}:\\s*\\{[\\s\\S]*?)^\\s{4}(\\w+):\\s*\\([^)]*\\)\\s*=>\\s*\`([^\`]*?)\``,
    "gm"
  );
  while ((match = funcRegex.exec(content)) !== null) {
    entries[match[1]] = `⚡ ${match[2]}`;
  }

  return entries;
}

function generateReview() {
  const opts = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(translationsPath)) {
    console.error(`❌ Translation file not found: ${translationsPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(translationsPath, "utf-8");
  const sourceStrings = extractStrings(content, "en");
  const targetStrings = extractStrings(content, opts.lang);

  const langNames = { he: "Hebrew", ar: "Arabic", es: "Spanish", fr: "French", ru: "Russian" };
  const langName = langNames[opts.lang] || opts.lang;

  let md = `# Translation Review — ${langName} (${opts.lang})\n\n`;
  md += `> Generated on ${new Date().toISOString().split("T")[0]}\n`;
  md += `> Source: English (en) → Target: ${langName} (${opts.lang})\n\n`;
  md += `| Key | English (source) | ${langName} (target) | Notes |\n`;
  md += `|-----|-----------------|${"-".repeat(langName.length + 10)}|-------|\n`;

  const allKeys = [...new Set([...Object.keys(sourceStrings), ...Object.keys(targetStrings)])].sort();

  for (const key of allKeys) {
    const source = sourceStrings[key] || "⚠️ MISSING";
    const target = targetStrings[key] || "⚠️ MISSING";
    let notes = "—";

    if (!sourceStrings[key]) notes = "Extra key in target";
    else if (!targetStrings[key]) notes = "❌ Missing translation";
    else if (source.startsWith("⚡")) notes = "Dynamic — check placeholders";
    else if (source === target) notes = "⚠️ Same as source — possibly untranslated";

    const escapedSource = source.replace(/\|/g, "\\|");
    const escapedTarget = target.replace(/\|/g, "\\|");
    md += `| ${key} | ${escapedSource} | ${escapedTarget} | ${notes} |\n`;
  }

  md += `\n## Summary\n\n`;
  md += `- Total keys: ${allKeys.length}\n`;
  md += `- Translated: ${Object.keys(targetStrings).length}\n`;
  md += `- Missing: ${Object.keys(sourceStrings).filter((k) => !targetStrings[k]).length}\n`;

  fs.writeFileSync(outputPath, md, "utf-8");
  console.log(`✅ Review written to ${outputPath}`);
}

generateReview();
