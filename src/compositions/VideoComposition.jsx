import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { BackgroundVideo } from '../components/BackgroundVideo.jsx';
import { TextOverlay } from '../components/TextOverlay.jsx';
import { AudioTrack } from '../components/AudioTrack.jsx';
import { Particles, DAY_PARTICLES } from '../components/Particles.jsx';
import {
  LowerThird,
  SceneNumber,
  CornerTimestamp,
} from '../components/SpecialOverlays.jsx';

// ── Per-day cinematic color grade ──
const COLOR_GRADES = {
  day29: { top: 'rgba(80,0,0,0.22)',    mid: 'rgba(40,0,0,0.06)',    bot: 'rgba(80,0,0,0.22)',    accent: '#FF3300' },
  day30: { top: 'rgba(0,30,90,0.22)',   mid: 'rgba(0,20,60,0.06)',   bot: 'rgba(0,30,90,0.22)',   accent: '#0066FF' },
  day31: { top: 'rgba(70,25,0,0.22)',   mid: 'rgba(40,12,0,0.06)',   bot: 'rgba(70,25,0,0.22)',   accent: '#FF6600' },
  day32: { top: 'rgba(0,15,70,0.22)',   mid: 'rgba(0,10,40,0.06)',   bot: 'rgba(0,15,70,0.22)',   accent: '#00CCFF' },
  day33: { top: 'rgba(0,35,20,0.22)',   mid: 'rgba(0,20,10,0.06)',   bot: 'rgba(0,35,20,0.22)',   accent: '#00FF88' },
  day34: { top: 'rgba(50,0,80,0.24)',   mid: 'rgba(25,0,40,0.08)',   bot: 'rgba(50,0,80,0.24)',   accent: '#AA00FF' },
  day35: { top: 'rgba(0,15,50,0.22)',   mid: 'rgba(0,10,30,0.06)',   bot: 'rgba(0,15,50,0.22)',   accent: '#3366FF' },
  day36: { top: 'rgba(0,60,0,0.22)',    mid: 'rgba(0,30,0,0.06)',    bot: 'rgba(0,60,0,0.22)',    accent: '#00FF44' },
  day37: { top: 'rgba(80,40,0,0.22)',   mid: 'rgba(40,20,0,0.06)',   bot: 'rgba(80,40,0,0.22)',   accent: '#FF9900' },
  day38: { top: 'rgba(0,0,80,0.22)',    mid: 'rgba(0,0,40,0.06)',    bot: 'rgba(0,0,80,0.22)',    accent: '#4499FF' },
  day39: { top: 'rgba(70,0,70,0.22)',   mid: 'rgba(35,0,35,0.06)',   bot: 'rgba(70,0,70,0.22)',   accent: '#FF44FF' },
  day40: { top: 'rgba(80,20,0,0.22)',   mid: 'rgba(40,10,0,0.06)',   bot: 'rgba(80,20,0,0.22)',   accent: '#FF6600' },
  day41: { top: 'rgba(0,20,60,0.22)',   mid: 'rgba(0,10,30,0.06)',   bot: 'rgba(0,20,60,0.22)',   accent: '#00AAFF' },
  day42: { top: 'rgba(40,30,0,0.22)',   mid: 'rgba(20,15,0,0.06)',   bot: 'rgba(40,30,0,0.22)',   accent: '#FFD700' },
  day43: { top: 'rgba(80,0,20,0.22)',   mid: 'rgba(40,0,10,0.06)',   bot: 'rgba(80,0,20,0.22)',   accent: '#FF2244' },
  day44: { top: 'rgba(80,40,0,0.22)',   mid: 'rgba(40,20,0,0.06)',   bot: 'rgba(80,40,0,0.22)',   accent: '#FF9900' },
  day45: { top: 'rgba(60,50,0,0.22)',   mid: 'rgba(30,25,0,0.06)',   bot: 'rgba(60,50,0,0.22)',   accent: '#FFD700' },
  day46: { top: 'rgba(0,60,30,0.22)',   mid: 'rgba(0,30,15,0.06)',   bot: 'rgba(0,60,30,0.22)',   accent: '#00FF88' },
  day47: { top: 'rgba(50,0,80,0.24)',   mid: 'rgba(25,0,40,0.08)',   bot: 'rgba(50,0,80,0.24)',   accent: '#AA00FF' },
  day48: { top: 'rgba(80,0,20,0.22)',   mid: 'rgba(40,0,10,0.06)',   bot: 'rgba(80,0,20,0.22)',   accent: '#FF2244' },
  day49: { top: 'rgba(0,20,70,0.22)',   mid: 'rgba(0,10,35,0.06)',   bot: 'rgba(0,20,70,0.22)',   accent: '#3399FF' },
  day50: { top: 'rgba(60,50,0,0.24)',   mid: 'rgba(30,25,0,0.08)',   bot: 'rgba(60,50,0,0.24)',   accent: '#FFD700' },
  day51: { top: 'rgba(0,40,70,0.22)',   mid: 'rgba(0,20,35,0.06)',   bot: 'rgba(0,40,70,0.22)',   accent: '#00CCFF' },
  day52: { top: 'rgba(80,25,0,0.22)',   mid: 'rgba(40,12,0,0.06)',   bot: 'rgba(80,25,0,0.22)',   accent: '#FF4400' },
  day53: { top: 'rgba(0,55,30,0.22)',   mid: 'rgba(0,28,15,0.06)',   bot: 'rgba(0,55,30,0.22)',   accent: '#44FF88' },
  day54: { top: 'rgba(45,0,80,0.24)',   mid: 'rgba(22,0,40,0.08)',   bot: 'rgba(45,0,80,0.24)',   accent: '#9933FF' },
  day55: { top: 'rgba(80,0,50,0.22)',   mid: 'rgba(40,0,25,0.06)',   bot: 'rgba(80,0,50,0.22)',   accent: '#FF44AA' },
  day56: { top: 'rgba(60,50,0,0.24)',   mid: 'rgba(30,25,0,0.08)',   bot: 'rgba(60,50,0,0.24)',   accent: '#FFD700' },
  day57: { top: 'rgba(70,35,0,0.22)',   mid: 'rgba(35,17,0,0.06)',   bot: 'rgba(70,35,0,0.22)',   accent: '#FF9900' },
  day58: { top: 'rgba(0,30,70,0.22)',   mid: 'rgba(0,15,35,0.06)',   bot: 'rgba(0,30,70,0.22)',   accent: '#00AAFF' },
  day59: { top: 'rgba(65,0,65,0.22)',   mid: 'rgba(32,0,32,0.06)',   bot: 'rgba(65,0,65,0.22)',   accent: '#FF44FF' },
  day60: { top: 'rgba(60,50,0,0.26)',   mid: 'rgba(30,25,0,0.09)',   bot: 'rgba(60,50,0,0.26)',   accent: '#FFD700' },
  day61: { top: 'rgba(80,0,20,0.24)',   mid: 'rgba(40,0,10,0.08)',   bot: 'rgba(80,0,20,0.24)',   accent: '#FF2244' },
  day62: { top: 'rgba(45,0,70,0.22)',   mid: 'rgba(22,0,35,0.06)',   bot: 'rgba(45,0,70,0.22)',   accent: '#AA44FF' },
  day63: { top: 'rgba(0,35,70,0.22)',   mid: 'rgba(0,17,35,0.06)',   bot: 'rgba(0,35,70,0.22)',   accent: '#00CCFF' },
  day64: { top: 'rgba(75,30,0,0.22)',   mid: 'rgba(37,15,0,0.06)',   bot: 'rgba(75,30,0,0.22)',   accent: '#FF6600' },
  day65: { top: 'rgba(0,25,75,0.22)',   mid: 'rgba(0,12,37,0.06)',   bot: 'rgba(0,25,75,0.22)',   accent: '#0099FF' },
  day66: { top: 'rgba(55,0,80,0.24)',   mid: 'rgba(27,0,40,0.08)',   bot: 'rgba(55,0,80,0.24)',   accent: '#9933FF' },
  day67: { top: 'rgba(80,0,45,0.22)',   mid: 'rgba(40,0,22,0.06)',   bot: 'rgba(80,0,45,0.22)',   accent: '#FF44AA' },
  day68: { top: 'rgba(75,35,0,0.22)',   mid: 'rgba(37,17,0,0.06)',   bot: 'rgba(75,35,0,0.22)',   accent: '#FF9900' },
  day69: { top: 'rgba(0,55,25,0.22)',   mid: 'rgba(0,27,12,0.06)',   bot: 'rgba(0,55,25,0.22)',   accent: '#00FF66' },
  day70: { top: 'rgba(60,50,0,0.26)',   mid: 'rgba(30,25,0,0.09)',   bot: 'rgba(60,50,0,0.26)',   accent: '#FFD700' },
  day71: { top: 'rgba(0,55,25,0.22)',   mid: 'rgba(0,27,12,0.06)',   bot: 'rgba(0,55,25,0.22)',   accent: '#00FF88' },
  day72: { top: 'rgba(75,30,0,0.22)',   mid: 'rgba(37,15,0,0.06)',   bot: 'rgba(75,30,0,0.22)',   accent: '#FF6600' },
  day73: { top: 'rgba(0,30,70,0.22)',   mid: 'rgba(0,15,35,0.06)',   bot: 'rgba(0,30,70,0.22)',   accent: '#00CCFF' },
  day74: { top: 'rgba(65,0,65,0.22)',   mid: 'rgba(32,0,32,0.06)',   bot: 'rgba(65,0,65,0.22)',   accent: '#CC00FF' },
  day75: { top: 'rgba(60,50,0,0.26)',   mid: 'rgba(30,25,0,0.09)',   bot: 'rgba(60,50,0,0.26)',   accent: '#FFD700' },
  day76: { top: 'rgba(80,20,0,0.24)',   mid: 'rgba(40,10,0,0.08)',   bot: 'rgba(80,20,0,0.24)',   accent: '#FF4400' },
  day77: { top: 'rgba(80,0,20,0.26)',   mid: 'rgba(40,0,10,0.09)',   bot: 'rgba(80,0,20,0.26)',   accent: '#FF2244' },
  day78: { top: 'rgba(75,35,0,0.24)',   mid: 'rgba(37,17,0,0.08)',   bot: 'rgba(75,35,0,0.24)',   accent: '#FF9900' },
  day79: { top: 'rgba(0,25,75,0.22)',   mid: 'rgba(0,12,37,0.06)',   bot: 'rgba(0,25,75,0.22)',   accent: '#3399FF' },
  day80: { top: 'rgba(60,50,0,0.28)',   mid: 'rgba(30,25,0,0.10)',   bot: 'rgba(60,50,0,0.28)',   accent: '#FFD700' },
  day81: { top: 'rgba(0,55,25,0.24)',   mid: 'rgba(0,27,12,0.08)',   bot: 'rgba(0,55,25,0.24)',   accent: '#00FF88' },
  day82: { top: 'rgba(60,50,0,0.28)',   mid: 'rgba(30,25,0,0.10)',   bot: 'rgba(60,50,0,0.28)',   accent: '#FFD700' },
  day83: { top: 'rgba(50,0,75,0.24)',   mid: 'rgba(25,0,37,0.08)',   bot: 'rgba(50,0,75,0.24)',   accent: '#AA44FF' },
  day84: { top: 'rgba(78,25,0,0.24)',   mid: 'rgba(39,12,0,0.08)',   bot: 'rgba(78,25,0,0.24)',   accent: '#FF6600' },
  day85: { top: 'rgba(0,30,70,0.26)',   mid: 'rgba(0,15,35,0.09)',   bot: 'rgba(0,30,70,0.26)',   accent: '#00CCFF' },
  day86: { top: 'rgba(80,0,20,0.28)',   mid: 'rgba(40,0,10,0.10)',   bot: 'rgba(80,0,20,0.28)',   accent: '#FF2244' },
  day87: { top: 'rgba(60,50,0,0.30)',   mid: 'rgba(30,25,0,0.12)',   bot: 'rgba(60,50,0,0.30)',   accent: '#FFD700' },
  day88: { top: 'rgba(0,25,75,0.26)',   mid: 'rgba(0,12,37,0.09)',   bot: 'rgba(0,25,75,0.26)',   accent: '#0099FF' },
  day89: { top: 'rgba(70,0,45,0.26)',   mid: 'rgba(35,0,22,0.09)',   bot: 'rgba(70,0,45,0.26)',   accent: '#FF44AA' },
  day90: { top: 'rgba(65,52,0,0.32)',   mid: 'rgba(32,26,0,0.14)',   bot: 'rgba(65,52,0,0.32)',   accent: '#FFD700' },
};

// ── Per-day progress bar gradient colors ──
const GRADE_COLORS = {
  day29: ['#FF0000','#FF6600','#FFD700'], day30: ['#0066FF','#00CCFF','#FFD700'],
  day31: ['#FF6600','#FF0000','#FFD700'], day32: ['#0033FF','#00FFFF','#FFFFFF'],
  day33: ['#00AA44','#00FF88','#FFD700'], day34: ['#9900FF','#FF0066','#FF6600'],
  day35: ['#003399','#0066FF','#00CCFF'], day36: ['#00FF44','#00CC33','#FFD700'],
  day37: ['#FF9900','#FFCC00','#FFFFFF'], day38: ['#0044FF','#4499FF','#00CCFF'],
  day39: ['#FF00FF','#CC00FF','#FF4499'], day40: ['#FF4400','#FF9900','#FFD700'],
  day41: ['#0066FF','#00AAFF','#00FFCC'], day42: ['#FFD700','#FFAA00','#FF6600'],
  day43: ['#FF2244','#FF6600','#FFD700'], day44: ['#FF9900','#FFCC00','#FFD700'],
  day45: ['#FFD700','#FFAA00','#FF9900'], day46: ['#00FF88','#00CCAA','#FFD700'],
  day47: ['#AA00FF','#FF0066','#FF6600'], day48: ['#FF2244','#FF0066','#FFD700'],
  day49: ['#3399FF','#00CCFF','#FFD700'], day50: ['#FFD700','#FFAA00','#FF6600'],
  day51: ['#00CCFF','#0099FF','#FFD700'], day52: ['#FF4400','#FF9900','#FFD700'],
  day53: ['#44FF88','#00FF66','#FFD700'], day54: ['#9933FF','#CC00FF','#FF44AA'],
  day55: ['#FF44AA','#FF0066','#AA00FF'], day56: ['#FFD700','#FFCC00','#FF9900'],
  day57: ['#FF9900','#FFCC00','#FFD700'], day58: ['#00AAFF','#00CCFF','#FFD700'],
  day59: ['#FF44FF','#CC00FF','#FF0066'], day60: ['#FFD700','#FF9900','#FF6600'],
  day61: ['#FF2244','#FF6600','#FFD700'], day62: ['#AA44FF','#7700FF','#FF44FF'],
  day63: ['#00CCFF','#0099FF','#FFD700'], day64: ['#FF6600','#FF9900','#FFD700'],
  day65: ['#0099FF','#00CCFF','#FFD700'], day66: ['#9933FF','#CC00FF','#FF44FF'],
  day67: ['#FF44AA','#FF0066','#FF6600'], day68: ['#FF9900','#FFCC00','#FFD700'],
  day69: ['#00FF66','#00FF88','#FFD700'], day70: ['#FFD700','#FF9900','#FF6600'],
  day71: ['#00FF88','#00CCAA','#FFD700'], day72: ['#FF6600','#FF9900','#FFD700'],
  day73: ['#00CCFF','#0099FF','#00FF88'], day74: ['#CC00FF','#9933FF','#FF44FF'],
  day75: ['#FFD700','#FFAA00','#FF9900'], day76: ['#FF4400','#FF6600','#FFD700'],
  day77: ['#FF2244','#FF0044','#FF6600'], day78: ['#FF9900','#FFCC00','#FFD700'],
  day79: ['#3399FF','#00CCFF','#FFD700'], day80: ['#FFD700','#FF9900','#FF6600'],
  day81: ['#00FF88','#00CCFF','#FFD700'], day82: ['#FFD700','#FFAA00','#FF9900'],
  day83: ['#AA44FF','#7700FF','#FF44FF'], day84: ['#FF6600','#FF9900','#FFD700'],
  day85: ['#00CCFF','#0099FF','#FFD700'], day86: ['#FF2244','#FF0044','#FF6600'],
  day87: ['#FFD700','#FFCC00','#FF9900'], day88: ['#0099FF','#00CCFF','#FFD700'],
  day89: ['#FF44AA','#FF0066','#AA00FF'], day90: ['#FFD700','#FFB800','#FF9900'],
};

// ── Per-day border glow color ──
const BORDER_COLORS = {
  day29: 'rgba(255,51,0,0.45)',   day30: 'rgba(0,102,255,0.45)',  day31: 'rgba(255,102,0,0.45)',
  day32: 'rgba(0,204,255,0.45)', day33: 'rgba(0,255,136,0.45)',  day34: 'rgba(170,0,255,0.45)',
  day35: 'rgba(51,102,255,0.45)',day36: 'rgba(0,255,68,0.45)',   day37: 'rgba(255,153,0,0.45)',
  day38: 'rgba(68,153,255,0.45)',day39: 'rgba(255,68,255,0.45)', day40: 'rgba(255,102,0,0.45)',
  day41: 'rgba(0,170,255,0.45)', day42: 'rgba(255,215,0,0.45)', day43: 'rgba(255,34,68,0.45)',
  day44: 'rgba(255,153,0,0.45)', day45: 'rgba(255,215,0,0.45)', day46: 'rgba(0,255,136,0.45)',
  day47: 'rgba(170,0,255,0.45)', day48: 'rgba(255,34,68,0.45)', day49: 'rgba(51,153,255,0.45)',
  day50: 'rgba(255,215,0,0.45)', day51: 'rgba(0,204,255,0.45)', day52: 'rgba(255,68,0,0.45)',
  day53: 'rgba(68,255,136,0.45)',day54: 'rgba(153,51,255,0.45)',day55: 'rgba(255,68,170,0.45)',
  day56: 'rgba(255,215,0,0.45)', day57: 'rgba(255,153,0,0.45)', day58: 'rgba(0,170,255,0.45)',
  day59: 'rgba(255,68,255,0.45)',day60: 'rgba(255,215,0,0.50)', day61: 'rgba(255,34,68,0.48)',
  day62: 'rgba(170,68,255,0.45)',day63: 'rgba(0,204,255,0.45)', day64: 'rgba(255,102,0,0.45)',
  day65: 'rgba(0,153,255,0.45)', day66: 'rgba(153,51,255,0.45)',day67: 'rgba(255,68,170,0.45)',
  day68: 'rgba(255,153,0,0.45)', day69: 'rgba(0,255,102,0.45)', day70: 'rgba(255,215,0,0.50)',
  day71: 'rgba(0,255,136,0.45)', day72: 'rgba(255,102,0,0.45)', day73: 'rgba(0,204,255,0.45)',
  day74: 'rgba(204,0,255,0.45)', day75: 'rgba(255,215,0,0.52)', day76: 'rgba(255,68,0,0.48)',
  day77: 'rgba(255,34,68,0.50)', day78: 'rgba(255,153,0,0.48)', day79: 'rgba(51,153,255,0.45)',
  day80: 'rgba(255,215,0,0.52)', day81: 'rgba(0,255,136,0.48)', day82: 'rgba(255,215,0,0.52)',
  day83: 'rgba(170,68,255,0.48)',day84: 'rgba(255,102,0,0.48)', day85: 'rgba(0,204,255,0.55)',
  day86: 'rgba(255,34,68,0.55)', day87: 'rgba(255,215,0,0.60)', day88: 'rgba(0,153,255,0.55)',
  day89: 'rgba(255,68,170,0.55)',day90: 'rgba(255,215,0,0.70)',
};

// ── Phase 2: Day-specific special layers ──
const DAY_SPECIAL_LAYERS = {
  day32: { matrixRain: true, matrixOpacity: 0.12 },
  day38: { matrixRain: true, matrixOpacity: 0.10 },
  day41: { matrixRain: true, matrixOpacity: 0.10 },
  day43: { matrixRain: true, matrixOpacity: 0.08 },
  day47: { matrixRain: true, matrixOpacity: 0.09 },
  day50: { matrixRain: true, matrixOpacity: 0.10 },
  day54: { matrixRain: true, matrixOpacity: 0.09 },
  day57: { matrixRain: true, matrixOpacity: 0.10 },
  day60: { matrixRain: true, matrixOpacity: 0.12 },
  day63: { matrixRain: true, matrixOpacity: 0.09 },
  day64: { matrixRain: true, matrixOpacity: 0.10 },
  day67: { matrixRain: true, matrixOpacity: 0.09 },
  day70: { matrixRain: true, matrixOpacity: 0.14 },
  day71: { matrixRain: true, matrixOpacity: 0.10 },
  day75: { matrixRain: true, matrixOpacity: 0.12 },
  day77: { matrixRain: true, matrixOpacity: 0.10 },
  day80: { matrixRain: true, matrixOpacity: 0.14 },
  day84: { matrixRain: true, matrixOpacity: 0.12 },
  day87: { matrixRain: true, matrixOpacity: 0.15 },
  day90: { matrixRain: true, matrixOpacity: 0.18 },
};

const CLIP_BOUNDARY_FRAMES = [0, 225, 450, 675];

// ─────────────────────────────────────────────────────────────────────────────
// LAYER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Layer: Film Grain ──
const FilmGrain = () => {
  const frame = useCurrentFrame();
  const grain = (frame * 17 + 43) % 100 / 100;
  return (
    <AbsoluteFill style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      opacity: 0.035 + grain * 0.015,
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
    }} />
  );
};

// ── Layer: Scanlines ──
const Scanlines = () => (
  <AbsoluteFill style={{
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    pointerEvents: 'none',
    opacity: 0.03,
  }} />
);

// ── Layer: Vignette ──
const Vignette = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)',
    pointerEvents: 'none',
  }} />
);

// ── Layer: Cinematic Color Grade ──
const ColorGrade = ({ videoId }) => {
  const grade = COLOR_GRADES[videoId] || COLOR_GRADES.day29;
  if (!grade) return null;
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${grade.top} 0%, ${grade.mid} 50%, ${grade.bot} 100%)`,
      mixBlendMode: 'color',
      opacity: 0.7,
      pointerEvents: 'none',
    }} />
  );
};

// ── Layer: Old Film Flicker ──
const FilmFlicker = () => {
  const frame = useCurrentFrame();
  const flickerFrames = [8, 23, 47, 71, 112, 156, 203, 267, 334, 401, 478, 556, 623, 712, 789, 856];
  const isFlicker = flickerFrames.includes(frame);
  if (!isFlicker) return null;
  return (
    <AbsoluteFill style={{
      background: 'rgba(255,255,255,0.03)',
      pointerEvents: 'none',
    }} />
  );
};

// ── Layer: Corner Accent Marks ──
const CornerBrackets = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 0.5], { extrapolateRight: 'clamp' });
  const size = 28;
  const thick = 2;
  const off = 20;
  const s = { position: 'absolute', background: accentColor || '#FFD700', borderRadius: 1 };
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {/* TL */}
      <div style={{ ...s, top: off, left: off, width: size, height: thick }} />
      <div style={{ ...s, top: off, left: off, width: thick, height: size }} />
      {/* TR */}
      <div style={{ ...s, top: off, right: off, width: size, height: thick }} />
      <div style={{ ...s, top: off, right: off, width: thick, height: size }} />
      {/* BL */}
      <div style={{ ...s, bottom: off, left: off, width: size, height: thick }} />
      <div style={{ ...s, bottom: off, left: off, width: thick, height: size }} />
      {/* BR */}
      <div style={{ ...s, bottom: off, right: off, width: size, height: thick }} />
      <div style={{ ...s, bottom: off, right: off, width: thick, height: size }} />
    </AbsoluteFill>
  );
};

// ── Layer: Animated Glow Border ──
const GlowBorder = ({ videoId }) => {
  const frame = useCurrentFrame();
  const borderColor = BORDER_COLORS[videoId] || 'rgba(255,153,0,0.45)';
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.5, 1.0]);
  const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' }) * pulse;
  return (
    <AbsoluteFill style={{
      boxShadow: 'inset 0 0 40px ' + borderColor,
      border: '1px solid ' + borderColor,
      opacity,
      pointerEvents: 'none',
    }} />
  );
};

// ── Layer: Letterbox Bars ──
const LetterboxBars = () => {
  const frame = useCurrentFrame();
  const barH = interpolate(frame, [0, 8, 28, 35], [88, 88, 88, 0], { extrapolateRight: 'clamp' });
  if (barH <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: barH, background: '#000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: barH, background: '#000' }} />
    </AbsoluteFill>
  );
};

// ── Layer: Shockwave Ring ──
const ShockwaveRing = () => {
  const frame = useCurrentFrame();
  if (frame > 18) return null;
  const scale = interpolate(frame, [0, 18], [0, 1.8], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 4, 18], [0, 0.25, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 600, height: 600,
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.6)',
        transform: 'scale(' + scale + ')',
        opacity,
      }} />
    </AbsoluteFill>
  );
};

// ── Layer: Progress Bar ──
const ProgressBar = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const color = accentColor || '#FFD700';
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 3,
        width: (progress * 100) + '%',
        background: color,
        boxShadow: '0 0 8px ' + color,
      }} />
    </AbsoluteFill>
  );
};

// ── Layer: Animated Watermark ──
const Watermark = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ fps, frame: Math.max(0, frame - 10), config: { damping: 14, stiffness: 160 } });
  const fadeIn  = interpolate(s, [0, 1], [0, 0.88]);
  const fadeOut = interpolate(frame, [durationInFrames - 80, durationInFrames - 60], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = fadeIn * fadeOut;
  const translateY = interpolate(s, [0, 1], [14, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: '6%', right: '5%',
        transform: 'translateY(' + translateY + 'px)',
        opacity,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 18,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.55)',
        textShadow: '0 2px 8px rgba(0,0,0,0.9)',
      }}>
        @DailyWealthBuilding
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Day Badge ──
const DayBadge = ({ videoId, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dayNum = parseInt(videoId.replace('day', ''), 10);
  const s = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 14, stiffness: 180 } });
  const opacity    = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-80, 0]);
  const color = accentColor || '#FFD700';
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: '6%', left: '5%',
        transform: 'translateX(' + translateX + 'px)',
        opacity,
        display: 'flex', alignItems: 'baseline', gap: 3,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22, fontWeight: 700,
          color,
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        }}>DAY {dayNum}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13, color: 'rgba(255,255,255,0.5)',
        }}>/90</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Outro CTA End Card ──
const OutroCard = ({ videoId, accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const outroStart = durationInFrames - 60;
  const outroFrame = Math.max(0, frame - outroStart);
  const dayNum = parseInt(videoId.replace('day', ''), 10);
  const s = spring({ fps, frame: outroFrame, config: { damping: 16, stiffness: 140 } });
  const translateY = interpolate(s, [0, 1], [140, 0]);
  const opacity    = frame >= outroStart ? interpolate(s, [0, 1], [0, 1]) : 0;
  const glowPulse  = interpolate(Math.sin(outroFrame * 0.15), [-1, 1], [0.3, 0.8]);
  const color = accentColor || '#FFD700';
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', bottom: '12%', left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        transform: 'translateY(' + translateY + 'px)',
        opacity,
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.85)',
          border: '1px solid ' + color,
          boxShadow: '0 0 ' + (20 * glowPulse) + 'px ' + color + '40',
          padding: '14px 28px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color, letterSpacing: '0.3em', marginBottom: 4 }}>
            Follow For Daily Videos
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '0.1em', marginBottom: 4 }}>
            @DailyWealthBuilding
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
            90-Day Public Challenge · Day {dayNum} of 90
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Matrix Rain (Phase 2) ──
const MatrixRain = ({ opacity = 0.15 }) => {
  const frame = useCurrentFrame();
  const COLS  = 14;
  const CHARS = '01アイウエオカキクケコ0110';
  const columns = [];
  for (let i = 0; i < COLS; i++) {
    const speed   = 8 + (i % 5) * 3;
    const offset  = (i * 137) % 60;
    const charIdx = Math.floor((frame + offset) / speed) % CHARS.length;
    const char    = CHARS[charIdx] || '0';
    const trail1  = CHARS[(charIdx + 1) % CHARS.length];
    const trail2  = CHARS[(charIdx + 2) % CHARS.length];
    const x = (i / COLS) * 100;
    const y = ((frame * speed * 0.1 + offset * 10) % 120) - 10;
    columns.push(
      <div key={i} style={{
        position: 'absolute', left: x + '%', top: y + '%',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14, color: '#00FF88',
        textShadow: '0 0 8px #00FF88',
        lineHeight: 1.4,
      }}>
        <div>{char}</div>
        <div style={{ opacity: 0.5 }}>{trail1}</div>
        <div style={{ opacity: 0.2 }}>{trail2}</div>
      </div>
    );
  }
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none', overflow: 'hidden' }}>
      {columns}
    </AbsoluteFill>
  );
};

// ── Layer: Channel Handle Bar ──
const ChannelHandleBar = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 90, 120], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        bottom: '8%', left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity,
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22, letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.7)',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        }}>@DailyWealthBuilding</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export const VideoComposition = ({ videoId, overlays: propOverlays, music: propMusic }) => {
  const overlays = propOverlays || [];
  const music    = propMusic || (videoId + '.mp3');
  const special  = DAY_SPECIAL_LAYERS[videoId] || {};
  const accentColor = (COLOR_GRADES[videoId] || COLOR_GRADES.day29).accent;

  return (
    <AbsoluteFill style={{ background: '#000' }}>

      {/* Layer 1: Background video clips */}
      <BackgroundVideo videoId={videoId} />

      {/* Layer 2: Base dark overlay */}
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.18)', pointerEvents: 'none' }} />

      {/* Layer 3: Cinematic color grade */}
      <ColorGrade videoId={videoId} />

      {/* Layer 4: Vignette */}
      <Vignette />

      {/* Layer 5: Film grain */}
      <FilmGrain />

      {/* Layer 6: Scanlines */}
      <Scanlines />

      {/* Layer 7: Matrix rain — techy days */}
      {special.matrixRain && (
        <MatrixRain opacity={special.matrixOpacity || 0.10} />
      )}

      {/* Layer 8: Particle system */}
      {DAY_PARTICLES[videoId] && (
        <Particles type={DAY_PARTICLES[videoId]} accentColor={accentColor} />
      )}

      {/* Layer 9: Audio */}
      <AudioTrack videoId={videoId} music={music} overlays={overlays} />

      {/* Layer 10: Letterbox bars (cinematic open) */}
      <LetterboxBars />

      {/* Layer 11: Shockwave ring (frame 0 impact) */}
      <ShockwaveRing />

      {/* Layer 12: Glow border */}
      <GlowBorder videoId={videoId} />

      {/* Layer 13: Corner brackets */}
      <CornerBrackets accentColor={accentColor} />

      {/* Layer 14: Day badge */}
      <DayBadge videoId={videoId} accentColor={accentColor} />

      {/* Layer 15: Text overlays */}
      {overlays.map((overlay, index) => (
        <TextOverlay key={index} overlay={overlay} />
      ))}

      {/* Layer 16: Watermark */}
      <Watermark />

      {/* Layer 17: Channel handle bar */}
      <ChannelHandleBar />

      {/* Layer 18: Outro CTA end card */}
      <OutroCard videoId={videoId} accentColor={accentColor} />

      {/* Layer 19: Film flicker */}
      <FilmFlicker />

      {/* Layer 20: Progress bar */}
      <ProgressBar accentColor={accentColor} />

    </AbsoluteFill>
  );
};
