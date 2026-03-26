// src/components/SpecialOverlays.jsx — DWB Composition Layouts v1.1 FIXED
// Fixes applied:
//   - Rebuilt all eaten JSX returns: CountdownIntro, StatsDashboard, DataInfoCard,
//     DataBarChart, TerminalWindow, LowerThird, SceneNumber, CornerTimestamp
//   - Fixed eaten comparison operators (< > <= >=) in guard clauses

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// COUNTDOWN INTRO — 3-2-1 before hook
// ─────────────────────────────────────────────────────────────────────────────
export const CountdownIntro = ({ accentColor = '#FFD700', onComplete }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const STEP = 15;
  const TOTAL = STEP * 3;
  if (frame >= TOTAL) return null;

  const currentNum = 3 - Math.floor(frame / STEP);
  const localFrame = frame % STEP;

  const s = spring({ fps, frame: localFrame, config: { damping: 8, stiffness: 300, mass: 0.7 } });
  const scale = interpolate(s, [0, 1], [2.2, 1]);
  const opacity = interpolate(localFrame, [STEP - 5, STEP], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: "'Anton', sans-serif",
        fontSize: '180px',
        fontWeight: 'bold',
        color: accentColor,
        textShadow: `0 0 40px ${accentColor}, 0 4px 20px rgba(0,0,0,0.9)`,
        transform: `scale(${scale})`,
        opacity,
        lineHeight: 1,
      }}>{currentNum}</div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS DASHBOARD — 3-stat mini grid overlay
// Perfect for milestone days (Day 30, 40, 60, 90)
// ─────────────────────────────────────────────────────────────────────────────
export const StatsDashboard = ({
  stats = [],
  accentColor = '#FFD700',
  startFrame = 90,
  endFrame = 450,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || localFrame > endFrame + 10) return null;

  const slideY = interpolate(localFrame, [0, 14], [60, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: '12%', left: '6%', right: '6%',
        display: 'flex', flexDirection: 'column', gap: '10px',
        transform: `translateY(${slideY}px)`,
        opacity,
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px', letterSpacing: '0.3em',
          color: accentColor, marginBottom: '4px',
          textTransform: 'uppercase',
        }}>⬡ CHANNEL STATS</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {stats.map((stat, i) => {
            const countProgress = interpolate(localFrame - i * 8, [0, 50], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
            const displayValue = typeof stat.value === 'number'
              ? Math.round(stat.value * countProgress).toLocaleString()
              : stat.value;
            return (
              <div key={i} style={{
                flex: 1,
                background: 'rgba(0,0,0,0.75)',
                border: `1px solid ${accentColor}40`,
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: '36px',
                  color: accentColor,
                  lineHeight: 1,
                  letterSpacing: '0.04em',
                  textShadow: `0 0 16px ${accentColor}60`,
                }}>{(stat.prefix || '') + displayValue + (stat.suffix || '')}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px', letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: '4px', textTransform: 'uppercase',
                }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA INFO CARD — pill card floats in with data point
// ─────────────────────────────────────────────────────────────────────────────
export const DataInfoCard = ({
  label = '',
  value = '',
  accentColor = '#FFD700',
  startFrame = 0,
  endFrame = 120,
  position = 'bottom-right',
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || localFrame > endFrame + 10) return null;

  const slideY = interpolate(localFrame, [0, 12], [40, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  const positionStyles = {
    'bottom-right': { bottom: '18%', right: '6%' },
    'bottom-left':  { bottom: '18%', left: '6%' },
    'top-right':    { top: '18%', right: '6%' },
    'top-left':     { top: '18%', left: '6%' },
    'center':       { top: '50%', left: '50%', transform: `translateX(-50%) translateY(calc(-50% + ${slideY}px))` },
  };

  const pos = positionStyles[position] || positionStyles['bottom-right'];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', ...pos,
        transform: pos.transform || `translateY(${slideY}px)`,
        opacity,
        background: 'rgba(0,0,0,0.8)',
        border: `1px solid ${accentColor}60`,
        borderRadius: '24px',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: '10px',
        boxShadow: `0 0 20px ${accentColor}30`,
      }}>
        <div style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '28px', color: accentColor,
          letterSpacing: '0.04em', lineHeight: 1,
          textShadow: `0 0 12px ${accentColor}60`,
        }}>{value}</div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px', letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.65)',
          textTransform: 'uppercase', maxWidth: '80px', lineHeight: 1.3,
        }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TIKTOK NOTIFICATION — platform-style notification popup
// ─────────────────────────────────────────────────────────────────────────────
export const TikTokNotification = ({
  message = 'Follow for daily wealth tips',
  icon = '🔔',
  startFrame = 0,
  endFrame = 90,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || localFrame > endFrame + 10) return null;

  const slideX = interpolate(localFrame, [0, 14], [-300, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: '15%', left: '5%',
        transform: `translateX(${slideX}px)`, opacity,
        background: 'rgba(20,20,20,0.92)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: '12px',
        maxWidth: '75%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.8)',
      }}>
        <div style={{ fontSize: '24px', flexShrink: 0 }}>{icon}</div>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '14px', fontWeight: '600',
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.3,
        }}>{message}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA BAR CHART — animated bar chart, bars grow from 0
// ─────────────────────────────────────────────────────────────────────────────
export const DataBarChart = ({
  bars = [],
  title = '',
  startFrame = 0,
  endFrame = 150,
  maxValue,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || localFrame > endFrame + 10) return null;

  const max = maxValue || Math.max(...bars.map(b => b.value), 1);
  const opacity = Math.min(
    interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: '20%', left: '8%', right: '8%',
        opacity,
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        {title && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', letterSpacing: '0.25em',
            color: '#FFD700', marginBottom: '16px',
            textTransform: 'uppercase',
          }}>{title}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '100px' }}>
          {bars.map((bar, i) => {
            const barDelay = i * 6;
            const barProgress = interpolate(localFrame - barDelay,
              [0, Math.max(totalFrames - 30, 20)], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
            const barHeight = (bar.value / max) * 100 * barProgress;

            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: '14px', color: bar.color || '#FFD700',
                  letterSpacing: '0.04em',
                }}>{Math.round(bar.value * barProgress)}</div>
                <div style={{
                  width: '100%',
                  height: barHeight + 'px',
                  background: bar.color || '#FFD700',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: `0 0 12px ${bar.color || '#FFD700'}60`,
                  minHeight: '2px',
                }} />
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px', color: 'rgba(255,255,255,0.6)',
                  textAlign: 'center', letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>{bar.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TERMINAL WINDOW — code editor overlay
// ─────────────────────────────────────────────────────────────────────────────
export const TerminalWindow = ({
  lines = [],
  title = 'terminal',
  startFrame = 0,
  endFrame = 180,
  accentColor = '#00FF88',
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || localFrame > endFrame + 10) return null;

  const CHARS_PER_FRAME = 2;
  const allText = lines.join('\n');
  const charsToShow = Math.min(
    Math.floor(localFrame * CHARS_PER_FRAME),
    allText.length
  );
  const visibleText = allText.slice(0, charsToShow);
  const showCursor = charsToShow < allText.length;

  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );
  const slideY = interpolate(localFrame, [0, 12], [30, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: '20%', left: '6%', right: '6%',
        transform: `translateY(${slideY}px)`,
        opacity,
      }}>
        {/* Title bar */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '8px 8px 0 0',
          padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          {['#FF5F56', '#FFBD2E', '#27C93F'].map((c, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
          ))}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: 'rgba(255,255,255,0.5)',
            marginLeft: '8px', letterSpacing: '0.1em',
          }}>{title}</div>
        </div>
        {/* Content */}
        <div style={{
          background: 'rgba(10,14,18,0.92)',
          border: `1px solid ${accentColor}30`,
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '16px 18px',
          minHeight: '80px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '13px', lineHeight: 1.6,
          color: accentColor,
          whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>$ </span>
          {visibleText}
          {showCursor && <span style={{ opacity: Math.round(localFrame / 8) % 2 === 0 ? 1 : 0 }}>█</span>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOWER THIRD — broadcast news nameplate
// ─────────────────────────────────────────────────────────────────────────────
export const LowerThird = ({
  handle = '@DailyWealthBuilding',
  label = 'Affiliate Marketing Journey',
  accentColor = '#FFD700',
  startFrame = 10,
  endFrame = 120,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || localFrame > endFrame + 10) return null;

  const slideX = interpolate(localFrame, [0, 14], [-400, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        bottom: '14%', left: 0,
        transform: `translateX(${slideX}px)`,
        opacity,
        display: 'flex', alignItems: 'stretch',
      }}>
        {/* Accent bar */}
        <div style={{ width: '4px', background: accentColor, flexShrink: 0 }} />
        {/* Text block */}
        <div style={{
          background: 'rgba(0,0,0,0.82)',
          padding: '10px 18px',
        }}>
          <div style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '22px', color: accentColor,
            letterSpacing: '0.06em', lineHeight: 1.15,
            textShadow: `0 0 12px ${accentColor}60`,
          }}>{handle}</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px', color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.14em', marginTop: '2px',
            textTransform: 'uppercase',
          }}>{label}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE NUMBER — 01/07 documentary indicator
// ─────────────────────────────────────────────────────────────────────────────
export const SceneNumber = ({
  current = 1,
  total = 7,
  startFrame = 0,
  endFrame = 900,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || frame > endFrame) return null;

  const opacity = interpolate(localFrame, [0, 15], [0, 0.7],
    { extrapolateRight: 'clamp' });

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        bottom: '5%', right: '5%',
        opacity,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '14px', letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.6)',
      }}>
        {pad(current)}/{pad(total)}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CORNER TIMESTAMP — documentary authenticity
// ─────────────────────────────────────────────────────────────────────────────
export const CornerTimestamp = ({
  startFrame = 0,
  endFrame = 900,
  label = '',
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || frame > endFrame) return null;

  const opacity = interpolate(localFrame, [0, 20], [0, 0.6],
    { extrapolateRight: 'clamp' });
  const secs = Math.floor(localFrame / 30);
  const frac = String(localFrame % 30).padStart(2, '0');
  const timeStr = label || ('00:' + String(secs).padStart(2, '0') + ':' + frac);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: '5%', left: '5%',
        opacity,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '14px', letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.55)',
      }}>
        {timeStr}
      </div>
    </AbsoluteFill>
  );
};
