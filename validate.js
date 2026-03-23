#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// validate.js — DWB Pre-Render Validator v1.0
// Run: node validate.js [weekN-content.js] before every commit or render
//
// Covers all Code Quality items:
//  #05  Frame Bounds Validator
//  #06  Animation Name Validator
//  #07  Font Preloader check (warns if fonts not in HTML)
//  #08  Overlay Overlap Detector
//  #09  Text Length Validator
//  #10  Audio Format Validator (magic bytes check)
//  #11  Overlay Chronological Sorter (auto-fixes + warns)
//  #12  Missing Day Detector
//  #13  Remotion Config Validator
//  #14  JSX Prop Type Checker
//  #15  Render Progress (informational)
//  #16  Color Contrast Checker
//  #17  Content File Schema Linter
//  #18  Duplicate Clip Query Detector
//  #19  Audio Volume Range Check
//  #20  Clip Count Validator
// ─────────────────────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

// ─── Config ──────────────────────────────────────────────────────────────────
const TOTAL_FRAMES   = 900;
const EXPECTED_CLIPS = 4;
const FPS            = 30;
const WIDTH          = 1080;
const HEIGHT         = 1920;
const MAX_TEXT_LEN   = 80;
const MIN_AUDIO_BYTES = 50000; // 50KB
const REQUIRED_SCHEMA_FIELDS = [
  'id', 'filename', 'title', 'overlays',
  'tiktokCaption', 'youtubeTitle', 'youtubeDescription', 'pinnedComment'
];
const KNOWN_ANIMATIONS = [
  // ── Original core ──
  'fade', 'pop', 'slide-left', 'slide-right', 'slide-up', 'slide-down',
  'bounce', 'zoom-punch', 'zoom-out', 'heartbeat', 'shake', 'glitch',
  'letter-expand', 'typewriter', 'word-highlight', 'scramble', 'stagger',
  'multi-line', 'strike', 'ellipsis', 'counter', 'neon-glow', 'highlight-box',
  'shimmer', 'frosted', 'color-pulse', '3d-extrude', 'caption-bar',
  // ── Phase 2 ──
  'gradient-text', 'outlined', 'mask-reveal', 'pixel-dissolve', 'vhs',
  'strobe', 'pulse-ring', 'underline-draw', 'weight-shift', 'diagonal-wipe', 'caps',
  'outline', 'gradient-sweep',
  // ── Phase 3 — TikTok research batch (Day 40) ──
  'liquid-drip', 'text-clip', 'outline-stroke', 'split-reveal', 'blur-in',
  'flip-up', 'letter-drop', 'panel-split', 'kinetic', 'word-bounce',
  'gradient-shift', 'outline-fill', 'color-burn',
];
const REQUIRED_OVERLAY_FIELDS = ['text', 'position', 'animation', 'startFrame', 'endFrame'];
const REQUIRED_REMOTION_CONFIG = {
  width:  WIDTH,
  height: HEIGHT,
  fps:    FPS,
};
const GOOGLE_FONTS = [
  'Anton', 'Montserrat', 'Bebas Neue', 'Oswald',
  'Playfair Display', 'JetBrains Mono', 'Cabin Sketch'
];

// ─── State ────────────────────────────────────────────────────────────────────
let errors   = [];
let warnings = [];
let info     = [];

const err  = (msg) => { errors.push(msg);   };
const warn = (msg) => { warnings.push(msg); };
const ok   = (msg) => { info.push(msg);     };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function relativeLuminance(r, g, b) {
  const c = [r, g, b].map(v => {
    v /= 255;
    return v  0 ? args : [];

  if (files.length === 0) {
    // Auto-detect all weekN-content.js files
    const contentDir = path.join(process.cwd(), 'content');
    if (fs.existsSync(contentDir)) {
      files = fs.readdirSync(contentDir)
        .filter(f => f.match(/^week\d+-content\.js$/))
        .map(f => path.join(contentDir, f));
    }
  }

  if (files.length === 0) {
    warn('No content files found. Pass path as argument or run from project root.');
    return [];
  }

  const allEntries = [];
  for (const file of files) {
    if (!fs.existsSync(file)) {
      err(`File not found: ${file}`);
      continue;
    }
    ok(`Loading: ${path.basename(file)}`);
    try {
      // Extract array content — supports BOTH default and named exports
      const source       = fs.readFileSync(file, 'utf8');
      const defaultMatch = source.match(/export\s+default\s+(\[[\s\S]*?\]);\s*$/m);
      const namedMatch   = source.match(/export\s+const\s+\w+\s*=\s*(\[[\s\S]*?\]);\s*(?=export|$)/m);
      const arrayStr     = defaultMatch ? defaultMatch[1] : (namedMatch ? namedMatch[1] : null);
      if (!arrayStr) {
        err(`Cannot parse export from ${path.basename(file)} — must be default or named array export`);
        continue;
      }
      const entries = eval(arrayStr); // Safe — our own controlled files
      allEntries.push(...entries);
    } catch (e) {
      err(`Parse error in ${path.basename(file)}: ${e.message}`);
    }
  }
  return allEntries;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 17: Content File Schema Linter
// ─────────────────────────────────────────────────────────────────────────────
function checkSchema(entries) {
  let passed = 0;
  for (const entry of entries) {
    for (const field of REQUIRED_SCHEMA_FIELDS) {
      if (entry[field] === undefined || entry[field] === null || entry[field] === '') {
        err(`[Schema] ${entry.id || '?'}: missing required field "${field}"`);
      } else {
        passed++;
      }
    }
    // Filename should match id
    if (entry.id && entry.filename && !entry.filename.includes(entry.id)) {
      warn(`[Schema] ${entry.id}: filename "${entry.filename}" doesn't contain id "${entry.id}"`);
    }
  }
  ok(`[Schema] ${passed} required fields verified across ${entries.length} entries`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 12: Missing Day Detector
// ─────────────────────────────────────────────────────────────────────────────
function checkMissingDays(entries) {
  for (const entry of entries) {
    if (!entry.overlays || !Array.isArray(entry.overlays) || entry.overlays.length === 0) {
      err(`[MissingDay] ${entry.id}: overlays array is empty or undefined — would produce BLANK video`);
    } else {
      ok(`[MissingDay] ${entry.id}: ${entry.overlays.length} overlays`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 05: Frame Bounds Validator
// ─────────────────────────────────────────────────────────────────────────────
function checkFrameBounds(entries) {
  for (const entry of entries) {
    if (!entry.overlays) continue;
    for (let i = 0; i  TOTAL_FRAMES) {
        err(`[FrameBounds] ${entry.id} overlay[${i}] "${(o.text||'').slice(0,20)}": endFrame ${o.endFrame} > ${TOTAL_FRAMES}`);
      }
      if (o.startFrame = o.endFrame) {
        err(`[FrameBounds] ${entry.id} overlay[${i}]: startFrame ${o.startFrame} >= endFrame ${o.endFrame}`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 06: Animation Name Validator
// ─────────────────────────────────────────────────────────────────────────────
function checkAnimations(entries) {
  for (const entry of entries) {
    if (!entry.overlays) continue;
    for (let i = 0; i  MAX_TEXT_LEN) {
        warn(`[TextLen] ${entry.id} overlay[${i}]: ${text.length} chars > ${MAX_TEXT_LEN} limit`);
        warn(`         "${text.slice(0, 50)}..."`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 14: JSX Prop Type Checker
// ─────────────────────────────────────────────────────────────────────────────
function checkRequiredOverlayFields(entries) {
  for (const entry of entries) {
    if (!entry.overlays) continue;
    for (let i = 0; i  1) {
      warn(`[DupQuery] Search query "${q}" used in multiple days: ${days.join(', ')} — reduce visual repetition`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 10: Audio Format Validator (magic bytes)
// ─────────────────────────────────────────────────────────────────────────────
function checkAudioFiles(entries) {
  const musicDir = path.join(process.cwd(), 'public', 'music');
  if (!fs.existsSync(musicDir)) {
    warn('[AudioCheck] public/music/ not found — skipping audio validation (run from project root)');
    return;
  }
  for (const entry of entries) {
    const musicFile = entry.music || `${entry.id}.mp3`;
    const musicPath = path.join(musicDir, musicFile);
    if (!fs.existsSync(musicPath)) {
      err(`[Audio] ${entry.id}: music file not found: public/music/${musicFile}`);
      continue;
    }
    const size = fs.statSync(musicPath).size;
    if (size  1) {
        err(`[AudioVol] ${entry.id}: volume ${vol} out of range [0.0, 1.0]`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 20: Clip Count Validator
// ─────────────────────────────────────────────────────────────────────────────
function checkClipCount(entries) {
  for (const entry of entries) {
    const terms = entry.pexelsSearchTerms || entry.pixabaySearchTerms || [];
    if (terms.length > 0 && terms.length !== EXPECTED_CLIPS) {
      warn(`[ClipCount] ${entry.id}: has ${terms.length} search terms, expected ${EXPECTED_CLIPS} — may produce black frames`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 13: Remotion Config Validator
// ─────────────────────────────────────────────────────────────────────────────
function checkRemotionConfig() {
  const configPath = path.join(process.cwd(), 'remotion.config.js');
  if (!fs.existsSync(configPath)) {
    warn('[RemotionConfig] remotion.config.js not found — skipping (run from project root)');
    return;
  }
  const source = fs.readFileSync(configPath, 'utf8');
  if (!source.includes('1080')) {
    warn('[RemotionConfig] Width 1080 not found in remotion.config.js');
  }
  if (!source.includes('1920')) {
    warn('[RemotionConfig] Height 1920 not found in remotion.config.js');
  }
  if (!source.includes('30')) {
    warn('[RemotionConfig] FPS 30 not found in remotion.config.js');
  }
  if (source.includes('1080') && source.includes('1920')) {
    ok('[RemotionConfig] Dimensions 1080x1920 confirmed');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 07: Font Preloader (warn if HTML doesn't have all required fonts)
// ─────────────────────────────────────────────────────────────────────────────
function checkFontPreloader() {
  const htmlPath = path.join(process.cwd(), 'public', 'index.html');
  if (!fs.existsSync(htmlPath)) {
    warn('[Fonts] public/index.html not found — cannot verify font preloading');
    return;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const font of GOOGLE_FONTS) {
    const slug = font.replace(/ /g, '+');
    if (!html.includes(slug) && !html.includes(font)) {
      warn(`[Fonts] Font "${font}" not found in public/index.html Google Fonts link`);
    } else {
      ok(`[Fonts] "${font}" confirmed in HTML`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  DWB Pre-Render Validator v1.0               ║');
  console.log('║  @DailyWealthBuilding — $0 budget pipeline   ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  const entries = loadContentFiles();
  const hasEntries = entries.length > 0;

  if (hasEntries) {
    console.log(`\nValidating ${entries.length} day entries...\n`);
    checkSchema(entries);
    checkMissingDays(entries);
    checkFrameBounds(entries);
    checkAnimations(entries);
    checkOverlaps(entries);
    checkTextLength(entries);
    checkRequiredOverlayFields(entries);
    checkColorContrast(entries);
    checkChronologicalOrder(entries);
    checkDuplicateQueries(entries);
    checkAudioFiles(entries);
    checkAudioVolume(entries);
    checkClipCount(entries);
  }

  // File-system checks (don't need entries)
  checkRemotionConfig();
  checkFontPreloader();

  // ─── Report ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────\n');

  if (info.length > 0) {
    console.log(`INFO (${info.length}):`);
    info.forEach(m => console.log(`  ✓ ${m}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log(`WARNINGS (${warnings.length}):`);
    warnings.forEach(m => console.log(`  ⚠ ${m}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.log(`ERRORS (${errors.length}):`);
    errors.forEach(m => console.log(`  ✗ ${m}`));
    console.log('');
  }

  console.log('─────────────────────────────────────────────');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ ALL CHECKS PASSED — safe to render.\n');
    process.exit(0);
  } else if (errors.length === 0) {
    console.log(`\n⚠  ${warnings.length} warning(s), 0 errors — render will work but review warnings.\n`);
    process.exit(0);
  } else {
    console.log(`\n❌ ${errors.length} error(s) found — FIX BEFORE RENDERING.\n`);
    process.exit(1);
  }
}

main();




    

  


COPIED TO CLIPBOARD


function showPanel(name) {
  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', (name==='briefing'&&i===0)||(name==='code'&&i===1)));
  document.getElementById('briefing-panel').classList.toggle('visible', name==='briefing');
  document.getElementById('briefing-panel').style.display = name==='briefing' ? 'block' : 'none';
  document.getElementById('code-panel').classList.toggle('hidden', name!=='code');
  document.getElementById('code-panel').style.display = name==='code' ? 'block' : 'none';
}

// Init
document.getElementById('briefing-panel').style.display = 'block';
document.getElementById('code-panel').style.display = 'none';

function copyCode(slug) {
  const el = document.getElementById('code-' + slug);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = el.closest('.file-section').querySelector('.copy-btn');
    btn.textContent = '✓ COPIED';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '⬡ COPY'; btn.classList.remove('copied'); }, 2000);
    showToast();
  });
}

function copyPrompt() {
  const el = document.getElementById('prompt-text');
  const text = el.innerText.replace('⬡ COPY PROMPT', '').trim();
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('prompt-copy-btn');
    btn.textContent = '✓ COPIED';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '⬡ COPY PROMPT'; btn.classList.remove('copied'); }, 2000);
    showToast();
  });
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function filterNav(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.nav-file-link').forEach(a => {
    a.style.display = a.textContent.toLowerCase().includes(q) ? 'block' : 'none';
  });
}

// Highlight active nav link on scroll (code panel only)
document.getElementById('content-area').addEventListener('scroll', function() {
  if (document.getElementById('code-panel').style.display === 'none') return;
  const sections = document.querySelectorAll('.file-section');
  let current = '';
  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top  {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});
