
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Waves, 
  Mountain, 
  TreePalm, 
  Landmark, 
  HeartPulse, 
  Home, 
  DollarSign, 
  Activity, 
  Leaf, 
  Filter,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface FilterChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface HomestayFiltersProps {
  onFiltersChange?: (filters: { category: string; filters: string[]; sortBy: string }) => void;
}

const HomestayFilters = ({ onFiltersChange }: HomestayFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const categories = [
    { 
      id: "all", 
      label: "All Categories", 
      count: 165, 
      icon: Home,
      background: "bg-gradient-to-br from-blue-100 to-indigo-100",
      tag: "🏠 Popular"
    },
    { 
      id: "backwater", 
      label: "Backwater & Scenic", 
      count: 45, 
      icon: Waves,
      background: "bg-gradient-to-br from-blue-50 to-cyan-100",
      tag: "🔥 Trending"
    },
    { 
      id: "hills", 
      label: "Hill Stations & Wildlife", 
      count: 38, 
      icon: Mountain,
      background: "bg-gradient-to-br from-green-50 to-emerald-100",
      tag: "🏔️ Adventure"
    },
    { 
      id: "beaches", 
      label: "Beaches & Coastal", 
      count: 32, 
      icon: TreePalm,
      background: "bg-gradient-to-br from-orange-50 to-yellow-100",
      tag: "🌊 Relaxing"
    },
    { 
      id: "cultural", 
      label: "Cultural & Heritage", 
      count: 28, 
      icon: Landmark,
      background: "bg-gradient-to-br from-purple-50 to-pink-100",
      tag: "🏛️ Historic"
    },
    { 
      id: "spiritual", 
      label: "Spiritual & Wellness", 
      count: 22, 
      icon: HeartPulse,
      background: "bg-gradient-to-br from-rose-50 to-pink-100",
      tag: "🌿 Peaceful"
    },
  ];

  const filters = [
    { id: "all", label: "All Stays", icon: Home },
    { id: "budget", label: "Budget Friendly", icon: DollarSign },
    { id: "activities", label: "Activities Nearby", icon: Activity },
    { id: "eco", label: "Eco-Certified", icon: Leaf },
  ];

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange?.({
      category: selectedCategory,
      filters: selectedFilters,
      sortBy
    });
  }, [selectedCategory, selectedFilters, sortBy, onFiltersChange]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const removeFilterChip = (filterId: string) => {
    if (filterId === selectedCategory) {
      setSelectedCategory('all');
    } else {
      setSelectedFilters(prev => prev.filter(f => f !== filterId));
    }
  };

  const getActiveFilterChips = (): FilterChip[] => {
    const chips: FilterChip[] = [];
    
    // Add category chip if not "all"
    const selectedCat = categories.find(cat => cat.id === selectedCategory);
    if (selectedCat && selectedCat.id !== 'all') {
      chips.push({
        id: selectedCat.id,
        label: selectedCat.label,
        icon: <selectedCat.icon className="w-3 h-3" />
      });
    }
    
    // Add filter chips
    selectedFilters.forEach(filterId => {
      const filter = filters.find(f => f.id === filterId);
      if (filter && filter.id !== 'all') {
        chips.push({
          id: filter.id,
          label: filter.label,
          icon: <filter.icon className="w-3 h-3" />
        });
      }
    });
    
    return chips;
  };

  return (
    <div className="bg-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Cards - Desktop */}
        <div className="hidden md:block mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide p-3 " style={{ scrollbarWidth: 'none' }}>
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex-shrink-0 group relative overflow-hidden rounded-2xl p-6 min-w-[200px] h-[120px] transition-all duration-300 hover:scale-105 hover:shadow-xl mb-3  ${
                    category.background
                  } ${
                    isSelected 
                      ? 'ring-2 ring-pink-400 shadow-lg scale-105' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <Badge className="bg-white/80 text-gray-700 text-xs">
                        {category.count}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {category.label}
                    </h3>
                    <div className="text-xs text-gray-600 opacity-80">
                      {category.tag}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-2xl" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Bar - Desktop */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isSelected = selectedFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterToggle(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-400 hover:text-green-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {getActiveFilterChips().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-3">
            <span className="text-sm font-medium text-gray-600 mr-2 hidden md:block">Active filters:</span>
            {getActiveFilterChips().map((chip) => (
              <div
                key={chip.id}
                className="flex items-center gap-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {chip.icon}
                <span>{chip.label}</span>
                <button
                  onClick={() => removeFilterChip(chip.id)}
                  className="ml-1 hover:bg-pink-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {getActiveFilterChips().length > 1 && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedFilters([]);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setMobileSheetOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(selectedCategory !== 'all' || selectedFilters.length > 0) && (
                <Badge className="ml-1 bg-pink-500">
                  {(selectedCategory !== 'all' ? 1 : 0) + selectedFilters.filter(f => f !== 'all').length}
                </Badge>
              )}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Mobile Filter Chips */}
          {getActiveFilterChips().length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {getActiveFilterChips().map((chip) => (
                <div
                  key={chip.id}
                  className="flex items-center gap-1 bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                  <button
                    onClick={() => removeFilterChip(chip.id)}
                    className="ml-1 hover:bg-pink-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filter Homestays</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isSelected = selectedCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'border-pink-400 bg-pink-50' 
                              : 'border-gray-200 hover:border-pink-200'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                          <div className="text-xs font-medium text-center">{category.label}</div>
                          <Badge variant="secondary" className="mt-1 text-xs">{category.count}</Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <h3 className="font-semibold mb-3">Filters</h3>
                  <div className="space-y-2">
                    {filters.map((filter) => {
                      const Icon = filter.icon;
                      const isSelected = selectedFilters.includes(filter.id);
                      return (
                        <button
                          key={filter.id}
                          onClick={() => handleFilterToggle(filter.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                            isSelected 
                              ? 'border-green-400 bg-green-50' 
                              : 'border-gray-200 hover:border-green-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{filter.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default HomestayFilters;
