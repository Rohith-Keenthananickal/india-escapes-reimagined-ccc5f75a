import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Compass, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { ExperienceCard } from '../components/ExperienceCard';
import { useExperiences } from '../hooks/useExperiences';

export const ExperiencesPage = () => {
  const [likedExperiences, setLikedExperiences] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const { data: experiences, isLoading, isError, error, refetch } = useExperiences(50);

  const toggleLike = (id: number) => {
    setLikedExperiences((prev) =>
      prev.includes(id) ? prev.filter((expId) => expId !== id) : [...prev, id]
    );
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    (experiences || []).forEach((exp) => {
      if (exp.category) set.add(exp.category);
    });
    return ['all', ...Array.from(set)];
  }, [experiences]);

  const displayedExperiences = useMemo(() => {
    const list = experiences || [];

    const filtered = list.filter((exp) => {
      if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = exp.title.toLowerCase().includes(query);
        const matchesDesc = exp.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
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
  }, [experiences, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Handpicked Kerala Traditions
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Kerala Experiences & Adventures
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Immerse yourself in authentic village walks, canoe rides, tea plantation treks, and cultural traditions led by passionate local hosts.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences..."
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Category Select */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-gray-50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-44 bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center my-8 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Failed to load experiences</h3>
            <p className="text-sm text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Backend connection error.'}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="border-rose-300 text-rose-700">
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        )}

        {/* Experiences Grid */}
        {!isLoading && !isError && (
          <>
            {displayedExperiences.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8">
                <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg font-medium">No experiences found matching your filters.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedExperiences.map((exp) => (
                  <ExperienceCard
                    key={exp.id}
                    experience={exp}
                    isLiked={likedExperiences.includes(exp.id)}
                    onToggleLike={toggleLike}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ExperiencesPage;
