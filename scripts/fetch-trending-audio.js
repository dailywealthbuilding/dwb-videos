#!/usr/bin/env node

/**
 * Trending Audio Fetcher
 * 
 * Scrapes TikTok Creative Center for trending sounds and downloads them as MP3s.
 * Uses Puppeteer for scraping and yt-dlp for audio extraction.
 * 
 * Usage:
 *   node scripts/fetch-trending-audio.js [options]
 * 
 * Options:
 *   --count <n>    Number of tracks to fetch (default: 10)
 *   --region <code> TikTok region code (default: US)
 *   --skip-download Only scrape metadata, don't download audio
 */

import puppeteer from 'puppeteer';
import { execSync, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'public', 'music', 'trending'),
  manifestFile: 'manifest.json',
  defaultCount: 10,
  defaultRegion: 'US',
  downloadDelay: 3000, // ms between downloads
  maxRetries: 3,
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  ],
};

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    count: CONFIG.defaultCount,
    region: CONFIG.defaultRegion,
    skipDownload: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      options.count = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--region' && args[i + 1]) {
      options.region = args[i + 1].toUpperCase();
      i++;
    } else if (args[i] === '--skip-download') {
      options.skipDownload = true;
    }
  }

  return options;
}

// Get random user agent
function getRandomUserAgent() {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

// Sanitize filename
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

// Check if yt-dlp is available
function checkYtDlp() {
  try {
    execSync('yt-dlp --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Scrape TikTok Creative Center for trending sounds
async function scrapeTrendingSounds(options) {
  console.log(`\n🎵 Scraping TikTok Creative Center (Region: ${options.region})...\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(getRandomUserAgent());
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to TikTok Creative Center trending sounds
    const url = `https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en?region=${options.region}&period=7`;
    console.log(`📍 Navigating to: ${url}`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });

    // Wait for content to load
    await delay(3000);

    // Scroll to load more content if needed
    await page.evaluate(async () => {
      for (let i = 0; i < 3; i++) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 1000));
      }
    });

    // Extract trending sounds data
    const sounds = await page.evaluate((maxCount) => {
      const results = [];
      
      // Try multiple selectors as TikTok may change their DOM structure
      const selectors = [
        '[class*="MusicCard"]',
        '[class*="music-card"]',
        '[class*="CardPc_container"]',
        'div[data-e2e="music-card"]',
        '.music-item',
      ];

      let cards = [];
      for (const selector of selectors) {
        cards = document.querySelectorAll(selector);
        if (cards.length > 0) break;
      }

      // Fallback: try to find any card-like elements with music info
      if (cards.length === 0) {
        cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
      }

      cards.forEach((card, index) => {
        if (index >= maxCount) return;

        // Try to extract data from various possible structures
        const titleEl = card.querySelector('[class*="title"], [class*="Title"], h3, h4, [class*="name"], [class*="Name"]');
        const artistEl = card.querySelector('[class*="author"], [class*="Author"], [class*="artist"], [class*="creator"]');
        const countEl = card.querySelector('[class*="count"], [class*="Count"], [class*="video"], [class*="usage"]');
        const linkEl = card.querySelector('a[href*="music"], a[href*="sound"]');

        const title = titleEl?.textContent?.trim() || `Trending Sound ${index + 1}`;
        const artist = artistEl?.textContent?.trim() || 'Unknown Artist';
        const videoCount = countEl?.textContent?.trim() || 'N/A';
        
        // Try to get the TikTok music URL
        let tiktokUrl = linkEl?.href || '';
        if (!tiktokUrl && card.querySelector('a')) {
          tiktokUrl = card.querySelector('a').href || '';
        }

        // Only add if we have some useful data
        if (title || tiktokUrl) {
          results.push({
            rank: index + 1,
            title,
            artist,
            videoCount,
            tiktokUrl,
          });
        }
      });

      return results;
    }, options.count);

    console.log(`✅ Found ${sounds.length} trending sounds\n`);
    return sounds;

  } finally {
    await browser.close();
  }
}

// Download audio using yt-dlp
async function downloadAudio(sound, index, outputDir) {
  const filename = `trending-${String(index + 1).padStart(3, '0')}-${sanitizeFilename(sound.title)}`;
  const outputPath = path.join(outputDir, `${filename}.mp3`);

  // Skip if no URL available
  if (!sound.tiktokUrl || !sound.tiktokUrl.startsWith('http')) {
    console.log(`⚠️  Skipping "${sound.title}" - No valid URL`);
    return null;
  }

  console.log(`📥 Downloading: ${sound.title}`);
  console.log(`   URL: ${sound.tiktokUrl}`);

  return new Promise((resolve) => {
    const cmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${sound.tiktokUrl}" --no-playlist --quiet`;
    
    exec(cmd, { timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        resolve(null);
      } else {
        console.log(`   ✅ Saved: ${filename}.mp3`);
        resolve({
          ...sound,
          id: `trending-${String(index + 1).padStart(3, '0')}`,
          filename: `${filename}.mp3`,
          downloadedAt: new Date().toISOString(),
        });
      }
    });
  });
}

// Alternative: Create placeholder manifest when yt-dlp unavailable
async function createPlaceholderManifest(sounds, outputDir, region) {
  const manifest = {
    fetchedAt: new Date().toISOString(),
    source: 'tiktok-creative-center',
    region,
    status: 'metadata-only',
    note: 'yt-dlp not available - audio files not downloaded. Install yt-dlp to enable downloads.',
    tracks: sounds.map((sound, index) => ({
      id: `trending-${String(index + 1).padStart(3, '0')}`,
      filename: null,
      title: sound.title,
      artist: sound.artist,
      tiktokUrl: sound.tiktokUrl,
      rank: sound.rank,
      videoCount: sound.videoCount,
      downloadedAt: null,
    })),
  };

  const manifestPath = path.join(outputDir, CONFIG.manifestFile);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📋 Manifest saved (metadata only): ${manifestPath}`);
  
  return manifest;
}

// Main execution
async function main() {
  const options = parseArgs();
  
  console.log('═'.repeat(60));
  console.log('  TRENDING AUDIO FETCHER');
  console.log('  Scrapes TikTok Creative Center + Downloads via yt-dlp');
  console.log('═'.repeat(60));
  console.log(`\n  Count: ${options.count} tracks`);
  console.log(`  Region: ${options.region}`);
  console.log(`  Skip Download: ${options.skipDownload}`);

  // Ensure output directory exists
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Check yt-dlp availability
  const hasYtDlp = checkYtDlp();
  if (!hasYtDlp && !options.skipDownload) {
    console.log('\n⚠️  yt-dlp not found! Install it with: pip install yt-dlp');
    console.log('   Continuing with metadata-only mode...\n');
  }

  try {
    // Step 1: Scrape trending sounds
    const sounds = await scrapeTrendingSounds(options);

    if (sounds.length === 0) {
      console.log('❌ No trending sounds found. TikTok may have changed their page structure.');
      console.log('   Try running with --skip-download to see raw scrape results.');
      process.exit(1);
    }

    // Step 2: Download audio files (if yt-dlp available and not skipped)
    if (options.skipDownload || !hasYtDlp) {
      await createPlaceholderManifest(sounds, CONFIG.outputDir, options.region);
      return;
    }

    console.log('\n📥 Downloading audio files...\n');
    const downloadedTracks = [];

    for (let i = 0; i < sounds.length; i++) {
      const result = await downloadAudio(sounds[i], i, CONFIG.outputDir);
      if (result) {
        downloadedTracks.push(result);
      }
      
      // Rate limiting delay between downloads
      if (i < sounds.length - 1) {
        await delay(CONFIG.downloadDelay);
      }
    }

    // Step 3: Create manifest
    const manifest = {
      fetchedAt: new Date().toISOString(),
      source: 'tiktok-creative-center',
      region: options.region,
      status: 'complete',
      totalScraped: sounds.length,
      totalDownloaded: downloadedTracks.length,
      tracks: downloadedTracks,
    };

    const manifestPath = path.join(CONFIG.outputDir, CONFIG.manifestFile);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log('\n' + '═'.repeat(60));
    console.log('  COMPLETE');
    console.log('═'.repeat(60));
    console.log(`\n  ✅ Scraped: ${sounds.length} tracks`);
    console.log(`  ✅ Downloaded: ${downloadedTracks.length} tracks`);
    console.log(`  📁 Output: ${CONFIG.outputDir}`);
    console.log(`  📋 Manifest: ${manifestPath}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
