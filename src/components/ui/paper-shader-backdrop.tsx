"use client";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy-load shader to avoid SSR/WebGL crashes
const MeshGradient = lazy(() =>
  import("@paper-design/shaders-react").then((m) => ({ default: m.MeshGradient }))
);

/**
 * Global subtle shader backdrop.
 * Sits at the very back of the page (z-0). All section backgrounds
 * (which are opaque or near-opaque) sit on top and dominate.
 * Only shows through on truly "plain" areas.
 */
export function PaperShaderBackdrop() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    // Defer mount so initial paint isn't blocked by WebGL
    const t = setTimeout(() => {
      setMounted(true);
      if (typeof window !== "undefined") {
        setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
      }
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "#07121F" }}
    >
      {mounted && isDesktop && (
        <Suspense fallback={null}>
          <MeshGradient
            style={{ width: "100%", height: "100%" }}
            colors={["#07121F", "#1a0b2e", "#0f1e3d", "#2a1654", "#070a14"]}
            distortion={0.85}
            swirl={0.3}
            speed={0.18}
          />
        </Suspense>
      )}
      {/* Soft vignette so the shader recedes — section content always dominates */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(7,18,31,0.35) 0%, rgba(7,18,31,0.75) 100%)",
        }}
      />
    </div>
  );
}
