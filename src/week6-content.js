  // -----------------------------------------------------------------------------
// src/week6-content.js -- DWB Week 6 -- Days 36-42
// Theme: Money Myths & The Wealth Gap
// Export: default (weeks 5-6 use default export)
//
// v2 -- Slower overlay timings + larger fonts for readability
//
// Overlay timing structure (900 frames = 30s):
//   [1] HOOK          0 -  75  (2.5s)
//   [2] EXPAND       75 - 165  (3.0s)
//   [3] PAIN        165 - 255  (3.0s)
//   [4] PATTERN INT 255 - 330  (2.5s)
//   [5] LIE/EXPOSE  330 - 405  (2.5s)
//   [6] FORMULA     405 - 540  (4.5s)
//   [7] PROOF       540 - 630  (3.0s)
//   [8] APPLY       630 - 735  (3.5s)
//   [9] LOOP        735 - 810  (2.5s)
//  [10] CTA         810 - 900  (3.0s)
// -----------------------------------------------------------------------------

export default [

  // -- DAY 36 ------------------------------------------------------------------
  {
    id: "day36",
    filename: "day36_final.mp4",
    music: "day36.mp3",
    musicMood: "punchy",
    title: "Why Your Savings Account Is Losing You Money",
    pexelsSearchTerms: [
      "aerial city skyline financial district vertical",
      "luxury apartment window city view vertical",
      "person on phone stressed bills debt vertical",
      "dollar bills falling inflation money vertical"
    ],
    overlays: [
      {
        text: "YOUR SAVINGS ACCOUNT\nIS LOSING YOU MONEY 💸",
        font: "Anton",
        color: "#00FF44",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 75,
        position: "top-center",
        fontSize: 81
      },
      {
        text: "You've been told\nsaving money = smart.\nThat's half the truth.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 75,
        endFrame: 165,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Meanwhile inflation\neats your savings\nevery single year.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "letter-drop",
        startFrame: 165,
        endFrame: 255,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Your bank earns MORE\nfrom YOUR money\nthan you ever will.",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 255,
        endFrame: 330,
        position: "middle",
        fontSize: 84
      },
      {
        text: "The lie: 'Just save more.'\nThe truth: saving alone\nis a slow loss.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 330,
        endFrame: 405,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The formula:\nKeep 3 months expenses\nas safety net.\nInvest the rest.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "neon-glow",
        startFrame: 405,
        endFrame: 540,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Wealthy people\nkeep savings lean.\nThey put money to work.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 540,
        endFrame: 630,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Action today:\nCheck your savings rate.\nMove anything extra\ninto index funds.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 735,
        position: "middle",
        fontSize: 82
      },
      {
        text: "That 'safe' feeling\nis the most expensive\nfeeling you own.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "flip-up",
        startFrame: 735,
        endFrame: 810,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Is your money working\nFOR you or AGAINST you?\nComment YES or NO 👇",
        font: "Anton",
        color: "#00FF44",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 810,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 82
      }
    ],
    tiktokCaption: "Your savings account feels safe -- but that feeling is costing you thousands 💸 Is your money working FOR you or AGAINST you? Comment YES or NO 👇 #savingsaccount #moneytips #wealthbuilding #financialliteracy #day36",
    youtubeTitle: "Why Your Savings Account Is Losing You Money | Day 36/90 | Daily Wealth Building",
    youtubeDescription: "Day 36 of 90 -- Why 'just save more' is keeping you financially stuck and what to do instead.\n\n→ How inflation silently erodes your savings every year\n→ How banks profit from your money while you earn pennies\n→ The 3-month emergency fund rule\n→ What to do with money beyond your safety net\n→ The mindset shift from saving to investing\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #savingsaccount #moneytips #wealthbuilding #financialliteracy",
    pinnedComment: "Saving isn't bad -- saving ONLY is. Keep 3 months of expenses liquid, put everything else to work. Your bank is already investing your money. Why aren't you?"
  },

  // -- DAY 37 ------------------------------------------------------------------
  {
    id: "day37",
    filename: "day37_final.mp4",
    music: "day37.mp3",
    musicMood: "motivational",
    title: "If You Earn Under 1K Per Month Stop These Habits",
    pexelsSearchTerms: [
      "young person empty wallet broke urban vertical",
      "city street person walking stressed broke vertical",
      "person phone banking app empty account vertical",
      "urban lifestyle expenses coffee shop vertical"
    ],
    overlays: [
      {
        text: "EARNING UNDER $1K/MONTH?\nSTOP THESE HABITS. 🚫",
        font: "Anton",
        color: "#FF9900",
        stroke: { size: 3, color: "#000000" },
        animation: "pop",
        startFrame: 0,
        endFrame: 75,
        position: "top-center",
        fontSize: 76
      },
      {
        text: "At this income level\nevery bad habit costs\nyou months of progress.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 75,
        endFrame: 165,
        position: "middle",
        fontSize: 82
      },
      {
        text: "You work hard.\nNothing is left\nby month end.\nEvery. Single. Month.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 165,
        endFrame: 255,
        position: "middle",
        fontSize: 82
      },
      {
        text: "What's eating it:\nSubscriptions. Eating out.\nImpulse purchases.",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 255,
        endFrame: 330,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The lie:\n'I just need to earn more.'\nPlug the leaks first.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 330,
        endFrame: 405,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The formula:\nTrack every expense\nfor 7 days straight.\nCut the bottom 3.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "frosted",
        startFrame: 405,
        endFrame: 540,
        position: "middle",
        fontSize: 82
      },
      {
        text: "People who escaped\nthis range spent less\nBEFORE they earned more.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 540,
        endFrame: 630,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Right now:\nOpen your bank app.\nFind one forgotten\nsubscription. Cancel it.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 735,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Same income.\nDifferent habits.\nCompletely different life\nin 90 days.",
        font: "Montserrat",
        color: "#FF9900",
        stroke: { size: 2, color: "#000000" },
        animation: "flip-up",
        startFrame: 735,
        endFrame: 810,
        position: "middle",
        fontSize: 82
      },
      {
        text: "What do you spend on\nthat you KNOW\nyou shouldn't? Drop it 👇",
        font: "Anton",
        color: "#FF9900",
        stroke: { size: 3, color: "#000000" },
        animation: "word-bounce",
        startFrame: 810,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 82
      }
    ],
    tiktokCaption: "Earning under $1K/month -- these habits are exactly why nothing is left at month end 🚫 What's the ONE thing you spend on that you KNOW you shouldn't? Drop it below 👇 #budgeting #moneytips #financialfreedom #brokemindset #day37",
    youtubeTitle: "If You Earn Under $1K Per Month Stop These Habits | Day 37/90 | Daily Wealth Building",
    youtubeDescription: "Day 37 of 90 -- Why earning more won't fix anything until you plug the leaks first.\n\n→ The hidden expenses draining low-income earners monthly\n→ Why subscriptions and daily eating out are silent killers\n→ The 7-day expense tracking challenge\n→ How to cut the bottom 3 expenses without suffering\n→ Why spending habits always change before income does\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #budgeting #moneytips #financialliteracy #wealthbuilding",
    pinnedComment: "Earning more without fixing habits just means losing more, faster. Track everything for 7 days -- you'll find at least 3 things you forgot you were paying for."
  },

  // -- DAY 38 ------------------------------------------------------------------
  {
    id: "day38",
    filename: "day38_final.mp4",
    music: "day38.mp3",
    musicMood: "confident",
    title: "Rich People Don't Save Money -- Here's What They Do Instead",
    pexelsSearchTerms: [
      "drone shot luxury penthouse rooftop city vertical",
      "stock market graph green growing profit vertical",
      "confident businessman city skyscraper vertical",
      "wealth success luxury car city street vertical"
    ],
    overlays: [
      {
        text: "RICH PEOPLE DON'T\nSAVE MONEY. 🔑",
        font: "Anton",
        color: "#4499FF",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 75,
        position: "top-center",
        fontSize: 85
      },
      {
        text: "This doesn't mean\nthey spend everything\nthey make.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 75,
        endFrame: 165,
        position: "middle",
        fontSize: 84
      },
      {
        text: "Most people save\nand wait.\nWealthy people can't\nafford to wait.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "letter-drop",
        startFrame: 165,
        endFrame: 255,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Idle money = losing money.\nEvery day it sits still\nis a day it shrinks.",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 255,
        endFrame: 330,
        position: "middle",
        fontSize: 82
      },
      {
        text: "What you weren't told:\nRich people pay themselves\nFIRST -- then deploy capital.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 330,
        endFrame: 405,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The formula:\nEarn → Invest first\n→ Live on what's left.\nNot the other way.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "panel-split",
        startFrame: 405,
        endFrame: 540,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Every wealthy person\ninvests BEFORE they enjoy.\nNot after.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 540,
        endFrame: 630,
        position: "middle",
        fontSize: 82
      },
      {
        text: "This week:\nDecide one amount\nto auto-invest before\nspending anything.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 735,
        position: "middle",
        fontSize: 82
      },
      {
        text: "You can't save\nyour way to wealth.\nYou deploy your way there.",
        font: "Montserrat",
        color: "#4499FF",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 735,
        endFrame: 810,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Are you saving money\nor deploying it?\nTell me below 👇",
        font: "Anton",
        color: "#4499FF",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 810,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 76
      }
    ],
    tiktokCaption: "Rich people don't just save money -- they deploy it 🔑 Are you saving money or deploying it? Tell me your current approach below 👇 #investing #wealthmindset #richmindset #moneytips #day38",
    youtubeTitle: "Rich People Don't Save Money -- Here's What They Do Instead | Day 38/90 | Daily Wealth Building",
    youtubeDescription: "Day 38 of 90 -- The difference between saving money and deploying capital, and why it changes everything.\n\n→ Why idle money is losing money every day\n→ The 'pay yourself first' method wealthy people use\n→ The invest-before-you-spend framework\n→ How to start deploying even tiny amounts\n→ Why you can't save your way to financial freedom\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #investing #wealthmindset #moneytips #financialfreedom",
    pinnedComment: "The formula is: earn → invest first → live on the rest. Not earn → spend → invest whatever's left. That ordering is everything."
  },

  // -- DAY 39 ------------------------------------------------------------------
  {
    id: "day39",
    filename: "day39_final.mp4",
    music: "day39.mp3",
    musicMood: "dramatic",
    title: "Getting a Raise Won't Make You Rich -- Here's Why",
    pexelsSearchTerms: [
      "luxury car driving city night vertical",
      "expensive shopping bags designer store vertical",
      "person upgrading lifestyle city vertical",
      "aerial drone city lights night vertical"
    ],
    overlays: [
      {
        text: "A RAISE WON'T\nMAKE YOU RICH. ❌",
        font: "Anton",
        color: "#FF44FF",
        stroke: { size: 3, color: "#000000" },
        animation: "pop",
        startFrame: 0,
        endFrame: 75,
        position: "top-center",
        fontSize: 85
      },
      {
        text: "Most people get a raise\nand immediately upgrade\ntheir lifestyle to match.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 75,
        endFrame: 165,
        position: "middle",
        fontSize: 82
      },
      {
        text: "New car. Bigger place.\nBetter phone.\nSame empty bank account.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "letter-drop",
        startFrame: 165,
        endFrame: 255,
        position: "middle",
        fontSize: 82
      },
      {
        text: "It's called lifestyle inflation.\nIt eats every raise\nbefore you feel it.",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 255,
        endFrame: 330,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The lie:\n'I'll invest once I earn enough.'\nThat day never comes.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 330,
        endFrame: 405,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The formula:\nFreeze your lifestyle.\nInvest 100% of\nevery future raise.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "gradient-sweep",
        startFrame: 405,
        endFrame: 540,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Winners lived on\nold income long after\ntheir earnings went up.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 540,
        endFrame: 630,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Next raise you get:\nDon't touch it.\nAuto-invest the full\namount immediately.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 735,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Income up. Lifestyle flat.\nThe gap between them?\nThat's your wealth.",
        font: "Montserrat",
        color: "#FF44FF",
        stroke: { size: 2, color: "#000000" },
        animation: "flip-up",
        startFrame: 735,
        endFrame: 810,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Did your last raise\nchange your finances?\nHonest answers 👇",
        font: "Anton",
        color: "#FF44FF",
        stroke: { size: 3, color: "#000000" },
        animation: "word-bounce",
        startFrame: 810,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 76
      }
    ],
    tiktokCaption: "Getting a raise won't make you rich if lifestyle inflation eats it first ❌ Did your last raise actually improve your financial position? Honest answers only 👇 #lifestyleinflation #wealthbuilding #moneymindset #financialfreedom #day39",
    youtubeTitle: "Getting a Raise Won't Make You Rich -- Here's Why | Day 39/90 | Daily Wealth Building",
    youtubeDescription: "Day 39 of 90 -- Why lifestyle inflation destroys every raise before you feel it, and how to break the cycle.\n\n→ What lifestyle inflation is and how to spot it\n→ Why 'I'll invest when I earn more' never works\n→ The freeze-your-lifestyle strategy\n→ How to invest 100% of every future raise automatically\n→ The gap between income and expenses is your real wealth\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #lifestyleinflation #wealthbuilding #moneymindset #salary",
    pinnedComment: "Wealth = the gap between what you earn and what you spend. Every raise widens that gap -- unless you upgrade your lifestyle to close it again. Choose wisely."
  },

  // -- DAY 40 ------------------------------------------------------------------
  {
    id: "day40",
    filename: "day40_final.mp4",
    music: "day40.mp3",
    musicMood: "focused",
    title: "The Investing Method Most People Completely Overlook",
    pexelsSearchTerms: [
      "person laptop coffee shop working investing vertical",
      "money growing plant compound interest concept vertical",
      "aerial city sunrise golden hour vertical",
      "businessman phone success city background vertical"
    ],
    overlays: [
      {
        text: "THE INVESTING METHOD\nMOST PEOPLE OVERLOOK 👀",
        font: "Anton",
        color: "#FF6600",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 75,
        position: "top-center",
        fontSize: 76
      },
      {
        text: "Everyone chases crypto,\nstocks, side hustles.\nMeanwhile this works quietly.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 75,
        endFrame: 165,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Most people think\ninvesting requires\nlarge upfront capital.\nSo they wait.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 165,
        endFrame: 255,
        position: "middle",
        fontSize: 82
      },
      {
        text: "And by the time\nthey finally start --\nyears are gone.",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 255,
        endFrame: 330,
        position: "middle",
        fontSize: 76
      },
      {
        text: "The truth nobody tells:\nTime IN the market\nbeats TIMING the market.\nAlways.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 330,
        endFrame: 405,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The method: DCA.\nBuy a fixed amount\nevery month.\nRegardless of price.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "neon-glow",
        startFrame: 405,
        endFrame: 540,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Dollar Cost Averaging\nremoves emotion.\nYou win in dips.\nYou win in peaks.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 540,
        endFrame: 630,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Start today:\nPick an index fund.\nSet a monthly amount.\nAutomate it. Done.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 735,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The boring method\nis the one that\nactually builds wealth.",
        font: "Montserrat",
        color: "#FF6600",
        stroke: { size: 2, color: "#000000" },
        animation: "flip-up",
        startFrame: 735,
        endFrame: 810,
        position: "middle",
        fontSize: 84
      },
      {
        text: "Investing consistently\nor waiting for the\n'right time'? 👇",
        font: "Anton",
        color: "#FF6600",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 810,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 76
      }
    ],
    tiktokCaption: "The boring investing method that most people overlook -- and it's the one that actually works 👀 Are you investing consistently or still waiting for the right time? 👇 #indexfunds #dca #investing101 #wealthbuilding #day40",
    youtubeTitle: "The Investing Method Most People Completely Overlook | Day 40/90 | Daily Wealth Building",
    youtubeDescription: "Day 40 of 90 -- Dollar Cost Averaging explained and why it beats every complicated strategy.\n\n→ Why waiting for the 'right time' destroys years of growth\n→ What Dollar Cost Averaging (DCA) actually is\n→ How DCA removes emotion from investing entirely\n→ How to set it up automatically in under 10 minutes\n→ Why boring consistent investing beats exciting risky bets\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #indexfunds #DCA #investing101 #wealthbuilding #compoundinterest",
    pinnedComment: "DCA = buy a fixed amount every single month, no matter what the market is doing. You win when prices drop (you buy more units) and you win when it rises (your units gain value). Simple. Boring. It works."
  },

  // -- DAY 41 ------------------------------------------------------------------
  {
    id: "day41",
    filename: "day41_final.mp4",
    music: "day41.mp3",
    musicMood: "rebellious",
    title: "3 Money Lies Your Parents Taught You",
    pexelsSearchTerms: [
      "student studying finance book desk vertical",
      "person reading book self improvement vertical",
      "library books knowledge education vertical",
      "young person laptop learning online vertical"
    ],
    overlays: [
      {
        text: "3 MONEY LIES YOUR\nPARENTS TAUGHT YOU 🚨",
        font: "Anton",
        color: "#00AAFF",
        stroke: { size: 3, color: "#000000" },
        animation: "pop",
        startFrame: 0,
        endFrame: 75,
        position: "top-center",
        fontSize: 78
      },
      {
        text: "They weren't misleading you.\nThey taught what\nthey were taught.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 75,
        endFrame: 165,
        position: "middle",
        fontSize: 82
      },
      {
        text: "But outdated money advice\nin today's economy\nis keeping you broke.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "letter-drop",
        startFrame: 165,
        endFrame: 255,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Lie #1:\n'Get a stable job\nand save for retirement.'\nPensions barely exist now.",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 255,
        endFrame: 330,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Lie #2: 'Debt is always bad.'\nGood debt builds assets.\nBad debt buys things.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 330,
        endFrame: 405,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Lie #3:\n'One income is enough.'\nThe wealthy average\n7 income streams.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "frosted",
        startFrame: 405,
        endFrame: 540,
        position: "middle",
        fontSize: 82
      },
      {
        text: "New rules:\nBuild assets. Use debt\nstrategically. Diversify\nyour income now.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 540,
        endFrame: 630,
        position: "middle",
        fontSize: 82
      },
      {
        text: "This week:\nIdentify which lie\nyou're still living.\nThen unlearn it.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 735,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The rules changed.\nThe advice didn't.\nThat gap is why\nyou feel stuck.",
        font: "Montserrat",
        color: "#00AAFF",
        stroke: { size: 2, color: "#000000" },
        animation: "slide-left",
        startFrame: 735,
        endFrame: 810,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Which lie were you\ntold growing up?\nComment 1, 2 or 3 👇",
        font: "Anton",
        color: "#00AAFF",
        stroke: { size: 3, color: "#000000" },
        animation: "word-bounce",
        startFrame: 810,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 76
      }
    ],
    tiktokCaption: "3 money lies your parents taught you -- they weren't wrong, the rules just changed 🚨 Which of these were you told growing up? Comment 1, 2 or 3 below 👇 #moneymindset #financialliteracy #parentadvice #wealthbuilding #day41",
    youtubeTitle: "3 Money Lies Your Parents Taught You | Day 41/90 | Daily Wealth Building",
    youtubeDescription: "Day 41 of 90 -- Three pieces of financial advice that made sense decades ago but are hurting you today.\n\n→ Why 'get a stable job and save' is broken advice in 2026\n→ The difference between good debt and bad debt\n→ Why one income stream is now a liability, not a plan\n→ The new rules of wealth building in the modern economy\n→ How to identify which outdated belief is holding you back\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #moneymindset #financialliteracy #multipleincomestreams #wealthbuilding",
    pinnedComment: "They taught us to survive in an economy that no longer exists. The rules changed. Job security is gone, pensions are rare, one income isn't enough. Unlearning is the first step."
  },

  // -- DAY 42 ------------------------------------------------------------------
  {
    id: "day42",
    filename: "day42_final.mp4",
    music: "day42.mp3",
    musicMood: "uplifting",
    title: "How I Started Earning Online From Zero -- The Exact Method",
    pexelsSearchTerms: [
      "person laptop working home success vertical",
      "aerial city rooftop freedom success vertical",
      "digital nomad cafe laptop working vertical",
      "person celebrating success city view vertical"
    ],
    overlays: [
      {
        text: "FROM $0 TO EARNING\nONLINE -- THE METHOD 🔥",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 75,
        position: "top-center",
        fontSize: 78
      },
      {
        text: "Not a course.\nNot a coach.\nA method you can\nstart today for free.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 75,
        endFrame: 165,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Everyone says\n'make money online'\nbut nobody shows\nthe actual steps.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "letter-drop",
        startFrame: 165,
        endFrame: 255,
        position: "middle",
        fontSize: 82
      },
      {
        text: "They sell you the dream.\nNot the step-by-step path.\nThat ends today.",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "glitch",
        startFrame: 255,
        endFrame: 330,
        position: "middle",
        fontSize: 84
      },
      {
        text: "The truth:\nAffiliate marketing lets\nyou earn without\nbuilding a product.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 330,
        endFrame: 405,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The formula:\nNiche → Content\n→ Recommend products\n→ Earn commissions.",
        font: "Montserrat",
        color: "#00FF88",
        stroke: { size: 2, color: "#000000" },
        animation: "panel-split",
        startFrame: 405,
        endFrame: 540,
        position: "middle",
        fontSize: 84
      },
      {
        text: "No upfront cost.\nNo inventory.\nNo customer service.\nJust content and links.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 540,
        endFrame: 630,
        position: "middle",
        fontSize: 82
      },
      {
        text: "Start today:\nFind a free affiliate\nprogram in your niche.\nGet your link.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 630,
        endFrame: 735,
        position: "middle",
        fontSize: 82
      },
      {
        text: "The model works.\nI'm proving it daily\nfor 90 days in public.\nWatch.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "flip-up",
        startFrame: 735,
        endFrame: 810,
        position: "middle",
        fontSize: 82
      },
      {
        text: "What's stopping you\nfrom starting online\nincome today? 👇",
        font: "Anton",
        color: "#FFD700",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 810,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 76
      }
    ],
    tiktokCaption: "From $0 to earning online -- the actual method, not the hype 🔥 What's the ONE thing stopping you from starting right now? Drop your honest answer 👇 #affiliatemarketing #makemoneyonline #passiveincome #sidehustle #day42",
    youtubeTitle: "How I Started Earning Online From Zero -- The Exact Method | Day 42/90 | Daily Wealth Building",
    youtubeDescription: "Day 42 of 90 -- Week 6 finale. The exact affiliate marketing method that costs nothing to start.\n\n→ Why affiliate marketing works without a product or audience\n→ The 4-step formula: niche → content → recommend → earn\n→ How to find legitimate free affiliate programs today\n→ Why this model has zero upfront cost\n→ Week 6 recap and what's coming in Week 7\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #affiliatemarketing #makemoneyonline #passiveincome #sidehustle #day42of90",
    pinnedComment: "Affiliate marketing = recommend products you already believe in, earn a commission when someone buys through your link. No product. No inventory. No customer service. Just content and consistency."
  },

];


⬡ COMPONENTS
