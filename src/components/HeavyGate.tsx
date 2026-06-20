import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

/** Returns true once the element has scrolled into view; stays true after. */
export function useInView<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);
  return [ref, seen] as const;
}

/** True on desktop/tablet with hover (>=768px). SSR-safe. */
export function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const upd = () => setD(mq.matches);
    upd();
    mq.addEventListener?.("change", upd);
    return () => mq.removeEventListener?.("change", upd);
  }, []);
  return d;
}

/** Defers a true-flag until the browser is idle (or after a max delay). */
export function useIdle(delay = 1200) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: delay });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

interface HeavyGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Skip mounting heavy children on mobile (renders fallback instead). */
  desktopOnly?: boolean;
  /** Distance before viewport to start mounting. */
  rootMargin?: string;
  className?: string;
  /** Tag to render as wrapper. Default div. */
  as?: "div" | "span";
}

/**
 * Mounts heavy children only when:
 *  - the wrapper is near/in view (IntersectionObserver), and
 *  - the device qualifies (desktopOnly gate when requested).
 * Wraps children in Suspense so React.lazy works seamlessly.
 */
export function HeavyGate({
  children,
  fallback = null,
  desktopOnly = false,
  rootMargin = "300px",
  className,
  as: Tag = "div",
}: HeavyGateProps) {
  const [ref, inView] = useInView<HTMLDivElement>(rootMargin);
  const desktop = useIsDesktop();
  const allow = !desktopOnly || desktop;
  return (
    <Tag ref={ref as any} className={className}>
      {allow && inView ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </Tag>
  );
}
