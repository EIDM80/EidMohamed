import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const EndCard: React.FC<{ rtl?: boolean; tagline: string }> = ({ rtl, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const logoScale = interpolate(entrance, [0, 1], [0.85, 1]);
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Small looping "click" pulse on the CTA to read as a tappable button.
  const clickCycle = frame % 40;
  const clickScale =
    clickCycle < 6
      ? interpolate(clickCycle, [0, 3, 6], [1, 0.92, 1], { extrapolateRight: "clamp" })
      : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0D10",
        alignItems: "center",
        justifyContent: "center",
        direction: rtl ? "rtl" : "ltr",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,216,77,0.16) 0%, rgba(11,13,16,0) 60%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          opacity: fadeIn,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            fontFamily: rtl ? "'Noto Kufi Arabic', 'Arial', sans-serif" : "'Inter', 'Arial', sans-serif",
            fontWeight: 900,
            fontSize: 58,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          ISO Order Portal
        </div>
        <div
          style={{
            fontFamily: rtl ? "'Noto Kufi Arabic', 'Arial', sans-serif" : "'Inter', 'Arial', sans-serif",
            fontWeight: 600,
            fontSize: 34,
            color: "#C9CDD3",
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 12,
            padding: "18px 40px",
            borderRadius: 999,
            background: "#FFD84D",
            color: "#141414",
            fontFamily: rtl ? "'Noto Kufi Arabic', 'Arial', sans-serif" : "'Inter', 'Arial', sans-serif",
            fontWeight: 800,
            fontSize: 30,
            transform: `scale(${clickScale})`,
          }}
        >
          isoorder.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
