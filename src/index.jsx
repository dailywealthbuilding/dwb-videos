import { registerRoot, Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition.jsx';

const days = ['day22','day23','day24','day25','day26','day27','day28'];

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
