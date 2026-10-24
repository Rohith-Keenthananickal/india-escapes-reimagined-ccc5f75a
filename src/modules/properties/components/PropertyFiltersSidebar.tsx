import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, RotateCcw } from 'lucide-react';

interface PropertyFiltersSidebarProps {
  sortBy: string;
  onSortByChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onReset: () => void;
}

export const PropertyFiltersSidebar = ({
  sortBy,
  onSortByChange,
  priceRange,
  onPriceRangeChange,
  searchQuery,
  onSearchQueryChange,
  onReset,
}: PropertyFiltersSidebarProps) => {
  return (
    <Card className="p-6 sticky top-24 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-pink-600" />
          Filter Stays
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-900 gap-1 h-8 px-2"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </Button>
      </div>

      {/* Search by Name */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Search</Label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search homestays..."
            className="pl-9 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Sort by</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="bg-gray-50 border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="price-low">Price: Low to high</SelectItem>
            <SelectItem value="price-high">Price: High to low</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-semibold text-gray-700">Price Range (per night)</Label>
          <span className="text-xs font-bold text-pink-600">
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(val) => onPriceRangeChange([val[0], val[1] ?? priceRange[1]])}
          max={20000}
          min={0}
          step={500}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>₹0</span>
          <span>₹10,000</span>
          <span>₹20,000+</span>
        </div>
      </div>
    </Card>
  );
};

export default PropertyFiltersSidebar;
