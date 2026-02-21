import { OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// Direct Pixabay CDN URLs — no Cloudinary needed
const VIDEO_SETS = {
  day22: [
    'https://cdn.pixabay.com/video/2017/07/23/10822-226624975_medium.mp4',
    'https://cdn.pixabay.com/video/2018/03/09/14105-259487534_medium.mp4',
    'https://cdn.pixabay.com/video/2019/04/04/22654-328405267_medium.mp4',
    'https://cdn.pixabay.com/video/2016/12/22/6782-196664429_medium.mp4',
  ],
  day23: [
    'https://cdn.pixabay.com/video/2020/05/25/40846-424680913_medium.mp4',
    'https://cdn.pixabay.com/video/2018/10/15/18706-295017227_medium.mp4',
    'https://cdn.pixabay.com/video/2019/09/16/27060-360554070_medium.mp4',
    'https://cdn.pixabay.com/video/2020/05/25/40846-424680913_medium.mp4',
  ],
  day24: [
    'https://cdn.pixabay.com/video/2019/09/16/27060-360554070_medium.mp4',
    'https://cdn.pixabay.com/video/2017/07/23/10822-226624975_medium.mp4',
    'https://cdn.pixabay.com/video/2018/03/09/14105-259487534_medium.mp4',
    'https://cdn.pixabay.com/video/2016/12/22/6782-196664429_medium.mp4',
  ],
  day25: [
    'https://cdn.pixabay.com/video/2018/03/09/14105-259487534_medium.mp4',
    'https://cdn.pixabay.com/video/2017/07/23/10822-226624975_medium.mp4',
    'https://cdn.pixabay.com/video/2019/04/04/22654-328405267_medium.mp4',
    'https://cdn.pixabay.com/video/2016/12/22/6782-196664429_medium.mp4',
  ],
  day26: [
    'https://cdn.pixabay.com/video/2019/04/04/22654-328405267_medium.mp4',
    'https://cdn.pixabay.com/video/2018/10/15/18706-295017227_medium.mp4',
    'https://cdn.pixabay.com/video/2017/07/23/10822-226624975_medium.mp4',
    'https://cdn.pixabay.com/video/2016/12/22/6782-196664429_medium.mp4',
  ],
  day27: [
    'https://cdn.pixabay.com/video/2016/12/22/6782-196664429_medium.mp4',
    'https://cdn.pixabay.com/video/2018/03/09/14105-259487534_medium.mp4',
    'https://cdn.pixabay.com/video/2020/05/25/40846-424680913_medium.mp4',
    'https://cdn.pixabay.com/video/2019/09/16/27060-360554070_medium.mp4',
  ],
  day28: [
    'https://cdn.pixabay.com/video/2018/10/15/18706-295017227_medium.mp4',
    'https://cdn.pixabay.com/video/2019/04/04/22654-328405267_medium.mp4',
    'https://cdn.pixabay.com/video/2016/12/22/6782-196664429_medium.mp4',
    'https://cdn.pixabay.com/video/2017/07/23/10822-226624975_medium.mp4',
  ],
};

const CLIP_DURATION_FRAMES = 225;
const CROSSFADE_FRAMES = 8;

export const BackgroundVideo = ({ videoId }) => {
  const frame = useCurrentFrame();
  const clips = VIDEO_SETS[videoId] || VIDEO_SETS['day22'];

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {clips.map((src, i) => {
        const startFrame = i * CLIP_DURATION_FRAMES;
        const endFrame = startFrame + CLIP_DURATION_FRAMES;

        const zoom = interpolate(
          frame,
          [startFrame, endFrame],
          [1.0, 1.08],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const opacity = interpolate(
          frame,
          [startFrame, startFrame + CROSSFADE_FRAMES, endFrame - CROSSFADE_FRAMES, endFrame],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <Sequence key={i} from={startFrame} durationInFrames={CLIP_DURATION_FRAMES}>
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}>
              <OffthreadVideo
                src={src}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
              />
            </div>
          </Sequence>
        );
      })}
    </div>
  );
};
