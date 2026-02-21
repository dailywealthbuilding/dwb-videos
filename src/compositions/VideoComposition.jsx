import { AbsoluteFill, Sequence } from "remotion";
import { TextOverlay } from "../components/TextOverlay.jsx";
import { BackgroundVideo } from "../components/BackgroundVideo.jsx";

const SCALE = 900 / 420;

export const VideoComposition = ({ video }) => {
  const scaledOverlays = video.overlays.map((overlay) => ({
    ...overlay,
    startFrame: Math.round(overlay.startFrame * SCALE),
    endFrame: Math.round(overlay.endFrame * SCALE),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <BackgroundVideo pixabaySearchTerms={video.pixabaySearchTerms} />

      {/* Lightened from 0.45 → 0.35 so background shows through more */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />

      {scaledOverlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={overlay.startFrame}
          durationInFrames={overlay.endFrame - overlay.startFrame}
        >
          <TextOverlay overlay={overlay} />
        </Sequence>
      ))}

      {/* Watermark */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "0 40px 40px 0",
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "28px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: "bold",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            letterSpacing: "0.5px",
          }}
        >
          @DailyWealthBuilding
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
