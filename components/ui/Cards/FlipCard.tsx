// components/ui/Cards/FlipCard.tsx
"use client";

import React from "react";
import type { TechIcon } from "@/data/index";

export type FlipCardProps = {
  icon: TechIcon;
  gradient: string;
  glowColor: string;
  /** Which axis this card is currently flipping on */
  flipAxis: "X" | "Y";
  /** Direction of rotation: 1 = positive angle, -1 = negative angle */
  flipDirection: 1 | -1;
  /** True while the flip animation is in progress */
  isFlipping: boolean;
  /** CSS transform string — set by TechCardGrid, applied directly */
  transform: string;
  /** When false, CSS transition is disabled (during instant Phase 2 reset) */
  transitionEnabled: boolean;
};

export function FlipCard({
  icon,
  gradient: _gradient, // kept in props API; visual handled via glowColor edge-glow
  glowColor,
  isFlipping,
  flipAxis,
  flipDirection,
  transform,
  transitionEnabled,
}: FlipCardProps) {
  // Extract #RRGGBB from glowColor string like "#7C3AED30"
  const baseColor = glowColor.slice(0, 7);
  const renderIcon = () => {
    if (icon.svgPath) {
      return (
        <img
          src={icon.svgPath}
          width={48}
          height={48}
          alt={icon.name}
          style={{
            filter: "brightness(0) invert(1)",
            objectFit: "contain",
            width: 48,
            height: 48,
          }}
        />
      );
    }
    if (icon.reactIcon) {
      const Icon = icon.reactIcon;
      return <Icon size={48} color="white" />;
    }
    if (icon.initials) {
      const fontSize = icon.initials.length <= 2 ? "1.5rem" : "1.1rem";
      return (
        <span
          style={{
            fontWeight: 900,
            color: "white",
            fontSize,
            letterSpacing: "-0.02em",
          }}
        >
          {icon.initials}
        </span>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        perspective: "800px",
        aspectRatio: "1 / 1",
        pointerEvents: isFlipping ? "none" : "auto",
      }}
      data-flip-axis={flipAxis}
      data-flip-direction={flipDirection}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: transitionEnabled ? "transform 300ms ease-in-out" : "none",
          transform,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            // Near-black base. Color lives only at the card edges.
            // inset box-shadow with negative spread (-N) contracts the shadow
            // boundary to the edge zone; blur then fades it inward.
            // Because box-shadow respects border-radius the color frame
            // matches the rounded-12px card shape exactly.
            //   Layer 1 — crisp 1.5px border ring at the very edge
            //   Layer 2 — tight vivid glow ~0–18px from edge (spread -3px)
            //   Layer 3 — softer secondary halo ~0–30px from edge (spread -5px)
            // Center stays #030303 — no light reaches past ~30px inward.
            background: "#030303",
            boxShadow: [
              `inset 0 0 0 1.5px ${baseColor}cc`,
              `inset 0 0 18px -3px  ${baseColor}dd`,
              `inset 0 0 32px -5px  ${baseColor}88`,
            ].join(", "),
          }}
        >
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
