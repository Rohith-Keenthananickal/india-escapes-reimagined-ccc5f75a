import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Hotel,
  MapPin,
  Smile,
  Users,
  Sparkles,
  Award,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLandingStats } from '../hooks/useLandingStats';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StatItem {
  label: string;
  sublabel: string;
  value: number;
  suffix: string;
  icon: typeof Hotel;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
}

const YEARS_OF_TRUST = 10;

export const AnimatedStats = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: stats, isLoading } = useLandingStats();

  const STATS: StatItem[] = useMemo(
    () => [
      {
        label: 'Verified Homestays',
        sublabel: 'Across 14 Districts',
        value: stats?.verified_homestays ?? 0,
        suffix: '+',
        icon: Hotel,
        iconBg: 'bg-teal-50 text-[#1A8491]',
        iconColor: 'text-[#1A8491]',
        accentBorder: 'hover:border-[#2BB0BB]/60',
      },
      {
        label: 'Scenic Destinations',
        sublabel: 'Backwaters to Hills',
        value: stats?.scenic_destinations ?? 0,
        suffix: '+',
        icon: MapPin,
        iconBg: 'bg-teal-50 text-[#1A8491]',
        iconColor: 'text-[#1A8491]',
        accentBorder: 'hover:border-[#2BB0BB]/60',
      },
      {
        label: 'Delighted Travelers',
        sublabel: 'Confirmed stays & guests',
        value: stats?.delighted_travelers ?? 0,
        suffix: '+',
        icon: Smile,
        iconBg: 'bg-emerald-50 text-emerald-600',
        iconColor: 'text-emerald-600',
        accentBorder: 'hover:border-emerald-400/60',
      },
      {
        label: 'Warm Local Hosts',
        sublabel: '100% ID Verified',
        value: stats?.warm_local_hosts ?? 0,
        suffix: '+',
        icon: Users,
        iconBg: 'bg-teal-50 text-[#1A8491]',
        iconColor: 'text-[#1A8491]',
        accentBorder: 'hover:border-[#2BB0BB]/60',
      },
      {
        label: 'Authentic Escapes',
        sublabel: 'Village Walks & Treks',
        value: stats?.authentic_escapes ?? 0,
        suffix: '+',
        icon: Sparkles,
        iconBg: 'bg-amber-50 text-[#D4A237]',
        iconColor: 'text-[#D4A237]',
        accentBorder: 'hover:border-[#FFD26E]/80',
      },
      {
        label: 'Years of Trust',
        sublabel: 'Kerala Tourism Ally',
        value: YEARS_OF_TRUST,
        suffix: '+',
        icon: Award,
        iconBg: 'bg-amber-50 text-[#D4A237]',
        iconColor: 'text-[#D4A237]',
        accentBorder: 'hover:border-[#FFD26E]/80',
      },
    ],
    [stats]
  );

  useGSAP(
    () => {
      if (isLoading) return;

      const cards = gsap.utils.toArray<HTMLElement>('.stat-card');

      gsap.from(cards, {
        y: 40,
        opacity: 0,
        scale: 0.92,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
          once: true,
        },
      });

      cards.forEach((card) => {
        const valEl = card.querySelector<HTMLElement>('.stat-number-val');
        if (!valEl) return;

        const target = parseFloat(valEl.dataset.target || '0');
        const suffix = valEl.dataset.suffix || '';
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 2.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true,
          },
          onUpdate: () => {
            valEl.textContent = Math.round(counter.value).toLocaleString() + suffix;
          },
          onComplete: () => {
            valEl.textContent = target.toLocaleString() + suffix;
          },
        });

        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / (rect.height / 2)) * 8;
          const rotateY = (x / (rect.width / 2)) * 8;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 800,
            duration: 0.25,
            ease: 'power1.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    },
    { scope: containerRef, dependencies: [isLoading, stats] }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mt-6 sm:mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-150 bg-white p-3.5 sm:p-5 space-y-3">
            <Skeleton className="w-11 h-11 rounded-xl mx-auto" />
            <Skeleton className="h-7 w-16 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mt-6 sm:mt-10"
      style={{ perspective: 1200 }}
    >
      {STATS.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className={`stat-card group relative p-3.5 sm:p-5 rounded-2xl bg-white shadow-sm hover:shadow-xl border border-gray-150 ${stat.accentBorder} transition-shadow duration-300 flex flex-col items-center text-center cursor-default overflow-hidden select-none`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2BB0BB]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-radial-gradient from-teal-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${stat.iconBg} flex items-center justify-center mb-2.5 sm:mb-3.5 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div
              data-target={stat.value}
              data-suffix={stat.suffix}
              className={`stat-number-val text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold ${stat.iconColor} tracking-tight relative z-10`}
            >
              {stat.value.toLocaleString() + stat.suffix}
            </div>

            <div className="text-xs sm:text-sm font-bold text-gray-900 mt-1 sm:mt-1.5 leading-tight relative z-10">
              {stat.label}
            </div>

            <div className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1 font-medium leading-tight relative z-10">
              {stat.sublabel}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnimatedStats;
