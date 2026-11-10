import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HomestayCard } from './HomestayCard';
import { useNewlyListedProperties } from '../hooks/useLandingProperties';
import { useWishlistIdsQuery, useWishlistMutations } from '@/modules/wishlist';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const NewlyListedSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { data: properties, isLoading } = useNewlyListedProperties(4);
  const { requireAuth } = useRequireAuth();
  const { data: likedProperties = [] } = useWishlistIdsQuery();
  const { toggleItem } = useWishlistMutations();

  const toggleLike = (id: number) => {
    if (!requireAuth()) return;
    void toggleItem(id, likedProperties.includes(id));
  };

  useGSAP(
    () => {
      if (!properties || properties.length === 0) return;

      gsap.from('.newly-card-item', {
        y: 35,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.newly-grid',
          start: 'top 85%',
        },
      });
    },
    { dependencies: [properties?.length], scope: containerRef }
  );

  return (
    <section ref={containerRef} className="bg-gradient-to-b from-brand-teal-50/50 to-emerald-50/20 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-[#E1F4F6] rounded-full mb-3 text-[#1A8491]">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900">
            Newly Listed Homestays
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-gray-600 mt-1.5 sm:mt-2">
            Fresh homestay experiences recently added to TriphavenCo
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="newly-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(properties || []).map((property) => (
              <div key={`new-${property.id}`} className="newly-card-item">
                <HomestayCard
                  property={property}
                  isLiked={likedProperties.includes(property.id)}
                  onToggleLike={toggleLike}
                  badgeLabel={property.daysAgo === 1 ? 'Today' : `${property.daysAgo} days ago`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button
            variant="outline"
            asChild
            className="px-8 py-6 text-base font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-brand-teal-50 border-gray-300 hover:border-[#2BB0BB] text-[#1F1F1F] hover:text-[#1A8491]"
          >
            <Link to="/properties">Explore All Properties</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewlyListedSection;
