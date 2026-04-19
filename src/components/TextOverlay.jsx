// src/components/TextOverlay.jsx -- DWB v9.0
// FILE PATH: src/components/TextOverlay.jsx
//
// v9 FIXES:
//   1. Word spacing: wordSpacing: "0.08em" on ALL text renders
//   2. Font rendering: fontFamily strings match Google Fonts EXACTLY
//   3. lineHeight: 1.65 on body text, 1.2 on hooks
//   4. Padding: 72px sides -- breathing room
//   5. No stroke on elegant-rise, editorial-body, fade-word, script-pair
//   6. Sequence offsets handled by VideoComposition -- overlay receives startFrame=0
//
// FONT NAMES must match EXACTLY as loaded in public/index.html:
//   'Anton'                  → Anton
//   'Bebas Neue'             → Bebas Neue
//   'Barlow Condensed'       → Barlow Condensed
//   'Archivo Black'          → Archivo Black
//   'Oswald'                 → Oswald
//   'Cormorant Garamond'     → Cormorant Garamond
//   'Playfair Display'       → Playfair Display
//   'Montserrat'             → Montserrat
//   'Space Grotesk'          → Space Grotesk
//   'JetBrains Mono'         → JetBrains Mono
//   'Great Vibes'            → Great Vibes (flowing script)
//   'Dancing Script'         → Dancing Script (casual handwrite)
//   'Italianno'              → Italianno (ultra-thin script)

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

// =============================================================================
// FONT MAP -- values must match Google Fonts family names EXACTLY
// =============================================================================
const FONT_MAP = {
  Anton:          "'Anton', sans-serif",
  Bebas:          "'Bebas Neue', sans-serif",
  Oswald:         "'Oswald', sans-serif",
  Barlow:         "'Barlow Condensed', sans-serif",
  Archivo:        "'Archivo Black', sans-serif",
  Impact:         "'Impact', 'Anton', sans-serif",
  Playfair:       "'Playfair Display', serif",
  Cormorant:      "'Cormorant Garamond', serif",
  Montserrat:     "'Montserrat', sans-serif",
  Grotesk:        "'Space Grotesk', sans-serif",
  Mono:           "'JetBrains Mono', monospace",
  GreatVibes:     "'Great Vibes', cursive",
  DancingScript:  "'Dancing Script', cursive",
  Italianno:      "'Italianno', cursive",
};

// =============================================================================
// POSITION MAP
// =============================================================================
const POSITION_STYLES = {
  'top-center':    { top: '14%',    left: 0, right: 0, bottom: 'auto',  alignItems: 'center',    justifyContent: 'flex-start' },
  top:             { top: '14%',    left: 0, right: 0, bottom: 'auto',  alignItems: 'center',    justifyContent: 'flex-start' },
  middle:          { top: 0,        left: 0, right: 0, bottom: 0,        alignItems: 'center',    justifyContent: 'center' },
  center:          { top: 0,        left: 0, right: 0, bottom: 0,        alignItems: 'center',    justifyContent: 'center' },
  'bottom-center': { top: 'auto',   left: 0, right: 0, bottom: '18%',   alignItems: 'center',    justifyContent: 'flex-end' },
  bottom:          { top: 'auto',   left: 0, right: 0, bottom: '18%',   alignItems: 'center',    justifyContent: 'flex-end' },
  'top-left':      { top: '14%',    left: '7%', right: 'auto', bottom: 'auto', alignItems: 'flex-start', justifyContent: 'flex-start' },
  'bottom-left':   { top: 'auto',   left: '7%', right: 'auto', bottom: '18%',  alignItems: 'flex-start', justifyContent: 'flex-end' },
  'top-right':     { top: '14%',    right: '7%', left: 'auto', bottom: 'auto', alignItems: 'flex-end',   justifyContent: 'flex-start' },
};

// =============================================================================
// SHADOW PRESETS
// =============================================================================
const SHADOW = {
  soft:   '0 2px 12px rgba(0,0,0,0.8), 0 4px 28px rgba(0,0,0,0.55)',
  medium: '0 2px 14px rgba(0,0,0,0.95), 0 5px 32px rgba(0,0,0,0.75)',
  heavy:  '0 2px 8px rgba(0,0,0,1), 0 5px 24px rgba(0,0,0,0.95), 0 10px 48px rgba(0,0,0,0.8)',
};

// =============================================================================
// HELPERS
// =============================================================================
function ensureColor(c) {
  if (!c) return '#FFFFFF';
  const s = String(c).trim().toLowerCase();
  if (['black','#000','#000000','transparent','none',''].includes(s)) return '#FFFFFF';
  return String(c).trim();
}

function scaleFontSize(base, text) {
  const len = (text || '').replace(/\n/g,'').length;
  if (len <= 18) return base;
  if (len <= 35) return Math.round(base * 0.88);
  if (len <= 55) return Math.round(base * 0.76);
  return Math.round(base * 0.65);
}

function strokeStyle(stroke) {
  if (!stroke || !stroke.size || !stroke.color) return {};
  return { WebkitTextStroke: stroke.size + 'px ' + stroke.color };
}

// BASE TEXT STYLE -- applied to every text element
// This is where wordSpacing is enforced globally
const BASE_TEXT = {
  wordSpacing: '0.08em',
  letterSpacing: '0.01em',
  lineHeight: 1.65,
  whiteSpace: 'pre-wrap',  // pre-wrap not pre-line -- preserves word spacing
  textAlign: 'center',
};

// =============================================================================
// v8/v9 ANIMATION: elegant-rise
// =============================================================================
function ElegantRise({ overlay, frame }) {
  const total    = overlay.endFrame - overlay.startFrame;
  const font     = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const color    = ensureColor(overlay.color);
  const fontSize = scaleFontSize(overlay.fontSize || 68, overlay.text);
  const pos      = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const ty = interpolate(frame, [0, 22], [28, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const op = Math.min(
    interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(frame, [total - 16, total], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 72px' }}>
      <div style={{ transform: `translateY(${ty}px)`, opacity: op }}>
        <div style={{
          ...BASE_TEXT,
          fontFamily: font,
          fontSize: fontSize + 'px',
          fontWeight: '700',
          color,
          textShadow: SHADOW.soft,
          fontStyle: overlay.italic ? 'italic' : 'normal',
          ...strokeStyle(overlay.stroke),
        }}>
          {overlay.text}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: script-pair
// Large flowing script + small clean body stacked
// =============================================================================
function ScriptPair({ overlay, frame }) {
  const total       = overlay.endFrame - overlay.startFrame;
  const scriptFont  = FONT_MAP[overlay.scriptFont] || FONT_MAP.GreatVibes;
  const bodyFont    = FONT_MAP[overlay.font]        || FONT_MAP.Cormorant;
  const scriptColor = ensureColor(overlay.scriptColor || overlay.color);
  const bodyColor   = ensureColor(overlay.bodyColor || '#FFFFFF');
  const scriptSize  = overlay.scriptFontSize || 104;
  const bodySize    = overlay.fontSize       || 36;
  const pos         = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const sx  = interpolate(frame, [0, 24], [-28, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const sOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const bOp = Math.min(
    interpolate(frame, [12, 28], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(frame, [total - 14, total], [1, 0], { extrapolateLeft: 'clamp' })
  );
  const eOp = interpolate(frame, [total - 14, total], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 48px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <div style={{ transform: `translateX(${sx}px)`, opacity: sOp * eOp }}>
          <div style={{ fontFamily: scriptFont, fontSize: scriptSize + 'px', fontWeight: '400', color: scriptColor, textShadow: SHADOW.heavy, textAlign: 'center', lineHeight: 1.15, wordSpacing: '0.08em' }}>
            {overlay.scriptText || overlay.text}
          </div>
        </div>
        {overlay.scriptText && overlay.text && (
          <div style={{ opacity: bOp }}>
            <div style={{ ...BASE_TEXT, fontFamily: bodyFont, fontSize: bodySize + 'px', fontWeight: '400', color: bodyColor, textShadow: SHADOW.soft, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              {overlay.text}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: pill-card
// Dark frosted pill behind text
// =============================================================================
function PillCard({ overlay, frame }) {
  const total    = overlay.endFrame - overlay.startFrame;
  const font     = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const color    = ensureColor(overlay.color);
  const fontSize = scaleFontSize(overlay.fontSize || 60, overlay.text);
  const pos      = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const boldWord = overlay.boldWord;

  const scY = interpolate(frame, [0, 14], [0.82, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const op  = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(frame, [total - 12, total], [1, 0], { extrapolateLeft: 'clamp' })
  );
  const parts = boldWord ? overlay.text.split(boldWord) : null;

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 36px' }}>
      <div style={{ transform: `scaleY(${scY})`, opacity: op, background: 'rgba(12,12,12,0.84)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '22px 32px', maxWidth: '90%', textAlign: 'center' }}>
        {boldWord && parts ? (
          <div style={{ ...BASE_TEXT, fontFamily: font, fontSize: fontSize + 'px', color }}>
            {parts[0]}<span style={{ fontWeight: '800' }}>{boldWord}</span>{parts[1]}
          </div>
        ) : (
          <div style={{ ...BASE_TEXT, fontFamily: font, fontSize: fontSize + 'px', fontWeight: '600', color }}>
            {overlay.text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: mixed-weight
// Heavy caps line + script line
// =============================================================================
function MixedWeight({ overlay, frame }) {
  const total      = overlay.endFrame - overlay.startFrame;
  const lines      = (overlay.text || '').split('\n');
  const heavyLine  = lines[0] || '';
  const scriptLine = lines[1] || '';
  const heavyFont  = FONT_MAP[overlay.heavyFont  || 'Anton'];
  const scriptFont = FONT_MAP[overlay.scriptFont || 'GreatVibes'];
  const color      = ensureColor(overlay.color);
  const hSize      = overlay.heavyFontSize  || 72;
  const sSize      = overlay.scriptFontSize || 92;
  const pos        = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const op = Math.min(
    interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(frame, [total - 12, total], [1, 0], { extrapolateLeft: 'clamp' })
  );
  const hy = interpolate(frame, [0, 18], [18, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const sy = interpolate(frame, [6, 24], [22, 0],  { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 44px', opacity: op }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        {heavyLine && (
          <div style={{ transform: `translateY(${hy}px)` }}>
            <div style={{ fontFamily: heavyFont, fontSize: hSize + 'px', fontWeight: '900', color, textShadow: SHADOW.medium, textAlign: 'center', letterSpacing: '0.08em', wordSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.1, ...strokeStyle(overlay.stroke) }}>
              {heavyLine}
            </div>
          </div>
        )}
        {scriptLine && (
          <div style={{ transform: `translateY(${sy}px)` }}>
            <div style={{ fontFamily: scriptFont, fontSize: sSize + 'px', fontWeight: '400', color: overlay.accentColor || color, textShadow: SHADOW.heavy, textAlign: 'center', lineHeight: 1.1, wordSpacing: '0.08em', marginTop: '-4px' }}>
              {scriptLine}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: editorial-body
// Left-weighted line-by-line stagger
// =============================================================================
function EditorialBody({ overlay, frame }) {
  const total    = overlay.endFrame - overlay.startFrame;
  const font     = FONT_MAP[overlay.font] || FONT_MAP.Cormorant;
  const color    = ensureColor(overlay.color);
  const fontSize = overlay.fontSize || 54;
  const pos      = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const lines    = (overlay.text || '').split('\n').filter(l => l.trim());

  const bOp = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(frame, [total - 16, total], [1, 0], { extrapolateLeft: 'clamp' })
  );

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 68px', opacity: bOp }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {lines.map((line, i) => {
          const lOp = interpolate(frame - i * 9, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const lY  = interpolate(frame - i * 9, [0, 17], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          return (
            <div key={i} style={{ opacity: lOp, transform: `translateY(${lY}px)` }}>
              <div style={{ ...BASE_TEXT, fontFamily: font, fontSize: (i === 0 ? Math.round(fontSize * 1.1) : fontSize) + 'px', fontWeight: i === 0 ? '700' : '400', color: i === 0 ? (overlay.accentColor || color) : color, textShadow: SHADOW.soft, textAlign: 'left' }}>
                {line}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: letter-breathe
// =============================================================================
function LetterBreathe({ overlay, frame }) {
  const total    = overlay.endFrame - overlay.startFrame;
  const font     = FONT_MAP[overlay.font] || FONT_MAP.Cormorant;
  const color    = ensureColor(overlay.color);
  const fontSize = scaleFontSize(overlay.fontSize || 72, overlay.text);
  const pos      = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const spacing  = interpolate(frame, [0, 30], [-0.04, 0.24], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const op       = Math.min(interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }), interpolate(frame, [total - 16, total], [1, 0], { extrapolateLeft: 'clamp' }));

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 44px', opacity: op }}>
      <div style={{ ...BASE_TEXT, fontFamily: font, fontSize: fontSize + 'px', fontWeight: '300', color, textShadow: SHADOW.medium, letterSpacing: spacing + 'em', textTransform: 'uppercase', lineHeight: 1.5 }}>
        {overlay.text}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: fade-word
// Words appear one by one softly
// =============================================================================
function FadeWord({ overlay, frame }) {
  const total   = overlay.endFrame - overlay.startFrame;
  const font    = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const color   = ensureColor(overlay.color);
  const fontSize = scaleFontSize(overlay.fontSize || 68, overlay.text);
  const pos     = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const words   = (overlay.text || '').split(' ');
  const fpw     = Math.max(6, Math.floor((total * 0.7) / Math.max(words.length, 1)));
  const eOp     = interpolate(frame, [total - 16, total], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 72px', opacity: eOp }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.28em', alignItems: 'baseline' }}>
        {words.map((word, i) => {
          const wOp = interpolate(frame - i * fpw, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const wY  = interpolate(frame - i * fpw, [0, 14], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          return (
            <div key={i} style={{ opacity: wOp, transform: `translateY(${wY}px)`, display: 'inline-block' }}>
              <span style={{ fontFamily: font, fontSize: fontSize + 'px', fontWeight: '600', color, textShadow: SHADOW.soft, lineHeight: 1.5, wordSpacing: '0.08em' }}>
                {word}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: accent-reveal
// White text + ONE word swaps to accent color
// =============================================================================
function AccentReveal({ overlay, frame }) {
  const total       = overlay.endFrame - overlay.startFrame;
  const font        = FONT_MAP[overlay.font] || FONT_MAP.Anton;
  const color       = ensureColor(overlay.color);
  const fontSize    = scaleFontSize(overlay.fontSize || 82, overlay.text);
  const pos         = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const accentColor = overlay.accentColor || '#CAFF00';
  const accentWord  = (overlay.accentWord || '').toLowerCase();

  const op     = Math.min(interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' }), interpolate(frame, [total - 14, total], [1, 0], { extrapolateLeft: 'clamp' }));
  const aOp    = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const aSc    = interpolate(frame, [20, 28], [0.78, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const glow   = 0.45 + Math.sin(frame * 0.1) * 0.3;
  const words  = (overlay.text || '').split(' ');

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 60px', opacity: op }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '0.22em' }}>
        {words.map((word, i) => {
          const isA = word.replace(/[^a-zA-Z]/g, '').toLowerCase() === accentWord;
          return (
            <span key={i} style={{ fontFamily: font, fontSize: (isA ? Math.round(fontSize * 1.08) : fontSize) + 'px', fontWeight: 'bold', color: isA ? accentColor : color, textShadow: isA ? `0 0 ${14 * glow}px ${accentColor}88, ${SHADOW.medium}` : SHADOW.medium, display: 'inline-block', transform: isA ? `scale(${aSc})` : 'scale(1)', opacity: isA ? aOp : 1, lineHeight: 1.4, wordSpacing: '0.08em', ...strokeStyle(overlay.stroke) }}>
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: cinematic-title
// Light weight title + underline draws beneath
// =============================================================================
function CinematicTitle({ overlay, frame }) {
  const total    = overlay.endFrame - overlay.startFrame;
  const font     = FONT_MAP[overlay.font] || FONT_MAP.Cormorant;
  const color    = ensureColor(overlay.color);
  const fontSize = scaleFontSize(overlay.fontSize || 80, overlay.text);
  const pos      = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const op    = Math.min(interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' }), interpolate(frame, [total - 16, total], [1, 0], { extrapolateLeft: 'clamp' }));
  const lineW = interpolate(frame, [14, 34], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const textY = interpolate(frame, [0, 20], [22, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 52px', opacity: op }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <div style={{ transform: `translateY(${textY}px)` }}>
          <div style={{ ...BASE_TEXT, fontFamily: font, fontSize: fontSize + 'px', fontWeight: '300', color, textShadow: SHADOW.medium, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.3 }}>
            {overlay.text}
          </div>
        </div>
        <div style={{ width: '100%', height: '1px', background: `linear-gradient(to right, transparent 0%, ${overlay.accentColor || color} ${lineW}%, transparent ${lineW}%)`, opacity: 0.65 }} />
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// v8/v9 ANIMATION: ghost-repeat
// Text stacks at decreasing opacity
// =============================================================================
function GhostRepeat({ overlay, frame }) {
  const total  = overlay.endFrame - overlay.startFrame;
  const font   = FONT_MAP[overlay.font] || FONT_MAP.Anton;
  const color  = ensureColor(overlay.color);
  const fSize  = overlay.fontSize || 72;
  const pos    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const count  = overlay.repeatCount || 5;

  const eOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const xOp = interpolate(frame, [total - 16, total], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', ...pos, padding: '0 36px', opacity: Math.min(eOp, xOp) }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{ opacity: Math.max(0.06, 1 - i * (0.85 / (count - 1))), transform: `scale(${Math.max(0.72, 1 - i * (0.18 / (count - 1)))})` }}>
            <div style={{ fontFamily: font, fontSize: fSize + 'px', fontWeight: '900', color, textShadow: i === 0 ? SHADOW.heavy : 'none', textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.0, wordSpacing: '0.08em' }}>
              {overlay.text}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// LEGACY SUB-COMPONENTS -- backward compat days 36-49
// =============================================================================
const TypewriterText = ({ text, fontSize, fontFamily, color, fontWeight }) => {
  const frame = useCurrentFrame();
  const chars = text.split('');
  const show  = Math.floor(interpolate(frame, [0, 100], [0, chars.length], { extrapolateRight: 'clamp' }));
  const cur   = show < chars.length;
  return (
    <div style={{ ...BASE_TEXT, fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft }}>
      {chars.slice(0, show).join('')}{cur && <span style={{ opacity: Math.round(frame / 8) % 2 === 0 ? 1 : 0, marginLeft: 2 }}>|</span>}
    </div>
  );
};

const WordHighlightText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();
  const lines = text.split('\n');
  let gi = 0;
  const lw = lines.map(l => l.split(' ').filter(w => w).map(word => ({ word, idx: gi++ })));
  const tw = gi;
  const fpw = Math.max(1, Math.floor(totalFrames / Math.max(tw, 1)));
  const cur = Math.min(Math.floor(frame / fpw), tw - 1);
  const bOp = interpolate(frame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3em', opacity: bOp }}>
      {lw.map((words, li) => (
        <div key={li} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.25em' }}>
          {words.map(({ word, idx }, wi) => {
            const iC = idx === cur, iP = idx < cur;
            return (
              <span key={wi + '-' + li} style={{ fontFamily, fontSize: fontSize + 'px', fontWeight, color: iC ? '#FFD700' : (iP ? 'rgba(255,255,255,0.45)' : color), textShadow: iC ? SHADOW.medium : SHADOW.soft, lineHeight: 1.65, wordSpacing: '0.08em' }}>
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// MAIN EXPORT
// =============================================================================
export const TextOverlay = ({ overlay }) => {
  const frame       = useCurrentFrame();
  const { fps }     = useVideoConfig();
  const total       = overlay.endFrame - overlay.startFrame;
  const rawText     = overlay.text || '';
  const color       = ensureColor(overlay.color);
  const pos         = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const fontSize    = scaleFontSize(overlay.fontSize || 68, rawText);
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const fontWeight  = (overlay.font === 'Montserrat' || overlay.font === 'Grotesk') ? '700' : 'bold';
  const fStyle      = overlay.italic ? 'italic' : 'normal';
  const stroke      = strokeStyle(overlay.stroke);

  // ── v8/v9 NEW ANIMATIONS ────────────────────────────────────────────────────
  if (overlay.animation === 'elegant-rise')    return <ElegantRise    overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'script-pair')     return <ScriptPair     overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'pill-card')       return <PillCard       overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'mixed-weight')    return <MixedWeight    overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'editorial-body')  return <EditorialBody  overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'letter-breathe')  return <LetterBreathe  overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'fade-word')       return <FadeWord       overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'accent-reveal')   return <AccentReveal   overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'cinematic-title') return <CinematicTitle overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === 'ghost-repeat')    return <GhostRepeat    overlay={overlay} frame={frame} fps={fps} />;

  // ── LEGACY ANIMATIONS ───────────────────────────────────────────────────────
  let opacity = 1, tx = 0, ty = 0, sc = 1, glitch = 0;

  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
  const rclamp = { extrapolateRight: 'clamp' };
  const lclamp = { extrapolateLeft: 'clamp' };

  if (overlay.animation === 'fade') {
    opacity = interpolate(frame, [0, 8, total - 8, total], [0, 1, 1, 0], clamp);
  }
  if (overlay.animation === 'pop') {
    const s = spring({ fps, frame, config: { damping: 12, stiffness: 200 } });
    sc = interpolate(s, [0, 1], [0.5, 1]);
    opacity = Math.min(interpolate(frame, [0, 6], [0, 1], rclamp), interpolate(frame, [total - 6, total], [1, 0], lclamp));
  }
  if (overlay.animation === 'slide-left') {
    tx = interpolate(frame, [0, 12], [-320, 0], { ...rclamp, easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], rclamp), interpolate(frame, [total - 6, total], [1, 0], lclamp));
  }
  if (overlay.animation === 'slide-right') {
    tx = interpolate(frame, [0, 12], [320, 0], { ...rclamp, easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], rclamp), interpolate(frame, [total - 6, total], [1, 0], lclamp));
  }
  if (overlay.animation === 'slide-up') {
    ty = interpolate(frame, [0, 12], [80, 0], { ...rclamp, easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], rclamp), interpolate(frame, [total - 6, total], [1, 0], lclamp));
  }
  if (overlay.animation === 'slide-down') {
    ty = interpolate(frame, [0, 12], [-80, 0], { ...rclamp, easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], rclamp), interpolate(frame, [total - 6, total], [1, 0], lclamp));
  }
  if (overlay.animation === 'bounce') {
    const s = spring({ fps, frame, config: { damping: 8, stiffness: 180, mass: 0.8 } });
    ty = interpolate(s, [0, 1], [40, 0]);
    opacity = interpolate(frame, [0, 8], [0, 1], rclamp);
  }
  if (overlay.animation === 'zoom-punch') {
    const s = spring({ fps, frame, config: { damping: 7, stiffness: 280, mass: 0.6 } });
    sc = interpolate(s, [0, 1], [3.2, 1]);
    opacity = Math.min(interpolate(frame, [0, 3], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp));
  }
  if (overlay.animation === 'zoom-out') {
    sc = interpolate(frame, [0, 30], [1.8, 1], { ...rclamp, easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 12], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp));
  }
  if (overlay.animation === 'heartbeat') {
    const b = frame % 45;
    sc = b < 8 ? interpolate(b, [0, 4, 8], [1, 1.06, 1], rclamp) : 1;
  }
  if (overlay.animation === 'glitch') {
    const gc = frame % 18;
    glitch = gc < 3 ? interpolate(gc, [0, 3], [0, 1]) : 0;
    tx = gc < 3 ? Math.sin(frame * 13.7) * 6 : 0;
    opacity = Math.min(interpolate(frame, [0, 5], [0, 1], rclamp), interpolate(frame, [total - 6, total], [1, 0], lclamp));
  }
  const rgbSplit = glitch > 0.05 ? `${Math.round(glitch * 6)}px 0 rgba(255,0,60,0.85), ${-Math.round(glitch * 6)}px 0 rgba(0,255,220,0.85), ` : '';
  const shadow = rgbSplit + SHADOW.medium;

  // -- Complex legacy animations --
  if (overlay.animation === 'typewriter') {
    const twOp = Math.min(interpolate(frame, [0, 6], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp));
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: twOp, ...pos }}>
        <TypewriterText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={color} fontWeight={fontWeight} />
      </div>
    );
  }
  if (overlay.animation === 'word-highlight') {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', ...pos }}>
        <WordHighlightText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={color} fontWeight={fontWeight} totalFrames={total} />
      </div>
    );
  }
  if (overlay.animation === 'stagger') {
    const words = rawText.split(' ');
    const bOp = Math.min(interpolate(frame, [0, 5], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp));
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: bOp, ...pos }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.28em' }}>
          {words.map((word, i) => {
            const wf = frame - i * 4;
            return (
              <div key={i} style={{ fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft, transform: `translateY(${interpolate(wf, [0, 8], [18, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, opacity: interpolate(wf, [0, 6], [0, 1], clamp), fontStyle: fStyle, display: 'inline-block', lineHeight: 1.65, wordSpacing: '0.08em', ...stroke }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'split-reveal') {
    const words = rawText.split(' ');
    const srOp = Math.min(interpolate(frame, [0, 6], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp));
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: srOp, ...pos }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.28em' }}>
          {words.map((word, i) => {
            const p = interpolate(frame - i * 5, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
            const d = i % 2 === 0 ? -1 : 1;
            return (
              <div key={i} style={{ fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft, transform: `translateX(${interpolate(p, [0, 1], [d * 120, 0])}px)`, opacity: interpolate(p, [0, 0.3], [0, 1], rclamp), fontStyle: fStyle, lineHeight: 1.65, wordSpacing: '0.08em', ...stroke }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'blur-in') {
    const blur = interpolate(frame, [0, 18], [20, 0], { ...rclamp, easing: Easing.out(Easing.cubic) });
    const bOp  = Math.min(interpolate(frame, [0, 6], [0, 1], rclamp), interpolate(frame, [total - 10, total], [1, 0], lclamp));
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: bOp, ...pos }}>
        <div style={{ ...BASE_TEXT, fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft, filter: `blur(${blur}px)`, transform: `scale(${interpolate(frame, [0, 18], [1.06, 1.0], rclamp)})`, fontStyle: fStyle, ...stroke }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'word-bounce') {
    const words = rawText.split(' ');
    const wbOp = interpolate(frame, [total - 8, total], [1, 0], lclamp);
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: wbOp, ...pos }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.28em' }}>
          {words.map((word, i) => {
            const bv = spring({ fps, frame: frame - i * 3, config: { damping: 6, stiffness: 260, mass: 0.7 } });
            return (
              <div key={i} style={{ fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft, transform: `scale(${interpolate(bv, [0, 1], [0, 1])})`, opacity: interpolate(frame - i * 3, [0, 5], [0, 1], clamp), display: 'inline-block', fontStyle: fStyle, transformOrigin: 'center bottom', lineHeight: 1.65, wordSpacing: '0.08em', ...stroke }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'kinetic') {
    const words  = rawText.split(' ');
    const sizeP  = [1.4, 0.8, 1.15, 0.75, 1.3, 0.9, 1.2];
    const colorP = [color, overlay.accentColor || '#CAFF00', color, '#FFFFFF', color];
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 44px', ...pos }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '0.22em', rowGap: '0.08em' }}>
          {words.map((word, i) => {
            const sv    = spring({ fps, frame: frame - i * 4, config: { damping: 10, stiffness: 220 } });
            const eOp   = interpolate(frame, [total - 8, total], [1, 0], lclamp);
            const wSize = fontSize * (sizeP[i % sizeP.length] || 1);
            const isLg  = (sizeP[i % sizeP.length] || 1) >= 1.2;
            return (
              <div key={i} style={{ fontFamily, fontSize: wSize + 'px', fontWeight: isLg ? '900' : '700', color: colorP[i % colorP.length], textShadow: SHADOW.heavy, transform: `scale(${interpolate(sv, [0, 1], [0, 1])})`, opacity: Math.min(interpolate(frame - i * 4, [0, 6], [0, 1], clamp), eOp), display: 'inline-block', fontStyle: fStyle, lineHeight: 1.1, textTransform: isLg ? 'uppercase' : 'none', wordSpacing: '0.08em', ...stroke }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'stamp-impact') {
    const SLAM = 8;
    const scY  = frame < SLAM ? interpolate(frame, [0, 2, 5, SLAM], [2.4, 0.75, 1.08, 1.0], rclamp) : 1.0;
    const scX  = frame < SLAM ? interpolate(frame, [0, 2, 5, SLAM], [0.6, 1.15, 0.96, 1.0], rclamp) : 1.0;
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 36px', opacity: interpolate(frame, [total - 8, total], [1, 0], lclamp), ...pos }}>
        <div style={{ ...BASE_TEXT, fontFamily, fontSize: fontSize + 'px', fontWeight: 'bold', color, textShadow: SHADOW.heavy, transform: `scaleX(${scX}) scaleY(${scY})`, letterSpacing: overlay.letterSpacing || '0.03em', textTransform: 'uppercase', lineHeight: 1.1, ...stroke }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'flip-up') {
    const words = rawText.split(' ');
    const fuOp  = Math.min(interpolate(frame, [0, 4], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp));
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: fuOp, perspective: '800px', ...pos }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.28em', perspective: '800px' }}>
          {words.map((word, i) => (
            <div key={i} style={{ fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft, transform: `rotateX(${interpolate(frame - i * 6, [0, 16], [-90, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}deg)`, transformOrigin: 'center bottom', opacity: interpolate(frame - i * 6, [0, 8], [0, 1], clamp), display: 'inline-block', fontStyle: fStyle, lineHeight: 1.65, wordSpacing: '0.08em', ...stroke }}>
              {word}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'letter-drop') {
    const chars = rawText.split('');
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 44px', opacity: interpolate(frame, [total - 8, total], [1, 0], lclamp), ...pos }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          {chars.map((ch, i) => {
            if (ch === '\n') return <div key={i} style={{ width: '100%', height: 0 }} />;
            if (ch === ' ')  return <div key={i} style={{ width: '0.32em' }} />;
            const df = frame - i * 3;
            return (
              <div key={i} style={{ fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft, transform: `translateY(${interpolate(df, [0, 12], [-120, 0], { ...clamp, easing: Easing.out(Easing.bounce) })}px)`, opacity: interpolate(df, [0, 4], [0, 1], clamp), display: 'inline-block', fontStyle: fStyle, lineHeight: 1.65, ...stroke }}>
                {ch}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'neon-glow') {
    const gc = overlay.glowColor || color;
    const pi = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.7, 1]);
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: Math.min(interpolate(frame, [0, 8], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp)), ...pos }}>
        <div style={{ ...BASE_TEXT, fontFamily, fontSize: fontSize + 'px', fontWeight, color: gc, textShadow: `0 0 7px ${gc}, 0 0 14px ${gc}, 0 0 28px ${gc}80, 0 2px 10px rgba(0,0,0,0.9)`, fontStyle: fStyle, filter: `brightness(${pi})` }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'caps') {
    const cs = interpolate(frame, [0, 14], [0.6, 0.1], rclamp);
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: Math.min(interpolate(frame, [0, 8], [0, 1], rclamp), interpolate(frame, [total - 8, total], [1, 0], lclamp)), ...pos }}>
        <div style={{ ...BASE_TEXT, fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.heavy, fontStyle: fStyle, textTransform: 'uppercase', letterSpacing: cs + 'em', lineHeight: 1.5, ...stroke }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === 'multi-line') {
    const lines = rawText.split('\n').filter(l => l.trim());
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity: interpolate(frame, [total - 8, total], [1, 0], { ...lclamp, extrapolateRight: 'clamp' }), ...pos }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {lines.map((line, i) => {
            const lf = frame - i * 12;
            return (
              <div key={i} style={{ ...BASE_TEXT, fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: SHADOW.soft, opacity: interpolate(lf, [0, 8], [0, 1], clamp), transform: `translateY(${interpolate(lf, [0, 10], [24, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, ...stroke }}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DEFAULT STANDARD RENDER ──────────────────────────────────────────────────
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '0 72px', opacity, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, ...pos }}>
      <div style={{ ...BASE_TEXT, fontFamily, fontSize: fontSize + 'px', fontWeight, color, textShadow: shadow, fontStyle: fStyle, ...stroke }}>
        {rawText}
      </div>
    </div>
  );
};
