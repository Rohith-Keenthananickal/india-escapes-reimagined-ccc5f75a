import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users, Locate, Landmark, Mountain, TreePalm, Building2 } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: <Locate className="text-blue-500 w-6 h-6" />,
    title: "Nearby",
    subtitle: "Find what's around you",
  },
  {
    icon: <Landmark className="text-green-600 w-6 h-6" />,
    title: "New Delhi, Delhi",
    subtitle: "For sights like India Gate",
  },
  {
    icon: <TreePalm className="text-yellow-600 w-6 h-6" />,
    title: "North Goa, Goa",
    subtitle: "Popular beach destination",
  },
  {
    icon: <Mountain className="text-pink-500 w-6 h-6" />,
    title: "Guwahati, Assam",
    subtitle: "For nature lovers",
  },
  {
    icon: <Mountain className="text-green-700 w-6 h-6" />,
    title: "Munnar, Kerala",
    subtitle: "Near you",
  },
  {
    icon: <Building2 className="text-red-500 w-6 h-6" />,
    title: "Puducherry, Puducherry",
    subtitle: "For sights like Sri Aurobindo Ashram",
  },
  // ...add more as needed
];

export default function EnhancedSearchBar() {
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Hide dropdown on blur, but allow click selection
  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 1000,
      });
    }
  }, [showSuggestions]);

  return (
    <div className="w-full">
      <div className="w-full max-w-1xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="relative space-y-2">
              <label className="text-sm font-medium text-gray-700">Where</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  ref={inputRef}
                  placeholder="Search destinations"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={handleBlur}
                  className="w-full pl-10 border-gray-300 focus:border-pink-500 rounded-full"
                />
                {/* Portal-based dropdown rendering */}
                {showSuggestions && createPortal(
                  <div style={dropdownStyle} className="bg-white rounded-2xl shadow-2xl max-h-90 overflow-y-auto border border-gray-100">
                    <div className="px-5 py-3 border-b text-xs text-gray-500 font-semibold">
                      Suggested destinations
                    </div>
                    <ul>
                      {SUGGESTIONS.map((s, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-100 transition"
                          onMouseDown={() => setDestination(s.title)}
                        >
                          <span>{s.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{s.title}</div>
                            <div className="text-xs text-gray-500">{s.subtitle}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>,
                  document.body
                )}
              </div>
            </div>

            {/* Check-in */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-pink-500 rounded-full"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-pink-500 rounded-full"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:border-pink-500 focus:outline-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
              <Search className="w-4 h-4 mr-2" />
              Search Kerala Homestays
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
