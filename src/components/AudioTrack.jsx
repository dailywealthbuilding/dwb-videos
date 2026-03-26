// src/components/AudioTrack.jsx — DWB Audio Engine v2.1 FIXED
// Fixes applied:
//   - Reconstructed eaten SfxClip return (<Audio> tag)
//   - Reconstructed eaten AudioTrack main return (<> with Audio + SfxClip + milestone cheer)

import { Audio, staticFile, useVideoConfig, interpolate, useCurrentFrame } from 'remotion';

// ── Per-day BPM map (optional — fill in after downloading tracks) ──
const DAY_BPM = {
  day29: 0, day30: 0, day31: 0, day32: 0, day33: 0, day34: 0, day35: 0,
  day36: 0, day37: 0, day38: 0, day39: 0, day40: 0, day41: 0, day42: 0,
};

// ── Milestone days that get crowd cheer SFX ──
const MILESTONE_DAYS = new Set(['day30', 'day60', 'day90']);

// ── SFX trigger map: animation type → SFX file + frame offset ──
const SFX_MAP = {
  'slide-left':  { file: 'whoosh.mp3',  offset: 0, duration: 15 },
  'slide-right': { file: 'whoosh.mp3',  offset: 0, duration: 15 },
  'pop':         { file: 'impact.mp3',  offset: 0, duration: 10 },
  'glitch':      { file: 'impact.mp3',  offset: 0, duration: 10 },
  'zoom-punch':  { file: 'impact.mp3',  offset: 0, duration: 10 },
  'bounce':      { file: 'ping.mp3',    offset: 0, duration: 18 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: compute audio ducking volume
// Music dips to duckVolume when any text overlay is active
// ─────────────────────────────────────────────────────────────────────────────
function computeDuckedVolume(frame, fps, baseVolume, overlays) {
  if (!overlays || overlays.length === 0) return baseVolume;

  const DUCK_VOLUME   = baseVolume * 0.45;
  const DUCK_FRAMES   = Math.round(fps * 0.12);
  const UNDUCK_FRAMES = Math.round(fps * 0.18);

  // Is the current frame inside any overlay?
  const inOverlay = overlays.some(o => frame >= o.startFrame && frame < o.endFrame);

  // Find upcoming overlay start (for pre-duck)
  const duckStart = overlays.findIndex(o => frame >= o.startFrame - DUCK_FRAMES && frame < o.startFrame);
  if (duckStart >= 0) {
    return interpolate(frame,
      [overlays[duckStart].startFrame - DUCK_FRAMES, overlays[duckStart].startFrame],
      [baseVolume, DUCK_VOLUME],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // Find overlay we just left (for un-duck)
  const unduckStart = overlays.findIndex(o => frame >= o.endFrame && frame < o.endFrame + UNDUCK_FRAMES);
  if (unduckStart >= 0) {
    const nextOverlay = overlays.find(o => o.startFrame > overlays[unduckStart].endFrame);
    const unduckEnd = nextOverlay ? nextOverlay.startFrame - DUCK_FRAMES : overlays[unduckStart].endFrame + UNDUCK_FRAMES;
    return interpolate(frame,
      [overlays[unduckStart].endFrame, Math.min(overlays[unduckStart].endFrame + UNDUCK_FRAMES, unduckEnd)],
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
      endAt={durationFrames}
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
  const duckedBase  = computeDuckedVolume(frame, fps, volume, overlays);
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
  const isMilestone = MILESTONE_DAYS.has(videoId);

  return (
    <>
      {/* Main music track */}
      {music && (
        <Audio
          src={staticFile('music/' + music)}
          volume={musicVolume}
        />
      )}

      {/* SFX layer — one clip per animation trigger */}
      {sfxTriggers.map((sfx, i) => (
        <SfxClip
          key={i}
          file={sfx.file}
          startFrame={sfx.startFrame}
          durationFrames={sfx.durationFrames}
          baseVolume={0.5}
        />
      ))}

      {/* Milestone cheer — fires at frame 90 on day30/60/90 */}
      {isMilestone && (
        <SfxClip
          file="cheer.mp3"
          startFrame={90}
          durationFrames={45}
          baseVolume={0.35}
        />
      )}
    </>
  );
};
