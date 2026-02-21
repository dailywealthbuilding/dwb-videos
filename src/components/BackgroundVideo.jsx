import { AbsoluteFill, Video } from "remotion";

const CLOUD = "dsfy55ro0";

const VIDEO_MAP = {
  "entrepreneur working laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  "person thinking": `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "writing notes desk": `https://res.cloudinary.com/${CLOUD}/video/upload/writing_notes.mp4`,
  "online business setup": `https://res.cloudinary.com/${CLOUD}/video/upload/business_setup.mp4`,
  "person writing notebook": `https://res.cloudinary.com/${CLOUD}/video/upload/writing_notes.mp4`,
  "timer stopwatch": `https://res.cloudinary.com/${CLOUD}/video/upload/stopwatch_timer.mp4`,
  "content creator laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/content_creator.mp4`,
  "social media phone": `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "social media statistics screen": `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
  "small business owner": `https://res.cloudinary.com/${CLOUD}/video/upload/small_business.mp4`,
  "person on phone": `https://res.cloudinary.com/${CLOUD}/video/upload/person_phone.mp4`,
  "online income laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/laptop_income.mp4`,
  "frustrated person laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/frustrated_laptop.mp4`,
  "person thinking desk": `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "content creator phone": `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "editing video computer": `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "tiktok phone screen": `https://res.cloudinary.com/${CLOUD}/video/upload/social_media_phone.mp4`,
  "youtube laptop screen": `https://res.cloudinary.com/${CLOUD}/video/upload/content_creator.mp4`,
  "person deciding options": `https://res.cloudinary.com/${CLOUD}/video/upload/person_thinking.mp4`,
  "social media marketing": `https://res.cloudinary.com/${CLOUD}/video/upload/business_statistics.mp4`,
  "person editing video laptop": `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "home office workspace": `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
  "content creator desk setup": `https://res.cloudinary.com/${CLOUD}/video/upload/entrepreneur_laptop.mp4`,
  "phone filming setup": `https://res.cloudinary.com/${CLOUD}/video/upload/phone_filming.mp4`,
  "clock time management": `https://res.cloudinary.com/${CLOUD}/video/upload/clock_time.mp4`,
  "person stressed busy": `https://res.cloudinary.com/${CLOUD}/video/upload/frustrated_laptop.mp4`,
  "calendar planning desk": `https://res.cloudinary.com/${CLOUD}/video/upload/calendar_planning.mp4`,
  "productive workspace morning": `https://res.cloudinary.com/${CLOUD}/video/upload/desk_workspace.mp4`,
};

export const BackgroundVideo = ({ pexelsSearchTerms }) => {
  const videoUrl = VIDEO_MAP[pexelsSearchTerms[0]];
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
