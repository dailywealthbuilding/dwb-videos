import { Composition } from "remotion";
import { VideoComposition } from "./compositions/VideoComposition.jsx";
import { WEEK4_VIDEOS } from "./week4-content.js";

// 30 seconds x 30 fps = 900 frames
const DURATION_IN_FRAMES = 900;
const FPS = 30;

export const RemotionRoot = () => {
  return (
    <>
      {WEEK4_VIDEOS.map((video) => (
        <Composition
          key={video.id}
          id={video.id}
          component={VideoComposition}
          durationInFrames={DURATION_IN_FRAMES}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ video }}
        />
      ))}
    </>
  );
};