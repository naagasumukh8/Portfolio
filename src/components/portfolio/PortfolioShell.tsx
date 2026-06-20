import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll } from "framer-motion";
import Lenis from "lenis";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { PaperShaderBackdrop } from "@/components/ui/paper-shader-backdrop";
import { HeavyGate } from "@/components/HeavyGate";

// ============ GRAPHICS CONTROLS ============
export const GraphicsContext = createContext<{
  graphicsMode: "standard" | "interactive-3d";
  setGraphicsMode: (mode: "standard" | "interactive-3d") => void;
}>({
  graphicsMode: "standard",
  setGraphicsMode: () => {},
});

export function useGraphics() {
  return useContext(GraphicsContext);
}

export function GraphicsToggle() {
  const { graphicsMode, setGraphicsMode } = useGraphics();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[99] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-body shadow-lg backdrop-blur-md transition-all hover:border-white/20">
      <span className="text-muted-soft">Graphics:</span>
      <button
        onClick={() => setGraphicsMode("standard")}
        className={`rounded-full px-2.5 py-1 transition-all ${
          graphicsMode === "standard"
            ? "bg-white/10 text-white font-bold"
            : "text-muted-soft hover:text-white"
        }`}
      >
        Standard (Smooth)
      </button>
      <button
        onClick={() => setGraphicsMode("interactive-3d")}
        className={`relative rounded-full px-2.5 py-1 transition-all ${
          graphicsMode === "interactive-3d"
            ? "bg-violet/20 text-white font-bold ring-1 ring-violet/40"
            : "text-muted-soft hover:text-white"
        }`}
      >
        Interactive 3D
        {graphicsMode === "interactive-3d" && (
          <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22ff88] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22ff88]" />
          </span>
        )}
      </button>
    </div>
  );
}

// ============ LENIS SMOOTH SCROLL ============
export function useLenis() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
      infinite: false,
    });

    (window as Record<string, unknown>).lenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: -80, immediate: true });
        }
      }, 150);
    }

    const handleAnchorClick = (e: Event) => {
      const anchor = (e.target as HTMLElement)?.closest("a[href^='#']");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -80,
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      delete (window as Record<string, unknown>).lenis;
      lenis.destroy();
    };
  }, []);
}

// ============ BACKGROUND COLOR SHIFTER ============
export function useBgShifter() {
  useEffect(() => {
    const map: Record<string, string> = {
      hero: "#000000",
      about: "#050505",
      skills: "#000000",
      work: "#080808",
      journey: "#000000",
      recognition: "#0a0a0a",
      certs: "#000000",
      contact: "#000000",
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && map[e.target.id]) {
            document.body.style.transition = "background-color 1.2s ease";
            document.body.style.backgroundColor = map[e.target.id];
          }
        });
      },
      { threshold: 0.35 },
    );
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

// ============ MAGNETIC CURSOR ============
export function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const clickingRef = useRef(false);
  const [clickingState, setClickingState] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    setEnabled(true);
    document.body.classList.add("custom-cursor-active");
    let rx = 0,
      ry = 0,
      dx = 0,
      dy = 0,
      tx = window.innerWidth / 2,
      ty = window.innerHeight / 2;
    let raf = 0;
    const onMove = (e: globalThis.MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest?.("a, button, [data-hover]"));
    };
    const onDown = () => {
      clickingRef.current = true;
      setClickingState(true);
    };
    const onUp = () => {
      clickingRef.current = false;
      setTimeout(() => setClickingState(false), 120);
    };
    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      dx += (tx - dx) * 0.55;
      dy += (ty - dy) * 0.55;
      const s = clickingRef.current ? 0.6 : 1;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0) scale(${s})`;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0) scale(${s})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointermove", onMove as never, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove as never);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        data-magnetic-cursor="ring"
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block rounded-full border transition-[width,height,border-color,background] duration-200 will-change-transform"
        style={{
          width: hovering ? 60 : 40,
          height: hovering ? 60 : 40,
          marginLeft: hovering ? -10 : 0,
          marginTop: hovering ? -10 : 0,
          borderColor: "#5CBDB9",
          background: hovering ? "rgba(92,189,185,0.15)" : "transparent",
          boxShadow: "0 0 30px rgba(92,189,185,0.5)",
          mixBlendMode: "difference",
        }}
      />
      <div
        data-magnetic-cursor="dot"
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block h-1.5 w-1.5 rounded-full bg-white will-change-transform"
      />
      <span className="sr-only">{clickingState ? "" : ""}</span>
    </>
  );
}

// ============ SCROLL PROGRESS BAR ============
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="fixed left-0 right-0 top-0 z-[80] h-[2px] bg-transparent">
      <motion.div
        className="h-full origin-left bg-violet"
        style={{
          boxShadow: "0 0 10px #5CBDB9",
          scaleX: scrollYProgress,
        }}
      />
    </div>
  );
}

// ============ CURSOR TRAIL ============
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    let trail: { x: number; y: number; age: number }[] = [];
    let active = false;
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      trail.forEach((p) => {
        p.age += 0.08;
        if (p.age < 1) {
          alive = true;
          const f = 1 - p.age;
          ctx.fillStyle = `rgba(92,189,185,${f * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1 + f * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      trail = trail.filter((p) => p.age < 1);
      if (alive) {
        raf = requestAnimationFrame(draw);
      } else {
        active = false;
      }
    };
    const onMove = (e: globalThis.MouseEvent) => {
      trail.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.length > 12) trail.shift();
      if (!active) {
        active = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[95] hidden md:block" />
  );
}

// ============ NOISE OVERLAY ============
export function NoiseOverlay() {
  const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ backgroundImage: `url("${svg}")`, opacity: 0.012 }}
      aria-hidden
    />
  );
}

// ============ CSS MESH BG ============
export function CSSMeshBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05080F]">
      <div
        className="absolute -inset-[20%] opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(40% 40% at 20% 30%, #5CBDB955 0%, transparent 60%), radial-gradient(45% 45% at 80% 20%, #7C6EFF55 0%, transparent 60%), radial-gradient(50% 50% at 60% 80%, #FFB34744 0%, transparent 65%), radial-gradient(35% 35% at 10% 85%, #0F254088 0%, transparent 70%)",
          animation: "splashMesh 22s ease-in-out infinite alternate",
        }}
      />
      <div className="absolute inset-0 bg-[#05080F]/82" />
      <style>{`@keyframes splashMesh {
        0%   { transform: translate3d(0,0,0) scale(1); }
        50%  { transform: translate3d(-3%,2%,0) scale(1.05); }
        100% { transform: translate3d(2%,-3%,0) scale(0.98); }
      }`}</style>
    </div>
  );
}

// ============ SECTION DOTS NAV ============
const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "recognition", label: "Recognition" },
  { id: "certs", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export function DotsNav() {
  const [active, setActive] = useState("hero");
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsHome(window.location.pathname === "/");
    if (window.location.pathname !== "/") return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  if (!isHome) return null;

  return (
    <nav className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          data-hover
          className="group flex items-center gap-3"
          aria-label={s.label}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-soft opacity-0 transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
          <span
            className="block h-1.5 rounded-full transition-all"
            style={{
              width: active === s.id ? 24 : 8,
              backgroundColor: active === s.id ? "#5CBDB9" : "#3a3a55",
              boxShadow: active === s.id ? "0 0 12px #5CBDB9" : "none",
            }}
          />
        </a>
      ))}
    </nav>
  );
}

// ============ SHELL ============
export function PortfolioShell({ children }: { children: ReactNode }) {
  const [graphicsMode, setGraphicsModeState] = useState<"standard" | "interactive-3d">("standard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-graphics-mode");
      if (saved === "interactive-3d") {
        setGraphicsModeState("interactive-3d");
      }
    }
  }, []);

  const setGraphicsMode = (mode: "standard" | "interactive-3d") => {
    setGraphicsModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-graphics-mode", mode);
    }
  };

  useLenis();
  useBgShifter();

  return (
    <GraphicsContext.Provider value={{ graphicsMode, setGraphicsMode }}>
      <main className="relative min-h-screen bg-[#07121F] text-body">
        <PaperShaderBackdrop />
        <CSSMeshBg />
        <div className="relative z-10">
          <NoiseOverlay />
          <ScrollProgress />
          <DotsNav />
          {children}
        </div>
        <GraphicsToggle />
      </main>
    </GraphicsContext.Provider>
  );
}
