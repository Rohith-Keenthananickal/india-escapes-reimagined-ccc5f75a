import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Waves,
  Leaf,
  Sun,
  Snowflake,
  MapPin,
  ArrowRight,
  Sparkles,
  ImageOff,
} from 'lucide-react';
import { useSeasonalProperties } from '@/modules/landing/hooks/useSeasonalProperties';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface SeasonMeta {
  id: string;
  apiValue: string;
  title: string;
  subtitle: string;
  icon: typeof Sun;
  activeColor: string;
  badgeBg: string;
}

const SEASONS: SeasonMeta[] = [
  {
    id: 'summer',
    apiValue: 'Summer',
    title: 'Summer Escapes',
    subtitle: 'Misty Hill Stations & Cool Estates (Mar - May)',
    icon: Sun,
    activeColor: 'bg-amber-500 text-white',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'monsoon',
    apiValue: 'Monsoon',
    title: 'Monsoon Magic',
    subtitle: 'Ayurvedic Rejuvenation & Lush Greenery (Jun - Aug)',
    icon: Waves,
    activeColor: 'bg-[#2BB0BB] text-white',
    badgeBg: 'bg-teal-100 text-[#1A8491] border-teal-200',
  },
  {
    id: 'onam',
    apiValue: 'Onam',
    title: 'Onam Harvest Specials',
    subtitle: 'Grand Sadhya Feasts & Boat Races (Aug - Sep)',
    icon: Leaf,
    activeColor: 'bg-emerald-600 text-white',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'winter',
    apiValue: 'Winter',
    title: 'Winter Holidays',
    subtitle: 'Pleasant Sun, Golden Sands & Campfires (Nov - Feb)',
    icon: Snowflake,
    activeColor: 'bg-sky-600 text-white',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
  },
];

export const SeasonalBooking = () => {
  const [activeTab, setActiveTab] = useState('summer');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const activeSeason = SEASONS.find((s) => s.id === activeTab) || SEASONS[0];
  const { data: properties, isLoading } = useSeasonalProperties(activeSeason.apiValue, 3);

  useGSAP(
    () => {
      if (!cardsGridRef.current || isLoading) return;

      const cards = gsap.utils.toArray<HTMLElement>('.seasonal-card');
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        { y: 35, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.09,
          ease: 'power3.out',
        }
      );

      cards.forEach((card) => {
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
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    },
    { dependencies: [activeTab, isLoading, properties?.length], scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-12 sm:py-20 bg-gray-50/70 border-y border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#1A8491] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2BB0BB]" /> Time Your Trip
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 tracking-tight">
            Book by Season & Festival
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">{activeSeason.subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {SEASONS.map((season) => {
            const Icon = season.icon;
            const isActive = activeTab === season.id;
            return (
              <button
                key={season.id}
                type="button"
                onClick={() => setActiveTab(season.id)}
                className={`relative px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm ${
                  isActive
                    ? `${season.activeColor} shadow-md scale-105`
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{season.title}</span>
              </button>
            );
          })}
        </div>

        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
          style={{ perspective: 1200 }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-gray-200 bg-white overflow-hidden p-0">
                <Skeleton className="w-full aspect-[16/10]" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              </div>
            ))
          ) : !properties || properties.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 sm:p-10 text-center">
              <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                No {activeSeason.title.toLowerCase()} stays tagged yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-4">
                Hosts mark seasonal experiences on their property details. Browse all Kerala homestays meanwhile.
              </p>
              <button
                type="button"
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A8491] hover:underline"
              >
                Explore all properties <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            properties.map((prop) => {
              const image = prop.images?.[0];
              const perk =
                prop.amenities?.[0] ||
                (prop.isCertified ? 'Verified Stay' : prop.classification !== 'UNCLASSIFIED' ? prop.classification : 'Seasonal Stay');

              return (
                <div
                  key={prop.id}
                  onClick={() => navigate(`/property/${prop.id}`)}
                  className="seasonal-card group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-200/90 hover:border-[#2BB0BB]/60 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <ImageOff className="w-8 h-8 mb-1" />
                        <span className="text-xs">No photo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <Badge
                      className={`absolute top-3.5 left-3.5 ${activeSeason.badgeBg} text-xs font-bold shadow-sm border`}
                    >
                      {perk}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2BB0BB]" />
                      <span className="truncate">{prop.location}</span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#1A8491] transition-colors mb-4 line-clamp-1">
                      {prop.title}
                    </h3>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        {prop.price > 0 ? (
                          <>
                            <span className="text-xl font-extrabold text-[#1A8491]">
                              ₹{prop.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">/ night</span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-[#1A8491]">On request</span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A8491] group-hover:translate-x-1 transition-transform">
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-[#1A8491] shrink-0" />
            <span>
              <strong>Kerala Cultural Highlights:</strong> Thrissur Pooram (Apr-May) • Nehru Trophy Boat Race
              (Aug) • Onam Celebrations (Aug-Sep) • Cochin Carnival (Dec)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalBooking;
