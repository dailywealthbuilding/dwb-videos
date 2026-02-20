import { AbsoluteFill, useCurrentFrame, Sequence, Video } from "remotion";
import { TextOverlay } from "../components/TextOverlay.jsx";
import { BackgroundVideo } from "../components/BackgroundVideo.jsx";

// Content data uses 420-frame scale, we scale to 900 (30 seconds at 30fps)
const SCALE = 900 / 420;

export const VideoComposition = ({ video }) => {
  const scaledOverlays = video.overlays.map((overlay) => ({
    ...overlay,
    startFrame: Math.round(overlay.startFrame * SCALE),
    endFrame: Math.round(overlay.endFrame * SCALE),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <BackgroundVideo pexelsSearchTerms={video.pexelsSearchTerms} />

      {/* Dark overlay for readability */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.45)" }} />

      {/* Text overlays */}
      {scaledOverlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={overlay.startFrame}
          durationInFrames={overlay.endFrame - overlay.startFrame}
        >
          <TextOverlay overlay={overlay} />
        </Sequence>
      ))}

      {/* Branding watermark */}
      <AbsoluteFill style={{ display:"flex", alignItems:"flex-end",
        justifyContent:"flex-end", padding:"40px" }}>
        <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:"28px",
          color:"rgba(255,255,255,0.6)", fontWeight:"bold",
          textShadow:"1px 1px 3px rgba(0,0,0,0.8)" }}>
          @DailyWealthBuilding
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};