// ─────────────────────────────────────────────────────────────────────────────
// src/index.jsx — DWB Remotion Root v4.1 — REPLACE EXISTING
//
// v4.1 fix:
//   • Replaced safeRequire(variable) with inline try/catch string literals
//   • Webpack requires STATIC string paths to resolve modules at bundle time
//   • safeRequire(variable) caused webpack to silently skip all week files
//   • Each week now loaded with a direct require('./weekN-content.js')
//   • Missing files still return [] safely — behavior unchanged
// ─────────────────────────────────────────────────────────────────────────────

import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Week file loaders — each uses a STATIC string literal so webpack can
// resolve them at bundle time. Missing files return [] safely.
// ─────────────────────────────────────────────────────────────────────────────

let week5Content = [];
try {
  const m = require('./week5-content.js');
  week5Content = (m.default && Array.isArray(m.default)) ? m.default
    : (Object.values(m).find(v => Array.isArray(v)) || []);
} catch(e) {}

let week6Content = [];
try {
  const m = require('./week6-content.js');
  week6Content = (m.default && Array.isArray(m.default)) ? m.default
    : (Object.values(m).find(v => Array.isArray(v)) || []);
} catch(e) {}

let week7Videos = [];
try {
  const m = require('./week7-content.js');
  week7Videos = (m.default && Array.isArray(m.default)) ? m.default
    : (Object.values(m).find(v => Array.isArray(v)) || []);
} catch(e) {}

let week8Videos = [];
try {
  const m = require('./week8-content.js');
  week8Videos = (m.default && Array.isArray(m.default)) ? m.default
    : (Object.values(m).find(v => Array.isArray(v)) || []);
} catch(e) {}

let week9Videos = [];
try {
  const m = require('./week9-content.js');
  week9Videos = (m.default && Array.isArray(m.default)) ? m.default
    : (Object.values(m).find(v => Array.isArray(v)) || []);
} catch(e) {}

let week10Videos = [];
try {
  const m = require('./week10-content.js');
  week10Videos = (m.default && Array.isArray(m.default)) ? m.default
    : (Object.values(m).find(v => Array.isArray(v)) || []);
} catch(e) {}

// weeks11-13 exports multiple named arrays — load all three safely
let week11Videos = [];
try { week11Videos = require('./weeks11-13-content.js').week11Videos || []; } catch(e) {}

let week12Videos = [];
try { week12Videos = require('./weeks11-13-content.js').week12Videos || []; } catch(e) {}

let week13Videos = [];
try { week13Videos = require('./weeks11-13-content.js').week13Videos || []; } catch(e) {}

// ─────────────────────────────────────────────────────────────────────────────
// ALL_CONTENT — every loaded entry, in order
// ─────────────────────────────────────────────────────────────────────────────
const ALL_CONTENT = [
  ...week5Content,
  ...week6Content,
  ...week7Videos,
  ...week8Videos,
  ...week9Videos,
  ...week10Videos,
  ...week11Videos,
  ...week12Videos,
  ...week13Videos,
];

// ─────────────────────────────────────────────────────────────────────────────
// Validate required fields — warns in console, skips broken entries
// ─────────────────────────────────────────────────────────────────────────────
function validateEntry(entry) {
  const required = ['id', 'filename', 'overlays'];
  const missing = required.filter(f => !entry[f]);
  if (missing.length > 0) {
    console.warn('[DWB] ' + (entry.id || 'UNKNOWN') + ' missing: ' + missing.join(', '));
  }
  return missing;
}

// ─────────────────────────────────────────────────────────────────────────────
// RemotionRoot
// ─────────────────────────────────────────────────────────────────────────────
export const RemotionRoot = () => {
  const valid = ALL_CONTENT.filter(entry => validateEntry(entry).length === 0);

  console.log('[DWB v4.1] ' + valid.length + ' compositions loaded | ' + valid[0]?.id + ' -> ' + valid[valid.length - 1]?.id);

  return (
    <>
      {valid.map(({ id, music, overlays }) => (
        
      ))}
    
  );
};

registerRoot(RemotionRoot);
