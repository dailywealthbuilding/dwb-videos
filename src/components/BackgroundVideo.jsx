import { AbsoluteFill, Video, staticFile } from "remotion";

const PEXELS_VIDEO_MAP = {
  "entrepreneur working laptop": staticFile("videos/3194038.mp4"),
  "person thinking": staticFile("videos/3252459.mp4"),
  "writing notes desk": staticFile("videos/4065982.mp4"),
  "online business setup": staticFile("videos/6985580.mp4"),
  "person writing notebook": staticFile("videos/4065982.mp4"),
  "timer stopwatch": staticFile("videos/4481316.mp4"),
  "content creator laptop": staticFile("videos/3196007.mp4"),
  "social media phone": staticFile("videos/8371648.mp4"),
  "social media statistics screen": staticFile("videos/6963944.mp4"),
  "small business owner": staticFile("videos/3252453.mp4"),
  "person on phone": staticFile("videos/7564710.mp4"),
  "online income laptop": staticFile("videos/7688336.mp4"),
  "frustrated person laptop": staticFile("videos/5699456.mp4"),
  "person thinking desk": staticFile("videos/3252459.mp4"),
  "content creator phone": staticFile("videos/8371648.mp4"),
  "editing video computer": staticFile("videos/3296467.mp4"),
  "tiktok phone screen": staticFile("videos/8371648.mp4"),
  "youtube laptop screen": staticFile("videos/3196007.mp4"),
  "person deciding options": staticFile("videos/3252453.mp4"),
  "social media marketing": staticFile("videos/6963944.mp4"),
  "person editing video laptop": staticFile("videos/3296467.mp4"),
  "home office workspace": staticFile("videos/6985580.mp4"),
  "content creator desk setup": staticFile("videos/3194038.mp4"),
  "phone filming setup": staticFile("videos/6890254.mp4"),
  "clock time management": staticFile("videos/4481316.mp4"),
  "person stressed busy": staticFile("videos/5699456.mp4"),
  "calendar planning desk": staticFile("videos/4065982.mp4"),
  "productive workspace morning": staticFile("videos/6985580.mp4"),
};

import { AbsoluteFill } from "remotion";

export const BackgroundVideo = ({ pexelsSearchTerms }) => {
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
    }} />
  );
};
