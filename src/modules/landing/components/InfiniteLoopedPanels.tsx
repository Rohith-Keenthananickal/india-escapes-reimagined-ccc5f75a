import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface DestinationPanel {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  rating: number;
  staysCount: number;
  image: string;
}

const DESTINATIONS: DestinationPanel[] = [
  {
    id: 'munnar',
    name: 'Munnar',
    tagline: 'Misty tea gardens & cool hill station homestays',
    badge: 'Hill Retreats',
    rating: 4.9,
    staysCount: 42,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  },
  {
    id: 'alappuzha',
    name: 'Alleppey (Alappuzha)',
    tagline: 'Venice of the East & backwater canal villas',
    badge: 'Backwaters',
    rating: 4.95,
    staysCount: 56,
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600&h=400&fit=crop',
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    tagline: 'Emerald rainforests, waterfalls & treehouses',
    badge: 'Eco Living',
    rating: 4.88,
    staysCount: 38,
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&h=400&fit=crop',
  },
  {
    id: 'varkala',
    name: 'Varkala',
    tagline: 'Cliffside sea views & golden Arabian coast',
    badge: 'Coastal Escapes',
    rating: 4.85,
    staysCount: 29,
    image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=600&h=400&fit=crop',
  },
  {
    id: 'fort-kochi',
    name: 'Fort Kochi',
    tagline: 'Colonial heritage, spice markets & Chinese fishing nets',
    badge: 'Culture & Art',
    rating: 4.92,
    staysCount: 45,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
  },
  {
    id: 'thekkady',
    name: 'Thekkady',
    tagline: 'Periyar wildlife, spice plantations & bamboo rafting',
    badge: 'Wildlife & Spice',
    rating: 4.86,
    staysCount: 31,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop',
  },
  {
    id: 'kumarakom',
    name: 'Kumarakom',
    tagline: 'Vembanad lake serenity & bird sanctuary walks',
    badge: 'Lake Hideaways',
    rating: 4.91,
    staysCount: 27,
    image: 'https://www.tusktravel.com/blog/wp-content/uploads/2022/03/Kerala-kumarakom-Place.jpg',
  },
  {
    id: 'kovalam',
    name: 'Kovalam',
    tagline: 'Lighthouse beach & traditional Ayurvedic wellness',
    badge: 'Ayurveda & Sun',
    rating: 4.82,
    staysCount: 34,
    image: 'https://cdn.guidetour.in/wp-content/uploads/2018/01/Kovalam-Tourist-Places.jpg.webp',
  },
];

export const InfiniteLoopedPanels = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isHoveredRef = useRef(false);
  const navigate = useNavigate();

  // Duplicate list to achieve infinite seamless loop
  const duplicatedList = [...DESTINATIONS, ...DESTINATIONS];

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      // Calculate total width of one half of the duplicated list
      const singleSetWidth = track.scrollWidth / 2;

      // Infinite loop animation using GSAP
      tweenRef.current = gsap.to(track, {
        x: -singleSetWidth,
        duration: 36,
        ease: 'none',
        repeat: -1,
      });

      // Interactive scroll speed scrub (smooth acceleration with user scroll)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (!tweenRef.current || isHoveredRef.current) return;
          const velocity = Math.abs(self.getVelocity());
          // Boost timeScale proportionally with velocity, then smoothly glide back to 1
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
    { scope: containerRef }
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
      {/* Header section */}
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

      {/* Infinite Horizontal Running Track */}
      <div
        className="w-full overflow-hidden select-none cursor-pointer py-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={trackRef} className="flex gap-5 w-max pl-4 py-2">
          {duplicatedList.map((dest, index) => (
            <div
              key={`${dest.id}-${index}`}
              onClick={() => navigate(`/properties?destination=${encodeURIComponent(dest.name.split(' ')[0])}`)}
              className="infinite-panel-card group relative w-72 sm:w-80 h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200/80 hover:border-teal-400/50 bg-white transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1.5 hover:z-20 shrink-0 flex flex-col justify-between"
            >
              {/* Background Photo */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/75 transition-colors duration-300" />
              </div>

              {/* Top Badges */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm border-0 font-semibold text-xs shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {dest.badge}
                </Badge>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold border border-white/20 transition-transform duration-300 group-hover:scale-105">
                  <Star className="w-3.5 h-3.5 fill-[#FFD26E] text-[#FFD26E]" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              {/* Bottom Content */}
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
    </div>
  );
};

export default InfiniteLoopedPanels;
