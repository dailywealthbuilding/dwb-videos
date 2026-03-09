import { OffthreadVideo, Sequence, useCurrentFrame, interpolate, staticFile } from 'remotion';

const V = (name) => staticFile('videos/' + name + '.mp4');

const VIDEO_SETS = {
  day29: [ V('day29_clip1'), V('day29_clip2'), V('day29_clip3'), V('day29_clip4') ],
  day30: [ V('day30_clip1'), V('day30_clip2'), V('day30_clip3'), V('day30_clip4') ],
  day31: [ V('day31_clip1'), V('day31_clip2'), V('day31_clip3'), V('day31_clip4') ],
  day32: [ V('day32_clip1'), V('day32_clip2'), V('day32_clip3'), V('day32_clip4') ],
  day33: [ V('day33_clip1'), V('day33_clip2'), V('day33_clip3'), V('day33_clip4') ],
  day34: [ V('day34_clip1'), V('day34_clip2'), V('day34_clip3'), V('day34_clip4') ],
  day35: [ V('day35_clip1'), V('day35_clip2'), V('day35_clip3'), V('day35_clip4') ],
};

const CLIP_DURATION_FRAMES = 225;
const CROSSFADE_FRAMES = 8;

// ── UPGRADE: Flash transition on clip change ──
// Quick white flash at the exact moment each new clip starts
const FlashTransition = ({ clipIndex }) => {
  const frame = useCurrentFrame();
  // Flash only at frame 0 of each clip (except the very first)
  if (clipIndex === 0) return null;
  const flashOpacity = interpolate(
    frame,
    [0, 4],
    [0.45, 0],
    { extrapolateRight: 'clamp' }
  );
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: `rgba(255,255,255,${flashOpacity})`,
      zIndex: 5,
      pointerEvents: 'none',
    }} />
  );
};

export const BackgroundVideo = ({ videoId }) => {
  const frame = useCurrentFrame();
  const clips = VIDEO_SETS[videoId] || VIDEO_SETS['day29'];

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {clips.map((src, i) => {
        const startFrame = i * CLIP_DURATION_FRAMES;
        const endFrame = startFrame + CLIP_DURATION_FRAMES;

        // ── Alternating Ken Burns directions ──
        const isEven = i % 2 === 0;
        const zoom = interpolate(
          frame,
          [startFrame, endFrame],
          isEven ? [0.92, 0.96] : [0.96, 0.92],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // ── Alternate pan direction left/right ──
        const panX = interpolate(
          frame,
          [startFrame, endFrame],
          isEven ? [0, 12] : [12, 0],
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
              transform: `scale(${zoom}) translateX(${panX}px)`,
              transformOrigin: 'center center',
            }}>
              <OffthreadVideo
                src={src}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
              />
            </div>
            {/* Flash on clip entry */}
            <FlashTransition clipIndex={i} />
          </Sequence>
        );
      })}
    </div>
  );
};
