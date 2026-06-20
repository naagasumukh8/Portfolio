"use client";

import { Suspense, lazy, useRef, forwardRef, useImperativeHandle } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));

export interface SplineSceneRef {
  emitEvent: (eventName: string, targetName?: string) => void;
  getApp: () => unknown;
}

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (spline: unknown) => void;
}

export const SplineScene = forwardRef<SplineSceneRef, SplineSceneProps>(function SplineScene(
  { scene, className, onLoad },
  ref,
) {
  const appRef = useRef<unknown>(null);

  useImperativeHandle(ref, () => ({
    emitEvent(eventName: string, targetName?: string) {
      const app = appRef.current as {
        findObjectByName?: (name: string) => unknown;
        emitEvent: (eventName: string, target?: unknown) => void;
      };
      if (!app) return;
      try {
        if (targetName && app.findObjectByName) {
          const obj = app.findObjectByName(targetName);
          if (obj) app.emitEvent(eventName, obj);
          else app.emitEvent(eventName);
        } else {
          app.emitEvent(eventName);
        }
      } catch {
        // ignore — scene may not expose this event
      }
    },
    getApp() {
      return appRef.current;
    },
  }));

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={(spline) => {
          appRef.current = spline;
          onLoad?.(spline);
        }}
      />
    </Suspense>
  );
});
