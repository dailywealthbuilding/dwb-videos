const CLOUD = "defyg5zro8";
const F = `https://res.cloudinary.com/${CLOUD}/video/upload/dwb`;

const VIDEO_MAP = {
  "entrepreneur working laptop": `${F}/entrepreneur_laptop.mp4`,
  "person thinking":             `${F}/person_thinking.mp4`,
  "writing notes desk":          `${F}/writing_notes.mp4`,
  "writing notes":               `${F}/writing_notes.mp4`,
  "online income laptop":        `${F}/laptop_income.mp4`,
  "social media phone":          `${F}/social_media_phone.mp4`,
  "social media marketing":      `${F}/business_statistics.mp4`,
  "content creator desk setup":  `${F}/content_creator.mp4`,
  "editing video computer":      `${F}/desk_workspace.mp4`,
  "frustrated person laptop":    `${F}/frustrated_laptop.mp4`,
  "home office workspace":       `${F}/desk_workspace.mp4`,
  "clock time management":       `${F}/clock_time.mp4`,
  "calendar planning":           `${F}/calendar_planning.mp4`,
  "productive workspace morning":`${F}/desk_workspace.mp4`,
  "online business setup":       `${F}/business_setup.mp4`,
  "small business owner":        `${F}/small_business.mp4`,
  "person on phone":             `${F}/social_media_phone.mp4`,
  "tiktok phone screen":         `${F}/social_media_phone.mp4`,
  "youtube laptop screen":       `${F}/content_creator.mp4`,
  "person deciding options":     `${F}/person_thinking.mp4`,
  "person editing video laptop": `${F}/laptop_income.mp4`,
  "phone filming setup":         `${F}/phone_filming.mp4`,
  "person stressed busy":        `${F}/frustrated_laptop.mp4`,
  "social media statistics screen": `${F}/business_statistics.mp4`,
  "timer stopwatch":             `${F}/stopwatch_timer.mp4`,
  "person thinking desk":        `${F}/person_thinking.mp4`,
};

const FALLBACKS = [
  `${F}/entrepreneur_laptop.mp4`,
  `${F}/person_thinking.mp4`,
  `${F}/desk_workspace.mp4`,
  `${F}/laptop_income.mp4`,
  `${F}/business_statistics.mp4`,
];
