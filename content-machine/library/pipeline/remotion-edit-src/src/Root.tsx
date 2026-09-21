import React from "react";
import { Composition } from "remotion";
import { AdScene, ENDCARD_FRAMES } from "./scenes/AdScene";
import { WordTiming } from "./components/Captions";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

type AdSceneProps = {
  videoFile: string;
  words: WordTiming[];
  rtl?: boolean;
  tagline: string;
  clipFrames: number;
};

const defaultProps: AdSceneProps = {
  videoFile: "placeholder.mp4",
  words: [],
  rtl: false,
  tagline: "isoorder.com",
  clipFrames: FPS * 10,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AdSceneDynamic"
        component={AdScene}
        durationInFrames={defaultProps.clipFrames + ENDCARD_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={defaultProps}
        calculateMetadata={async ({ props }) => {
          return {
            durationInFrames: props.clipFrames + ENDCARD_FRAMES,
          };
        }}
      />
    </>
  );
};
