import { OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// CLIP HELPER
// ─────────────────────────────────────────────────────────────────────────────
const V = (name) => {
  try {
    const { staticFile } = require('remotion');
    return staticFile('videos/' + name + '.mp4');
  } catch {
    return 'videos/' + name + '.mp4';
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PER-DAY CLIP SETS  (supports 4–6 clips per day)
// ─────────────────────────────────────────────────────────────────────────────
const VIDEO_SETS = {
  day29: [ V('day29_clip1'), V('day29_clip2'), V('day29_clip3'), V('day29_clip4') ],
  day30: [ V('day30_clip1'), V('day30_clip2'), V('day30_clip3'), V('day30_clip4') ],
  day31: [ V('day31_clip1'), V('day31_clip2'), V('day31_clip3'), V('day31_clip4') ],
  day32: [ V('day32_clip1'), V('day32_clip2'), V('day32_clip3'), V('day32_clip4') ],
  day33: [ V('day33_clip1'), V('day33_clip2'), V('day33_clip3'), V('day33_clip4') ],
  day34: [ V('day34_clip1'), V('day34_clip2'), V('day34_clip3'), V('day34_clip4') ],
  day35: [ V('day35_clip1'), V('day35_clip2'), V('day35_clip3'), V('day35_clip4') ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PER-DAY MOTION PROFILES
// Controls: clip pacing, Ken Burns intensity, crossfade length,
//           flash type, zoom burst on hook, pan axes
// ─────────────────────────────────────────────────────────────────────────────
const MOTION_PROFILES = {
  //        clipDur  xfade  flashColor            hookBurst  kbIntensity  rotDrift  panY
  day29: { clipDur: 280, xfade: 14, flash: 'rgba(255, 80, 0,  0.5)', hookBurst: true,  kb: 0.055, rot: 0.18, panY: true  }, // Slow, emotional
  day30: { clipDur: 210, xfade: 10, flash: 'rgba( 20,120,255, 0.5)', hookBurst: true,  kb: 0.06,  rot: 0.12, panY: true  }, // Medium, milestone energy
  day31: { clipDur: 165, xfade:  7, flash: 'rgba(255, 90, 0,  0.55)',hookBurst: true,  kb: 0.07,  rot: 0.22, panY: false }, // Fast, punchy
  day32: { clipDur: 195, xfade:  9, flash: 'rgba( 0, 200,255, 0.5)', hookBurst: false, kb: 0.05,  rot: 0.10, panY: false }, // Clean, techy
  day33: { clipDur: 250, xfade: 12, flash: 'rgba( 0, 210,100, 0.45)',hookBurst: false, kb: 0.045, rot: 0.08, panY: true  }, // Slow, chill
  day34: { clipDur: 155, xfade:  6, flash: 'rgba(170,  0,255, 0.55)',hookBurst: true,  kb: 0.08,  rot: 0.25, panY: false }, // Fastest, tense
  day35: { clipDur: 260, xfade: 13, flash: 'rgba( 30, 80,255, 0.45)',hookBurst: false, kb: 0.04,  rot: 0.08, panY: true  }, // Slowest, reflective
};

// ─────────────────────────────────────────────────────────────────────────────
// KEN BURNS DIRECTION TABLE
// Each clip index gets a unique direction combination
// [zoomDir, panXDir, panYDir]
//   zoomDir:  1 = zoom in,  -1 = zoom out
//   panXDir:  1 = move right, -1 = move left,  0 = no X pan
//   panYDir:  1 = move down,  -1 = move up,    0 = no Y pan
// ─────────────────────────────────────────────────────────────────────────────
const KB_DIRS = [
  {  zoomDir:  1, panXDir: -1, panYDir:  0 },  // clip 0: zoom in + pan left
  {  zoomDir: -1, panXDir:  1, panYDir:  0 },  // clip 1: zoom out + pan right
  {  zoomDir:  1, panXDir:  0, panYDir: -1 },  // clip 2: zoom in + tilt up
  {  zoomDir: -1, panXDir: -1, panYDir:  1 },  // clip 3: zoom out + pan left + tilt down
  {  zoomDir:  1, panXDir:  1, panYDir:  1 },  // clip 4: zoom in + pan right + tilt down
  {  zoomDir: -1, panXDir:  0, panYDir: -1 },  // clip 5: zoom out + tilt up
];

// ─────────────────────────────────────────────────────────────────────────────
// FLASH TRANSITION
// ─────────────────────────────────────────────────────────────────────────────
const FlashTransition = ({ clipIndex, flashColor, duration }) => {
  const frame = useCurrentFrame();
  if (clipIndex === 0) return null;
  const flashOpacity = interpolate(frame, [0, duration], [1, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundColor: flashColor.replace('0.5', String(flashOpacity * 0.55)).replace('0.55', String(flashOpacity * 0.55)),
      background: `rgba(255,255,255,${flashOpacity * 0.5})`,
      zIndex: 5, pointerEvents: 'none',
    }} />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK BURST (frame 0–14: rapid zoom punch on first clip entry)
// ─────────────────────────────────────────────────────────────────────────────
const HookBurst = ({ active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!active) return null;
  const s = spring({ fps, frame, config: { damping: 6, stiffness: 320, mass: 0.5 } });
  const burstScale = interpolate(s, [0, 1], [1.12, 1.0]);
  const burstOpacity = interpolate(frame, [0, 3, 14], [0.7, 0, 0], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `scale(${burstScale})`,
      zIndex: 4, pointerEvents: 'none',
      background: `rgba(255,255,255,${burstOpacity})`,
    }} />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INDIVIDUAL CLIP
// Handles: Ken Burns zoom/pan/tilt/rotation, crossfade, flash, hook burst
// ─────────────────────────────────────────────────────────────────────────────
const BackgroundClip = ({ src, clipIndex, startFrame, clipDuration, profile, isFirst }) => {
  const frame = useCurrentFrame();
  const endFrame = startFrame + clipDuration;
  const dir = KB_DIRS[clipIndex % KB_DIRS.length];

  // ── Crossfade opacity ──
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + profile.xfade, endFrame - profile.xfade, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Ken Burns zoom ──
  const zoomBase  = 1.0;
  const zoomRange = profile.kb;
  const zoom = interpolate(
    frame,
    [startFrame, endFrame],
    dir.zoomDir === 1
      ? [zoomBase, zoomBase + zoomRange]
      : [zoomBase + zoomRange, zoomBase],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Horizontal pan ──
  const PAN_X_RANGE = 18;
  const panX = dir.panXDir === 0 ? 0 : interpolate(
    frame,
    [startFrame, endFrame],
    dir.panXDir === 1 ? [0, PAN_X_RANGE] : [PAN_X_RANGE, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Vertical pan (optional per profile) ──
  const PAN_Y_RANGE = 12;
  const panY = (!profile.panY || dir.panYDir === 0) ? 0 : interpolate(
    frame,
    [startFrame, endFrame],
    dir.panYDir === 1 ? [0, PAN_Y_RANGE] : [PAN_Y_RANGE, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Subtle rotation drift ──
  const ROT_RANGE = profile.rot;
  const rotation = interpolate(
    frame,
    [startFrame, endFrame],
    clipIndex % 2 === 0 ? [0, ROT_RANGE] : [ROT_RANGE, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <Sequence from={startFrame} durationInFrames={clipDuration}>
      <div style={{
        position: 'absolute', inset: 0, opacity,
        transform: `scale(${zoom}) translateX(${panX}px) translateY(${panY}px) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}>
        <OffthreadVideo
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
        />
      </div>

      {/* Flash at clip entry */}
      <FlashTransition
        clipIndex={clipIndex}
        flashColor={profile.flash}
        duration={profile.xfade}
      />

      {/* Hook burst on very first clip only */}
      {isFirst && profile.hookBurst && <HookBurst active={true} />}
    </Sequence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT PULSE (very subtle global brightness pulse — once every ~120 frames)
// Keeps the video feeling alive during longer text holds
// ─────────────────────────────────────────────────────────────────────────────
const AmbientPulse = () => {
  const frame = useCurrentFrame();
  // Pulses at frames 120, 240, 360, 480, 600, 720
  const pulseFrames = [120, 240, 360, 480, 600, 720];
  const nearestPulse = pulseFrames.find(p => frame >= p && frame < p + 20);
  if (!nearestPulse) return null;
  const pulseFrame = frame - nearestPulse;
  const brightness = interpolate(pulseFrame, [0, 5, 20], [1.0, 1.04, 1.0],
    { extrapolateRight: 'clamp' });
  if (brightness === 1.0) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
      background: `rgba(255,255,255,${(brightness - 1.0) * 0.35})`,
    }} />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// OUTRO FADE TO BLACK (last 25 frames — clean black exit)
// ─────────────────────────────────────────────────────────────────────────────
const OutroFade = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeOpacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  if (fadeOpacity <= 0) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#000000',
      opacity: fadeOpacity, zIndex: 6, pointerEvents: 'none',
    }} />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const BackgroundVideo = ({ videoId }) => {
  const clips   = VIDEO_SETS[videoId]     || VIDEO_SETS.day29;
  const profile = MOTION_PROFILES[videoId] || MOTION_PROFILES.day29;

  // Distribute clips evenly across 900 frames regardless of clip count
  // Each clip gets clipDur frames; remaining frames get last clip extended
  const totalFrames = 900;
  const baseClipDur = profile.clipDur;

  // Build clip schedule — fill 900 frames
  const schedule = [];
  let cursor = 0;
  clips.forEach((src, i) => {
    if (cursor >= totalFrames) return;
    const isLast = i === clips.length - 1;
    // Last clip fills whatever is left
    const dur = isLast
      ? Math.max(totalFrames - cursor, baseClipDur)
      : Math.min(baseClipDur, totalFrames - cursor);
    schedule.push({ src, clipIndex: i, startFrame: cursor, dur });
    cursor += dur;
  });

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>

      {schedule.map(({ src, clipIndex, startFrame, dur }, i) => (
        <BackgroundClip
          key={i}
          src={src}
          clipIndex={clipIndex}
          startFrame={startFrame}
          clipDuration={dur}
          profile={profile}
          isFirst={i === 0}
        />
      ))}

      {/* Ambient brightness pulses — keeps long text holds alive */}
      <AmbientPulse />

      {/* Clean black fade at very end */}
      <OutroFade />

    </div>
  );
};
