import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// Subtle warm/contrast grade overlay — a soft multiply+overlay tint so raw
// source footage reads less flat and more "produced."
export const Grade: React.FC<{ opacity?: number }> = ({ opacity = 0.14 }) => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(20,14,8,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 65%, rgba(10,8,6,0.45) 100%)",
      mixBlendMode: "multiply",
      opacity,
      pointerEvents: "none",
    }}
  />
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
      pointerEvents: "none",
    }}
  />
);

// Cheap animated film-grain: a handful of random low-opacity dots redrawn
// every frame via the frame-seeded `random()` helper, no image asset needed.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = Array.from({ length: 60 }, (_, i) => {
    const seed = `grain-${frame}-${i}`;
    return {
      x: random(seed + "x") * 100,
      y: random(seed + "y") * 100,
      o: random(seed + "o") * 0.06,
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.5 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {dots.map((d, i) => (
          <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={1} fill="#fff" opacity={d.o} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
