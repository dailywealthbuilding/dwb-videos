// =============================================================================
// src/components/TextOverlay.jsx -- DWB v8.1
// FILE PATH: src/components/TextOverlay.jsx
//
// FIXES vs v8.0:
//   - lineHeight bumped to 1.65 for body, 1.2 for hooks
//   - padding increased from 52px to 72px sides
//   - gap between stacked lines increased
//   - Script pair gap fixed
//   - All legacy animations get lineHeight fix too
// =============================================================================

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// =============================================================================
// FONT MAP
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
  "top-center":    { top: "14%",    left: 0, right: 0,    alignItems: "center",     justifyContent: "flex-start" },
  top:             { top: "14%",    left: 0, right: 0,    alignItems: "center",     justifyContent: "flex-start" },
  middle:          { top: 0,    left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  center:          { top: 0,    left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  "bottom-center": { bottom: "20%", left: 0, right: 0,    alignItems: "center",     justifyContent: "flex-end" },
  bottom:          { bottom: "20%", left: 0, right: 0,    alignItems: "center",     justifyContent: "flex-end" },
  "top-left":      { top: "14%",    left: "7%", alignItems: "flex-start", justifyContent: "flex-start" },
  "bottom-left":   { bottom: "20%", left: "7%", alignItems: "flex-start", justifyContent: "flex-end" },
  "top-right":     { top: "14%",    right: "7%", alignItems: "flex-end",  justifyContent: "flex-start" },
};

// =============================================================================
// SHADOW PRESETS
// =============================================================================
const SHADOW = {
  soft:     "0 2px 12px rgba(0,0,0,0.75), 0 4px 28px rgba(0,0,0,0.5)",
  medium:   "0 2px 14px rgba(0,0,0,0.9),  0 5px 32px rgba(0,0,0,0.7)",
  heavy:    "0 2px 8px  rgba(0,0,0,1),    0 5px 24px rgba(0,0,0,0.95), 0 10px 48px rgba(0,0,0,0.8)",
  neonSoft: "0 0 14px rgba(202,255,0,0.5), 0 2px 10px rgba(0,0,0,0.85)",
};

// =============================================================================
// HELPERS
// =============================================================================
function ensureVisibleColor(color) {
  if (!color) return "#FFFFFF";
  const c = String(color).trim();
  if (["black","#000","#000000","transparent","none",""].includes(c.toLowerCase())) return "#FFFFFF";
  return c;
}

function computeFontSize(base, text) {
  const len = (text || "").replace(/\n/g, "").length;
  if (len <= 18) return base;
  if (len <= 35) return Math.round(base * 0.88);
  if (len <= 55) return Math.round(base * 0.76);
  return Math.round(base * 0.64);
}

function buildStrokeStyle(stroke) {
  if (!stroke || !stroke.size || !stroke.color) return {};
  return { WebkitTextStroke: `${stroke.size}px ${stroke.color}` };
}

// =============================================================================
// NEW v8 ANIMATION: elegant-rise
// Soft upward drift + fade. Clean editorial body text.
// =============================================================================
function ElegantRise({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = computeFontSize(overlay.fontSize || 68, overlay.text);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const translateY = interpolate(frame, [0, 22], [28, 0], {
    extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const opacity = Math.min(
    interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 16, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 72px" }}>
      <div style={{ transform: `translateY(${translateY}px)`, opacity }}>
        <div style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: overlay.font === "Montserrat" ? "700" : "bold",
          color,
          textShadow: SHADOW.soft,
          textAlign: "center",
          lineHeight: 1.65,       // FIXED: was 1.2 — breathing room
          whiteSpace: "pre-line",
          fontStyle: overlay.italic ? "italic" : "normal",
          letterSpacing: overlay.letterSpacing || "0.01em",
          ...buildStrokeStyle(overlay.stroke),
        }}>
          {overlay.text}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: script-pair
// Large flowing script + smaller clean body stacked.
// overlay.scriptText = the big script word/phrase
// overlay.text       = small body below (optional)
// =============================================================================
function ScriptPair({ overlay, frame, fps }) {
  const totalFrames  = overlay.endFrame - overlay.startFrame;
  const scriptFont   = FONT_MAP[overlay.scriptFont] || FONT_MAP.GreatVibes;
  const bodyFont     = FONT_MAP[overlay.font]       || FONT_MAP.Cormorant;
  const scriptColor  = ensureVisibleColor(overlay.scriptColor || overlay.color);
  const bodyColor    = ensureVisibleColor(overlay.bodyColor   || "#FFFFFF");
  const scriptSize   = overlay.scriptFontSize || 104;
  const bodySize     = overlay.fontSize       || 36;
  const posStyle     = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const scriptX  = interpolate(frame, [0, 24], [-28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const scriptOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const bodyOp   = Math.min(
    interpolate(frame, [12, 28], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 14, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );
  const exitOp = interpolate(frame, [totalFrames - 14, totalFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 48px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
        {/* Big script line */}
        <div style={{ transform: `translateX(${scriptX}px)`, opacity: scriptOp * exitOp }}>
          <div style={{
            fontFamily: scriptFont,
            fontSize: `${scriptSize}px`,
            fontWeight: "400",
            color: scriptColor,
            textShadow: SHADOW.heavy,
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "0.01em",
          }}>
            {overlay.scriptText || overlay.text}
          </div>
        </div>
        {/* Small body below — only when both exist */}
        {overlay.scriptText && overlay.text && (
          <div style={{ opacity: bodyOp }}>
            <div style={{
              fontFamily: bodyFont,
              fontSize: `${bodySize}px`,
              fontWeight: "400",
              color: bodyColor,
              textShadow: SHADOW.soft,
              textAlign: "center",
              lineHeight: 1.6,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}>
              {overlay.text}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: pill-card
// Dark frosted pill behind text. Ref Image 2 (Secret of Staying Consistent).
// overlay.boldWord = one word to render bold
// =============================================================================
function PillCard({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = computeFontSize(overlay.fontSize || 60, overlay.text);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const boldWord    = overlay.boldWord;

  const scaleY  = interpolate(frame, [0, 14], [0.82, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 12, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );

  const parts = boldWord ? overlay.text.split(boldWord) : null;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 36px" }}>
      <div style={{
        transform: `scaleY(${scaleY})`,
        opacity,
        background: "rgba(12, 12, 12, 0.84)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "22px 32px",
        maxWidth: "90%",
        textAlign: "center",
      }}>
        {boldWord && parts ? (
          <div style={{ fontFamily, fontSize: `${fontSize}px`, color, lineHeight: 1.6, textShadow: "none" }}>
            {parts[0]}
            <span style={{ fontWeight: "800" }}>{boldWord}</span>
            {parts[1]}
          </div>
        ) : (
          <div style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight: "600", color, lineHeight: 1.6, textShadow: "none" }}>
            {overlay.text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: mixed-weight
// Line 1 = heavy caps sans. Line 2 = flowing script. Ref Image 14.
// Split text with \n
// =============================================================================
function MixedWeight({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const lines       = (overlay.text || "").split("\n");
  const heavyLine   = lines[0] || "";
  const scriptLine  = lines[1] || "";
  const heavyFont   = FONT_MAP[overlay.heavyFont  || "Anton"];
  const scriptFont  = FONT_MAP[overlay.scriptFont || "GreatVibes"];
  const color       = ensureVisibleColor(overlay.color);
  const heavySize   = overlay.heavyFontSize  || 72;
  const scriptSize  = overlay.scriptFontSize || 92;
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const opacity = Math.min(
    interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 12, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );
  const heavyY  = interpolate(frame, [0, 18], [18, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const scriptY = interpolate(frame, [6,  24], [22, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 44px", opacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        {heavyLine && (
          <div style={{ transform: `translateY(${heavyY}px)` }}>
            <div style={{
              fontFamily: heavyFont,
              fontSize: `${heavySize}px`,
              fontWeight: "900",
              color,
              textShadow: SHADOW.medium,
              textAlign: "center",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              ...buildStrokeStyle(overlay.stroke),
            }}>
              {heavyLine}
            </div>
          </div>
        )}
        {scriptLine && (
          <div style={{ transform: `translateY(${scriptY}px)` }}>
            <div style={{
              fontFamily: scriptFont,
              fontSize: `${scriptSize}px`,
              fontWeight: "400",
              color: overlay.accentColor || color,
              textShadow: SHADOW.heavy,
              textAlign: "center",
              lineHeight: 1.1,
              marginTop: "-4px",
            }}>
              {scriptLine}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: editorial-body
// Left-weighted, line-by-line stagger. Refs 15 & 16.
// First line gets accent color.
// =============================================================================
function EditorialBody({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Cormorant;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = overlay.fontSize || 54;
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const lines       = (overlay.text || "").split("\n").filter(l => l.trim());

  const blockOp = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 16, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 68px", opacity: blockOp }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {lines.map((line, i) => {
          const lineOp = interpolate(frame - i * 9, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const lineY  = interpolate(frame - i * 9, [0, 17], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <div key={i} style={{ opacity: lineOp, transform: `translateY(${lineY}px)` }}>
              <div style={{
                fontFamily,
                fontSize: `${i === 0 ? Math.round(fontSize * 1.12) : fontSize}px`,
                fontWeight: i === 0 ? "700" : "400",
                color: i === 0 ? (overlay.accentColor || color) : color,
                textShadow: SHADOW.soft,
                textAlign: "left",
                lineHeight: 1.65,
                letterSpacing: "0.01em",
              }}>
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
// NEW v8 ANIMATION: letter-breathe
// Letter spacing expands on entry. Airy, premium.
// =============================================================================
function LetterBreathe({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Cormorant;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = computeFontSize(overlay.fontSize || 72, overlay.text);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const spacing = interpolate(frame, [0, 30], [-0.04, 0.24], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 16, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 44px", opacity }}>
      <div style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight: "300",
        color,
        textShadow: SHADOW.medium,
        textAlign: "center",
        lineHeight: 1.5,
        whiteSpace: "pre-line",
        letterSpacing: `${spacing}em`,
        textTransform: "uppercase",
      }}>
        {overlay.text}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: fade-word
// Words appear one by one softly. No slam, no bounce.
// =============================================================================
function FadeWord({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = computeFontSize(overlay.fontSize || 68, overlay.text);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const words       = (overlay.text || "").split(" ");
  const framesPerWord = Math.max(6, Math.floor((totalFrames * 0.7) / Math.max(words.length, 1)));
  const exitOp = interpolate(frame, [totalFrames - 16, totalFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 72px", opacity: exitOp }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.28em" }}>
        {words.map((word, i) => {
          const wOp = interpolate(frame - i * framesPerWord, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const wY  = interpolate(frame - i * framesPerWord, [0, 14], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <div key={i} style={{ opacity: wOp, transform: `translateY(${wY}px)`, display: "inline-block" }}>
              <div style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight: "600", color, textShadow: SHADOW.soft, lineHeight: 1.5 }}>
                {word}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: accent-reveal
// White text. ONE word swaps to #CAFF00 with soft glow pulse.
// overlay.accentWord = exact word to highlight
// =============================================================================
function AccentReveal({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Anton;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = computeFontSize(overlay.fontSize || 82, overlay.text);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const accentColor = overlay.accentColor || "#CAFF00";
  const accentWord  = overlay.accentWord  || "";

  const opacity     = Math.min(
    interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 14, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );
  const accentOp    = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const accentScale = interpolate(frame, [20, 28], [0.78, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glowPulse   = 0.45 + Math.sin(frame * 0.1) * 0.3;
  const words       = (overlay.text || "").split(" ");

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 60px", opacity }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "0.22em" }}>
        {words.map((word, i) => {
          const isAccent = word.replace(/[^a-zA-Z]/g, "").toLowerCase() === accentWord.toLowerCase();
          return (
            <span key={i} style={{
              fontFamily,
              fontSize: isAccent ? `${Math.round(fontSize * 1.08)}px` : `${fontSize}px`,
              fontWeight: "bold",
              color: isAccent ? accentColor : color,
              textShadow: isAccent ? `0 0 ${14 * glowPulse}px ${accentColor}88, ${SHADOW.medium}` : SHADOW.medium,
              display: "inline-block",
              transform: isAccent ? `scale(${accentScale})` : "scale(1)",
              opacity: isAccent ? accentOp : 1,
              letterSpacing: overlay.letterSpacing || "0.02em",
              ...buildStrokeStyle(overlay.stroke),
              lineHeight: 1.4,
            }}>
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: cinematic-title
// Light weight title + thin underline draws beneath it.
// =============================================================================
function CinematicTitle({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Cormorant;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = computeFontSize(overlay.fontSize || 80, overlay.text);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  const opacity = Math.min(
    interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 16, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );
  const lineW = interpolate(frame, [14, 34], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const textY = interpolate(frame, [0, 20], [22, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 52px", opacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
        <div style={{ transform: `translateY(${textY}px)` }}>
          <div style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight: "300",
            color,
            textShadow: SHADOW.medium,
            textAlign: "center",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            lineHeight: 1.3,
          }}>
            {overlay.text}
          </div>
        </div>
        <div style={{
          width: "100%",
          height: "1px",
          background: `linear-gradient(to right, transparent 0%, ${overlay.accentColor || color} ${lineW}%, transparent ${lineW}%)`,
          opacity: 0.65,
        }} />
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// NEW v8 ANIMATION: ghost-repeat
// Text stacks vertically at decreasing opacity. Vault notes reference.
// =============================================================================
function GhostRepeat({ overlay, frame, fps }) {
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Anton;
  const color       = ensureVisibleColor(overlay.color);
  const fontSize    = overlay.fontSize || 72;
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const count       = overlay.repeatCount || 5;

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp  = interpolate(frame, [totalFrames - 16, totalFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", ...posStyle, padding: "0 36px", opacity: Math.min(entryOp, exitOp) }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{
            opacity: Math.max(0.06, 1 - i * (0.85 / (count - 1))),
            transform: `scale(${Math.max(0.72, 1 - i * (0.18 / (count - 1)))})`,
          }}>
            <div style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight: "900",
              color,
              textShadow: i === 0 ? SHADOW.heavy : "none",
              textAlign: "center",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1.0,
            }}>
              {overlay.text}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// =============================================================================
// LEGACY SUB-COMPONENTS (kept for backward compat days 36-49)
// =============================================================================
const TypewriterText = ({ text, fontSize, fontFamily, color, fontWeight }) => {
  const frame = useCurrentFrame();
  const chars = text.split("");
  const charsToShow = Math.floor(interpolate(frame, [0, 100], [0, chars.length], { extrapolateRight: "clamp" }));
  const visible = chars.slice(0, charsToShow).join("");
  const cursorVisible = charsToShow < chars.length;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color, textAlign: "center", lineHeight: 1.65, whiteSpace: "pre-line", textShadow: SHADOW.soft }}>
      {visible}
      {cursorVisible && <span style={{ opacity: Math.round(frame / 8) % 2 === 0 ? 1 : 0, marginLeft: 2 }}>|</span>}
    </div>
  );
};

const WordHighlightText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();
  const lines = text.split("\n");
  let globalIdx = 0;
  const lineWords = lines.map(line => line.split(" ").filter(w => w.length > 0).map(word => ({ word, idx: globalIdx++ })));
  const totalWords = globalIdx;
  const framesPerWord = Math.max(1, Math.floor(totalFrames / Math.max(totalWords, 1)));
  const currentIdx = Math.min(Math.floor(frame / framesPerWord), totalWords - 1);
  const blockOpacity = interpolate(frame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3em", opacity: blockOpacity }}>
      {lineWords.map((words, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}>
          {words.map(({ word, idx }, wi) => {
            const isCurrent = idx === currentIdx;
            const isPast    = idx < currentIdx;
            return (
              <span key={`${li}-${wi}`} style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: isCurrent ? "#FFD700" : (isPast ? "rgba(255,255,255,0.45)" : color), textShadow: isCurrent ? SHADOW.neonSoft : SHADOW.soft, lineHeight: 1.65 }}>
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
  const totalFrames = overlay.endFrame - overlay.startFrame;
  const rawText     = overlay.text || "";
  const safeColor   = ensureVisibleColor(overlay.color);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const fontSize    = computeFontSize(overlay.fontSize || 68, rawText);
  const fontFamily  = FONT_MAP[overlay.font] || FONT_MAP.Montserrat;
  const fontWeight  = (overlay.font === "Montserrat" || overlay.font === "Grotesk") ? "700" : "bold";
  const fontStyle   = overlay.italic ? "italic" : "normal";
  const strokeStyle = buildStrokeStyle(overlay.stroke);

  // ── NEW v8 ANIMATIONS ───────────────────────────────────────────────────────
  if (overlay.animation === "elegant-rise")    return <ElegantRise    overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "script-pair")     return <ScriptPair     overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "pill-card")       return <PillCard       overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "mixed-weight")    return <MixedWeight    overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "editorial-body")  return <EditorialBody  overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "letter-breathe")  return <LetterBreathe  overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "fade-word")       return <FadeWord       overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "accent-reveal")   return <AccentReveal   overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "cinematic-title") return <CinematicTitle overlay={overlay} frame={frame} fps={fps} />;
  if (overlay.animation === "ghost-repeat")    return <GhostRepeat    overlay={overlay} frame={frame} fps={fps} />;

  // ── LEGACY ANIMATIONS ───────────────────────────────────────────────────────
  let opacity = 1, translateX = 0, translateY = 0, scale = 1, glitchRGBOffset = 0;

  if (overlay.animation === "fade") {
    opacity = interpolate(frame, [0, 8, totalFrames - 8, totalFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  if (overlay.animation === "pop") {
    const s = spring({ fps, frame, config: { damping: 12, stiffness: 200 } });
    scale = interpolate(s, [0, 1], [0.5, 1]);
    opacity = Math.min(interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  if (overlay.animation === "slide-left") {
    translateX = interpolate(frame, [0, 12], [-320, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  if (overlay.animation === "slide-right") {
    translateX = interpolate(frame, [0, 12], [320, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  if (overlay.animation === "slide-up") {
    translateY = interpolate(frame, [0, 12], [80, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  if (overlay.animation === "slide-down") {
    translateY = interpolate(frame, [0, 12], [-80, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  if (overlay.animation === "bounce") {
    const s = spring({ fps, frame, config: { damping: 8, stiffness: 180, mass: 0.8 } });
    translateY = interpolate(s, [0, 1], [40, 0]);
    opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  }
  if (overlay.animation === "zoom-punch") {
    const s = spring({ fps, frame, config: { damping: 7, stiffness: 280, mass: 0.6 } });
    scale = interpolate(s, [0, 1], [3.2, 1]);
    opacity = Math.min(interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  if (overlay.animation === "zoom-out") {
    scale = interpolate(frame, [0, 30], [1.8, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  if (overlay.animation === "heartbeat") {
    const beatFrame = frame % 45;
    scale = beatFrame < 8 ? interpolate(beatFrame, [0, 4, 8], [1, 1.06, 1], { extrapolateRight: "clamp" }) : 1;
  }
  if (overlay.animation === "glitch") {
    const gc = frame % 18;
    glitchRGBOffset = gc < 3 ? interpolate(gc, [0, 3], [0, 1]) : 0;
    translateX = gc < 3 ? (Math.sin(frame * 13.7) * 6) : 0;
    opacity = Math.min(interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
  }
  const rgbSplit = glitchRGBOffset > 0.05
    ? `${Math.round(glitchRGBOffset * 6)}px 0 rgba(255,0,60,0.85), ${-Math.round(glitchRGBOffset * 6)}px 0 rgba(0,255,220,0.85), `
    : "";
  const computedShadow = rgbSplit + SHADOW.medium;

  // ── Complex legacy renders ──────────────────────────────────────────────────
  if (overlay.animation === "typewriter") {
    const twOp = Math.min(interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: twOp, ...posStyle }}>
        <TypewriterText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} />
      </div>
    );
  }
  if (overlay.animation === "word-highlight") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", ...posStyle }}>
        <WordHighlightText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }
  if (overlay.animation === "stagger") {
    const words = rawText.split(" ");
    const bOp = Math.min(interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: bOp, ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.28em" }}>
          {words.map((word, i) => {
            const wf = frame - i * 4;
            const wo = interpolate(wf, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const wy = interpolate(wf, [0, 8], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return (
              <div key={i} style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textShadow: SHADOW.soft, transform: `translateY(${wy}px)`, opacity: wo, fontStyle, display: "inline-block", lineHeight: 1.65, ...strokeStyle }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === "split-reveal") {
    const words = rawText.split(" ");
    const srOp = Math.min(interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: srOp, ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.28em" }}>
          {words.map((word, i) => {
            const p = interpolate(frame - i * 5, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
            const dir = i % 2 === 0 ? -1 : 1;
            return (
              <div key={i} style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textShadow: SHADOW.soft, transform: `translateX(${interpolate(p, [0, 1], [dir * 120, 0])}px)`, opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }), fontStyle, lineHeight: 1.65, ...strokeStyle }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === "blur-in") {
    const blur = interpolate(frame, [0, 18], [20, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const bOp = Math.min(interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: bOp, ...posStyle }}>
        <div style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textShadow: SHADOW.soft, textAlign: "center", lineHeight: 1.65, whiteSpace: "pre-line", filter: `blur(${blur}px)`, transform: `scale(${interpolate(frame, [0, 18], [1.06, 1.0], { extrapolateRight: "clamp" })})`, fontStyle, ...strokeStyle }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === "word-bounce") {
    const words = rawText.split(" ");
    const wbOp = interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: wbOp, ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.28em" }}>
          {words.map((word, i) => {
            const bv = spring({ fps, frame: frame - i * 3, config: { damping: 6, stiffness: 260, mass: 0.7 } });
            return (
              <div key={i} style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textShadow: SHADOW.soft, transform: `scale(${interpolate(bv, [0, 1], [0, 1])})`, opacity: interpolate(frame - i * 3, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), display: "inline-block", fontStyle, transformOrigin: "center bottom", lineHeight: 1.65, ...strokeStyle }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === "kinetic") {
    const words = rawText.split(" ");
    const sp = [1.4, 0.8, 1.15, 0.75, 1.3, 0.9, 1.2];
    const cp = [safeColor, overlay.accentColor || "#CAFF00", safeColor, "#FFFFFF", safeColor];
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 44px", ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "0.18em" }}>
          {words.map((word, i) => {
            const sv = spring({ fps, frame: frame - i * 4, config: { damping: 10, stiffness: 220 } });
            const exitOp = interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" });
            const wordSize = fontSize * (sp[i % sp.length] || 1);
            const isLarge = (sp[i % sp.length] || 1) >= 1.2;
            return (
              <div key={i} style={{ fontFamily, fontSize: `${wordSize}px`, fontWeight: isLarge ? "900" : "700", color: cp[i % cp.length], textShadow: SHADOW.heavy, transform: `scale(${interpolate(sv, [0, 1], [0, 1])})`, opacity: Math.min(interpolate(frame - i * 4, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), exitOp), display: "inline-block", fontStyle, lineHeight: 1.1, textTransform: isLarge ? "uppercase" : "none", ...strokeStyle }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === "stamp-impact") {
    const SLAM = 8;
    const scaleY = frame < SLAM ? interpolate(frame, [0, 2, 5, SLAM], [2.4, 0.75, 1.08, 1.0], { extrapolateRight: "clamp" }) : 1.0;
    const scaleX = frame < SLAM ? interpolate(frame, [0, 2, 5, SLAM], [0.6, 1.15, 0.96, 1.0], { extrapolateRight: "clamp" }) : 1.0;
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 36px", opacity: interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }), ...posStyle }}>
        <div style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight: "bold", color: safeColor, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line", textShadow: SHADOW.heavy, transform: `scaleX(${scaleX}) scaleY(${scaleY})`, letterSpacing: overlay.letterSpacing || "0.03em", textTransform: "uppercase", ...strokeStyle }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === "flip-up") {
    const words = rawText.split(" ");
    const fuOp = Math.min(interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: fuOp, perspective: "800px", ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.28em", perspective: "800px" }}>
          {words.map((word, i) => {
            const delay = i * 6;
            return (
              <div key={i} style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textShadow: SHADOW.soft, transform: `rotateX(${interpolate(frame - delay, [0, 16], [-90, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}deg)`, transformOrigin: "center bottom", opacity: interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), display: "inline-block", fontStyle, lineHeight: 1.65, ...strokeStyle }}>
                {word}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === "letter-drop") {
    const chars = rawText.split("");
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 44px", opacity: interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }), ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
          {chars.map((ch, i) => {
            if (ch === "\n") return <div key={i} style={{ width: "100%", height: 0 }} />;
            if (ch === " ")  return <div key={i} style={{ width: "0.32em" }} />;
            const df = frame - i * 3;
            return (
              <div key={i} style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textShadow: SHADOW.soft, transform: `translateY(${interpolate(df, [0, 12], [-120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.bounce) })}px)`, opacity: interpolate(df, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), display: "inline-block", fontStyle, lineHeight: 1.65, ...strokeStyle }}>
                {ch}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (overlay.animation === "neon-glow") {
    const gc = overlay.glowColor || safeColor;
    const pi = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.7, 1]);
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: Math.min(interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })), ...posStyle }}>
        <div style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: gc, textShadow: `0 0 7px ${gc}, 0 0 14px ${gc}, 0 0 28px ${gc}80, 0 2px 10px rgba(0,0,0,0.9)`, textAlign: "center", lineHeight: 1.65, whiteSpace: "pre-line", fontStyle, filter: `brightness(${pi})` }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === "caps") {
    const cs = interpolate(frame, [0, 14], [0.6, 0.1], { extrapolateRight: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: Math.min(interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }), interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })), ...posStyle }}>
        <div style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textShadow: SHADOW.heavy, textAlign: "center", lineHeight: 1.5, whiteSpace: "pre-line", fontStyle, textTransform: "uppercase", letterSpacing: `${cs}em`, ...strokeStyle }}>
          {rawText}
        </div>
      </div>
    );
  }
  if (overlay.animation === "multi-line") {
    const lines = rawText.split("\n").filter(l => l.trim().length > 0);
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", padding: "0 72px", opacity: interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), ...posStyle }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          {lines.map((line, i) => {
            const lf = frame - i * 12;
            return (
              <div key={i} style={{ fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor, textAlign: "center", lineHeight: 1.65, textShadow: SHADOW.soft, opacity: interpolate(lf, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(lf, [0, 10], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px)`, ...strokeStyle }}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DEFAULT STANDARD RENDER ─────────────────────────────────────────────────
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", flexDirection: "column", padding: "0 72px",
      opacity,
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      ...posStyle,
    }}>
      <div style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight,
        color: safeColor,
        textShadow: computedShadow,
        textAlign: "center",
        lineHeight: 1.65,       // FIXED: breathing room
        whiteSpace: "pre-line",
        fontStyle,
        letterSpacing: overlay.letterSpacing !== "normal" ? overlay.letterSpacing : "0.01em",
        wordSpacing: "0.06em",
        ...strokeStyle,
      }}>
        {rawText}
      </div>
    </div>
  );
};
