import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { BackgroundVideo } from '../components/BackgroundVideo.jsx';
import { TextOverlay } from '../components/TextOverlay.jsx';
import { AudioTrack } from '../components/AudioTrack.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO GUIDE — Every Sunday
// 1. ads.tiktok.com → Creative Center → Trending Songs → Region: US → 7 days
// 2. Match track VIBE to each day's mood (see comments in VIDEO_DATA)
// 3. Download via yt1s.com as MP3 — rename day29.mp3 through day35.mp3
// 4. Upload all 7 to public/music/ in GitHub
// 5. Commit → render workflow picks them up automatically
// ─────────────────────────────────────────────────────────────────────────────

// ── Per-day cinematic color grade (gradient top/bottom, light center) ──
const COLOR_GRADES = {
  day29: { top: 'rgba(80,0,0,0.22)',    mid: 'rgba(40,0,0,0.06)',    bot: 'rgba(80,0,0,0.22)',    accent: '#FF3300' },
  day30: { top: 'rgba(0,30,90,0.22)',   mid: 'rgba(0,20,60,0.06)',   bot: 'rgba(0,30,90,0.22)',   accent: '#0066FF' },
  day31: { top: 'rgba(70,25,0,0.22)',   mid: 'rgba(40,12,0,0.06)',   bot: 'rgba(70,25,0,0.22)',   accent: '#FF6600' },
  day32: { top: 'rgba(0,15,70,0.22)',   mid: 'rgba(0,10,40,0.06)',   bot: 'rgba(0,15,70,0.22)',   accent: '#00CCFF' },
  day33: { top: 'rgba(0,35,20,0.22)',   mid: 'rgba(0,20,10,0.06)',   bot: 'rgba(0,35,20,0.22)',   accent: '#00FF88' },
  day34: { top: 'rgba(50,0,80,0.24)',   mid: 'rgba(25,0,40,0.08)',   bot: 'rgba(50,0,80,0.24)',   accent: '#AA00FF' },
  day35: { top: 'rgba(0,15,50,0.22)',   mid: 'rgba(0,10,30,0.06)',   bot: 'rgba(0,15,50,0.22)',   accent: '#3366FF' },
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
};

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO DATA — Week 5 (Days 29–35)
// To add Week 6: copy the pattern below, change day IDs and overlay content
// ─────────────────────────────────────────────────────────────────────────────
const VIDEO_DATA = {
  day29: {
    music: "day29.mp3", // VIBE: Emotional/comeback — slow build, piano or lo-fi
    overlays: [
      { text: "I stopped posting\nfor 7 days 😬",                        font: "Anton",      color: "#FF0000", position: "top",    animation: "glitch",        startFrame: 0,   endFrame: 90  },
      { text: "No excuses.\nLife got messy.",                             font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",          startFrame: 90,  endFrame: 240 },
      { text: "What it cost me:\nViews dropped 60%",                     font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left",    startFrame: 240, endFrame: 390 },
      { text: "Algorithm forgot me\nin less than 72hrs",                  font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-right",   startFrame: 390, endFrame: 540 },
      { text: "But I'm back.\nDay 29. No reset.",                        font: "Montserrat", color: "#00FF00", position: "middle", animation: "fade",          startFrame: 540, endFrame: 690 },
      { text: "Lesson: Consistency\nisn't optional. It's the product.",  font: "Montserrat", color: "#FFD700", position: "middle", animation: "word-highlight", startFrame: 690, endFrame: 810 },
      { text: "Drop 💪 if you've\nalso had a rough week",                font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",        startFrame: 810, endFrame: 840 },
    ]
  },

  day30: {
    music: "day30.mp3", // VIBE: Milestone/hype — upbeat motivational, trap or pop
    overlays: [
      { text: "30 days of posting.\nHere are my REAL numbers 📊",        font: "Anton",      color: "#FFD700", position: "top",    animation: "pop",           startFrame: 0,   endFrame: 90  },
      { text: "TikTok: 15 followers\n322 top video views",               font: "Montserrat", color: "#00FFFF", position: "middle", animation: "counter",       startFrame: 90,  endFrame: 240 },
      { text: "YouTube: 3 subs\n777 top Short views",                    font: "Montserrat", color: "#FF0000", position: "middle", animation: "counter",       startFrame: 240, endFrame: 390 },
      { text: "Income so far: $0\nAnd I'm okay with that 💯",            font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",          startFrame: 390, endFrame: 540 },
      { text: "What I learned:\nReps > results at Day 30",               font: "Montserrat", color: "#00FF00", position: "middle", animation: "word-highlight", startFrame: 540, endFrame: 690 },
      { text: "By Day 90:\n60 days of extra reps 💪",                    font: "Montserrat", color: "#FFD700", position: "middle", animation: "fade",          startFrame: 690, endFrame: 810 },
      { text: "What day are YOU on?\nDrop it below 👇",                  font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",        startFrame: 810, endFrame: 840 },
    ]
  },

  day31: {
    music: "day31.mp3", // VIBE: Punchy/assertive — hip-hop, boom-bap or drill
    overlays: [
      { text: "3 affiliate myths\nthat kept me broke 🚫",                font: "Anton",      color: "#FF0000", position: "top",    animation: "glitch",        startFrame: 0,   endFrame: 90  },
      { text: "Myth 1: You need\na big following first",                 font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left",    startFrame: 90,  endFrame: 270 },
      { text: "Truth: 100 engaged beats\n100K scrollers every time",     font: "Montserrat", color: "#00FF00", position: "middle", animation: "word-highlight", startFrame: 270, endFrame: 390 },
      { text: "Myth 2: Pick the\nhighest paying product",                font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-right",   startFrame: 390, endFrame: 570 },
      { text: "Truth: Pick the product\nyou'd actually buy 🎯",          font: "Montserrat", color: "#00FF00", position: "middle", animation: "word-highlight", startFrame: 570, endFrame: 690 },
      { text: "Myth 3: Quality > consistency\nis the biggest lie.",      font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left",    startFrame: 690, endFrame: 810 },
      { text: "Which myth fooled YOU?\n1, 2, or 3? 👇",                 font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",        startFrame: 810, endFrame: 840 },
    ]
  },

  day32: {
    music: "day32.mp3", // VIBE: Techy/minimal — electronic, synth or future bass
    overlays: [
      { text: "This free tool tells you\nexactly what to post 🔥",       font: "Anton",      color: "#0066FF", position: "top",    animation: "glitch",        startFrame: 0,   endFrame: 90  },
      { text: "Most creators are guessing.\nYou don't have to.",         font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",          startFrame: 90,  endFrame: 240 },
      { text: "The tool: TikTok\nCreative Center",                       font: "Montserrat", color: "#FFD700", position: "middle", animation: "typewriter",    startFrame: 240, endFrame: 420 },
      { text: "Step 1: Search your niche\nunder Trending Hashtags",      font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-left",    startFrame: 420, endFrame: 570 },
      { text: "Step 2: See what's\nperforming last 7 days",              font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-right",   startFrame: 570, endFrame: 690 },
      { text: "Step 3: Model the FORMAT.\nNot the content.",             font: "Montserrat", color: "#FF6600", position: "middle", animation: "word-highlight", startFrame: 690, endFrame: 810 },
      { text: "Reply TOOL and I'll\nsend you the direct link 📩",        font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",        startFrame: 810, endFrame: 840 },
    ]
  },

  day33: {
    music: "day33.mp3", // VIBE: Chill/productive — lo-fi, study beats or ambient
    overlays: [
      { text: "One video. 90 minutes.\nHere's every step ⏱️",           font: "Anton",      color: "#0066FF", position: "top",    animation: "pop",           startFrame: 0,   endFrame: 90  },
      { text: "0:00 — Topic + hook\nwritten in 5 mins",                  font: "Montserrat", color: "#FFFF00", position: "middle", animation: "typewriter",    startFrame: 90,  endFrame: 240 },
      { text: "0:05 — 4 clips downloaded\nfrom Pexels (free)",           font: "Montserrat", color: "#FFFF00", position: "middle", animation: "typewriter",    startFrame: 240, endFrame: 390 },
      { text: "0:25 — Full CapCut edit:\ntext, audio, transitions",      font: "Montserrat", color: "#FFFF00", position: "middle", animation: "typewriter",    startFrame: 390, endFrame: 540 },
      { text: "1:15 — Watch it 3 times.\nNo exceptions. 👀",             font: "Montserrat", color: "#FF6600", position: "middle", animation: "word-highlight", startFrame: 540, endFrame: 690 },
      { text: "1:25 — Export + upload\nready for 9 PM ✅",               font: "Montserrat", color: "#00FF00", position: "middle", animation: "fade",          startFrame: 690, endFrame: 810 },
      { text: "How long does YOUR\nvideo take? Drop it 👇",              font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",        startFrame: 810, endFrame: 840 },
    ]
  },

  day34: {
    music: "day34.mp3", // VIBE: Bold/controversial — hard trap, cinematic or tense
    overlays: [
      { text: "Hot take:\nClickBank is NOT for beginners 🔥",            font: "Anton",      color: "#FF0000", position: "top",    animation: "glitch",        startFrame: 0,   endFrame: 120 },
      { text: "Everyone starts there.\nMost quit there.",                font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",          startFrame: 120, endFrame: 270 },
      { text: "Problem: High refund rates\n= commissions disappear",     font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left",    startFrame: 270, endFrame: 450 },
      { text: "Better for beginners:\nAmazon Associates or Digistore24", font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-right",   startFrame: 450, endFrame: 600 },
      { text: "Once you understand\nthe game? THEN hit ClickBank.",      font: "Montserrat", color: "#FFD700", position: "middle", animation: "word-highlight", startFrame: 600, endFrame: 750 },
      { text: "Agree or disagree?\nBe brutally honest 👇",              font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",        startFrame: 750, endFrame: 840 },
    ]
  },

  day35: {
    music: "day35.mp3", // VIBE: Reflective/closing — soft piano, cinematic or indie
    overlays: [
      { text: "Week 5 done.\nHere's what ACTUALLY worked 📋",           font: "Anton",      color: "#FFD700", position: "top",    animation: "pop",           startFrame: 0,   endFrame: 90  },
      { text: "Best move: Acknowledging\nthe 7-day gap honestly",       font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-right",   startFrame: 90,  endFrame: 240 },
      { text: "Biggest lesson:\nConsistency is rent. Pay it daily.",    font: "Montserrat", color: "#FF6600", position: "middle", animation: "word-highlight", startFrame: 240, endFrame: 420 },
      { text: "What surprised me:\nHonest content gets more saves",     font: "Montserrat", color: "#00FFFF", position: "middle", animation: "slide-left",    startFrame: 420, endFrame: 560 },
      { text: "Week 6 focus:\nFirst affiliate link click.",             font: "Montserrat", color: "#FFD700", position: "middle", animation: "word-highlight", startFrame: 560, endFrame: 690 },
      { text: "55 more days.\nStill building. Still here. 💪",          font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",          startFrame: 690, endFrame: 810 },
      { text: "Drop 🔥 if you're\nstill on your journey",               font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",        startFrame: 810, endFrame: 840 },
    ]
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LAYER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Layer: Film Grain (animated SVG noise — cinematic texture) ──
const FilmGrain = () => {
  const frame = useCurrentFrame();
  // Shift turbulence seed every 3 frames for grain animation
  const seed = Math.floor(frame / 3) % 20;
  return (
    <AbsoluteFill style={{ zIndex: 2, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.055 }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ── Layer: Scanlines (VHS horizontal line texture) ──
const Scanlines = () => (
  <AbsoluteFill style={{ zIndex: 3, pointerEvents: 'none' }}>
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="scanlines" x="0" y="0" width="100%" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100%" height="1" fill="rgba(0,0,0,0.1)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scanlines)" />
    </svg>
  </AbsoluteFill>
);

// ── Layer: Vignette (dark edges → eye to center) ──
const Vignette = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 80%, rgba(0,0,0,0.92) 100%)',
    pointerEvents: 'none',
    zIndex: 4,
  }} />
);

// ── Layer: Cinematic Color Grade (gradient — heavier at edges, light center) ──
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

// ── Layer: Old Film Flicker (subtle brightness variation) ──
const FilmFlicker = () => {
  const frame = useCurrentFrame();
  // Deterministic flicker — only fires on specific frame intervals
  const flickerFrames = [8, 23, 47, 71, 112, 156, 203, 267, 334, 401, 478, 556, 623, 712, 789, 856];
  const isFlicker = flickerFrames.includes(frame);
  const brightness = isFlicker ? 0.94 : 1.0;
  if (brightness === 1.0) return null;
  return (
    <AbsoluteFill style={{
      background: 'rgba(0,0,0,0.06)',
      pointerEvents: 'none',
      zIndex: 6,
    }} />
  );
};

// ── Layer: Corner Accent Marks (viewfinder brackets) ──
const CornerBrackets = ({ videoId }) => {
  const frame = useCurrentFrame();
  const grade = COLOR_GRADES[videoId] || COLOR_GRADES.day29;
  const opacity = interpolate(frame, [0, 20], [0, 0.65],
    { extrapolateRight: 'clamp' });
  const size = 48;
  const thickness = 2.5;
  const offset = 28;
  const color = grade.accent;
  const bracketStyle = { position: 'absolute', width: size, height: size };
  const lineH = { position: 'absolute', height: thickness, background: color, borderRadius: 1 };
  const lineV = { position: 'absolute', width: thickness, background: color, borderRadius: 1 };

  return (
    <AbsoluteFill style={{ zIndex: 7, pointerEvents: 'none', opacity }}>
      {/* Top-left */}
      <div style={{ ...bracketStyle, top: offset, left: offset }}>
        <div style={{ ...lineH, top: 0, left: 0, width: size }} />
        <div style={{ ...lineV, top: 0, left: 0, height: size }} />
      </div>
      {/* Top-right */}
      <div style={{ ...bracketStyle, top: offset, right: offset }}>
        <div style={{ ...lineH, top: 0, right: 0, width: size }} />
        <div style={{ ...lineV, top: 0, right: 0, height: size }} />
      </div>
      {/* Bottom-left */}
      <div style={{ ...bracketStyle, bottom: offset, left: offset }}>
        <div style={{ ...lineH, bottom: 0, left: 0, width: size }} />
        <div style={{ ...lineV, bottom: 0, left: 0, height: size }} />
      </div>
      {/* Bottom-right */}
      <div style={{ ...bracketStyle, bottom: offset, right: offset }}>
        <div style={{ ...lineH, bottom: 0, right: 0, width: size }} />
        <div style={{ ...lineV, bottom: 0, right: 0, height: size }} />
      </div>
    </AbsoluteFill>
  );
};

// ── Layer: Animated Glow Border (pulsing edge around full frame) ──
const GlowBorder = ({ videoId }) => {
  const frame = useCurrentFrame();
  const borderColor = BORDER_COLORS[videoId] || BORDER_COLORS.day29;
  // Pulse between 0.5 and 1.0 opacity
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.5, 1.0]);
  const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' }) * pulse;
  return (
    <AbsoluteFill style={{
      zIndex: 8, pointerEvents: 'none', opacity,
      boxShadow: `inset 0 0 40px ${borderColor}, inset 0 0 80px ${borderColor}55`,
    }} />
  );
};

// ── Layer: Letterbox Bars (cinematic bars slide in at start, exit by frame 35) ──
const LetterboxBars = () => {
  const frame = useCurrentFrame();
  const barH = interpolate(frame, [0, 8, 28, 35], [88, 88, 88, 0],
    { extrapolateRight: 'clamp' });
  if (barH <= 0) return null;
  return (
    <AbsoluteFill style={{ zIndex: 16, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
        height: barH, background: '#000000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        height: barH, background: '#000000' }} />
    </AbsoluteFill>
  );
};

// ── Layer: Shockwave Ring (expands from center on hook entry frame 0–18) ──
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

// ── Layer: Progress Bar (color-matched per day, glowing) ──
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

// ── Layer: Day Badge (top-left — slides in from left) ──
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

// ── Layer: Outro CTA End Card (slides up at frame 840) ──
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
  // Pulse border glow on outro
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
          textTransform: 'uppercase', marginBottom: '8px',
          opacity: 0.9,
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPOSITION — 17 Layers
// ─────────────────────────────────────────────────────────────────────────────
export const VideoComposition = ({ videoId }) => {
  const data = VIDEO_DATA[videoId] || VIDEO_DATA.day29;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>

      {/* Layer  1: Background video clips (Ken Burns + flash transitions) */}
      <BackgroundVideo videoId={videoId} />

      {/* Layer  2: Base dark overlay — baseline text legibility */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.18)', zIndex: 0 }} />

      {/* Layer  3: Cinematic color grade — gradient tint per day */}
      <ColorGrade videoId={videoId} />

      {/* Layer  4: Vignette — dark edges, bright center focus */}
      <Vignette />

      {/* Layer  5: Old film flicker — subtle brightness variation */}
      <FilmFlicker />

      {/* Layer  6: Film grain — animated noise texture over every frame */}
      <FilmGrain />

      {/* Layer  7: Scanlines — subtle VHS horizontal line texture */}
      <Scanlines />

      {/* Layer  8: Corner brackets — viewfinder accent marks */}
      <CornerBrackets videoId={videoId} />

      {/* Layer  9: Animated glow border — pulsing edge per day color */}
      <GlowBorder videoId={videoId} />

      {/* Layer 10: Audio — fade in/out, per-day mood track */}
      <AudioTrack music={data.music} volume={0.25} />

      {/* Layer 11: Letterbox bars — cinematic 2.35:1 feel at start */}
      <LetterboxBars />

      {/* Layer 12: Shockwave ring — expanding circle on hook entry */}
      <ShockwaveRing />

      {/* Layer 13: Day counter badge — DAY XX/90 top-left */}
      <DayBadge videoId={videoId} />

      {/* Layer 14: Text overlays — all animations from TextOverlay.jsx */}
      {data.overlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={overlay.startFrame}
          durationInFrames={overlay.endFrame - overlay.startFrame}
        >
          <TextOverlay overlay={overlay} />
        </Sequence>
      ))}

      {/* Layer 15: Animated watermark — fades in, exits before outro */}
      <Watermark />

      {/* Layer 16: Outro CTA end card — last 60 frames */}
      <OutroCard videoId={videoId} />

      {/* Layer 17: Progress bar — always on top, color-matched gradient */}
      <ProgressBar videoId={videoId} />

    </AbsoluteFill>
  );
};
