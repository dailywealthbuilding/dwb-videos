// src/week7-content.js -- DWB Week 7 -- Days 43-49
// Theme: THE UNAWARE AUDIENCE -- Level 4 Hooks
// v2 QUALITY UPDATE:
//   - 6 bRollQueries per video (was 4)
//   - Queries aligned with specific overlay content (not generic)
//   - No highlight-box animation
//   - #CAFF00 as primary accent throughout
//   - Anton 86-90px for hooks, Montserrat 70-78px for body
//   - letterSpacing added to hooks for breathing room
//   - Stroke on every overlay for crisp text on any background
//   - Improved day43 hook (more scroll-stopping)
//   - Improved day44 hook (pattern interrupt stronger)
// Export: named (weeks 7+ use named export)

export const week7Videos = [

  // -- DAY 43 ------------------------------------------------------------------
  // Hook type: REVEAL -- "You don't know this is happening to you"
  // Topic: The 40% tax nobody talks about
  {
    id: "day43",
    filename: "day43_final.mp4",
    music: "day43.mp3",
    musicMood: "punchy",
    title: "The Government Takes 40% And Nobody Told You",
    bRollQueries: [
      "person shocked surprised paycheck phone salary vertical",
      "tax form documents office stress government vertical",
      "wealthy person luxury penthouse city window vertical",
      "accountant laptop financial planning strategy vertical",
      "person counting money paycheck income vertical",
      "person celebrating financial freedom outdoors vertical"
    ],
    overlays: [
      {
        text: "THE GOVERNMENT TAKES\n40% OF EVERYTHING\nYOU EARN.",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 90,
        position: "middle",
        fontSize: 86,
        letterSpacing: "0.02em"
      },
      {
        text: "Income tax.\nSales tax.\nCapital gains tax.\n\nThey win every time.\nYou were never taught\nhow to change that.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "stagger",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 72
      },
      {
        text: "The wealthy don't\nearn more.\nThey KEEP more.\n\nLegal tax strategy\nis the skill school\nnever taught.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 74
      },
      {
        text: "3 moves that reduce\nyour tax bill legally:\n\n1. Max your retirement account\n2. Track every expense\n3. Know what's deductible",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 450,
        endFrame: 720,
        position: "middle",
        fontSize: 68
      },
      {
        text: "Comment \"TAX\" 👇\nif nobody taught\nyou this.",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "word-bounce",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 84
      }
    ],
    tiktokCaption: "They never teach this in school but the wealthy know it 💸 Comment \"TAX\" if nobody told you how much you're losing #taxes #wealthbuilding #financialeducation #day43",
    youtubeTitle: "The Government Takes 40% And Nobody Told You | Day 43/90 | Daily Wealth Building",
    youtubeDescription: "Day 43 of 90 -- The silent tax system draining your wealth and 3 legal moves to keep more.\n\n→ Every tax type you're paying right now\n→ Why the wealthy pay a lower effective rate\n→ Maxing retirement accounts as a tax shield\n→ What's actually deductible (most people miss this)\n→ The mindset shift: earn more vs. keep more\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #taxes #wealthbuilding #financialeducation #moneytips",
    pinnedComment: "The wealthy don't just earn more -- they structurally keep more. Tax strategy is the skill school never taught you. Start with your retirement account. Everything after that is a bonus."
  },

  // -- DAY 44 ------------------------------------------------------------------
  // Hook type: PATTERN INTERRUPT -- "The math they don't show you"
  // Topic: Subscription problem -- not your coffee
  {
    id: "day44",
    filename: "day44_final.mp4",
    music: "day44.mp3",
    musicMood: "rebellious",
    title: "Stop Blaming Your Coffee. You Have A Subscription Problem.",
    bRollQueries: [
      "person phone apps subscription services screen vertical",
      "coffee shop morning routine lifestyle casual vertical",
      "credit card statement automatic charges bank vertical",
      "person laptop bank app financial review audit vertical",
      "streaming services tv entertainment cancel vertical",
      "person celebrating saving money breakthrough vertical"
    ],
    overlays: [
      {
        text: "YOUR $5 COFFEE\nISN'T THE PROBLEM.",
        font: "Anton",
        color: "#FF4444",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 90,
        position: "top-center",
        fontSize: 90,
        letterSpacing: "0.02em"
      },
      {
        text: "The average person\npays for 12 subscriptions.\n\nThey actively use 3.\n\nThe other 9 run\nevery month.\nForever.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 76
      },
      {
        text: "Netflix. Spotify. Hulu.\nGym. Adobe. iCloud.\nAmazon Prime.\n\n$200 to $500/month.\nAuto-charged.\nEvery. Single. Month.",
        font: "Montserrat",
        color: "#CAFF00",
        stroke: { size: 2, color: "#000000" },
        animation: "stagger",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 72
      },
      {
        text: "The 10-minute audit:\n\nOpen your bank app.\nFilter last 30 days.\nHighlight every\nauto-charge.\nCancel anything\nyou forgot existed.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 450,
        endFrame: 720,
        position: "middle",
        fontSize: 70
      },
      {
        text: "Drop the amount\nyou just found below 👇\nMost find $100+",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 82
      }
    ],
    tiktokCaption: "I did this audit last week and found $340/month I forgot about 💀 Drop what you find below 👇 #subscriptions #savemoney #budgeting #moneyhacks #day44",
    youtubeTitle: "Stop Blaming Your Coffee. You Have A Subscription Problem. | Day 44/90 | Daily Wealth Building",
    youtubeDescription: "Day 44 of 90 -- The real reason your budget never works and it is not your morning coffee.\n\n→ The average person pays for 12 subscriptions and uses only 3\n→ How auto-charges drain accounts invisibly every month\n→ The 10-minute bank audit that finds hidden money\n→ Which subscriptions to cut first\n→ What to do with the money you recover\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #subscriptions #savemoney #budgeting #moneyhacks",
    pinnedComment: "The coffee is $150/year. The forgotten subscriptions are $2,400/year. Fix the big thing first. The audit takes 10 minutes and most people find over $100/month they forgot they were paying."
  },

  // -- DAY 45 ------------------------------------------------------------------
  // Hook type: IDENTITY -- "People like you do this"
  // Topic: $0 to $1K online -- faceless, no skills
  {
    id: "day45",
    filename: "day45_final.mp4",
    music: "day45.mp3",
    musicMood: "motivational",
    title: "How To Make Your First $1000 Online With Zero Skills",
    bRollQueries: [
      "person laptop coffee shop working online success vertical",
      "phone screen money transfer notification payment vertical",
      "young entrepreneur home office laptop desk vertical",
      "person freelancing writing content creation phone vertical",
      "city rooftop person freedom success lifestyle vertical",
      "online business affiliate marketing results laptop vertical"
    ],
    overlays: [
      {
        text: "HOW TO MAKE\nYOUR FIRST $1,000\nONLINE.",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 90,
        position: "middle",
        fontSize: 88,
        letterSpacing: "0.02em"
      },
      {
        text: "No followers.\nNo experience.\nNo money to start.\n\nHere is the actual\npath they don't\ntell you about.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "flip-up",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 78
      },
      {
        text: "The 3 fastest paths:\n\n1. Resell services\n   (Canva, writing, clips)\n2. Affiliate links\n   (no product needed)\n3. Faceless content\n   (niche page + links)",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "stagger",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 68
      },
      {
        text: "The system:\n\nPick ONE path.\nLearn it for 30 days.\nGet your first result.\nRepeat and scale.\n\n$0 to $1K.\nSame system, bigger numbers.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 450,
        endFrame: 720,
        position: "middle",
        fontSize: 68
      },
      {
        text: "Comment \"START\" 👇\nfor the free resource list.\nDay 45 of 90",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "word-bounce",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 82
      }
    ],
    tiktokCaption: "The people making $5K/month online all started with $0 and no skills 🔥 Comment \"START\" for the free resource list #makemoneyonline #sidehustle #financialfreedom #day45",
    youtubeTitle: "How To Make Your First $1000 Online With Zero Skills | Day 45/90 | Daily Wealth Building",
    youtubeDescription: "Day 45 of 90 -- The exact $0-to-$1K online playbook. No audience. No experience. No startup capital.\n\n→ The 3 fastest paths to $1K online\n→ Why most people quit before they start (and how to not)\n→ The 30-day learning sprint that changes everything\n→ Reselling vs. affiliate vs. content -- which is fastest\n→ How $1K becomes $5K with the same system\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #makemoneyonline #sidehustle #financialfreedom #passiveincome",
    pinnedComment: "Every person making $5K/month online started somewhere. The ones who made it picked ONE thing and did it for 90 days without switching. The ones who failed tried everything and mastered nothing."
  },

  // -- DAY 46 ------------------------------------------------------------------
  // Hook type: CONTRAST -- "The gap between them and you"
  // Topic: Broke people look rich, rich people look broke
  {
    id: "day46",
    filename: "day46_final.mp4",
    music: "day46.mp3",
    musicMood: "dramatic",
    title: "Why Broke People Look Rich And Rich People Look Broke",
    bRollQueries: [
      "luxury sports car expensive city street show vertical",
      "simple modest interior clean minimalist home vertical",
      "person grocery store budget everyday shopping vertical",
      "investment portfolio stock market phone screen vertical",
      "wealthy minimalist lifestyle subtle understated vertical",
      "person confident city walk success mindset vertical"
    ],
    overlays: [
      {
        text: "BROKE PEOPLE\nLOOK RICH.\nRICH PEOPLE\nLOOK BROKE.",
        font: "Anton",
        color: "#FF4444",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 90,
        position: "middle",
        fontSize: 86,
        letterSpacing: "0.02em"
      },
      {
        text: "The person in the\nleased BMW with\n$200 in their account.\n\nvs.\n\nThe millionaire in\na 10-year-old Honda.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "split-reveal",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 74
      },
      {
        text: "Wealth is what\nyou DON'T see.\n\nIt's the investments.\nThe accounts.\nThe assets.\nNot the watch.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 76
      },
      {
        text: "The wealth equation:\n\nSTOP spending to\nlook wealthy.\nSTART buying things\nthat make you wealthy.\n\nAssets over aesthetics.",
        font: "Montserrat",
        color: "#CAFF00",
        stroke: { size: 2, color: "#000000" },
        animation: "stagger",
        startFrame: 450,
        endFrame: 720,
        position: "middle",
        fontSize: 70
      },
      {
        text: "Image or assets?\nBe honest below 👇",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 86
      }
    ],
    tiktokCaption: "The most dangerous financial trap is looking rich while being broke 💀 Be honest -- image or assets? 👇 #wealthmindset #moneymindset #financialfreedom #richvswealth #day46",
    youtubeTitle: "Why Broke People Look Rich And Rich People Look Broke | Day 46/90 | Daily Wealth Building",
    youtubeDescription: "Day 46 of 90 -- The paradox of visible wealth vs. real wealth and how to stop playing the wrong game.\n\n→ Why the consumption flex keeps you broke\n→ What wealthy people actually buy vs. display\n→ The true definition of wealth (it is not income)\n→ Assets vs. aesthetics -- the only equation that matters\n→ How to reprogram the look-successful impulse\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #wealthmindset #moneymindset #financialfreedom #richvswealth",
    pinnedComment: "Real wealth is the ability to not work for 6 months and your life does not change. The car, the watch, the vacations -- that is lifestyle, not wealth. Stop buying the costume."
  },

  // -- DAY 47 ------------------------------------------------------------------
  // Hook type: FEAR + DATA -- "The number that wakes you up"
  // Topic: Compound interest -- the only math that matters
  {
    id: "day47",
    filename: "day47_final.mp4",
    music: "day47.mp3",
    musicMood: "dramatic",
    title: "The One Number That Explains Every Rich Person You Know",
    bRollQueries: [
      "clock time investment concept money growing vertical",
      "graph chart compound interest exponential growth vertical",
      "young person 20s phone investing stock market vertical",
      "retirement couple savings financial planning vertical",
      "money growing plant long term investment concept vertical",
      "person celebrating financial milestone achievement vertical"
    ],
    overlays: [
      {
        text: "$100/MONTH\nAT AGE 25\n=\n$350,000\nAT 65.",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 90,
        position: "middle",
        fontSize: 88,
        letterSpacing: "0.02em"
      },
      {
        text: "That is not a typo.\n\nCompound interest\nturns $48,000\ninto $350,000.\n\nTime is the variable\nschool never taught.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 76
      },
      {
        text: "Start at 25: $350K\nStart at 35: $162K\nStart at 45: $75K\n\nEvery decade you wait\ncosts you $100,000+.\nThe math never lies.",
        font: "Montserrat",
        color: "#FF4444",
        stroke: { size: 2, color: "#000000" },
        animation: "stagger",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 74
      },
      {
        text: "The $100/month plan:\n\n1. Open a Roth IRA\n   (15 minutes total)\n2. Auto-invest monthly\n   (set and forget)\n3. Never touch it\n   (this is the hard part)",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 450,
        endFrame: 720,
        position: "middle",
        fontSize: 70
      },
      {
        text: "How old are you?\nDrop it below 👇\nI will show you your number.",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 80
      }
    ],
    tiktokCaption: "$100/month at 25 = $350,000 at 65. Drop your age below and I will tell you your number 👇 #compoundinterest #investing #retirementplanning #wealthbuilding #day47",
    youtubeTitle: "The One Number That Explains Every Rich Person You Know | Day 47/90 | Daily Wealth Building",
    youtubeDescription: "Day 47 of 90 -- Compound interest explained with the numbers that actually wake people up.\n\n→ How $100/month becomes $350,000 (the actual math)\n→ The real cost of waiting 10 years to start\n→ Why wealthy people got wealthy early (it is not income)\n→ Opening a Roth IRA in 15 minutes\n→ The set-and-forget investment system\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #compoundinterest #investing #retirementplanning #wealthbuilding",
    pinnedComment: "The math is simple. The discipline is hard. $100/month sounds like nothing. Over 40 years at 8% average returns, it becomes $350,000. The rich did not find a secret. They just started early and did not stop."
  },

  // -- DAY 48 ------------------------------------------------------------------
  // Hook type: CONFESSION -- "I used to do this"
  // Topic: 5 money habits keeping you broke
  {
    id: "day48",
    filename: "day48_final.mp4",
    music: "day48.mp3",
    musicMood: "punchy",
    title: "5 Money Habits That Guarantee You Stay Broke",
    bRollQueries: [
      "person stressed apartment bills worried phone vertical",
      "impulse shopping retail bags spending consumer vertical",
      "late night phone scrolling dark bedroom stressed vertical",
      "empty bank account balance worried young person vertical",
      "habit change discipline journal planning writing vertical",
      "person success city financial freedom breakthrough vertical"
    ],
    overlays: [
      {
        text: "5 HABITS THAT\nGUARANTEE\nYOU STAY BROKE.",
        font: "Anton",
        color: "#FF4444",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 90,
        position: "middle",
        fontSize: 88,
        letterSpacing: "0.02em"
      },
      {
        text: "1. Paying yourself last\n2. No emergency fund\n3. Consumer debt only\n4. Zero financial goals\n5. Lifestyle inflation\n   every time income rises",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "stagger",
        startFrame: 90,
        endFrame: 360,
        position: "middle",
        fontSize: 72
      },
      {
        text: "The brutal truth:\n\nMost people KNOW\nthese are problems.\n\nThey just have not\ndecided to fix them yet.",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "blur-in",
        startFrame: 360,
        endFrame: 540,
        position: "middle",
        fontSize: 76
      },
      {
        text: "The flip:\n\n1. Pay yourself FIRST\n2. 3-month fund minimum\n3. Only debt = assets\n4. Written 5-year goal\n5. Invest every raise",
        font: "Montserrat",
        color: "#CAFF00",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 540,
        endFrame: 720,
        position: "middle",
        fontSize: 72
      },
      {
        text: "How many of the 5\nare you doing?\nBe honest 👇",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 86
      }
    ],
    tiktokCaption: "I did 4 of these 5 for years and wondered why I was always broke 😭 How many are you doing? Be honest 👇 #moneymistakes #badmoneyhabits #financialliteracy #wealthbuilding #day48",
    youtubeTitle: "5 Money Habits That Guarantee You Stay Broke | Day 48/90 | Daily Wealth Building",
    youtubeDescription: "Day 48 of 90 -- The 5 financial habits that keep 90% of people broke, and the exact flip for each one.\n\n→ Why paying yourself last destroys wealth\n→ The emergency fund number you actually need\n→ Which debt builds wealth vs. destroys it\n→ Why lifestyle inflation is the silent wealth killer\n→ How to flip all 5 habits in 90 days\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #moneymistakes #badmoneyhabits #financialliteracy #wealthbuilding",
    pinnedComment: "Most people do these 5 things their entire lives and wonder why nothing changes. The habits are not complicated. The decision to change them is the hard part. Which one are you fixing this month?"
  },

  // -- DAY 49 ------------------------------------------------------------------
  // Hook type: REVELATION -- "Week 7 wrap. The bigger picture."
  // Topic: Nobody gets rich from a salary -- it's the system
  {
    id: "day49",
    filename: "day49_final.mp4",
    music: "day49.mp3",
    musicMood: "uplifting",
    title: "Nobody Gets Rich From A Salary. Here Is What They Actually Do.",
    bRollQueries: [
      "entrepreneur morning routine office success mindset vertical",
      "passive income investment phone notification alert vertical",
      "person outdoors mountain freedom achievement vertical",
      "multiple income streams business laptop work vertical",
      "corporate office salary paycheck employee vertical",
      "wealthy person financial independence morning lifestyle vertical"
    ],
    overlays: [
      {
        text: "NOBODY GETS RICH\nFROM A SALARY.",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "zoom-punch",
        startFrame: 0,
        endFrame: 90,
        position: "middle",
        fontSize: 90,
        letterSpacing: "0.02em"
      },
      {
        text: "A salary gives you\na comfortable life.\n\nWealth comes from\nwhat you DO with\nthat salary.",
        font: "Montserrat",
        color: "#FFFFFF",
        stroke: { size: 2, color: "#000000" },
        animation: "word-bounce",
        startFrame: 90,
        endFrame: 270,
        position: "middle",
        fontSize: 78
      },
      {
        text: "The wealth system:\n\nEarn → Invest first\n→ Live on the rest\n→ Build assets\n→ Let assets earn\n→ Repeat for decades",
        font: "Montserrat",
        color: "#FFD700",
        stroke: { size: 2, color: "#000000" },
        animation: "stagger",
        startFrame: 270,
        endFrame: 450,
        position: "middle",
        fontSize: 74
      },
      {
        text: "3 income streams\nof wealthy people:\n\n1. Active (job/business)\n2. Portfolio (investments)\n3. Passive (assets)\n\nMost people only have 1.",
        font: "Montserrat",
        color: "#CAFF00",
        stroke: { size: 2, color: "#000000" },
        animation: "fade",
        startFrame: 450,
        endFrame: 720,
        position: "middle",
        fontSize: 70
      },
      {
        text: "Week 7 done. 49 days.\nWhich income stream\nare you building? 👇",
        font: "Anton",
        color: "#CAFF00",
        stroke: { size: 3, color: "#000000" },
        animation: "kinetic",
        startFrame: 720,
        endFrame: 900,
        position: "bottom-center",
        fontSize: 80
      }
    ],
    tiktokCaption: "The salary keeps you alive. The system makes you wealthy 🔥 Which income stream are you working on? Drop it below 👇 #wealthbuilding #multipleincome #financialfreedom #day49",
    youtubeTitle: "Nobody Gets Rich From A Salary. Here Is What They Actually Do. | Day 49/90 | Daily Wealth Building",
    youtubeDescription: "Day 49 of 90 -- Week 7 finale. Why the salary is just the starting point and the 3-income-stream system the wealthy actually use.\n\n→ Why income does not equal wealth\n→ The invest-first system that changes everything\n→ Active vs. portfolio vs. passive income\n→ How to build income stream 2 starting this month\n→ The compounding effect of multiple income sources\n\n🔔 Subscribe for daily wealth building content\n@DailyWealthBuilding\n\n#DailyWealthBuilding #wealthbuilding #multipleincome #financialfreedom #passiveincome",
    pinnedComment: "Your salary is your starting capital. What you do with it determines everything. Most people spend it. Wealthy people invest it first, then live on what is left. The order is the secret."
  },

];
