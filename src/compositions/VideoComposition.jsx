import { AbsoluteFill, Sequence } from 'remotion';
import { BackgroundVideo } from '../components/BackgroundVideo.jsx';
import { TextOverlay } from '../components/TextOverlay.jsx';

const VIDEO_DATA = {
  day29: { overlays: [
    { text: "I stopped posting\nfor 7 days 😬",                         font: "Anton",      color: "#FF0000", position: "top",    animation: "pop",        startFrame: 0,   endFrame: 90  },
    { text: "No excuses.\nLife got messy.",                              font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",       startFrame: 90,  endFrame: 240 },
    { text: "What it cost me:\nViews dropped 60%",                      font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left", startFrame: 240, endFrame: 390 },
    { text: "Algorithm forgot me\nin less than 72hrs",                   font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left", startFrame: 390, endFrame: 540 },
    { text: "But I'm back.\nDay 29. No reset.",                         font: "Montserrat", color: "#00FF00", position: "middle", animation: "fade",       startFrame: 540, endFrame: 690 },
    { text: "Lesson: Consistency\nisn't optional. It's the product.",   font: "Montserrat", color: "#FFD700", position: "middle", animation: "slide-left", startFrame: 690, endFrame: 810 },
    { text: "Drop 💪 if you've\nalso had a rough week",                 font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",     startFrame: 810, endFrame: 900 },
  ]},

  day30: { overlays: [
    { text: "30 days of posting.\nHere are my REAL numbers 📊",         font: "Anton",      color: "#FFD700", position: "top",    animation: "pop",        startFrame: 0,   endFrame: 90  },
    { text: "TikTok: 15 followers\n322 top video views",                font: "Montserrat", color: "#00FFFF", position: "middle", animation: "slide-left", startFrame: 90,  endFrame: 240 },
    { text: "YouTube: 3 subs\n777 top Short views",                     font: "Montserrat", color: "#FF0000", position: "middle", animation: "slide-left", startFrame: 240, endFrame: 390 },
    { text: "Income so far: $0\nAnd I'm okay with that 💯",             font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",       startFrame: 390, endFrame: 540 },
    { text: "What I learned:\nReps > results at Day 30",                font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-left", startFrame: 540, endFrame: 690 },
    { text: "By Day 90:\n60 days of extra reps 💪",                     font: "Montserrat", color: "#FFD700", position: "middle", animation: "fade",       startFrame: 690, endFrame: 810 },
    { text: "What day are YOU on?\nDrop it below 👇",                   font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",     startFrame: 810, endFrame: 900 },
  ]},

  day31: { overlays: [
    { text: "3 affiliate myths\nthat kept me broke 🚫",                 font: "Anton",      color: "#FF0000", position: "top",    animation: "pop",        startFrame: 0,   endFrame: 90  },
    { text: "Myth 1: You need\na big following first",                  font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left", startFrame: 90,  endFrame: 270 },
    { text: "Truth: 100 engaged beats\n100K scrollers every time",      font: "Montserrat", color: "#00FF00", position: "middle", animation: "fade",       startFrame: 270, endFrame: 390 },
    { text: "Myth 2: Pick the\nhighest paying product",                 font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left", startFrame: 390, endFrame: 570 },
    { text: "Truth: Pick the product\nyou'd actually buy 🎯",           font: "Montserrat", color: "#00FF00", position: "middle", animation: "fade",       startFrame: 570, endFrame: 690 },
    { text: "Myth 3: Quality matters\nmore than consistency",           font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left", startFrame: 690, endFrame: 810 },
    { text: "Truth: A good video posted\nbeats a perfect one saved",    font: "Montserrat", color: "#00FF00", position: "middle", animation: "fade",       startFrame: 810, endFrame: 870 },
    { text: "Which myth fooled YOU?\n1, 2, or 3? 👇",                  font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",     startFrame: 870, endFrame: 900 },
  ]},

  day32: { overlays: [
    { text: "This free tool tells you\nexactly what to post 🔥",        font: "Anton",      color: "#0066FF", position: "top",    animation: "pop",        startFrame: 0,   endFrame: 90  },
    { text: "Most creators are guessing.\nYou don't have to.",          font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",       startFrame: 90,  endFrame: 240 },
    { text: "The tool: TikTok\nCreative Center",                        font: "Montserrat", color: "#FFD700", position: "middle", animation: "slide-left", startFrame: 240, endFrame: 420 },
    { text: "Step 1: Search your niche\nunder 'Trending Hashtags'",     font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-left", startFrame: 420, endFrame: 570 },
    { text: "Step 2: See what's\nperforming last 7 days",               font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-left", startFrame: 570, endFrame: 690 },
    { text: "Step 3: Model the FORMAT.\nNot the content.",              font: "Montserrat", color: "#FF6600", position: "middle", animation: "fade",       startFrame: 690, endFrame: 810 },
    { text: "Reply 'TOOL' and I'll\nsend you the direct link 📩",       font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",     startFrame: 810, endFrame: 900 },
  ]},

  day33: { overlays: [
    { text: "One video. 90 minutes.\nHere's every step ⏱️",            font: "Anton",      color: "#0066FF", position: "top",    animation: "pop",        startFrame: 0,   endFrame: 90  },
    { text: "0:00 — Topic + hook\nwritten in 5 mins",                   font: "Montserrat", color: "#FFFF00", position: "middle", animation: "slide-left", startFrame: 90,  endFrame: 240 },
    { text: "0:05 — 4 clips downloaded\nfrom Pexels (free)",            font: "Montserrat", color: "#FFFF00", position: "middle", animation: "slide-left", startFrame: 240, endFrame: 390 },
    { text: "0:25 — Full CapCut edit:\ntext, audio, transitions",       font: "Montserrat", color: "#FFFF00", position: "middle", animation: "slide-left", startFrame: 390, endFrame: 540 },
    { text: "1:15 — Watch it 3 times.\nNo exceptions. 👀",              font: "Montserrat", color: "#FF6600", position: "middle", animation: "fade",       startFrame: 540, endFrame: 690 },
    { text: "1:25 — Export + upload\nready for 9 PM ✅",                font: "Montserrat", color: "#00FF00", position: "middle", animation: "fade",       startFrame: 690, endFrame: 810 },
    { text: "How long does YOUR\nvideo take? Drop it 👇",               font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",     startFrame: 810, endFrame: 900 },
  ]},

  day34: { overlays: [
    { text: "Hot take:\nClickBank is NOT for beginners 🔥",             font: "Anton",      color: "#FF0000", position: "top",    animation: "pop",        startFrame: 0,   endFrame: 120 },
    { text: "Everyone starts there.\nMost quit there.",                 font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",       startFrame: 120, endFrame: 270 },
    { text: "Problem: High refund rates\n= earned commissions disappear", font: "Montserrat", color: "#FF6600", position: "middle", animation: "slide-left", startFrame: 270, endFrame: 450 },
    { text: "Better for beginners:\nAmazon Associates or Digistore24", font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-left", startFrame: 450, endFrame: 600 },
    { text: "Once you understand\nthe game? THEN hit ClickBank.",       font: "Montserrat", color: "#FFD700", position: "middle", animation: "fade",       startFrame: 600, endFrame: 750 },
    { text: "Agree or disagree?\nBe brutally honest 👇",               font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",     startFrame: 750, endFrame: 900 },
  ]},

  day35: { overlays: [
    { text: "Week 5 done.\nHere's what ACTUALLY worked 📋",            font: "Anton",      color: "#FFD700", position: "top",    animation: "pop",        startFrame: 0,   endFrame: 90  },
    { text: "Best move: Acknowledging\nthe 7-day gap honestly",        font: "Montserrat", color: "#00FF00", position: "middle", animation: "slide-left", startFrame: 90,  endFrame: 240 },
    { text: "Biggest lesson: The algorithm\nhas no loyalty. Consistency is rent.", font: "Montserrat", color: "#FF6600", position: "middle", animation: "fade", startFrame: 240, endFrame: 390 },
    { text: "What surprised me:\nHonest content gets more saves",      font: "Montserrat", color: "#00FFFF", position: "middle", animation: "slide-left", startFrame: 390, endFrame: 540 },
    { text: "Week 6 focus:\nPush for first affiliate link click",      font: "Montserrat", color: "#FFD700", position: "middle", animation: "fade",       startFrame: 540, endFrame: 690 },
    { text: "55 more days.\nStill building. Still here. 💪",           font: "Montserrat", color: "#FFFFFF", position: "middle", animation: "fade",       startFrame: 690, endFrame: 810 },
    { text: "Drop 🔥 if you're\nstill on your journey",                font: "Anton",      color: "#9933FF", position: "bottom", animation: "bounce",     startFrame: 810, endFrame: 900 },
  ]},
};

export const VideoComposition = ({ videoId }) => {
  const data = VIDEO_DATA[videoId] || VIDEO_DATA.day29;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <BackgroundVideo videoId={videoId} />
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />

      {data.overlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={overlay.startFrame}
          durationInFrames={overlay.endFrame - overlay.startFrame}
        >
          <TextOverlay overlay={overlay} />
        </Sequence>
      ))}

      <AbsoluteFill style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '0 40px 40px 0',
      }}>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '28px',
          color: 'rgba(255,255,255,0.85)',
          fontWeight: 'bold',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          @DailyWealthBuilding
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
