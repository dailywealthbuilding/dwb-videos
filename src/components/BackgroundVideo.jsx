import { AbsoluteFill, Video } from "remotion";

const PEXELS_VIDEO_MAP = {
  "entrepreneur working laptop": "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-4872-large.mp4",
  "person thinking": "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-smartphone-at-home-42746-large.mp4",
  "writing notes desk": "https://assets.mixkit.co/videos/preview/mixkit-woman-writing-notes-at-her-desk-4887-large.mp4",
  "online business setup": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
  "person writing notebook": "https://assets.mixkit.co/videos/preview/mixkit-woman-writing-notes-at-her-desk-4887-large.mp4",
  "timer stopwatch": "https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-people-walking-in-a-city-2810-large.mp4",
  "content creator laptop": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
  "social media phone": "https://assets.mixkit.co/videos/preview/mixkit-woman-scrolling-through-her-phone-42764-large.mp4",
  "social media statistics screen": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
  "small business owner": "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-4872-large.mp4",
  "person on phone": "https://assets.mixkit.co/videos/preview/mixkit-woman-scrolling-through-her-phone-42764-large.mp4",
  "online income laptop": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
  "frustrated person laptop": "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-4872-large.mp4",
  "person thinking desk": "https://assets.mixkit.co/videos/preview/mixkit-woman-writing-notes-at-her-desk-4887-large.mp4",
  "content creator phone": "https://assets.mixkit.co/videos/preview/mixkit-woman-scrolling-through-her-phone-42764-large.mp4",
  "editing video computer": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
  "tiktok phone screen": "https://assets.mixkit.co/videos/preview/mixkit-woman-scrolling-through-her-phone-42764-large.mp4",
  "youtube laptop screen": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
  "person deciding options": "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-4872-large.mp4",
  "social media marketing": "https://assets.mixkit.co/videos/preview/mixkit-woman-scrolling-through-her-phone-42764-large.mp4",
  "person editing video laptop": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
  "home office workspace": "https://assets.mixkit.co/videos/preview/mixkit-woman-writing-notes-at-her-desk-4887-large.mp4",
  "content creator desk setup": "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-4872-large.mp4",
  "phone filming setup": "https://assets.mixkit.co/videos/preview/mixkit-woman-scrolling-through-her-phone-42764-large.mp4",
  "clock time management": "https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-people-walking-in-a-city-2810-large.mp4",
  "person stressed busy": "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-4872-large.mp4",
  "calendar planning desk": "https://assets.mixkit.co/videos/preview/mixkit-woman-writing-notes-at-her-desk-4887-large.mp4",
  "productive workspace morning": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-laptop-keyboard-close-up-4836-large.mp4",
};

export const BackgroundVideo = ({ pexelsSearchTerms }) => {
  const videoUrl = PEXELS_VIDEO_MAP[pexelsSearchTerms[0]];
  if (!videoUrl) {
    return (
      <AbsoluteFill style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      }} />
    );
  }
  return (
    <AbsoluteFill>
      <Video
        src={videoUrl}
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
        startFrom={0}
        muted
      />
    </AbsoluteFill>
  );
};
