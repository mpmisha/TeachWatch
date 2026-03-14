/**
 * Translation Validation Script
 * Checks all languages against English source for completeness and consistency.
 *
 * Usage: node .github/skills/translation-validation/scripts/validate.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../../..");
const translationsPath = path.join(projectRoot, "src/i18n/translations.ts");

function extractTranslationKeys(content, lang) {
  // Find the block for this language in the translations object
  const regex = new RegExp(`${lang}:\\s*\\{([\\s\\S]*?)\\n  \\}`, "m");
  const match = content.match(regex);
  if (!match) return null;

  const block = match[1];
  const keys = [];

  // Match top-level keys (simple strings, functions, arrays, objects)
  const keyRegex = /^\s{4}(\w+)\s*[:(]/gm;
  let keyMatch;
  while ((keyMatch = keyRegex.exec(block)) !== null) {
    keys.push(keyMatch[1]);
  }

  return keys;
}

function extractPlaceholders(str) {
  const matches = str.match(/\{(\w+)\}/g) || [];
  return matches.sort();
}

function validate() {
  if (!fs.existsSync(translationsPath)) {
    console.error(`❌ Translation file not found: ${translationsPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(translationsPath, "utf-8");

  // Find all language codes
  const langRegex = /^\s{2}(\w{2}):\s*\{/gm;
  const languages = [];
  let langMatch;
  while ((langMatch = langRegex.exec(content)) !== null) {
    languages.push(langMatch[1]);
  }

  if (languages.length === 0) {
    console.error("❌ No languages found in translations file");
    process.exit(1);
  }

  console.log(`Found languages: ${languages.join(", ")}`);

  const sourceLanguage = "en";
  const sourceKeys = extractTranslationKeys(content, sourceLanguage);

  if (!sourceKeys) {
    console.error(`❌ Could not extract keys for source language: ${sourceLanguage}`);
    process.exit(1);
  }

  console.log(`Source (${sourceLanguage}) has ${sourceKeys.length} keys\n`);

  let hasErrors = false;
  const targetLanguages = languages.filter((l) => l !== sourceLanguage);

  for (const lang of targetLanguages) {
    console.log(`--- Checking ${lang} ---`);
    const targetKeys = extractTranslationKeys(content, lang);

    if (!targetKeys) {
      console.error(`  ❌ Could not extract keys for language: ${lang}`);
      hasErrors = true;
      continue;
    }

    // Missing keys
    const missing = sourceKeys.filter((k) => !targetKeys.includes(k));
    if (missing.length > 0) {
      console.error(`  ❌ Missing keys (${missing.length}): ${missing.join(", ")}`);
      hasErrors = true;
    }

    // Extra keys
    const extra = targetKeys.filter((k) => !sourceKeys.includes(k));
    if (extra.length > 0) {
      console.warn(`  ⚠️  Extra keys (${extra.length}): ${extra.join(", ")}`);
    }

    // Key count
    console.log(`  Keys: ${targetKeys.length}/${sourceKeys.length}`);

    if (missing.length === 0 && extra.length === 0) {
      console.log(`  ✅ All keys present`);
    }
  }

  console.log("");
  if (hasErrors) {
    console.error("❌ Validation failed — see errors above");
    process.exit(1);
  } else {
    console.log("✅ All translations validated successfully");
  }
}

validate();
