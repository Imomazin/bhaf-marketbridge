import { AbsoluteFill, Audio, Video, staticFile } from 'remotion';

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <Video src={staticFile('browser_recording.mp4')} />
      <Audio src={staticFile('voiceover.wav')} />
    </AbsoluteFill>
  );
};
