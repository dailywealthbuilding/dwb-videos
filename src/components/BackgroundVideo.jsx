import { AbsoluteFill, Video, Sequence, useVideoConfig, useCurrentFrame, interpolate } from "remotion";

const CLOUD = "defyg5zro8";

const VIDEO_MAP = {
  "entrepreneur working laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  "person thinking":             `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "writing notes desk":          `https://res.cloudinary.com/${CLOUD}/video/upload/writing_notes.mp4`,
  "online income laptop":        `https://res.cloudinary.com/${CLOUD}/video/upload/laptop_income.mp4`,
  "social media phone":          `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "social media marketing":      `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
  "content creator desk setup":  `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  "editing video computer":      `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "writing notes":               `https://res.cloudinary.com/${CLOUD}/video/upload/writing_notes.mp4`,
  "frustrated person laptop":    `https://res.cloudinary.com/${CLOUD}/video/upload/frustrated_laptop.mp4`,
  "home office workspace":       `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "clock time management":       `https://res.cloudinary.com/${CLOUD}/video/upload/clock_time.mp4`,
  "calendar planning":           `https://res.cloudinary.com/${CLOUD}/video/upload/calendar_planning.mp4`,
  "productive workspace morning":`https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "online business setup":       `https://res.cloudinary.com/${CLOUD}/video/upload/business_setup.mp4`,
  "small business owner":        `https://res.cloudinary.com/${CLOUD}/video/upload/small_business.mp4`,
  "person on phone":             `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "tiktok phone screen":         `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "youtube laptop screen":       `https://res.cloudinary.com/${CLOUD}/video/upload/content_creator.mp4`,
  "person deciding options":     `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "person editing video laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/laptop_income.mp4`,
  "phone filming setup":         `https://res.cloudinary.com/${CLOUD}/video/upload/phone_filming.mp4`,
  "person stressed busy":        `https://res.cloudinary.com/${CLOUD}/video/upload/frustrated_laptop.mp4`,
  "social media statistics screen": `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
  "timer stopwatch":             `https://res.cloudinary.com/${CLOUD}/video/upload/stopwatch_timer.mp4`,
  "person thinking desk":        `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
};

const FALLBACKS = [
  `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/laptop_income.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
];

// How many frames the crossfade lasts (8 frames = ~0.27s at 30fps — smooth but quick)
const FADE_FRAMES = 8;

function resolveUrl(term, index) {
  const key = Object.keys(VIDEO_MAP).find(
    (k) => k.toLowerCase() === String(term).toLowerCase()
  );
  return key ? VIDEO_MAP[key] : FALLBACKS[index % FALLBACKS.length];
}

export const BackgroundVideo = ({ pixabaySearchTerms }) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const terms = Array.isArray(pixabaySearchTerms)
    ? pixabaySearchTerms
    : [pixabaySearchTerms];

  const clipCount = terms.length;
  const framesPerClip = Math.floor(durationInFrames / clipCount);

  const clips = terms.map((term, i) => ({
    src: resolveUrl(term, i),
    startFrame: i * framesPerClip,
    durationFrames:
      i === clipCount - 1
        ? durationInFrames - i * framesPerClip
        : framesPerClip,
  }));

  return (
    <AbsoluteFill>
      {clips.map((clip, i) => {
        const clipFrame = Math.max(0, frame - clip.startFrame);

        // Ken Burns zoom — resets per clip
        const scale = interpolate(
          clipFrame,
          [0, clip.durationFrames],
          [1.0, 1.08],
          { extrapolateRight: "clamp" }
        );

        // Fade IN: frames 0 → FADE_FRAMES of this clip (skip for first clip)
        const fadeIn = i === 0
          ? 1
          : interpolate(clipFrame, [0, FADE_FRAMES], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

        // Fade OUT: last FADE_FRAMES of this clip (skip for last clip)
        const fadeOut = i === clipCount - 1
          ? 1
          : interpolate(
              clipFrame,
              [clip.durationFrames - FADE_FRAMES, clip.durationFrames],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

        // Both fades apply simultaneously — whichever is lower wins
        const opacity = Math.min(fadeIn, fadeOut);

        // Extend Sequence slightly into neighbours so clips overlap during fade
        // First clip: no left extension | Last clip: no right extension
        const seqStart = i === 0 ? clip.startFrame : clip.startFrame - FADE_FRAMES;
        const seqDuration =
          i === 0
            ? clip.durationFrames + FADE_FRAMES          // extend right only
            : i === clipCount - 1
            ? clip.durationFrames + FADE_FRAMES          // extend left only
            : clip.durationFrames + FADE_FRAMES * 2;    // extend both sides

        // startFrom compensates for the left extension so video still begins at frame 0
        const startFrom = i === 0 ? 0 : FADE_FRAMES;

        return (
          <Sequence
            key={`clip-${i}`}
            from={seqStart}
            durationInFrames={Math.min(seqDuration, durationInFrames - seqStart)}
          >
            <AbsoluteFill style={{ overflow: "hidden", opacity }}>
              <Video
                src={clip.src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
                startFrom={startFrom}
                volume={0}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
