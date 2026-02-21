const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = "./output";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 4 search terms per video = 4 clips × 7.5s each = 30s total
const VIDEOS = [
  {
    id: "day22",
    filename: "day22_final.mp4",
    pixabaySearchTerms: [
      "entrepreneur working laptop",
      "person thinking",
      "online income laptop",
      "home office workspace",
    ],
  },
  {
    id: "day23",
    filename: "day23_final.mp4",
    pixabaySearchTerms: [
      "social media phone",
      "social media marketing",
      "content creator desk setup",
      "tiktok phone screen",
    ],
  },
  {
    id: "day24",
    filename: "day24_final.mp4",
    pixabaySearchTerms: [
      "editing video computer",
      "youtube laptop screen",
      "person editing video laptop",
      "productive workspace morning",
    ],
  },
  {
    id: "day25",
    filename: "day25_final.mp4",
    pixabaySearchTerms: [
      "person thinking",
      "writing notes desk",
      "person deciding options",
      "person thinking desk",
    ],
  },
  {
    id: "day26",
    filename: "day26_final.mp4",
    pixabaySearchTerms: [
      "frustrated person laptop",
      "person stressed busy",
      "small business owner",
      "online business setup",
    ],
  },
  {
    id: "day27",
    filename: "day27_final.mp4",
    pixabaySearchTerms: [
      "clock time management",
      "timer stopwatch",
      "calendar planning",
      "person on phone",
    ],
  },
  {
    id: "day28",
    filename: "day28_final.mp4",
    pixabaySearchTerms: [
      "phone filming setup",
      "social media statistics screen",
      "home office workspace",
      "entrepreneur working laptop",
    ],
  },
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
