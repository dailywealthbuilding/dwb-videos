const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

const VIDEOS = [
  { id: 'day22', compositionId: 'VideoComposition', outputFile: 'day22_final.mp4' },
  { id: 'day23', compositionId: 'VideoComposition', outputFile: 'day23_final.mp4' },
  { id: 'day24', compositionId: 'VideoComposition', outputFile: 'day24_final.mp4' },
  { id: 'day25', compositionId: 'VideoComposition', outputFile: 'day25_final.mp4' },
  { id: 'day26', compositionId: 'VideoComposition', outputFile: 'day26_final.mp4' },
  { id: 'day27', compositionId: 'VideoComposition', outputFile: 'day27_final.mp4' },
  { id: 'day28', compositionId: 'VideoComposition', outputFile: 'day28_final.mp4' },
];

const ENTRY_POINT = path.resolve('./src/index.jsx');
const OUT_DIR = path.resolve('./out');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const CHROMIUM_OPTIONS = {
  headless: true,
  args: ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};

(async () => {
  console.log(`🎬 Daily Wealth Building — Rendering ${VIDEOS.length} video(s)...\n`);
  let success = 0;
  let failed = 0;

  for (const video of VIDEOS) {
    console.log(`⚙ Rendering ${video.outputFile}...`);
    const outputLocation = path.join(OUT_DIR, video.outputFile);

    try {
      const composition = await selectComposition({
        serveUrl: ENTRY_POINT,
        id: video.compositionId,
        inputProps: { videoId: video.id },
        chromiumOptions: CHROMIUM_OPTIONS,
      });

      await renderMedia({
        composition,
        serveUrl: ENTRY_POINT,
        codec: 'h264',
        outputLocation,
        inputProps: { videoId: video.id },
        chromiumOptions: CHROMIUM_OPTIONS,
      });

      console.log(`✅ ${video.outputFile} done\n`);
      success++;
    } catch (e) {
      console.error(`❌ ${video.outputFile} FAILED`);
      console.error(e.message);
      failed++;
    }
  }

  console.log(`\n🏁 Success: ${success}/${VIDEOS.length}  ❌ Failed: ${failed}/${VIDEOS.length}`);
  if (failed > 0) process.exit(1);
})();
