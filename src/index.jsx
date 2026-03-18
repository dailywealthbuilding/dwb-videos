// ─────────────────────────────────────────────────────────────────────────────
// src/index.jsx — DWB Remotion Root v4.0 — REPLACE EXISTING
//
// v4.0 changes:
//   • safeRequire() — missing week files return [] instead of crashing bundle
//   • No need to upload ALL past week files to the repo
//   • Only the ACTIVE week file needs to exist in src/
//   • Adding new weeks: just drop the file in src/ — nothing else to change
// ─────────────────────────────────────────────────────────────────────────────

import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// safeRequire — loads a week file if it exists, returns [] if not found
// ─────────────────────────────────────────────────────────────────────────────
function safeRequire(modulePath) {
  try {
    const m = require(modulePath);
    // Handle default export (weeks 5–6) or named export (weeks 7+)
    if (m.default && Array.isArray(m.default)) return m.default;
    const named = Object.values(m).find(v => Array.isArray(v));
    if (named) return named;
    return [];
  } catch (e) {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Load all weeks safely — missing files silently return []
// ─────────────────────────────────────────────────────────────────────────────
const week5Content  = safeRequire('./week5-content.js');
const week6Content  = safeRequire('./week6-content.js');
const week7Videos   = safeRequire('./week7-content.js');
const week8Videos   = safeRequire('./week8-content.js');
const week9Videos   = safeRequire('./week9-content.js');
const week10Videos  = safeRequire('./week10-content.js');

// weeks11-13 exports multiple named arrays — load all three safely
const week11Videos  = (() => { try { return require('./weeks11-13-content.js').week11Videos || []; } catch(e) { return []; } })();
const week12Videos  = (() => { try { return require('./weeks11-13-content.js').week12Videos || []; } catch(e) { return []; } })();
const week13Videos  = (() => { try { return require('./weeks11-13-content.js').week13Videos || []; } catch(e) { return []; } })();

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
  const required = ['id', 'filename', 'music', 'overlays', 'pexelsSearchTerms'];
  const missing = required.filter(f => !entry[f]);
  if (missing.length > 0) {
    console.warn(`[DWB] ${entry.id || 'UNKNOWN'} missing: ${missing.join(', ')}`);
  }
  return missing;
}

// ─────────────────────────────────────────────────────────────────────────────
// RemotionRoot
// ─────────────────────────────────────────────────────────────────────────────
export const RemotionRoot = () => {
  const valid = ALL_CONTENT.filter(entry => validateEntry(entry).length === 0);

  console.log(`[DWB v4] ${valid.length} compositions loaded | ${valid[0]?.id} → ${valid[valid.length - 1]?.id}`);

  return (
    <>
      {valid.map(({ id, music, overlays }) => (
        <Composition
          key={id}
          id={id}
          component={VideoComposition}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            videoId: id,
            music,
            overlays,
          }}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);
