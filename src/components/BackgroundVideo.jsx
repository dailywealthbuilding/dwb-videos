import { OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

const CLOUD = 'defyg5zro8';
const F = `https://res.cloudinary.com/${CLOUD}/video/upload/dwb`;

const VIDEO_SETS = {
  day22: [
    `${F}/entrepreneur_laptop.mp4`,
    `${F}/person_thinking.mp4`,
    `${F}/laptop_income.mp4`,
    `${F}/desk_workspace.mp4`,
  ],
  day23: [
    `${F}/social_media_phone.mp4`,
    `${F}/social_media_phone.mp4`,
    `${F}/content_creator.mp4`,
    `${F}/social_media_phone.mp4`,
  ],
  day24: [
    `${F}/content_creator.mp4`,
    `${F}/laptop_income.mp4`,
    `${F}/content_creator.mp4`,
    `${F}/desk_workspace.mp4`,
  ],
  day25: [
    `${F}/person_thinking.mp4`,
    `${F}/writing_notes.mp4`,
    `${F}/person_thinking.mp4`,
    `${F}/desk_workspace.mp4`,
  ],
  day26: [
    `${F}/frustrated_laptop.mp4`,
    `${F}/frustrated_laptop.mp4`,
    `${F}/small_business.mp4`,
    `${F}/business_setup.mp4`,
  ],
  day27: [
    `${F}/clock_time.mp4`,
    `${F}/stopwatch_timer.mp4`,
    `${F}/calendar_planning.mp4`,
    `${F}/phone_filming.mp4`,
  ],
  day28: [
    `${F}/phone_filming.mp4`,
    `${F}/business_statistics.mp4`,
    `${F}/desk_workspace.mp4`,
    `${F}/entrepreneur_laptop.mp4`,
  ],
};

const CLIP_DURATION_FRAMES = 225; // 7.5s at 30fps
const CROSSFADE_FRAMES = 8;

export const BackgroundVideo = ({ videoId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity,
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
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
