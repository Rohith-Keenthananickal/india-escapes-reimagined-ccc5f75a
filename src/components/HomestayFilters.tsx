import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Waves,
  Mountain,
  Palmtree,
  Landmark,
  HeartPulse,
  Home,
  Tag,
  Leaf,
  Compass,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface FilterState {
  category: string;
  filters: string[];
  sortBy: string;
}

export interface HomestayFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  totalResults?: number;
}

const CATEGORIES = [
  {
    id: 'all',
    label: 'All Homestays',
    sublabel: 'Across Kerala',
    count: 165,
    icon: Home,
  },
  {
    id: 'backwater',
    label: 'Backwaters & Canals',
    sublabel: 'Alleppey & Kumarakom',
    count: 45,
    icon: Waves,
  },
  {
    id: 'hills',
    label: 'Hill Stations & Treks',
    sublabel: 'Munnar & Wayanad',
    count: 38,
    icon: Mountain,
  },
  {
    id: 'beaches',
    label: 'Coastal & Beaches',
    sublabel: 'Varkala & Marari',
    count: 32,
    icon: Palmtree,
  },
  {
    id: 'cultural',
    label: 'Heritage & Nalukettu',
    sublabel: 'Fort Kochi & Thrissur',
    count: 28,
    icon: Landmark,
  },
  {
    id: 'spiritual',
    label: 'Ayurveda & Wellness',
    sublabel: 'Kovalam & Palakkad',
    count: 22,
    icon: HeartPulse,
  },
];

const FEATURE_FILTERS = [
  {
    id: 'budget',
    label: 'Budget Friendly',
    description: 'Under ₹4,000 / night',
    icon: Tag,
  },
  {
    id: 'eco',
    label: 'Eco-Certified',
    description: 'Solar power, rainwater harvesting & organic',
    icon: Leaf,
  },
  {
    id: 'activities',
    label: 'Curated Activities',
    description: 'Village walks, canoeing, cooking workshops',
    icon: Compass,
  },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated (4.8+)' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Recently Added' },
];

export const HomestayFilters = ({ onFiltersChange, totalResults }: HomestayFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Category horizontal scroll ref and button states
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll capability
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  // Notify parent on change
  useEffect(() => {
    onFiltersChange?.({
      category: selectedCategory,
      filters: selectedFilters,
      sortBy,
    });
  }, [selectedCategory, selectedFilters, sortBy, onFiltersChange]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const removeFilter = (filterId: string) => {
    if (filterId === selectedCategory) {
      setSelectedCategory('all');
    } else {
      setSelectedFilters((prev) => prev.filter((id) => id !== filterId));
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFilters([]);
    setSortBy('popularity');
  };

  // Active filter count (excluding 'all')
  const activeCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedFilters.filter((f) => f !== 'all').length +
    (sortBy !== 'popularity' ? 1 : 0);

  // Active filter chips list
  const activeChips = [
    ...(selectedCategory !== 'all'
      ? [
          {
            id: selectedCategory,
            label: CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory,
            type: 'category',
          },
        ]
      : []),
    ...selectedFilters.map((id) => ({
      id,
      label: FEATURE_FILTERS.find((f) => f.id === id)?.label || id,
      type: 'feature',
    })),
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl sticky top-20 z-20 shadow-xs transition-all duration-200 p-2.5 sm:p-4 mb-6">
      {/* Top Airbnb-style Category Bar with Left/Right chevrons */}
      <div className="relative flex items-center mb-2.5 sm:mb-3">
        {/* Left Arrow Button (Desktop / Tablet) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-0 z-10 w-8 h-8 rounded-full bg-white/95 border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-gray-900 hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Left Gradient Fade Mask */}
        {canScrollLeft && (
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/80 to-transparent z-5 pointer-events-none" />
        )}

        {/* Categories Carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-none py-1 px-0.5 scroll-smooth w-full touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all duration-200 shrink-0 text-left select-none relative ${
                  isSelected
                    ? 'bg-teal-50 text-[#1A8491] border border-[#2BB0BB]/50 shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-[#1A8491] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 group-hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex flex-col">
                  <span
                    className={`text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap leading-none ${
                      isSelected ? 'text-[#1A8491]' : 'text-gray-800'
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap hidden sm:inline-block">
                    {cat.count} stays
                  </span>
                </div>

                {/* Active bottom accent bar */}
                {isSelected && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2BB0BB] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Gradient Fade Mask */}
        {canScrollRight && (
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white via-white/80 to-transparent z-5 pointer-events-none" />
        )}

        {/* Right Arrow Button (Desktop / Tablet) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-0 z-10 w-8 h-8 rounded-full bg-white/95 border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-gray-900 hover:scale-105 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Toolbar: Quick Filter Pills + Sort + All Filters Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2.5 border-t border-gray-100">
        {/* Quick Filter Pills (Scrollable horizontally) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 w-full sm:w-auto -mx-0.5 px-0.5 touch-pan-x">
          {FEATURE_FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedFilters.includes(filter.id);

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleFilterToggle(filter.id)}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? 'bg-[#1A8491] text-white shadow-xs ring-1 ring-[#1A8491]'
                    : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700 border border-gray-200/80'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{filter.label}</span>
                {isActive && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Right Action Controls: Sort & Comprehensive Filters Modal */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 text-xs font-medium w-full sm:w-[170px] rounded-xl border-gray-200 bg-white hover:border-[#2BB0BB]/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl shadow-lg border-gray-200">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium py-2">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* "All Filters" Modal Trigger */}
          <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3.5 rounded-xl border-gray-200 hover:border-[#2BB0BB] hover:bg-teal-50/50 text-gray-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1A8491]" />
                <span>Filters</span>
                {activeCount > 0 && (
                  <Badge className="ml-0.5 px-1.5 py-0.2 bg-[#2BB0BB] text-white font-bold text-[10px] rounded-full h-4 min-w-4 flex items-center justify-center">
                    {activeCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
                <DialogHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-heading font-extrabold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-[#1A8491]" />
                      <span>Filter Kerala Homestays</span>
                    </DialogTitle>
                    {activeCount > 0 && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-xs text-[#1A8491] hover:underline font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset all</span>
                      </button>
                    )}
                  </div>
                </DialogHeader>

                <div className="py-4 space-y-6">
                  {/* Category Selection in Modal */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      Destination Region
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.id;

                        return (
                          <button
                            key={`modal-${cat.id}`}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                              isSelected
                                ? 'bg-teal-50 border-[#2BB0BB] ring-1 ring-[#2BB0BB] text-[#1A8491]'
                                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Icon className="w-4 h-4 text-[#1A8491]" />
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#2BB0BB]" />}
                            </div>
                            <span className="text-xs font-bold leading-tight line-clamp-1">
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-gray-500 mt-0.5">
                              {cat.count} stays
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feature Preferences */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      Features & Certifications
                    </h4>
                    <div className="space-y-2.5">
                      {FEATURE_FILTERS.map((f) => {
                        const Icon = f.icon;
                        const isChecked = selectedFilters.includes(f.id);

                        return (
                          <div
                            key={`modal-feature-${f.id}`}
                            onClick={() => handleFilterToggle(f.id)}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-teal-50/60 border-[#2BB0BB]/60 text-gray-900'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? 'bg-[#1A8491] text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-gray-900">
                                  {f.label}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {f.description}
                                </div>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-[#2BB0BB] border-[#2BB0BB] text-white'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sorting Preferences */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Sort Results By
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={`modal-sort-${opt.value}`}
                          type="button"
                          onClick={() => setSortBy(opt.value)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-colors ${
                            sortBy === opt.value
                              ? 'bg-[#1A8491] border-[#1A8491] text-white'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </Button>
                  <Button
                    onClick={() => setFilterModalOpen(false)}
                    className="bg-gradient-to-r from-[#2BB0BB] to-[#1A8491] hover:from-[#1A8491] hover:to-[#146b76] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                  >
                    <span>Show Homestays</span>
                    {totalResults !== undefined && (
                      <span className="ml-1.5 opacity-90">({totalResults})</span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Active Filter Chips Bar (Shown whenever non-default filters are active) */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2.5 mt-2 border-t border-gray-100 animate-fadeIn">
            <span className="text-[11px] sm:text-xs text-gray-500 font-semibold mr-1">Active filters:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#E1F4F6] text-[#1A8491] border border-[#B6E5E9] shadow-xs"
              >
                <span className="truncate max-w-[120px] sm:max-w-none">{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeFilter(chip.id)}
                  className="hover:bg-[#B6E5E9] rounded-full p-0.5 text-[#1A8491] transition-colors"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] sm:text-xs font-semibold text-gray-500 hover:text-red-600 underline ml-1 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
    </div>
  );
};

export default HomestayFilters;
