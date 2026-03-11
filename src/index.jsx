// ─────────────────────────────────────────────────────────────────────────────
// src/index.jsx — DWB Remotion Root v4.0
//
// v4.0 fixes:
//   • Only imports week files that actually exist in the repo
//   • Dead imports (weeks 7–13) removed — they crashed render on boot
//   • TO ADD A NEW WEEK: create weekN-content.js, import below, spread into ALL_CONTENT
//   • Weeks 5–6 use default exports  |  Weeks 7+ use named exports
//
// CURRENT STATE: Day 31 — Week 5 active, Week 6 ready
// ─────────────────────────────────────────────────────────────────────────────

import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

// ── Week 5 (Days 29–35) — default export ──
import week5Content from './week5-content.js';

// ── Week 6 (Days 36–42) — default export ──
import week6Content from './week6-content.js';

// ─────────────────────────────────────────────────────────────────────────────
// TO ADD WEEK 7+:
//   1. Create src/week7-content.js  →  export const week7Videos = [...]
//   2. Uncomment the import below
//   3. Spread into ALL_CONTENT
// ─────────────────────────────────────────────────────────────────────────────
// import { week7Videos }  from './week7-content.js';
// import { week8Videos }  from './week8-content.js';
// import { week9Videos }  from './week9-content.js';
// import { week10Videos } from './week10-content.js';
// import { week11Videos, week12Videos, week13Videos } from './weeks11-13-content.js';

// ─────────────────────────────────────────────────────────────────────────────
// ALL_CONTENT — every video entry in order
// ─────────────────────────────────────────────────────────────────────────────
const ALL_CONTENT = [
  ...(Array.isArray(week5Content) ? week5Content : []),
  ...(Array.isArray(week6Content) ? week6Content : []),
  // ...week7Videos,
  // ...week8Videos,
  // ...week9Videos,
  // ...week10Videos,
  // ...week11Videos,
  // ...week12Videos,
  // ...week13Videos,
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

  if (valid.length === 0) {
    console.error('[DWB] FATAL: No valid compositions loaded. Check week content files.');
  }

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
