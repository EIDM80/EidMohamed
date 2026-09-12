import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";

export type WordTiming = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type CaptionPage = {
  words: WordTiming[];
  from: number;
  durationInFrames: number;
};

// Groups words into short caption "pages" (a few words shown together at
// once, TikTok/Reels style) so on-screen text stays readable at speaking
// pace. A page breaks when either the character budget or the word-count
// budget is hit.
export const buildCaptionPages = (
  words: WordTiming[],
  maxCharsPerPage: number,
  maxWordsPerPage: number
): CaptionPage[] => {
  const pages: CaptionPage[] = [];
  let current: WordTiming[] = [];
  let currentChars = 0;

  const flush = () => {
    if (current.length === 0) return;
    const from = current[0].startFrame;
    const end = current[current.length - 1].endFrame;
    pages.push({ words: current, from, durationInFrames: Math.max(1, end - from) });
    current = [];
    currentChars = 0;
  };

  for (const w of words) {
    const wordLen = w.text.length + 1;
    if (
      current.length > 0 &&
      (current.length >= maxWordsPerPage || currentChars + wordLen > maxCharsPerPage)
    ) {
      flush();
    }
    current.push(w);
    currentChars += wordLen;
  }
  flush();

  return pages;
};

const CaptionPageView: React.FC<{ page: CaptionPage; rtl?: boolean }> = ({ page, rtl }) => {
  // useCurrentFrame() inside a nested <Sequence from={page.from}> already
  // returns the frame relative to that sequence's own start — do not
  // subtract page.from again here.
  const localFrame = useCurrentFrame();
  const absoluteFrame = localFrame + page.from;
  const pop = interpolate(localFrame, [0, 4], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const activeIndex = page.words.findIndex(
    (w) => absoluteFrame >= w.startFrame && absoluteFrame < w.endFrame
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: "16%",
        left: "6%",
        right: "6%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.35em",
        direction: rtl ? "rtl" : "ltr",
        transform: `scale(${pop})`,
        opacity,
      }}
    >
      {page.words.map((w, i) => (
        <span
          key={`${w.text}-${i}`}
          style={{
            fontFamily: rtl
              ? "'Noto Kufi Arabic', 'Arial', sans-serif"
              : "'Inter', 'Arial', sans-serif",
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 1.15,
            color: i === activeIndex ? "#FFD84D" : "#FFFFFF",
            WebkitTextStroke: "3px rgba(0,0,0,0.85)",
            paintOrder: "stroke fill",
            textShadow: "0 6px 18px rgba(0,0,0,0.55)",
            letterSpacing: "-0.01em",
          }}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
};

export const Captions: React.FC<{ pages: CaptionPage[]; rtl?: boolean }> = ({ pages, rtl }) => {
  return (
    <AbsoluteFill>
      {pages.map((page, i) => (
        <Sequence key={i} from={page.from} durationInFrames={page.durationInFrames} layout="none">
          <CaptionPageView page={page} rtl={rtl} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
