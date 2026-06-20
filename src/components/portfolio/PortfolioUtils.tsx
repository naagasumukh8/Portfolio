import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";

// ============ IN-VIEW DETECTION ============
export function useInView<T extends HTMLElement>(threshold = 0.15) {
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

// ============ PREMIUM SECTION BACKDROPS ============
import { FloatingPaths } from "@/components/ui/background-paths";

export function AuroraBackdrop({ hue = "violet" }: { hue?: "violet" | "gold" | "cyan" }) {
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

export function SectionBackdrop({
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

// ============ LIGHTWEIGHT CSS EFFECTS ============
export function WavingBalls({ count = 14 }: { count?: number }) {
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

export function OrbitingDots() {
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

// ============ TYPING EFFECT ============
export function Typing({
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

// ============ REVEAL ON SCROLL ============
export function Reveal({
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
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

// ============ SPLIT TEXT REVEAL ============
export function SplitWord({
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

// ============ COUNTER ============
export function Counter({
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
  const [text, setText] = useState<string>(format(0));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
        const eased = 1 - Math.pow(1 - p, 3);
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
  }, [value, duration, compact, dp]);
  return (
    <span ref={ref}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

// ============ TILT CARD ============
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
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

// ============ SECTION LABEL ============
export function SectionLabel({ num, text }: { num: string; text: string }) {
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

// ============ GLOW TILE ============
export function GlowTile({
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
      <div
        className={`relative h-full rounded-2xl border border-white/[0.08] bg-surface/70 backdrop-blur-sm ${padding} transition-colors duration-300 group-hover:border-transparent`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx) var(--my), rgba(167,139,250,0.28), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,0.06), transparent 60%)",
          }}
        />
        <div className="relative">{children}</div>
      </div>
      <style>{`@keyframes tile-spin { to { --angle: 360deg; } } @property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }`}</style>
    </div>
  );
}

// ============ MARQUEE DIVIDER ============
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
