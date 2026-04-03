// -----------------------------------------------------------------------------
// src/components/Particles.jsx -- DWB Particle Systems v1.0
//
// Particle types available:
//   fire        -- rising orange/yellow particles, hype days (day31, day34, day39, day40)
//   rain        -- falling white dots, emotional/comeback days (day29, day35)
//   snow        -- slow drifting white flakes, reflective/recap days (day35, day42)
//   confetti    -- multi-color explosion, milestone days (day30, day60, day90)
//   float       -- soft glowing dots drift upward, dreamy closing days
//
// Per-day particle map (add to VIDEO_DATA or call automatically):
//   day29: rain  | day30: confetti | day31: fire | day33: float
//   day34: fire  | day35: snow     | day40: fire | day42: snow
// -----------------------------------------------------------------------------

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// -----------------------------------------------------------------------------
// Deterministic pseudo-random -- seeded so particles are identical every render
// -----------------------------------------------------------------------------
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

// -----------------------------------------------------------------------------
// FIRE PARTICLES
// Rising orange/yellow dots with sin-wave drift
// -----------------------------------------------------------------------------
const FireParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 22;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed    = i * 137.5;
    const angle   = (seed % 360) * Math.PI / 180;
    const speed   = 0.8 + (i % 5) * 0.15;
    const size    = 6 + (i % 4) * 3;
    const delay   = (i % 8) * 4;
    const localF  = Math.max(0, frame - delay);
    const x       = 50 + Math.cos(angle) * speed * localF * 0.5;
    const y       = 50 + Math.sin(angle) * speed * localF * 0.5 - localF * localF * 0.008;
    const pOpacity = interpolate(localF, [0, 8, 60, 80], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
    const color   = seededRandom(seed) > 0.5 ? '#FF6600' : '#FFD700';

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width: size + 'px',
        height: size + 'px',
        background: color,
        borderRadius: '50%',
        opacity: pOpacity * opacity,
        boxShadow: '0 0 ' + (size > 7 ? 6 : 3) + 'px ' + color + '80',
        transform: 'rotate(' + (Math.sin((frame + seed) * 0.08) * 12) + 'deg)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles}
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// RAIN PARTICLES
// Falling white dots with angle and varying speed
// [FIXED: loop body was stripped by HTML encoding]
// -----------------------------------------------------------------------------
const RainParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 18;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed   = i * 91.3;
    const startX = seededRandom(seed) * 100;
    const speed  = 0.6 + seededRandom(seed + 1) * 0.8;
    const size   = 2 + (i % 3);
    const drift  = Math.sin((frame * 0.03) + seed) * 0.5;
    const delay  = (i % 10) * 6;
    const localF = (frame - delay + 900) % 120;
    const x      = startX + drift;
    const y      = (localF * speed * 0.8) % 110 - 5;
    const pOpacity = interpolate(localF, [0, 5, 100, 115], [0, 0.7, 0.7, 0], { extrapolateRight: 'clamp' });

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width: size + 'px',
        height: (size * 3) + 'px',
        background: 'rgba(180,220,255,0.8)',
        borderRadius: '2px',
        opacity: pOpacity * opacity,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles}
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// SNOW PARTICLES
// Slow drifting, rotating flakes
// [FIXED: loop body was stripped by HTML encoding]
// -----------------------------------------------------------------------------
const SnowParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 20;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed   = i * 53.7;
    const startX = seededRandom(seed) * 100;
    const speed  = 0.2 + seededRandom(seed + 1) * 0.4;
    const size   = 4 + (i % 5) * 2;
    const drift  = Math.sin((frame * 0.02) + seed) * 1.5;
    const delay  = (i % 12) * 8;
    const localF = (frame - delay + 900) % 180;
    const x      = startX + drift;
    const y      = (localF * speed * 0.6) % 110 - 5;
    const rotation = (frame * 0.5 + seed * 10) % 360;
    const pOpacity = interpolate(localF, [0, 8, 160, 175], [0, 0.85, 0.85, 0], { extrapolateRight: 'clamp' });

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width: size + 'px',
        height: size + 'px',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '50%',
        opacity: pOpacity * opacity,
        transform: 'rotate(' + rotation + 'deg)',
        boxShadow: '0 0 4px rgba(200,230,255,0.8)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles}
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// CONFETTI PARTICLES
// Multi-color explosion from center -- milestone days
// [FIXED: size was undefined, CONFETTI_COLORS not used]
// -----------------------------------------------------------------------------
const CONFETTI_COLORS = ['#FFD700', '#FF6600', '#FF0066', '#00FFAA', '#4499FF', '#FF44FF', '#FFFFFF'];

const ConfettiParticles = ({ opacity = 1, burstFrame = 0 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - burstFrame;
  const COUNT = 30;
  const DURATION = 90;

  if (localFrame < 0 || localFrame > DURATION + 30) return null;

  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed   = i * 17.3;
    const angle  = (i / COUNT) * Math.PI * 2;
    const speed  = 0.5 + (i % 3) * 0.3;
    const size   = 6 + (i % 4) * 3;
    const color  = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

    const progress = Math.min(localFrame / DURATION, 1);
    const gravity  = progress * progress * 80;
    const x = 50 + Math.cos(angle) * speed * progress * 35;
    const y = 40 + Math.sin(angle) * speed * progress * 35 + gravity;
    const pOpacity = interpolate(localFrame, [0, 6, DURATION - 10, DURATION], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
    const rotation = (localFrame * 4 + seed * 30) % 360;

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width: size + 'px',
        height: size + 'px',
        background: color,
        borderRadius: i % 3 === 0 ? '50%' : '2px',
        opacity: pOpacity * opacity,
        transform: 'rotate(' + rotation + 'deg)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles}
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// FLOATING LIGHT PARTICLES
// Soft glowing dots drift upward -- dreamy/reflective days
// [FIXED: loop body was stripped by HTML encoding]
// -----------------------------------------------------------------------------
const FloatParticles = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const COUNT = 15;
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const seed   = i * 73.1;
    const startX = 10 + seededRandom(seed) * 80;
    const speed  = 0.15 + seededRandom(seed + 1) * 0.25;
    const size   = 4 + (i % 5) * 2;
    const drift  = Math.sin((frame * 0.025) + seed) * 2;
    const delay  = (i % 8) * 10;
    const localF = (frame - delay + 900) % 200;
    const x      = startX + drift;
    const y      = 90 - (localF * speed * 0.5) % 100;
    const pOpacity = interpolate(localF, [0, 15, 170, 195], [0, 0.6, 0.6, 0], { extrapolateRight: 'clamp' });
    const glow   = size + 4;

    particles.push(
      <div key={i} style={{
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width: size + 'px',
        height: size + 'px',
        background: 'rgba(255,255,200,0.9)',
        borderRadius: '50%',
        opacity: pOpacity * opacity,
        boxShadow: '0 0 ' + glow + 'px rgba(255,240,100,0.7)',
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles}
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// MAIN EXPORT -- Particles dispatcher
//
// Props:
//   type       {string}  -- 'fire' | 'rain' | 'snow' | 'confetti' | 'float'
//   opacity    {number}  -- global opacity (default 1)
//   active     {boolean} -- render at all (default true)
//   burstFrame {number}  -- for confetti: which frame to trigger burst (default 0)
// [FIXED: all switch-case returns had empty JSX]
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// PARTICLE MAP -- which days get which particles automatically
// Import this in VideoComposition.jsx and call:
//   const particleType = DAY_PARTICLES[videoId];
//   {particleType && <Particles type={particleType} accentColor={accentColor} />}
// -----------------------------------------------------------------------------
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
