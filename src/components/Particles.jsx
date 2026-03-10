// ─────────────────────────────────────────────────────────────────────────────
// src/components/Particles.jsx — DWB Particle Systems v1.0
//
// Particle types available:
//   fire        — rising orange/yellow particles, hype days (day31, day34, day39, day40)
//   rain        — falling white dots, emotional/comeback days (day29, day35)
//   snow        — slow drifting white flakes, reflective/recap days (day35, day42)
//   confetti    — multi-color explosion, milestone days (day30, day60, day90)
//   float       — soft glowing dots drift upward, dreamy closing days
//
// Usage in VideoComposition.jsx:
//   import { Particles } from '../components/Particles.jsx';
//   <Particles type="fire" videoId={videoId} />
//   <Particles type="confetti" active={frame >= 90 && frame <= 300} />
//
// Per-day particle map (add to VIDEO_DATA or call automatically):
//   day29: rain  | day30: confetti | day31: fire | day33: float
//   day34: fire  | day35: snow     | day40: fire | day42: snow
// ─────────────────────────────────────────────────────────────────────────────

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic pseudo-random — seeded so particles are identical every render
// ─────────────────────────────────────────────────────────────────────────────
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

// ─────────────────────────────────────────────────────────────────────────────
// FIRE PARTICLES
// Rising orange/yellow dots with sin-wave drift
// ─────────────────────────────────────────────────────────────────────────────
const FireParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 22;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed = i * 137.5;
    const startX = seededRandom(seed) * 100;          // % across screen
    const speed  = 0.8 + seededRandom(seed + 1) * 1.4; // vertical speed
    const size   = 3 + seededRandom(seed + 2) * 7;    // px
    const delay  = seededRandom(seed + 3) * 60;       // frame offset
    const drift  = seededRandom(seed + 4) * 40 - 20;  // horizontal drift range

    const age = (frame - delay + 900) % 90;           // loop every 90 frames
    const progress = age / 90;
    const y = 110 - progress * 130 * speed;           // starts below, rises up
    const x = startX + Math.sin((frame + seed) * 0.06) * drift * progress;
    const pOpacity = progress < 0.15
      ? interpolate(progress, [0, 0.15], [0, 0.9])
      : interpolate(progress, [0.6, 1.0], [0.9, 0]);
    const color = seededRandom(seed + 5) > 0.5 ? '#FF6600' : '#FFD700';

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size * 1.6,
        borderRadius: '50% 50% 40% 40%',
        background: `radial-gradient(ellipse at 50% 70%, ${color}, transparent)`,
        opacity: pOpacity * opacity,
        filter: `blur(${size > 7 ? 1.5 : 0.5}px)`,
        transform: `rotate(${Math.sin((frame + seed) * 0.08) * 12}deg)`,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ zIndex: 9, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RAIN PARTICLES
// Falling white dots with angle and varying speed
// ─────────────────────────────────────────────────────────────────────────────
const RainParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 18;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed = i * 97.3;
    const startX = seededRandom(seed) * 110 - 5;
    const speed  = 1.2 + seededRandom(seed + 1) * 1.8;
    const size   = 1.5 + seededRandom(seed + 2) * 2.5;
    const delay  = seededRandom(seed + 3) * 90;
    const angle  = 8 + seededRandom(seed + 4) * 6;   // slight diagonal

    const age = (frame - delay + 900) % 80;
    const progress = age / 80;
    const y = -5 + progress * 115 * speed;
    const x = startX + progress * angle * speed;
    const pOpacity = Math.min(
      interpolate(progress, [0, 0.1], [0, 0.2]),
      interpolate(progress, [0.85, 1.0], [0.2, 0])
    );

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size * 4,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        opacity: pOpacity * opacity,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ zIndex: 9, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SNOW PARTICLES
// Slow drifting, rotating flakes
// ─────────────────────────────────────────────────────────────────────────────
const SnowParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 20;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed = i * 113.7;
    const startX  = seededRandom(seed) * 100;
    const speed   = 0.3 + seededRandom(seed + 1) * 0.5;
    const size    = 4 + seededRandom(seed + 2) * 8;
    const delay   = seededRandom(seed + 3) * 120;
    const driftAmp = 8 + seededRandom(seed + 4) * 16;
    const driftFreq = 0.025 + seededRandom(seed + 5) * 0.03;

    const age = (frame - delay + 900) % 120;
    const progress = age / 120;
    const y = -5 + progress * 115 * speed;
    const x = startX + Math.sin((frame + seed) * driftFreq) * driftAmp;
    const pOpacity = Math.min(
      interpolate(progress, [0, 0.1], [0, 0.8]),
      interpolate(progress, [0.85, 1.0], [0.8, 0])
    );

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 0 4px rgba(255,255,255,0.6)',
        opacity: pOpacity * opacity,
        transform: `rotate(${frame * 0.8 + seed}deg)`,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ zIndex: 9, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFETTI PARTICLES
// Multi-color explosion from center — milestone days
// ─────────────────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FFD700', '#FF6600', '#FF0066', '#00FFAA', '#4499FF', '#FF44FF', '#FFFFFF'];

const ConfettiParticles = ({ opacity = 1, burstFrame = 0 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - burstFrame;
  const COUNT = 30;
  const DURATION = 90;

  if (localFrame < 0 || localFrame > DURATION + 30) return null;

  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed = i * 79.1;
    const angle  = (seededRandom(seed) * 360) * (Math.PI / 180);
    const speed  = 2 + seededRandom(seed + 1) * 5;
    const size   = 6 + seededRandom(seed + 2) * 10;
    const color  = CONFETTI_COLORS[Math.floor(seededRandom(seed + 3) * CONFETTI_COLORS.length)];
    const spin   = seededRandom(seed + 4) * 8 - 4;
    const isRect = seededRandom(seed + 5) > 0.5;

    const progress = Math.min(localFrame / DURATION, 1);
    const gravity = progress * progress * 80;
    const x = 50 + Math.cos(angle) * speed * progress * 35;
    const y = 40 + Math.sin(angle) * speed * progress * 35 + gravity;
    const pOpacity = localFrame < 10
      ? interpolate(localFrame, [0, 10], [0, 1])
      : interpolate(localFrame, [DURATION - 20, DURATION], [1, 0]);

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: isRect ? size * 0.5 : size,
        height: isRect ? size * 1.2 : size,
        borderRadius: isRect ? '2px' : '50%',
        background: color,
        opacity: pOpacity * opacity,
        transform: `rotate(${frame * spin}deg)`,
        boxShadow: `0 0 6px ${color}80`,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ zIndex: 15, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING LIGHT PARTICLES
// Soft glowing dots drift upward — dreamy/reflective days
// ─────────────────────────────────────────────────────────────────────────────
const FloatParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 15;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed = i * 163.4;
    const startX   = seededRandom(seed) * 100;
    const speed    = 0.2 + seededRandom(seed + 1) * 0.35;
    const size     = 4 + seededRandom(seed + 2) * 10;
    const delay    = seededRandom(seed + 3) * 150;
    const driftAmp = 5 + seededRandom(seed + 4) * 12;

    const age = (frame - delay + 900) % 150;
    const progress = age / 150;
    const y = 105 - progress * 120 * speed;
    const x = startX + Math.sin((frame + seed) * 0.02) * driftAmp;
    const pOpacity = Math.min(
      interpolate(progress, [0, 0.15], [0, 0.55]),
      interpolate(progress, [0.75, 1.0], [0.55, 0])
    );

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        boxShadow: `0 0 ${size * 2}px rgba(255,255,220,0.8), 0 0 ${size}px rgba(255,255,255,0.5)`,
        opacity: pOpacity * opacity,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ zIndex: 9, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — Particles dispatcher
//
// Props:
//   type       {string}  — 'fire' | 'rain' | 'snow' | 'confetti' | 'float'
//   opacity    {number}  — global opacity (default 1)
//   active     {boolean} — render at all (default true)
//   burstFrame {number}  — for confetti: which frame to trigger burst (default 0)
// ─────────────────────────────────────────────────────────────────────────────
export const Particles = ({ type, opacity = 1, active = true, burstFrame = 0 }) => {
  if (!active) return null;

  switch (type) {
    case 'fire':     return <FireParticles opacity={opacity} />;
    case 'rain':     return <RainParticles opacity={opacity} />;
    case 'snow':     return <SnowParticles opacity={opacity} />;
    case 'confetti': return <ConfettiParticles opacity={opacity} burstFrame={burstFrame} />;
    case 'float':    return <FloatParticles opacity={opacity} />;
    default:         return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE MAP — which days get which particles automatically
// Import this in VideoComposition.jsx and call:
//   const particleType = DAY_PARTICLES[videoId];
//   {particleType && <Particles type={particleType} opacity={0.35} />}
// ─────────────────────────────────────────────────────────────────────────────
export const DAY_PARTICLES = {
  day29: 'rain',      // Comeback/emotional
  day30: 'confetti',  // Milestone
  day31: 'fire',      // Hype/punchy
  day33: 'float',     // Chill/reflective
  day34: 'fire',      // Bold/controversial
  day35: 'snow',      // Week recap/closing
  day36: 'float',     // Strategic/calm
  day38: 'float',     // Techy/minimal
  day40: 'rain',      // Honest/reflective
  day42: 'snow',      // Week recap/closing
  day60: 'confetti',  // Milestone
  day90: 'confetti',  // FINAL milestone
};
