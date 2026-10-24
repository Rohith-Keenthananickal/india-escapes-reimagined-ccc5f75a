import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { HomestayCard } from '@/modules/landing/components/HomestayCard';
import { PropertyFiltersSidebar } from '../components/PropertyFiltersSidebar';
import { usePropertiesListing } from '../hooks/usePropertiesListing';

export const PropertyListingPage = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, error, refetch } = usePropertiesListing({
    page: 1,
    limit: 50,
  });

  const toggleLike = (id: number) => {
    setLikedProperties((prev) =>
      prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSortBy('popular');
    setPriceRange([0, 20000]);
    setSearchQuery('');
  };

  // Client-side filtering and sorting over the loaded backend properties
  const displayedProperties = useMemo(() => {
    const properties = data?.properties || [];

    const filtered = properties.filter((prop) => {
      // Price filter
      if (priceRange[0] > 0 || priceRange[1] < 20000) {
        if (prop.price > 0 && (prop.price < priceRange[0] || prop.price > priceRange[1])) {
          return false;
        }
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocation = prop.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation) {
          return false;
        }
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.reviews - a.reviews;
      }
    });
  }, [data?.properties, priceRange, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore All Kerala Homestays
          </h1>
          <p className="text-gray-600 mt-1">
            {isLoading
              ? 'Loading homestays from Heaven Connect...'
              : `${displayedProperties.length} authentic stays found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <PropertyFiltersSidebar
              sortBy={sortBy}
              onSortByChange={setSortBy}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onReset={handleReset}
            />
          </aside>

          {/* Listings Grid */}
          <section className="flex-1">
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {isError && !isLoading && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center my-8">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Failed to load homestays</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {error instanceof Error ? error.message : 'Backend connection error.'}
                </p>
                <Button onClick={() => refetch()} variant="outline" className="border-rose-300 text-rose-700">
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                {displayedProperties.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8">
                    <p className="text-gray-500 text-lg font-medium">No homestays match your active filters.</p>
                    <Button variant="outline" onClick={handleReset} className="mt-4">
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PropertyListingPage;
