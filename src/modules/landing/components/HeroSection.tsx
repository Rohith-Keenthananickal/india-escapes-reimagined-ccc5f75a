import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, MapPin, Star } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HERO_IMAGES = [
  'https://www.keralatourism.holiday/blog/wp-content/uploads/2024/11/Untitled-3.jpg',
  'https://t3.ftcdn.net/jpg/08/66/94/00/360_F_866940051_zYRBRlqHLSSWMM3Su2Mr0AiLDja8cQwM.jpg',
  'https://cdn.guidetour.in/wp-content/uploads/2018/01/Kovalam-Tourist-Places.jpg.webp',
  'https://www.tusktravel.com/blog/wp-content/uploads/2022/03/Kerala-kumarakom-Place.jpg',
];

const POPULAR_DESTINATIONS = [
  { name: 'Munnar Hills', query: 'Munnar' },
  { name: 'Alleppey Backwaters', query: 'Alleppey' },
  { name: 'Wayanad Rainforests', query: 'Wayanad' },
  { name: 'Fort Kochi Heritage', query: 'Kochi' },
  { name: 'Varkala Cliffs', query: 'Varkala' },
];

export const HeroSection = () => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const floatingCard1Ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(pillRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.85,
        duration: 0.7,
      });

      tl.from(
        headlineRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
        },
        '-=0.3'
      );

      tl.from(
        subheadRef.current,
        {
          y: 25,
          opacity: 0,
          duration: 0.7,
        },
        '-=0.4'
      );

      tl.from(
        tagsRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
        },
        '-=0.3'
      );

      tl.from(
        floatingCard1Ref.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );

      gsap.to(bgImageRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(floatingCard1Ref.current, {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] overflow-hidden flex items-center justify-center">
        <div ref={bgImageRef} className="absolute inset-0 -top-12 -bottom-12 w-full h-[120%]">
          {HERO_IMAGES.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt="Kerala landscape background"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
                idx === currentHeroIndex
                  ? 'opacity-100 scale-100 z-0'
                  : 'opacity-0 scale-105 z-0'
              }`}
              draggable={false}
              aria-hidden={idx !== currentHeroIndex}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35 z-10" />

        <div className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-4xl mx-auto py-10 sm:py-16">
          <div
            ref={pillRef}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6 shadow-xl max-w-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD26E] shrink-0" />
            <span className="truncate">Community tourism across Kerala</span>
          </div>

          <h1
            ref={headlineRef}
            className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-5 tracking-tight leading-[1.15]"
          >
            Hyperlocal Experiences &amp; Family Stays
          </h1>

          <p
            ref={subheadRef}
            className="text-sm sm:text-lg md:text-xl text-[#FFD26E] max-w-2xl mx-auto font-semibold leading-relaxed mb-5 sm:mb-6"
          >
            Community Safety Net
          </p>

          <div
            ref={tagsRef}
            className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto"
          >
            <span className="text-xs text-white/70 font-medium mr-1">Popular destinations:</span>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() =>
                  navigate(`/properties?destination=${encodeURIComponent(dest.query)}`)
                }
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-[#FFD26E]" />
                <span>{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={floatingCard1Ref}
          onClick={() => navigate('/properties?destination=Alleppey')}
          className="hidden md:flex absolute top-36 right-8 lg:right-16 z-20 items-center gap-3 p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-xs text-left cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=120&h=120&fit=crop"
              alt="Alleppey Homestay"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1 font-bold text-gray-900">
              <Star className="w-3.5 h-3.5 fill-[#FFD26E] text-[#FFD26E]" />
              <span>Alleppey Canal Stay</span>
            </div>
            <p className="text-gray-500 text-[11px] truncate">Explore local family stays</p>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentHeroIndex ? 'w-8 bg-[#FFD26E]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
