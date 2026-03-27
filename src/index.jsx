import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

const loadWeek = (file) => {
  try {
    const m = require(`./${file}`);
    return m.default || Object.values(m)[0] || [];
  } catch(e) { return []; }
};

const ALL_CONTENT = [
  ...loadWeek('week6-content.js'),
  ...loadWeek('week7-content.js'),
];

export const RemotionRoot = () => {
  return (
    <>
      {ALL_CONTENT.map((data) => (
        <Composition
          key={data.id}
          id={data.id}
          component={VideoComposition}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ 
            videoId: data.id, 
            music: data.music, 
            overlays: data.overlays 
          }}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);
