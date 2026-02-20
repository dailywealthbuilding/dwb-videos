const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = "./output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIDEOS = [
  { id: "day22", filename: "day22_final.mp4" },
  { id: "day23", filename: "day23_final.mp4" },
  { id: "day24", filename: "day24_final.mp4" },
  { id: "day25", filename: "day25_final.mp4" },
  { id: "day26", filename: "day26_final.mp4" },
  { id: "day27", filename: "day27_final.mp4" },
  { id: "day28", filename: "day28_final.mp4" },
];

console.log("🎬 Daily Wealth Building — Week 4 Render Starting...\n");

let successCount = 0;
let failCount = 0;

for (const video of VIDEOS) {
  const outputPath = path.join(OUTPUT_DIR, video.filename);
  console.log(`⏳ Rendering ${video.id}...`);
  try {
    execSync(
      `npx remotion render src/index.jsx ${video.id} ${outputPath} --codec=h264 --quality=85 --log=error --browser-executable=$(which google-chrome)`,
      { stdio: "inherit", timeout: 300000,
        env: { ...process.env, REMOTION_HEADLESS: "new" } }
    );
    console.log(`✅ ${video.filename} done!\n`);
    successCount++;
  } catch (err) {
    console.error(`❌ ${video.filename} FAILED\n`);
    failCount++;
  }
}

console.log(`✅ Success: ${successCount}/7  ❌ Failed: ${failCount}/7`);
