const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = "./output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// pixabaySearchTerms is now an ARRAY
// 2 terms = 2 clips × 15s each | 3 terms = 3 clips × 10s each
const VIDEOS = [
  { id: "day22", filename: "day22_final.mp4",
    pixabaySearchTerms: ["entrepreneur working laptop", "person thinking"] },
  { id: "day23", filename: "day23_final.mp4",
    pixabaySearchTerms: ["online income laptop", "social media marketing"] },
  { id: "day24", filename: "day24_final.mp4",
    pixabaySearchTerms: ["content creator desk setup", "editing video computer"] },
  { id: "day25", filename: "day25_final.mp4",
    pixabaySearchTerms: ["person thinking", "writing notes desk"] },
  { id: "day26", filename: "day26_final.mp4",
    pixabaySearchTerms: ["social media phone", "frustrated person laptop"] },
  { id: "day27", filename: "day27_final.mp4",
    pixabaySearchTerms: ["home office workspace", "clock time management"] },
  { id: "day28", filename: "day28_final.mp4",
    pixabaySearchTerms: ["calendar planning", "productive workspace morning"] },
];

console.log("🎬 Daily Wealth Building — Week 4 Render Starting...\n");

let successCount = 0;
let failCount = 0;

const chromeBin = execSync("which google-chrome-stable").toString().trim();

for (const video of VIDEOS) {
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
      `--log=error ` +
      `--browser-executable="${chromeBin}" ` +
      `--chrome-mode=new-headless ` +
      `--no-sandbox ` +
      `--disable-setuid-sandbox ` +
      `--timeout-in-milliseconds=90000 ` +
      `--props='${inputProps}'`,
      {
        stdio: "inherit",
        timeout: 300000,
        env: { ...process.env, REMOTION_HEADLESS: "new" },
      }
    );
    console.log(`✅ ${video.filename} done!\n`);
    successCount++;
  } catch (err) {
    console.error(`❌ ${video.filename} FAILED\n`);
    failCount++;
  }
}

console.log(`\n🏁 Success: ${successCount}/7  ❌ Failed: ${failCount}/7`);

if (failCount > 0) process.exit(1);
