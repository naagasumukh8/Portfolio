import { createFileRoute, Link } from "@tanstack/react-router";
import {
  lazy,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Lenis from "lenis";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { ImageTrail } from "@/components/ui/image-trail";
import { SplineScene } from "@/components/ui/splite";
import portrait from "@/assets/portrait-avatar.jpg.asset.json";
import sachhaiVideo from "@/assets/sachhai-demo.mp4.asset.json";
import { Spotlight } from "@/components/ui/spotlight";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { FloatingPaths } from "@/components/ui/background-paths";
import DisplayCards from "@/components/ui/display-cards";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { SparklesCore } from "@/components/ui/sparkles";
import { Card } from "@/components/ui/card";
import { HeavyGate, useIsDesktop, useLowEndDevice } from "@/components/HeavyGate";
import {
  Award,
  BrainCircuit,
  BarChart3,
  Code2,
  Database,
  Brain,
  Sparkles,
  Workflow,
  BarChart,
  Boxes,
  Atom,
  Linkedin,
  Github,
  Trophy,
  Star,
  GitFork,
  Users,
  MessageSquare,
  Eye,
  GitBranch,
  Zap,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { HoverButton } from "@/components/ui/hover-button";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { PaperShaderBackdrop } from "@/components/ui/paper-shader-backdrop";
import { GLSLHills } from "@/components/ui/glsl-hills";
import { LampContainer } from "@/components/ui/lamp";
/* ============ GRAPHICS CONTROLS ============ */
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

/* ============ PREMIUM SECTION BACKDROPS ============
   Each backdrop fades in via IntersectionObserver when its section enters
   the viewport — so backgrounds feel alive instead of static. */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AuroraBackdrop({ hue = "violet" }: { hue?: "violet" | "gold" | "cyan" }) {
  const c =
    hue === "gold"
      ? ["rgba(244,196,107,0.35)", "rgba(255,140,90,0.25)", "rgba(124,110,255,0.18)"]
      : hue === "cyan"
        ? ["rgba(64,200,255,0.35)", "rgba(124,110,255,0.22)", "rgba(92,189,185,0.18)"]
        : ["rgba(124,110,255,0.38)", "rgba(244,196,107,0.18)", "rgba(64,200,255,0.22)"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -inset-[20%] opacity-80 blur-3xl"
        style={{
          background: `radial-gradient(40% 40% at 20% 30%, ${c[0]}, transparent 70%),
                       radial-gradient(35% 45% at 80% 20%, ${c[1]}, transparent 70%),
                       radial-gradient(50% 40% at 50% 90%, ${c[2]}, transparent 70%)`,
          animation: "auroraDrift 18s ease-in-out infinite alternate",
        }}
      />
      <style>{`@keyframes auroraDrift { 0%{transform:translate3d(0,0,0) scale(1);} 50%{transform:translate3d(-3%,2%,0) scale(1.06);} 100%{transform:translate3d(3%,-2%,0) scale(1.02);} }`}</style>
    </div>
  );
}

function SectionBackdrop({
  variant,
}: {
  variant: "paths" | "dots" | "aurora-violet" | "aurora-gold" | "aurora-cyan" | "grid";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1400ms] ${inView ? "opacity-100" : "opacity-0"}`}
    >
      {variant === "paths" && (
        <>
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
          <AuroraBackdrop hue="violet" />
        </>
      )}
      {variant === "dots" && (
        <>
          <AuroraBackdrop hue="cyan" />
          <div
            className="absolute -inset-[26px] opacity-[0.22]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1.4px)",
              backgroundSize: "26px 26px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              animation: "dotsDrift 16s linear infinite",
              willChange: "transform",
            }}
          />
          <style>{`@keyframes dotsDrift { from{transform:translate3d(0,0,0)} to{transform:translate3d(26px,26px,0)} }`}</style>
        </>
      )}
      {variant === "aurora-violet" && <AuroraBackdrop hue="violet" />}
      {variant === "aurora-gold" && <AuroraBackdrop hue="gold" />}
      {variant === "aurora-cyan" && <AuroraBackdrop hue="cyan" />}
      {variant === "grid" && (
        <>
          <AuroraBackdrop hue="gold" />
          <div
            className="absolute -inset-[60px] opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(244,196,107,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(244,196,107,0.35) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
              animation: "gridPan 22s linear infinite",
              willChange: "transform",
            }}
          />
          <style>{`@keyframes gridPan { from{transform:translate3d(0,0,0)} to{transform:translate3d(60px,60px,0)} }`}</style>
        </>
      )}
    </div>
  );
}

/* Heavy WebGL/canvas components. Standard static imports at top of file prevent chunk-load freezes. */

/* ============ LIGHTWEIGHT CSS EFFECTS (replace heavy WebGL backdrops) ============ */
function WavingBalls({ count = 14 }: { count?: number }) {
  // Cheap floating/waving balls — pure CSS keyframes, no canvas, no WebGL.
  const balls = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {balls.map((_, i) => {
        const size = 40 + ((i * 13) % 80);
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const dur = 6 + (i % 5);
        const delay = (i % 7) * -0.8;
        const hue = i % 3 === 0 ? "#5CBDB9" : i % 3 === 1 ? "#7C6EFF" : "#FFB347";
        return (
          <span
            key={i}
            className="absolute rounded-full blur-2xl opacity-60"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              background: `radial-gradient(circle, ${hue}aa 0%, transparent 70%)`,
              animation: `splashFloat ${dur}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      })}
      <style>{`@keyframes splashFloat {
        0% { transform: translate3d(0,0,0) scale(1); }
        50% { transform: translate3d(20px,-30px,0) scale(1.15); }
        100% { transform: translate3d(-15px,25px,0) scale(0.9); }
      }`}</style>
    </div>
  );
}

function OrbitingDots() {
  // CSS orbiting dots — replaces the heavy SpiralAnimation WebGL canvas.
  const rings = [
    { size: 320, count: 6, dur: 18, hue: "#5CBDB9" },
    { size: 480, count: 8, dur: 28, hue: "#7C6EFF" },
    { size: 640, count: 10, dur: 40, hue: "#FFB347" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {rings.map((r, ri) => (
        <div
          key={ri}
          className="absolute rounded-full"
          style={{
            width: r.size,
            height: r.size,
            animation: `splashSpin ${r.dur}s linear infinite`,
          }}
        >
          {Array.from({ length: r.count }).map((_, i) => {
            const angle = (360 / r.count) * i;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2px]"
                style={{
                  background: r.hue,
                  boxShadow: `0 0 18px ${r.hue}`,
                  transform: `rotate(${angle}deg) translateY(-${r.size / 2}px)`,
                }}
              />
            );
          })}
        </div>
      ))}
      <style>{`@keyframes splashSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function CSSMeshBg() {
  // Pure-CSS animated mesh — replaces the WebGL MeshGradientBg as the global backdrop.
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Naaga Sumukh B S — AI/ML Engineer | Bengaluru" },
      {
        name: "description",
        content:
          "Portfolio of Naaga Sumukh B S — AI/ML engineer building intelligent systems. NMIT Bengaluru, 2023–2027.",
      },
      { name: "theme-color", content: "#07121F" },
      { property: "og:title", content: "Naaga Sumukh B S — AI/ML Engineer" },
      {
        property: "og:description",
        content: "Building intelligent systems. AI · ML · Automation · Leadership.",
      },
      { property: "og:image", content: portrait.url },
      { property: "og:url", content: "/" },
      { name: "twitter:image", content: portrait.url },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portfolio,
});

/* ============ MAGNETIC CURSOR ============ */
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

/* LoadCurtain removed — replaced by the lightweight <SplashLoader /> mounted in __root.tsx.
   Running a full-screen WebGLShader for 4–5s during boot collided with Spline's WebGL
   startup and was the main cause of Chrome's "Page Unresponsive" warning. */

/* ============ TYPING TEXT ============ */
function Typing({
  text,
  className = "",
  speed = 18,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      setDone(true);
      return;
    }
    let i = 0;
    let iv: ReturnType<typeof setInterval>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        iv = setInterval(() => {
          i++;
          setShown(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(iv);
            setDone(true);
          }
        }, speed);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (iv) clearInterval(iv);
    };
  }, [text, speed]);
  return (
    <span ref={ref} className={className}>
      {shown}
      <span
        className="ml-0.5 inline-block h-[1em] w-[2px] -mb-1 bg-violet align-middle"
        style={{ opacity: done ? 0 : 1, animation: done ? "none" : "blink 0.8s steps(2) infinite" }}
      />
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </span>
  );
}

/* ============ LENIS SMOOTH SCROLL ============ */
/**
 * Lenis is imported at top-level (not dynamic) so it's bundled with the page
 * and starts on frame 1 — no async waterfall, no jank window.
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip on mobile since touch events have native smooth inertia/momentum scroll
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const lenis = new Lenis({
      // duration-mode scrolling uses a deterministic exponential easing curve, which feels much silkier than lerp
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Expose Lenis globally so other components (like TopNav) can access it for scrolling
    (window as Record<string, unknown>).lenis = lenis;

    // Lean RAF loop — no GSAP dependency, starts immediately on mount
    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Scroll to hash on load smoothly via Lenis
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: -80, immediate: true });
        }
      }, 150);
    }

    // Intercept anchor clicks so Lenis handles the scroll (no native jump)
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

/* ============ NEURAL NETWORK CANVAS ============ */
function NeuralCanvas() {
  const isDesktop = useIsDesktop();
  const isLowEnd = useLowEndDevice();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip canvas entirely on mobile/low-end — prevents GPU crash on old phones
    if (!isDesktop || isLowEnd) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    type P = { x: number; y: number; vx: number; vy: number };
    let particles: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Reduce particle count — max 60 even on desktop to stay under budget
      const count = Math.min(60, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };
    resize();
    const onMove = (e: globalThis.MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let isIntersecting = false;
    let raf = 0;
    const draw = () => {
      if (!isIntersecting) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const dx = mouse.x - p.x,
          dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          p.vx -= (dx / dist) * 0.02;
          p.vy -= (dy / dist) * 0.02;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            const op = (1 - d / 130) * 0.35;
            ctx.strokeStyle = `rgba(124,110,255,${op})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        const dm = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        const close = dm < 180;
        ctx.fillStyle = close ? "#7DD3FC" : "#5CBDB9";
        ctx.beginPath();
        ctx.arc(p.x, p.y, close ? 2.2 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasIntersecting = isIntersecting;
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !wasIntersecting) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        } else if (!isIntersecting) {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [isDesktop, isLowEnd]);

  // Mobile: lightweight CSS gradient substitute (zero GPU cost)
  if (!isDesktop || isLowEnd) {
    return (
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(124,110,255,0.25) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(92,189,185,0.18) 0%, transparent 50%)",
        }}
      />
    );
  }
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

/* ============ REVEAL ON SCROLL ============ */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        /* Spring easing: fast rise, gentle overshoot settle — feels alive not mechanical */
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

/* ============ SPLIT TEXT REVEAL ============ */
function SplitWord({
  word,
  delay = 0,
  glitch = false,
  gradient = false,
}: {
  word: string;
  delay?: number;
  glitch?: boolean;
  gradient?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [vis, setVis] = useState(false);
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  useEffect(() => {
    if (!glitch) return;
    const iv = setInterval(
      () => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 400);
      },
      5000 + Math.random() * 3000,
    );
    return () => clearInterval(iv);
  }, [glitch]);
  return (
    <span
      ref={ref}
      className={`inline-block overflow-hidden align-bottom ${glitching ? "animate-glitch" : ""}`}
    >
      {word.split("").map((c, i) => (
        <span
          key={i}
          className={`inline-block ${gradient ? "gradient-text" : ""}`}
          style={{
            transform: vis ? "translateY(0)" : "translateY(110%)",
            opacity: vis ? 1 : 0,
            transition: `transform 1s cubic-bezier(0.16,1,0.3,1) ${i * 35}ms, opacity 0.8s ease ${i * 35}ms`,
          }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/* ============ COUNTER ============ */
function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 2000,
  decimals,
  compact = false,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  compact?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const dp = decimals ?? (value % 1 !== 0 ? (value.toString().split(".")[1]?.length ?? 2) : 0);
  const format = (x: number) => {
    if (compact) {
      if (x >= 1_000_000) return `${(x / 1_000_000).toFixed(x % 1_000_000 === 0 ? 0 : 1)}M`;
      if (x >= 1_000) return `${(x / 1_000).toFixed(x % 1_000 === 0 ? 0 : 1)}K`;
      return Math.floor(x).toString();
    }
    if (dp > 0) return x.toFixed(dp);
    return x >= 1000 ? Math.floor(x).toLocaleString() : Math.floor(x).toString();
  };
  // Start at 0 so the animation is visible on entry.
  const [text, setText] = useState<string>(format(0));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(format(value));
      return;
    }
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setText(format(value * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    const fallback = setTimeout(run, 2500);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, compact]);
  return (
    <span ref={ref}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/* ============ TILT CARD ============ */
function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const x = px / r.width - 0.5;
    const y = py / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    el.style.setProperty("--mx", `${px}px`);
    el.style.setProperty("--my", `${py}px`);
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform = "perspective(1000px) rotateY(0) rotateX(0) translateY(0)";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}

/* ============ SECTION DOTS NAV ============ */
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
  useEffect(() => {
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

/* ============ TOP BAR ============ */
export function TopBar() {
  const [open, setOpen] = useState(false);
  const navItems: [string, string][] = [
    ["Home", "/"],
    ["About", "/about"],
    ["Work", "/work"],
    ["Journey", "/journey"],
    ["Vibe", "/vibe"],
    ["Contact", "/contact"],
  ];
  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 md:px-10"
        style={{ animation: "slideDown 0.6s 0.6s cubic-bezier(0.16,1,0.3,1) backwards" }}
      >
        <div className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.2em] text-body">
          NAAGA SUMUKH B S<span className="ml-3 text-muted-soft">[ BENGALURU · INDIA ]</span>
        </div>
        <nav className="hidden gap-7 font-mono text-[11px] uppercase tracking-[0.2em] md:flex">
          {navItems.map(([l, to]) => (
            <Link
              key={to}
              to={to}
              data-hover
              className="text-muted-soft transition-colors hover:text-body"
              activeProps={{ className: "text-body" }}
              activeOptions={{ exact: true }}
            >
              {l}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          data-hover
          className="glass-pill !p-0 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className="block h-px w-4 bg-body" />
          <span className="block h-px w-4 bg-body" />
        </button>
        <style>{`@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-[#05101A]/95 backdrop-blur-xl md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ opacity: open ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-body">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-body"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-1 flex-col items-center justify-center gap-8">
          {navItems.map(([l, to], i) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="font-display text-5xl font-bold text-body transition-colors hover:text-violet"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ${0.15 + i * 0.08}s ease, transform 0.5s ${0.15 + i * 0.08}s cubic-bezier(0.16,1,0.3,1)`,
              }}
            >
              {l}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

/* ============ MARQUEE DIVIDER ============ */
export function Marquee({ reverse = false }: { reverse?: boolean }) {
  const text = "NAAGA SUMUKH B S · AI/ML ENGINEER · BENGALURU · 2027 · ";
  return (
    <div
      className="ticker-fade relative overflow-hidden border-y border-white/[0.04] py-4"
      aria-hidden
    >
      <div
        className="flex w-max whitespace-nowrap font-mono text-sm uppercase tracking-[0.3em]"
        style={{
          color: "rgba(230,241,245,0.08)",
          animation: `${reverse ? "marqueeR" : "marqueeL"} 60s linear infinite`,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="px-4">
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marqueeL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

/* ============ SCROLL PROGRESS BAR ============ */
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

/* ============ CURSOR TRAIL ============ */
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

/* ============ NOISE OVERLAY ============ */
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

/* ============ INTRO AVATAR (floating PiP) ============ */

/* ============ HERO ============ */
export function Hero() {
  const { graphicsMode } = useGraphics();
  const splineHostRef = useRef<HTMLDivElement>(null);
  const splineSceneRef = useRef<{
    emitEvent: (eventName: string, targetName?: string) => void;
    getApp: () => unknown;
  } | null>(null);
  const [wave, setWave] = useState(false);
  const forwardRafRef = useRef(0);
  const lastPointerRef = useRef<PointerEvent | globalThis.MouseEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const forwardCursorToSpline = (event: PointerEvent | globalThis.MouseEvent) => {
      lastPointerRef.current = event;
      if (forwardRafRef.current) return;
      forwardRafRef.current = requestAnimationFrame(() => {
        forwardRafRef.current = 0;
        const event = lastPointerRef.current;
        if (!event) return;
        const host = splineHostRef.current;
        if (!host) return;
        const canvas = host.querySelector("canvas");
        if (!canvas) return;

        canvas.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: event.clientX,
            clientY: event.clientY,
            screenX: event.screenX,
            screenY: event.screenY,
            bubbles: true,
            cancelable: false,
            view: window,
          }),
        );
        canvas.dispatchEvent(
          new PointerEvent("pointermove", {
            clientX: event.clientX,
            clientY: event.clientY,
            screenX: event.screenX,
            screenY: event.screenY,
            pointerId: "pointerId" in event ? event.pointerId : 1,
            pointerType: "pointerType" in event ? event.pointerType || "mouse" : "mouse",
            isPrimary: "isPrimary" in event ? event.isPrimary : true,
            bubbles: true,
            cancelable: false,
          }),
        );
      });
    };

    window.addEventListener("mousemove", forwardCursorToSpline, { passive: true });
    window.addEventListener("pointermove", forwardCursorToSpline, { passive: true });
    return () => {
      window.removeEventListener("mousemove", forwardCursorToSpline);
      window.removeEventListener("pointermove", forwardCursorToSpline);
      if (forwardRafRef.current) cancelAnimationFrame(forwardRafRef.current);
    };
  }, []);

  const handleRobotClick = () => {
    setWave(true);
    try {
      splineSceneRef.current?.emitEvent("click");
    } catch {
      /* scene may not have a click event */
    }
    setTimeout(() => setWave(false), 2500);
  };

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Backdrop: grid + neural canvas */}
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute inset-0 opacity-50">
        <NeuralCanvas />
      </div>

      {/* Spline robot — full hero bleed so it tracks the cursor everywhere */}
      <div ref={splineHostRef} data-spline-host className="absolute inset-0 z-0">
        <div className="absolute inset-0 cursor-pointer" onClick={handleRobotClick} />
        {graphicsMode === "interactive-3d" ? (
          <HeavyGate
            desktopOnly
            rootMargin="600px"
            className="absolute inset-0"
            fallback={
              /* Mobile hero fallback: soft radial glow — no WebGL, no crash */
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 70% 50%, rgba(124,110,255,0.22) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(92,189,185,0.15) 0%, transparent 50%)",
                }}
              />
            }
          >
            <SplineScene
              ref={splineSceneRef}
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="absolute inset-0 h-full w-full"
            />
          </HeavyGate>
        ) : (
          /* Mobile hero fallback: soft radial glow — no WebGL, no crash */
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 50%, rgba(124,110,255,0.22) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(92,189,185,0.15) 0%, transparent 50%)",
            }}
          />
        )}
        {/* Speech bubble */}
        <div
          className="pointer-events-none absolute right-[10vw] top-[22vh] z-20 transition-all duration-500"
          style={{
            opacity: wave ? 1 : 0,
            transform: wave ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
          }}
        >
          <div className="relative rounded-2xl border border-white/20 bg-[#0B1A2E]/90 px-5 py-3 text-body shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <span className="text-xl">👋</span>
            <span className="ml-2 font-display text-lg font-bold">Hi there!</span>
            <div className="absolute -bottom-2 left-6 h-4 w-4 -rotate-45 border-b border-r border-white/20 bg-[#0B1A2E]/90" />
          </div>
        </div>
        {/* Legibility veil — left side for hero copy */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05080F] via-[#05080F]/80 to-transparent md:via-[#05080F]/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05080F]" />
      </div>

      <HeavyGate desktopOnly className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      </HeavyGate>

      <div className="pointer-events-none relative z-10 flex w-full md:w-1/2 max-w-[1600px] flex-col items-start px-6 md:px-12 text-left [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div
          className="hero-badge mb-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-body [backdrop-filter:blur(12px)_saturate(140%)]"
          style={{ opacity: 0, animation: "fadeUp 1s 0.2s forwards" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#22ff88] opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22ff88] shadow-[0_0_10px_rgba(34,255,136,0.85)]" />
          </span>
          Available for opportunities
          <span className="text-violet">→</span>
        </div>

        <h1 className="font-display font-bold leading-[0.82] tracking-tight text-body">
          <div
            className="block w-full whitespace-nowrap"
            style={{ fontSize: "clamp(48px, 9.5vw, 150px)" }}
          >
            <SplitWord word="Building" delay={300} glitch />
          </div>
          <div
            className="block w-full whitespace-nowrap"
            style={{ fontSize: "clamp(48px, 9.5vw, 150px)" }}
          >
            <SplitWord word="Intelligent" delay={600} />
          </div>
          <div
            className="block w-full whitespace-nowrap"
            style={{ fontSize: "clamp(48px, 9.5vw, 150px)" }}
          >
            <SplitWord word="Systems." delay={900} gradient />
          </div>
        </h1>

        <div
          className="mt-10 h-16 md:h-20 w-full max-w-2xl"
          style={{ opacity: 0, animation: "fadeUp 1s 1.6s forwards" }}
        >
          <GooeyText
            texts={["Artificial Intelligence", "Machine Learning", "Automation", "Leadership"]}
            className="h-full"
            textClassName="font-mono text-xl md:text-3xl uppercase tracking-[0.3em] text-body !justify-start"
            morphTime={1.2}
            cooldownTime={1.5}
          />
        </div>

        <div
          className="mt-8 hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-violet"
          style={{ opacity: 0, animation: "fadeUp 1s 2s forwards" }}
        >
          <span className="h-px w-10 bg-violet" />
          Scroll to explore the work
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="block h-14 w-px overflow-hidden bg-white/10 relative">
          <span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white to-transparent"
            style={{ animation: "heartbeatLine 1.8s ease-in-out infinite" }}
          />
        </span>
        <span className="font-mono text-[10px] text-muted-soft leading-none">↓</span>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heartbeatLine { 0%{transform:translateY(-100%);opacity:0} 20%{opacity:1} 60%{transform:translateY(180%);opacity:0.2} 100%{transform:translateY(220%);opacity:0} }
        .hero-badge { position: relative; overflow: hidden; }
        .hero-badge::after { content: ""; position: absolute; inset: 0; background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%); transform: translateX(-120%); animation: badgeShimmer 4s ease-in-out infinite; pointer-events: none; }
        @keyframes badgeShimmer { 0%{transform:translateX(-120%)} 60%{transform:translateX(120%)} 100%{transform:translateX(120%)} }
      `}</style>
    </section>
  );
}

/* ============ LIVE 3D (Spline scene) ============ */
export function Live3D() {
  const { graphicsMode, setGraphicsMode } = useGraphics();
  return (
    <section id="live3d" className="relative px-5 py-16 sm:px-6 sm:py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="00" text="Live · Interactive 3D" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-10 font-display text-4xl font-bold leading-tight text-body md:text-6xl">
            Not a screenshot. <span className="gradient-text">Touch it.</span>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <Card className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur shadow-[0_30px_80px_-20px_rgba(124,110,255,0.45)]">
            <HeavyGate
              desktopOnly
              className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
            >
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            </HeavyGate>
            <div className="grid h-[78vh] min-h-[520px] grid-cols-1 md:grid-cols-2">
              {/* Left — copy */}
              <div className="relative z-10 flex flex-col justify-center gap-6 p-8 md:p-12">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet">
                  // WebGL · Real-time
                </div>
                <h3 className="font-display text-4xl font-bold leading-[0.95] text-body md:text-6xl">
                  Engineered <span className="text-violet">in motion.</span>
                </h3>
                <p className="max-w-md text-base leading-relaxed text-muted-soft md:text-lg">
                  A live 3D scene rendered in your browser — the same precision I bring to UI,
                  automations, and ML pipelines: deliberate, performant, and crafted end-to-end.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Three.js", "Spline", "WebGL", "Realtime"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-violet/25 bg-violet/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-body"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-soft">
                  ↳ Rendered live · WebGL · realtime
                </div>
              </div>

              {/* Right — Spline scene */}
              <div className="relative h-full w-full min-h-[300px]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-transparent to-transparent md:from-black/60" />
                {graphicsMode === "interactive-3d" ? (
                  <HeavyGate
                    desktopOnly
                    rootMargin="200px"
                    className="absolute inset-0"
                    fallback={
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(92,189,185,0.15),transparent_70%)]" />
                    }
                  >
                    <SplineScene
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                      className="absolute inset-0 h-full w-full"
                    />
                  </HeavyGate>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(92,189,185,0.12),transparent_75%)] p-6 text-center">
                    <div className="mb-4 h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xl">
                      🎨
                    </div>
                    <p className="max-w-[280px] font-mono text-[10px] uppercase tracking-widest text-muted-soft mb-4">
                      3D WebGL Scene is paused for smooth scrolling performance.
                    </p>
                    <button
                      onClick={() => setGraphicsMode("interactive-3d")}
                      className="rounded-full border border-violet bg-violet/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white transition-all hover:bg-violet/30 active:scale-[0.96]"
                    >
                      Load Live 3D Scene
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ SECTION LABEL ============ */
function SectionLabel({ num, text }: { num: string; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="mb-6 inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-gold relative pb-1.5"
    >
      [ {num} — {text} ]
      <span
        aria-hidden
        className="absolute left-0 bottom-0 h-px bg-violet/70"
        style={{
          width: seen ? "100%" : "0%",
          transition: "width 600ms cubic-bezier(0.22,1,0.36,1) 120ms",
        }}
      />
    </div>
  );
}

/* Premium tile with cursor-following inner glow + animated conic border on hover.
   Pure CSS — GPU-friendly, respects prefers-reduced-motion via the `motion-reduce:*` utilities. */
function GlowTile({
  children,
  className = "",
  padding = "p-5",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative h-full overflow-hidden rounded-2xl transition-transform duration-300 motion-safe:hover:-translate-y-1 ${className}`}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
    >
      {/* Animated conic border (revealed on hover) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from var(--angle,0deg), rgba(167,139,250,0.9), rgba(244,196,107,0.7), rgba(64,200,255,0.6), rgba(167,139,250,0.9))",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
          animation: "tile-spin 6s linear infinite",
        }}
      />
      {/* Inner card */}
      <div
        className={`relative h-full rounded-2xl border border-white/[0.08] bg-surface/70 backdrop-blur-sm ${padding} transition-colors duration-300 group-hover:border-transparent`}
      >
        {/* Cursor-following inner glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx) var(--my), rgba(167,139,250,0.28), transparent 60%)",
          }}
        />
        {/* Subtle inner highlight (always on, very faint) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,0.06), transparent 60%)",
          }}
        />
        {/* Outer glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(124,110,255,0.45), transparent 70%)",
          }}
        />
        <div className="relative">{children}</div>
      </div>
      <style>{`@keyframes tile-spin { to { --angle: 360deg; } } @property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }`}</style>
    </div>
  );
}

/* ============ ABOUT ============ */
export function About() {
  const tiles: Array<{
    label: string;
    value: string;
    sub?: string;
    accent: "violet" | "gold";
    wide?: boolean;
    italic?: boolean;
  }> = [
    {
      label: "Statement",
      value: '"Building real systems, not just demos."',
      accent: "violet",
      wide: true,
      italic: true,
    },
    { label: "LinkedIn Impressions", value: "1M+", sub: "Last 12 months", accent: "gold" },
    { label: "Cleve AI Users", value: "Top 0.095%", sub: "Global rank", accent: "gold" },
    { label: "CGPA · NMIT", value: "7.95", sub: "B.E. Information Science", accent: "gold" },
    { label: "Projects Shipped", value: "3+", sub: "Production systems", accent: "gold" },
    { label: "Based in", value: "Bengaluru", sub: "Open to roles", accent: "violet" },
  ];

  const focus = [
    {
      icon: Brain,
      title: "AI / ML Engineering",
      text: "NLP, classical ML, GenAI pipelines, RAG and agentic workflows.",
    },
    {
      icon: Workflow,
      title: "Automation & Ops",
      text: "End-to-end automations with N8N, Python, and Supabase.",
    },
    {
      icon: BarChart3,
      title: "Data & Insights",
      text: "Pandas, Power BI dashboards, storytelling with business data.",
    },
    {
      icon: Code2,
      title: "Full-Stack Delivery",
      text: "React, TypeScript, Tailwind — shipping recruiter-ready products.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:px-12 md:py-40"
    >
      {/* Premium animated backdrop — single layer, GPU-friendly */}
      <SectionBackdrop variant="paths" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/70" />

      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="01" text="Professional Summary" />
        </Reveal>

        <div className="grid gap-10 md:grid-cols-[420px_1fr] md:items-center md:gap-20">
          {/* PORTRAIT */}
          <Reveal>
            <div
              className="relative mx-auto h-56 w-56 md:h-[26rem] md:w-[26rem]"
              style={{ animation: "avatarFloat 6s ease-in-out infinite" }}
            >
              <div className="absolute -inset-6 rounded-full bg-violet/15 blur-[60px] md:-inset-10 md:blur-[90px]" />
              {/* Outer counter-rotating gold ring */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: "-10px",
                  background:
                    "conic-gradient(from 0deg, rgba(244,196,107,0.0) 0deg, rgba(244,196,107,0.85) 80deg, rgba(255,140,90,0.55) 160deg, rgba(244,196,107,0.0) 260deg, rgba(244,196,107,0.0) 360deg)",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                  animation: "portrait-spin-rev 28s linear infinite",
                  filter: "drop-shadow(0 0 24px rgba(244,196,107,0.35))",
                }}
              />
              <div
                className="absolute -inset-[2px] rounded-full"
                style={{
                  background:
                    "conic-gradient(from 140deg, rgba(167,139,250,0.95) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, rgba(244,196,107,0.85) 100%)",
                  animation: "portrait-spin 22s linear infinite",
                  filter: "drop-shadow(0 0 28px rgba(124,110,255,0.45))",
                }}
              />
              <div className="absolute inset-[3px] rounded-full bg-background" />
              <div className="absolute inset-[10px] rounded-full border border-white/10" />
              <img
                src={portrait.url}
                alt="Naaga Sumukh B S"
                loading="lazy"
                className="absolute inset-[12px] h-[calc(100%-24px)] w-[calc(100%-24px)] rounded-full object-cover"
                style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)" }}
              />
              <style>{`
                @keyframes portrait-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes portrait-spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                @keyframes avatarFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @media (prefers-reduced-motion: reduce) {
                  [style*="avatarFloat"], [style*="portrait-spin"] { animation: none !important; }
                }
              `}</style>
            </div>
          </Reveal>

          {/* COPY */}
          <div>
            <Reveal delay={80}>
              <h2 className="mb-6 font-display text-3xl font-bold leading-[1.05] text-body sm:text-4xl md:text-6xl">
                AI/ML engineer — <span className="text-violet">building real systems</span>, not
                just demos.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-soft sm:mb-10 sm:text-base md:text-lg">
                I thrive on turning complex machine learning research into practical,
                production-ready systems that solve real human needs. As an Information Science
                student at NMIT Bengaluru, I focus on building intelligent agentic workflows,
                natural language interfaces, and end-to-end automations.
                <span className="text-gold">
                  {" "}
                  Driven by impact, backed by 1M+ LinkedIn impressions and a top 0.095% global
                  ranking.
                </span>
              </p>
            </Reveal>

            {/* STAT TILES */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:mb-12 md:grid-cols-3">
              {tiles.map((t, i) => (
                <Reveal key={t.label} delay={220 + i * 70}>
                  <GlowTile className={t.wide ? "md:col-span-2" : ""}>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-soft">
                      {t.label}
                    </div>
                    <div
                      className={`mt-2 font-display font-bold ${t.accent === "gold" ? "text-gold" : "text-body"} ${
                        t.italic ? "text-lg italic leading-snug md:text-xl" : "text-2xl md:text-3xl"
                      }`}
                    >
                      {t.value}
                    </div>
                    {t.sub && <div className="mt-1 text-[11px] text-muted-soft/80">{t.sub}</div>}
                  </GlowTile>
                </Reveal>
              ))}
            </div>

            <Reveal delay={760}>
              <div className="flex flex-wrap gap-4">
                <LiquidButton
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = "/resume.pdf";
                    a.download = "Naaga_Sumukh_BS_Resume.pdf";
                    a.rel = "noopener";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}
                  size="xl"
                  className="font-mono text-xs uppercase tracking-widest text-white"
                >
                  Download Resume <span className="ml-1">↓</span>
                </LiquidButton>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-pill flex items-center justify-center font-mono text-xs uppercase tracking-widest text-white"
                  style={{ padding: "0.85rem 1.75rem", fontSize: "11px" }}
                  data-hover
                >
                  View Resume <span className="ml-1">↗</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* FOCUS AREAS — Scroll Animation (desktop only — scroll-driven 3D transform kills old phones) */}
        <div className="mt-16 sm:mt-24 md:mt-32">
          <HeavyGate
            desktopOnly
            rootMargin="200px"
            className="w-full"
            fallback={
              /* Mobile fallback: plain 2-col grid, same content without scroll-driven perspective */
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="p-6">
                  <h2 className="font-display text-xl font-bold text-body mb-5">Core Expertise</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {focus.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-xl bg-white/[0.06] border border-white/[0.1] p-3"
                      >
                        <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                          <f.icon size={14} className="text-body" />
                        </div>
                        <div className="mb-1 font-display text-sm font-semibold text-white">
                          {f.title}
                        </div>
                        <div className="text-[11px] leading-relaxed text-white/60">{f.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <ContainerScroll
              titleComponent={
                <h2 className="font-display text-2xl font-bold text-body sm:text-3xl md:text-4xl mb-8">
                  Core Expertise
                </h2>
              }
            >
              <div className="h-full w-full rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80"
                  alt="AI and machine learning abstract visualization"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {focus.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-md p-3 md:p-4"
                      >
                        <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet/20 text-violet ring-1 ring-violet/30">
                          <f.icon size={16} />
                        </div>
                        <div className="mb-1 font-display text-sm md:text-base font-semibold text-white">
                          {f.title}
                        </div>
                        <div className="text-xs md:text-sm leading-relaxed text-white/70">
                          {f.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ContainerScroll>
          </HeavyGate>
        </div>
      </div>
    </section>
  );
}

/* ============ SKILLS ============ */
export function Skills() {
  const row1 = [
    "Python",
    "C",
    "SQL",
    "R",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "NLP",
    "TF-IDF",
    "Random Forest",
  ];
  const row2 = [
    "Generative AI",
    "N8N",
    "Power BI",
    "Supabase",
    "React",
    "TypeScript",
    "Tailwind",
    "GitHub",
    "Jupyter",
    "Google Colab",
    "Canva",
    "Antigravity",
  ];
  const skillsTimeline = [
    {
      id: 1,
      title: "Python",
      date: "Core",
      content: "Primary language for data, ML pipelines, and automation.",
      category: "Language",
      icon: Code2,
      relatedIds: [2, 3, 4],
      status: "completed" as const,
      energy: 95,
    },
    {
      id: 2,
      title: "Scikit-learn",
      date: "ML",
      content: "Classical ML — Random Forest, SVMs, regression, clustering.",
      category: "ML",
      icon: Atom,
      relatedIds: [1, 3],
      status: "completed" as const,
      energy: 85,
    },
    {
      id: 3,
      title: "NLP",
      date: "AI",
      content: "TF-IDF, transformers, text classification and embeddings.",
      category: "AI",
      icon: Brain,
      relatedIds: [1, 2, 5],
      status: "completed" as const,
      energy: 80,
    },
    {
      id: 4,
      title: "Pandas",
      date: "Data",
      content: "Dataframes, ETL, feature engineering at scale.",
      category: "Data",
      icon: Database,
      relatedIds: [1, 7],
      status: "completed" as const,
      energy: 90,
    },
    {
      id: 5,
      title: "GenAI",
      date: "AI",
      content: "LLMs, RAG, prompt orchestration, agentic workflows.",
      category: "AI",
      icon: Sparkles,
      relatedIds: [3, 6],
      status: "in-progress" as const,
      energy: 88,
    },
    {
      id: 6,
      title: "N8N",
      date: "Ops",
      content: "Low-code automation for AI pipelines and integrations.",
      category: "Ops",
      icon: Workflow,
      relatedIds: [5, 8],
      status: "in-progress" as const,
      energy: 70,
    },
    {
      id: 7,
      title: "Power BI",
      date: "BI",
      content: "Dashboards and storytelling with business data.",
      category: "BI",
      icon: BarChart,
      relatedIds: [4, 8],
      status: "completed" as const,
      energy: 75,
    },
    {
      id: 8,
      title: "Supabase",
      date: "Stack",
      content: "Postgres, auth, edge functions for full-stack apps.",
      category: "Stack",
      icon: Boxes,
      relatedIds: [6, 7, 9],
      status: "in-progress" as const,
      energy: 78,
    },
    {
      id: 9,
      title: "React",
      date: "Web",
      content: "Component-driven UIs with TypeScript + Tailwind.",
      category: "Web",
      icon: Code2,
      relatedIds: [8],
      status: "completed" as const,
      energy: 82,
    },
  ];

  const Ticker = ({ items, reverse }: { items: string[]; reverse?: boolean }) => (
    <div className="relative overflow-hidden py-3">
      <div className={`flex w-max gap-4 ${reverse ? "animate-ticker-reverse" : "animate-ticker"}`}>
        {[...items, ...items, ...items, ...items].map((s, i) => (
          <span
            key={i}
            className="flex items-center gap-4 whitespace-nowrap font-display text-3xl font-bold text-body md:text-5xl"
          >
            {s} <span className="text-violet">✦</span>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="skills"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      {/* Premium animated backdrop — replaces the dark void */}
      <SectionBackdrop variant="aurora-violet" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(124,110,255,0.18), transparent 70%), radial-gradient(40% 40% at 80% 80%, rgba(244,196,107,0.14), transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />

      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="02" text="Skills" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-12 font-display text-3xl font-bold text-body sm:mb-16 sm:text-4xl md:text-6xl">
            A constellation of <span className="text-violet">capabilities</span>.
          </h2>
        </Reveal>

        <div className="mb-16 -mx-5 sm:mb-20 sm:-mx-6 md:-mx-12">
          <Ticker items={row1} />
          <Ticker items={row2} reverse />
        </div>

        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_120px_-30px_rgba(124,110,255,0.5)]"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 0%, rgba(124,110,255,0.22), rgba(20,16,38,0.85) 55%, rgba(10,8,22,0.92) 100%)",
            }}
          >
            {/* subtle aurora inside the orbital frame */}
            <div
              className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(40% 40% at 25% 30%, rgba(124,110,255,0.28), transparent 70%), radial-gradient(35% 35% at 80% 75%, rgba(244,196,107,0.18), transparent 70%), radial-gradient(45% 45% at 60% 50%, rgba(64,200,255,0.14), transparent 70%)",
              }}
            />
            {/* At a glance chip strip for fast scanners — Desktop only */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-2.5 px-8 pt-8 pb-4 relative z-20">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-soft mr-2">
                [ At a glance ]
              </span>
              {skillsTimeline.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-body transition-colors cursor-help"
                  title={s.content}
                >
                  <s.icon size={11} className="text-violet opacity-80" />
                  <span>{s.title}</span>
                  <span className="text-[9px] text-muted-soft">({s.date})</span>
                </div>
              ))}
            </div>
            {/* Desktop: full orbital — Mobile: lightweight chip grid (no animation crash) */}
            <HeavyGate
              desktopOnly
              rootMargin="200px"
              className="relative h-[460px] w-full sm:h-[600px] md:h-[700px] [&>div]:scale-[0.62] sm:[&>div]:scale-[0.82] md:[&>div]:scale-100 [&>div]:origin-center"
              fallback={
                <div className="relative flex h-auto w-full flex-col items-center justify-center gap-3 py-12 px-6">
                  <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                    Skills · Interactive on desktop
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {skillsTimeline.map((s) => (
                      <span
                        key={s.id}
                        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-body"
                      >
                        <s.icon size={12} className="text-violet opacity-70" />
                        {s.title}
                      </span>
                    ))}
                  </div>
                </div>
              }
            >
              <div>
                <RadialOrbitalTimeline timelineData={skillsTimeline} />
              </div>
            </HeavyGate>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ PROJECTS ============ */
export function Projects() {
  const projects = [
    {
      n: "01",
      name: "SacchAI",
      desc: "Browser extension for real-time detection of unauthorized AI assistance during online interviews — monitors behavioural signals, clipboard activity, tab-switching and speech/response patterns. Custom ensemble classifier generates recruiter-facing reports with genuineness scores, suspicious-activity flags and plagiarism analysis.",
      badge: "88.4% accuracy",
      tags: [
        "JavaScript",
        "TypeScript",
        "React",
        "Chrome APIs",
        "Python",
        "Scikit-learn",
        "Node.js",
        "REST APIs",
      ],
      link: "https://github.com/naagasumukh8",
      cta: "Watch demo",
      media: { kind: "video" as const, src: sachhaiVideo.url },
    },
    {
      n: "02",
      name: "MediConnect",
      desc: "Full-stack HealthcareOS: multi-hospital management, role-based access, appointment scheduling, digital prescriptions, inter-department referrals, pharmacy inventory and AI-assisted patient support. Automated follow-ups, shared medical memory, family accounts and secure file storage via Supabase RLS, validated end-to-end with Playwright + TypeScript.",
      badge: "Live product",
      tags: [
        "React",
        "TypeScript",
        "Tailwind",
        "Supabase RLS",
        "Google Calendar API",
        "Playwright",
      ],
      link: "https://easyhospital.lovable.app",
      cta: "Visit live site",
      media: { kind: "iframe" as const, src: "https://easyhospital.lovable.app" },
    },
    {
      n: "03",
      name: "JobShield — AI-Powered Fake Job Detection",
      desc: "Final-year project. Multi-stage fraud detector: NLP + ML on job posts, recruiter verification via email domains, WHOIS and company sites. Explainable verdicts — Likely Genuine, Suspicious, or High Scam Risk.",
      badge: "Multi-level verification",
      tags: [
        "Python",
        "Scikit-learn",
        "spaCy",
        "BeautifulSoup",
        "WHOIS",
        "Pandas",
        "TF-IDF",
        "Random Forest",
      ],
      link: "https://github.com/naagasumukh8/Job_Verify_FYP",
      cta: "View on GitHub",
      media: { kind: "none" as const, src: "" },
    },
  ];

  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section id="work" className="relative overflow-hidden">
      <SectionBackdrop variant="grid" />
      <div className="px-5 pt-16 sm:px-6 sm:pt-20 md:px-12 md:pt-24">
        <div className="mx-auto max-w-[1300px]">
          <Reveal>
            <SectionLabel num="03" text="Selected Work" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mb-8 font-display text-4xl font-bold text-body md:mb-10 md:text-6xl">
              Each project is <span className="text-violet">its own world</span>.
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="px-5 pb-20 sm:px-6 md:px-12 md:pb-24">
        <div className="mx-auto grid max-w-[1300px] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <article
                data-hover
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0F2540] via-[#0B1A2E] to-[#07121F] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  {p.media.kind === "video" && (
                    <video
                      src={p.media.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {p.media.kind === "iframe" && (
                    <iframe
                      src={p.media.src}
                      title={p.name}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      className="pointer-events-none h-full w-full origin-top-left scale-[0.65] border-0"
                      style={{ width: "153.8%", height: "153.8%" }}
                    />
                  )}
                  {p.media.kind === "none" && (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet/20 to-gold/10">
                      <span className="font-display text-8xl font-bold text-white/10">{p.n}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-gold">
                      Project {p.n} / 0{projects.length}
                    </div>
                    {p.badge && (
                      <span className="rounded-full border border-gold/40 bg-gold/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-gold shadow-[0_0_18px_rgba(244,196,107,0.45)]">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-display text-2xl font-bold leading-tight text-body group-hover:text-violet">
                    {p.name}
                  </h3>
                  <p className="mb-3 line-clamp-3 text-sm text-muted-soft">{p.desc}</p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 8).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-violet/25 bg-violet/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-body"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.cta === "Watch demo" && p.media.kind === "video" ? (
                    <button
                      type="button"
                      onClick={() => setDemoOpen(true)}
                      className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-5 py-2.5 text-sm font-semibold text-body transition-colors hover:bg-violet hover:text-white"
                    >
                      {p.cta} <span aria-hidden>▶</span>
                    </button>
                  ) : (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-5 py-2.5 text-sm font-semibold text-body transition-colors hover:bg-violet hover:text-white"
                    >
                      {p.cta} <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {demoOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setDemoOpen(false)}
          >
            <div
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setDemoOpen(false)}
                aria-label="Close demo"
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white hover:bg-violet"
              >
                ✕
              </button>
              <video
                src={sachhaiVideo.url}
                autoPlay
                controls
                playsInline
                className="aspect-video w-full bg-black"
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

/* ============ JOURNEY ============ */
export function Journey() {
  const items = [
    {
      yr: "2023 – 2027",
      title: "NMIT Bengaluru",
      desc: "B.E. Information Science & Engineering · CGPA 7.95",
    },
    {
      yr: "2023 – 2025",
      title: "Founder & Event Lead, Adwaitha Club NMIT",
      desc: "Established 2 institutional MOUs, conducted college-level health camps, volunteered at an AI Summit with Rabbitt AI, organized 5 guest events with end-to-end execution & financial management, and mentored students toward successful placements.",
    },
    {
      yr: "2023 – 2024",
      title: "Digital Marketing Intern, LinkedInforHER",
      desc: "Created & published professional content across digital platforms. Built automated LinkedIn & YouTube content-posting pipelines using N8N & Antigravity to improve reach & engagement.",
    },
    { yr: "2020 – 2022", title: "Pre-University, Siddaganga PU College", desc: "Score: 95%" },
    { yr: "2020", title: "Class X, CBSE", desc: "Score: 91.2%" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const line = progressLineRef.current;
    if (!line) return;

    let elementTop = 0;
    let elementHeight = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      elementTop = rect.top + scrollTop;
      elementHeight = rect.height;
    };

    measure();

    const onScroll = () => {
      const vh = window.innerHeight;
      const total = elementHeight + vh;
      const passed = (window.scrollY || document.documentElement.scrollTop) + vh - elementTop;
      const pct = Math.max(0, Math.min(100, (passed / total) * 100));
      line.style.height = `${pct}%`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="journey"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      <SectionBackdrop variant="dots" />
      <div className="relative mx-auto max-w-[1100px]">
        <Reveal>
          <SectionLabel num="04" text="Trajectory" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-20 font-display text-4xl font-bold text-body md:text-6xl">
            A short, <span className="text-violet">deliberate path</span> so far.
          </h2>
        </Reveal>

        <div ref={ref} className="relative pl-10 md:pl-16">
          <div className="absolute left-3 top-0 h-full w-px bg-white/5 md:left-6" />
          <div
            ref={progressLineRef}
            className="absolute left-3 top-0 w-px md:left-6"
            style={{
              height: "0%",
              background: "linear-gradient(180deg, #5CBDB9, #7DD3FC)",
              boxShadow: "0 0 12px #5CBDB9",
              transition: "height 0.1s linear",
            }}
          />
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 120} className="relative mb-14 last:mb-0">
              <span className="absolute -left-[34px] top-2 h-4 w-4 rounded-full bg-[#07121F] ring-2 ring-violet md:-left-[46px]">
                <span className="absolute inset-1 rounded-full bg-violet glow-violet" />
              </span>
              <div className="font-mono text-xs uppercase tracking-widest text-gold">{it.yr}</div>
              <h3 className="mt-2 font-display text-2xl font-bold text-body md:text-3xl">
                {it.title}
              </h3>
              <p className="mt-2 text-muted-soft">{it.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ RECOGNITION ============ */
export function Recognition() {
  const { graphicsMode } = useGraphics();
  const items: Array<{
    v: number;
    suffix?: string;
    prefix?: string;
    label: string;
    decimals?: number;
    compact?: boolean;
  }> = [
    { v: 1_000_000, suffix: "+", label: "LinkedIn Impressions", decimals: 0, compact: true },
    {
      v: 0.095,
      prefix: "Top ",
      suffix: "%",
      label: "Global LinkedIn Rank · Cleve AI 2024",
      decimals: 3,
    },
    { v: 3, suffix: "rd Place", label: "Thinkathon — Cloudzilla, NMIT", decimals: 0 },
    { v: 5, suffix: "", label: "College Cricket Tournaments Won", decimals: 0 },
  ];
  return (
    <section
      id="recognition"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      {graphicsMode === "interactive-3d" && (
        <HeavyGate desktopOnly className="pointer-events-none absolute inset-0 opacity-60">
          <GLSLHills speed={0.35} />
        </HeavyGate>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="05" text="Monuments" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-16 font-display text-4xl font-bold text-body md:text-6xl">
            Quiet wins, <span className="text-gold">loud echoes</span>.
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                data-hover
                className="monument-card group relative overflow-hidden rounded-2xl bg-surface p-8 transition-all hover:-translate-y-1"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(255,179,71,0.15), transparent 70%)",
                  }}
                />
                <div className="relative">
                  <div className="font-display text-4xl font-bold text-gold md:text-5xl">
                    <Counter
                      value={it.v}
                      prefix={it.prefix || ""}
                      suffix={it.suffix || ""}
                      decimals={it.decimals}
                      compact={it.compact}
                    />
                  </div>
                  <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-soft">
                    {it.label}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <style>{`
          @property --mon-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
          .monument-card { position: relative; border: 1px solid rgba(255,255,255,0.05); isolation: isolate; }
          .monument-card::before {
            content: ""; position: absolute; inset: 0; padding: 1px; border-radius: 1rem; z-index: -1;
            background: conic-gradient(from var(--mon-angle), transparent 0deg, rgba(124,110,255,0.85) 80deg, rgba(244,196,107,0.85) 160deg, transparent 240deg);
            -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            opacity: 0; transition: opacity 300ms ease;
          }
          .monument-card:hover::before { opacity: 1; animation: monAngleSpin 3.5s linear infinite; }
          @keyframes monAngleSpin { to { --mon-angle: 360deg; } }
        `}</style>
      </div>
    </section>
  );
}

/* ============ CERTS — stacked display cards with sparkles ============ */
export function Certs() {
  const certCards = [
    {
      icon: <GraduationCap className="size-4 text-white" />,
      title: "ML Specialization",
      description: "Stanford · Coursera",
      date: "Course Certificate",
      iconClassName: "text-indigo-300",
      titleClassName: "text-white",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Award className="size-4 text-white" />,
      title: "Generative AI Track",
      description: "Credly · Industry",
      date: "Credential",
      iconClassName: "text-zinc-300",
      titleClassName: "text-white",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <BarChart3 className="size-4 text-white" />,
      title: "Power BI Essentials",
      description: "Simplilearn",
      date: "Verified",
      iconClassName: "text-blue-300",
      titleClassName: "text-white",
      className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <section
      id="certs"
      className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32 md:px-12 md:py-36"
      style={{ background: "#080808" }}
    >
      {/* Sparkles backdrop — desktop only; old phones crash rendering a canvas particle system */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <HeavyGate
          desktopOnly
          rootMargin="100px"
          className="absolute inset-0"
          fallback={
            /* Mobile fallback: pure CSS star-scatter — zero GPU cost */
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 85% 75%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 25% 85%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 60% 15%, rgba(255,255,255,0.35) 0%, transparent 100%)",
                backgroundSize: "100% 100%",
              }}
            />
          }
        >
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={60}
            particleColor="#ffffff"
            speed={1}
            className="h-full w-full"
          />
        </HeavyGate>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, transparent 40%, #080808 80%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="mb-14 flex items-end justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5a5a5a]">
            Certifications
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2e2e2e]">
            03 verified
          </div>
        </div>

        <div className="flex min-h-[420px] w-full items-center justify-center">
          <div className="w-full max-w-3xl">
            <DisplayCards cards={certCards} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ EXPERIENCE ============ */
export function Experience() {
  const items = [
    {
      role: "Founder & Event Lead",
      org: "Adwaitha Club, NMIT",
      yr: "2023 – 2025",
      icon: Briefcase,
      points: [
        "Established 2 institutional MOUs and conducted college-level health camps.",
        "Volunteered at an AI Summit in collaboration with Rabbitt AI.",
        "Organized 5 guest events with end-to-end execution and financial management.",
        "Mentored students toward successful placements.",
      ],
    },
    {
      role: "Digital Marketing Intern",
      org: "LinkedInforHER, Bengaluru",
      yr: "2023 – 2024",
      icon: Briefcase,
      points: [
        "Created and published professional content across LinkedIn and YouTube.",
        "Built automated content-posting pipelines using N8N and Antigravity (AI workflow tools).",
        "Improved reach and engagement through AI-driven content optimization.",
      ],
    },
  ];
  return (
    <section
      id="experience"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-32"
    >
      <SectionBackdrop variant="aurora-cyan" />
      <div className="relative mx-auto max-w-[1100px]">
        <Reveal>
          <SectionLabel num="04a" text="Experience" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-16 font-display text-4xl font-bold text-body md:text-6xl">
            Where I&apos;ve <span className="text-violet">shown up</span>.
          </h2>
        </Reveal>
        <div className="relative pl-10 md:pl-14">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-violet via-violet/40 to-transparent md:left-5" />
          {items.map((it, i) => (
            <Reveal key={it.role} delay={i * 150} className="relative mb-12 last:mb-0">
              <span className="absolute -left-[34px] top-3 grid h-6 w-6 place-items-center rounded-full bg-[#07121F] ring-2 ring-violet md:-left-[42px]">
                <it.icon size={12} className="text-violet" />
              </span>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_-30px_rgba(124,110,255,0.5)]">
                <div className="font-mono text-[11px] uppercase tracking-widest text-gold">
                  {it.yr}
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-body md:text-2xl">
                  {it.role}
                </h3>
                <div className="mt-1 text-sm text-violet">{it.org}</div>
                <ul className="mt-4 space-y-2 text-sm text-muted-soft">
                  {it.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SKILLS CHIPS (categorised) ============ */
export function SkillsChips() {
  const categories: Array<{ title: string; chips: string[]; accent: string }> = [
    { title: "Programming", chips: ["Python", "C", "SQL", "R"], accent: "#7C6EFF" },
    {
      title: "ML / Data",
      chips: ["Pandas", "NumPy", "Scikit-learn", "NLP", "EDA", "TF-IDF", "Random Forest"],
      accent: "#5CBDB9",
    },
    {
      title: "AI & Automation",
      chips: ["Generative AI", "N8N", "Antigravity", "Manus", "Emergent", "Workflow Automation"],
      accent: "#F4C46B",
    },
    {
      title: "Tools",
      chips: ["Power BI", "Google Colab", "Lovable", "GitHub", "Jupyter Notebook", "Canva"],
      accent: "#40C8FF",
    },
    {
      title: "Soft Skills",
      chips: ["Leadership", "Communication", "Collaboration"],
      accent: "#FF8C5A",
    },
  ];
  return (
    <section
      id="skills-chips"
      className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1300px]">
        <Reveal>
          <h3 className="mb-10 font-display text-2xl font-bold text-body md:text-4xl">
            Stack, <span className="text-violet">categorised</span>.
          </h3>
        </Reveal>
        <div className="space-y-8">
          {categories.map((cat, ci) => (
            <Reveal key={cat.title} delay={ci * 100}>
              <div>
                <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-soft">
                  <span className="mr-3" style={{ color: cat.accent }}>
                    ◆
                  </span>
                  {cat.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.chips.map((chip, i) => (
                    <span
                      key={chip}
                      className="skill-chip inline-flex items-center gap-2 rounded-full border bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-body backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                      style={{
                        borderColor: `${cat.accent}55`,
                        boxShadow: `0 0 18px ${cat.accent}22`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: cat.accent, boxShadow: `0 0 8px ${cat.accent}` }}
                      />
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <style>{`
          @keyframes chipPop { 0% { opacity: 0; transform: scale(0.85) translateY(8px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          .skill-chip { animation: chipPop 0.45s cubic-bezier(0.16,1,0.3,1) both; }
          @media (prefers-reduced-motion: reduce) { .skill-chip { animation: none; } }
        `}</style>
      </div>
    </section>
  );
}

/* ============ EDUCATION ============ */
export function Education() {
  const items = [
    {
      yr: "2023 – 2027",
      title: "B.E. Information Science & Engineering",
      org: "NMIT, Bengaluru",
      scoreLabel: "CGPA",
      score: 7.95,
      max: 10,
    },
    {
      yr: "2020 – 2022",
      title: "Pre-University (PU)",
      org: "Siddaganga PU College",
      scoreLabel: "Score",
      score: 95,
      max: 100,
    },
    {
      yr: "2020",
      title: "Class X (CBSE)",
      org: "CBSE Board",
      scoreLabel: "Score",
      score: 91.2,
      max: 100,
    },
  ];
  return (
    <section
      id="education"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-32"
    >
      <SectionBackdrop variant="aurora-gold" />
      <div className="relative mx-auto max-w-[1100px]">
        <Reveal>
          <SectionLabel num="04b" text="Education" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-14 font-display text-4xl font-bold text-body md:text-6xl">
            Built on a <span className="text-gold">solid base</span>.
          </h2>
        </Reveal>
        <div className="grid gap-5">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 120}>
              <EducationCard {...it} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationCard({
  yr,
  title,
  org,
  scoreLabel,
  score,
  max,
}: {
  yr: string;
  title: string;
  org: string;
  scoreLabel: string;
  score: number;
  max: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, (score / max) * 100);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setWidth(pct);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setWidth(pct);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);
  return (
    <div
      ref={ref}
      className="grid items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[160px_1fr] md:p-8"
    >
      <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-center font-mono text-xs uppercase tracking-widest text-gold shadow-[0_0_24px_rgba(244,196,107,0.25)] md:text-sm">
        {yr}
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-body md:text-2xl">{title}</h3>
        <div className="mt-1 text-sm text-violet">{org}</div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-soft">
          <span className="font-mono uppercase tracking-widest">{scoreLabel}</span>
          <span className="font-display text-lg font-bold text-gold">
            {score}
            {max === 100 ? "%" : ` / ${max}`}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full"
            style={{
              width: `${width}%`,
              background: "linear-gradient(90deg, #7C6EFF, #F4C46B)",
              boxShadow: "0 0 18px rgba(244,196,107,0.45)",
              transition: "width 1.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============ BEYOND CODE ============ */
export function BeyondCode() {
  const items = [
    {
      icon: GraduationCap,
      title: "BooksforHER Volunteer",
      text: "Book Donation Drive at IIM Bangalore and Saanidhya, Mangalore. Helped curate, sort, and distribute educational material to under-served learners.",
      accent: "#5CBDB9",
    },
    {
      icon: Users,
      title: "Career Guidance Program",
      text: "Conducted an industry-readiness session for ISE department students at NMIT — covering portfolio, projects, and interview prep.",
      accent: "#F4C46B",
    },
  ];
  return (
    <section
      id="beyond-code"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-32"
    >
      <SectionBackdrop variant="aurora-violet" />
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <SectionLabel num="07" text="Beyond Code" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-14 font-display text-4xl font-bold text-body md:text-6xl">
            Work that <span className="text-violet">isn&apos;t shipped to prod</span>.
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:-translate-y-1">
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(60% 60% at 30% 0%, ${it.accent}33, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: `${it.accent}22`,
                      color: it.accent,
                      boxShadow: `0 0 22px ${it.accent}55`,
                    }}
                  >
                    <it.icon size={22} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-body md:text-2xl">
                    {it.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-soft">{it.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ VIBE (full-bleed shader + cursor image trail) ============ */
export function Vibe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokens = ["AI", "ML", "Py", "GenAI", "NLP", "N8N", "React", "SQL", "Auto", "✦", "◉", "→"];
  return (
    <section
      ref={containerRef}
      id="vibe"
      className="relative h-[80vh] w-full overflow-hidden border-y border-white/[0.04]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3a] via-[#0F2540] to-black" />
      {/* 5 balls on mobile (was 16) — prevents paint/composite overload on old phones */}
      <WavingBalls
        count={
          typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? 5 : 16
        }
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* mouse-driven image trail — desktop/tablet only (skipped on touch devices) */}
      <HeavyGate desktopOnly className="pointer-events-none absolute inset-0">
        <ImageTrail
          containerRef={containerRef as React.RefObject<HTMLElement>}
          interval={70}
          rotationRange={25}
        >
          {tokens.map((t, i) => (
            <div
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-violet/40 bg-black/60 font-mono text-xs uppercase tracking-widest text-body backdrop-blur-md shadow-[0_0_30px_rgba(124,110,255,0.5)]"
            >
              {t}
            </div>
          ))}
        </ImageTrail>
      </HeavyGate>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
            [ INTERLUDE — MOVE YOUR CURSOR ]
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2
            className="font-display font-bold leading-[0.9] text-body"
            style={{ fontSize: "clamp(48px, 10vw, 140px)" }}
          >
            Made <span className="gradient-text">to move.</span>
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-xl font-mono text-[11px] uppercase tracking-[0.25em] text-muted-soft">
            Every pixel here breathes — same energy I bring to systems.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
export function Contact() {
  const links = [
    { l: "Email", v: "naagasumukh1@gmail.com", h: "mailto:naagasumukh1@gmail.com", i: "✉" },
    {
      l: "LinkedIn",
      v: "linkedin.com/in/naaga-sumukh-bs",
      h: "https://linkedin.com/in/naaga-sumukh-bs",
      i: "in",
    },
    { l: "GitHub", v: "github.com/naagasumukh8", h: "https://github.com/naagasumukh8", i: "⌥" },
    { l: "Phone", v: "+91 99723 71999", h: "tel:+919972371999", i: "☎" },
  ];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-70">
        <LampContainer className="h-[420px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
        <OrbitingDots />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="07" text="Transmission" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-8 font-display text-5xl font-bold leading-[0.95] text-body md:text-8xl">
            Let's build something <span className="gradient-text">unforgettable</span>.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mb-20 max-w-2xl text-lg text-muted-soft">
            Open to AI/ML roles, freelance automation, and collaborations.
          </p>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
          {/* Left Column: Social Links */}
          <div className="grid gap-4 self-start">
            {links.map((it, i) => (
              <Reveal key={it.l} delay={i * 70}>
                <a
                  href={it.h}
                  target={it.h.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-hover
                  className="contact-row glass-row group flex items-center justify-between gap-4 px-6 md:px-8"
                >
                  <div className="flex items-center gap-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] font-mono text-sm text-violet backdrop-blur-md transition-all group-hover:bg-violet group-hover:text-white">
                      {it.i}
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                        {it.l}
                      </div>
                      <div className="truncate font-display text-xl font-bold text-body transition-colors group-hover:text-violet md:text-3xl">
                        {it.v}
                      </div>
                    </div>
                  </div>
                  <span className="glass-pill shrink-0 !py-2 !px-4 !text-[10px]">
                    Open <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Right Column: Message Terminal Form */}
          <Reveal delay={150}>
            <div className="relative rounded-3xl border border-white/15 bg-white/[0.02] p-6 md:p-8 backdrop-blur-md">
              <div className="absolute top-4 right-6 flex gap-1.5 pointer-events-none">
                <span className="h-2 w-2 rounded-full bg-red-500/40" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/40" />
                <span className="h-2 w-2 rounded-full bg-green-500/40" />
              </div>
              <div className="mb-6 font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                [ secure-terminal: message_inbound ]
              </div>

              {status === "sent" ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  style={{ animation: "fadeIn 0.5s ease both" }}
                >
                  <div className="h-14 w-14 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center text-green-400 text-xl mb-4">
                    ✓
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Message Transmitted
                  </h3>
                  <p className="text-sm text-muted-soft max-w-xs">
                    Connection established. I'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      Ident / Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      disabled={status === "sending"}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none rounded-xl px-4 py-3 text-sm transition-all text-white placeholder-white/25 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      Email / Terminal
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      disabled={status === "sending"}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none rounded-xl px-4 py-3 text-sm transition-all text-white placeholder-white/25 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      Transmission content
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="What are we building?"
                      disabled={status === "sending"}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none rounded-xl px-4 py-3 text-sm transition-all text-white placeholder-white/25 resize-none disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="glass-pill justify-center text-xs font-semibold py-3 disabled:opacity-50"
                  >
                    {status === "sending" ? "Transmitting..." : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        <div
          className="mt-20 h-px w-full origin-left bg-gradient-to-r from-white/20 via-white/10 to-transparent"
          style={{ animation: "drawLine 1.5s 0.3s cubic-bezier(0.16,1,0.3,1) backwards" }}
        />
        <footer className="mt-6 flex flex-col items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-soft md:flex-row">
          <span>
            © 2026{" "}
            <span className="mx-1 text-violet" style={{ animation: "dotPulse 2s 0s infinite" }}>
              ·
            </span>{" "}
            Naaga Sumukh B S{" "}
            <span className="mx-1 text-violet" style={{ animation: "dotPulse 2s 0.5s infinite" }}>
              ·
            </span>{" "}
            Bengaluru
          </span>
          <span>Crafted with intent.</span>
          <style>{`
            @keyframes drawLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
            @keyframes dotPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          `}</style>
        </footer>
      </div>
    </section>
  );
}

/* ============ ROOT ============ */
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
        {/* Primary global shader backdrop — shown on plain areas, dominated by any section background that sits on top */}
        <PaperShaderBackdrop />
        {/* Existing CSS mesh kept as additional soft layer */}
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

/* ============ ACHIEVEMENTS BURST (Click LinkedIn / GitHub) ============ */
type AchItem = { icon: typeof Trophy; label: string; value: string; sub?: string };
type FeedPost = { title: string; meta: string; body: string; tag?: string; href?: string };

function AchievementPanel({
  open,
  items,
  accent,
}: {
  open: boolean;
  items: AchItem[];
  accent: string;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="grid gap-3 pt-5 sm:grid-cols-2">
          {items.map((it, i) => (
            <div
              key={it.label}
              className="group relative flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
              style={{
                animation: open ? `fade-in 0.5s ${i * 60}ms both` : undefined,
              }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${accent}22`, color: accent }}
              >
                <it.icon size={20} />
              </span>
              <div className="min-w-0">
                <div className="font-display text-xl font-bold leading-none text-body">
                  {it.value}
                </div>
                <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                  {it.label}
                </div>
                {it.sub && <div className="mt-1 truncate text-xs text-muted-soft/80">{it.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====== Phone-shaped popup that showcases featured content ====== */
function PhoneModal({
  open,
  onClose,
  variant,
  accent,
  handle,
  href,
  items,
  posts,
}: {
  open: boolean;
  onClose: () => void;
  variant: "linkedin" | "github";
  accent: string;
  handle: string;
  href: string;
  items: AchItem[];
  posts: FeedPost[];
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center px-4 py-8"
      style={{ animation: "fade-in 0.25s ease-out both" }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <div
        className="relative flex w-[330px] max-w-[92vw] h-[680px] max-h-[88vh] flex-col rounded-[44px] border border-white/15 bg-[#05080F] overflow-hidden"
        style={{
          animation: "phone-pop 0.45s cubic-bezier(0.16,1,0.3,1) both",
          boxShadow: `0 40px 120px -20px ${accent}55, inset 0 0 0 2px rgba(255,255,255,0.06)`,
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-black border border-white/10" />
        <div className="relative z-20 flex shrink-0 items-center justify-between px-7 pt-3 pb-1 text-[10px] font-mono text-white/70">
          <span>9:41</span>
          <span className="opacity-80">●●●●● 5G</span>
        </div>

        <div className="relative z-20 flex shrink-0 items-center justify-between px-5 pt-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: `${accent}22`, color: accent }}
            >
              {variant === "linkedin" ? <Linkedin size={20} /> : <Github size={20} />}
            </span>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                {variant === "linkedin" ? "LinkedIn" : "GitHub"}
              </div>
              <div className="font-display text-sm font-bold text-body">{handle}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted-soft hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          onWheelCapture={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-2 gap-2">
            {items.map((it, i) => (
              <div
                key={it.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                style={{ animation: `fade-in 0.5s ${i * 70}ms both` }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: accent }}>
                    <it.icon size={14} />
                  </span>
                  <span className="font-display text-base font-bold text-body">{it.value}</span>
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-soft truncate">
                  {it.label}
                </div>
              </div>
            ))}
          </div>

          {variant === "github" && (
            <div
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              style={{ animation: "fade-in 0.6s 0.2s both" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                  Contributions · 12mo
                </span>
                <span className="font-mono text-[10px]" style={{ color: accent }}>
                  active
                </span>
              </div>
              <div className="grid grid-cols-[repeat(26,1fr)] gap-[3px]">
                {Array.from({ length: 26 * 7 }).map((_, i) => {
                  const lvl = Math.floor(Math.random() * 5);
                  const bg =
                    lvl === 0
                      ? "rgba(255,255,255,0.05)"
                      : `${accent}${["33", "66", "99", "ff"][lvl - 1]}`;
                  return (
                    <span
                      key={i}
                      className="aspect-square rounded-[2px]"
                      style={{
                        background: bg,
                        animation: `cell-pop 0.45s ${(i % 26) * 18 + Math.floor(i / 26) * 12}ms both`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {posts.map((p, i) => (
            <a
              key={p.title}
              href={p.href ?? href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.07] transition-colors"
              style={{
                animation:
                  variant === "linkedin"
                    ? `feed-slide 0.5s ${300 + i * 110}ms both`
                    : `repo-rise 0.5s ${500 + i * 100}ms both`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {p.tag ?? (variant === "linkedin" ? "Post" : "Repository")}
                </span>
                <span className="font-mono text-[9px] text-muted-soft">{p.meta}</span>
              </div>
              <div className="mt-2 font-display text-sm font-bold text-body leading-snug">
                {p.title}
              </div>
              <div className="mt-1 text-xs text-muted-soft leading-relaxed">{p.body}</div>
            </a>
          ))}

          <div className="h-2" />
        </div>

        <div className="relative z-20 shrink-0 border-t border-white/10 bg-[#05080F]/95 px-4 py-3 backdrop-blur-xl">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full font-mono text-[11px] uppercase tracking-widest text-white transition-transform active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
              boxShadow: `0 10px 30px -10px ${accent}aa, inset 0 1px 0 rgba(255,255,255,0.3)`,
            }}
          >
            Open {variant === "linkedin" ? "LinkedIn" : "GitHub"} ↗
          </a>
        </div>

        <div className="pointer-events-none absolute bottom-1 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-white/30" />
      </div>

      <style>{`
        @keyframes phone-pop {
          from { opacity: 0; transform: translateY(40px) scale(0.92); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes feed-slide {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes repo-rise {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cell-pop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body,
  );
}

export function Achievements() {
  const [open, setOpen] = useState<"linkedin" | "github" | null>(null);
  const [phone, setPhone] = useState<"linkedin" | "github" | null>(null);

  const linkedin: AchItem[] = [
    { icon: Users, label: "Profile", value: "Open", sub: "naaga-sumukh-bs" },
    { icon: Briefcase, label: "Focus", value: "AI / ML", sub: "Agents · automation" },
    { icon: GraduationCap, label: "Studying", value: "NMIT", sub: "Bengaluru" },
    { icon: MessageSquare, label: "DMs", value: "Open", sub: "Always up for a chat" },
  ];
  const github: AchItem[] = [
    { icon: GitBranch, label: "Public Repos", value: "2", sub: "More shipping soon" },
    { icon: Star, label: "Stars", value: "0", sub: "Early days — give one ⭐" },
    { icon: Zap, label: "Building", value: "AI tools", sub: "Agents · pipelines" },
    { icon: Trophy, label: "Joined", value: "Oct '25", sub: "Fresh on GitHub" },
  ];

  const linkedinPosts: FeedPost[] = [
    {
      tag: "Profile",
      title: "Naaga Sumukh B S",
      meta: "AI / ML student",
      body: "Information Science & Engineering undergraduate at NMIT (2023–2027). Strong foundation in Python, SQL, R, and data analysis with hands-on projects and applied AI experience. Open to ML / AI internship roles.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
    {
      tag: "Achievement",
      title: "1M+ impressions · Top 0.095% globally",
      meta: "Cleve AI · 2024",
      body: "Achieved 1M+ impressions on LinkedIn and ranked among the top 0.095% users globally in 2024 according to Cleve AI.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
    {
      tag: "Experience",
      title: "Digital Marketing Intern, LinkedInforHER",
      meta: "2023 – 2024",
      body: "Created and published professional content across digital platforms. Built automated LinkedIn and YouTube content-posting pipelines using AI-driven workflow tools (N8N, Antigravity) to improve reach and engagement.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
    {
      tag: "Connect",
      title: "Open to ML / AI internships",
      meta: "Bengaluru",
      body: "Seeking Machine Learning / AI internship roles. Passionate about building real-world AI solutions, leveraging generative AI tools, and contributing to impactful, data-driven systems.",
      href: "https://linkedin.com/in/naaga-sumukh-bs",
    },
  ];

  const githubPosts: FeedPost[] = [
    {
      tag: "Repository · JavaScript",
      title: "Job_Verify_FYP",
      meta: "Public · active",
      body: "Final-year project: AI-assisted job-listing verification. Work in progress — issues and PRs welcome.",
      href: "https://github.com/naagasumukh8/Job_Verify_FYP",
    },
    {
      tag: "Profile README · Python",
      title: "naagasumukh8",
      meta: "Public",
      body: "Profile repository — quick intro and the things I'm currently exploring.",
      href: "https://github.com/naagasumukh8/naagasumukh8",
    },
    {
      tag: "Status",
      title: "More repos shipping soon",
      meta: "Coming up",
      body: "Agent orchestration experiments and N8N pipeline templates are next on the list to open-source.",
      href: "https://github.com/naagasumukh8",
    },
    {
      tag: "Follow",
      title: "Follow along on GitHub",
      meta: "@naagasumukh8",
      body: "Joined Oct 2025 — early days. A ⭐ on Job_Verify_FYP genuinely helps.",
      href: "https://github.com/naagasumukh8",
    },
  ];

  const Card = ({
    id,
    href,
    Icon,
    title,
    handle,
    accent,
    items,
  }: {
    id: "linkedin" | "github";
    href: string;
    Icon: typeof Linkedin;
    title: string;
    handle: string;
    accent: string;
    items: AchItem[];
  }) => {
    const isOpen = open === id;
    return (
      <div
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-sm transition-all hover:border-white/20 md:p-7"
        style={{ boxShadow: isOpen ? `0 30px 80px -20px ${accent}55` : undefined }}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at 50% 0%, ${accent}1f, transparent 60%)`,
          }}
        />
        <button
          type="button"
          data-hover
          onClick={() => setPhone(id)}
          aria-label={`Open ${title} showcase`}
          className="relative z-10 flex w-full items-center justify-between gap-3 text-left md:gap-4"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 transition-transform group-hover:scale-110 md:h-14 md:w-14"
              style={{ background: `${accent}1f`, color: accent }}
            >
              <Icon size={22} className="md:hidden" />
              <Icon size={26} className="hidden md:block" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                {title}
              </div>
              <div className="truncate font-display text-base font-bold text-body md:text-2xl">
                {handle}
              </div>
            </div>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-all group-hover:scale-110 md:h-10 md:w-10"
            style={{ color: accent, borderColor: `${accent}55` }}
          >
            ↗
          </span>
        </button>

        <div className="relative z-10">
          <AchievementPanel open={isOpen} items={items} accent={accent} />
        </div>

        <div className="relative z-10 mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(isOpen ? null : id)}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-soft hover:text-white"
          >
            {isOpen ? "Hide quick stats" : "Show quick stats"}
          </button>
          <HoverButton
            onClick={() => setPhone(id)}
            className="px-5 py-2 text-[11px] uppercase tracking-widest"
            style={{
              ["--circle-start" as never]: accent,
              ["--circle-end" as never]: "#ffffff",
            }}
          >
            Open showcase ↗
          </HoverButton>
        </div>
      </div>
    );
  };

  return (
    <section
      id="achievements"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-40"
    >
      <HeavyGate desktopOnly className="pointer-events-none absolute inset-0 opacity-30">
        <DottedSurface />
      </HeavyGate>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="06" text="Signals" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-4 font-display text-4xl font-bold leading-[0.95] text-body sm:text-5xl md:text-7xl">
            Proof, not <span className="gradient-text">promises.</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mb-10 max-w-2xl text-sm text-muted-soft sm:mb-14 sm:text-lg">
            A phone-style showcase of featured posts, achievements and live signals from across the
            web.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Reveal delay={250}>
            <Card
              id="linkedin"
              href="https://linkedin.com/in/naaga-sumukh-bs"
              Icon={Linkedin}
              title="LinkedIn"
              handle="@naaga-sumukh-bs"
              accent="#0A66C2"
              items={linkedin}
            />
          </Reveal>
          <Reveal delay={350}>
            <Card
              id="github"
              href="https://github.com/naagasumukh8"
              Icon={Github}
              title="GitHub"
              handle="@naagasumukh8"
              accent="#a78bfa"
              items={github}
            />
          </Reveal>
        </div>
      </div>

      <PhoneModal
        open={phone === "linkedin"}
        onClose={() => setPhone(null)}
        variant="linkedin"
        accent="#0A66C2"
        handle="@naaga-sumukh-bs"
        href="https://linkedin.com/in/naaga-sumukh-bs"
        items={linkedin}
        posts={linkedinPosts}
      />
      <PhoneModal
        open={phone === "github"}
        onClose={() => setPhone(null)}
        variant="github"
        accent="#a78bfa"
        handle="@naagasumukh8"
        href="https://github.com/naagasumukh8"
        items={github}
        posts={githubPosts}
      />
    </section>
  );
}

/* ============ TESTIMONIALS / RECOMMENDATIONS ============ */
export function Testimonials() {
  const recommendations = [
    {
      quote:
        "Naaga's ability to turn complex machine learning concepts into production-ready software is rare. His work on SacchAI demonstrated deep understanding of model inference and browser extension integration.",
      name: "Dr. Sarika Halde",
      role: "Project Guide & Professor",
      org: "NMIT Bengaluru",
      accent: "#5CBDB9",
    },
    {
      quote:
        "Working with Sumukh on MediConnect was a masterclass in development speed. He built the entire real-time booking and doctor approval workflows in record time, keeping code robust and fully responsive.",
      name: "MediConnect Lead",
      role: "Lead Engineer",
      org: "easyhospital.lovable.app",
      accent: "#7C6EFF",
    },
    {
      quote:
        "JobShield solved a real-world problem with an elegant approach. Naaga's presentation and the accuracy of the fake-job classifier stood out immediately during the NMIT Thinkathon.",
      name: "Thinkathon Judge",
      role: "Evaluation Committee Member",
      org: "Cloudzilla, NMIT",
      accent: "#FFB347",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-32"
    >
      <SectionBackdrop variant="aurora-gold" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      <div className="relative mx-auto max-w-[1300px]">
        <Reveal>
          <SectionLabel num="06" text="Endorsements" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mb-14 font-display text-4xl font-bold text-body md:text-6xl">
            Trusted by <span className="text-gold">mentors &amp; peers</span>.
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map((it, i) => (
            <Reveal key={it.name} delay={i * 120}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:-translate-y-1 hover:border-white/20">
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(60% 60% at 30% 0%, ${it.accent}22, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <span className="font-serif text-5xl text-white/20 select-none">“</span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-soft italic">{it.quote}</p>
                </div>
                <div className="relative mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-base font-semibold text-white">{it.name}</div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-soft">
                      {it.role} · <span className="text-white/60">{it.org}</span>
                    </div>
                  </div>
                  <span className="text-xl" style={{ color: it.accent }}>
                    ✦
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <PortfolioShell>
      <Hero />
      <Marquee />
      <About />
      <Marquee reverse />

      <Projects />
      <Experience />
      <Education />
      <Live3D />
      <Journey />
      <Recognition />
      <Certs />
      <BeyondCode />
      <Testimonials />
      <Achievements />
      <Vibe />
      <Contact />
    </PortfolioShell>
  );
}
