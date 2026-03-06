import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

const days = ['day29','day30','day31','day32','day33','day34','day35'];

export const RemotionRoot = () => {
  return (
    <>
      {days.map(dayId => (
        <Composition
          key={dayId}
          id={dayId}
          component={VideoComposition}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ videoId: dayId }}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);
