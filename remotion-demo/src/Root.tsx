import { Composition } from 'remotion';
import { DemoVideo } from './DemoVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={30 * 77} // 77 seconds (76.5s audio length)
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
