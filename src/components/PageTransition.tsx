import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Persistent ambient background + premium route-change transition.
 * Full premium treatment on every device (blur cross-fade + diagonal
 * sheen wipe with backdrop-filter). Only honors prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const upd = () => setIsDesktop(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  return (
    <>
      {/* Persistent ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-50"
        style={{
          background:
            "radial-gradient(1200px 800px at 15% 10%, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(900px 700px at 85% 90%, hsl(var(--accent, var(--primary)) / 0.08), transparent 60%), hsl(var(--background))",
        }}
      />
      {/* Noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-40 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Page content cross-fade keyed by route */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "opacity, transform, filter" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Diagonal sheen wipe */}
      {!prefersReducedMotion && (
        <AnimatePresence>
          <motion.div
            key={`sheen-${pathname}`}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[60]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.div
              initial={{ x: "-110%" }}
              animate={{ x: "110%" }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-y-0 -left-1/4 w-[60%] skew-x-[-18deg]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, hsl(var(--foreground) / 0.05) 40%, hsl(var(--foreground) / 0.18) 50%, hsl(var(--foreground) / 0.05) 60%, transparent 100%)",
                backdropFilter: isDesktop ? "blur(8px)" : "none",
                WebkitBackdropFilter: isDesktop ? "blur(8px)" : "none",
                willChange: "transform",
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
