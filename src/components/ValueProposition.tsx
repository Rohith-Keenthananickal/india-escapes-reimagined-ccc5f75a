import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  HeartHandshake,
  Leaf,
  Users,
  Landmark,
  ShieldCheck,
  Globe2,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const mainValues = [
  {
    icon: Sparkles,
    title: 'Authentic Kerala Living',
    subtitle: 'Beyond Hotels & Resorts',
    description:
      'We connect you directly with welcoming local families. Savor homemade traditional cuisine, partake in local customs, and experience the warmth of God’s Own Country as a cherished personal guest.',
    color: 'bg-amber-100 text-[#D4A237]',
    accentGlow: 'from-[#FFD26E]/20',
    tag: 'Community First',
  },
  {
    icon: HeartHandshake,
    title: 'Homes with a Heart',
    subtitle: 'Curated & 100% Verified',
    description:
      'Every homestay is an authentic ancestral house, plantation villa, or canal-side cottage with personal stories. You are hosted by real families who share their heritage, spaces, and warm smiles.',
    color: 'bg-teal-100 text-[#1A8491]',
    accentGlow: 'from-[#2BB0BB]/20',
    tag: 'Verified Hosts',
  },
  {
    icon: Leaf,
    title: 'Travel That Gives Back',
    subtitle: 'Sustainable & Low-Impact',
    description:
      'Your booking directly supports local village economies and preserves Kerala’s natural heritage. We partner with homestays practicing rainwater harvesting, solar power, and organic farming.',
    color: 'bg-emerald-100 text-emerald-600',
    accentGlow: 'from-emerald-300/20',
    tag: 'Eco-Conscious',
  },
];

const highlights = [
  {
    icon: <Leaf className="w-6 h-6 text-emerald-500" aria-label="Eco-Friendly" />,
    title: 'Eco-Friendly Practices',
    badge: 'Green Living',
    quote:
      '“Our hosts practice rainwater harvesting, solar energy, composting, and farm-to-table organic dining to protect Kerala’s delicate ecology.”',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: <Users className="w-6 h-6 text-[#1A8491]" aria-label="Family Favorite" />,
    title: 'Family & Elder Friendly',
    badge: 'Safe & Spacious',
    quote:
      '“Private gardens, spacious living rooms, accessible ground floors, and personalized home-cooked meals make this ideal for multigenerational families.”',
    color: 'bg-teal-50 text-[#1A8491] border-teal-200',
  },
  {
    icon: <Landmark className="w-6 h-6 text-[#D4A237]" aria-label="Heritage Stays" />,
    title: 'Architectural Heritage',
    badge: 'Timeless Charm',
    quote:
      '“Live inside classic Nalukettu architecture with open courtyards, teakwood carvings, and centuries of Kerala coastal history.”',
    color: 'bg-amber-50 text-[#D4A237] border-amber-200',
  },
];

const ValueProposition = () => {
  const containerRef = useRef<HTMLElement>(null);
  const sdgTrackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Coordinated timeline for all cards in this section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      tl.fromTo(
        '.value-card',
        { y: 35, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'opacity,transform,scale',
        }
      ).fromTo(
        '.highlight-card',
        { y: 25, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'opacity,transform,scale',
        },
        '-=0.3'
      );

      // 3. Interactive 3D mouse tilt on all value and highlight cards
      const allTiltCards = gsap.utils.toArray<HTMLElement>('.tilt-card');
      const cleanups: (() => void)[] = [];

      allTiltCards.forEach((card) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / (rect.height / 2)) * 6;
          const rotateY = (x / (rect.width / 2)) * 6;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 900,
            duration: 0.25,
            ease: 'power1.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.4,
            ease: 'power2.out',
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        cleanups.push(() => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        });
      });

      // 4. Infinite Smooth GSAP Marquee for UN SDG Icons (using xPercent so it works regardless of image load timing)
      const track = sdgTrackRef.current;
      if (track) {
        gsap.to(track, {
          xPercent: -50,
          duration: 28,
          ease: 'none',
          repeat: -1,
        });
      }

      // 5. Ensure trigger calculation stays accurate even as preceding async sections load
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      cleanups.push(() => clearTimeout(refreshTimer));

      return () => {
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full py-12 sm:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#1A8491] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2BB0BB]" /> The TriphavenCo Difference
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading text-gray-900 tracking-tight leading-[1.15]">
            Why Choose Kerala Homestays?
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 mt-2 sm:mt-3 font-normal">
            Immerse in genuine Kerala hospitality where hosts become family and stays become lifelong memories.
          </p>
        </div>

        {/* 3 Main Value Pillar Cards with 3D Tilt */}
        <div
          className="value-cards-grid grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-10 sm:mb-16"
          style={{ perspective: 1200 }}
        >
          {mainValues.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="value-card tilt-card group relative bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/90 shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background Ambient Glow */}
                <div
                  className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${item.accentGlow} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#1A8491] mb-3 sm:mb-4">
                    {item.subtitle}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-[#1A8491] group-hover:text-[#2BB0BB] transition-colors">
                  <span>Discover authentic hosts</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Highlight Testimonial Quotes with 3D Tilt */}
        <div
          className="highlight-cards-grid grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20"
          style={{ perspective: 1200 }}
        >
          {highlights.map((h) => (
            <div
              key={h.title}
              className="highlight-card tilt-card group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-200/80 hover:border-[#2BB0BB]/50 shadow-sm hover:shadow-lg transition-[box-shadow,border-color] duration-300 flex flex-col justify-between"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    {h.icon}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold font-heading text-gray-900">
                      {h.title}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                      {h.badge}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                  {h.quote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* UN 9 Sustainable Development Goals Banner with Infinite Animated Marquee */}
        <div className="rounded-3xl bg-gradient-to-br from-teal-900 via-[#1A8491] to-teal-950 p-6 sm:p-8 md:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            <div className="lg:col-span-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#FFD26E] text-xs font-bold mb-3 sm:mb-4">
                <Globe2 className="w-3.5 h-3.5" />
                <span>United Nations Ally</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug mb-2 sm:mb-3">
                Committed to 9 Sustainable Development Goals
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6 font-light">
                TriphavenCo actively drives responsible tourism, empowers rural women hosts, fosters clean water preservation, and protects fragile backwater biodiversity across Kerala.
              </p>

              <a
                href="https://sdgs.un.org/goals"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD26E] hover:bg-[#ffe08e] text-gray-950 text-xs font-bold shadow-md transition-transform hover:scale-105"
              >
                <span>Explore UN SDG Goals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Seamless Infinite Looped SDG Icons Track */}
            <div className="lg:col-span-7 overflow-hidden py-2 select-none">
              <div ref={sdgTrackRef} className="sdg-marquee-track flex gap-4 w-max">
                {[...Array(17), ...Array(17)].map((_, idx) => {
                  const num = ((idx % 17) + 1).toString().padStart(2, '0');
                  return (
                    <div
                      key={`sdg-${idx}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 p-1.5 shadow-md shrink-0 transition-transform hover:scale-110"
                    >
                      <img
                        src={`/sgdicons/E_GIF_${num}.gif`}
                        alt={`Sustainable Development Goal ${num}`}
                        className="w-full h-full object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
