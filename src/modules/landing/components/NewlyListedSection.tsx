import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HomestayCard } from './HomestayCard';
import { useNewlyListedProperties } from '../hooks/useLandingProperties';

export const NewlyListedSection = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const { data: properties, isLoading } = useNewlyListedProperties(4);

  const toggleLike = (id: number) => {
    setLikedProperties((prev) =>
      prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-gradient-to-b from-green-50/70 to-emerald-50/40 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-3 text-green-700">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Newly Listed Homestays
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Fresh homestay experiences recently added to Heaven Connect
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(properties || []).map((property) => (
              <HomestayCard
                key={`new-${property.id}`}
                property={property}
                isLiked={likedProperties.includes(property.id)}
                onToggleLike={toggleLike}
                badgeLabel={property.daysAgo === 1 ? 'Today' : `${property.daysAgo} days ago`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button
            variant="outline"
            asChild
            className="border-green-300 text-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-400 hover:text-green-800"
          >
            <Link to="/properties">View More New Listings</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewlyListedSection;
