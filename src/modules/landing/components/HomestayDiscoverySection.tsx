import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HomestayFilters from '@/components/HomestayFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { HomestayCard } from './HomestayCard';
import { useLandingProperties } from '../hooks/useLandingProperties';
import type { FilterState, LandingPropertyCard } from '../types/landing.types';

export const HomestayDiscoverySection = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: 'all',
    filters: [],
    sortBy: 'popularity',
  });

  const { data, isLoading, isError, error, refetch } = useLandingProperties({
    page: 1,
    limit: 20,
    verification_status: ['APPROVED']
  });

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
        case 'newest':
          return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
        default: // popularity
          return b.reviews - a.reviews;
      }
    });
  }, [data?.cards, activeFilters]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Handpicked Kerala Homestays
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your next story starts in a Kerala home
          </h2>
          <p className="text-gray-600 mt-2 text-base max-w-2xl">
            Live with welcoming host families, savor traditional homemade meals, and experience true God's Own Country culture.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <HomestayFilters onFiltersChange={handleFiltersChange} />

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-gray-200 overflow-hidden bg-white p-4 space-y-3">
              <Skeleton className="w-full h-48 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center my-8 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Unable to load homestays</h3>
          <p className="text-sm text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Could not connect to the backend server at localhost:8000.'}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-rose-300 text-rose-700 hover:bg-rose-100 gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        </div>
      )}

      {/* Property Cards Grid */}
      {!isLoading && !isError && (
        <>
          {displayedProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mt-6 p-8">
              <p className="text-gray-500 text-lg font-medium">No homestays found matching your selected filters.</p>
              <Button
                variant="outline"
                className="mt-4"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {displayedProperties.map((property) => (
                <HomestayCard
                  key={property.id}
                  property={property}
                  isLiked={likedProperties.includes(property.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              variant="outline"
              asChild
              className="px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-yellow-50 hover:border-pink-300 hover:text-pink-700"
            >
              <Link to="/properties">View all Kerala homestays ({data?.pagination?.total || displayedProperties.length}+)</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default HomestayDiscoverySection;
