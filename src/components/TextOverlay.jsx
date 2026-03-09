import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

// ─────────────────────────────────────────────
// FONT MAP
// ─────────────────────────────────────────────
const FONT_MAP = {
  Anton: "'Anton', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  Gabon: "'Cabin Sketch', sans-serif",
};

// ─────────────────────────────────────────────
// POSITION MAP
// ─────────────────────────────────────────────
const POSITION_STYLES = {
  "top-center":    { top: "18%",    left: 0, right: 0, alignItems: "center", justifyContent: "flex-start" },
  top:             { top: "18%",    left: 0, right: 0, alignItems: "center", justifyContent: "flex-start" },
  middle:          { top: 0,        left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  "bottom-center": { bottom: "22%", left: 0, right: 0, alignItems: "center", justifyContent: "flex-end" },
  center:          { alignItems: "center", justifyContent: "center" },
  bottom:          { bottom: "22%", left: 0, right: 0, alignItems: "center", justifyContent: "flex-end" },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// Ensures no dark/invisible text ever reaches the screen
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

// Auto-shrinks font so long text never overflows
function computeFontSize(baseFontSize, text) {
  const charCount = (text || "").replace(/\n/g, "").length;
  if (charCount <= 30) return baseFontSize;
  if (charCount <= 50) return Math.max(baseFontSize * 0.85, 36);
  if (charCount <= 70) return Math.max(baseFontSize * 0.72, 32);
  return Math.max(baseFontSize * 0.60, 28);
}

// ─────────────────────────────────────────────
// TYPEWRITER — reveals text character by character
// ─────────────────────────────────────────────
const TypewriterText = ({ text, fontSize, fontFamily, color, fontWeight, textShadow }) => {
  const frame = useCurrentFrame();
  const chars = text.split('');
  const charsToShow = Math.floor(
    interpolate(frame, [0, 100], [0, chars.length], { extrapolateRight: 'clamp' })
  );
  const visible = chars.slice(0, charsToShow).join('');
  const cursorVisible = charsToShow < chars.length && Math.round(frame / 8) % 2 === 0;

  return (
    <div style={{
      fontSize: `${fontSize}px`, fontFamily, color, fontWeight,
      textShadow, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'pre-line',
    }}>
      {visible}
      {cursorVisible && <span style={{ opacity: 1, color: '#FFFFFF' }}>|</span>}
    </div>
  );
};

// ─────────────────────────────────────────────
// WORD-HIGHLIGHT — spotlights each word as it's spoken
// ─────────────────────────────────────────────
const WordHighlightText = ({ text, fontSize, fontFamily, color, fontWeight, totalFrames }) => {
  const frame = useCurrentFrame();

  // Parse lines → words with global indices
  const lines = text.split('\n');
  let globalIdx = 0;
  const lineWords = lines.map(line =>
    line.split(' ').filter(w => w.length > 0).map(word => ({ word, idx: globalIdx++ }))
  );
  const totalWords = globalIdx;
  const framesPerWord = Math.max(1, Math.floor(totalFrames / Math.max(totalWords, 1)));
  const currentIdx = Math.min(Math.floor(frame / framesPerWord), totalWords - 1);

  // Fade out whole block near end
  const blockOpacity = interpolate(
    frame, [totalFrames - 10, totalFrames],
    [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div style={{ opacity: blockOpacity, textAlign: 'center', lineHeight: 1.4 }}>
      {lineWords.map((words, lineIdx) => (
        <div key={lineIdx} style={{ display: 'block' }}>
          {words.map(({ word, idx }, wIdx) => {
            const isCurrent = idx === currentIdx;
            const isPast = idx < currentIdx;
            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  marginRight: wIdx < words.length - 1 ? '0.28em' : 0,
                  fontFamily,
                  fontWeight: isCurrent ? '900' : fontWeight,
                  fontSize: isCurrent ? `${Math.round(fontSize * 1.1)}px` : `${fontSize}px`,
                  color: isCurrent ? '#FFD700' : isPast ? 'rgba(255,255,255,0.5)' : color,
                  textShadow: isCurrent
                    ? '0 0 28px rgba(255,215,0,1), 0 0 8px rgba(255,215,0,0.6), 0 2px 0 rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.9)'
                    : '0 2px 0 rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.9)',
                  transform: isCurrent ? 'scale(1.06)' : 'scale(1)',
                  transition: 'none',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN TEXT OVERLAY
// ─────────────────────────────────────────────
export const TextOverlay = ({ overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = overlay.endFrame - overlay.startFrame;

  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;
  let glitchRGBOffset = 0;

  // ── ANIMATION: Fade ──
  if (overlay.animation === "fade") {
    opacity = interpolate(
      frame, [0, 8, totalFrames - 8, totalFrames], [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  // ── ANIMATION: Pop (spring scale-in) ──
  if (overlay.animation === "pop") {
    const s = spring({ fps, frame, config: { damping: 12, stiffness: 200 } });
    scale = interpolate(s, [0, 1], [0.5, 1]);
    opacity = Math.min(
      interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── ANIMATION: Slide Left (enter from right) ──
  if (overlay.animation === "slide-left") {
    translateX = interpolate(frame, [0, 12], [-320, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── ANIMATION: Slide Right (enter from left) ──
  if (overlay.animation === "slide-right") {
    translateX = interpolate(frame, [0, 12], [320, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── ANIMATION: Bounce (spring from below) ──
  if (overlay.animation === "bounce") {
    const s = spring({ fps, frame, config: { damping: 8, stiffness: 180, mass: 0.8 } });
    translateY = interpolate(s, [0, 1], [40, 0]);
    opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  }

  // ── ANIMATION: Camera Shake (violent entry, settles fast) ──
  if (overlay.animation === "shake") {
    opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });

    // Violent shake frames 0-8, decays to zero by frame 18
    const shakeIntensity = interpolate(
      frame, [0, 8, 18], [1, 0.4, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
    );

    // Sin-wave jitter pattern — seeded so it's deterministic every render
    const shakeX = Math.sin(frame * 2.8) * 14 * shakeIntensity
                 + Math.sin(frame * 5.1) * 7  * shakeIntensity;
    const shakeY = Math.cos(frame * 3.2) * 10 * shakeIntensity
                 + Math.cos(frame * 6.7) * 5  * shakeIntensity;

    translateX = shakeX;
    translateY = shakeY;

    // Fade out gracefully near end
    opacity = Math.min(
      opacity,
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

  // ── ANIMATION: Glitch (RGB split + position jitter) ──
  if (overlay.animation === "glitch") {
    opacity = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });

    // Intense glitch entry, settles after frame 30
    const initIntensity = interpolate(frame, [0, 15, 30], [1, 0.55, 0], { extrapolateRight: "clamp" });

    // Periodic glitch bursts every ~50 frames
    const burstFrame = frame % 50;
    const burstIntensity = burstFrame < 4
      ? interpolate(burstFrame, [0, 2, 4], [0, 0.75, 0], { extrapolateRight: "clamp" })
      : 0;

    const intensity = Math.max(initIntensity, burstIntensity);
    const jitterPattern = [3, -2, 5, 0, -3, 1, 0, -5, 2, 0, 4, -1, 0];
    translateX = jitterPattern[frame % jitterPattern.length] * intensity;
    translateY = jitterPattern[(frame + 4) % jitterPattern.length] * intensity * 0.3;
    glitchRGBOffset = intensity;
  }

  // ─────────────────────────────────────────────
  // TEXT SHADOW — rich 4-layer + optional RGB split for glitch
  // ─────────────────────────────────────────────
  const baseLayerShadow = [
    "0 2px 0 rgba(0,0,0,1)",
    "0 4px 12px rgba(0,0,0,0.95)",
    "0 8px 24px rgba(0,0,0,0.8)",
    "0 0 40px rgba(0,0,0,0.6)",
  ].join(", ");

  const rgbSplit = glitchRGBOffset > 0.05
    ? `${Math.round(glitchRGBOffset * 6)}px 0 rgba(255,0,60,0.85), ${-Math.round(glitchRGBOffset * 6)}px 0 rgba(0,255,220,0.85), `
    : "";

  const computedTextShadow = `${rgbSplit}${baseLayerShadow}`;

  const strokeStyle = overlay.stroke
    ? { WebkitTextStroke: `${overlay.stroke.size}px ${overlay.stroke.color}`, textShadow: computedTextShadow }
    : { textShadow: computedTextShadow };

  const safeColor = ensureVisibleColor(overlay.color);
  const posStyle = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const baseFontSize = overlay.fontSize || 68;
  const fontSize = computeFontSize(baseFontSize, overlay.text);
  const fontFamily = FONT_MAP[overlay.font] || "'Montserrat', sans-serif";
  const fontWeight = overlay.font === "Montserrat" ? "800" : "bold";

  // ── COUNTER: animates numbers from 0 to target value ──
  // Usage: text="3,500 Views" — it finds the number and animates it
  if (overlay.animation === "counter") {
    // Extract numeric part from text (handles commas, decimals)
    const rawText = overlay.text || "";
    const numMatch = rawText.match(/[\d,]+(\.\d+)?/);
    const targetRaw = numMatch ? numMatch[0].replace(/,/g, "") : "0";
    const target = parseFloat(targetRaw);
    const hasComma = numMatch && numMatch[0].includes(",");

    // Ease-out curve — fast at start, slows to final value
    const progress = interpolate(
      frame, [0, Math.max(totalFrames - 20, 10)], [0, 1],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );
    const current = Math.round(progress * target);
    const formatted = hasComma ? current.toLocaleString("en-US") : String(current);
    const displayText = numMatch
      ? rawText.replace(numMatch[0], formatted)
      : rawText;

    const counterOpacity = Math.min(
      interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );

    return (
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column",
        padding: "0 60px", opacity: counterOpacity, ...posStyle,
      }}>
        <div style={{
          fontFamily, fontSize: `${fontSize}px`, color: safeColor,
          textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line",
          fontWeight, ...strokeStyle,
        }}>
          {displayText}
        </div>
      </div>
    );
  }

  // ── TYPEWRITER: separate render branch ──
  if (overlay.animation === "typewriter") {
    return (
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column",
        padding: "0 60px", ...posStyle,
      }}>
        <TypewriterText
          text={overlay.text}
          fontSize={fontSize}
          fontFamily={fontFamily}
          color={safeColor}
          fontWeight={fontWeight}
          textShadow={baseLayerShadow}
        />
      </div>
    );
  }

  // ── WORD-HIGHLIGHT: separate render branch ──
  if (overlay.animation === "word-highlight") {
    return (
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column",
        padding: "0 60px", ...posStyle,
      }}>
        <WordHighlightText
          text={overlay.text}
          fontSize={fontSize}
          fontFamily={fontFamily}
          color={safeColor}
          fontWeight={fontWeight}
          totalFrames={totalFrames}
        />
      </div>
    );
  }

  // ── ALL OTHER ANIMATIONS: standard render ──
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
        ...strokeStyle,
      }}>
        {overlay.text}
      </div>
    </div>
  );
};
