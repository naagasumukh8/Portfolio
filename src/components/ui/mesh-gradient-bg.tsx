import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

interface MeshGradientBgProps {
  colors?: string[];
  distortion?: number;
  swirl?: number;
  speed?: number;
  offsetX?: number;
  className?: string;
  veilClassName?: string;
}

/**
 * Full-bleed animated mesh gradient backdrop.
 * Drop inside any `relative` parent with `inset-0` absolutely positioned.
 */
export function MeshGradientBg({
  colors = ["#0a0f1e", "#1a1f3a", "#5CBDB9", "#7C6EFF", "#0F2540", "#FFB347"],
  distortion = 0.9,
  swirl = 0.7,
  speed = 0.35,
  offsetX = 0.1,
  className = "",
  veilClassName = "bg-black/60",
}: MeshGradientBgProps) {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <MeshGradient
        width={dimensions.width}
        height={dimensions.height}
        colors={colors}
        distortion={distortion}
        swirl={swirl}
        grainMixer={0}
        grainOverlay={0}
        speed={speed}
        offsetX={offsetX}
      />
      <div className={`absolute inset-0 ${veilClassName}`} />
    </div>
  );
}
