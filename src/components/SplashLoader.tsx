"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WebGLShader } from "./ui/web-gl-shader";

/**
 * Premium WebGL shader splash with "Naaga Sumukh" wordmark.
 * Desktop/tablet only. ~6.5s. Shows only once per session.
 */
export function SplashLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("splash:v5") === "1";
    if (isMobile || reduced || seen) return;

    setShow(true);
    sessionStorage.setItem("splash:v5", "1");

    const DURATION = 6500;
    const hardStop = setTimeout(() => setShow(false), DURATION);
    return () => clearTimeout(hardStop);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* WebGL shader fills the whole splash */}
          <div className="absolute inset-0">
            <WebGLShader />
          </div>

          {/* Soft vignette so the name pops */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.55)_75%)]" />

          {/* Name + progress */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
            <motion.h1
              initial={{ y: 16, opacity: 0, letterSpacing: "0.2em" }}
              animate={{ y: 0, opacity: 1, letterSpacing: "-0.02em" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
              style={{
                textShadow: "0 0 40px rgba(255,255,255,0.45), 0 0 80px rgba(124,110,255,0.35)",
              }}
            >
              Naaga Sumukh
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-mono text-[11px] uppercase tracking-[0.5em] text-white/80"
            >
              AI · ML Engineer
            </motion.div>

            <div className="mt-4 h-px w-56 overflow-hidden bg-white/15 md:w-72">
              <div
                className="h-full origin-left bg-white"
                style={{ animation: "splashProgress 6.5s linear forwards" }}
              />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
              Loading
            </div>
            <style>{`@keyframes splashProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
