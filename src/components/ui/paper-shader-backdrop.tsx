import { useEffect, useState } from "react";

/**
 * Global subtle compositor-based shader backdrop.
 * Replaces heavy WebGL shader loop to keep the GPU 100% free for scrolling kinetics.
 */
export function PaperShaderBackdrop() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 -z-50 bg-[#07121F]" />;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-[#07121F]"
    >
      {/* Compositor-driven smooth CSS animated auroras */}
      <div 
        className="absolute -inset-[30%] opacity-40"
        style={{
          background: `radial-gradient(45% 45% at 20% 30%, rgba(124,110,255,0.30) 0%, transparent 100%),
                       radial-gradient(40% 50% at 85% 20%, rgba(92,189,185,0.22) 0%, transparent 100%),
                       radial-gradient(55% 45% at 50% 90%, rgba(244,196,107,0.18) 0%, transparent 100%),
                       radial-gradient(35% 35% at 40% 40%, rgba(255,140,90,0.12) 0%, transparent 100%)`,
          animation: "auroraBackdropDrift 28s ease-in-out infinite alternate",
        }}
      />
      {/* Soft vignette overlay */}
      <div
        className="absolute inset-0 bg-radial-vignette"
        style={{
          background: "radial-gradient(ellipse at center, rgba(7,18,31,0.2) 0%, rgba(7,18,31,0.85) 100%)",
        }}
      />
      <style>{`
        @keyframes auroraBackdropDrift {
          0% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
          50% { transform: translate3d(-4%, 3%, 0) scale(1.08) rotate(4deg); }
          100% { transform: translate3d(4%, -3%, 0) scale(1.02) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}
