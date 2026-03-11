#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// validate.js — DWB Pre-Render Validator v2.0
// Run: node validate.js  OR  node validate.js src/week6-content.js
//
// v2.0 fixes:
//   • Supports BOTH default exports (weeks 5-6) and named exports (weeks 7+)
//   • Supports weeks11-13-content.js multi-export format
//   • Graceful error messages — tells you exactly what's wrong and where
//   • Validates all required fields per overlay
//   • Checks frame math (startFrame < endFrame, endFrame <= 900)
//   • Checks music file reference format
//   • Summary report at end
// ─────────────────────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

// ── ANSI colors for terminal output ──
const R = '\x1b[31m'; // red
const G = '\x1b[32m'; // green
const Y = '\x1b[33m'; // yellow
const B = '\x1b[36m'; // cyan
const W = '\x1b[0m';  // reset
const BOLD = '\x1b[1m';

let errors   = 0;
let warnings = 0;
let checked  = 0;

function err(msg)  { console.log(`${R}  ERROR${W}   ${msg}`); errors++; }
function warn(msg) { console.log(`${Y}  WARN${W}    ${msg}`); warnings++; }
function ok(msg)   { console.log(`${G}  OK${W}      ${msg}`); }

// ─────────────────────────────────────────────────────────────────────────────
// PARSE CONTENT FILE
// Handles: default exports, named exports, multi-named exports
// ─────────────────────────────────────────────────────────────────────────────
function parseContentFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const entries = [];

  // Try: export default [...]
  const defaultMatch = source.match(/export\s+default\s+(\[[\s\S]*\]);?\s*$/m);
  if (defaultMatch) {
    try {
      const arr = eval(defaultMatch[1]);
      if (Array.isArray(arr)) {
        entries.push(...arr);
        return { entries, exportType: 'default' };
      }
    } catch(e) {
      throw new Error(`eval failed on default export: ${e.message}`);
    }
  }

  // Try: export const NAME = [...]  (named, one or many)
  const namedMatches = [...source.matchAll(/export\s+const\s+(\w+)\s*=\s*(\[[\s\S]*?\]);\s*(?=export|$)/gm)];
  if (namedMatches.length > 0) {
    for (const match of namedMatches) {
      try {
        const arr = eval(match[2]);
        if (Array.isArray(arr)) entries.push(...arr);
      } catch(e) {
        throw new Error(`eval failed on named export '${match[1]}': ${e.message}`);
      }
    }
    if (entries.length > 0) return { entries, exportType: 'named' };
  }

  // Last resort: grab the biggest array literal
  const bigMatch = source.match(/(\[[\s\S]{500,}\])/);
  if (bigMatch) {
    try {
      const arr = eval(bigMatch[1]);
      if (Array.isArray(arr) && arr.length > 0) {
        entries.push(...arr);
        return { entries, exportType: 'inferred' };
      }
    } catch(e) { /* ignore */ }
  }

  throw new Error('Could not parse any content array from file. Check export syntax.');
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATE A SINGLE ENTRY
// ─────────────────────────────────────────────────────────────────────────────
function validateEntry(entry, index) {
  const label = entry.id ? `[${entry.id}]` : `[entry #${index}]`;
  checked++;

  // Required top-level fields
  const requiredFields = ['id', 'filename', 'music', 'overlays', 'pexelsSearchTerms',
                          'tiktokCaption', 'youtubeTitle', 'youtubeDescription', 'pinnedComment'];
  for (const field of requiredFields) {
    if (!entry[field]) err(`${label} missing required field: '${field}'`);
  }

  // id format
  if (entry.id && !entry.id.match(/^day\d+$/)) {
    warn(`${label} id '${entry.id}' doesn't match pattern 'dayN'`);
  }

  // filename matches id
  if (entry.id && entry.filename && entry.filename !== `${entry.id}_final.mp4`) {
    warn(`${label} filename '${entry.filename}' doesn't match expected '${entry.id}_final.mp4'`);
  }

  // music format
  if (entry.music && !entry.music.match(/^day\d+\.mp3$/)) {
    warn(`${label} music '${entry.music}' doesn't match pattern 'dayN.mp3'`);
  }

  // pexelsSearchTerms
  if (Array.isArray(entry.pexelsSearchTerms)) {
    if (entry.pexelsSearchTerms.length === 0) {
      err(`${label} pexelsSearchTerms is empty array`);
    } else if (entry.pexelsSearchTerms.length < 3) {
      warn(`${label} only ${entry.pexelsSearchTerms.length} pexelsSearchTerms — recommend 4`);
    }
    for (const term of entry.pexelsSearchTerms) {
      if (typeof term !== 'string' || term.trim().length === 0) {
        err(`${label} empty or invalid pexelsSearchTerms entry`);
      }
    }
  }

  // overlays
  if (!Array.isArray(entry.overlays) || entry.overlays.length === 0) {
    err(`${label} overlays is empty or not an array`);
    return;
  }

  if (entry.overlays.length < 3) {
    warn(`${label} only ${entry.overlays.length} overlays — most videos use 5-7`);
  }

  const VALID_ANIMATIONS = [
    'fade', 'slide-left', 'slide-right', 'pop', 'bounce', 'glitch', 'zoom-punch',
    'scramble', 'stagger', 'multi-line', 'strike', 'ellipsis', 'counter',
    'neon-glow', 'highlight-box', 'gradient-sweep', 'outline', 'outlined',
    'mask-reveal', 'pixel-dissolve', 'vhs', 'strobe', 'gradient-text',
    'word-highlight', 'caption-bar', 'float-up', 'flip-in', 'blur-in',
    'typewriter', 'shake', '3d-flip'
  ];

  const VALID_POSITIONS = ['top-center', 'middle', 'bottom-center', 'top-left', 'top-right', 'center'];

  entry.overlays.forEach((overlay, i) => {
    const olabel = `${label} overlay[${i}]`;

    if (!overlay.text) err(`${olabel} missing 'text'`);
    if (!overlay.animation) err(`${olabel} missing 'animation'`);
    if (!overlay.position) err(`${olabel} missing 'position'`);

    // Animation validity
    if (overlay.animation && !VALID_ANIMATIONS.includes(overlay.animation)) {
      warn(`${olabel} unknown animation '${overlay.animation}' — may be custom or new`);
    }

    // Position validity
    if (overlay.position && !VALID_POSITIONS.includes(overlay.position)) {
      warn(`${olabel} unknown position '${overlay.position}'`);
    }

    // Frame math
    const sf = overlay.startFrame;
    const ef = overlay.endFrame;

    if (sf === undefined || sf === null) err(`${olabel} missing startFrame`);
    if (ef === undefined || ef === null) err(`${olabel} missing endFrame`);

    if (typeof sf === 'number' && typeof ef === 'number') {
      if (sf < 0) err(`${olabel} startFrame ${sf} is negative`);
      if (ef > 900) err(`${olabel} endFrame ${ef} exceeds 900 (video length)`);
      if (sf >= ef) err(`${olabel} startFrame (${sf}) >= endFrame (${ef})`);
      if (ef - sf < 15) warn(`${olabel} very short overlay: ${ef - sf} frames`);
    }

    // fontSize
    if (overlay.fontSize !== undefined) {
      if (overlay.fontSize < 20) warn(`${olabel} fontSize ${overlay.fontSize} seems very small`);
      if (overlay.fontSize > 120) warn(`${olabel} fontSize ${overlay.fontSize} seems very large`);
    }

    // color format
    if (overlay.color && !overlay.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      err(`${olabel} invalid color '${overlay.color}' — must be #RRGGBB`);
    }

    // stroke
    if (overlay.stroke) {
      if (overlay.stroke.size === undefined) warn(`${olabel} stroke missing size`);
      if (overlay.stroke.color && !overlay.stroke.color.match(/^#[0-9A-Fa-f]{6}$/)) {
        err(`${olabel} invalid stroke.color '${overlay.stroke.color}'`);
      }
    }
  });

  // Check overlay timeline coverage (warn if large gaps)
  const sorted = [...entry.overlays].sort((a, b) => a.startFrame - b.startFrame);
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1].startFrame - sorted[i].endFrame;
    if (gap > 60) {
      warn(`${label} gap of ${gap} frames between overlay[${i}] and overlay[${i + 1}] — blank screen`);
    }
  }

  // Check TikTok caption length
  if (entry.tiktokCaption && entry.tiktokCaption.length > 2200) {
    warn(`${label} tiktokCaption is ${entry.tiktokCaption.length} chars — TikTok limit is 2200`);
  }

  // Check YouTube title length
  if (entry.youtubeTitle && entry.youtubeTitle.length > 100) {
    warn(`${label} youtubeTitle is ${entry.youtubeTitle.length} chars — YouTube limit is 100`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
(function main() {
  console.log(`\n${BOLD}${B}DWB Validator v2.0${W}\n`);

  // Determine which files to validate
  let filesToValidate = [];

  if (process.argv[2]) {
    // Specific file passed as argument
    filesToValidate = [process.argv[2]];
  } else {
    // Auto-detect all week content files in src/
    const srcDir = fs.existsSync('src') ? 'src' : '.';
    const contentFiles = fs.readdirSync(srcDir)
      .filter(f => f.match(/^week\d+.*-content\.js$/))
      .map(f => path.join(srcDir, f))
      .sort();

    if (contentFiles.length === 0) {
      console.log(`${Y}No week content files found in ${srcDir}/ — checking root${W}`);
      const rootFiles = fs.readdirSync('.')
        .filter(f => f.match(/^week\d+.*-content\.js$/));
      filesToValidate = rootFiles;
    } else {
      filesToValidate = contentFiles;
    }
  }

  if (filesToValidate.length === 0) {
    console.log(`${R}No content files found to validate.${W}`);
    process.exit(1);
  }

  console.log(`${B}Validating ${filesToValidate.length} file(s)...${W}\n`);

  for (const filePath of filesToValidate) {
    console.log(`${BOLD}${filePath}${W}`);

    if (!fs.existsSync(filePath)) {
      err(`File not found: ${filePath}`);
      continue;
    }

    let result;
    try {
      result = parseContentFile(filePath);
    } catch(e) {
      err(`Parse failed: ${e.message}`);
      continue;
    }

    console.log(`  Export type: ${result.exportType} | Entries: ${result.entries.length}`);

    if (result.entries.length === 0) {
      err(`No entries found in ${filePath}`);
      continue;
    }

    for (let i = 0; i < result.entries.length; i++) {
      validateEntry(result.entries[i], i);
    }

    console.log('');
  }

  // ── Summary ──
  console.log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${W}`);
  console.log(`${BOLD}Checked: ${checked} entries${W}`);

  if (errors === 0 && warnings === 0) {
    console.log(`${G}${BOLD}All clear. No errors, no warnings.${W}\n`);
    process.exit(0);
  }

  if (errors > 0) {
    console.log(`${R}${BOLD}Errors:   ${errors}${W}`);
  }
  if (warnings > 0) {
    console.log(`${Y}Warnings: ${warnings}${W}`);
  }

  console.log('');

  if (errors > 0) {
    console.log(`${R}Validation FAILED — fix errors before rendering.${W}\n`);
    process.exit(1);
  } else {
    console.log(`${Y}Validation PASSED with warnings — review above before rendering.${W}\n`);
    process.exit(0);
  }
})();
