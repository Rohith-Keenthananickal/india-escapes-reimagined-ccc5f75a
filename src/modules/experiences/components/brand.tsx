import { useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Brand primitives from the TriphavenCo brand guide ("triphaven branding.pdf"):
 * pill labels in Primary / Secondary colours and the topographic contour texture.
 */

type PillTone = 'teal' | 'sun' | 'deep' | 'glass' | 'soft';

const PILL_TONES: Record<PillTone, string> = {
  // Guide: #1F1F1F text on #2BB0BB / #FFD26E for contrast.
  teal: 'bg-exp-teal text-exp-ink',
  sun: 'bg-exp-sun text-exp-ink',
  deep: 'bg-exp-deep text-white',
  glass: 'border border-white/20 bg-white/10 text-white backdrop-blur-md',
  soft: 'border border-exp-teal/30 bg-exp-teal/10 text-exp-deep',
};

export const BrandPill = ({
  tone = 'teal',
  className,
  children,
}: {
  tone?: PillTone;
  className?: string;
  children: ReactNode;
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-heading text-xs font-semibold tracking-wide sm:text-[13px]',
      PILL_TONES[tone],
      className
    )}
  >
    {children}
  </span>
);

/** Deterministic pseudo-random so the pattern is identical on every render / SSR. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/**
 * Topographic contour lines, as used behind the brand guide's typography pages.
 * Purely decorative; colour comes from `currentColor`.
 */
export const ContourPattern = ({ className, seed = 1, rings = 9 }: { className?: string; seed?: number; rings?: number }) => {
  const paths = useMemo(() => {
    const centres = [
      { x: 180 + rand(seed) * 120, y: 160 + rand(seed + 1) * 80 },
      { x: 820 + rand(seed + 2) * 120, y: 420 + rand(seed + 3) * 120 },
    ];
    const out: string[] = [];
    centres.forEach((c, ci) => {
      const phase = rand(seed + ci * 7) * Math.PI * 2;
      for (let k = 1; k <= rings; k++) {
        const base = 38 * k;
        const pts: string[] = [];
        const steps = 64;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          const wobble = 1 + 0.16 * Math.sin(3 * t + phase + k * 0.35) + 0.08 * Math.sin(5 * t - phase + k * 0.2);
          const r = base * wobble;
          pts.push(`${(c.x + Math.cos(t) * r * 1.25).toFixed(1)},${(c.y + Math.sin(t) * r).toFixed(1)}`);
        }
        out.push(`M${pts.join(' L')}Z`);
      }
    });
    return out;
  }, [seed, rings]);

  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
};
