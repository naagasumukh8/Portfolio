"use client";
import React, { useId } from "react";
import Particles, { ParticlesProvider, useParticlesProvider } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

const init = async (engine: Engine) => {
  await loadSlim(engine);
};

const Inner = (props: ParticlesProps) => {
  const { id, className, background, minSize, maxSize, speed, particleColor, particleDensity } =
    props;
  const { loaded } = useParticlesProvider();
  const generatedId = useId();
  if (!loaded) return null;
  return (
    <Particles
      id={id || generatedId}
      className={cn("h-full w-full", className)}
      options={{
        background: { color: { value: background || "transparent" } },
        fullScreen: { enable: false, zIndex: 1 },
        fpsLimit: 120,
        particles: {
          color: { value: particleColor || "#ffffff" },
          move: {
            enable: true,
            direction: "none",
            speed: { min: 0.1, max: 1 },
            outModes: { default: "out" },
          },
          number: {
            density: { enable: true, width: 400, height: 400 },
            value: particleDensity || 120,
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: { enable: true, speed: speed || 4, sync: false, startValue: "random" },
          },
          shape: { type: "circle" },
          size: { value: { min: minSize || 1, max: maxSize || 3 } },
        },
        detectRetina: true,
      }}
    />
  );
};

export const SparklesCore = (props: ParticlesProps) => {
  return (
    <ParticlesProvider init={init}>
      <Inner {...props} />
    </ParticlesProvider>
  );
};
