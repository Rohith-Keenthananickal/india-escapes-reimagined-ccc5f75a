import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDestinationPanels } from '../hooks/useDestinationPanels';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const InfiniteLoopedPanels = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isHoveredRef = useRef(false);
  const navigate = useNavigate();
  const { data: destinations = [], isLoading } = useDestinationPanels();

  const duplicatedList = useMemo(() => {
    if (destinations.length === 0) return [];
    const copies = destinations.length < 4 ? 3 : 2;
    return Array.from({ length: copies }, () => destinations).flat();
  }, [destinations]);

  const loopCopies = destinations.length < 4 ? 3 : 2;

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || duplicatedList.length === 0) return;

      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }

      gsap.set(track, { x: 0 });
      const singleSetWidth = track.scrollWidth / loopCopies;
      if (!singleSetWidth || singleSetWidth <= 0) return;

      tweenRef.current = gsap.to(track, {
        x: -singleSetWidth,
        duration: Math.max(24, destinations.length * 4.5),
        ease: 'none',
        repeat: -1,
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (!tweenRef.current || isHoveredRef.current) return;
          const velocity = Math.abs(self.getVelocity());
          const speedMultiplier = Math.min(3.2, 1 + velocity / 1200);
          gsap.to(tweenRef.current, {
            timeScale: speedMultiplier,
            duration: 0.3,
            overwrite: 'auto',
            onComplete: () => {
              if (tweenRef.current && !isHoveredRef.current) {
                gsap.to(tweenRef.current, { timeScale: 1, duration: 1.2, ease: 'power1.out' });
              }
            },
          });
        },
      });
    },
    { scope: containerRef, dependencies: [duplicatedList.length, destinations.length, loopCopies] }
  );

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0, duration: 0.3, overwrite: 'auto' });
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6, overwrite: 'auto' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full py-14 bg-gradient-to-b from-white via-teal-50/25 to-white overflow-hidden border-y border-gray-150"
    >
      <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#1A8491] border border-teal-200/70 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2BB0BB]" /> Infinite Escapes Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
            Curated Kerala Destinations
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Hover over any region to pause & explore verified homestay collections.
          </p>
        </div>

        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A8491] hover:text-[#2BB0BB] hover:underline self-start sm:self-auto group"
        >
          <span>View all regions</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex gap-5 overflow-hidden px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-72 sm:w-80 h-96 rounded-3xl border border-gray-200 bg-white overflow-hidden shrink-0"
            >
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">No destinations with stays yet</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Destination panels appear here once approved homestays are listed in those places.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="w-full overflow-hidden select-none cursor-pointer py-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={trackRef} className="flex gap-5 w-max pl-4 py-2">
            {duplicatedList.map((dest, index) => (
              <div
                key={`${dest.id}-${index}`}
                onClick={() =>
                  navigate(`/properties?destination=${encodeURIComponent(dest.query)}`)
                }
                className="infinite-panel-card group relative w-72 sm:w-80 h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200/80 hover:border-teal-400/50 bg-white transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1.5 hover:z-20 shrink-0 flex flex-col justify-between"
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/75 transition-colors duration-300" />
                </div>

                <div className="relative z-10 p-4 flex items-center justify-between">
                  <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm border-0 font-semibold text-xs shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {dest.badge}
                  </Badge>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold border border-white/20 transition-transform duration-300 group-hover:scale-105">
                    <Star className="w-3.5 h-3.5 fill-[#FFD26E] text-[#FFD26E]" />
                    <span>{dest.rating}</span>
                  </div>
                </div>

                <div className="relative z-10 p-5 text-white space-y-2">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight leading-tight group-hover:text-[#FFD26E] transition-colors flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#2BB0BB] shrink-0" />
                      <span>{dest.name}</span>
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2 mt-1 leading-relaxed font-light">
                      {dest.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="font-medium text-white/90">
                      {dest.staysCount}+ verified homestays
                    </span>
                    <span className="font-semibold text-[#FFD26E] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfiniteLoopedPanels;
