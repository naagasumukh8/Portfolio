import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, X, Sparkles } from "lucide-react";

const STORAGE_KEY = "ns-desktop-tip-dismissed";

export function DesktopRecommendation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!isMobile || dismissed) return;
    const t = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-end justify-center px-4 pb-6 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={dismiss}
          />
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#1a1535] via-[#0f0a24] to-[#1a1535] p-6 shadow-[0_30px_120px_-20px_rgba(124,110,255,0.6)]"
          >
            {/* Animated aurora glow */}
            <div className="pointer-events-none absolute -inset-1 opacity-70">
              <div className="absolute -top-16 -left-12 h-48 w-48 rounded-full bg-[#7c6eff] blur-3xl animate-pulse" />
              <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-[#f4c46b] blur-3xl animate-pulse [animation-delay:600ms]" />
            </div>

            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                <Sparkles className="h-3 w-3 text-[#f4c46b]" />
                Pro tip
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/5">
                  <Monitor className="h-6 w-6 text-[#7c6eff]" />
                </div>
                <h2 className="text-lg font-semibold leading-tight text-white">
                  Best on desktop
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-white/70">
                This portfolio is crafted with 3D orbits, shader backdrops and
                rich motion. For the full cinematic experience, open it on a
                laptop or larger screen.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={dismiss}
                  className="w-full rounded-xl bg-gradient-to-r from-[#7c6eff] to-[#a78bfa] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,110,255,0.8)] transition active:scale-[0.98]"
                >
                  Continue on mobile
                </button>
                <p className="text-center text-[11px] text-white/40">
                  Tip: tap & hold sections for richer interactions
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
