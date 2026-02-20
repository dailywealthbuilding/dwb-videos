import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

const FONT_MAP = {
  Anton: "'Anton', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  Bebas: "'Bebas Neue', sans-serif",
};

const POSITION_STYLES = {
  "top-center": { top:"80px", left:"0", right:"0",
    alignItems:"center", justifyContent:"flex-start" },
  middle: { top:"0", bottom:"0", left:"0", right:"0",
    alignItems:"center", justifyContent:"center" },
  "bottom-center": { bottom:"120px", left:"0", right:"0",
    alignItems:"center", justifyContent:"flex-end" },
};

export const TextOverlay = ({ overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = overlay.endFrame - overlay.startFrame;

  let opacity = 1, translateX = 0, translateY = 0, scale = 1;

  if (overlay.animation === "fade") {
    opacity = interpolate(frame, [0, 8, totalFrames - 8, totalFrames],
      [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  }
  if (overlay.animation === "pop") {
    const s = spring({ fps, frame, config:{ damping:12, stiffness:200 } });
    scale = interpolate(s, [0, 1], [0.5, 1]);
    opacity = Math.min(
      interpolate(frame, [0, 6], [0, 1], { extrapolateRight:"clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0],
        { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
    );
  }
  if (overlay.animation === "slide-left") {
    translateX = interpolate(frame, [0, 12], [-120, 0],
      { extrapolateRight:"clamp", easing: Easing.out(Easing.cubic) });
    opacity = Math.min(
      interpolate(frame, [0, 10], [0, 1], { extrapolateRight:"clamp" }),
      interpolate(frame, [totalFrames - 8, totalFrames], [1, 0],
        { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
    );
  }
  if (overlay.animation === "bounce") {
    const s = spring({ fps, frame, config:{ damping:8, stiffness:180, mass:0.8 } });
    translateY = interpolate(s, [0, 1], [60, 0]);
    opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight:"clamp" });
  }

  const strokeStyle = overlay.stroke ? {
    WebkitTextStroke: `${overlay.stroke.size}px ${overlay.stroke.color}`,
    textShadow: `0 4px 12px rgba(0,0,0,0.9)`,
  } : { textShadow: "0 2px 8px rgba(0,0,0,0.9)" };

  const posStyle = POSITION_STYLES[overlay.position] || POSITION_STYLES.middle;

  return (
    <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0,
      display:"flex", flexDirection:"column", padding:"0 60px",
      ...posStyle, opacity,
      transform:`translateX(${translateX}px) translateY(${translateY}px) scale(${scale})` }}>
      <div style={{ fontFamily: FONT_MAP[overlay.font] || FONT_MAP.Montserrat,
        fontSize:`${overlay.fontSize || 52}px`, color: overlay.color,
        textAlign:"center", lineHeight:1.2, whiteSpace:"pre-line",
        fontWeight: overlay.font === "Montserrat" ? "700" : "400",
        ...strokeStyle }}>
        {overlay.text}
      </div>
    </div>
  );
};