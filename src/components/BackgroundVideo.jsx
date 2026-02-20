import { AbsoluteFill, Video } from "remotion";

const PEXELS_VIDEO_MAP = {
  "entrepreneur working laptop":
    "https://videos.pexels.com/video-files/3194038/3194038-uhd_2560_1440_25fps.mp4",
  "person thinking":
    "https://videos.pexels.com/video-files/3252459/3252459-uhd_2560_1440_25fps.mp4",
  "writing notes desk":
    "https://videos.pexels.com/video-files/4065982/4065982-hd_1920_1080_25fps.mp4",
  "online business setup":
    "https://videos.pexels.com/video-files/6985580/6985580-uhd_2560_1440_30fps.mp4",
  "person writing notebook":
    "https://videos.pexels.com/video-files/4065982/4065982-hd_1920_1080_25fps.mp4",
  "timer stopwatch":
    "https://videos.pexels.com/video-files/4481316/4481316-hd_1920_1080_25fps.mp4",
  "content creator laptop":
    "https://videos.pexels.com/video-files/3196007/3196007-uhd_2560_1440_25fps.mp4",
  "social media phone":
    "https://videos.pexels.com/video-files/8371648/8371648-uhd_3840_2160_25fps.mp4",
  "social media statistics screen":
    "https://videos.pexels.com/video-files/6963944/6963944-uhd_2560_1440_25fps.mp4",
  "small business owner":
    "https://videos.pexels.com/video-files/3252453/3252453-uhd_2560_1440_25fps.mp4",
  "person on phone":
    "https://videos.pexels.com/video-files/7564710/7564710-hd_1920_1080_25fps.mp4",
  "online income laptop":
    "https://videos.pexels.com/video-files/7688336/7688336-uhd_3840_2160_30fps.mp4",
  "frustrated person laptop":
    "https://videos.pexels.com/video-files/5699456/5699456-hd_1920_1080_25fps.mp4",
  "person thinking desk":
    "https://videos.pexels.com/video-files/3252459/3252459-uhd_2560_1440_25fps.mp4",
  "content creator phone":
    "https://videos.pexels.com/video-files/8371648/8371648-uhd_3840_2160_25fps.mp4",
  "editing video computer":
    "https://videos.pexels.com/video-files/3296467/3296467-uhd_2560_1440_25fps.mp4",
  "tiktok phone screen":
    "https://videos.pexels.com/video-files/8371648/8371648-uhd_3840_2160_25fps.mp4",
  "youtube laptop screen":
    "https://videos.pexels.com/video-files/3196007/3196007-uhd_2560_1440_25fps.mp4",
  "person deciding options":
    "https://videos.pexels.com/video-files/3252453/3252453-uhd_2560_1440_25fps.mp4",
  "social media marketing":
    "https://videos.pexels.com/video-files/6963944/6963944-uhd_2560_1440_25fps.mp4",
  "person editing video laptop":
    "https://videos.pexels.com/video-files/3296467/3296467-uhd_2560_1440_25fps.mp4",
  "home office workspace":
    "https://videos.pexels.com/video-files/6985580/6985580-uhd_2560_1440_30fps.mp4",
  "content creator desk setup":
    "https://videos.pexels.com/video-files/3194038/3194038-uhd_2560_1440_25fps.mp4",
  "phone filming setup":
    "https://videos.pexels.com/video-files/6890254/6890254-uhd_2560_1440_25fps.mp4",
  "clock time management":
    "https://videos.pexels.com/video-files/4481316/4481316-hd_1920_1080_25fps.mp4",
  "person stressed busy":
    "https://videos.pexels.com/video-files/5699456/5699456-hd_1920_1080_25fps.mp4",
  "calendar planning desk":
    "https://videos.pexels.com/video-files/4065982/4065982-hd_1920_1080_25fps.mp4",
  "productive workspace morning":
    "https://videos.pexels.com/video-files/6985580/6985580-uhd_2560_1440_30fps.mp4",
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