import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HomestayFilters from '@/components/HomestayFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { HomestayCard } from './HomestayCard';
import { useLandingProperties, DEFAULT_LANDING_FILTERS } from '../hooks/useLandingProperties';
import type { FilterState, LandingPropertyCard } from '../types/landing.types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const HomestayDiscoverySection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: 'all',
    filters: [],
    sortBy: 'popularity',
  });

  const { data, isLoading, isError, error, refetch } = useLandingProperties(DEFAULT_LANDING_FILTERS);

  const toggleLike = (id: number) => {
    setLikedProperties((prev) =>
      prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]
    );
  };

  const handleFiltersChange = (newFilters: { category: string; filters: string[]; sortBy: string }) => {
    setActiveFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Filter and sort the fetched properties in memory
  const displayedProperties = useMemo(() => {
    const rawCards: LandingPropertyCard[] = data?.cards || [];

    // Filter
    const filtered = rawCards.filter((property) => {
      // Category filter
      if (activeFilters.category !== 'all' && property.region !== activeFilters.category) {
        return false;
      }

      // Feature filters
      if (activeFilters.filters.includes('budget') && property.price >= 4000) {
        return false;
      }
      if (activeFilters.filters.includes('eco') && !property.isEco) {
        return false;
      }
      if (activeFilters.filters.includes('activities') && property.amenities.length <= 2) {
        return false;
      }

      return true;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      switch (activeFilters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [data, activeFilters]);

  // GSAP animation on cards entrance
  useGSAP(
    () => {
      if (displayedProperties.length === 0) return;

      gsap.from('.homestay-card-item', {
        y: 35,
        opacity: 0,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.homestay-grid',
          start: 'top 85%',
        },
      });
    },
    { dependencies: [displayedProperties.length], scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 gap-3 sm:gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1F4F6] text-[#1A8491] border border-[#B6E5E9] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2BB0BB]" /> Handpicked Kerala Homestays
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 tracking-tight leading-snug">
            Your next story starts in a Kerala home
          </h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            Live with welcoming host families, savor traditional homemade meals, and experience true God's Own Country culture.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <HomestayFilters onFiltersChange={handleFiltersChange} totalResults={displayedProperties.length} />

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 overflow-hidden bg-white p-3.5 sm:p-4 space-y-3">
              <Skeleton className="w-full aspect-[4/3] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 sm:p-8 text-center my-8 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Unable to load homestays</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Could not connect to the backend server.'}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-rose-300 text-rose-700 hover:bg-rose-100 gap-2 rounded-xl text-xs sm:text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        </div>
      )}

      {/* Property Cards Grid */}
      {!isLoading && !isError && (
        <>
          {displayedProperties.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200 mt-6 p-6 sm:p-8">
              <p className="text-gray-500 text-sm sm:text-base font-medium">No homestays found matching your selected filters.</p>
              <Button
                variant="outline"
                className="mt-4 rounded-xl text-xs sm:text-sm"
                onClick={() =>
                  setActiveFilters({
                    category: 'all',
                    filters: [],
                    sortBy: 'popularity',
                  })
                }
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="homestay-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {displayedProperties.map((property) => (
                <div key={property.id} className="homestay-card-item w-full">
                  <HomestayCard
                    property={property}
                    isLiked={likedProperties.includes(property.id)}
                    onToggleLike={toggleLike}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Section Footer / View All Link */}
          <div className="text-center mt-8 sm:mt-12 px-2">
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto px-6 py-5 sm:px-8 sm:py-6 text-xs sm:text-sm md:text-base font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-teal-50 border-gray-300 hover:border-[#2BB0BB] text-[#1F1F1F] hover:text-[#1A8491] rounded-2xl"
            >
              <Link to="/properties">
                View all Kerala homestays ({data?.pagination?.total || displayedProperties.length}+)
              </Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default HomestayDiscoverySection;
