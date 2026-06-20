'use client';
import { cn } from '@/lib/utils';
import React from 'react';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  theme?: 'light' | 'dark';
};

export function DottedSurface({ className, theme = 'dark', ...props }: DottedSurfaceProps) {
  const dot = theme === 'dark' ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.32)';

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${dot} 1.2px, transparent 1.6px)`,
        backgroundSize: '34px 34px',
        transform: 'perspective(900px) rotateX(58deg) translateY(-18%) scale(1.35)',
        animation: 'dottedSurfaceDrift 14s ease-in-out infinite alternate',
        maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 74%, transparent)',
      }}
      {...props}
    >
      <style>{`@keyframes dottedSurfaceDrift { from { background-position: 0 0; } to { background-position: 68px 34px; } }`}</style>
    </div>
  );
}
