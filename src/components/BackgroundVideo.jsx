import { OffthreadVideo, Sequence, useCurrentFrame, interpolate, staticFile } from 'remotion';

const V = (name) => staticFile('videos/' + name + '.mp4');

const VIDEO_SETS = {
  day29: [ V('person_thinking'),     V('frustrated_laptop'),   V('desk_workspace'),      V('entrepreneur_laptop')  ],
  day30: [ V('business_statistics'), V('laptop_income'),       V('social_media_phone'),  V('business_statistics')  ],
  day31: [ V('writing_notes'),       V('person_thinking'),     V('laptop_income'),       V('desk_workspace')       ],
  day32: [ V('social_media_phone'),  V('content_creator'),     V('desk_workspace'),      V('entrepreneur_laptop')  ],
  day33: [ V('phone_filming'),       V('desk_workspace'),      V('content_creator'),     V('clock_time')           ],
  day34: [ V('entrepreneur_laptop'), V('small_business'),      V('laptop_income'),       V('frustrated_laptop')    ],
  day35: [ V('calendar_planning'),   V('business_statistics'), V('writing_notes'),       V('desk_workspace')       ],
};

const CLIP_DURATION_FRAMES = 225;
const CROSSFADE_FRAMES = 8;

export const BackgroundVideo = ({ videoId }) => {
  const frame = useCurrentFrame();
  const clips = VIDEO_SETS[videoId] || VIDEO_SETS['day29'];

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
