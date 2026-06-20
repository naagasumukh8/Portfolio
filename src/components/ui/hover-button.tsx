"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Circle {
  id: number;
  x: number;
  y: number;
  color: string;
  fadeState: "in" | "out" | null;
}

export interface HoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * Apple-style "liquid glass" button with a trailing colored-circle
 * effect that follows the cursor while hovering. Tinted to the project's
 * violet/cyan brand by default via CSS custom properties:
 *   --circle-start, --circle-end
 */
const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current!);

    const [isListening, setIsListening] = React.useState(false);
    const [circles, setCircles] = React.useState<Circle[]>([]);
    const lastAdded = React.useRef(0);

    const createCircle = React.useCallback((x: number, y: number) => {
      const w = innerRef.current?.offsetWidth || 1;
      const pct = (x / w) * 100;
      const color = `linear-gradient(to right, var(--circle-start, #7c6eff) ${pct}%, var(--circle-end, #5cbdb9) ${pct}%)`;
      setCircles((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), x, y, color, fadeState: null },
      ]);
    }, []);

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
        if (!isListening) return;
        const now = Date.now();
        if (now - lastAdded.current < 90) return;
        lastAdded.current = now;
        const rect = e.currentTarget.getBoundingClientRect();
        createCircle(e.clientX - rect.left, e.clientY - rect.top);
      },
      [isListening, createCircle],
    );

    React.useEffect(() => {
      const timers: number[] = [];
      circles.forEach((c) => {
        if (c.fadeState !== null) return;
        timers.push(
          window.setTimeout(() => {
            setCircles((prev) =>
              prev.map((p) => (p.id === c.id ? { ...p, fadeState: "in" } : p)),
            );
          }, 0),
          window.setTimeout(() => {
            setCircles((prev) =>
              prev.map((p) => (p.id === c.id ? { ...p, fadeState: "out" } : p)),
            );
          }, 900),
          window.setTimeout(() => {
            setCircles((prev) => prev.filter((p) => p.id !== c.id));
          }, 2000),
        );
      });
      return () => timers.forEach((t) => window.clearTimeout(t));
    }, [circles]);

    return (
      <button
        ref={innerRef}
        data-hover
        onPointerEnter={() => setIsListening(true)}
        onPointerLeave={() => setIsListening(false)}
        onPointerMove={handlePointerMove}
        className={cn(
          // Apple liquid-glass shell
          "group relative isolate overflow-hidden rounded-full",
          "border border-white/15 bg-white/[0.06] px-7 py-3 text-sm font-medium text-white",
          "backdrop-blur-xl backdrop-saturate-150",
          "shadow-[0_6px_24px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.4)]",
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25",
          "hover:shadow-[0_12px_40px_-10px_rgba(124,110,255,0.55),inset_0_1px_0_rgba(255,255,255,0.3)]",
          "active:translate-y-0 active:scale-[0.98]",
          className,
        )}
        {...props}
      >
        {/* trailing circles layer */}
        <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full">
          {circles.map(({ id, x, y, color, fadeState }) => (
            <span
              key={id}
              className={cn(
                "absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen blur-md transition-all duration-700 ease-out",
                fadeState === "in" && "opacity-90 scale-150",
                fadeState === "out" && "opacity-0 scale-[3]",
                fadeState === null && "opacity-0 scale-100",
              )}
              style={{ left: x, top: y, background: color }}
            />
          ))}
        </span>
        {/* top sheen */}
        <span className="pointer-events-none absolute inset-x-2 top-px h-px rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        {/* content */}
        <span className="relative z-10 inline-flex items-center gap-2 tracking-wide">
          {children}
        </span>
      </button>
    );
  },
);

HoverButton.displayName = "HoverButton";

export { HoverButton };
