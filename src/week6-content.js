// ─────────────────────────────────────────────────────────────────────────────
// content/week6-content.js — DWB Week 6 (Days 36–42)
// Theme: FIRST AFFILIATE LINK CLICK
// Each video builds psychological trust → curiosity → click intent
// Day 42 (Sunday): Week 6 recap + results reveal
//
// COLOR GRADES for Week 6 — add these to VideoComposition.jsx COLOR_GRADES:
//   day36: { top:'rgba(0,60,0,0.22)',   mid:'rgba(0,30,0,0.06)',   bot:'rgba(0,60,0,0.22)',   accent:'#00FF44' },
//   day37: { top:'rgba(80,40,0,0.22)',  mid:'rgba(40,20,0,0.06)',  bot:'rgba(80,40,0,0.22)',  accent:'#FF9900' },
//   day38: { top:'rgba(0,0,80,0.22)',   mid:'rgba(0,0,40,0.06)',   bot:'rgba(0,0,80,0.22)',   accent:'#4499FF' },
//   day39: { top:'rgba(70,0,70,0.22)',  mid:'rgba(35,0,35,0.06)',  bot:'rgba(70,0,70,0.22)',  accent:'#FF44FF' },
//   day40: { top:'rgba(80,20,0,0.22)',  mid:'rgba(40,10,0,0.06)',  bot:'rgba(80,20,0,0.22)',  accent:'#FF6600' },
//   day41: { top:'rgba(0,20,60,0.22)',  mid:'rgba(0,10,30,0.06)',  bot:'rgba(0,20,60,0.22)',  accent:'#00AAFF' },
//   day42: { top:'rgba(40,30,0,0.22)',  mid:'rgba(20,15,0,0.06)',  bot:'rgba(40,30,0,0.22)',  accent:'#FFD700' },
//
// GRADE_COLORS for Week 6 — add to GRADE_COLORS in VideoComposition.jsx:
//   day36: ['#00FF44', '#00CC33', '#FFD700'],
//   day37: ['#FF9900', '#FFCC00', '#FFFFFF'],
//   day38: ['#0044FF', '#4499FF', '#00CCFF'],
//   day39: ['#FF00FF', '#CC00FF', '#FF4499'],
//   day40: ['#FF4400', '#FF9900', '#FFD700'],
//   day41: ['#0066FF', '#00AAFF', '#00FFCC'],
//   day42: ['#FFD700', '#FFAA00', '#FF6600'],
//
// BORDER_COLORS for Week 6 — add to BORDER_COLORS in VideoComposition.jsx:
//   day36: 'rgba(0,255,68,0.45)',
//   day37: 'rgba(255,153,0,0.45)',
//   day38: 'rgba(68,153,255,0.45)',
//   day39: 'rgba(255,68,255,0.45)',
//   day40: 'rgba(255,102,0,0.45)',
//   day41: 'rgba(0,170,255,0.45)',
//   day42: 'rgba(255,215,0,0.45)',
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEO_DATA = [

  // ─────────────────────────────────────────────
  // DAY 36 — "The Only Affiliate Strategy That Actually Works for Beginners"
  // VIBE: Motivational/authoritative — upbeat hip-hop or trap
  // ─────────────────────────────────────────────
  {
    id: "day36",
    filename: "day36_final.mp4",
    music: "day36.mp3",
    title: "The Only Affiliate Strategy That Actually Works for Beginners",
    pexelsSearchTerms: ["online business laptop success", "entrepreneur phone vertical", "money income vertical", "writing notes desk vertical"],
    overlays: [
      {
        text: "Forget everything\nyou've been told\nabout affiliate marketing 🚫",
        font: "Anton",
        color: "#FF3300",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 60
      },
      {
        text: "99% of beginners\ntry to SELL.\nThat's the mistake.",
        font: "Montserrat",
        color: "#FF6600",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 52
      },
      {
        text: "The 1% strategy:\nSolve a problem.\nRecommend the tool.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-highlight",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 50
      },
      {
        text: "People don't click\nads. They click\ntrusted recommendations.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 450,
        endFrame: 600,
        position: "middle",
        fontSize: 48
      },
      {
        text: "My Week 6 goal:\nGet my first\naffiliate click 🎯",
        font: "Montserrat",
        color: "#00FFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-right",
        startFrame: 600,
        endFrame: 750,
        position: "middle",
        fontSize: 52
      },
      {
        text: "Save this if you're\nbuilding from zero 👇",
        font: "Anton",
        color: "#9933FF",
        stroke: { size: 3, color: "#000000" },
        animation: "bounce",
        startFrame: 750,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 62
      }
    ],
    tiktokCaption: "The affiliate strategy that actually works — and it's not what most beginners do 🎯 Save this if you're starting from zero 👇 #affiliatemarketing #beginnermarketing #facelesscreator #makemoneyonline #day36",
    youtubeTitle: "The Only Affiliate Marketing Strategy That Actually Works for Beginners | Day 36/90 | Daily Wealth Building",
    youtubeDescription: "Day 36 of 90 — Week 6 starts now. This week's goal: get the first affiliate link click.\n\n→ Why beginners fail at affiliate marketing\n→ The mindset shift that changes everything\n→ The exact approach I'm using this week\n\nSave this if you're building from zero.\n\n🔔 Subscribe for daily journey updates\n@DailyWealthBuilding\n\n#DailyWealthBuilding #affiliatemarketing #beginners #makemoneyonline #facelesscreator",
    pinnedComment: "Week 6 officially starts now. One goal: first affiliate link click. Dropping updates every day this week. Save this if you're starting from zero. 🎯"
  },

  // ─────────────────────────────────────────────
  // DAY 37 — "How I Chose My First Affiliate Product (And What Almost Fooled Me)"
  // VIBE: Story-driven/warm — lo-fi or acoustic
  // ─────────────────────────────────────────────
  {
    id: "day37",
    filename: "day37_final.mp4",
    music: "day37.mp3",
    title: "How I Chose My First Affiliate Product (And What Almost Fooled Me)",
    pexelsSearchTerms: ["laptop search online vertical", "person phone thinking vertical", "reading notes vertical", "business research vertical"],
    overlays: [
      {
        text: "Picking your first\naffiliate product\nis a trap 🪤",
        font: "Anton",
        color: "#FF9900",
        stroke: { size: 3, color: "#000000" },
        animation: "pop",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 62
      },
      {
        text: "Most people pick\nthe highest commission.\nBig mistake.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 90,
        endFrame: 240,
        position: "middle",
        fontSize: 52
      },
      {
        text: "My rule:\nWould I buy this\nwith my own money?",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-highlight",
        startFrame: 240,
        endFrame: 420,
        position: "middle",
        fontSize: 52
      },
      {
        text: "If the answer\nis NO — skip it.\nNo exceptions. 🚫",
        font: "Montserrat",
        color: "#FF6600",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 420,
        endFrame: 570,
        position: "middle",
        fontSize: 50
      },
      {
        text: "What I picked:\nA free tool most\ncreators already use.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-right",
        startFrame: 570,
        endFrame: 720,
        position: "middle",
        fontSize: 50
      },
      {
        text: "What's YOUR\ncriteria for picking\na product? 👇",
        font: "Anton",
        color: "#9933FF",
        stroke: { size: 3, color: "#000000" },
        animation: "bounce",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 60
      }
    ],
    tiktokCaption: "Everyone picks the highest paying product. Here's why that's a trap 🪤 My criteria might surprise you 👇 #affiliatemarketing #productresearch #contentcreator #day37 #facelesscreator",
    youtubeTitle: "How I Chose My First Affiliate Product (What Almost Fooled Me) | Day 37/90 | Daily Wealth Building",
    youtubeDescription: "Day 37 of 90 — my criteria for choosing an affiliate product as a beginner, and why the obvious choice is usually wrong.\n\n→ Why high commission products backfire for beginners\n→ The one question that filters every product\n→ What I actually chose and why\n\nWhat's your criteria? Tell me in the comments.\n\n🔔 Subscribe for daily updates\n@DailyWealthBuilding\n\n#DailyWealthBuilding #affiliatemarketing #productresearch #facelesscreator",
    pinnedComment: "My #1 rule: would I buy this with my own money? If no — skip it, no matter the commission rate. What's your criteria? 👇"
  },

  // ─────────────────────────────────────────────
  // DAY 38 — "The Link Placement Strategy No One Talks About"
  // VIBE: Techy/strategic — electronic or synth
  // ─────────────────────────────────────────────
  {
    id: "day38",
    filename: "day38_final.mp4",
    music: "day38.mp3",
    title: "The Link Placement Strategy No One Talks About",
    pexelsSearchTerms: ["phone social media vertical", "content creator phone vertical", "digital strategy laptop vertical", "online course vertical"],
    overlays: [
      {
        text: "Where you put\nthe link matters MORE\nthan the link itself 🔗",
        font: "Anton",
        color: "#4499FF",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 58
      },
      {
        text: "Wrong approach:\nLink in every\nvideo description.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 90,
        endFrame: 240,
        position: "middle",
        fontSize: 50
      },
      {
        text: "Right approach:\nLink ONLY in videos\nthat teach the tool.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "word-highlight",
        startFrame: 240,
        endFrame: 420,
        position: "middle",
        fontSize: 50
      },
      {
        text: "Context = trust.\nTrust = clicks.\nClicks = income. 💡",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 420,
        endFrame: 570,
        position: "middle",
        fontSize: 50
      },
      {
        text: "My Day 38 move:\nPosted my first\nlink today. 🎯",
        font: "Montserrat",
        color: "#00FFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-right",
        startFrame: 570,
        endFrame: 720,
        position: "middle",
        fontSize: 52
      },
      {
        text: "Save this.\nYou'll need it\nwhen YOU'RE ready 👇",
        font: "Anton",
        color: "#9933FF",
        stroke: { size: 3, color: "#000000" },
        animation: "bounce",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 62
      }
    ],
    tiktokCaption: "Where you put your affiliate link matters more than the link itself. Most people get this completely wrong 🔗 Save this for when you're ready 👇 #affiliatemarketing #linkinbio #contentcreator #day38 #facelesscreator",
    youtubeTitle: "The Affiliate Link Placement Strategy No One Talks About | Day 38/90 | Daily Wealth Building",
    youtubeDescription: "Day 38 of 90 — where to place your affiliate links for maximum clicks, and the mindset behind it.\n\n→ Why linking in every video kills conversions\n→ The context-trust-click chain\n→ My first link placement live today\n\nSave this for when you're ready to place your first link.\n\n🔔 Subscribe for daily updates\n@DailyWealthBuilding\n\n#DailyWealthBuilding #affiliatemarketing #linkplacement #facelesscreator",
    pinnedComment: "Context = trust. Trust = clicks. I posted my first link today — updates on whether it gets a click are coming this week. Stay tuned. 🎯"
  },

  // ─────────────────────────────────────────────
  // DAY 39 — "Why Your CTA Is Killing Your Clicks (Fix This First)"
  // VIBE: Bold/assertive — hip-hop or drill
  // ─────────────────────────────────────────────
  {
    id: "day39",
    filename: "day39_final.mp4",
    music: "day39.mp3",
    title: "Why Your CTA Is Killing Your Clicks (Fix This First)",
    pexelsSearchTerms: ["person frustrated phone vertical", "marketing strategy vertical", "laptop entrepreneur vertical", "call to action digital vertical"],
    overlays: [
      {
        text: "'Check the link\nin my bio'\nis the worst CTA 🚫",
        font: "Anton",
        color: "#FF00FF",
        stroke: { size: 3, color: "#000000" },
        animation: "pop",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 60
      },
      {
        text: "It tells them NOTHING\nabout why they\nshould click.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 90,
        endFrame: 240,
        position: "middle",
        fontSize: 50
      },
      {
        text: "Better CTA:\n'I use this free tool\ndaily — link below.'",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "word-highlight",
        startFrame: 240,
        endFrame: 420,
        position: "middle",
        fontSize: 48
      },
      {
        text: "Give a REASON.\nGive a CONTEXT.\nGive a BENEFIT. 💡",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 420,
        endFrame: 570,
        position: "middle",
        fontSize: 50
      },
      {
        text: "I rewrote my\nCTA on Day 38's\nvideo today. 📝",
        font: "Montserrat",
        color: "#00FFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-right",
        startFrame: 570,
        endFrame: 720,
        position: "middle",
        fontSize: 52
      },
      {
        text: "What's your current\nCTA? Drop it\nbelow 👇",
        font: "Anton",
        color: "#9933FF",
        stroke: { size: 3, color: "#000000" },
        animation: "bounce",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 62
      }
    ],
    tiktokCaption: "'Check the link in my bio' is killing your clicks. Here's the fix 🔥 What's your current CTA? Drop it below 👇 #affiliatemarketing #calltoaction #contentcreator #day39 #facelesscreator",
    youtubeTitle: "Why Your CTA is Killing Your Affiliate Clicks (Fix This First) | Day 39/90 | Daily Wealth Building",
    youtubeDescription: "Day 39 of 90 — the most common CTA mistake beginners make with affiliate links, and how to fix it in 60 seconds.\n\n→ Why 'link in bio' doesn't convert\n→ The 3-part CTA formula: reason + context + benefit\n→ What I changed on yesterday's video\n\nWhat's your current CTA? Drop it in the comments.\n\n🔔 Subscribe for daily updates\n@DailyWealthBuilding\n\n#DailyWealthBuilding #affiliatemarketing #calltoaction #facelesscreator",
    pinnedComment: "Reason + Context + Benefit. That's all a good CTA needs. What's yours? Drop it below and I'll tell you if it converts 👇"
  },

  // ─────────────────────────────────────────────
  // DAY 40 — "40 Days In. The Honest Truth About Building in Public"
  // VIBE: Reflective/honest — lo-fi or cinematic
  // ─────────────────────────────────────────────
  {
    id: "day40",
    filename: "day40_final.mp4",
    music: "day40.mp3",
    title: "40 Days In. The Honest Truth About Building in Public",
    pexelsSearchTerms: ["calendar milestone vertical", "person writing notes vertical", "business journey vertical", "desk workspace thinking vertical"],
    overlays: [
      {
        text: "Day 40.\nHere's what nobody\ntells you 📋",
        font: "Anton",
        color: "#FF6600",
        stroke: { size: 3, color: "#000000" },
        animation: "pop",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 64
      },
      {
        text: "Building in public\nis uncomfortable.\nDo it anyway.",
        font: "Montserrat",
        color: "#FF9900",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 50
      },
      {
        text: "The silence is loud.\nNo clicks. No DMs.\nSome days, nothing.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 48
      },
      {
        text: "But the reps compound.\nDay 40 Ashley is better\nthan Day 1 Ashley.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "word-highlight",
        startFrame: 450,
        endFrame: 630,
        position: "middle",
        fontSize: 46
      },
      {
        text: "50 more days.\nThe goal doesn't\nchange. 💪",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 780,
        position: "middle",
        fontSize: 52
      },
      {
        text: "Drop 40 if you're\nstill in the game 👇",
        font: "Anton",
        color: "#9933FF",
        stroke: { size: 3, color: "#000000" },
        animation: "bounce",
        startFrame: 780,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 64
      }
    ],
    tiktokCaption: "Day 40 of 90. The honest truth about what building in public actually feels like 📋 Drop 40 if you're still in the game 👇 #90daychallenge #buildinpublic #contentcreator #facelesscreator #day40",
    youtubeTitle: "40 Days In: The Honest Truth About Building in Public | Day 40/90 | Daily Wealth Building",
    youtubeDescription: "Day 40 of 90 — an honest check-in. What building in public actually feels like at the halfway point.\n\n→ The uncomfortable parts nobody talks about\n→ What's happened in 40 days (raw numbers)\n→ Why I'm not stopping at day 50\n\nDrop 40 if you're still building. Let's go.\n\n🔔 Subscribe for daily updates\n@DailyWealthBuilding\n\n#DailyWealthBuilding #buildinpublic #contentcreator #90daychallenge #facelesscreator",
    pinnedComment: "40 days in. No viral moment. No big income. Just reps. And reps compound. Drop 40 if you're still in the game. 💪"
  },

  // ─────────────────────────────────────────────
  // DAY 41 — "What Happens to Your Content After You Post It (Most Creators Don't Know This)"
  // VIBE: Curious/educational — synth or future bass
  // ─────────────────────────────────────────────
  {
    id: "day41",
    filename: "day41_final.mp4",
    music: "day41.mp3",
    title: "What Happens to Your Content After You Post It",
    pexelsSearchTerms: ["social media algorithm vertical", "phone analytics vertical", "content strategy vertical", "data statistics vertical"],
    overlays: [
      {
        text: "What TikTok does\nto your video\nright after you post 👀",
        font: "Anton",
        color: "#00AAFF",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 58
      },
      {
        text: "Phase 1 (0–30 mins):\nShown to ~200\nclosest followers.",
        font: "Montserrat",
        color: "#00FFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 50
      },
      {
        text: "Phase 2 (30–120 mins):\nWatch time judged.\nAlgorithm decides.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 50
      },
      {
        text: "Phase 3 (2–48 hrs):\nPushed to new\naudience if it passes.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "word-highlight",
        startFrame: 450,
        endFrame: 630,
        position: "middle",
        fontSize: 48
      },
      {
        text: "Your hook controls\nPhase 1. Master it\nor nothing matters.",
        font: "Montserrat",
        color: "#FF9900",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-right",
        startFrame: 630,
        endFrame: 780,
        position: "middle",
        fontSize: 48
      },
      {
        text: "Save + share this.\nYour creator friends\nneed to know 👇",
        font: "Anton",
        color: "#9933FF",
        stroke: { size: 3, color: "#000000" },
        animation: "bounce",
        startFrame: 780,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 60
      }
    ],
    tiktokCaption: "What TikTok actually does to your video right after you post it — most creators have no idea 👀 Save + share this 👇 #tiktokalgorithm #contentcreator #tiktokgrowth #facelesscreator #day41",
    youtubeTitle: "What Happens to Your Content After You Post It (Algorithm Breakdown) | Day 41/90 | Daily Wealth Building",
    youtubeDescription: "Day 41 of 90 — a breakdown of the TikTok/YouTube Shorts algorithm phases that every content creator needs to understand.\n\n→ Phase 1: the initial test pool\n→ Phase 2: the watch time judgment window\n→ Phase 3: broad push (or death)\n→ Why your hook is everything\n\nSave and share this with a creator who needs it.\n\n🔔 Subscribe for daily updates\n@DailyWealthBuilding\n\n#DailyWealthBuilding #algorithm #contentcreator #tiktokgrowth #facelesscreator",
    pinnedComment: "Phase 1 is the hook. You have 3 seconds to keep someone from scrolling. Everything else is downstream from that. Save this. 📌"
  },

  // ─────────────────────────────────────────────
  // DAY 42 — "Week 6 Results: Did I Get the First Affiliate Click?"
  // VIBE: Dramatic/anticipation — cinematic or orchestral
  // ─────────────────────────────────────────────
  {
    id: "day42",
    filename: "day42_final.mp4",
    music: "day42.mp3",
    title: "Week 6 Results: Did I Get the First Affiliate Click?",
    pexelsSearchTerms: ["business results statistics vertical", "person phone celebration vertical", "laptop analytics vertical", "success journey vertical"],
    overlays: [
      {
        text: "Week 6 is done.\nDid I get my\nfirst affiliate click? 👀",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "pop",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 60
      },
      {
        text: "This week I:\nPosted link. Wrote\nnew CTA. Taught context.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 48
      },
      {
        text: "The result...",
        font: "Anton",
        color: "#FF9900",
        stroke: { size: 3, color: "#000000" },
        animation: "scramble",
        startFrame: 270,
        endFrame: 420,
        position: "middle",
        fontSize: 72
      },
      {
        text: "Check the pinned\ncomment for the\nfull reveal 📌",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "word-highlight",
        startFrame: 420,
        endFrame: 600,
        position: "middle",
        fontSize: 52
      },
      {
        text: "Week 7 goal\nis already locked.\nWe're not stopping.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 600,
        endFrame: 750,
        position: "middle",
        fontSize: 50
      },
      {
        text: "Drop your Week 6\nWIN below 🔥",
        font: "Anton",
        color: "#9933FF",
        stroke: { size: 3, color: "#000000" },
        animation: "bounce",
        startFrame: 750,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 66
      }
    ],
    tiktokCaption: "Week 6 done. 42/90. Did I get the first affiliate click? Check my pinned comment 📌 Drop your Week 6 win below 🔥 #affiliatemarketing #week6 #90daychallenge #facelesscreator #day42",
    youtubeTitle: "Week 6 Results: Did I Get My First Affiliate Link Click? | Day 42/90 | Daily Wealth Building",
    youtubeDescription: "Day 42 of 90 — Week 6 complete. The full results reveal on whether I hit the first affiliate link click goal.\n\n→ Everything I did this week to push for the click\n→ The result (in pinned comment)\n→ What Week 7 focus is\n\nDrop your Week 6 win in the comments. Let's celebrate together.\n\n🔔 Subscribe for daily updates\n@DailyWealthBuilding\n\n#DailyWealthBuilding #affiliatemarketing #week6 #90daychallenge #facelesscreator",
    pinnedComment: "[UPDATE AFTER POSTING: Replace this with the actual result — did you get a click or not? Be 100% honest. That's what this channel is about. 🎯]"
  }

];
