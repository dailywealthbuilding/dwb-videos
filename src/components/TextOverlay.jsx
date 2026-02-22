import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

const FONT_MAP = {
  Anton: "'Anton', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  Gabon: "'Cabin Sketch', sans-serif",
};

const POSITION_STYLES = {
  "top-center":    { top: "15%",   left: 0, right: 0, alignItems: "center", justifyContent: "flex-start" },
  top:             { top: "15%",   left: 0, right: 0, alignItems: "center", justifyContent: "flex-start" },
  middle:          { top: 0,       left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  "bottom-center": { bottom: "15%", left: 0, right: 0, alignItems: "center", justifyContent: "flex-end" },
  center:          { alignItems: "center", justifyContent: "center" },
  bottom:          { bottom: "15%", left: 0, right: 0, alignItems: "center", justifyContent: "flex-end" },
};

function ensureVisibleColor(color) {
  if (!color) return "#FFFFFF";
  const c = String(color).trim();
  const darkNames = ["black", "#000", "#000000", "transparent", "none", ""];
  if (darkNames.includes(c.toLowerCase())) return "#FFFFFF";

  if (c.startsWith("#")) {
    const hex = c.replace("#", "");
    const full =
      hex.length === 3
        ? hex.split("").map((h) => h + h).join("")
        : hex.padEnd(6, "0");
    const r = parseInt(full.substring(0, 2), 16);
    const g = parseInt(full.substring(2, 4), 16);
    const b = parseInt(full.substring(4, 6), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (lum < 0.25) return "#FFFFFF";
    return c;
  }

  if (c.startsWith("rgb")) {
    const nums = c.match(/\d+/g);
    if (nums && nums.length >= 3) {
      const lum = (0.299 * +nums[0] + 0.587 * +nums[1] + 0.114 * +nums[2]) / 255;
      if (lum < 0.25) return "#FFFFFF";
    }
    return c;
  }

  return c;
}

export const TextOverlay = ({ overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = overlay.endFrame - overlay.startFrame;

  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  if (overlay.animation === "fade") {
    opacity = interpolate(
      frame,
      [0, 8, totalFrames - 8, totalFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  if (overlay.animation === "pop") {
    const s = spring({ fps, frame, config: { damping: 12, stiffness: 200 } });
    scale = interpolate(s, [0, 1], [0.5, 1]);
    opacity = Math.min(
      interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(frame, [totalFrames - 6, totalFrames], [1, 0], { extrapolateLeft: "clamp" })
    );
  }

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

  if (overlay.animation === "bounce") {
    const s = spring({ fps, frame, config: { damping: 8, stiffness: 180, mass: 0.8 } });
    translateY = interpolate(s, [0, 1], [40, 0]);
    opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  }

  const strokeStyle = overlay.stroke
    ? {
        WebkitTextStroke: `${overlay.stroke.size}px ${overlay.stroke.color}`,
        textShadow: "0 4px 12px rgba(0,0,0,0.9)",
      }
    : {
        textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.8)",
      };

  const safeColor = ensureVisibleColor(overlay.color);
  const posStyle = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;
  const fontSize = overlay.fontSize ? overlay.fontSize : 68;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        padding: "0 60px",
        opacity,
        ...posStyle,
        transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MAP[overlay.font] || "'Montserrat', sans-serif",
          fontSize: `${fontSize}px`,
          color: safeColor,
          textAlign: "center",
          lineHeight: 1.2,
          whiteSpace: "pre-line",
          fontWeight: overlay.font === "Montserrat" ? "800" : "bold",
          ...strokeStyle,
        }}
      >
        {overlay.text}
      </div>
    </div>
  );
};
