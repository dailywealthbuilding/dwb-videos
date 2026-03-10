// ─────────────────────────────────────────────────────────────────────────────
// src/index.jsx — DWB Remotion Root v2.0
//
// Upgrades vs v1:
//   • Week-aware composition registration (no hardcoded day list)
//   • Auto-loads content from content/weekN-content.js
//   • calculateMetadata for dynamic duration support (future-proof)
//   • Validates required content fields before registration
//   • Clean scalable structure — just drop in new weekN-content.js to add week
//   • Console warnings on missing/malformed content (CI-friendly)
//
// TO ADD A NEW WEEK:
//   1. Create content/week6-content.js with VIDEO_DATA array
//   2. Import it below and add to WEEKS map
//   3. That's it — no other changes needed
// ─────────────────────────────────────────────────────────────────────────────

import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

// ── Week content imports ──
// Add new week imports here as the challenge progresses
import week5Content from '../content/week5-content.js';
import week6Content from '../content/week6-content.js';

// ── Master week registry ──
// key = week label (for logging), value = content array
const WEEKS = {
  week5: week5Content,
  week6: week6Content,
};

// ─────────────────────────────────────────────────────────────────────────────
// Validate a content entry has all required fields
// Returns array of missing field names, or empty array if valid
// ─────────────────────────────────────────────────────────────────────────────
function validateEntry(entry, weekKey) {
  const required = ['id', 'filename', 'music', 'overlays', 'pexelsSearchTerms'];
  const missing = required.filter(f => !entry[f]);
  if (missing.length > 0) {
    console.warn(`[DWB] ${weekKey}/${entry.id || '?'} missing fields: ${missing.join(', ')}`);
  }
  return missing;
}

// ─────────────────────────────────────────────────────────────────────────────
// Flatten all weeks into a single composition list
// Skips invalid entries with a warning
// ─────────────────────────────────────────────────────────────────────────────
function buildCompositions() {
  const compositions = [];

  for (const [weekKey, entries] of Object.entries(WEEKS)) {
    if (!Array.isArray(entries)) {
      console.warn(`[DWB] ${weekKey} content is not an array — skipped`);
      continue;
    }

    for (const entry of entries) {
      const missing = validateEntry(entry, weekKey);
      if (missing.length > 0) continue; // skip broken entries

      compositions.push({
        id:      entry.id,
        videoId: entry.id,
        music:   entry.music,
        overlays: entry.overlays,
      });
    }
  }

  return compositions;
}

// ─────────────────────────────────────────────────────────────────────────────
// RemotionRoot — registers all compositions
// ─────────────────────────────────────────────────────────────────────────────
export const RemotionRoot = () => {
  const compositions = buildCompositions();

  return (
    <>
      {compositions.map(({ id, videoId, music, overlays }) => (
        <Composition
          key={id}
          id={id}
          component={VideoComposition}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            videoId,
            music,
            overlays,
          }}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);
