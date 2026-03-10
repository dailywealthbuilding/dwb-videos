// ─────────────────────────────────────────────────────────────────────────────
// src/components/SpecialOverlays.jsx — DWB Composition Layouts v1.0
//
// Components:
//   <CountdownIntro />          — 3-2-1 spring countdown before hook
//   <StatsDashboard stats={[]} />  — 3-stat mini grid (Day 30 reveal)
//   <FloatingInfoCard />        — pill card floats in with data point
//   <BeforeAfterSplit />        — vertical split reveal left/right
//   <SocialProofPopup />        — TikTok-style notification popup
//   <DataBarChart bars={[]} />  — animated bar chart comparison
//   <TerminalWindow />          — code terminal overlay
//   <LowerThird />              — broadcast lower third nameplate
//   <SceneNumber />             — scene progress indicator
//   <CornerTimestamp />         — documentary corner timestamp
//
// All components accept: startFrame, endFrame, and component-specific props
// Use via overlay.animation field or wire directly in VideoComposition
// ─────────────────────────────────────────────────────────────────────────────

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// COUNTDOWN INTRO — 3-2-1 before hook
// Proven retention: builds tension, primes viewer for impact
// ─────────────────────────────────────────────────────────────────────────────
export const CountdownIntro = ({ accentColor = '#FFD700', onComplete }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each number gets 15 frames
  const STEP = 15;
  const TOTAL = STEP * 3; // 45 frames total
  if (frame >= TOTAL) return null;

  const currentNum = 3 - Math.floor(frame / STEP);
  const localFrame = frame % STEP;

  const s = spring({ fps, frame: localFrame, config: { damping: 8, stiffness: 300, mass: 0.7 } });
  const scale = interpolate(s, [0, 1], [2.2, 1]);
  const opacity = interpolate(localFrame, [STEP - 5, STEP], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      zIndex: 30, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.45)',
    }}>
      <div style={{
        fontFamily: "'Anton', sans-serif",
        fontSize: '220px',
        color: accentColor,
        opacity,
        transform: `scale(${scale})`,
        textShadow: `0 0 40px ${accentColor}80, 0 0 80px ${accentColor}40, 0 4px 0 rgba(0,0,0,1)`,
        lineHeight: 1,
        letterSpacing: '-4px',
      }}>
        {currentNum}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS DASHBOARD — 3-stat mini grid overlay
// Perfect for milestone days (Day 30, 40, 60, 90)
//
// stats = [
//   { label: 'TikTok Followers', value: 15, suffix: '' },
//   { label: 'Top Video Views', value: 322, suffix: '' },
//   { label: 'Income', value: 0, prefix: '$' },
// ]
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

  if (localFrame < 0 || frame > endFrame + 10) return null;

  const slideY = interpolate(localFrame, [0, 14], [60, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{
      zIndex: 22, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 30px',
      opacity,
      transform: `translateY(${slideY}px)`,
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        width: '100%',
      }}>
        {stats.map((stat, i) => {
          const statDelay = i * 8;
          const statLocalFrame = localFrame - statDelay;
          const progress = interpolate(statLocalFrame, [0, Math.max(totalFrames - 40, 20)], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          const current = Math.round(progress * (stat.value || 0));

          return (
            <div key={i} style={{
              flex: 1,
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${accentColor}40`,
              borderRadius: '10px',
              padding: '14px 10px',
              textAlign: 'center',
              boxShadow: `0 0 20px rgba(0,0,0,0.6), inset 0 1px 0 ${accentColor}20`,
            }}>
              <div style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '42px',
                color: accentColor,
                lineHeight: 1,
                textShadow: `0 0 20px ${accentColor}60`,
                letterSpacing: '-1px',
              }}>
                {stat.prefix || ''}{current.toLocaleString()}{stat.suffix || ''}
              </div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: '700',
                letterSpacing: '0.5px',
                marginTop: '4px',
                textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING INFO CARD — pill card floats in with supporting data
// ─────────────────────────────────────────────────────────────────────────────
export const FloatingInfoCard = ({
  icon = '📊',
  text = '',
  accentColor = '#FFD700',
  side = 'left',        // 'left' | 'right'
  yPosition = '35%',
  startFrame = 0,
  endFrame = 90,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || frame > endFrame + 10) return null;

  const fromX = side === 'left' ? -260 : 260;
  const translateX = interpolate(localFrame, [0, 14], [fromX, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ zIndex: 21, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: yPosition,
        [side]: '20px',
        transform: `translateX(${translateX}px)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,0,0,0.80)',
        border: `1.5px solid ${accentColor}55`,
        borderRadius: '100px',
        padding: '10px 18px 10px 14px',
        boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 16px ${accentColor}20`,
        backdropFilter: 'blur(10px)',
        maxWidth: '280px',
      }}>
        <span style={{ fontSize: '20px', lineHeight: 1 }}>{icon}</span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px',
          fontWeight: '800',
          color: '#FFFFFF',
          lineHeight: 1.3,
        }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEFORE / AFTER SPLIT REVEAL
// Vertical divider sweeps across — perfect for myth-busting content
//
// leftText  = "BEFORE" or wrong state
// rightText = "AFTER" or correct state
// ─────────────────────────────────────────────────────────────────────────────
export const BeforeAfterSplit = ({
  leftLabel  = 'BEFORE',
  rightLabel = 'AFTER',
  leftText   = '',
  rightText  = '',
  startFrame = 0,
  endFrame   = 150,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || frame > endFrame + 10) return null;

  // Divider sweeps from center to full split
  const dividerProgress = interpolate(localFrame, [0, 20], [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  const leftOpacity = Math.min(
    interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );
  const rightOpacity = Math.min(
    interpolate(localFrame, [8, 22], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ zIndex: 22, pointerEvents: 'none' }}>
      {/* Left panel — BEFORE (red tint) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, right: '50%',
        background: 'rgba(220,0,0,0.18)',
        opacity: leftOpacity,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}>
        <div style={{
          fontFamily: "'Anton', sans-serif", fontSize: '28px',
          color: '#FF4444', letterSpacing: '2px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          marginBottom: '12px',
        }}>{leftLabel}</div>
        {leftText && (
          <div style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '18px',
            color: '#FFFFFF', fontWeight: '700', textAlign: 'center',
            lineHeight: 1.3, textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}>{leftText}</div>
        )}
      </div>

      {/* Right panel — AFTER (green tint) */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', bottom: 0, right: 0,
        background: 'rgba(0,200,80,0.18)',
        opacity: rightOpacity,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}>
        <div style={{
          fontFamily: "'Anton', sans-serif", fontSize: '28px',
          color: '#00FF88', letterSpacing: '2px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          marginBottom: '12px',
        }}>{rightLabel}</div>
        {rightText && (
          <div style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '18px',
            color: '#FFFFFF', fontWeight: '700', textAlign: 'center',
            lineHeight: 1.3, textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}>{rightText}</div>
        )}
      </div>

      {/* Center divider line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: `${(1 - dividerProgress) * 50}%`,
        bottom: `${(1 - dividerProgress) * 50}%`,
        width: '3px',
        marginLeft: '-1.5px',
        background: 'linear-gradient(180deg, transparent, #FFFFFF, transparent)',
        boxShadow: '0 0 12px rgba(255,255,255,0.8)',
        opacity: leftOpacity,
      }} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL PROOF POPUP — TikTok-style notification
// Shows follower count jump, milestone, or comment
// ─────────────────────────────────────────────────────────────────────────────
export const SocialProofPopup = ({
  platform = 'tiktok',   // 'tiktok' | 'youtube'
  text = '+1 Follower',
  startFrame = 0,
  endFrame = 75,
  yPosition = '25%',
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  if (localFrame < 0 || frame > endFrame + 10) return null;

  const translateY = interpolate(localFrame, [0, 12], [40, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  const platformColor = platform === 'tiktok' ? '#FF0050' : '#FF0000';
  const platformIcon  = platform === 'tiktok' ? '♪' : '▶';

  return (
    <AbsoluteFill style={{ zIndex: 23, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: yPosition,
        right: '20px',
        transform: `translateY(${translateY}px)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(0,0,0,0.88)',
        border: `1px solid rgba(255,255,255,0.15)`,
        borderRadius: '12px',
        padding: '10px 16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        maxWidth: '240px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: platformColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', color: '#FFFFFF', fontWeight: '900',
          flexShrink: 0,
        }}>
          {platformIcon}
        </div>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px', fontWeight: '800',
          color: '#FFFFFF', lineHeight: 1.2,
        }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA BAR CHART — animated bar chart, bars grow from 0
//
// bars = [
//   { label: 'TikTok', value: 70, color: '#FF0050' },
//   { label: 'YouTube', value: 100, color: '#FF0000' },
// ]
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

  if (localFrame < 0 || frame > endFrame + 10) return null;

  const max = maxValue || Math.max(...bars.map(b => b.value), 1);
  const opacity = Math.min(
    interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{
      zIndex: 22, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 40px', opacity,
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '14px',
        padding: '20px 24px',
        width: '100%',
      }}>
        {title && (
          <div style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '20px', color: '#FFD700',
            marginBottom: '14px', textAlign: 'center',
            letterSpacing: '1px',
          }}>{title}</div>
        )}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '120px' }}>
          {bars.map((bar, i) => {
            const barDelay = i * 6;
            const barProgress = interpolate(localFrame - barDelay,
              [0, Math.max(totalFrames - 30, 20)], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
            const barHeight = (bar.value / max) * 100 * barProgress;

            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '13px', fontWeight: '900',
                  color: bar.color || '#FFD700',
                  textShadow: `0 0 10px ${bar.color || '#FFD700'}80`,
                }}>
                  {Math.round(bar.value * barProgress)}
                </div>
                <div style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: `${barHeight}%`,
                    background: `linear-gradient(180deg, ${bar.color || '#FFD700'}, ${bar.color || '#FFD700'}88)`,
                    borderRadius: '4px 4px 0 0',
                    boxShadow: `0 0 16px ${bar.color || '#FFD700'}60`,
                    transition: 'height 0.02s linear',
                  }} />
                </div>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px', fontWeight: '700',
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center', letterSpacing: '0.5px',
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
// Perfect for tutorial/tool reveal days
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

  if (localFrame < 0 || frame > endFrame + 10) return null;

  const CHARS_PER_FRAME = 2;
  const allText = lines.join('\n');
  const charsToShow = Math.min(
    Math.floor(localFrame * CHARS_PER_FRAME),
    allText.length
  );
  const visibleText = allText.slice(0, charsToShow);
  const showCursor = charsToShow < allText.length && Math.round(localFrame / 6) % 2 === 0;

  const slideY = interpolate(localFrame, [0, 14], [40, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{
      zIndex: 22, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      opacity,
      transform: `translateY(${slideY}px)`,
    }}>
      <div style={{
        width: '100%',
        background: '#0d0d0d',
        border: '1px solid #333',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
      }}>
        {/* Title bar */}
        <div style={{
          background: '#1a1a1a',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          borderBottom: '1px solid #333',
        }}>
          {['#FF5F56', '#FFBD2E', '#27C93F'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: '#888',
            marginLeft: '8px',
          }}>{title}</span>
        </div>
        {/* Content */}
        <div style={{
          padding: '14px 16px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '13px',
          color: accentColor,
          lineHeight: 1.6,
          minHeight: '80px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          <span style={{ color: '#888' }}>$ </span>
          {visibleText}
          {showCursor && <span style={{ color: accentColor }}>█</span>}
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

  if (localFrame < 0 || frame > endFrame + 10) return null;

  const slideX = interpolate(localFrame, [0, 14], [-400, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        bottom: '18%',
        left: 0,
        transform: `translateX(${slideX}px)`,
        opacity,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* Accent bar */}
        <div style={{ width: '5px', background: accentColor, flexShrink: 0 }} />
        {/* Text block */}
        <div style={{
          background: 'rgba(0,0,0,0.82)',
          padding: '8px 18px',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '22px',
            color: accentColor,
            lineHeight: 1,
            letterSpacing: '0.5px',
          }}>{handle}</div>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            color: 'rgba(255,255,255,0.75)',
            fontWeight: '600',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginTop: '2px',
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
    <AbsoluteFill style={{ zIndex: 19, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '24px',
        opacity,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '14px',
        fontWeight: '600',
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: '2px',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
      }}>
        {pad(current)}<span style={{ color: 'rgba(255,255,255,0.3)' }}>/{pad(total)}</span>
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
  label = '',  // e.g. "DAY 30/90"
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || frame > endFrame) return null;

  const opacity = interpolate(localFrame, [0, 20], [0, 0.6],
    { extrapolateRight: 'clamp' });
  const secs = Math.floor(localFrame / 30);
  const frac = String(localFrame % 30).padStart(2, '0');
  const timeStr = label || `00:${String(secs).padStart(2, '0')}:${frac}`;

  return (
    <AbsoluteFill style={{ zIndex: 19, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        bottom: '14%',
        left: '20px',
        opacity,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '2px',
        textShadow: '0 1px 4px rgba(0,0,0,0.9)',
        background: 'rgba(0,0,0,0.45)',
        padding: '3px 8px',
        borderRadius: '4px',
      }}>
        {timeStr}
      </div>
    </AbsoluteFill>
  );
};
