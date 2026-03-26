// src/components/TextOverlay.jsx — DWB Text Overlay Engine v3.1 FIXED
// Fixes applied:
//   - Rebuilt ensureVisibleColor (< > operators eaten)
//   - Added missing computeFontSize function
//   - Added BASE_SHADOW, HEAVY_SHADOW constants
//   - Rebuilt shadowBase definition inside TextOverlay
//   - Rebuilt ALL sub-component JSX returns (TypewriterText, WordHighlightText,
//     ScrambleText, MultiLineText, StrikeText, EllipsisText, GradientText, PulseRingBG)
//   - Rebuilt ALL complex animation early returns (typewriter, word-highlight,
//     scramble, stagger, multi-line, strike, ellipsis, counter, neon-glow,
//     highlight-box, gradient-sweep, outline, shimmer, frosted, color-pulse,
//     3d-extrude, caption-bar, gradient-text, outlined, mask-reveal,
//     pixel-dissolve, vhs, strobe, pulse-ring, underline-draw, weight-shift,
//     diagonal-wipe, caps)
//   - Rebuilt final standard render (handles all simple transform animations)
//   - Phase 3 animations intact: liquid-drip, flip-up, letter-drop, panel-split,
//     kinetic, word-bounce, gradient-shift, outline-fill, color-burn

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// FONT MAP
// ─────────────────────────────────────────────────────────────────────────────
const FONT_MAP = {
  Anton:      "'Anton', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  Gabon:      "'Cabin Sketch', sans-serif",
  Bebas:      "'Bebas Neue', sans-serif",
  Oswald:     "'Oswald', sans-serif",
  Mono:       "'JetBrains Mono', monospace",
  Playfair:   "'Playfair Display', serif",
  Archivo:    "'Archivo Black', sans-serif",
  Barlow:     "'Barlow Condensed', sans-serif",
  Grotesk:    "'Space Grotesk', sans-serif",
  Impact:     "'Impact', 'Anton', sans-serif",
};

// ─────────────────────────────────────────────────────────────────────────────
// POSITION MAP
// ─────────────────────────────────────────────────────────────────────────────
const POSITION_STYLES = {
  "top-center":    { top: "18%",    left: 0, right: 0, alignItems: "center", justifyContent: "flex-start" },
  top:             { top: "18%",    left: 0, right: 0, alignItems: "center", justifyContent: "flex-start" },
  middle:          { top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  center:          { top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  "bottom-center": { bottom: "22%", left: 0, right: 0, alignItems: "center", justifyContent: "flex-end" },
  bottom:          { bottom: "22%", left: 0, right: 0, alignItems: "center", justifyContent: "flex-end" },
  "top-left":      { top: "18%", left: "5%", alignItems: "flex-start", justifyContent: "flex-start" },
  "bottom-left":   { bottom: "22%", left: "5%", alignItems: "flex-start", justifyContent: "flex-end" },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHADOW CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BASE_SHADOW  = "0 2px 12px rgba(0,0,0,0.95), 0 4px 20px rgba(0,0,0,0.8)";
const HEAVY_SHADOW = "0 2px 0 rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 20px rgba(0,0,0,0.9)";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function ensureVisibleColor(color) {
  if (!color) return "#FFFFFF";
  const c = String(color).trim();
  const darkNames = ["black", "#000", "#000000", "transparent", "none", ""];
  if (darkNames.includes(c.toLowerCase())) return "#FFFFFF";
  if (c.startsWith("#")) {
    const hex  = c.replace("#", "");
    const full = hex.length === 3 ? hex.split("").map(h => h + h).join("") : hex.padEnd(6, "0");
    const r    = parseInt(full.substring(0, 2), 16);
    const g    = parseInt(full.substring(2, 4), 16);
    const b    = parseInt(full.substring(4, 6), 16);
    if ((0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.12) return "#FFFFFF";
  }
  if (c.startsWith("rgb")) {
    const nums = c.match(/[\d.]+/g);
    if (nums && nums.length >= 3) {
      if ((0.299 * +nums[0] + 0.587 * +nums[1] + 0.114 * +nums[2]) / 255 < 0.12) return "#FFFFFF";
    }
  }
  return c;
}

function computeFontSize(base, text) {
  const len = (text || "").replace(/\n/g, "").length;
  if (len > 60) return Math.max(base * 0.72, 34);
  if (len > 40) return Math.max(base * 0.84, 38);
  if (len > 25) return Math.max(base * 0.92, 42);
  return base;
}

const SCRAMBLE_CHARS = "!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function getScrambleChar(seed) {
  return SCRAMBLE_CHARS[seed % SCRAMBLE_CHARS.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── TYPEWRITER ──
const TypewriterText = ({ text, fontSize, fontFamily, color, fontWeight }) => {
  const frame = useCurrentFrame();
  const chars = text.split("");
  const charsToShow = Math.floor(
    interpolate(frame, [0, 100], [0, chars.length], { extrapolateRight: "clamp" })
  );
  const visible = chars.slice(0, charsToShow).join("");
  const cursorVisible = charsToShow < chars.length;
  return (
    <div style={{
      fontFamily, fontSize: `${fontSize}px`, fontWeight, color,
      textAlign: "center", lineHeight: 1.25, whiteSpace: "pre-line",
      textShadow: HEAVY_SHADOW,
    }}>
      {visible}
      {cursorVisible && <span style={{ opacity: Math.round(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>}
    </div>
  );
};

// ── WORD-HIGHLIGHT ──
const WordHighlightText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();
  const lines = text.split("\n");
  let globalIdx = 0;
  const lineWords = lines.map(line =>
    line.split(" ").filter(w => w.length > 0).map(word => ({ word, idx: globalIdx++ }))
  );
  const totalWords = globalIdx;
  const framesPerWord = Math.max(1, Math.floor(totalFrames / Math.max(totalWords, 1)));
  const currentIdx = Math.min(Math.floor(frame / framesPerWord), totalWords - 1);
  const blockOpacity = interpolate(frame, [totalFrames - 10, totalFrames], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: blockOpacity, textAlign: "center" }}>
      {lineWords.map((words, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em", marginBottom: "0.1em" }}>
          {words.map(({ word, idx }, wi) => {
            const isCurrent = idx === currentIdx;
            const isPast = idx < currentIdx;
            return (
              <span key={wi} style={{
                fontFamily, fontSize: `${fontSize}px`, fontWeight,
                color: isCurrent ? "#FFD700" : isPast ? color : "rgba(255,255,255,0.4)",
                textShadow: isCurrent ? HEAVY_SHADOW : BASE_SHADOW,
                transition: "color 0.1s",
                display: "inline-block",
                transform: isCurrent ? "scale(1.08)" : "scale(1)",
              }}>{word}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── SCRAMBLE ──
const ScrambleText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();
  const chars = text.split("");
  const resolveEnd = Math.floor(totalFrames * 0.6);
  const opacity = Math.min(
    interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );
  return (
    <div style={{
      opacity, fontFamily, fontSize: `${fontSize}px`, fontWeight,
      textAlign: "center", lineHeight: 1.2,
      textShadow: HEAVY_SHADOW, letterSpacing: "0.05em",
    }}>
      {chars.map((ch, i) => {
        if (ch === "\n") return <br key={i} />;
        if (ch === " ") return <span key={i}>&nbsp;</span>;
        const charResolveFrame = Math.floor((i / Math.max(chars.length, 1)) * resolveEnd);
        if (frame >= charResolveFrame) return <span key={i} style={{ color }}>{ch}</span>;
        const seed = (frame * 7 + i * 13) % SCRAMBLE_CHARS.length;
        return (
          <span key={i} style={{ color: "#00FF88", opacity: 0.7 }}>
            {getScrambleChar(seed)}
          </span>
        );
      })}
    </div>
  );
};

// ── MULTI-LINE STAGGER ──
const MultiLineText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();
  const lines = text.split("\n").filter(l => l.trim().length > 0);
  const LINE_DELAY = 12;
  const blockOpacity = interpolate(frame, [totalFrames - 8, totalFrames], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: blockOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15em" }}>
      {lines.map((line, i) => {
        const lineFrame = frame - i * LINE_DELAY;
        const lineOpacity = interpolate(lineFrame, [0, 8], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lineY = interpolate(lineFrame, [0, 10], [24, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        return (
          <div key={i} style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre",
            textShadow: HEAVY_SHADOW,
            opacity: lineOpacity,
            transform: `translateY(${lineY}px)`,
          }}>{line}</div>
        );
      })}
    </div>
  );
};

// ── STRIKE-THROUGH ──
const StrikeText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();
  const parts = text.split("||");
  const wrongText = parts[0] || text;
  const correctText = parts[1] || "";
  const strikeWidth = interpolate(frame, [8, Math.floor(totalFrames * 0.4)], [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const correctOpacity = interpolate(frame,
    [Math.floor(totalFrames * 0.4), Math.floor(totalFrames * 0.6)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blockOpacity = Math.min(
    interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );
  return (
    <div style={{ opacity: blockOpacity, textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: "rgba(255,80,80,0.85)",
          textShadow: BASE_SHADOW, textAlign: "center",
        }}>{wrongText}</div>
        <div style={{
          position: "absolute", top: "50%", left: 0,
          width: strikeWidth + "%", height: "3px",
          background: "#FF4444",
          boxShadow: "0 0 6px #FF4444",
          transform: "translateY(-50%)",
        }} />
      </div>
      {correctText.length > 0 && (
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color,
          textShadow: HEAVY_SHADOW, marginTop: "8px",
          opacity: correctOpacity,
        }}>{correctText}</div>
      )}
    </div>
  );
};

// ── ELLIPSIS LOADER ──
const EllipsisText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();
  const LOADER_FRAMES = 40;
  const showLoader = frame < LOADER_FRAMES;
  const dot1 = Math.round(frame / 8) % 3 >= 0 ? 1 : 0.2;
  const dot2 = Math.round(frame / 8) % 3 >= 1 ? 1 : 0.2;
  const dot3 = Math.round(frame / 8) % 3 >= 2 ? 1 : 0.2;
  return (
    <div style={{ textAlign: "center" }}>
      {showLoader ? (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.3em" }}>
          <span style={{ fontFamily, fontSize: `${fontSize * 1.5}px`, color, opacity: dot1 }}>•</span>
          <span style={{ fontFamily, fontSize: `${fontSize * 1.5}px`, color, opacity: dot2 }}>•</span>
          <span style={{ fontFamily, fontSize: `${fontSize * 1.5}px`, color, opacity: dot3 }}>•</span>
        </div>
      ) : (
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color,
          textShadow: HEAVY_SHADOW, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          opacity: interpolate(frame, [LOADER_FRAMES, LOADER_FRAMES + 10], [0, 1], { extrapolateRight: "clamp" }),
        }}>{text}</div>
      )}
    </div>
  );
};

// ── GRADIENT TEXT (Phase 2) ──
const GradientText = ({ text, fontSize, fontFamily, fontWeight, totalFrames, strokeStyle }) => {
  const frame = useCurrentFrame();
  const sweep = ((frame % 90) / 90) * 160 - 30;
  const opacity = Math.min(
    interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
  );
  return (
    <div style={{
      opacity,
      fontFamily, fontSize: `${fontSize}px`, fontWeight,
      textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
      background: `linear-gradient(${sweep}deg, #FFD700, #FFFFFF, #E8A920, #FFD700)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.95))",
    }}>{text}</div>
  );
};

// ── PULSE RING BG (Phase 2) ──
const PulseRingBG = ({ color }) => {
  const frame = useCurrentFrame();
  const cycleFrame = frame % 60;
  const scale = interpolate(cycleFrame, [0, 55], [0.2, 2.2], { extrapolateRight: "clamp" });
  const ringOpacity = interpolate(cycleFrame, [0, 10, 50, 55], [0, 0.5, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute",
      top: "50%", left: "50%",
      width: "200px", height: "200px",
      borderRadius: "50%",
      border: `2px solid ${color}`,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity: ringOpacity,
      pointerEvents: "none",
    }} />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const TextOverlay = ({ overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sequence: only render during overlay's active window
  if (frame < overlay.startFrame || frame >= overlay.endFrame) return null;
  const localFrame = frame - overlay.startFrame;

  const totalFrames = overlay.endFrame - overlay.startFrame;
  const rawText = overlay.text || "";

  const safeColor    = ensureVisibleColor(overlay.color);
  const posStyle     = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const baseFontSize = overlay.fontSize || 68;
  const fontSize     = computeFontSize(baseFontSize, rawText);
  const fontFamily   = FONT_MAP[overlay.font] || "'Montserrat', sans-serif";
  const fontWeight   = overlay.font === "Montserrat" ? "800" : "bold";
  const fontStyle    = overlay.italic ? "italic" : "normal";
  const extraSpacing = overlay.letterSpacing || "normal";
  const useHeavyShadow = overlay.heavyShadow || overlay.font === "Anton" || overlay.font === "Archivo";

  // Dynamic glow shadow using safeColor
  const shadowBase = [
    "0 0 7px " + safeColor,
    "0 0 14px " + safeColor,
    "0 0 28px " + safeColor,
    "0 2px 0 rgba(0,0,0,1)",
    "0 4px 12px rgba(0,0,0,0.9)",
  ].join(", ");

  let opacity         = 1;
  let translateX      = 0;
  let translateY      = 0;
  let scale           = 1;
  let glitchRGBOffset = 0;

  // ── FADE ──
  if (overlay.animation === "fade") {
    opacity = interpolate(localFrame, [0, 8, totalFrames - 8, totalFrames], [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // ── POP ──
  if (overlay.animation === "pop") {
    const s = spring({ fps, frame: localFrame, config: { damping: 12, stiffness: 200 } });
    scale = interpolate(s, [0, 1], [0.5, 1]);
    opacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-LEFT ──
  if (overlay.animation === "slide-left") {
    translateX = interpolate(localFrame, [0, 12], [-320, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-RIGHT ──
  if (overlay.animation === "slide-right") {
    translateX = interpolate(localFrame, [0, 12], [320, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-UP ──
  if (overlay.animation === "slide-up") {
    translateY = interpolate(localFrame, [0, 12], [80, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-DOWN ──
  if (overlay.animation === "slide-down") {
    translateY = interpolate(localFrame, [0, 12], [-80, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── BOUNCE ──
  if (overlay.animation === "bounce") {
    const s = spring({ fps, frame: localFrame, config: { damping: 8, stiffness: 180, mass: 0.8 } });
    translateY = interpolate(s, [0, 1], [40, 0]);
    opacity = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  }

  // ── ZOOM-PUNCH ──
  if (overlay.animation === "zoom-punch") {
    const s = spring({ fps, frame: localFrame, config: { damping: 7, stiffness: 280, mass: 0.6 } });
    scale = interpolate(s, [0, 1], [3.2, 1]);
    opacity = Math.min(
      interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── ZOOM-OUT ──
  if (overlay.animation === "zoom-out") {
    scale = interpolate(localFrame, [0, 30], [1.8, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── HEARTBEAT ──
  if (overlay.animation === "heartbeat") {
    opacity = 1;
    const beatFrame = localFrame % 45;
    scale = beatFrame < 8
      ? interpolate(beatFrame, [0, 4, 8], [1, 1.06, 1], { extrapolateRight: "clamp" })
      : 1;
  }

  // ── GLITCH ──
  if (overlay.animation === "glitch") {
    const glitchFrames = [3, 7, 14, 21, 35, 42, 56, 63];
    const isGlitch = glitchFrames.some(gf => localFrame === gf || localFrame === gf + 1);
    glitchRGBOffset = isGlitch ? 0.8 + Math.random() * 0.4 : 0;
    opacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SHAKE ──
  if (overlay.animation === "shake") {
    const shakeAmp = 4;
    translateX = Math.sin(localFrame * 2.1) * shakeAmp * interpolate(localFrame, [0, 8], [1, 0.3], { extrapolateRight: "clamp" });
    translateY = Math.cos(localFrame * 3.3) * shakeAmp * 0.5 * interpolate(localFrame, [0, 8], [1, 0.3], { extrapolateRight: "clamp" });
    opacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── LETTER-EXPAND ──
  if (overlay.animation === "letter-expand") {
    const lSpacing = interpolate(localFrame, [0, 20], [2, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    // letterSpacing handled via inline style on the text
  }

  // ── RGB SPLIT (glitch overlay effect) ──
  const rgbSplit = glitchRGBOffset > 0.05
    ? Math.round(glitchRGBOffset * 6) + "px 0 rgba(255,0,60,0.85), " + (-Math.round(glitchRGBOffset * 6)) + "px 0 rgba(0,255,220,0.85), "
    : "";
  const computedTextShadow = rgbSplit + shadowBase;
  const strokeStyle = overlay.stroke
    ? { WebkitTextStroke: overlay.stroke.size + "px " + overlay.stroke.color, textShadow: computedTextShadow }
    : { textShadow: computedTextShadow };

  // ─────────────────────────────────────────────────────────────────────────
  // COMPLEX RENDER BRANCHES (early returns)
  // ─────────────────────────────────────────────────────────────────────────

  // ── TYPEWRITER ──
  if (overlay.animation === "typewriter") {
    const twOpacity = Math.min(
      interpolate(localFrame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: twOpacity, ...posStyle }}>
        <TypewriterText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} />
      </div>
    );
  }

  // ── WORD-HIGHLIGHT ──
  if (overlay.animation === "word-highlight") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <WordHighlightText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── SCRAMBLE ──
  if (overlay.animation === "scramble") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <ScrambleText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── STAGGER ──
  if (overlay.animation === "stagger") {
    const words = rawText.split(" ");
    const DELAY = 4;
    const blockOpacity = Math.min(
      interpolate(localFrame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: blockOpacity, ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.25em" }}>
          {words.map((word, i) => {
            const wf = localFrame - i * DELAY;
            const wo = interpolate(wf, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const wy = interpolate(wf, [0, 8], [18, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return (
              <div key={i} style={{
                fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
                textShadow: useHeavyShadow ? HEAVY_SHADOW : BASE_SHADOW,
                opacity: wo, transform: `translateY(${wy}px)`,
                display: "inline-block", fontStyle,
              }}>{word}</div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── MULTI-LINE ──
  if (overlay.animation === "multi-line") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <MultiLineText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── STRIKE ──
  if (overlay.animation === "strike") {
    const blockOpacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: blockOpacity, ...posStyle }}>
        <StrikeText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── ELLIPSIS ──
  if (overlay.animation === "ellipsis") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <EllipsisText text={rawText} fontSize={fontSize} fontFamily={fontFamily} color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── COUNTER ──
  if (overlay.animation === "counter") {
    const numMatch = rawText.match(/[\d,]+(\.\d+)?/);
    const targetRaw = numMatch ? numMatch[0].replace(/,/g, "") : "0";
    const target = parseFloat(targetRaw);
    const hasComma = numMatch && numMatch[0].includes(",");
    const progress = interpolate(localFrame, [0, Math.max(totalFrames - 20, 10)], [0, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const current = Math.round(progress * target);
    const formatted = hasComma ? current.toLocaleString("en-US") : String(current);
    const displayText = numMatch ? rawText.replace(numMatch[0], formatted) : rawText;
    const cOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: cOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
        }}>{displayText}</div>
      </div>
    );
  }

  // ── NEON-GLOW ──
  if (overlay.animation === "neon-glow") {
    const glowColor = overlay.glowColor || safeColor;
    const pulseIntensity = interpolate(Math.sin(localFrame * 0.12), [-1, 1], [0.7, 1.0]);
    const nOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: nOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: `0 0 ${10 * pulseIntensity}px ${glowColor}, 0 0 ${20 * pulseIntensity}px ${glowColor}, 0 0 ${40 * pulseIntensity}px ${glowColor}, 0 2px 0 rgba(0,0,0,1)`,
          fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── HIGHLIGHT-BOX ──
  if (overlay.animation === "highlight-box") {
    const boxColor = overlay.boxColor || "#FFD700";
    const boxWidth = interpolate(localFrame, [0, 14], [0, 100],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const hOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: hOpacity, ...posStyle }}>
        <div style={{ position: "relative", display: "inline-block", textAlign: "center" }}>
          <div style={{
            position: "absolute", top: "-4px", left: 0, bottom: "-4px",
            width: boxWidth + "%",
            background: boxColor,
            opacity: 0.25,
            borderRadius: "4px",
          }} />
          <div style={{
            position: "relative",
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textShadow: HEAVY_SHADOW,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            fontStyle, padding: "0 12px",
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── GRADIENT-SWEEP ──
  if (overlay.animation === "gradient-sweep") {
    const sweepPos = interpolate(localFrame, [0, totalFrames], [-200, 200],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const gOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: gOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          background: `linear-gradient(90deg, ${safeColor} 0%, #FFFFFF ${sweepPos + 50}%, ${safeColor} ${sweepPos + 100}%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.95))",
          fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── OUTLINE ──
  if (overlay.animation === "outline") {
    const oOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const strokeColor = overlay.strokeColor || safeColor;
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: oOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          WebkitTextStroke: `2px ${strokeColor}`,
          WebkitTextFillColor: "transparent",
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 12px ${strokeColor}40)`,
          fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── SHIMMER ──
  if (overlay.animation === "shimmer") {
    const shimmerCycle = localFrame % 90;
    const shimmerPos = interpolate(shimmerCycle, [0, 60], [-50, 150],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const sOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: sOpacity, ...posStyle }}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            textShadow: HEAVY_SHADOW, fontStyle,
          }}>{rawText}</div>
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(105deg, transparent ${shimmerPos - 20}%, rgba(255,255,255,0.35) ${shimmerPos}%, transparent ${shimmerPos + 20}%)`,
            pointerEvents: "none",
          }} />
        </div>
      </div>
    );
  }

  // ── FROSTED ──
  if (overlay.animation === "frosted") {
    const panelOpacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
    const fOpacity = Math.min(panelOpacity,
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
    const translateYFrosted = interpolate(localFrame, [0, 12], [30, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: fOpacity, transform: `translateY(${translateYFrosted}px)`, ...posStyle }}>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
          padding: "20px 32px",
        }}>
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            textShadow: BASE_SHADOW, fontStyle,
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── COLOR-PULSE ──
  if (overlay.animation === "color-pulse") {
    const t = (Math.sin(localFrame * 0.15) + 1) / 2;
    const pulseOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const pulseColor = overlay.pulseColor || "#FFD700";
    const lerpColor = (a, b, t) => {
      const parse = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
      try {
        const [r1,g1,b1] = parse(a.length === 7 ? a : "#FFFFFF");
        const [r2,g2,b2] = parse(b.length === 7 ? b : "#FFD700");
        return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
      } catch { return a; }
    };
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: pulseOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          color: lerpColor(safeColor, pulseColor, t),
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── 3D-EXTRUDE ──
  if (overlay.animation === "3d-extrude") {
    const rotateX = interpolate(localFrame, [0, 20], [-25, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const e3dOpacity = Math.min(
      interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: e3dOpacity, perspective: "800px", ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW,
          transform: `rotateX(${rotateX}deg)`,
          transformOrigin: "center bottom",
          fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── CAPTION-BAR ──
  if (overlay.animation === "caption-bar") {
    const barColor = overlay.barColor || "#D4A017";
    const slideY = interpolate(localFrame, [0, 10], [60, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const cBarOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 0",
        opacity: cBarOpacity, transform: `translateY(${slideY}px)`, ...posStyle }}>
        <div style={{
          background: barColor,
          padding: "12px 40px",
          alignSelf: "stretch",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily, fontSize: `${Math.min(fontSize, 52)}px`, fontWeight, color: "#000000",
            lineHeight: 1.2, whiteSpace: "pre-line", fontStyle,
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // PHASE 2 NEW ANIMATIONS
  // ════════════════════════════════════════════════════════════════════

  // ── GRADIENT-TEXT (moving gold-to-white sweep) ──
  if (overlay.animation === "gradient-text") {
    const gtOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: gtOpacity, ...posStyle }}>
        <GradientText text={rawText} fontSize={fontSize} fontFamily={fontFamily} fontWeight={fontWeight} totalFrames={totalFrames} strokeStyle={strokeStyle} />
      </div>
    );
  }

  // ── OUTLINED (hollow text — stroke only) ──
  if (overlay.animation === "outlined") {
    const outOpacity = Math.min(
      interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: outOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          WebkitTextStroke: `3px ${safeColor}`,
          WebkitTextFillColor: "transparent",
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.9))`,
          fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── MASK-REVEAL (circle expands to reveal text) ──
  if (overlay.animation === "mask-reveal") {
    const maskProgress = interpolate(localFrame, [0, 18], [0, 100],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const exitOpacity = interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0],
      { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: exitOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
          clipPath: `circle(${maskProgress}% at 50% 50%)`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── PIXEL-DISSOLVE (pixelates out on exit) ──
  if (overlay.animation === "pixel-dissolve") {
    const DISSOLVE_START = totalFrames - 20;
    const entryOpacity = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
    const dissolveProgress = interpolate(localFrame, [DISSOLVE_START, totalFrames], [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const pixelSize = interpolate(dissolveProgress, [0, 0.5, 1], [0, 8, 32]);
    const exitOpacity = interpolate(dissolveProgress, [0.7, 1.0], [1, 0], { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: Math.min(entryOpacity, exitOpacity), ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
          filter: pixelSize > 0 ? `blur(${pixelSize * 0.3}px) contrast(${1 + dissolveProgress})` : "none",
          transform: `scale(${1 + dissolveProgress * 0.08})`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── VHS (tracking lines + position distortion) ──
  if (overlay.animation === "vhs") {
    const trackingY = ((localFrame * 3.5) % 200) - 20;
    const distort = Math.sin(localFrame * 0.4) * 3;
    const vhsOpacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: vhsOpacity, ...posStyle }}>
        <div style={{ position: "relative" }}>
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            textShadow: HEAVY_SHADOW, fontStyle,
            transform: `translateX(${distort}px)`,
          }}>{rawText}</div>
          {/* VHS tracking line */}
          <div style={{
            position: "absolute", left: 0, right: 0,
            top: trackingY + "px", height: "2px",
            background: "rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }} />
          {/* Red channel offset */}
          <div style={{
            position: "absolute", inset: 0,
            fontFamily, fontSize: `${fontSize}px`, fontWeight,
            color: "rgba(255,0,60,0.3)",
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            transform: `translateX(${distort + 3}px)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── STROBE (white flash bursts at fixed frames) ──
  if (overlay.animation === "strobe") {
    const strobeFrames = overlay.strobeFrames || [0, 30, 60];
    const BURST_DURATION = 4;
    let strobeIntensity = 0;
    for (const sf of strobeFrames) {
      if (localFrame >= sf && localFrame < sf + BURST_DURATION) {
        strobeIntensity = interpolate(localFrame - sf, [0, BURST_DURATION], [0.7, 0], { extrapolateRight: "clamp" });
        break;
      }
    }
    const stOpacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: stOpacity, ...posStyle }}>
        {strobeIntensity > 0 && (
          <div style={{
            position: "absolute", inset: 0,
            background: `rgba(255,255,255,${strobeIntensity})`,
            pointerEvents: "none",
          }} />
        )}
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── PULSE-RING (expanding ring behind text) ──
  if (overlay.animation === "pulse-ring") {
    const ringColor = overlay.ringColor || safeColor;
    const prOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: prOpacity, ...posStyle }}>
        <div style={{ position: "relative", textAlign: "center" }}>
          <PulseRingBG color={ringColor} />
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            textShadow: HEAVY_SHADOW, fontStyle, position: "relative",
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── UNDERLINE-DRAW (SVG line draws under text) ──
  if (overlay.animation === "underline-draw") {
    const lineProgress = interpolate(localFrame, [8, 24], [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const udOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const lineColor = overlay.lineColor || safeColor;
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: udOpacity, ...posStyle }}>
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            textShadow: HEAVY_SHADOW, fontStyle,
          }}>{rawText}</div>
          <div style={{
            position: "absolute", bottom: "-6px", left: "10%",
            width: (lineProgress * 80) + "%",
            height: "3px",
            background: lineColor,
            boxShadow: `0 0 8px ${lineColor}`,
            borderRadius: "2px",
          }} />
        </div>
      </div>
    );
  }

  // ── WEIGHT-SHIFT (font weight 300 → 900 on entry) ──
  if (overlay.animation === "weight-shift") {
    const weightProgress = interpolate(localFrame, [0, 16], [0, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const weight = Math.round(interpolate(weightProgress, [0, 1], [300, 900]));
    const wsOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: wsOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight: weight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── DIAGONAL-WIPE (diagonal clip-path entrance) ──
  if (overlay.animation === "diagonal-wipe") {
    const wipe = interpolate(localFrame, [0, 18], [0, 100],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const exitOpacity = interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0],
      { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: exitOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
          clipPath: `polygon(0 0, ${wipe}% 0, ${wipe + 20}% 100%, 0 100%)`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── CAPS (force uppercase + wide letter spacing) ──
  if (overlay.animation === "caps") {
    const capsSpacing = interpolate(localFrame, [0, 14], [0.6, 0.1], { extrapolateRight: "clamp" });
    const capsOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: capsOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: HEAVY_SHADOW, fontStyle,
          textTransform: "uppercase",
          letterSpacing: `${capsSpacing}em`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── TEXT-CLIP (text acts as window to see background through — Phase 3) ──
  if (overlay.animation === "text-clip") {
    const tcOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: tcOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          textAlign: "center", lineHeight: 1.15, whiteSpace: "pre-line",
          background: `linear-gradient(135deg, #FFD700, #FFFFFF, #E8A920)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 16px rgba(0,0,0,0.98)) drop-shadow(0 0 32px rgba(0,0,0,0.9))",
          fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── OUTLINE-STROKE (bold stroke outline, no fill — Phase 3) ──
  if (overlay.animation === "outline-stroke") {
    const strokeColor = overlay.strokeColor || safeColor;
    const strokeWidth = overlay.strokeWidth || 3;
    const osOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const strokeScale = interpolate(localFrame, [0, 12], [1.15, 1.0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: osOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          WebkitTextFillColor: "transparent",
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          filter: `drop-shadow(0 0 12px ${strokeColor}60) drop-shadow(0 4px 16px rgba(0,0,0,0.95))`,
          transform: `scale(${strokeScale})`,
          fontStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── SPLIT-REVEAL (text reveals from center outward — Phase 3) ──
  if (overlay.animation === "split-reveal") {
    const srProgress = interpolate(localFrame, [0, 20], [0, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const srOpacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const lines = rawText.split("\n");
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: srOpacity, ...posStyle }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.12em" }}>
          {lines.map((line, i) => {
            const lineDelay = i * 6;
            const lp = interpolate(localFrame - lineDelay, [0, 20], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return (
              <div key={i} style={{ overflow: "hidden", display: "flex", justifyContent: "center" }}>
                <div style={{
                  fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
                  textAlign: "center", lineHeight: 1.2, whiteSpace: "pre",
                  textShadow: HEAVY_SHADOW, fontStyle,
                  transform: `scaleX(${lp})`,
                  transformOrigin: "center",
                }}>{line}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── BLUR-IN (enters from blur to sharp — Phase 3) ──
  if (overlay.animation === "blur-in") {
    const blurAmount = interpolate(localFrame, [0, 16], [12, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const biScale = interpolate(localFrame, [0, 16], [1.08, 1.0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const biOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: biOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
          textShadow: useHeavyShadow ? HEAVY_SHADOW : BASE_SHADOW,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${biScale})`,
          fontStyle,
          letterSpacing: extraSpacing !== "normal" ? extraSpacing : "normal",
        }}>{rawText}</div>
      </div>
    );
  }

  // ── FLIP-UP (3D horizontal axis flip — each word flips in staggered) ──
  if (overlay.animation === "flip-up") {
    const words = rawText.split(" ");
    const fuOpacity = Math.min(
      interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: fuOpacity, perspective: "800px", ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",
          alignItems: "center", gap: "0.25em", perspective: "800px" }}>
          {words.map((word, i) => {
            const delay = i * 6;
            const rotateX = interpolate(localFrame - delay, [0, 16], [-90, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const wOpacity = interpolate(localFrame - delay, [0, 8], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{
                fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
                textShadow: useHeavyShadow ? HEAVY_SHADOW : BASE_SHADOW,
                transform: `rotateX(${rotateX}deg)`,
                transformOrigin: "center bottom",
                opacity: wOpacity,
                display: "inline-block",
                fontStyle,
              }}>{word}</div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── LETTER-DROP (letters fall from above one by one) ──
  if (overlay.animation === "letter-drop") {
    const chars = rawText.split("");
    const ldOpacity = interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0],
      { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 40px",
        opacity: ldOpacity, ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",
          alignItems: "center", overflow: "hidden" }}>
          {chars.map((ch, i) => {
            const FRAMES_PER_CHAR = 3;
            const dropFrame = localFrame - i * FRAMES_PER_CHAR;
            const charTranslateY = interpolate(dropFrame, [0, 12], [-120, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.out(Easing.bounce),
            });
            const charOpacity = interpolate(dropFrame, [0, 4], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            if (ch === "\n") return <div key={i} style={{ width: "100%", height: 0 }} />;
            if (ch === " ") return <div key={i} style={{ width: "0.3em" }} />;
            return (
              <div key={i} style={{
                fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
                textShadow: useHeavyShadow ? HEAVY_SHADOW : BASE_SHADOW,
                transform: `translateY(${charTranslateY}px)`,
                opacity: charOpacity,
                display: "inline-block",
                fontStyle,
              }}>{ch}</div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PANEL-SPLIT (dark panel slides in behind text then text animates over it) ──
  if (overlay.animation === "panel-split") {
    const panelColor = overlay.boxColor || "rgba(0,0,0,0.82)";
    const panelWidth = interpolate(localFrame, [0, 14], [0, 100], {
      extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)
    });
    const textShift  = interpolate(localFrame, [6, 22], [40, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const textOpacity = interpolate(localFrame, [8, 20], [0, 1], { extrapolateRight: "clamp" });
    const psExit = interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 40px",
        opacity: psExit, ...posStyle }}>
        <div style={{ position: "relative", alignSelf: "stretch", padding: "18px 32px" }}>
          {/* Sliding panel */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0,
            width: `${panelWidth}%`,
            background: panelColor,
            borderRight: `3px solid ${overlay.accentColor || "#E8A920"}`,
            boxShadow: `4px 0 20px ${overlay.accentColor || "#E8A920"}40`,
            zIndex: 0,
          }} />
          {/* Text on top */}
          <div style={{
            position: "relative", zIndex: 1,
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textShadow: BASE_SHADOW,
            textAlign: "center", lineHeight: 1.25, whiteSpace: "pre-line",
            transform: `translateX(${textShift}px)`,
            opacity: textOpacity,
            fontStyle,
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── KINETIC (each word = different size, staggered pop — high energy) ──
  if (overlay.animation === "kinetic") {
    const words = rawText.split(" ");
    const sizePattern = [1.4, 0.8, 1.15, 0.75, 1.3, 0.9, 1.2];
    const colorPattern = [safeColor, overlay.accentColor || "#E8A920", safeColor, "#FFFFFF", safeColor];
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 40px",
        ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",
          alignItems: "baseline", gap: "0.15em", rowGap: "0.05em" }}>
          {words.map((word, i) => {
            const delay = i * 4;
            const wordScale = spring({ fps, frame: localFrame - delay, config: { damping: 10, stiffness: 220 } });
            const s = interpolate(wordScale, [0, 1], [0, 1]);
            const wOpacity = interpolate(localFrame - delay, [0, 6], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp"
            });
            const exitOp = interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" });
            const wordSize = fontSize * (sizePattern[i % sizePattern.length] || 1);
            const wordColor = colorPattern[i % colorPattern.length];
            const isLarge = (sizePattern[i % sizePattern.length] || 1) >= 1.2;
            return (
              <div key={i} style={{
                fontFamily,
                fontSize: `${wordSize}px`,
                fontWeight: isLarge ? "900" : "700",
                color: wordColor,
                textShadow: HEAVY_SHADOW,
                transform: `scale(${s})`,
                opacity: Math.min(wOpacity, exitOp),
                display: "inline-block",
                fontStyle,
                lineHeight: 1.0,
              }}>{word}</div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── WORD-BOUNCE (each word bounces in spring-style) ──
  if (overlay.animation === "word-bounce") {
    const words = rawText.split(" ");
    const wbOpacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 50px",
        opacity: wbOpacity, ...posStyle }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center",
          alignItems: "center", gap: "0.2em" }}>
          {words.map((word, i) => {
            const delay = i * 3;
            const bounceVal = spring({ fps, frame: localFrame - delay,
              config: { damping: 6, stiffness: 260, mass: 0.7 }
            });
            const wScale = interpolate(bounceVal, [0, 1], [0, 1]);
            const wOpacity = interpolate(localFrame - delay, [0, 5], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp"
            });
            return (
              <div key={i} style={{
                fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
                textShadow: useHeavyShadow ? HEAVY_SHADOW : BASE_SHADOW,
                transform: `scale(${wScale})`,
                opacity: wOpacity,
                display: "inline-block",
                fontStyle,
                transformOrigin: "center bottom",
              }}>{word}</div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── GRADIENT-SHIFT (text color slowly shifts hue — premium shimmer) ──
  if (overlay.animation === "gradient-shift") {
    const gsOpacity = Math.min(
      interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const hue1 = overlay.hue1 || 45;
    const hue2 = overlay.hue2 || 200;
    const cycle = (localFrame / totalFrames) * 360;
    const gradAngle = interpolate(localFrame, [0, totalFrames], [0, 360], { extrapolateRight: "clamp" });
    const c1 = `hsl(${(hue1 + cycle * 0.5) % 360}, 100%, 70%)`;
    const c2 = `hsl(${(hue2 + cycle * 0.3) % 360}, 80%, 60%)`;
    const c3 = `hsl(${(hue1 + 180 + cycle * 0.4) % 360}, 90%, 80%)`;
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: gsOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          background: `linear-gradient(${gradAngle}deg, ${c1}, ${c2}, ${c3})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.95)) drop-shadow(0 0 24px rgba(0,0,0,0.8))",
          fontStyle,
          letterSpacing: extraSpacing !== "normal" ? extraSpacing : "normal",
        }}>{rawText}</div>
      </div>
    );
  }

  // ── OUTLINE-FILL (starts hollow, color floods in left→right) ──
  if (overlay.animation === "outline-fill") {
    const fillColor   = overlay.fillColor   || safeColor;
    const strokeColor = overlay.strokeColor || safeColor;
    const fillProgress = interpolate(localFrame, [4, Math.floor(totalFrames * 0.55)], [0, 100], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    const ofOpacity = Math.min(
      interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: ofOpacity, ...posStyle }}>
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Outline base — always visible */}
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            WebkitTextStroke: `3px ${strokeColor}`,
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.95))",
            fontStyle,
          }}>{rawText}</div>
          {/* Fill layer — clips left→right */}
          <div style={{
            position: "absolute", inset: 0,
            clipPath: `inset(0 ${100 - fillProgress}% 0 0)`,
            fontFamily, fontSize: `${fontSize}px`, fontWeight,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            color: fillColor,
            textShadow: BASE_SHADOW,
            fontStyle,
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── COLOR-BURN (text burns through a color wash — cinematic reveal) ──
  if (overlay.animation === "color-burn") {
    const burnColor  = overlay.burnColor  || "#E8A920";
    const cbProgress = interpolate(localFrame, [0, Math.floor(totalFrames * 0.5)], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const cbOpacity = Math.min(
      interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const colorOverlayOpacity = interpolate(cbProgress, [0, 0.6, 1.0], [0.95, 0.4, 0.0]);
    const textOpacity          = interpolate(cbProgress, [0, 0.3, 1.0], [0.0, 0.7, 1.0]);
    const glowSize             = interpolate(cbProgress, [0, 1], [0, 32]);
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: cbOpacity, ...posStyle }}>
        <div style={{ position: "relative" }}>
          {/* Color wash layer */}
          <div style={{
            position: "absolute", inset: "-20px",
            background: `radial-gradient(ellipse at center, ${burnColor} 0%, transparent 70%)`,
            opacity: colorOverlayOpacity,
            borderRadius: "8px",
            filter: `blur(${interpolate(cbProgress, [0, 1], [20, 0])}px)`,
          }} />
          {/* Text burning through */}
          <div style={{
            position: "relative",
            fontFamily, fontSize: `${fontSize}px`, fontWeight, color: safeColor,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            opacity: textOpacity,
            filter: `drop-shadow(0 0 ${glowSize}px ${burnColor}) drop-shadow(0 4px 16px rgba(0,0,0,0.9))`,
            fontStyle,
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── LIQUID-DRIP (SPLASH effect — letters melt downward with glowing trails) ──
  if (overlay.animation === "liquid-drip") {
    const dripColor = overlay.glowColor || "#E8A920";
    const entryOpacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
    const exitOpacity  = interpolate(localFrame, [totalFrames - 10, totalFrames], [1, 0], { extrapolateLeft: "clamp" });
    const dripProgress = interpolate(localFrame, [8, Math.floor(totalFrames * 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const dripLength   = interpolate(dripProgress, [0, 1], [0, 280]);
    const glowIntensity = interpolate(Math.sin(localFrame * 0.15), [-1, 1], [0.7, 1.0]);
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: Math.min(entryOpacity, exitOpacity), ...posStyle }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Main text */}
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, fontWeight,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            background: `linear-gradient(180deg, #FFFFFF 0%, ${dripColor} 60%, #FF4400 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 ${12 * glowIntensity}px ${dripColor}) drop-shadow(0 4px 20px rgba(0,0,0,0.9))`,
            fontStyle,
            letterSpacing: extraSpacing !== "normal" ? extraSpacing : "0.02em",
          }}>{rawText}</div>
          {/* Drip shadow trails */}
          {rawText.replace(/\s/g, "").split("").map((_, i) => {
            const colCount = Math.min(rawText.replace(/\s/g, "").length, 10);
            if (i >= colCount) return null;
            const leftPct = 10 + (i / colCount) * 80;
            const trailOpacity = dripProgress * (0.4 + (i % 3) * 0.15);
            const trailDelay = i * 0.08;
            const trailLen = Math.max(0, dripLength - trailDelay * 60);
            return (
              <div key={i} style={{
                position: "absolute",
                top: "100%",
                left: leftPct + "%",
                width: "2px",
                height: trailLen + "px",
                background: `linear-gradient(180deg, ${dripColor} 0%, transparent 100%)`,
                opacity: trailOpacity,
                borderRadius: "1px",
              }} />
            );
          })}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STANDARD RENDER — handles all simple transform animations:
  // fade, pop, slide-left, slide-right, slide-up, slide-down, bounce,
  // zoom-punch, zoom-out, heartbeat, glitch, shake, letter-expand
  // ─────────────────────────────────────────────────────────────────────────
  const letterSpacingVal = overlay.animation === "letter-expand"
    ? `${interpolate(localFrame, [0, 20], [2, 0], { extrapolateRight: "clamp" })}em`
    : extraSpacing !== "normal" ? extraSpacing : "normal";

  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", flexDirection: "column",
      padding: "0 60px",
      opacity,
      ...posStyle,
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
    }}>
      <div style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight,
        color: safeColor,
        textAlign: "center",
        lineHeight: 1.2,
        whiteSpace: "pre-line",
        ...strokeStyle,
        fontStyle,
        letterSpacing: letterSpacingVal,
      }}>{rawText}</div>
    </div>
  );
};
