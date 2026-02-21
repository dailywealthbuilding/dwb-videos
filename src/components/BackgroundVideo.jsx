import { AbsoluteFill, Video } from "remotion";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || "dsfy55ro0";

const PEXELS_VIDEO_MAP = {
  "entrepreneur working laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/3194038.mp4`,
  "person thinking": `https://res.cloudinary.com/${CLOUD}/video/upload/3252459.mp4`,
  "writing notes desk": `https://res.cloudinary.com/${CLOUD}/video/upload/4065982.mp4`,
  "online business setup": `https://res.cloudinary.com/${CLOUD}/video/upload/6985580.mp4`,
  "person writing notebook": `https://res.cloudinary.com/${CLOUD}/video/upload/4065982.mp4`,
  "timer stopwatch": `https://res.cloudinary.com/${CLOUD}/video/upload/4481316.mp4`,
  "content creator laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/3196007.mp4`,
  "social media phone": `https://res.cloudinary.com/${CLOUD}/video/upload/8371648.mp4`,
  "social media statistics screen": `https://res.cloudinary.com/${CLOUD}/video/upload/6963944.mp4`,
  "small business owner": `https://res.cloudinary.com/${CLOUD}/video/upload/3252453.mp4`,
  "person on phone": `https://res.cloudinary.com/${CLOUD}/video/upload/7564710.mp4`,
  "online income laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/7688336.mp4`,
  "frustrated person laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/5699456.mp4`,
  "person thinking desk": `https://res.cloudinary.com/${CLOUD}/video/upload/3252459.mp4`,
  "content creator phone": `https://res.cloudinary.com/${CLOUD}/video/upload/8371648.mp4`,
  "editing video computer": `https://res.cloudinary.com/${CLOUD}/video/upload/3296467.mp4`,
  "tiktok phone screen": `https://res.cloudinary.com/${CLOUD}/video/upload/8371648.mp4`,
  "youtube laptop screen": `https://res.cloudinary.com/${CLOUD}/video/upload/3196007.mp4`,
  "person deciding options": `https://res.cloudinary.com/${CLOUD}/video/upload/3252453.mp4`,
  "social media marketing": `https://res.cloudinary.com/${CLOUD}/video/upload/6963944.mp4`,
  "person editing video laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/3296467.mp4`,
  "home office workspace": `https://res.cloudinary.com/${CLOUD}/video/upload/6985580.mp4`,
  "content creator desk setup": `https://res.cloudinary.com/${CLOUD}/video/upload/3194038.mp4`,
  "phone filming setup": `https://res.cloudinary.com/${CLOUD}/video/upload/6890254.mp4`,
  "clock time management": `https://res.cloudinary.com/${CLOUD}/video/upload/4481316.mp4`,
  "person stressed busy": `https://res.cloudinary.com/${CLOUD}/video/upload/5699456.mp4`,
  "calendar planning desk": `https://res.cloudinary.com/${CLOUD}/video/upload/4065982.mp4`,
  "productive workspace morning": `https://res.cloudinary.com/${CLOUD}/video/upload/6985580.mp4`,
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
