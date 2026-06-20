import { useEffect, useRef, useState } from "react";
import { useGraphics } from "./PortfolioShell";
import { HeavyGate, useIsDesktop, useLowEndDevice } from "@/components/HeavyGate";
import { Spotlight } from "@/components/ui/spotlight";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { SplineScene } from "@/components/ui/splite";
import { SplitWord } from "./PortfolioUtils";

// ============ NEURAL NETWORK CANVAS ============
export function NeuralCanvas() {
  const isDesktop = useIsDesktop();
  const isLowEnd = useLowEndDevice();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

// ============ HERO ============
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
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute inset-0 opacity-50">
        <NeuralCanvas />
      </div>

      <div ref={splineHostRef} data-spline-host className="absolute inset-0 z-0">
        <div className="absolute inset-0 cursor-pointer" onClick={handleRobotClick} />
        {graphicsMode === "interactive-3d" ? (
          <HeavyGate
            desktopOnly
            rootMargin="600px"
            className="absolute inset-0"
            fallback={
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
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 50%, rgba(124,110,255,0.22) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(92,189,185,0.15) 0%, transparent 50%)",
            }}
          />
        )}
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
