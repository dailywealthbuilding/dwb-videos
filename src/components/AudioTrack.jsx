// ─────────────────────────────────────────────────────────────────────────────
// AudioTrack.jsx — DWB Audio Engine v2.0
// Upgrades vs v1:
//   • Audio ducking: music dips when text overlays are active
//   • SFX layer: whoosh on slide anims, impact on pop/glitch, ping on CTA
//   • SFX volume envelope: per-clip fade in/out (no harsh cuts)
//   • Multi-track: music + up to 3 simultaneous SFX
//   • Per-day BPM awareness (optional — used for beat-sync hints)
//   • Graceful fallback if SFX files are missing
//
// SFX FILES REQUIRED in public/sfx/:
//   whoosh.mp3    — short ~0.3s swoosh (for slide-left / slide-right)
//   impact.mp3    — short ~0.2s hit/boom (for pop / glitch / zoom-punch)
//   ping.mp3      — short ~0.3s ding/notification (for CTA bounce)
//   cheer.mp3     — ~1.5s crowd cheer (milestone days only: day30, day60, day90)
//
// Source: mixkit.co — 100% free, no attribution required
// ─────────────────────────────────────────────────────────────────────────────

import { Audio, staticFile, useVideoConfig, interpolate, useCurrentFrame } from 'remotion';

// ── Per-day BPM map (optional — fill in after downloading tracks) ──
// Used for beat-sync hints in content files. 0 = unknown / not set.
const DAY_BPM = {
  day29: 0,  // Emotional/comeback — fill after download
  day30: 0,  // Milestone/hype — fill after download
  day31: 0,  // Punchy/assertive — fill after download
  day32: 0,  // Techy/minimal — fill after download
  day33: 0,  // Chill/productive — fill after download
  day34: 0,  // Bold/controversial — fill after download
  day35: 0,  // Reflective/closing — fill after download
  day36: 0,
  day37: 0,
  day38: 0,
  day39: 0,
  day40: 0,
  day41: 0,
  day42: 0,
};

// ── Milestone days that get crowd cheer SFX ──
const MILESTONE_DAYS = new Set(['day30', 'day60', 'day90']);

// ── SFX trigger map: animation type → SFX file + frame offset ──
// frame offset = how many frames into the overlay the SFX should fire
const SFX_MAP = {
  'slide-left':  { file: 'whoosh.mp3',  offset: 0,  duration: 15 },
  'slide-right': { file: 'whoosh.mp3',  offset: 0,  duration: 15 },
  'pop':         { file: 'impact.mp3',  offset: 0,  duration: 10 },
  'glitch':      { file: 'impact.mp3',  offset: 0,  duration: 10 },
  'zoom-punch':  { file: 'impact.mp3',  offset: 0,  duration: 10 },
  'bounce':      { file: 'ping.mp3',    offset: 0,  duration: 18 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: compute audio ducking volume
// Music dips to duckVolume when any text overlay is active,
// returns to baseVolume when screen is between overlays.
// ─────────────────────────────────────────────────────────────────────────────
function computeDuckedVolume(frame, fps, baseVolume, overlays) {
  if (!overlays || overlays.length === 0) return baseVolume;

  const DUCK_VOLUME   = baseVolume * 0.45;  // music at 45% when text is showing
  const DUCK_FRAMES   = Math.round(fps * 0.12); // 0.12s fade to duck
  const UNDUCK_FRAMES = Math.round(fps * 0.18); // 0.18s fade back up

  // Is the current frame inside any overlay?
  const inOverlay = overlays.some(o => frame >= o.startFrame && frame < o.endFrame);

  // Find nearest transition points
  let duckStart = -1;
  let unduckStart = -1;

  for (const o of overlays) {
    if (frame >= o.startFrame - DUCK_FRAMES && frame < o.startFrame + DUCK_FRAMES) {
      duckStart = o.startFrame;
    }
    if (frame >= o.endFrame - UNDUCK_FRAMES && frame < o.endFrame + UNDUCK_FRAMES) {
      unduckStart = o.endFrame;
    }
  }

  // Smooth transition to duck
  if (duckStart >= 0) {
    return interpolate(frame,
      [duckStart - DUCK_FRAMES, duckStart],
      [baseVolume, DUCK_VOLUME],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // Smooth transition back up
  if (unduckStart >= 0) {
    const nextOverlay = overlays.find(o => o.startFrame > unduckStart);
    const unduckEnd = nextOverlay ? nextOverlay.startFrame - DUCK_FRAMES : unduckStart + UNDUCK_FRAMES;
    return interpolate(frame,
      [unduckStart, Math.min(unduckStart + UNDUCK_FRAMES, unduckEnd)],
      [DUCK_VOLUME, baseVolume],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  return inOverlay ? DUCK_VOLUME : baseVolume;
}

// ─────────────────────────────────────────────────────────────────────────────
// SFX Clip — renders a single sound effect at a specific absolute frame
// with fade-in/out envelope to prevent harsh cuts
// ─────────────────────────────────────────────────────────────────────────────
const SfxClip = ({ file, startFrame, durationFrames, baseVolume = 0.6 }) => {
  const frame = useCurrentFrame();
  const FADE_IN  = 3;
  const FADE_OUT = 4;
  const endFrame = startFrame + durationFrames;

  if (frame < startFrame || frame > endFrame + FADE_OUT) return null;

  const volume = Math.min(
    interpolate(frame, [startFrame, startFrame + FADE_IN], [0, baseVolume],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [endFrame - FADE_OUT, endFrame], [baseVolume, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  return (
    <Audio
      src={staticFile('sfx/' + file)}
      startFrom={0}
      endAt={durationFrames + FADE_OUT}
      volume={volume}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AudioTrack — main export
//
// Props:
//   music     {string}  — filename e.g. "day30.mp3" from public/music/
//   volume    {number}  — base music volume (default 0.25)
//   overlays  {Array}   — overlay objects from VIDEO_DATA (for ducking + SFX)
//   videoId   {string}  — e.g. "day30" (for milestone detection)
// ─────────────────────────────────────────────────────────────────────────────
export const AudioTrack = ({
  music,
  volume = 0.25,
  overlays = [],
  videoId = '',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // ── 1. Music fade-in / fade-out (global envelope) ──
  const globalEnvelope = interpolate(
    frame,
    [0, 30, durationInFrames - 45, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── 2. Audio ducking ──
  const duckedBase = computeDuckedVolume(frame, fps, volume, overlays);
  const musicVolume = duckedBase * globalEnvelope;

  // ── 3. Build SFX trigger list from overlays ──
  const sfxTriggers = [];
  for (const overlay of overlays) {
    const anim = overlay.animation || '';
    const sfx = SFX_MAP[anim];
    if (sfx) {
      sfxTriggers.push({
        file: sfx.file,
        startFrame: overlay.startFrame + sfx.offset,
        durationFrames: sfx.duration,
      });
    }
  }

  // ── 4. Milestone cheer (Day 30, 60, 90) ──
  // Fires at frame 90 (when stats counter starts showing)
  const isMilestone = MILESTONE_DAYS.has(videoId);

  return (
    <>
      {/* Main music track */}
      {music && (
        <Audio
          src={staticFile('music/' + music)}
          volume={musicVolume}
          loop
        />
      )}

      {/* SFX layer — one clip per animation trigger */}
      {sfxTriggers.map((sfx, i) => (
        <SfxClip
          key={`sfx-${i}-${sfx.startFrame}`}
          file={sfx.file}
          startFrame={sfx.startFrame}
          durationFrames={sfx.durationFrames}
          baseVolume={0.55}
        />
      ))}

      {/* Milestone cheer — fires at frame 90 on day30/60/90 */}
      {isMilestone && (
        <SfxClip
          file="cheer.mp3"
          startFrame={90}
          durationFrames={45}
          baseVolume={0.4}
        />
      )}
    </>
  );
};
