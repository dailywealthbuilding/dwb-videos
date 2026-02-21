const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = "./output";
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIDEOS = [
  { id: "day22", filename: "day22_final.mp4",
    pixabaySearchTerms: ["entrepreneur working laptop", "person thinking", "online income laptop", "home office workspace"] },
  { id: "day23", filename: "day23_final.mp4",
    pixabaySearchTerms: ["social media phone", "social media marketing", "content creator desk setup", "tiktok phone screen"] },
  { id: "day24", filename: "day24_final.mp4",
    pixabaySearchTerms: ["editing video computer", "youtube laptop screen", "person editing video laptop", "productive workspace morning"] },
  { id: "day25", filename: "day25_final.mp4",
    pixabaySearchTerms: ["person thinking", "writing notes desk", "person deciding options", "person thinking desk"] },
  { id: "day26", filename: "day26_final.mp4",
    pixabaySearchTerms: ["frustrated person laptop", "person stressed busy", "small business owner", "online business setup"] },
  { id: "day27", filename: "day27_final.mp4",
    pixabaySearchTerms: ["clock time management", "timer stopwatch", "calendar planning", "person on phone"] },
  { id: "day28", filename: "day28_final.mp4",
    pixabaySearchTerms: ["phone filming setup", "social media statistics screen", "home office workspace", "entrepreneur working laptop"] },
];

// Support rendering a single video: node render-all.js day22
const targetId = process.argv[2] || null;
const videosToRender = targetId
  ? VIDEOS.filter((v) => v.id === targetId)
  : VIDEOS;

if (videosToRender.length === 0) {
  console.error(`❌ No video found with id: ${targetId}`);
  process.exit(1);
}

console.log(`🎬 Daily Wealth Building — Rendering ${videosToRender.length} video(s)...\n`);

const chromeBin = execSync("which google-chrome-stable").toString().trim();

let successCount = 0;
let failCount = 0;

for (const video of videosToRender) {
  const outputPath = path.join(OUTPUT_DIR, video.filename);
  console.log(`⚙ Rendering ${video.filename}...`);

  const inputProps = JSON.stringify({
    pixabaySearchTerms: video.pixabaySearchTerms,
  });

  try {
    execSync(
      `npx remotion render src/index.jsx ` +
      `${video.id} ` +
      `"${outputPath}" ` +
      `--codec=h264 ` +
      `--jpeg-quality=85 ` +
      `--log=verbose ` +
      `--browser-executable="${chromeBin}" ` +
      `--no-sandbox ` +
      `--disable-setuid-sandbox ` +
      `--timeout-in-milliseconds=120000 ` +
      `--props='${inputProps}'`,
      {
        stdio: "inherit",
        timeout: 300000,
        env: {
          ...process.env,
          REMOTION_HEADLESS: "new",
          CHROME_FLAGS: "--headless=new",
        },
      }
    );
    console.log(`✅ ${video.filename} done!\n`);
    successCount++;
  } catch (err) {
    console.error(`❌ ${video.filename} FAILED\n`);
    failCount++;
  }
}

console.log(`\n🏁 Success: ${successCount}/${videosToRender.length}  ❌ Failed: ${failCount}/${videosToRender.length}`);
if (failCount > 0) process.exit(1);
