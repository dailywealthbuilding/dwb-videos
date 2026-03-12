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

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO GUIDE — Every Sunday
// 1. ads.tiktok.com → Creative Center → Trending Songs → Region: US → 7 days
// 2. Match track VIBE to each day's mood (see comments in VIDEO_DATA)
// 3. Download via yt1s.com as MP3 — rename day36.mp3 through day42.mp3
// 4. Upload all 7 to public/music/ in GitHub
// 5. Commit → render workflow picks them up automatically
// ─────────────────────────────────────────────────────────────────────────────

// ── Per-day cinematic color grade ──
const COLOR_GRADES = {
  day29: { top: 'rgba(80,0,0,0.22)',    mid: 'rgba(40,0,0,0.06)',    bot: 'rgba(80,0,0,0.22)',    accent: '#FF3300' },
  day30: { top: 'rgba(0,30,90,0.22)',   mid: 'rgba(0,20,60,0.06)',   bot: 'rgba(0,30,90,0.22)',   accent: '#0066FF' },
  day31: { top: 'rgba(70,25,0,0.22)',   mid: 'rgba(40,12,0,0.06)',   bot: 'rgba(70,25,0,0.22)',   accent: '#FF6600' },
  day32: { top: 'rgba(0,15,70,0.22)',   mid: 'rgba(0,10,40,0.06)',   bot: 'rgba(0,15,70,0.22)',   accent: '#00CCFF' },
  day33: { top: 'rgba(0,35,20,0.22)',   mid: 'rgba(0,20,10,0.06)',   bot: 'rgba(0,35,20,0.22)',   accent: '#00FF88' },
  day34: { top: 'rgba(50,0,80,0.24)',   mid: 'rgba(25,0,40,0.08)',   bot: 'rgba(50,0,80,0.24)',   accent: '#AA00FF' },
  day35: { top: 'rgba(0,15,50,0.22)',   mid: 'rgba(0,10,30,0.06)',   bot: 'rgba(0,15,50,0.22)',   accent: '#3366FF' },
  // Week 6
  day36: { top: 'rgba(0,60,0,0.22)',    mid: 'rgba(0,30,0,0.06)',    bot: 'rgba(0,60,0,0.22)',    accent: '#00FF44' },
  day37: { top: 'rgba(80,40,0,0.22)',   mid: 'rgba(40,20,0,0.06)',   bot: 'rgba(80,40,0,0.22)',   accent: '#FF9900' },
  day38: { top: 'rgba(0,0,80,0.22)',    mid: 'rgba(0,0,40,0.06)',    bot: 'rgba(0,0,80,0.22)',    accent: '#4499FF' },
  day39: { top: 'rgba(70,0,70,0.22)',   mid: 'rgba(35,0,35,0.06)',   bot: 'rgba(70,0,70,0.22)',   accent: '#FF44FF' },
  day40: { top: 'rgba(80,20,0,0.22)',   mid: 'rgba(40,10,0,0.06)',   bot: 'rgba(80,20,0,0.22)',   accent: '#FF6600' },
  day41: { top: 'rgba(0,20,60,0.22)',   mid: 'rgba(0,10,30,0.06)',   bot: 'rgba(0,20,60,0.22)',   accent: '#00AAFF' },
  day42: { top: 'rgba(40,30,0,0.22)',   mid: 'rgba(20,15,0,0.06)',   bot: 'rgba(40,30,0,0.22)',   accent: '#FFD700' },
  // Week 7
  day43: { top: 'rgba(80,0,20,0.22)',   mid: 'rgba(40,0,10,0.06)',   bot: 'rgba(80,0,20,0.22)',   accent: '#FF2244' },
  day44: { top: 'rgba(80,40,0,0.22)',   mid: 'rgba(40,20,0,0.06)',   bot: 'rgba(80,40,0,0.22)',   accent: '#FF9900' },
  day45: { top: 'rgba(60,50,0,0.22)',   mid: 'rgba(30,25,0,0.06)',   bot: 'rgba(60,50,0,0.22)',   accent: '#FFD700' },
  day46: { top: 'rgba(0,60,30,0.22)',   mid: 'rgba(0,30,15,0.06)',   bot: 'rgba(0,60,30,0.22)',   accent: '#00FF88' },
  day47: { top: 'rgba(50,0,80,0.24)',   mid: 'rgba(25,0,40,0.08)',   bot: 'rgba(50,0,80,0.24)',   accent: '#AA00FF' },
  day48: { top: 'rgba(80,0,20,0.22)',   mid: 'rgba(40,0,10,0.06)',   bot: 'rgba(80,0,20,0.22)',   accent: '#FF2244' },
  day49: { top: 'rgba(0,20,70,0.22)',   mid: 'rgba(0,10,35,0.06)',   bot: 'rgba(0,20,70,0.22)',   accent: '#3399FF' },
  // Week 8
  day50: { top: 'rgba(60,50,0,0.24)',   mid: 'rgba(30,25,0,0.08)',   bot: 'rgba(60,50,0,0.24)',   accent: '#FFD700' },
  day51: { top: 'rgba(0,40,70,0.22)',   mid: 'rgba(0,20,35,0.06)',   bot: 'rgba(0,40,70,0.22)',   accent: '#00CCFF' },
  day52: { top: 'rgba(80,25,0,0.22)',   mid: 'rgba(40,12,0,0.06)',   bot: 'rgba(80,25,0,0.22)',   accent: '#FF4400' },
  day53: { top: 'rgba(0,55,30,0.22)',   mid: 'rgba(0,28,15,0.06)',   bot: 'rgba(0,55,30,0.22)',   accent: '#44FF88' },
  day54: { top: 'rgba(45,0,80,0.24)',   mid: 'rgba(22,0,40,0.08)',   bot: 'rgba(45,0,80,0.24)',   accent: '#9933FF' },
  day55: { top: 'rgba(80,0,50,0.22)',   mid: 'rgba(40,0,25,0.06)',   bot: 'rgba(80,0,50,0.22)',   accent: '#FF44AA' },
  day56: { top: 'rgba(60,50,0,0.24)',   mid: 'rgba(30,25,0,0.08)',   bot: 'rgba(60,50,0,0.24)',   accent: '#FFD700' },
  // Week 9
  day57: { top: 'rgba(70,35,0,0.22)',   mid: 'rgba(35,17,0,0.06)',   bot: 'rgba(70,35,0,0.22)',   accent: '#FF9900' },
  day58: { top: 'rgba(0,30,70,0.22)',   mid: 'rgba(0,15,35,0.06)',   bot: 'rgba(0,30,70,0.22)',   accent: '#00AAFF' },
  day59: { top: 'rgba(65,0,65,0.22)',   mid: 'rgba(32,0,32,0.06)',   bot: 'rgba(65,0,65,0.22)',   accent: '#FF44FF' },
  day60: { top: 'rgba(60,50,0,0.26)',   mid: 'rgba(30,25,0,0.09)',   bot: 'rgba(60,50,0,0.26)',   accent: '#FFD700' },
  day61: { top: 'rgba(80,0,20,0.24)',   mid: 'rgba(40,0,10,0.08)',   bot: 'rgba(80,0,20,0.24)',   accent: '#FF2244' },
  day62: { top: 'rgba(45,0,70,0.22)',   mid: 'rgba(22,0,35,0.06)',   bot: 'rgba(45,0,70,0.22)',   accent: '#AA44FF' },
  day63: { top: 'rgba(0,35,70,0.22)',   mid: 'rgba(0,17,35,0.06)',   bot: 'rgba(0,35,70,0.22)',   accent: '#00CCFF' },
  // Week 10
  day64: { top: 'rgba(75,30,0,0.22)',   mid: 'rgba(37,15,0,0.06)',   bot: 'rgba(75,30,0,0.22)',   accent: '#FF6600' },
  day65: { top: 'rgba(0,25,75,0.22)',   mid: 'rgba(0,12,37,0.06)',   bot: 'rgba(0,25,75,0.22)',   accent: '#0099FF' },
  day66: { top: 'rgba(55,0,80,0.24)',   mid: 'rgba(27,0,40,0.08)',   bot: 'rgba(55,0,80,0.24)',   accent: '#9933FF' },
  day67: { top: 'rgba(80,0,45,0.22)',   mid: 'rgba(40,0,22,0.06)',   bot: 'rgba(80,0,45,0.22)',   accent: '#FF44AA' },
  day68: { top: 'rgba(75,35,0,0.22)',   mid: 'rgba(37,17,0,0.06)',   bot: 'rgba(75,35,0,0.22)',   accent: '#FF9900' },
  day69: { top: 'rgba(0,55,25,0.22)',   mid: 'rgba(0,27,12,0.06)',   bot: 'rgba(0,55,25,0.22)',   accent: '#00FF66' },
  day70: { top: 'rgba(60,50,0,0.26)',   mid: 'rgba(30,25,0,0.09)',   bot: 'rgba(60,50,0,0.26)',   accent: '#FFD700' },
  // Week 11
  day71: { top: 'rgba(0,55,25,0.22)',   mid: 'rgba(0,27,12,0.06)',   bot: 'rgba(0,55,25,0.22)',   accent: '#00FF88' },
  day72: { top: 'rgba(75,30,0,0.22)',   mid: 'rgba(37,15,0,0.06)',   bot: 'rgba(75,30,0,0.22)',   accent: '#FF6600' },
  day73: { top: 'rgba(0,30,70,0.22)',   mid: 'rgba(0,15,35,0.06)',   bot: 'rgba(0,30,70,0.22)',   accent: '#00CCFF' },
  day74: { top: 'rgba(65,0,65,0.22)',   mid: 'rgba(32,0,32,0.06)',   bot: 'rgba(65,0,65,0.22)',   accent: '#CC00FF' },
  day75: { top: 'rgba(60,50,0,0.26)',   mid: 'rgba(30,25,0,0.09)',   bot: 'rgba(60,50,0,0.26)',   accent: '#FFD700' },
  day76: { top: 'rgba(80,20,0,0.24)',   mid: 'rgba(40,10,0,0.08)',   bot: 'rgba(80,20,0,0.24)',   accent: '#FF4400' },
  day77: { top: 'rgba(80,0,20,0.26)',   mid: 'rgba(40,0,10,0.09)',   bot: 'rgba(80,0,20,0.26)',   accent: '#FF2244' },
  // Week 12
  day78: { top: 'rgba(75,35,0,0.24)',   mid: 'rgba(37,17,0,0.08)',   bot: 'rgba(75,35,0,0.24)',   accent: '#FF9900' },
  day79: { top: 'rgba(0,25,75,0.22)',   mid: 'rgba(0,12,37,0.06)',   bot: 'rgba(0,25,75,0.22)',   accent: '#3399FF' },
  day80: { top: 'rgba(60,50,0,0.28)',   mid: 'rgba(30,25,0,0.10)',   bot: 'rgba(60,50,0,0.28)',   accent: '#FFD700' },
  day81: { top: 'rgba(0,55,25,0.24)',   mid: 'rgba(0,27,12,0.08)',   bot: 'rgba(0,55,25,0.24)',   accent: '#00FF88' },
  day82: { top: 'rgba(60,50,0,0.28)',   mid: 'rgba(30,25,0,0.10)',   bot: 'rgba(60,50,0,0.28)',   accent: '#FFD700' },
  day83: { top: 'rgba(50,0,75,0.24)',   mid: 'rgba(25,0,37,0.08)',   bot: 'rgba(50,0,75,0.24)',   accent: '#AA44FF' },
  day84: { top: 'rgba(78,25,0,0.24)',   mid: 'rgba(39,12,0,0.08)',   bot: 'rgba(78,25,0,0.24)',   accent: '#FF6600' },
  // Week 13 — GRAND FINALE (deepest grades)
  day85: { top: 'rgba(0,30,70,0.26)',   mid: 'rgba(0,15,35,0.09)',   bot: 'rgba(0,30,70,0.26)',   accent: '#00CCFF' },
  day86: { top: 'rgba(80,0,20,0.28)',   mid: 'rgba(40,0,10,0.10)',   bot: 'rgba(80,0,20,0.28)',   accent: '#FF2244' },
  day87: { top: 'rgba(60,50,0,0.30)',   mid: 'rgba(30,25,0,0.12)',   bot: 'rgba(60,50,0,0.30)',   accent: '#FFD700' },
  day88: { top: 'rgba(0,25,75,0.26)',   mid: 'rgba(0,12,37,0.09)',   bot: 'rgba(0,25,75,0.26)',   accent: '#0099FF' },
  day89: { top: 'rgba(70,0,45,0.26)',   mid: 'rgba(35,0,22,0.09)',   bot: 'rgba(70,0,45,0.26)',   accent: '#FF44AA' },
  day90: { top: 'rgba(65,52,0,0.32)',   mid: 'rgba(32,26,0,0.14)',   bot: 'rgba(65,52,0,0.32)',   accent: '#FFD700' },
};

// ── Per-day progress bar gradient colors ──
const GRADE_COLORS = {
  day29: ['#FF0000', '#FF6600', '#FFD700'],
  day30: ['#0066FF', '#00CCFF', '#FFD700'],
  day31: ['#FF6600', '#FF0000', '#FFD700'],
  day32: ['#0033FF', '#00FFFF', '#FFFFFF'],
  day33: ['#00AA44', '#00FF88', '#FFD700'],
  day34: ['#9900FF', '#FF0066', '#FF6600'],
  day35: ['#003399', '#0066FF', '#00CCFF'],
  // Week 6
  day36: ['#00FF44', '#00CC33', '#FFD700'],
  day37: ['#FF9900', '#FFCC00', '#FFFFFF'],
  day38: ['#0044FF', '#4499FF', '#00CCFF'],
  day39: ['#FF00FF', '#CC00FF', '#FF4499'],
  day40: ['#FF4400', '#FF9900', '#FFD700'],
  day41: ['#0066FF', '#00AAFF', '#00FFCC'],
  day42: ['#FFD700', '#FFAA00', '#FF6600'],
  // Week 7
  day43: ['#FF2244', '#FF6600', '#FFD700'],
  day44: ['#FF9900', '#FFCC00', '#FFD700'],
  day45: ['#FFD700', '#FFAA00', '#FF9900'],
  day46: ['#00FF88', '#00CCAA', '#FFD700'],
  day47: ['#AA00FF', '#FF0066', '#FF6600'],
  day48: ['#FF2244', '#FF0066', '#FFD700'],
  day49: ['#3399FF', '#00CCFF', '#FFD700'],
  // Week 8
  day50: ['#FFD700', '#FFAA00', '#FF6600'],
  day51: ['#00CCFF', '#0099FF', '#FFD700'],
  day52: ['#FF4400', '#FF9900', '#FFD700'],
  day53: ['#44FF88', '#00FF66', '#FFD700'],
  day54: ['#9933FF', '#CC00FF', '#FF44AA'],
  day55: ['#FF44AA', '#FF0066', '#AA00FF'],
  day56: ['#FFD700', '#FFCC00', '#FF9900'],
  // Week 9
  day57: ['#FF9900', '#FFCC00', '#FFD700'],
  day58: ['#00AAFF', '#00CCFF', '#FFD700'],
  day59: ['#FF44FF', '#CC00FF', '#FF0066'],
  day60: ['#FFD700', '#FF9900', '#FF6600'],
  day61: ['#FF2244', '#FF6600', '#FFD700'],
  day62: ['#AA44FF', '#7700FF', '#FF44FF'],
  day63: ['#00CCFF', '#0099FF', '#FFD700'],
  // Week 10
  day64: ['#FF6600', '#FF9900', '#FFD700'],
  day65: ['#0099FF', '#00CCFF', '#FFD700'],
  day66: ['#9933FF', '#CC00FF', '#FF44FF'],
  day67: ['#FF44AA', '#FF0066', '#FF6600'],
  day68: ['#FF9900', '#FFCC00', '#FFD700'],
  day69: ['#00FF66', '#00FF88', '#FFD700'],
  day70: ['#FFD700', '#FF9900', '#FF6600'],
  // Week 11
  day71: ['#00FF88', '#00CCAA', '#FFD700'],
  day72: ['#FF6600', '#FF9900', '#FFD700'],
  day73: ['#00CCFF', '#0099FF', '#00FF88'],
  day74: ['#CC00FF', '#9933FF', '#FF44FF'],
  day75: ['#FFD700', '#FFAA00', '#FF9900'],
  day76: ['#FF4400', '#FF6600', '#FFD700'],
  day77: ['#FF2244', '#FF0044', '#FF6600'],
  // Week 12
  day78: ['#FF9900', '#FFCC00', '#FFD700'],
  day79: ['#3399FF', '#00CCFF', '#FFD700'],
  day80: ['#FFD700', '#FF9900', '#FF6600'],
  day81: ['#00FF88', '#00CCFF', '#FFD700'],
  day82: ['#FFD700', '#FFAA00', '#FF9900'],
  day83: ['#AA44FF', '#7700FF', '#FF44FF'],
  day84: ['#FF6600', '#FF9900', '#FFD700'],
  // Week 13 — FINALE
  day85: ['#00CCFF', '#0099FF', '#FFD700'],
  day86: ['#FF2244', '#FF0044', '#FF6600'],
  day87: ['#FFD700', '#FFCC00', '#FF9900'],
  day88: ['#0099FF', '#00CCFF', '#FFD700'],
  day89: ['#FF44AA', '#FF0066', '#AA00FF'],
  day90: ['#FFD700', '#FFB800', '#FF9900'],
};

// ── Per-day border glow color ──
const BORDER_COLORS = {
  day29: 'rgba(255,51,0,0.45)',
  day30: 'rgba(0,102,255,0.45)',
  day31: 'rgba(255,102,0,0.45)',
  day32: 'rgba(0,204,255,0.45)',
  day33: 'rgba(0,255,136,0.45)',
  day34: 'rgba(170,0,255,0.45)',
  day35: 'rgba(51,102,255,0.45)',
  // Week 6
  day36: 'rgba(0,255,68,0.45)',
  day37: 'rgba(255,153,0,0.45)',
  day38: 'rgba(68,153,255,0.45)',
  day39: 'rgba(255,68,255,0.45)',
  day40: 'rgba(255,102,0,0.45)',
  day41: 'rgba(0,170,255,0.45)',
  day42: 'rgba(255,215,0,0.45)',
  // Week 7
  day43: 'rgba(255,34,68,0.45)',
  day44: 'rgba(255,153,0,0.45)',
  day45: 'rgba(255,215,0,0.45)',
  day46: 'rgba(0,255,136,0.45)',
  day47: 'rgba(170,0,255,0.45)',
  day48: 'rgba(255,34,68,0.45)',
  day49: 'rgba(51,153,255,0.45)',
  // Week 8
  day50: 'rgba(255,215,0,0.45)',
  day51: 'rgba(0,204,255,0.45)',
  day52: 'rgba(255,68,0,0.45)',
  day53: 'rgba(68,255,136,0.45)',
  day54: 'rgba(153,51,255,0.45)',
  day55: 'rgba(255,68,170,0.45)',
  day56: 'rgba(255,215,0,0.45)',
  // Week 9
  day57: 'rgba(255,153,0,0.45)',
  day58: 'rgba(0,170,255,0.45)',
  day59: 'rgba(255,68,255,0.45)',
  day60: 'rgba(255,215,0,0.50)',
  day61: 'rgba(255,34,68,0.48)',
  day62: 'rgba(170,68,255,0.45)',
  day63: 'rgba(0,204,255,0.45)',
  // Week 10
  day64: 'rgba(255,102,0,0.45)',
  day65: 'rgba(0,153,255,0.45)',
  day66: 'rgba(153,51,255,0.45)',
  day67: 'rgba(255,68,170,0.45)',
  day68: 'rgba(255,153,0,0.45)',
  day69: 'rgba(0,255,102,0.45)',
  day70: 'rgba(255,215,0,0.50)',
  // Week 11
  day71: 'rgba(0,255,136,0.45)',
  day72: 'rgba(255,102,0,0.45)',
  day73: 'rgba(0,204,255,0.45)',
  day74: 'rgba(204,0,255,0.45)',
  day75: 'rgba(255,215,0,0.52)',
  day76: 'rgba(255,68,0,0.48)',
  day77: 'rgba(255,34,68,0.50)',
  // Week 12
  day78: 'rgba(255,153,0,0.48)',
  day79: 'rgba(51,153,255,0.45)',
  day80: 'rgba(255,215,0,0.52)',
  day81: 'rgba(0,255,136,0.48)',
  day82: 'rgba(255,215,0,0.52)',
  day83: 'rgba(170,68,255,0.48)',
  day84: 'rgba(255,102,0,0.48)',
  // Week 13 — FINALE (stronger glow)
  day85: 'rgba(0,204,255,0.55)',
  day86: 'rgba(255,34,68,0.55)',
  day87: 'rgba(255,215,0,0.60)',
  day88: 'rgba(0,153,255,0.55)',
  day89: 'rgba(255,68,170,0.55)',
  day90: 'rgba(255,215,0,0.70)',
};

// ── Phase 2: Day-specific special layers ──
const DAY_SPECIAL_LAYERS = {
  // Week 5 (Days 29-35)
  day32: { matrixRain: true, matrixOpacity: 0.12 },
  // Week 6 (Days 36-42)
  day38: { matrixRain: true, matrixOpacity: 0.10 },
  day41: { matrixRain: true, matrixOpacity: 0.10 },
  // Week 7 - Trust Phase (Days 43-49)
  day43: { matrixRain: true, matrixOpacity: 0.08 },
  day47: { matrixRain: true, matrixOpacity: 0.09 },
  // Week 8 - Momentum Phase (Days 50-56)
  day50: { matrixRain: true, matrixOpacity: 0.10 },
  day54: { matrixRain: true, matrixOpacity: 0.09 },
  // Week 9 - Systems Phase (Days 57-63)
  day57: { matrixRain: true, matrixOpacity: 0.10 },
  day60: { matrixRain: true, matrixOpacity: 0.12 },
  day63: { matrixRain: true, matrixOpacity: 0.09 },
  // Week 10 - Authority Phase (Days 64-70)
  day64: { matrixRain: true, matrixOpacity: 0.10 },
  day67: { matrixRain: true, matrixOpacity: 0.09 },
  day70: { matrixRain: true, matrixOpacity: 0.14 },
  // Weeks 11-13 - Activation Phase (Days 71-90)
  day71: { matrixRain: true, matrixOpacity: 0.10 },
  day75: { matrixRain: true, matrixOpacity: 0.12 },
  day77: { matrixRain: true, matrixOpacity: 0.10 },
  day80: { matrixRain: true, matrixOpacity: 0.14 },
  day84: { matrixRain: true, matrixOpacity: 0.12 },
  day87: { matrixRain: true, matrixOpacity: 0.15 },
  day90: { matrixRain: true, matrixOpacity: 0.18 },
};

// Clip boundary frames (4 equal clips in 900-frame video)
const CLIP_BOUNDARY_FRAMES = [0, 225, 450, 675];

// ─────────────────────────────────────────────────────────────────────────────
// LAYER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Layer: Film Grain ──
const FilmGrain = () => (
  <AbsoluteFill style={{
    zIndex: 2, pointerEvents: 'none', opacity: 0.04,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
    backgroundSize: '180px 180px',
    mixBlendMode: 'overlay',
  }} />
);

// ── Layer: Scanlines ──
const Scanlines = () => (
  <AbsoluteFill style={{
    zIndex: 3, pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
  }} />
);

// ── Layer: Vignette ──
const Vignette = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 80%, rgba(0,0,0,0.92) 100%)',
    pointerEvents: 'none',
    zIndex: 4,
  }} />
);

// ── Layer: Cinematic Color Grade ──
const ColorGrade = ({ videoId }) => {
  const grade = COLOR_GRADES[videoId] || COLOR_GRADES.day29;
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${grade.top} 0%, ${grade.mid} 45%, ${grade.mid} 55%, ${grade.bot} 100%)`,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
      zIndex: 5,
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
      background: 'rgba(0,0,0,0.06)',
      pointerEvents: 'none',
      zIndex: 6,
    }} />
  );
};

// ── Layer: Corner Accent Marks ──
const CornerBrackets = ({ videoId }) => {
  const frame = useCurrentFrame();
  const grade = COLOR_GRADES[videoId] || COLOR_GRADES.day29;
  const opacity = interpolate(frame, [0, 20], [0, 0.65], { extrapolateRight: 'clamp' });
  const size = 48;
  const thickness = 2.5;
  const offset = 28;
  const color = grade.accent;
  const bracketStyle = { position: 'absolute', width: size, height: size };
  const lineH = { position: 'absolute', height: thickness, background: color, borderRadius: 1 };
  const lineV = { position: 'absolute', width: thickness, background: color, borderRadius: 1 };
  return (
    <AbsoluteFill style={{ zIndex: 7, pointerEvents: 'none', opacity }}>
      <div style={{ ...bracketStyle, top: offset, left: offset }}>
        <div style={{ ...lineH, top: 0, left: 0, width: size }} />
        <div style={{ ...lineV, top: 0, left: 0, height: size }} />
      </div>
      <div style={{ ...bracketStyle, top: offset, right: offset }}>
        <div style={{ ...lineH, top: 0, right: 0, width: size }} />
        <div style={{ ...lineV, top: 0, right: 0, height: size }} />
      </div>
      <div style={{ ...bracketStyle, bottom: offset, left: offset }}>
        <div style={{ ...lineH, bottom: 0, left: 0, width: size }} />
        <div style={{ ...lineV, bottom: 0, left: 0, height: size }} />
      </div>
      <div style={{ ...bracketStyle, bottom: offset, right: offset }}>
        <div style={{ ...lineH, bottom: 0, right: 0, width: size }} />
        <div style={{ ...lineV, bottom: 0, right: 0, height: size }} />
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Animated Glow Border ──
const GlowBorder = ({ videoId }) => {
  const frame = useCurrentFrame();
  const borderColor = BORDER_COLORS[videoId] || BORDER_COLORS.day29;
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.5, 1.0]);
  const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' }) * pulse;
  return (
    <AbsoluteFill style={{
      zIndex: 8, pointerEvents: 'none', opacity,
      boxShadow: `inset 0 0 40px ${borderColor}, inset 0 0 80px ${borderColor}55`,
    }} />
  );
};

// ── Layer: Letterbox Bars ──
const LetterboxBars = () => {
  const frame = useCurrentFrame();
  const barH = interpolate(frame, [0, 8, 28, 35], [88, 88, 88, 0], { extrapolateRight: 'clamp' });
  if (barH <= 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 16, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: barH, background: '#000000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: barH, background: '#000000' }} />
    </AbsoluteFill>
  );
};

// ── Layer: Shockwave Ring ──
const ShockwaveRing = () => {
  const frame = useCurrentFrame();
  if (frame > 18) return null;
  const scale = interpolate(frame, [0, 18], [0, 1.8], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 4, 18], [0, 0.8, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ zIndex: 17, pointerEvents: 'none', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 540, height: 540, borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.9)',
        boxShadow: '0 0 30px rgba(255,255,255,0.4)',
        opacity,
        transform: `scale(${scale})`,
      }} />
    </AbsoluteFill>
  );
};

// ── Layer: Progress Bar ──
const ProgressBar = ({ videoId }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const colors = GRADE_COLORS[videoId] || GRADE_COLORS.day29;
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '5px', backgroundColor: 'rgba(255,255,255,0.10)', zIndex: 20 }}>
      <div style={{
        height: '100%',
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        borderRadius: '0 3px 3px 0',
        boxShadow: `0 0 12px ${colors[1]}BB, 0 0 4px ${colors[0]}88`,
        transition: 'width 0.01s linear',
      }} />
    </div>
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
    <AbsoluteFill style={{ display: 'flex', alignItems: 'flex-end',
      justifyContent: 'flex-end', padding: '0 40px 56px 0', zIndex: 18, pointerEvents: 'none' }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: 'rgba(0,0,0,0.45)',
        borderRadius: '8px',
        padding: '6px 14px',
        border: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '22px', color: '#FFFFFF', fontWeight: '700',
          textShadow: '0 1px 8px rgba(0,0,0,0.95)',
          letterSpacing: '0.5px',
        }}>@DailyWealthBuilding</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Day Badge ──
const DayBadge = ({ videoId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dayNum = parseInt(videoId.replace('day', ''), 10);
  const grade  = COLOR_GRADES[videoId] || COLOR_GRADES.day29;
  const s = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 14, stiffness: 180 } });
  const opacity    = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-80, 0]);
  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'flex-start',
      justifyContent: 'flex-start', padding: '62px 0 0 40px', zIndex: 19, pointerEvents: 'none' }}>
      <div style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        background: 'rgba(0,0,0,0.78)',
        borderRadius: '14px',
        padding: '8px 18px',
        display: 'flex', alignItems: 'baseline', gap: '3px',
        border: `1px solid ${grade.accent}55`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 16px ${grade.accent}30`,
      }}>
        <span style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '30px', color: '#FFD700',
          textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(255,215,0,0.4)',
        }}>DAY {dayNum}</span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '16px', color: 'rgba(255,255,255,0.55)',
          fontWeight: '700',
        }}>/90</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Outro CTA End Card ──
const OutroCard = ({ videoId }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const outroStart = durationInFrames - 60;
  const outroFrame = Math.max(0, frame - outroStart);
  const dayNum = parseInt(videoId.replace('day', ''), 10);
  const grade  = COLOR_GRADES[videoId] || COLOR_GRADES.day29;
  const s = spring({ fps, frame: outroFrame, config: { damping: 16, stiffness: 140 } });
  const translateY = interpolate(s, [0, 1], [140, 0]);
  const opacity    = frame >= outroStart ? interpolate(s, [0, 1], [0, 1]) : 0;
  const glowPulse  = interpolate(Math.sin(outroFrame * 0.15), [-1, 1], [0.3, 0.8]);
  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'flex-end',
      justifyContent: 'center', padding: '0 0 90px 0', zIndex: 21, pointerEvents: 'none' }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(8,8,28,0.97) 100%)',
        borderRadius: '24px',
        padding: '28px 52px',
        textAlign: 'center',
        border: `1px solid ${grade.accent}`,
        boxShadow: `0 8px 48px rgba(0,0,0,0.85), 0 0 32px ${grade.accent}${Math.round(glowPulse * 255).toString(16).padStart(2,'0')}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        minWidth: '620px',
      }}>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px', color: '#FFD700',
          letterSpacing: '5px', fontWeight: '800',
          textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9,
        }}>Follow For Daily Videos</div>
        <div style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '40px', color: '#FFFFFF',
          textShadow: '0 2px 16px rgba(0,0,0,0.9)',
          marginBottom: '8px', letterSpacing: '1px',
        }}>@DailyWealthBuilding</div>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px', color: 'rgba(255,255,255,0.45)',
          fontWeight: '600', letterSpacing: '1.5px',
        }}>90-Day Public Challenge · Day {dayNum} of 90</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Chromatic Aberration (Phase 2) ──
const ChromaticAberration = ({ intensity = 0.6 }) => {
  const frame = useCurrentFrame();
  const pulse  = 0.8 + Math.sin(frame * 0.05) * 0.2;
  const offset = Math.round(intensity * pulse);
  if (offset <= 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 1, pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 85% 15%, rgba(255,0,60,0.08) 0%, transparent 55%)`,
        transform: `translate(${offset}px, -${offset}px)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 15% 85%, rgba(0,255,220,0.08) 0%, transparent 55%)`,
        transform: `translate(-${offset}px, ${offset}px)`,
      }} />
    </AbsoluteFill>
  );
};

// ── Layer: Depth of Field (Phase 2) ──
const DepthOfField = ({ overlays = [] }) => {
  const frame = useCurrentFrame();
  const nearestBlur = (() => {
    for (const o of overlays) {
      if (frame >= o.startFrame - 8 && frame < o.startFrame)
        return interpolate(frame, [o.startFrame - 8, o.startFrame], [0, 1.8]);
      if (frame >= o.startFrame && frame < o.endFrame) return 1.8;
      if (frame >= o.endFrame && frame < o.endFrame + 8)
        return interpolate(frame, [o.endFrame, o.endFrame + 8], [1.8, 0]);
    }
    return 0;
  })();
  if (nearestBlur <= 0.1) return null;
  return (
    <AbsoluteFill style={{
      zIndex: 0, pointerEvents: 'none',
      backdropFilter: `blur(${nearestBlur}px)`,
      WebkitBackdropFilter: `blur(${nearestBlur}px)`,
      background: 'rgba(0,0,0,0.04)',
    }} />
  );
};

// ── Layer: TV Static Burst (Phase 2) ──
const TVStaticBurst = ({ clipBoundaryFrames = [] }) => {
  const frame = useCurrentFrame();
  const BURST_FRAMES = 3;
  const boundary = clipBoundaryFrames.find(bf => frame >= bf && frame < bf + BURST_FRAMES);
  if (boundary === undefined) return null;
  const localF    = frame - boundary;
  const intensity = interpolate(localF, [0, 1, BURST_FRAMES - 1, BURST_FRAMES], [0, 0.55, 0.3, 0]);
  return (
    <AbsoluteFill style={{
      zIndex: 18, pointerEvents: 'none',
      background: `rgba(255,255,255,${intensity})`,
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent, transparent 2px,
        rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px
      )`,
    }} />
  );
};

// ── Layer: Matrix Rain (Phase 2) ──
const MatrixRain = ({ opacity = 0.15 }) => {
  const frame = useCurrentFrame();
  const COLS  = 14;
  const CHARS = '01アイウエオカキクケコ0110';
  const columns = [];
  for (let i = 0; i < COLS; i++) {
    const seed      = i * 47.3;
    const speed     = 0.8 + (seed % 1.4);
    const offset    = (seed * 13) % 100;
    const charSeed  = Math.floor((frame * speed + offset) / 6) + i * 7;
    const char      = CHARS[charSeed % CHARS.length];
    const trail1    = CHARS[(charSeed - 1 + CHARS.length) % CHARS.length];
    const trail2    = CHARS[(charSeed - 2 + CHARS.length) % CHARS.length];
    const y         = ((frame * speed + offset) % 120) - 10;
    columns.push(
      <div key={i} style={{
        position: 'absolute', left: `${(i / COLS) * 100 + 3}%`,
        top: `${y}%`, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '2px',
      }}>
        <span style={{ color: '#FFFFFF', opacity: 0.9, fontSize: '14px',
          fontFamily: "'JetBrains Mono', monospace", fontWeight: '700',
          textShadow: '0 0 8px #00FF00' }}>{char}</span>
        <span style={{ color: '#00FF44', opacity: 0.6, fontSize: '13px',
          fontFamily: "'JetBrains Mono', monospace" }}>{trail1}</span>
        <span style={{ color: '#00AA22', opacity: 0.3, fontSize: '12px',
          fontFamily: "'JetBrains Mono', monospace" }}>{trail2}</span>
      </div>
    );
  }
  return (
    <AbsoluteFill style={{ zIndex: 1, pointerEvents: 'none', overflow: 'hidden', opacity }}>
      {columns}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export const VideoComposition = ({ videoId, overlays: propOverlays, music: propMusic }) => {
  // Accept overlays from props (new index.jsx approach) OR fall back to empty
  const overlays = propOverlays || [];
  const music    = propMusic || `${videoId}.mp3`;
  const special  = DAY_SPECIAL_LAYERS[videoId] || {};
  const accentColor = (COLOR_GRADES[videoId] || COLOR_GRADES.day29).accent;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>

      {/* Layer 1: Background video clips (Ken Burns + flash transitions) */}
      <BackgroundVideo videoId={videoId} />

      {/* Layer 2: Chromatic aberration — subtle RGB edge split */}
      <ChromaticAberration intensity={0.5} />

      {/* Layer 3: Depth of field — video blurs when text is on screen */}
      <DepthOfField overlays={overlays} />

      {/* Layer 4: TV Static burst — 3-frame white noise at clip boundaries */}
      <TVStaticBurst clipBoundaryFrames={CLIP_BOUNDARY_FRAMES} />

      {/* Layer 5: Matrix rain — techy days only (day32, day38, day41) */}
      {special.matrixRain && (
        <MatrixRain opacity={special.matrixOpacity} />
      )}

      {/* Layer 6: Base dark overlay */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.18)', zIndex: 0 }} />

      {/* Layer 7: Cinematic color grade */}
      <ColorGrade videoId={videoId} />

      {/* Layer 8: Vignette */}
      <Vignette />

      {/* Layer 9: Old film flicker */}
      <FilmFlicker />

      {/* Layer 10: Film grain */}
      <FilmGrain />

      {/* Layer 11: Scanlines */}
      <Scanlines />

      {/* Layer 12: Corner brackets */}
      <CornerBrackets videoId={videoId} />

      {/* Layer 13: Glow border */}
      <GlowBorder videoId={videoId} />

      {/* Layer 14: Particle system — day-specific (fire, rain, snow, confetti, float) */}
      {DAY_PARTICLES[videoId] && (
        <Particles
          type={DAY_PARTICLES[videoId]}
          opacity={0.35}
          burstFrame={videoId === 'day30' || videoId === 'day60' || videoId === 'day90' ? 90 : 0}
        />
      )}

      {/* Layer 15: Audio — ducking + SFX enabled */}
      <AudioTrack
        music={music}
        volume={0.25}
        overlays={overlays}
        videoId={videoId}
      />

      {/* Layer 16: Letterbox bars */}
      <LetterboxBars />

      {/* Layer 17: Shockwave ring */}
      <ShockwaveRing />

      {/* Layer 18: Day counter badge */}
      <DayBadge videoId={videoId} />

      {/* Layer 19: Text overlays — all animations */}
      {overlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={overlay.startFrame}
          durationInFrames={Math.max(1, overlay.endFrame - overlay.startFrame)}
        >
          <TextOverlay overlay={overlay} />
        </Sequence>
      ))}

      {/* Layer 20: Animated watermark */}
      <Watermark />

      {/* Layer 21: Lower third — channel handle (first 4 seconds) */}
      <LowerThird
        startFrame={10}
        endFrame={120}
        accentColor={accentColor}
      />

      {/* Layer 22: Scene number — 01/07 top-right */}
      <SceneNumber current={1} total={7} startFrame={0} endFrame={900} />

      {/* Layer 23: Corner timestamp — DAY XX/90 */}
      <CornerTimestamp label={`DAY ${parseInt(videoId.replace('day',''),10)}/90`} />

      {/* Layer 24: Outro CTA end card */}
      <OutroCard videoId={videoId} />

      {/* Layer 25: Progress bar — always on top */}
      <ProgressBar videoId={videoId} />

    </AbsoluteFill>
  );
};
