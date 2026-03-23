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
//   
//   = 90 && frame 
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

  for (let i = 0; i  0.5 ? '#FF6600' : '#FFD700';

    particles.push(
       7 ? 1.5 : 0.5}px)`,
        transform: `rotate(${Math.sin((frame + seed) * 0.08) * 12}deg)`,
        pointerEvents: 'none',
      }} />
    );
  }

  return (
    
      {particles}
    
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

  for (let i = 0; i 
    );
  }

  return (
    
      {particles}
    
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

  for (let i = 0; i 
    );
  }

  return (
    
      {particles}
    
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

  if (localFrame  DURATION + 30) return null;

  const particles = [];

  for (let i = 0; i  0.5;

    const progress = Math.min(localFrame / DURATION, 1);
    const gravity = progress * progress * 80;
    const x = 50 + Math.cos(angle) * speed * progress * 35;
    const y = 40 + Math.sin(angle) * speed * progress * 35 + gravity;
    const pOpacity = localFrame 
    );
  }

  return (
    
      {particles}
    
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

  for (let i = 0; i 
    );
  }

  return (
    
      {particles}
    
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
    case 'fire':     return ;
    case 'rain':     return ;
    case 'snow':     return ;
    case 'confetti': return ;
    case 'float':    return ;
    default:         return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE MAP — which days get which particles automatically
// Import this in VideoComposition.jsx and call:
//   const particleType = DAY_PARTICLES[videoId];
//   {particleType && }
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
