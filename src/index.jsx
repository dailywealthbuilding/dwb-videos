// ─────────────────────────────────────────────────────────────────────────────
// src/index.jsx — DWB Remotion Root v3.0 — REPLACE EXISTING
//
// v3.0 changes:
//   • Weeks 7–13 registered (Days 43–90 — full 90-day challenge complete)
//   • Supports both default exports (weeks 5–6) and named exports (weeks 7–13)
//   • Smart flat array handles mixed export styles automatically
//   • No other files need changes when adding future challenge weeks
//
// TO ADD A NEW WEEK:
//   1. Create src/weekN-content.js → export const weekNVideos = [...]
//   2. Import it below and spread into ALL_CONTENT
//   3. Done. render.yml auto-detects the new file too.
// ─────────────────────────────────────────────────────────────────────────────

import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

// ── Weeks 5 & 6 (default exports — existing format) ──
import week5Content from './week5-content.js';
import week6Content from './week6-content.js';

// ── Week 7 (Days 43–49) ──
import { week7Videos } from './week7-content.js';

// ── Week 8 (Days 50–56) ──
import { week8Videos } from './week8-content.js';

// ── Week 9 (Days 57–63) ──
import { week9Videos } from './week9-content.js';

// ── Week 10 (Days 64–70) ──
import { week10Videos } from './week10-content.js';

// ── Weeks 11–13 (Days 71–90) ──
import { week11Videos, week12Videos, week13Videos } from './weeks11-13-content.js';

// ─────────────────────────────────────────────────────────────────────────────
// ALL_CONTENT — every video entry across all 90 days, in order
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

  console.log(`[DWB v3] ${valid.length} compositions loaded | ${valid[0]?.id} → ${valid[valid.length - 1]?.id}`);

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
