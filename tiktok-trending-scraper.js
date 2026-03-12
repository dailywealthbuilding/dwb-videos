#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// tiktok-trending-scraper.js — DWB Audio Automation
//
// Scrapes TikTok Creative Center for trending sounds, then downloads them
// as MP3 via muscdn.com direct links (no API key needed).
//
// Usage:
//   node tiktok-trending-scraper.js              → top 10 trending
//   node tiktok-trending-scraper.js --limit 5    → top 5
//   node tiktok-trending-scraper.js --download   → also download MP3s
//   node tiktok-trending-scraper.js --day 31     → pick best match for day31
//
// Output: trending-sounds.json + optional MP3 files in ./public/music/
//
// Install: npm install puppeteer-core @sparticuz/chromium axios
// (puppeteer-core is lighter — uses system or downloaded chromium)
// ─────────────────────────────────────────────────────────────────────────────

const puppeteer  = require('puppeteer-core');
const chromium   = require('@sparticuz/chromium');
const axios      = require('axios');
const fs         = require('fs');
const path       = require('path');

// ── CLI args ────────────────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const LIMIT     = parseInt(args[args.indexOf('--limit') + 1] || '10');
const DOWNLOAD  = args.includes('--download');
const DAY_ARG   = args.includes('--day') ? parseInt(args[args.indexOf('--day') + 1]) : null;
const OUT_DIR   = path.join(__dirname, 'public', 'music');
const JSON_OUT  = path.join(__dirname, 'trending-sounds.json');

// ── TikTok Creative Center URL ───────────────────────────────────────────────
// Public page — no login required
const CC_URL = 'https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en';

// ── Vibe → Day mapping (matches your content themes) ────────────────────────
// Used when --day flag is set to pick the most fitting trending sound
const DAY_VIBES = {
  // Week 5 (29-35)
  29: ['emotional','comeback','motivational'],
  30: ['hype','milestone','celebration','upbeat'],
  31: ['punchy','assertive','bold'],
  32: ['techy','minimal','focus'],
  33: ['chill','productive','lofi'],
  34: ['controversial','bold','edgy'],
  35: ['reflective','closing','calm'],
  // Week 6 (36-42)
  36: ['bold','controversial','intense'],
  37: ['calm','trust','smooth'],
  38: ['hype','dramatic','build'],
  39: ['upbeat','positive','fresh'],
  40: ['powerful','golden','inspiring'],
  41: ['intense','fire','red'],
  42: ['cool','blue','strategic'],
};

// Mood keywords to match against TikTok sound titles/tags
const VIBE_KEYWORDS = {
  emotional:     ['emotional','sad','feels','deep','touching'],
  comeback:      ['comeback','rise','back','stronger'],
  motivational:  ['motivational','hustle','grind','inspire','winner'],
  hype:          ['hype','lit','banger','fire','energy'],
  milestone:     ['celebrate','milestone','achievement','level'],
  celebration:   ['celebrate','party','win','happy'],
  upbeat:        ['upbeat','positive','happy','bright','vibes'],
  punchy:        ['punchy','hard','hit','power','punch'],
  assertive:     ['confident','bold','strong','assert'],
  bold:          ['bold','big','loud','statement'],
  techy:         ['techy','tech','digital','electronic','synth'],
  minimal:       ['minimal','clean','simple','focus'],
  focus:         ['focus','study','work','concentrate'],
  chill:         ['chill','relax','smooth','easy'],
  productive:    ['productive','flow','work','steady'],
  lofi:          ['lofi','lo-fi','chill','beats','coffee'],
  controversial: ['controversial','truth','real','raw','honest'],
  edgy:          ['edgy','dark','intense','raw'],
  reflective:    ['reflective','thought','deep','ponder'],
  closing:       ['end','close','final','outro','wrap'],
  calm:          ['calm','peaceful','gentle','soft','slow'],
  intense:       ['intense','dramatic','build','tension','epic'],
  dramatic:      ['dramatic','cinematic','epic','film'],
  fresh:         ['fresh','new','spring','bright','clean'],
  golden:        ['golden','gold','power','rich','prestige'],
  inspiring:     ['inspiring','rise','dream','achieve','possible'],
  fire:          ['fire','hot','lit','blazing','sizzle'],
  cool:          ['cool','blue','smooth','slick','wave'],
  strategic:     ['strategic','chess','smart','play','think'],
  smooth:        ['smooth','velvet','silky','cool','jazz'],
  trust:         ['trust','safe','warm','reliable','steady'],
};

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🎵 DWB TikTok Trending Sounds Scraper');
  console.log(`   Limit: ${LIMIT} | Download: ${DOWNLOAD} | Day: ${DAY_ARG || 'any'}`);
  console.log('');

  let browser;
  try {
    // ── Launch Puppeteer ────────────────────────────────────────────────────
    console.log('🚀 Launching browser...');
    
    // Works in GitHub Actions (headless) and locally
    const execPath = process.env.CHROMIUM_PATH || 
                     await chromium.executablePath() ||
                     '/usr/bin/chromium-browser';

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--lang=en-US,en',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: execPath,
      headless: chromium.headless ?? 'new',
    });

    const page = await browser.newPage();

    // Block images/fonts to speed up scraping
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'media'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Set realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/121.0.0.0 Safari/537.36'
    );

    // ── Navigate to Creative Center ─────────────────────────────────────────
    console.log('🌐 Loading TikTok Creative Center...');
    await page.goto(CC_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Wait for sound cards to load
    console.log('⏳ Waiting for trending sounds...');
    await page.waitForSelector(
      '[class*="music-item"], [class*="sound-item"], [class*="trending"], [class*="musicCard"]',
      { timeout: 30000 }
    ).catch(() => {
      console.log('   ⚠️  Selector timeout — trying broader approach');
    });

    // Small delay to let JS render
    await new Promise(r => setTimeout(r, 3000));

    // ── Extract Sound Data ──────────────────────────────────────────────────
    console.log('📊 Extracting sound data...');

    const sounds = await page.evaluate((limit) => {
      const results = [];

      // Try multiple possible selectors (TikTok changes classes frequently)
      const selectors = [
        '[class*="MusicCard"]',
        '[class*="music-card"]',
        '[class*="sound-card"]',
        '[class*="trending-music"]',
        '[class*="musicItem"]',
        'div[class*="Card"][class*="music"]',
      ];

      let cards = [];
      for (const sel of selectors) {
        cards = document.querySelectorAll(sel);
        if (cards.length > 0) break;
      }

      // Fallback: look for any element with music/audio data attributes
      if (cards.length === 0) {
        cards = document.querySelectorAll('[data-music-id], [data-sound-id], [data-track-id]');
      }

      cards = Array.from(cards).slice(0, limit);

      cards.forEach((card, i) => {
        const getText = (sels) => {
          for (const s of sels) {
            const el = card.querySelector(s);
            if (el && el.textContent.trim()) return el.textContent.trim();
          }
          return null;
        };

        // Extract title
        const title = getText([
          '[class*="title"]',
          '[class*="name"]',
          '[class*="music-name"]',
          'h3', 'h4', 'p',
        ]) || `Trending Sound #${i + 1}`;

        // Extract artist
        const artist = getText([
          '[class*="author"]',
          '[class*="artist"]',
          '[class*="creator"]',
          '[class*="user"]',
        ]) || 'Unknown Artist';

        // Extract play count / usage count
        const usage = getText([
          '[class*="count"]',
          '[class*="usage"]',
          '[class*="video-count"]',
          '[class*="post"]',
        ]) || '0';

        // Extract sound ID from data attributes or links
        let soundId = card.getAttribute('data-music-id') ||
                      card.getAttribute('data-sound-id') ||
                      card.getAttribute('data-track-id') || null;

        // Try to get it from a link
        if (!soundId) {
          const link = card.querySelector('a[href*="music"], a[href*="sound"]');
          if (link) {
            const match = link.href.match(/music\/([^/?]+)|sound\/([^/?]+)/);
            soundId = match ? (match[1] || match[2]) : null;
          }
        }

        // Audio preview URL (sometimes in data attributes or audio elements)
        let previewUrl = card.getAttribute('data-preview-url') || null;
        if (!previewUrl) {
          const audio = card.querySelector('audio');
          previewUrl = audio ? audio.src : null;
        }

        results.push({
          rank: i + 1,
          title: title.replace(/[\n\r\t]+/g, ' ').trim(),
          artist: artist.replace(/[\n\r\t]+/g, ' ').trim(),
          usageCount: usage,
          soundId,
          previewUrl,
          scrapedAt: new Date().toISOString(),
        });
      });

      return results;
    }, LIMIT);

    if (sounds.length === 0) {
      console.log('⚠️  No sounds found via DOM. Trying network interception approach...');
      // The page may have loaded sounds via XHR — let's try the API endpoint directly
      await tryApiEndpoint(page, sounds);
    }

    console.log(`✅ Found ${sounds.length} trending sounds\n`);

    // Print results
    sounds.forEach(s => {
      console.log(`  ${String(s.rank).padStart(2, '0')}. ${s.title}`);
      console.log(`      Artist: ${s.artist} | Usage: ${s.usageCount}`);
      if (s.soundId) console.log(`      ID: ${s.soundId}`);
      if (s.previewUrl) console.log(`      Preview: ${s.previewUrl.substring(0, 60)}...`);
      console.log('');
    });

    // ── Day-specific matching ───────────────────────────────────────────────
    if (DAY_ARG && sounds.length > 0) {
      const vibes = DAY_VIBES[DAY_ARG] || ['upbeat', 'motivational'];
      const keywords = vibes.flatMap(v => VIBE_KEYWORDS[v] || [v]);

      console.log(`🎯 Finding best match for Day ${DAY_ARG}...`);
      console.log(`   Vibes: ${vibes.join(', ')}`);

      let bestMatch = sounds[0]; // default to #1 trending
      let bestScore = 0;

      sounds.forEach(sound => {
        const text = (sound.title + ' ' + sound.artist).toLowerCase();
        const score = keywords.filter(kw => text.includes(kw)).length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = sound;
        }
      });

      console.log(`\n✨ Best match: "${bestMatch.title}" by ${bestMatch.artist}`);
      console.log(`   (Vibe score: ${bestScore}/${keywords.length})\n`);
      bestMatch.recommendedForDay = DAY_ARG;
    }

    // ── Save JSON ───────────────────────────────────────────────────────────
    fs.writeFileSync(JSON_OUT, JSON.stringify(sounds, null, 2));
    console.log(`💾 Saved: ${JSON_OUT}`);

    // ── Download MP3s ───────────────────────────────────────────────────────
    if (DOWNLOAD && sounds.length > 0) {
      console.log('\n📥 Downloading audio...');
      
      if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
      }

      for (const sound of sounds) {
        await downloadSound(sound, page);
      }
    }

  } catch (err) {
    console.error('❌ Scraper error:', err.message);
    // Send ntfy notification if NTFY_TOPIC is set
    if (process.env.NTFY_TOPIC) {
      await notifyFail(err.message);
    }
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

// ── Try the Creative Center internal API directly ─────────────────────────────
// TikTok CC makes XHR calls to get trending data — intercept the response
async function tryApiEndpoint(page, sounds) {
  try {
    // Intercept network responses to find the sounds API response
    const apiData = await page.evaluate(async () => {
      // Try known Creative Center API endpoints (these are public, no auth)
      const endpoints = [
        'https://www.tiktok.com/api/creative_center/music/trending/?aid=1988&count=10&period=7&page=1',
        'https://ads.tiktok.com/creative_radar_api/v1/popular_trend/music/list?period=7&page=1&limit=10',
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'Referer': 'https://ads.tiktok.com/',
            },
          });
          if (res.ok) {
            const data = await res.json();
            return { url, data };
          }
        } catch (e) { /* continue */ }
      }
      return null;
    });

    if (apiData && apiData.data) {
      console.log(`✅ API response from: ${apiData.url}`);
      // Parse the API response (structure varies by endpoint)
      const items = apiData.data?.data?.list || 
                    apiData.data?.music_list || 
                    apiData.data?.items || [];
      
      items.slice(0, 10).forEach((item, i) => {
        sounds.push({
          rank: i + 1,
          title: item.music_info?.title || item.title || `Trending #${i+1}`,
          artist: item.music_info?.author || item.author || 'Unknown',
          usageCount: item.post_num || item.use_count || '0',
          soundId: item.music_id || item.id || null,
          previewUrl: item.music_info?.play_url || item.preview_url || null,
          downloadUrl: item.music_info?.download_url || null,
          scrapedAt: new Date().toISOString(),
        });
      });
    }
  } catch (e) {
    console.log('   API endpoint also failed:', e.message);
  }
}

// ── Download a single sound ───────────────────────────────────────────────────
// Uses the muscdn.com / tiktokcdn.com direct download link
async function downloadSound(sound, page) {
  const filename = `trending_${String(sound.rank).padStart(2,'0')}_${sanitize(sound.title)}.mp3`;
  const filepath = path.join(OUT_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  ⏭️  Already exists: ${filename}`);
    return filepath;
  }

  // ── Method 1: Direct URL if we have it ─────────────────────────────────
  const directUrl = sound.downloadUrl || sound.previewUrl;
  if (directUrl && (directUrl.includes('muscdn.com') || directUrl.includes('tiktokcdn.com') || directUrl.includes('akamaized.net'))) {
    try {
      await downloadFromUrl(directUrl, filepath);
      console.log(`  ✅ Downloaded: ${filename}`);
      sound.localPath = filepath;
      return filepath;
    } catch (e) {
      console.log(`  ⚠️  Direct URL failed: ${e.message}`);
    }
  }

  // ── Method 2: Use soundID to construct download URL ──────────────────────
  // TikTok CDN pattern for Creative Center preview audio:
  // https://sf16-ies-music.tiktokcdn.com/obj/ies-music/{SOUND_ID}
  if (sound.soundId) {
    const cdnPatterns = [
      `https://sf16-ies-music.tiktokcdn.com/obj/ies-music/${sound.soundId}`,
      `https://sf77-ies-music.tiktokcdn.com/obj/ies-music-aiso/${sound.soundId}`,
      `https://sf19-ies-music.tiktokcdn.com/obj/musically-maliva-obj/${sound.soundId}`,
    ];

    for (const url of cdnPatterns) {
      try {
        await downloadFromUrl(url, filepath);
        console.log(`  ✅ Downloaded via CDN: ${filename}`);
        sound.localPath = filepath;
        return filepath;
      } catch (e) { /* try next */ }
    }
  }

  // ── Method 3: Navigate to sound page and extract audio src ──────────────
  if (sound.soundId) {
    try {
      const soundPageUrl = `https://www.tiktok.com/music/${sound.soundId}`;
      await page.goto(soundPageUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      
      const audioSrc = await page.evaluate(() => {
        const audio = document.querySelector('audio');
        return audio ? audio.src : null;
      });

      if (audioSrc) {
        await downloadFromUrl(audioSrc, filepath);
        console.log(`  ✅ Downloaded via sound page: ${filename}`);
        sound.localPath = filepath;
        return filepath;
      }
    } catch (e) {
      console.log(`  ⚠️  Sound page method failed: ${e.message}`);
    }
  }

  console.log(`  ❌ Could not download: ${sound.title}`);
  return null;
}

// ── Download from URL using axios ─────────────────────────────────────────────
async function downloadFromUrl(url, filepath) {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.tiktok.com/',
      'Accept': 'audio/mpeg, audio/*, */*',
    },
  });

  if (response.status !== 200) {
    throw new Error(`HTTP ${response.status}`);
  }

  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// ── Send ntfy failure notification ───────────────────────────────────────────
async function notifyFail(message) {
  try {
    const topic = process.env.NTFY_TOPIC;
    await axios.post(`https://ntfy.sh/${topic}`, message, {
      headers: {
        Title: 'DWB: TikTok Scraper Failed',
        Priority: 'high',
        Tags: 'x,audio',
      },
    });
  } catch (e) { /* ntfy failure is not critical */ }
}

// ── Sanitize filename ─────────────────────────────────────────────────────────
function sanitize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 40);
}

main();
