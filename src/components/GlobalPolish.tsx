import { useEffect, useRef } from "react";

/** Mobile-only scroll progress bar — rAF-throttled. */
function MobileScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const ratio = max > 0 ? window.scrollY / max : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${ratio})`;
        }
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[9998] h-[2px] w-full pointer-events-none md:hidden"
    >
      <div
        ref={progressRef}
        className="h-full origin-left"
        style={{
          width: "100%",
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, #7C6EFF, #FFB347)",
          boxShadow: "0 0 8px rgba(124,110,255,0.6)",
          transition: "transform 80ms linear",
        }}
      />
    </div>
  );
}

export function GlobalPolish() {
  return <MobileScrollProgress />;
}
