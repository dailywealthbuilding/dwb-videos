import { AbsoluteFill, Video, useVideoConfig, useCurrentFrame, interpolate } from "remotion";

const CLOUD = "defyg5zro8";

const VIDEO_MAP = {
  "entrepreneur working laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  "person thinking": `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "writing notes desk": `https://res.cloudinary.com/${CLOUD}/video/upload/writing_notes.mp4`,
  "writing notes": `https://res.cloudinary.com/${CLOUD}/video/upload/writing_notes.mp4`,
  "online business setup": `https://res.cloudinary.com/${CLOUD}/video/upload/business_setup.mp4`,
  "person writing notes": `https://res.cloudinary.com/${CLOUD}/video/upload/writing_notes.mp4`,
  "timer stopwatch": `https://res.cloudinary.com/${CLOUD}/video/upload/stopwatch_timer.mp4`,
  "social media phone": `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "social media statistics screen": `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
  "small business owner": `https://res.cloudinary.com/${CLOUD}/video/upload/small_business.mp4`,
  "person on phone": `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "online income laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/laptop_income.mp4`,
  "frustrated person laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/frustrated_laptop.mp4`,
  "person thinking desk": `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "editing video computer": `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "tiktok phone screen": `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "youtube laptop screen": `https://res.cloudinary.com/${CLOUD}/video/upload/content_creator.mp4`,
  "person deciding options": `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "social media marketing": `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
  "person editing video laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/laptop_income.mp4`,
  "home office workspace": `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "content creator desk setup": `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  "phone filming setup": `https://res.cloudinary.com/${CLOUD}/video/upload/phone_filming.mp4`,
  "clock time management": `https://res.cloudinary.com/${CLOUD}/video/upload/clock_time.mp4`,
  "person stressed busy": `https://res.cloudinary.com/${CLOUD}/video/upload/frustrated_laptop.mp4`,
  "calendar planning": `https://res.cloudinary.com/${CLOUD}/video/upload/calendar_planning.mp4`,
  "productive workspace morning": `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
};

const FALLBACK_VIDEOS = [
  `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/laptop_income.mp4`,
  `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
];

function buildClips(pixabaySearchTerms, totalFrames) {
  const terms = Array.isArray(pixabaySearchTerms) ? pixabaySearchTerms : [pixabaySearchTerms];
  const uniqueTerms = [...new Set(terms)];

  const srcs = uniqueTerms.map((term, i) => {
    const key = Object.keys(VIDEO_MAP).find(
      (k) => k.toLowerCase() === String(term).toLowerCase()
    );
    return key ? VIDEO_MAP[key] : FALLBACK_VIDEOS[i % FALLBACK_VIDEOS.length];
  });

  const clipCount = srcs.length;
  const framesPerClip = Math.floor(totalFrames / clipCount);

  return srcs.map((src, i) => ({
    src,
    startFrame: i * framesPerClip,
    durationFrames:
      i === clipCount - 1 ? totalFrames - i * framesPerClip : framesPerClip,
  }));
}

export const BackgroundVideo = ({ pixabaySearchTerms }) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const clips = buildClips(pixabaySearchTerms, durationInFrames);

  if (!clips.length) {
    return (
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      />
    );
  }

  return (
    <AbsoluteFill>
      {clips.map((clip, i) => {
        const isActive =
          frame >= clip.startFrame &&
          frame < clip.startFrame + clip.durationFrames;
        if (!isActive) return null;

        const clipFrame = frame - clip.startFrame;

        // Ken Burns zoom: 100% → 108% over the clip
        const scale = interpolate(
          clipFrame,
          [0, clip.durationFrames],
          [1.0, 1.08],
          { extrapolateRight: "clamp" }
        );

        return (
          <AbsoluteFill key={`${clip.src}-${i}`} style={{ overflow: "hidden" }}>
            <video
              src={clip.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
              muted
              autoPlay={false}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
