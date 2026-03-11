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
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function ensureVisibleColor(color) {
  if (!color) return "#FFFFFF";
  const c = String(color).trim();
  const darkNames = ["black", "#000", "#000000", "transparent", "none", ""];
  if (darkNames.includes(c.toLowerCase())) return "#FFFFFF";
  if (c.startsWith("#")) {
    const hex = c.replace("#", "");
    const full = hex.length === 3 ? hex.split("").map(h => h + h).join("") : hex.padEnd(6, "0");
    const r = parseInt(full.substring(0, 2), 16);
    const g = parseInt(full.substring(2, 4), 16);
    const b = parseInt(full.substring(4, 6), 16);
    if ((0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.25) return "#FFFFFF";
    return c;
  }
  if (c.startsWith("rgb")) {
    const nums = c.match(/\d+/g);
    if (nums && nums.length >= 3) {
      if ((0.299 * +nums[0] + 0.587 * +nums[1] + 0.114 * +nums[2]) / 255 < 0.25) return "#FFFFFF";
    }
    return c;
  }
  return c;
}

function computeFontSize(baseFontSize, text) {
  const charCount = (text || "").replace(/\n/g, "").length;
  if (charCount <= 30) return baseFontSize;
  if (charCount <= 50) return Math.max(baseFontSize * 0.85, 36);
  if (charCount <= 70) return Math.max(baseFontSize * 0.72, 32);
  return Math.max(baseFontSize * 0.60, 28);
}

const BASE_SHADOW = [
  "0 2px 0 rgba(0,0,0,1)",
  "0 4px 12px rgba(0,0,0,0.95)",
  "0 8px 24px rgba(0,0,0,0.8)",
  "0 0 40px rgba(0,0,0,0.6)",
].join(", ");

const NEON_SHADOW = (color) => [
  `0 0 7px ${color}`,
  `0 0 14px ${color}`,
  `0 0 28px ${color}`,
  `0 0 56px ${color}80`,
  "0 2px 0 rgba(0,0,0,1)",
  "0 4px 12px rgba(0,0,0,0.9)",
].join(", ");

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
  const cursorVisible = charsToShow < chars.length && Math.round(frame / 8) % 2 === 0;
  return (
    <div style={{ fontSize: `${fontSize}px`, fontFamily, color, fontWeight,
      textShadow: BASE_SHADOW, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line" }}>
      {visible}
      {cursorVisible && <span style={{ color: "#FFD700" }}>|</span>}
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
    <div style={{ opacity: blockOpacity, textAlign: "center", lineHeight: 1.4 }}>
      {lineWords.map((words, li) => (
        <div key={li} style={{ display: "block" }}>
          {words.map(({ word, idx }, wi) => {
            const isCurrent = idx === currentIdx;
            const isPast = idx < currentIdx;
            return (
              <span key={idx} style={{
                display: "inline-block",
                marginRight: wi < words.length - 1 ? "0.28em" : 0,
                fontFamily,
                fontWeight: isCurrent ? "900" : fontWeight,
                fontSize: isCurrent ? `${Math.round(fontSize * 1.1)}px` : `${fontSize}px`,
                color: isCurrent ? "#FFD700" : isPast ? "rgba(255,255,255,0.5)" : color,
                textShadow: isCurrent
                  ? "0 0 28px rgba(255,215,0,1), 0 0 8px rgba(255,215,0,0.6), 0 2px 0 rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.9)"
                  : BASE_SHADOW,
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
    <div style={{ opacity, fontSize: `${fontSize}px`, fontFamily, color, fontWeight,
      textShadow: BASE_SHADOW, textAlign: "center", lineHeight: 1.2,
      letterSpacing: "0.04em", whiteSpace: "pre-line" }}>
      {chars.map((ch, i) => {
        if (ch === "\n") return <br key={i} />;
        if (ch === " ") return <span key={i}>&nbsp;</span>;
        const charResolveFrame = Math.floor((i / Math.max(chars.length, 1)) * resolveEnd);
        if (frame >= charResolveFrame) return <span key={i}>{ch}</span>;
        const seed = (frame * 7 + i * 13) % SCRAMBLE_CHARS.length;
        return (
          <span key={i} style={{ color: "#FFD700", opacity: 0.85 }}>
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
    <div style={{ opacity: blockOpacity, textAlign: "center", lineHeight: 1.4 }}>
      {lines.map((line, i) => {
        const lineFrame = frame - i * LINE_DELAY;
        const lineOpacity = interpolate(lineFrame, [0, 8], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lineY = interpolate(lineFrame, [0, 10], [24, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic) });
        return (
          <div key={i} style={{
            display: "block", opacity: lineOpacity,
            transform: `translateY(${lineY}px)`,
            fontFamily, fontSize: `${fontSize}px`, color, fontWeight,
            textShadow: BASE_SHADOW, marginBottom: "0.15em",
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
    <div style={{ opacity: blockOpacity, textAlign: "center", lineHeight: 1.6 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={{ fontFamily, fontSize: `${fontSize}px`, color: "rgba(255,255,255,0.7)",
          fontWeight, textShadow: BASE_SHADOW }}>{wrongText}</div>
        <div style={{
          position: "absolute", top: "50%", left: 0,
          height: "3px", background: "#E03434",
          width: `${strikeWidth}%`,
          boxShadow: "0 0 8px rgba(224,52,52,0.8)",
          transform: "translateY(-50%)",
        }} />
      </div>
      {correctText.length > 0 && (
        <div style={{ opacity: correctOpacity, fontFamily,
          fontSize: `${Math.round(fontSize * 1.05)}px`,
          color: "#22C55E", fontWeight,
          textShadow: "0 0 16px rgba(34,197,94,0.8), " + BASE_SHADOW,
          marginTop: "0.2em",
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
  const textOpacity = interpolate(frame, [LOADER_FRAMES, LOADER_FRAMES + 10], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [totalFrames - 8, totalFrames], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dot1 = Math.round(frame / 8) % 3 >= 0 ? 1 : 0.2;
  const dot2 = Math.round(frame / 8) % 3 >= 1 ? 1 : 0.2;
  const dot3 = Math.round(frame / 8) % 3 >= 2 ? 1 : 0.2;
  return (
    <div style={{ textAlign: "center" }}>
      {showLoader ? (
        <div style={{ fontSize: `${fontSize * 1.4}px`, letterSpacing: "0.3em", color: "#FFD700",
          textShadow: BASE_SHADOW }}>
          <span style={{ opacity: dot1 }}>•</span>
          <span style={{ opacity: dot2 }}>•</span>
          <span style={{ opacity: dot3 }}>•</span>
        </div>
      ) : (
        <div style={{ opacity: Math.min(textOpacity, exitOpacity),
          fontFamily, fontSize: `${fontSize}px`, color, fontWeight,
          textShadow: BASE_SHADOW, lineHeight: 1.2, whiteSpace: "pre-line" }}>
          {text}
        </div>
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
      opacity, fontFamily, fontSize: `${fontSize}px`, fontWeight,
      textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
      background: `linear-gradient(90deg, #FFD700 0%, #FFFFFF ${sweep - 15}%, #FFD700 ${sweep}%, #FFFFFF ${sweep + 15}%, #FFD700 100%)`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.9))",
      ...strokeStyle,
    }}>
      {text}
    </div>
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
    <div style={{ position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none" }}>
      <div style={{
        width: "300px", height: "300px", borderRadius: "50%",
        border: `3px solid ${color}`,
        opacity: ringOpacity,
        transform: `scale(${scale})`,
        boxShadow: `0 0 20px ${color}60`,
        position: "absolute",
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const TextOverlay = ({ overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = overlay.endFrame - overlay.startFrame;
  const rawText = overlay.text || "";

  const safeColor   = ensureVisibleColor(overlay.color);
  const posStyle    = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const baseFontSize = overlay.fontSize || 68;
  const fontSize    = computeFontSize(baseFontSize, rawText);
  const fontFamily  = FONT_MAP[overlay.font] || "'Montserrat', sans-serif";
  const fontWeight  = overlay.font === "Montserrat" ? "800" : "bold";

  let opacity         = 1;
  let translateX      = 0;
  let translateY      = 0;
  let scale           = 1;
  let glitchRGBOffset = 0;
  let letterSpacing   = "normal";

  // ── FADE ──
  if (overlay.animation === "fade") {
    opacity = interpolate(frame, [0, 8, totalFrames - 8, totalFrames], [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // ── POP ──
  if (overlay.animation === "pop") {
    const s = spring({ fps, frame, config: { damping: 12, stiffness: 200 } });
    scale = interpolate(s, [0, 1], [0.5, 1]);
    opacity = Math.min(
      interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-LEFT ──
  if (overlay.animation === "slide-left") {
    translateX = interpolate(frame, [0, 12], [-320, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-RIGHT ──
  if (overlay.animation === "slide-right") {
    translateX = interpolate(frame, [0, 12], [320, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-UP ──
  if (overlay.animation === "slide-up") {
    translateY = interpolate(frame, [0, 12], [80, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SLIDE-DOWN ──
  if (overlay.animation === "slide-down") {
    translateY = interpolate(frame, [0, 12], [-80, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── BOUNCE ──
  if (overlay.animation === "bounce") {
    const s = spring({ fps, frame, config: { damping: 8, stiffness: 180, mass: 0.8 } });
    translateY = interpolate(s, [0, 1], [40, 0]);
    opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  }

  // ── ZOOM-PUNCH ──
  if (overlay.animation === "zoom-punch") {
    const s = spring({ fps, frame, config: { damping: 7, stiffness: 280, mass: 0.6 } });
    scale = interpolate(s, [0, 1], [3.2, 1]);
    opacity = Math.min(
      interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── ZOOM-OUT ──
  if (overlay.animation === "zoom-out") {
    scale = interpolate(frame, [0, 30], [1.8, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── HEARTBEAT ──
  if (overlay.animation === "heartbeat") {
    const beatFrame = frame % 45;
    scale = beatFrame < 8
      ? interpolate(beatFrame, [0, 4, 8], [1, 1.06, 1], { extrapolateRight: "clamp" })
      : 1;
    opacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── SHAKE ──
  if (overlay.animation === "shake") {
    const shakeIntensity = interpolate(frame, [0, 8, 18], [1, 0.4, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
    translateX = (Math.sin(frame * 2.8) * 14 + Math.sin(frame * 5.1) * 7) * shakeIntensity;
    translateY = (Math.cos(frame * 3.2) * 10 + Math.cos(frame * 6.7) * 5) * shakeIntensity;
    opacity = Math.min(
      interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── GLITCH ──
  if (overlay.animation === "glitch") {
    opacity = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });
    const initIntensity = interpolate(frame, [0, 15, 30], [1, 0.55, 0], { extrapolateRight: "clamp" });
    const burstFrame = frame % 50;
    const burstIntensity = burstFrame < 4
      ? interpolate(burstFrame, [0, 2, 4], [0, 0.75, 0], { extrapolateRight: "clamp" })
      : 0;
    const intensity = Math.max(initIntensity, burstIntensity);
    const jitter = [3, -2, 5, 0, -3, 1, 0, -5, 2, 0, 4, -1, 0];
    translateX = jitter[frame % jitter.length] * intensity;
    translateY = jitter[(frame + 4) % jitter.length] * intensity * 0.3;
    glitchRGBOffset = intensity;
  }

  // ── LETTER-EXPAND ──
  if (overlay.animation === "letter-expand") {
    const spacingVal = interpolate(frame, [0, 16], [0.3, 0.06],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    letterSpacing = `${spacingVal}em`;
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TEXT SHADOW COMPUTATION
  // ─────────────────────────────────────────────────────────────────────────
  const rgbSplit = glitchRGBOffset > 0.05
    ? `${Math.round(glitchRGBOffset * 6)}px 0 rgba(255,0,60,0.85), ${-Math.round(glitchRGBOffset * 6)}px 0 rgba(0,255,220,0.85), `
    : "";
  const computedTextShadow = `${rgbSplit}${BASE_SHADOW}`;
  const strokeStyle = overlay.stroke
    ? { WebkitTextStroke: `${overlay.stroke.size}px ${overlay.stroke.color}`, textShadow: computedTextShadow }
    : { textShadow: computedTextShadow };

  // ─────────────────────────────────────────────────────────────────────────
  // COMPLEX RENDER BRANCHES
  // ─────────────────────────────────────────────────────────────────────────

  // ── TYPEWRITER ──
  if (overlay.animation === "typewriter") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <TypewriterText text={rawText} fontSize={fontSize} fontFamily={fontFamily}
          color={safeColor} fontWeight={fontWeight} />
      </div>
    );
  }

  // ── WORD-HIGHLIGHT ──
  if (overlay.animation === "word-highlight") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <WordHighlightText text={rawText} fontSize={fontSize} fontFamily={fontFamily}
          color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── SCRAMBLE ──
  if (overlay.animation === "scramble") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <ScrambleText text={rawText} fontSize={fontSize} fontFamily={fontFamily}
          color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── STAGGER ──
  if (overlay.animation === "stagger") {
    const words = rawText.split(" ");
    const DELAY = 4;
    const blockOpacity = Math.min(
      interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: blockOpacity, ...posStyle }}>
        <div style={{ textAlign: "center", lineHeight: 1.3 }}>
          {words.map((word, i) => {
            const wf = frame - i * DELAY;
            const wo = interpolate(wf, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const wy = interpolate(wf, [0, 8], [18, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return (
              <span key={i} style={{ display: "inline-block", marginRight: "0.28em",
                fontFamily, fontSize: `${fontSize}px`, color: safeColor, fontWeight,
                opacity: wo, transform: `translateY(${wy}px)`, ...strokeStyle }}>
                {word}
              </span>
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
        <MultiLineText text={rawText} fontSize={fontSize} fontFamily={fontFamily}
          color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── STRIKE ──
  if (overlay.animation === "strike") {
    const blockOpacity = Math.min(
      interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: blockOpacity, ...posStyle }}>
        <StrikeText text={rawText} fontSize={fontSize} fontFamily={fontFamily}
          color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── ELLIPSIS ──
  if (overlay.animation === "ellipsis") {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <EllipsisText text={rawText} fontSize={fontSize} fontFamily={fontFamily}
          color={safeColor} fontWeight={fontWeight} totalFrames={totalFrames} />
      </div>
    );
  }

  // ── COUNTER ──
  if (overlay.animation === "counter") {
    const numMatch = rawText.match(/[\d,]+(\.\d+)?/);
    const targetRaw = numMatch ? numMatch[0].replace(/,/g, "") : "0";
    const target = parseFloat(targetRaw);
    const hasComma = numMatch && numMatch[0].includes(",");
    const progress = interpolate(frame, [0, Math.max(totalFrames - 20, 10)], [0, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const current = Math.round(progress * target);
    const formatted = hasComma ? current.toLocaleString("en-US") : String(current);
    const displayText = numMatch ? rawText.replace(numMatch[0], formatted) : rawText;
    const cOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: cOpacity, ...posStyle }}>
        <div style={{ fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          ...strokeStyle }}>{displayText}</div>
      </div>
    );
  }

  // ── NEON-GLOW ──
  if (overlay.animation === "neon-glow") {
    const glowColor = overlay.glowColor || safeColor;
    const pulseIntensity = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.7, 1]);
    const nOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: nOpacity, ...posStyle }}>
        <div style={{ fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: NEON_SHADOW(glowColor),
          filter: `brightness(${pulseIntensity})`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── HIGHLIGHT-BOX ──
  if (overlay.animation === "highlight-box") {
    const boxColor = overlay.boxColor || "#FFD700";
    const boxWidth = interpolate(frame, [0, 14], [0, 100],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const hOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: hOpacity, ...posStyle }}>
        <div style={{ position: "relative", display: "inline-block",
          alignSelf: "center", padding: "8px 20px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0,
            width: `${boxWidth}%`, background: boxColor,
            borderRadius: "4px", zIndex: 0,
            boxShadow: `0 0 20px ${boxColor}80`,
          }} />
          <div style={{ position: "relative", zIndex: 1,
            fontFamily, fontSize: `${fontSize}px`,
            color: boxColor === "#FFD700" ? "#000000" : "#FFFFFF",
            fontWeight, textAlign: "center", lineHeight: 1.2,
            whiteSpace: "pre-line",
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── GRADIENT-SWEEP ──
  if (overlay.animation === "gradient-sweep") {
    const sweepPos = interpolate(frame, [0, totalFrames], [-200, 200],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const gOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: gOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          background: `linear-gradient(90deg, #D4A017 0%, #FFFFFF ${sweepPos + 100}%, #FFD700 ${sweepPos + 150}%, #D4A017 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.9)) drop-shadow(0 4px 16px rgba(0,0,0,0.7))",
        }}>{rawText}</div>
      </div>
    );
  }

  // ── OUTLINE ──
  if (overlay.animation === "outline") {
    const oOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    const strokeColor = overlay.strokeColor || safeColor;
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: oOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          WebkitTextStroke: `3px ${strokeColor}`,
          WebkitTextFillColor: "transparent",
          color: "transparent",
          filter: `drop-shadow(0 0 12px ${strokeColor}80) drop-shadow(0 2px 8px rgba(0,0,0,0.9))`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── SHIMMER ──
  if (overlay.animation === "shimmer") {
    const shimmerCycle = frame % 90;
    const shimmerPos = interpolate(shimmerCycle, [0, 60], [-50, 150],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const sOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: sOpacity, ...posStyle }}>
        <div style={{ position: "relative", display: "inline-block", alignSelf: "center" }}>
          <div style={{ fontFamily, fontSize: `${fontSize}px`, color: safeColor,
            fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            textShadow: BASE_SHADOW }}>{rawText}</div>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(90deg, transparent ${shimmerPos - 15}%, rgba(255,255,255,0.55) ${shimmerPos}%, transparent ${shimmerPos + 15}%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily, fontSize: `${fontSize}px`, fontWeight,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── FROSTED ──
  if (overlay.animation === "frosted") {
    const panelOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
    const fOpacity = Math.min(panelOpacity,
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" }));
    const translateYFrosted = interpolate(frame, [0, 12], [30, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 40px",
        opacity: fOpacity, ...posStyle,
        transform: `translateY(${translateYFrosted}px)` }}>
        <div style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "18px 32px",
          alignSelf: "center",
        }}>
          <div style={{ fontFamily, fontSize: `${fontSize}px`, color: safeColor,
            fontWeight, textAlign: "center", lineHeight: 1.25, whiteSpace: "pre-line",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── COLOR-PULSE ──
  if (overlay.animation === "color-pulse") {
    const t = (Math.sin(frame * 0.15) + 1) / 2;
    const pulseOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: pulseOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          color: safeColor,
          filter: `hue-rotate(${Math.round(t * 40)}deg) brightness(${0.9 + t * 0.2})`,
          textShadow: BASE_SHADOW,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── 3D-EXTRUDE ──
  if (overlay.animation === "3d-extrude") {
    const rotateX = interpolate(frame, [0, 20], [-25, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const e3dOpacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: e3dOpacity, ...posStyle, perspective: "800px" }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: BASE_SHADOW,
          transform: `rotateX(${rotateX}deg)`,
          transformOrigin: "center bottom",
        }}>{rawText}</div>
      </div>
    );
  }

  // ── CAPTION-BAR ──
  if (overlay.animation === "caption-bar") {
    const barColor = overlay.barColor || "#D4A017";
    const slideY = interpolate(frame, [0, 10], [60, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const cBarOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "8%",
        opacity: cBarOpacity, transform: `translateY(${slideY}px)` }}>
        <div style={{
          background: barColor, padding: "10px 40px",
          boxShadow: `0 0 24px ${barColor}60, 0 4px 16px rgba(0,0,0,0.8)`,
        }}>
          <div style={{ fontFamily, fontSize: `${Math.min(fontSize, 52)}px`,
            color: "#000000", fontWeight: "900",
            textAlign: "center", lineHeight: 1.1,
            letterSpacing: "0.04em", whiteSpace: "pre-line",
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
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px", ...posStyle }}>
        <GradientText text={rawText} fontSize={fontSize} fontFamily={fontFamily}
          fontWeight={fontWeight} totalFrames={totalFrames} strokeStyle={strokeStyle} />
      </div>
    );
  }

  // ── OUTLINED (hollow text — stroke only) ──
  if (overlay.animation === "outlined") {
    const outOpacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: outOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, fontWeight,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          WebkitTextStroke: `3px ${safeColor}`,
          WebkitTextFillColor: "transparent",
          color: "transparent",
          filter: `drop-shadow(0 0 12px ${safeColor}80) drop-shadow(0 2px 8px rgba(0,0,0,0.9))`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── MASK-REVEAL (circle expands to reveal text) ──
  if (overlay.animation === "mask-reveal") {
    const maskProgress = interpolate(frame, [0, 18], [0, 100],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const exitOpacity = interpolate(frame, [totalFrames - 8, totalFrames], [1, 0],
      { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: exitOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          ...strokeStyle,
          clipPath: `circle(${maskProgress}% at 50% 50%)`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── PIXEL-DISSOLVE (pixelates out on exit) ──
  if (overlay.animation === "pixel-dissolve") {
    const DISSOLVE_START = totalFrames - 20;
    const entryOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
    const dissolveProgress = interpolate(frame, [DISSOLVE_START, totalFrames], [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const pixelSize = interpolate(dissolveProgress, [0, 0.5, 1], [0, 8, 32]);
    const exitOpacity = interpolate(dissolveProgress, [0.7, 1.0], [1, 0], { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: Math.min(entryOpacity, exitOpacity), ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          ...strokeStyle,
          imageRendering: "pixelated",
          filter: pixelSize > 0 ? `blur(${pixelSize * 0.3}px) contrast(${1 + dissolveProgress})` : "none",
          transform: `scale(${1 + dissolveProgress * 0.08})`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── VHS (tracking lines + position distortion) ──
  if (overlay.animation === "vhs") {
    const trackingY = ((frame * 3.5) % 200) - 20;
    const distort = Math.sin(frame * 0.4) * 3;
    const vhsOpacity = Math.min(
      interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: vhsOpacity, ...posStyle, overflow: "hidden" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, color: safeColor,
            fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            transform: `translateX(${distort}px)`,
            ...strokeStyle,
          }}>{rawText}</div>
          <div style={{
            position: "absolute", left: 0, right: 0,
            top: `${(trackingY / 200) * 100}%`,
            height: "3px",
            background: "rgba(255,255,255,0.12)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            fontFamily, fontSize: `${fontSize}px`, fontWeight,
            textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            color: "rgba(255,0,60,0.3)",
            transform: `translateX(${distort + 4}px)`,
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
      if (frame >= sf && frame < sf + BURST_DURATION) {
        strobeIntensity = Math.max(strobeIntensity,
          interpolate(frame - sf, [0, 1, BURST_DURATION - 1, BURST_DURATION], [0, 0.85, 0.5, 0]));
      }
    }
    const textOpacity = Math.min(
      interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <>
        {strobeIntensity > 0 && (
          <AbsoluteFill style={{
            background: `rgba(255,255,255,${strobeIntensity})`,
            zIndex: 25, pointerEvents: "none",
          }} />
        )}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          display: "flex", flexDirection: "column", padding: "0 60px",
          opacity: textOpacity, ...posStyle }}>
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, color: safeColor,
            fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            ...strokeStyle,
          }}>{rawText}</div>
        </div>
      </>
    );
  }

  // ── PULSE-RING (expanding ring behind text) ──
  if (overlay.animation === "pulse-ring") {
    const ringColor = overlay.ringColor || safeColor;
    const prOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: prOpacity, ...posStyle }}>
        <div style={{ position: "relative", display: "inline-block", alignSelf: "center" }}>
          <PulseRingBG color={ringColor} />
          <div style={{
            position: "relative", zIndex: 1,
            fontFamily, fontSize: `${fontSize}px`, color: safeColor,
            fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            ...strokeStyle,
          }}>{rawText}</div>
        </div>
      </div>
    );
  }

  // ── UNDERLINE-DRAW (SVG line draws under text) ──
  if (overlay.animation === "underline-draw") {
    const lineProgress = interpolate(frame, [8, 24], [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const udOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: udOpacity, ...posStyle }}>
        <div style={{ position: "relative", display: "inline-block", alignSelf: "center" }}>
          <div style={{
            fontFamily, fontSize: `${fontSize}px`, color: safeColor,
            fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
            ...strokeStyle,
          }}>{rawText}</div>
          <svg style={{
            position: "absolute", bottom: "-6px", left: "0", right: "0",
            width: "100%", height: "6px", overflow: "visible",
          }}>
            <line
              x1="0" y1="3" x2="100%" y2="3"
              stroke={safeColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={`${(1 - lineProgress) * 1000}`}
              style={{ filter: `drop-shadow(0 0 6px ${safeColor})` }}
            />
          </svg>
        </div>
      </div>
    );
  }

  // ── WEIGHT-SHIFT (font weight 300 → 900 on entry) ──
  if (overlay.animation === "weight-shift") {
    const weightProgress = interpolate(frame, [0, 16], [0, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const weight = Math.round(interpolate(weightProgress, [0, 1], [300, 900]));
    const wsOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: wsOpacity, ...posStyle }}>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: `${fontSize}px`, color: safeColor,
          fontWeight: weight,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          textShadow: BASE_SHADOW,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── DIAGONAL-WIPE (diagonal clip-path entrance) ──
  if (overlay.animation === "diagonal-wipe") {
    const wipe = interpolate(frame, [0, 18], [0, 100],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const exitOpacity = interpolate(frame, [totalFrames - 8, totalFrames], [1, 0],
      { extrapolateLeft: "clamp" });
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: exitOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          fontWeight, textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          ...strokeStyle,
          clipPath: `polygon(0 0, ${wipe}% 0, ${wipe + 20}% 100%, 0 100%)`,
        }}>{rawText}</div>
      </div>
    );
  }

  // ── CAPS (force uppercase + wide letter spacing) ──
  if (overlay.animation === "caps") {
    const capsSpacing = interpolate(frame, [0, 14], [0.6, 0.1], { extrapolateRight: "clamp" });
    const capsOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", padding: "0 60px",
        opacity: capsOpacity, ...posStyle }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          fontWeight, textAlign: "center", lineHeight: 1.2,
          textTransform: "uppercase",
          letterSpacing: `${capsSpacing}em`,
          ...strokeStyle,
        }}>{rawText}</div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STANDARD RENDER — all simple transform animations
  // ─────────────────────────────────────────────────────────────────────────
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
        color: safeColor,
        textAlign: "center",
        lineHeight: 1.2,
        whiteSpace: "pre-line",
        fontWeight,
        letterSpacing,
        ...strokeStyle,
      }}>
        {rawText}
      </div>
    </div>
  );
};
