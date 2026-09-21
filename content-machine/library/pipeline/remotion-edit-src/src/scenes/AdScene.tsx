import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Grade, Grain, Vignette } from "../components/Layers";
import { Captions, buildCaptionPages, WordTiming } from "../components/Captions";
import { EndCard } from "../components/EndCard";

export const ENDCARD_FRAMES = 60;

// Background music mix: kept low under narration, short fade in/out so it
// never pops. Loops automatically if a clip + end card runs longer than the
// 30s source track (rare, but cheap insurance).
const MUSIC_VOLUME = 0.13;
const MUSIC_FADE_FRAMES = 20;

const musicVolume = (frame: number, totalFrames: number) => {
  const fadeIn = Math.min(1, frame / MUSIC_FADE_FRAMES);
  const framesFromEnd = totalFrames - frame;
  const fadeOut = Math.min(1, framesFromEnd / MUSIC_FADE_FRAMES);
  return MUSIC_VOLUME * Math.max(0, Math.min(fadeIn, fadeOut));
};

export const AdScene: React.FC<{
  videoFile: string;
  words: WordTiming[];
  rtl?: boolean;
  tagline: string;
  clipFrames: number;
}> = ({ videoFile, words, rtl, tagline, clipFrames }) => {
  const pages = buildCaptionPages(words, 24, 3);
  const totalFrames = clipFrames + ENDCARD_FRAMES;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio
        src={staticFile("music/bg-music.mp3")}
        loop
        volume={(frame) => musicVolume(frame, totalFrames)}
      />
      <Sequence from={0} durationInFrames={clipFrames}>
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(`videos/${videoFile}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Grade opacity={0.14} />
          <Captions pages={pages} rtl={rtl} />
          <Vignette />
          <Grain />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={clipFrames} durationInFrames={ENDCARD_FRAMES}>
        <EndCard rtl={rtl} tagline={tagline} />
      </Sequence>
    </AbsoluteFill>
  );
};
