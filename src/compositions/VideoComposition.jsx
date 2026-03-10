// ─────────────────────────────────────────────────────────────────────────────
// VideoComposition.jsx — PATCH NOTES for Week 6 Upgrade
// These are the EXACT changes to make. All other code stays the same.
// ─────────────────────────────────────────────────────────────────────────────

// ════════════════════════════════════════════════════════════════════
// PATCH 1 — AudioTrack call (in the main VideoComposition render)
// ════════════════════════════════════════════════════════════════════
// FIND this line (around the AudioTrack usage):
<AudioTrack music={data.music} volume={0.25} />

// REPLACE WITH:
<AudioTrack
  music={data.music}
  volume={0.25}
  overlays={data.overlays}
  videoId={videoId}
/>
// This enables audio ducking + SFX layer for Week 6.


// ════════════════════════════════════════════════════════════════════
// PATCH 2 — Add Week 6 COLOR_GRADES
// ════════════════════════════════════════════════════════════════════
// FIND: const COLOR_GRADES = { ... day35: {...} };
// ADD these entries inside the object (after day35):

  day36: { top: 'rgba(0,60,0,0.22)',   mid: 'rgba(0,30,0,0.06)',   bot: 'rgba(0,60,0,0.22)',   accent: '#00FF44' },
  day37: { top: 'rgba(80,40,0,0.22)',  mid: 'rgba(40,20,0,0.06)',  bot: 'rgba(80,40,0,0.22)',  accent: '#FF9900' },
  day38: { top: 'rgba(0,0,80,0.22)',   mid: 'rgba(0,0,40,0.06)',   bot: 'rgba(0,0,80,0.22)',   accent: '#4499FF' },
  day39: { top: 'rgba(70,0,70,0.22)',  mid: 'rgba(35,0,35,0.06)',  bot: 'rgba(70,0,70,0.22)',  accent: '#FF44FF' },
  day40: { top: 'rgba(80,20,0,0.22)',  mid: 'rgba(40,10,0,0.06)',  bot: 'rgba(80,20,0,0.22)',  accent: '#FF6600' },
  day41: { top: 'rgba(0,20,60,0.22)',  mid: 'rgba(0,10,30,0.06)',  bot: 'rgba(0,20,60,0.22)',  accent: '#00AAFF' },
  day42: { top: 'rgba(40,30,0,0.22)',  mid: 'rgba(20,15,0,0.06)',  bot: 'rgba(40,30,0,0.22)',  accent: '#FFD700' },


// ════════════════════════════════════════════════════════════════════
// PATCH 3 — Add Week 6 GRADE_COLORS (progress bar)
// ════════════════════════════════════════════════════════════════════
// FIND: const GRADE_COLORS = { ... day35: [...] };
// ADD after day35:

  day36: ['#00FF44', '#00CC33', '#FFD700'],
  day37: ['#FF9900', '#FFCC00', '#FFFFFF'],
  day38: ['#0044FF', '#4499FF', '#00CCFF'],
  day39: ['#FF00FF', '#CC00FF', '#FF4499'],
  day40: ['#FF4400', '#FF9900', '#FFD700'],
  day41: ['#0066FF', '#00AAFF', '#00FFCC'],
  day42: ['#FFD700', '#FFAA00', '#FF6600'],


// ════════════════════════════════════════════════════════════════════
// PATCH 4 — Add Week 6 BORDER_COLORS (glow border)
// ════════════════════════════════════════════════════════════════════
// FIND: const BORDER_COLORS = { ... day35: '...' };
// ADD after day35:

  day36: 'rgba(0,255,68,0.45)',
  day37: 'rgba(255,153,0,0.45)',
  day38: 'rgba(68,153,255,0.45)',
  day39: 'rgba(255,68,255,0.45)',
  day40: 'rgba(255,102,0,0.45)',
  day41: 'rgba(0,170,255,0.45)',
  day42: 'rgba(255,215,0,0.45)',


// ════════════════════════════════════════════════════════════════════
// PATCH 5 — Update VIDEO_DATA to Week 6 format
// ════════════════════════════════════════════════════════════════════
// The new index.jsx reads content from week6-content.js directly via
// import, so VideoComposition.jsx no longer needs the VIDEO_DATA object.
// 
// HOWEVER — if you're keeping the old inline VIDEO_DATA approach,
// you need to add day36–day42 entries to the existing VIDEO_DATA const
// using the same format. The week6-content.js file has all the data.
//
// RECOMMENDED: Switch to the new index.jsx + week6-content.js approach.
// That means VideoComposition.jsx receives `overlays` via props instead
// of reading from VIDEO_DATA internally.
//
// FIND in VideoComposition: const data = VIDEO_DATA[videoId];
// REPLACE WITH (when using new index.jsx + content file approach):
// VideoComposition now accepts `overlays` as a prop:

export const VideoComposition = ({ videoId, overlays: propOverlays }) => {
  // Use prop overlays if available, fall back to VIDEO_DATA for backward compat
  const data = VIDEO_DATA[videoId] || {};
  const overlays = propOverlays || data.overlays || [];
  const music = data.music || videoId + '.mp3';
  // ... rest of component unchanged
};
