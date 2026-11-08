import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight, MapPin, Sparkles } from 'lucide-react';

gsap.registerPlugin(useGSAP);

interface Slide {
  id: string;
  image: string;
  destination: string;
  district: string;
  caption: string;
  description: string;
  highlight: string;
  tag: string;
}

const SLIDES: Slide[] = [
  {
    id: 'backwaters',
    image:
      'https://www.tourmyholiday.com/upload/blogimage/kumarakom-backwaters-kumarakom-kerala-attr-hero-1.jpg',
    destination: 'Kumarakom & Alleppey',
    district: 'Alappuzha',
    caption: 'Backwater Bliss & Houseboat Canals',
    description:
      'Wake up to gentle ripples, swaying coconut palms, and authentic breakfast prepared by warm canal-side hosts.',
    highlight: 'Canal Kayaking • Traditional Karimeen Meals',
    tag: 'Serene Waters',
  },
  {
    id: 'culture',
    image:
      'https://cochinculturalcentre.org/wp-content/uploads/2025/06/Highlights-from-Our-Recent-Cultural-Festivals-and-Performances.webp',
    destination: 'Fort Kochi Heritage',
    district: 'Ernakulam',
    caption: 'Colonial Architecture & Cultural Tapestry',
    description:
      'Stroll through ancient spice avenues, Dutch and Portuguese villas, and live Kathakali cultural performances.',
    highlight: 'Chinese Fishing Nets • Heritage Homestays',
    tag: 'Heritage & Art',
  },
  {
    id: 'hills',
    image: 'https://www.sreestours.com/blog/wp-content/uploads/2022/07/Munnar.jpg',
    destination: 'Munnar Tea Highlands',
    district: 'Idukki',
    caption: 'Misty Mountains & Emerald Tea Valleys',
    description:
      'Breathe cool mountain air in private hillside estates surrounded by sprawling tea plantations and cascading waterfalls.',
    highlight: 'Tea Tasting • Anamudi Peak Treks',
    tag: 'Cool Highlands',
  },
  {
    id: 'coast',
    image: 'https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/04/Varkala-Beach.webp',
    destination: 'Varkala Red Cliffs',
    district: 'Thiruvananthapuram',
    caption: 'Dramatic Cliffside Ocean Views',
    description:
      'Unwind above the Arabian Sea with panoramic cliff views, natural mineral springs, and yoga retreats at sunset.',
    highlight: 'Cliff Cafes • Sunset Meditation',
    tag: 'Coastal Escapes',
  },
];

export const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const isHoveredRef = useRef(false);
  const navigate = useNavigate();

  const currentSlide = SLIDES[currentIndex];

  // Start / Reset the GSAP slide timer progress bar
  const startProgress = () => {
    if (!progressBarRef.current) return;

    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }

    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left' });

    progressTweenRef.current = gsap.to(progressBarRef.current, {
      scaleX: 1,
      duration: 6,
      ease: 'none',
      onComplete: () => {
        if (!isHoveredRef.current) {
          goToNext();
        } else {
          // Keep waiting until unhovered
          startProgress();
        }
      },
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  // Re-run slide entrance timeline whenever index changes
  useGSAP(
    () => {
      // 1. Ken Burns zoom on active background photo
      gsap.fromTo(
        '.banner-slide-active-img',
        { scale: 1.05 },
        { scale: 1.15, duration: 6, ease: 'none' }
      );

      // 2. Staggered text reveal
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.banner-slide-tag',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      )
        .fromTo(
          '.banner-slide-title',
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.3'
        )
        .fromTo(
          '.banner-slide-desc',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          '.banner-slide-cta',
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5 },
          '-=0.3'
        );

      startProgress();
    },
    { dependencies: [currentIndex], scope: containerRef }
  );

  // Magnetic button hover effect setup
  useGSAP(
    () => {
      const buttons = gsap.utils.toArray<HTMLElement>('.magnetic-btn');

      buttons.forEach((btn) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
        };

        const handleMouseLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);
      });
    },
    { scope: containerRef }
  );

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (progressTweenRef.current) {
      progressTweenRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (progressTweenRef.current) {
      progressTweenRef.current.resume();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-[440px] sm:h-[500px] md:h-[560px] overflow-hidden rounded-3xl shadow-xl border border-gray-200/80 bg-gray-900 group"
    >
      {/* Background Slides Stack */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              className={`w-full h-full object-cover select-none ${
                isActive ? 'banner-slide-active-img' : ''
              }`}
            />
            {/* Cinematic Multilayer Gradients for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/40 to-transparent" />
          </div>
        );
      })}

      {/* Floating Active Content (Scoped to current slide) */}
      <div className="relative z-20 h-full flex flex-col justify-end p-5 sm:p-10 md:p-14 max-w-3xl pb-14 sm:pb-16">
        {/* Destination Tag */}
        <div className="banner-slide-tag inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#FFD26E] text-[11px] sm:text-xs font-bold mb-2.5 sm:mb-4 shadow-sm w-fit">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFD26E]" />
          <span>{currentSlide.tag}</span>
          <span className="text-white/40">•</span>
          <span className="text-white font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#2BB0BB]" /> {currentSlide.district}
          </span>
        </div>

        {/* Headline */}
        <h3 className="banner-slide-title text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
          {currentSlide.caption}
        </h3>

        {/* Description */}
        <p className="banner-slide-desc text-xs sm:text-base md:text-lg text-white/90 leading-relaxed mb-4 sm:mb-6 font-light max-w-2xl line-clamp-2 sm:line-clamp-none">
          {currentSlide.description}
        </p>

        {/* Action CTA & Highlights */}
        <div className="banner-slide-cta flex flex-wrap items-center gap-3 sm:gap-4">
          <Button
            onClick={() =>
              navigate(`/properties?destination=${encodeURIComponent(currentSlide.destination)}`)
            }
            className="magnetic-btn px-4 py-3 sm:px-6 sm:py-5 rounded-xl bg-gradient-to-r from-[#2BB0BB] to-[#1A8491] hover:from-[#1A8491] hover:to-[#146b76] text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-teal-500/20 transition-all flex items-center gap-2 group/btn"
          >
            <span>Explore {currentSlide.destination.split(' ')[0]} Stays</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>

          <span className="text-xs text-white/70 hidden sm:inline-block">
            {currentSlide.highlight}
          </span>
        </div>
      </div>

      {/* Slide Navigation Buttons (Magnetic on desktop, visible on mobile) */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous Slide"
        className="magnetic-btn absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 sm:bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToPrev}
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Next Slide"
        className="magnetic-btn absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 sm:bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToNext}
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>

      {/* Slide Thumbnails & Progress Bar at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Linear GSAP Progress Bar */}
        <div className="w-full h-1 bg-white/20">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#FFD26E] to-[#2BB0BB]"
          />
        </div>

        {/* Thumbnail Navigation Indicators */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-3 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  idx === currentIndex
                    ? 'w-10 bg-[#FFD26E]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                title={slide.destination}
                aria-label={`Slide ${idx + 1}: ${slide.destination}`}
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-white/70 tabular-nums">
            0{currentIndex + 1} / 0{SLIDES.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
