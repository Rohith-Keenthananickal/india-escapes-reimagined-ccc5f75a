import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, CalendarDays, Users, MapPin } from 'lucide-react';
import { HomestayCard } from '@/modules/landing/components/HomestayCard';
import { PropertyFiltersSidebar } from '../components/PropertyFiltersSidebar';
import { usePropertiesListing } from '../hooks/usePropertiesListing';
import { useWishlistIdsQuery, useWishlistMutations } from '@/modules/wishlist';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';
import { format } from 'date-fns';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const toPlaceToken = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.split(',')[0].trim();
};

const parseCoord = (value: string | null): number | undefined => {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

export const PropertyListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageRef = useRef<HTMLDivElement>(null);

  const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');
  const getTomorrowStr = () => format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  const initialDestination =
    searchParams.get('destination') ||
    searchParams.get('district') ||
    searchParams.get('searchQuery') ||
    '';

  const { requireAuth } = useRequireAuth();
  const { data: likedProperties = [] } = useWishlistIdsQuery();
  const { toggleItem } = useWishlistMutations();
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [searchQuery, setSearchQuery] = useState(toPlaceToken(initialDestination));
  const [checkInDate, setCheckInDate] = useState(searchParams.get('checkIn') || getTodayStr());
  const [checkOutDate, setCheckOutDate] = useState(searchParams.get('checkOut') || getTomorrowStr());
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [latitude, setLatitude] = useState<number | undefined>(parseCoord(searchParams.get('lat')));
  const [longitude, setLongitude] = useState<number | undefined>(parseCoord(searchParams.get('lng')));
  const [radiusKm, setRadiusKm] = useState<number | undefined>(parseCoord(searchParams.get('radius')));
  const [segmentId, setSegmentId] = useState<number | undefined>(() => {
    const raw = Number(searchParams.get('segment_id'));
    return Number.isFinite(raw) && raw > 0 ? raw : undefined;
  });

  // Sync state when URL search parameters change externally
  useEffect(() => {
    const qSearch = toPlaceToken(
      searchParams.get('destination') ||
        searchParams.get('district') ||
        searchParams.get('searchQuery') ||
        ''
    );
    const qIn = searchParams.get('checkIn') || getTodayStr();
    const qOut = searchParams.get('checkOut') || getTomorrowStr();
    const qGuests = Number(searchParams.get('guests')) || 2;
    const qLat = parseCoord(searchParams.get('lat'));
    const qLng = parseCoord(searchParams.get('lng'));
    const qRadius = parseCoord(searchParams.get('radius'));
    const qSegmentRaw = Number(searchParams.get('segment_id'));
    const qSegment = Number.isFinite(qSegmentRaw) && qSegmentRaw > 0 ? qSegmentRaw : undefined;

    setSearchQuery((prev) => (prev !== qSearch ? qSearch : prev));
    setCheckInDate((prev) => (prev !== qIn ? qIn : prev));
    setCheckOutDate((prev) => (prev !== qOut ? qOut : prev));
    setGuests((prev) => (prev !== qGuests ? qGuests : prev));
    setLatitude((prev) => (prev !== qLat ? qLat : prev));
    setLongitude((prev) => (prev !== qLng ? qLng : prev));
    setRadiusKm((prev) => (prev !== qRadius ? qRadius : prev));
    setSegmentId((prev) => (prev !== qSegment ? qSegment : prev));
  }, [searchParams]);

  // Keep URL query params synchronized when user modifies filters in the sidebar
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    const placeToken = toPlaceToken(searchQuery);
    if (placeToken) {
      if (params.get('destination') !== placeToken) {
        params.set('destination', placeToken);
        changed = true;
      }
      // Clear legacy/district params so short destination is the single source of truth
      if (params.has('searchQuery')) {
        params.delete('searchQuery');
        changed = true;
      }
      if (params.has('district')) {
        params.delete('district');
        changed = true;
      }
    } else if (params.has('destination') || params.has('searchQuery') || params.has('district')) {
      params.delete('destination');
      params.delete('searchQuery');
      params.delete('district');
      params.delete('lat');
      params.delete('lng');
      params.delete('radius');
      changed = true;
    }

    if (latitude != null && longitude != null) {
      const latStr = String(latitude);
      const lngStr = String(longitude);
      const radiusStr = String(radiusKm ?? 40);
      if (params.get('lat') !== latStr) {
        params.set('lat', latStr);
        changed = true;
      }
      if (params.get('lng') !== lngStr) {
        params.set('lng', lngStr);
        changed = true;
      }
      if (params.get('radius') !== radiusStr) {
        params.set('radius', radiusStr);
        changed = true;
      }
    } else if (params.has('lat') || params.has('lng') || params.has('radius')) {
      params.delete('lat');
      params.delete('lng');
      params.delete('radius');
      changed = true;
    }

    const currentCheckIn = checkInDate || getTodayStr();
    if (params.get('checkIn') !== currentCheckIn) {
      params.set('checkIn', currentCheckIn);
      changed = true;
    }

    const currentCheckOut = checkOutDate || getTomorrowStr();
    if (params.get('checkOut') !== currentCheckOut) {
      params.set('checkOut', currentCheckOut);
      changed = true;
    }

    const currentGuests = String(guests || 2);
    if (params.get('guests') !== currentGuests) {
      params.set('guests', currentGuests);
      changed = true;
    }

    if (changed) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, checkInDate, checkOutDate, guests, latitude, longitude, radiusKm, searchParams, setSearchParams]);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Manual text edit invalidates the previously selected Google place geometry
    setLatitude(undefined);
    setLongitude(undefined);
    setRadiusKm(undefined);
  }, []);

  const locationQuery = toPlaceToken(searchQuery) || undefined;

  // Calling API with geo + stay filters
  const { data, isLoading, isError, error, refetch } = usePropertiesListing({
    page: 1,
    limit: 50,
    locationQuery,
    latitude,
    longitude,
    radiusKm,
    checkInDate: checkInDate || getTodayStr(),
    checkOutDate: checkOutDate || getTomorrowStr(),
    guests: guests > 0 ? guests : 2,
    priceRange,
    verificationStatus: ['APPROVED'],
    availableOnly: true,
    segmentId: segmentId != null ? [segmentId] : undefined,
  });

  const toggleLike = (id: number) => {
    if (!requireAuth()) return;
    void toggleItem(id, likedProperties.includes(id));
  };

  const handleReset = () => {
    setSortBy('popular');
    setPriceRange([0, 20000]);
    setSearchQuery('');
    setCheckInDate(getTodayStr());
    setCheckOutDate(getTomorrowStr());
    setGuests(2);
    setLatitude(undefined);
    setLongitude(undefined);
    setRadiusKm(undefined);
  };

  // Client-side sorting on data.cards or data.properties
  const displayedProperties = useMemo(() => {
    const cards = data?.cards || data?.properties || [];
    return [...cards].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0; // 'popular'
      }
    });
  }, [data, sortBy]);

  // GSAP Animations
  useGSAP(
    () => {
      // Header and sidebar entrance
      gsap.from('.listing-header', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      gsap.from('.listing-sidebar', {
        x: -25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });
    },
    { scope: pageRef }
  );

  // Cards stagger entrance on data update
  useGSAP(
    () => {
      if (displayedProperties.length === 0) return;

      gsap.from('.listing-card-item', {
        y: 35,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
      });
    },
    { dependencies: [displayedProperties.length], scope: pageRef }
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Header with Title and Selected Search Criteria */}
        <div className="listing-header mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-heading">
            Explore All Kerala Homestays
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <p className="text-gray-600 text-sm">
              {isLoading
                ? 'Loading homestays from Heaven Connect...'
                : `${displayedProperties.length} authentic stays found`}
            </p>

            {/* Active Stay Date & Guest indicator badges */}
            {(locationQuery || checkInDate || checkOutDate || guests > 1) && (
              <div className="flex items-center gap-2">
                {locationQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {locationQuery}
                    {latitude != null && longitude != null ? ` · ${radiusKm ?? 40} km` : ''}
                  </span>
                )}
                {checkInDate && checkOutDate && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                    {checkInDate} → {checkOutDate}
                  </span>
                )}
                {guests > 1 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {guests} Guests
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="listing-sidebar w-full lg:w-80 shrink-0">
            <PropertyFiltersSidebar
              sortBy={sortBy}
              onSortByChange={setSortBy}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              searchQuery={searchQuery}
              onSearchQueryChange={handleSearchQueryChange}
              checkInDate={checkInDate}
              onCheckInDateChange={setCheckInDate}
              checkOutDate={checkOutDate}
              onCheckOutDateChange={setCheckOutDate}
              guests={guests}
              onGuestsChange={setGuests}
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
                      <div key={property.id} className="listing-card-item">
                        <HomestayCard
                          property={property}
                          isLiked={likedProperties.includes(property.id)}
                          onToggleLike={toggleLike}
                          stayDates={{
                            checkIn: checkInDate || getTodayStr(),
                            checkOut: checkOutDate || getTomorrowStr(),
                            guests: guests || 2,
                          }}
                        />
                      </div>
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
