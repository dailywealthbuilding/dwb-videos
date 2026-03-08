import { Audio, staticFile, useVideoConfig, interpolate, useCurrentFrame } from 'remotion';

export const AudioTrack = ({ music, volume = 0.25 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (!music) return null;

  // Fade in over first 30 frames, fade out over last 45 frames
  const audioVolume = interpolate(
    frame,
    [0, 30, durationInFrames - 45, durationInFrames],
    [0, volume, volume, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <Audio
      src={staticFile('music/' + music)}
      volume={audioVolume}
      loop
    />
  );
};
