import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

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

export function useLowEndDevice() {
  const [lowEnd, setLowEnd] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { effectiveType?: string; saveData?: boolean };
    };
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    const lowCPU =
      typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const lowRAM = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const slowNet =
      nav.connection?.saveData === true ||
      nav.connection?.effectiveType === "2g" ||
      nav.connection?.effectiveType === "slow-2g";

    const result = isSmallScreen || lowCPU || lowRAM || slowNet;
    setLowEnd(result);

    if (result) {
      document.documentElement.dataset.lowEnd = "true";
    } else {
      delete document.documentElement.dataset.lowEnd;
    }
  }, []);
  return lowEnd;
}

interface HeavyGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  desktopOnly?: boolean;
  rootMargin?: string;
  className?: string;
  as?: "div" | "span";
}

/**
 * Mounts heavy children only when the wrapper is in view (IntersectionObserver)
 * and unmounts them when they scroll out of view. This frees GPU memory and processing
 * power dynamically on desktop.
 */
export function HeavyGate({
  children,
  fallback = null,
  desktopOnly = false,
  rootMargin = "300px",
  className,
  as: Tag = "div",
}: HeavyGateProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const desktop = useIsDesktop();
  const lowEnd = useLowEndDevice();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setInView(entry.isIntersecting);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const allow = !desktopOnly || (desktop && !lowEnd);

  return (
    <Tag ref={ref as never} className={className}>
      {allow && inView ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </Tag>
  );
}
