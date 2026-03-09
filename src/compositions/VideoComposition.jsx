import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { BackgroundVideo } from '../components/BackgroundVideo.jsx';
import { TextOverlay } from '../components/TextOverlay.jsx';
import { AudioTrack } from '../components/AudioTrack.jsx';

// ─────────────────────────────────────────────
// AUDIO — Each video has its own track
// Every Sunday (~30 mins):
// 1. Go to ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en
//    → Trends → Songs → Popular tab → Region: United States → 7 days
// 2. Pick a track matching each video's VIBE (see comments)
// 3. Download via yt1s.com → rename exactly as below
// 4. Upload all 7 to public/music/ in GitHub repo
// 5. Commit → render workflow uses them automatically
// ─────────────────────────────────────────────

// ── Per-day cinematic color grade ──
const COLOR_GRADES = {
  day29: 'rgba(60, 0, 0, 0.18)',    // Deep red — comeback/emotional
  day30: 'rgba(0, 40, 80, 0.18)',   // Electric blue — milestone/data
  day31: 'rgba(60, 20, 0, 0.18)',   // Amber fire — punchy/assertive
  day32: 'rgba(0, 20, 60, 0.20)',   // Techy blue — digital/electronic
  day33: 'rgba(0, 30, 20, 0.18)',   // Muted green — chill/productive
  day34: 'rgba(40, 0, 60, 0.20)',   // Dark purple — bold/tense
  day35: 'rgba(0, 20, 40, 0.18)',   // Midnight blue — reflective/closing
};

// ── Per-day progress bar color themes ──
const GRADE_COLORS = {
  day29: ['#FF0000', '#FF6600', '#FFD700'],
  day30: ['#0066FF', '#00CCFF', '#FFD700'],
  day31: ['#FF6600', '#FF0000', '#FFD700'],
  day32: ['#0033FF', '#00FFFF', '#FFFFFF'],
  day33: ['#00AA44', '#00FF88', '#FFD700'],
  day34: ['#9900FF', '#FF0066', '#FF6600'],
  day35: ['#003399', '#0066FF', '#00CCFF'],
};

// ── Full content & overlay data for Week 5 ──
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
      { text: "TikTok: 15 followers\n322 top video views",               font: "Montserrat", color: "#00FFFF", position: "middle", animation: "slide-left",    startFrame: 90,  endFrame: 240 },
      { text: "YouTube: 3 subs\n777 top Short views",                    font: "Montserrat", color: "#FF0000", position: "middle", animation: "slide-right",   startFrame: 240, endFrame: 390 },
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

// ─────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────

// ── Progress Bar (color-matched per day) ──
const ProgressBar = ({ videoId }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const colors = GRADE_COLORS[videoId] || GRADE_COLORS.day29;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '5px',
      backgroundColor: 'rgba(255,255,255,0.12)',
      zIndex: 20,
    }}>
      <div style={{
        height: '100%',
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        borderRadius: '0 3px 3px 0',
        boxShadow: `0 0 10px ${colors[1]}AA`,
      }} />
    </div>
  );
};

// ── Vignette (dark edges → eye to center) ──
const Vignette = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.78) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  }} />
);

// ── Animated Watermark (slides in at frame 10, fades before outro) ──
const Watermark = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ fps, frame: Math.max(0, frame - 10), config: { damping: 14, stiffness: 160 } });
  const fadeIn = interpolate(s, [0, 1], [0, 0.85]);
  const fadeOut = interpolate(frame, [durationInFrames - 80, durationInFrames - 60], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opacity = fadeIn * fadeOut;
  const translateY = interpolate(s, [0, 1], [14, 0]);

  return (
    <AbsoluteFill style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      padding: '0 40px 52px 0',
      zIndex: 8,
      pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '26px',
        color: '#FFFFFF',
        fontWeight: 'bold',
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: '0 2px 10px rgba(0,0,0,0.9)',
      }}>
        @DailyWealthBuilding
      </div>
    </AbsoluteFill>
  );
};

// ── Day Badge (top-left — slides in from left at frame 5) ──
const DayBadge = ({ videoId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dayNum = parseInt(videoId.replace('day', ''), 10);
  const s = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 14, stiffness: 180 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-70, 0]);

  return (
    <AbsoluteFill style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: '62px 0 0 40px',
      zIndex: 9,
      pointerEvents: 'none',
    }}>
      <div style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        background: 'rgba(0,0,0,0.72)',
        borderRadius: '14px',
        padding: '8px 18px',
        display: 'flex',
        alignItems: 'baseline',
        gap: '3px',
        border: '1px solid rgba(255,215,0,0.35)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
      }}>
        <span style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '30px',
          color: '#FFD700',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>DAY {dayNum}</span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '16px',
          color: 'rgba(255,255,255,0.6)',
          fontWeight: '700',
        }}>/90</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Outro / CTA End Card (slides up at frame 840, lasts until 900) ──
const OutroCard = ({ videoId }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const outroStart = durationInFrames - 60; // frame 840
  const outroFrame = Math.max(0, frame - outroStart);
  const dayNum = parseInt(videoId.replace('day', ''), 10);
  const s = spring({ fps, frame: outroFrame, config: { damping: 16, stiffness: 140 } });
  const translateY = interpolate(s, [0, 1], [130, 0]);
  const opacity = frame >= outroStart ? interpolate(s, [0, 1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '0 0 90px 0',
      zIndex: 15,
      pointerEvents: 'none',
    }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.93) 0%, rgba(10,10,35,0.96) 100%)',
        borderRadius: '24px',
        padding: '26px 52px',
        textAlign: 'center',
        border: '1px solid rgba(255,215,0,0.35)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)',
        minWidth: '620px',
      }}>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px',
          color: '#FFD700',
          letterSpacing: '4px',
          fontWeight: '800',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>Follow For Daily Videos</div>
        <div style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '38px',
          color: '#FFFFFF',
          textShadow: '0 2px 14px rgba(0,0,0,0.8)',
          marginBottom: '10px',
          letterSpacing: '1px',
        }}>@DailyWealthBuilding</div>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
          fontWeight: '600',
          letterSpacing: '1.5px',
        }}>90-Day Public Challenge · Day {dayNum} of 90</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────
export const VideoComposition = ({ videoId }) => {
  const data = VIDEO_DATA[videoId] || VIDEO_DATA.day29;
  const colorGrade = COLOR_GRADES[videoId] || COLOR_GRADES.day29;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>

      {/* Layer 1: Background video clips (Ken Burns + flash transitions) */}
      <BackgroundVideo videoId={videoId} />

      {/* Layer 2: Base dark overlay for text legibility */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 0 }} />

      {/* Layer 3: Cinematic color grade — unique mood tint per day */}
      <AbsoluteFill style={{
        backgroundColor: colorGrade,
        zIndex: 0,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }} />

      {/* Layer 4: Vignette — dark edges push eyes to center */}
      <Vignette />

      {/* Layer 5: Audio (fade in/out per day track) */}
      <AudioTrack music={data.music} volume={0.25} />

      {/* Layer 6: Day counter badge — top left */}
      <DayBadge videoId={videoId} />

      {/* Layer 7: Text overlays */}
      {data.overlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={overlay.startFrame}
          durationInFrames={overlay.endFrame - overlay.startFrame}
        >
          <TextOverlay overlay={overlay} />
        </Sequence>
      ))}

      {/* Layer 8: Animated watermark — fades in, fades out before outro */}
      <Watermark />

      {/* Layer 9: Outro CTA end card — last 60 frames */}
      <OutroCard videoId={videoId} />

      {/* Layer 10: Progress bar — always on top */}
      <ProgressBar videoId={videoId} />

    </AbsoluteFill>
  );
};
