// src/components/Particles.jsx — DWB Particle Systems v1.1 FIXED
// Fixes applied:
//   - Reconstructed all eaten for loop bodies in FireParticles, RainParticles, SnowParticles, FloatParticles
//   - Fixed loop conditions (< COUNT eaten by HTML parser)
//   - ConfettiParticles was intact (already used proper JSX encoding)

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
  const COUNT = 18;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const xStart  = 15 + seededRandom(i * 3.1)      * 70;   // % from left
    const speed   = 0.6 + seededRandom(i * 1.7)      * 0.8;
    const size    = 4   + seededRandom(i * 2.3)      * 6;
    const drift   = Math.sin(frame * 0.08 + i * 0.9) * 4;
    const yPos    = 100 - ((frame * speed * 0.4 + seededRandom(i * 4.7) * 100) % 110);
    const pOpacity = interpolate(yPos, [0, 20, 80, 100], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const hue = 25 + Math.round(seededRandom(i * 5.3) * 25); // orange-yellow range
    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: (xStart + drift) + '%',
        top: yPos + '%',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, hsl(' + hue + ',100%,80%), hsl(' + hue + ',100%,40%))',
        opacity: pOpacity * opacity,
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RAIN PARTICLES
// Falling white dots — emotional/comeback days
// ─────────────────────────────────────────────────────────────────────────────
const RainParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 25;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const xPos    = seededRandom(i * 2.7) * 100;
    const speed   = 1.2 + seededRandom(i * 1.3) * 1.8;
    const size    = 2   + seededRandom(i * 3.1) * 3;
    const height  = 8   + seededRandom(i * 4.9) * 12;
    const yPos    = (frame * speed * 0.35 + seededRandom(i * 5.5) * 100) % 110 - 5;
    const pOpacity = Math.min(
      interpolate(yPos, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
      interpolate(yPos, [90, 105], [1, 0], { extrapolateLeft: 'clamp' })
    );
    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: xPos + '%',
        top: yPos + '%',
        width: size + 'px',
        height: height + 'px',
        borderRadius: '50%',
        background: 'rgba(200,230,255,0.85)',
        opacity: pOpacity * opacity,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SNOW PARTICLES
// Slow drifting white flakes — reflective/recap days
// ─────────────────────────────────────────────────────────────────────────────
const SnowParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 20;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const xStart  = seededRandom(i * 2.1) * 100;
    const drift   = Math.sin(frame * 0.04 + i * 0.7) * 6;
    const speed   = 0.15 + seededRandom(i * 3.3) * 0.25;
    const size    = 3    + seededRandom(i * 1.9)  * 5;
    const yPos    = (frame * speed + seededRandom(i * 4.1) * 100) % 105 - 2;
    const pOpacity = Math.min(
      interpolate(yPos, [0, 8],   [0, 1], { extrapolateRight: 'clamp' }),
      interpolate(yPos, [92, 105],[1, 0], { extrapolateLeft:  'clamp' })
    );
    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: (xStart + drift) + '%',
        top: yPos + '%',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        opacity: pOpacity * opacity,
        filter: 'blur(0.5px)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
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
    const angle  = (i / COUNT) * Math.PI * 2;
    const speed  = 0.5 + (i % 3) * 0.3;
    const size   = 6 + (i % 4) * 3;
    const color  = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

    const progress = Math.min(localFrame / DURATION, 1);
    const gravity  = progress * progress * 80;
    const x = 50 + Math.cos(angle) * speed * progress * 35;
    const y = 40 + Math.sin(angle) * speed * progress * 35 + gravity;
    const pOpacity = interpolate(localFrame, [0, 6, DURATION - 10, DURATION], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width: size + 'px',
        height: size + 'px',
        background: color,
        borderRadius: '2px',
        opacity: pOpacity * opacity,
        transform: 'rotate(' + (localFrame * (i % 7) * 4) + 'deg)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
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
    const xBase   = 10 + seededRandom(i * 2.9) * 80;
    const drift   = Math.sin(frame * 0.03 + i * 1.1) * 8;
    const speed   = 0.1 + seededRandom(i * 1.7) * 0.15;
    const size    = 4   + seededRandom(i * 3.5) * 8;
    const yPos    = 95  - ((frame * speed + seededRandom(i * 5.1) * 100) % 105);
    const pOpacity = Math.min(
      interpolate(yPos, [10,  25], [0, 1], { extrapolateRight: 'clamp' }),
      interpolate(yPos, [70, 95],  [1, 0], { extrapolateLeft:  'clamp' })
    );
    const hue = 40 + Math.round(seededRandom(i * 4.3) * 30);
    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: (xBase + drift) + '%',
        top: yPos + '%',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,220,100,0.9), rgba(255,180,50,0.3))',
        boxShadow: '0 0 ' + (size * 1.5) + 'px rgba(255,215,0,0.4)',
        opacity: pOpacity * opacity,
        filter: 'blur(0.5px)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
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
