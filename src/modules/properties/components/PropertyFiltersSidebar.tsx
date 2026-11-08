import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, RotateCcw, CalendarDays, Users } from 'lucide-react';
import DateFilter from '@/components/ui/DateFilter';
import { format } from 'date-fns';

interface PropertyFiltersSidebarProps {
  sortBy: string;
  onSortByChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  checkInDate: string;
  onCheckInDateChange: (val: string) => void;
  checkOutDate: string;
  onCheckOutDateChange: (val: string) => void;
  guests: number;
  onGuestsChange: (val: number) => void;
  onReset: () => void;
}

export const PropertyFiltersSidebar = ({
  sortBy,
  onSortByChange,
  priceRange,
  onPriceRangeChange,
  searchQuery,
  onSearchQueryChange,
  checkInDate,
  onCheckInDateChange,
  checkOutDate,
  onCheckOutDateChange,
  guests,
  onGuestsChange,
  onReset,
}: PropertyFiltersSidebarProps) => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateSection, setDateSection] = useState<'checkin' | 'checkout'>('checkin');

  const parseDateStr = (dateStr?: string): Date | undefined => {
    if (!dateStr) return undefined;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return undefined;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return undefined;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const parsedCheckIn = parseDateStr(checkInDate);
  const parsedCheckOut = parseDateStr(checkOutDate);

  const handleCheckInClick = () => {
    setDateSection('checkin');
    setShowDateFilter(true);
  };

  const handleCheckOutClick = () => {
    setDateSection('checkout');
    setShowDateFilter(true);
  };

  const handleDateSelect = (dateRange: { from: Date; to: Date }) => {
    onCheckInDateChange(format(dateRange.from, 'yyyy-MM-dd'));
    onCheckOutDateChange(format(dateRange.to, 'yyyy-MM-dd'));
  };

  return (
    <Card className="p-6 sticky top-24 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 font-heading">
          <Filter className="w-5 h-5 text-[#2BB0BB]" />
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

      {/* Dates Selection (Airbnb/Booking.com stay search) */}
      <div className="space-y-3 border-b pb-5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#2BB0BB]" /> Stay Dates
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
          {/* Check-in */}
          <div
            className="flex flex-col justify-center px-3 py-2 cursor-pointer bg-white hover:bg-gray-100/70 rounded-lg border border-gray-100 hover:border-gray-300 shadow-sm transition-all"
            onClick={handleCheckInClick}
          >
            <span className="text-[11px] font-bold text-gray-900">Check in</span>
            <div className="text-xs text-gray-700 font-medium mt-0.5 truncate">
              {parsedCheckIn ? format(parsedCheckIn, 'MMM d') : 'Add date'}
            </div>
          </div>

          {/* Check-out */}
          <div
            className="flex flex-col justify-center px-3 py-2 cursor-pointer bg-white hover:bg-gray-100/70 rounded-lg border border-gray-100 hover:border-gray-300 shadow-sm transition-all"
            onClick={handleCheckOutClick}
          >
            <span className="text-[11px] font-bold text-gray-900">Check out</span>
            <div className="text-xs text-gray-700 font-medium mt-0.5 truncate">
              {parsedCheckOut ? format(parsedCheckOut, 'MMM d') : 'Add date'}
            </div>
          </div>
        </div>

        {/* Date Filter Modal */}
        <DateFilter
          isOpen={showDateFilter}
          onClose={() => setShowDateFilter(false)}
          onSelectDates={handleDateSelect}
          initialSection={dateSection}
          initialDateRange={{
            from: parsedCheckIn,
            to: parsedCheckOut,
          }}
          currentDateRange={
            parsedCheckIn && parsedCheckOut
              ? { from: parsedCheckIn, to: parsedCheckOut }
              : undefined
          }
        />
      </div>

      {/* Guests Selection */}
      <div className="space-y-2 border-b pb-5">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#2BB0BB]" /> Guests
        </Label>
        <Select
          value={String(guests)}
          onValueChange={(val) => onGuestsChange(Number(val))}
        >
          <SelectTrigger className="bg-gray-50 border-gray-200 text-xs h-9">
            <SelectValue placeholder="Guests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Guest</SelectItem>
            <SelectItem value="2">2 Guests</SelectItem>
            <SelectItem value="3">3 Guests</SelectItem>
            <SelectItem value="4">4 Guests</SelectItem>
            <SelectItem value="5">5 Guests</SelectItem>
            <SelectItem value="6">6+ Guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Destination / name search */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Destination</Label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="City, district, or stay name..."
            className="pl-9 bg-gray-50 border-gray-200 text-xs h-9"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Sort by</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="bg-gray-50 border-gray-200 text-xs h-9">
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
          <span className="text-xs font-bold text-[#1A8491]">
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
