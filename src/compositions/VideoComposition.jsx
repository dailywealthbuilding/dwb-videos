import { AbsoluteFill, Sequence } from 'remotion';
import { TextOverlay } from '../components/TextOverlay.jsx';
import { BackgroundVideo } from '../components/BackgroundVideo.jsx';

const SCALE = 900 / 420;

const VIDEO_DATA = {
  day22: { overlays: [
    { text: "Most people scroll past\nthe opportunity", font: "Anton", color: "#FFD700", position: "middle", animation: "fade", startFrame: 0, endFrame: 90 },
    { text: "While you could be\nearning from it", font: "Anton", color: "#FFFFFF", position: "middle", animation: "slide-left", startFrame: 90, endFrame: 180 },
    { text: "Daily Wealth Building\nshows you how", font: "Montserrat", color: "#FFD700", position: "middle", animation: "fade", startFrame: 180, endFrame: 280 },
    { text: "Follow for daily\nwealth tips 💰", font: "Anton", color: "#FFFFFF", position: "middle", animation: "bounce", startFrame: 280, endFrame: 420 },
  ]},
  day23: { overlays: [
    { text: "Your phone is a\ngoldmine", font: "Anton", color: "#FFD700", position: "middle", animation: "pop", startFrame: 0, endFrame: 105 },
    { text: "Most people just\ndon't know it yet", font: "Anton", color: "#FFFFFF", position: "middle", animation: "fade", startFrame: 105, endFrame: 210 },
    { text: "Here's how to turn\nscrolling into income", font: "Montserrat", color: "#FFD700", position: "middle", animation: "slide-left", startFrame: 210, endFrame: 315 },
    { text: "Follow @DailyWealthBuilding\nfor the blueprint 🚀", font: "Anton", color: "#FFFFFF", position: "middle", animation: "bounce", startFrame: 315, endFrame: 420 },
  ]},
  day24: { overlays: [
    { text: "You don't need a\nbig audience", font: "Anton", color: "#FFD700", position: "middle", animation: "fade", startFrame: 0, endFrame: 105 },
    { text: "To make real money\nonline", font: "Anton", color: "#FFFFFF", position: "middle", animation: "pop", startFrame: 105, endFrame: 210 },
    { text: "You need the right\nsystem", font: "Montserrat", color: "#FFD700", position: "middle", animation: "slide-left", startFrame: 210, endFrame: 315 },
    { text: "Follow to learn\nthe system 🎯", font: "Anton", color: "#FFFFFF", position: "middle", animation: "bounce", startFrame: 315, endFrame: 420 },
  ]},
  day25: { overlays: [
    { text: "Stop trading time\nfor money", font: "Anton", color: "#FFD700", position: "middle", animation: "fade", startFrame: 0, endFrame: 105 },
    { text: "Build systems that\npay you while you sleep", font: "Anton", color: "#FFFFFF", position: "middle", animation: "slide-left", startFrame: 105, endFrame: 210 },
    { text: "Passive income is\nnot a myth", font: "Montserrat", color: "#FFD700", position: "middle", animation: "pop", startFrame: 210, endFrame: 315 },
    { text: "Follow for the\nroadmap 🗺️", font: "Anton", color: "#FFFFFF", position: "middle", animation: "bounce", startFrame: 315, endFrame: 420 },
  ]},
  day26: { overlays: [
    { text: "Frustrated with\nyour 9 to 5?", font: "Anton", color: "#FFD700", position: "middle", animation: "pop", startFrame: 0, endFrame: 105 },
    { text: "There is a way out\nand it works", font: "Anton", color: "#FFFFFF", position: "middle", animation: "fade", startFrame: 105, endFrame: 210 },
    { text: "Thousands have already\nmade the switch", font: "Montserrat", color: "#FFD700", position: "middle", animation: "slide-left", startFrame: 210, endFrame: 315 },
    { text: "Follow to see\nhow they did it 🔥", font: "Anton", color: "#FFFFFF", position: "middle", animation: "bounce", startFrame: 315, endFrame: 420 },
  ]},
  day27: { overlays: [
    { text: "Time is your\nmost valuable asset", font: "Anton", color: "#FFD700", position: "middle", animation: "fade", startFrame: 0, endFrame: 105 },
    { text: "Are you spending it\nor investing it?", font: "Anton", color: "#FFFFFF", position: "middle", animation: "pop", startFrame: 105, endFrame: 210 },
    { text: "Every hour can\nwork for you", font: "Montserrat", color: "#FFD700", position: "middle", animation: "slide-left", startFrame: 210, endFrame: 315 },
    { text: "Follow for daily\nwealth strategies ⏰", font: "Anton", color: "#FFFFFF", position: "middle", animation: "bounce", startFrame: 315, endFrame: 420 },
  ]},
  day28: { overlays: [
    { text: "One phone\nOne camera", font: "Anton", color: "#FFD700", position: "middle", animation: "pop", startFrame: 0, endFrame: 105 },
    { text: "That's all it took\nto start", font: "Anton", color: "#FFFFFF", position: "middle", animation: "fade", startFrame: 105, endFrame: 210 },
    { text: "Now it's your\nturn", font: "Montserrat", color: "#FFD700", position: "middle", animation: "slide-left", startFrame: 210, endFrame: 315 },
    { text: "Follow @DailyWealthBuilding\nand start today 📱", font: "Anton", color: "#FFFFFF", position: "middle", animation: "bounce", startFrame: 315, endFrame: 420 },
  ]},
};

export const VideoComposition = ({ videoId }) => {
  const data = VIDEO_DATA[videoId] || VIDEO_DATA.day22;

  const scaledOverlays = data.overlays.map((overlay) => ({
    ...overlay,
    startFrame: Math.round(overlay.startFrame * SCALE),
    endFrame: Math.round(overlay.endFrame * SCALE),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <BackgroundVideo videoId={videoId} />

      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />

      {scaledOverlays.map((overlay, index) => (
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
