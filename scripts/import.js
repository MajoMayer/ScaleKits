/**
 * import.js — copies kit photos from OneDrive into public/images/
 * and writes src/_data/kits.json with kit metadata.
 *
 * Run with: node scripts/import.js
 * (or: npm run import)
 */

const fs = require("fs");
const path = require("path");

// ── Paths ────────────────────────────────────────────────────────────────────

const SOURCE_ROOT =
  "/Users/marianmayer/Library/CloudStorage/OneDrive-AstonITMspol.sr.o/#mm/Modely/__Public data";

const REPO_ROOT = path.resolve(__dirname, "..");
const IMAGES_OUT = path.join(REPO_ROOT, "public", "images");
const KITS_JSON = path.join(REPO_ROOT, "src", "_data", "kits.json");

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a raw token (name / manufacturer) into the hyphen-joined form
 * used in folder names: spaces → hyphens, slashes → hyphens.
 */
function normalise(token) {
  return token.replace(/\//g, "-").replace(/\s+/g, "-").trim();
}

/**
 * Converts a scale token into the canonical form (e.g. "1/72" → "1-72").
 */
function normaliseScale(token) {
  return token.replace(/\//g, "-").trim();
}

/**
 * Returns true when a string looks like a scale (1-72, 1/72, 1-48, etc.).
 */
function isScale(token) {
  return /^1[-/]\d+$/.test(token.trim());
}

/**
 * Parses name / scale / manufacturer from a kit folder name (NOT a filename).
 *
 * Supported formats:
 *   1. Underscore-separated:   "Spitfire-Vb_1-72_Revell"
 *   2. Space-separated:        "Autoblinda AB 41 1-72 Italeri"
 *                              "BAeHawkT011-72 Revell"  (scale glued to name)
 *   3. Special "Box only":     handled by caller, not here.
 */
function parseFolderName(folderName) {
  // Format 1 — underscore-separated (3 or more parts)
  if (folderName.includes("_")) {
    const parts = folderName.split("_");
    if (parts.length >= 3) {
      // Find the part that looks like a scale
      for (let i = 1; i < parts.length - 1; i++) {
        if (isScale(parts[i])) {
          const name = parts.slice(0, i).join("-");
          const scale = normaliseScale(parts[i]);
          const manufacturer = parts.slice(i + 1).join("-");
          return { name, scale, manufacturer };
        }
      }
    }
    // Fallback: first _ is name/scale boundary, last segment is manufacturer
    const parts2 = folderName.split("_");
    return {
      name: parts2[0],
      scale: normaliseScale(parts2[1] || ""),
      manufacturer: parts2.slice(2).join("-"),
    };
  }

  // Format 2 — space-separated
  // Strategy: scan tokens for scale pattern (standalone "1-72" or glued like "BAeHawkT011-72")
  const tokens = folderName.split(" ");

  // Try standalone token match first
  for (let i = 0; i < tokens.length; i++) {
    if (isScale(tokens[i])) {
      const name = normalise(tokens.slice(0, i).join(" "));
      const scale = normaliseScale(tokens[i]);
      const manufacturer = normalise(tokens.slice(i + 1).join(" "));
      return { name, scale, manufacturer };
    }
  }

  // Try scale glued to previous token (e.g. "BAeHawkT011-72")
  const scaleGluedRe = /^(.+?)(1[-/]\d+)$/;
  for (let i = 0; i < tokens.length; i++) {
    const m = tokens[i].match(scaleGluedRe);
    if (m) {
      const nameParts = tokens.slice(0, i).concat([m[1]]);
      const name = normalise(nameParts.join(" "));
      const scale = normaliseScale(m[2]);
      const manufacturer = normalise(tokens.slice(i + 1).join(" "));
      return { name, scale, manufacturer };
    }
  }

  // Cannot parse — return raw folder name as name
  return { name: normalise(folderName), scale: "", manufacturer: "" };
}

/**
 * Parses name / scale / manufacturer from a standalone filename (Stash files).
 * Expected: Name_Scale_Manufacturer_box.EXT  or  Name_Scale_Manufacturer.EXT
 */
function parseStashFilename(filename) {
  // Strip extension
  const base = filename.replace(/\.[^.]+$/, "");
  // Remove trailing _box (case-insensitive)
  const cleaned = base.replace(/_box$/i, "");
  return parseFolderName(cleaned);
}

/**
 * Returns true if a filename is a "box art" photo.
 * Matches: _box.*, *box.*, *_box_*, etc.
 */
function isBoxArt(filename) {
  return /box/i.test(filename);
}

/**
 * Returns true if a filename is a numbered build photo (ends in _NN.ext).
 */
function isBuildPhoto(filename) {
  return /[_-]\d+\.\w+$/.test(filename) && !isBoxArt(filename);
}

/**
 * Ensures a directory exists (creates recursively if needed).
 */
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Copies a single file from src to dest.
 * If the file is a HEIC/HEIF image disguised as .jpeg, converts it to real JPEG first.
 */
function copyFile(src, dest) {
  // Read the first 12 bytes to detect HEIF magic bytes (ftyp box)
  const fd = fs.openSync(src, "r");
  const header = Buffer.alloc(12);
  fs.readSync(fd, header, 0, 12, 0);
  fs.closeSync(fd);

  // HEIF files have "ftyp" at bytes 4-7
  const isHeif = header.slice(4, 8).toString("ascii") === "ftyp";

  if (isHeif) {
    const { execSync } = require("child_process");
    console.log(`  INFO: converting HEIC→JPEG: ${require("path").basename(src)}`);
    execSync(`sips -s format jpeg "${src}" --out "${dest}"`, { stdio: "pipe" });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// ── Main import ──────────────────────────────────────────────────────────────

const kits = [];
const counts = { progress: 0, finished: 0, mid: 0, early: 0, stash: 0, figures: 0, stashnomore: 0 };

/**
 * Processes one kit folder (non-Stash).
 *
 * @param {string} kitFolderPath  absolute path to the kit folder on OneDrive
 * @param {string} category       "current" | "mid" | "early"
 * @param {object|null} override  if provided, use these name/scale/manufacturer values
 */
function processKitFolder(kitFolderPath, category, override = null) {
  const folderBase = path.basename(kitFolderPath);
  const parsed = override || parseFolderName(folderBase);

  const { name, scale, manufacturer } = parsed;

  // Build canonical output folder name
  const outFolderName = [
    normalise(name),
    normaliseScale(scale),
    normalise(manufacturer),
  ].join("_");

  const outDir = path.join(IMAGES_OUT, outFolderName);
  ensureDir(outDir);

  // List files inside the kit folder
  let files;
  try {
    files = fs.readdirSync(kitFolderPath);
  } catch (err) {
    console.warn(`  WARN: cannot read folder ${kitFolderPath}: ${err.message}`);
    return;
  }

  // All image files (not directories), sorted
  const allImages = files
    .filter((f) => /\.(jpg|jpeg)$/i.test(f) && !fs.statSync(path.join(kitFolderPath, f)).isDirectory())
    .sort();

  // Separate build photos
  const buildFiles = allImages.filter((f) => isBuildPhoto(f)).sort();

  // Select card image: card → box → first available
  const cardFiles = allImages.filter((f) => /card/i.test(f));
  const boxFiles  = allImages.filter((f) => isBoxArt(f));
  const cardImage = cardFiles[0] || boxFiles[0] || allImages[0];

  // Copy card image → _box.jpeg
  if (cardImage) {
    if (cardFiles[0]) {
      console.log(`  INFO: using card image: ${cardImage}`);
    } else if (!boxFiles[0]) {
      console.log(`  INFO: no box/card art in ${path.basename(kitFolderPath)}, using first image`);
    }
    copyFile(path.join(kitFolderPath, cardImage), path.join(outDir, "_box.jpeg"));
  } else {
    console.warn(`  WARN: no images at all in ${kitFolderPath}`);
  }

  // Copy build photos → _01.jpeg, _02.jpeg, …
  buildFiles.forEach((f, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    const src = path.join(kitFolderPath, f);
    copyFile(src, path.join(outDir, `_${num}.jpeg`));
  });

  // Build photos array: box art first, then numbered build photos
  const photos = [`images/${outFolderName}/_box.jpeg`];
  buildFiles.forEach((_, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    photos.push(`images/${outFolderName}/_${num}.jpeg`);
  });

  // Record metadata
  kits.push({
    name: name.replace(/-/g, " "),
    scale: scale,
    manufacturer: manufacturer.replace(/-/g, " "),
    category,
    folder: outFolderName,
    boxArt: `images/${outFolderName}/_box.jpeg`,
    photos,
  });

  counts[category]++;
  console.log(`  [${category}] ${outFolderName}`);
}

/**
 * Processes a stash-type folder — loose JPEG files, each is one kit (box art only).
 */
function processStash(stashFolderPath, category) {
  let files;
  try {
    files = fs.readdirSync(stashFolderPath);
  } catch (err) {
    console.warn(`  WARN: cannot read Stash folder: ${err.message}`);
    return;
  }

  // Filter to only image files; skip generic numbered overview shots (stash_01.jpg etc.)
  const kitFiles = files.filter((f) => {
    if (!/\.(jpg|jpeg)$/i.test(f)) return false;
    if (/^stash_\d+\./i.test(f)) return false;
    return true;
  });

  kitFiles.sort();

  for (const f of kitFiles) {
    const parsed = parseStashFilename(f);
    const { name, scale, manufacturer } = parsed;

    if (!name) {
      console.warn(`  WARN: cannot parse stash file: ${f}`);
      continue;
    }

    const outFolderName = [
      normalise(name),
      normaliseScale(scale),
      normalise(manufacturer),
    ].join("_");

    const outDir = path.join(IMAGES_OUT, outFolderName);
    ensureDir(outDir);

    const src = path.join(stashFolderPath, f);
    copyFile(src, path.join(outDir, "_box.jpeg"));

    kits.push({
      name: name.replace(/-/g, " "),
      scale: scale,
      manufacturer: manufacturer.replace(/-/g, " "),
      category,
      folder: outFolderName,
      boxArt: `images/${outFolderName}/_box.jpeg`,
      photos: [`images/${outFolderName}/_box.jpeg`],
    });

    counts[category] = (counts[category] || 0) + 1;
    console.log(`  [${category}] ${outFolderName}`);
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────

console.log("MM Kits import starting…\n");

// Ensure output directories exist
ensureDir(IMAGES_OUT);
ensureDir(path.dirname(KITS_JSON));

// ── 1. Kits in Progress (root level folders, no underscore prefix) ────────────

console.log("=== Kits in Progress ===");
const rootEntries = fs.readdirSync(SOURCE_ROOT);

for (const entry of rootEntries) {
  if (entry.startsWith("_")) continue;

  const entryPath = path.join(SOURCE_ROOT, entry);
  if (!fs.statSync(entryPath).isDirectory()) continue;

  processKitFolder(entryPath, "progress");
}

// ── 2. Finished Kits ──────────────────────────────────────────────────────────

console.log("\n=== Finished Kits ===");
const finishedRoot = path.join(SOURCE_ROOT, "_Finished Kits");
for (const entry of fs.readdirSync(finishedRoot)) {
  const entryPath = path.join(finishedRoot, entry);
  if (!fs.statSync(entryPath).isDirectory()) continue;
  processKitFolder(entryPath, "finished");
}

// ── 3. Mid Age Kits ───────────────────────────────────────────────────────────

console.log("\n=== Mid Age Kits ===");
const midRoot = path.join(SOURCE_ROOT, "_Mid Age Kits");
for (const entry of fs.readdirSync(midRoot)) {
  const entryPath = path.join(midRoot, entry);
  if (!fs.statSync(entryPath).isDirectory()) continue;
  processKitFolder(entryPath, "mid");
}

// ── 4. Early Age Kits ─────────────────────────────────────────────────────────

console.log("\n=== Early Age Kits ===");
const earlyRoot = path.join(SOURCE_ROOT, "_Early Age Kits");
for (const entry of fs.readdirSync(earlyRoot)) {
  const entryPath = path.join(earlyRoot, entry);
  if (!fs.statSync(entryPath).isDirectory()) continue;

  if (entry === "Box only") {
    console.log("  [early] Box only → AeroC3A_1-72_KP (special handling)");
    processKitFolder(entryPath, "early", { name: "AeroC3A", scale: "1-72", manufacturer: "KP" });
    continue;
  }

  processKitFolder(entryPath, "early");
}

// ── 5. Stash (root files in _Stash/) ──────────────────────────────────────────

console.log("\n=== Stash ===");
processStash(path.join(SOURCE_ROOT, "_Stash"), "stash");

// ── 6. Figures & Material ─────────────────────────────────────────────────────

console.log("\n=== Figures & Material ===");
processStash(path.join(SOURCE_ROOT, "_Stash", "_Figures & Material"), "figures");

// ── 7. Stash No More ──────────────────────────────────────────────────────────

console.log("\n=== Stash No More ===");
processStash(path.join(SOURCE_ROOT, "_Stash", "_Stash No More"), "stashnomore");

// ── 8. Write kits.json ────────────────────────────────────────────────────────

fs.writeFileSync(KITS_JSON, JSON.stringify(kits, null, 2));
console.log(`\nWrote ${kits.length} kits to ${KITS_JSON}`);

// ── 9. Summary ────────────────────────────────────────────────────────────────

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log("\n=== Summary ===");
console.log(`  progress    : ${counts.progress}`);
console.log(`  finished    : ${counts.finished}`);
console.log(`  mid         : ${counts.mid}`);
console.log(`  early       : ${counts.early}`);
console.log(`  stash       : ${counts.stash}`);
console.log(`  figures     : ${counts.figures}`);
console.log(`  stashnomore : ${counts.stashnomore}`);
console.log(`  TOTAL       : ${total}`);
