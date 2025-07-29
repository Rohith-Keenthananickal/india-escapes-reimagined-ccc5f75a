import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Locate,
  Landmark,
  Mountain,
  TreePalm,
  Building2,
} from "lucide-react";
import DateFilter from "@/components/ui/DateFilter";
import GuestFilter from "@/components/ui/GuestFilter";
import { format } from "date-fns";

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
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showGuestFilter, setShowGuestFilter] = useState(false);
  const [guestCount, setGuestCount] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Hide dropdown on blur, but allow click selection
  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleDateSelect = (dateRange: { from: Date; to: Date }) => {
    setCheckIn(dateRange.from);
    setCheckOut(dateRange.to);
  };

  const handleCheckInClick = () => {
    setShowDateFilter(true);
  };

  const handleCheckOutClick = () => {
    setShowDateFilter(true);
  };

  const handleGuestClick = () => {
    setShowGuestFilter(true);
  };

  const handleGuestChange = (
    type: "adults" | "children" | "rooms",
    value: number | string
  ) => {
    if (type === "rooms") {
      setGuestCount((prev) => ({ ...prev, rooms: value as number }));
    } else {
      const currentValue = guestCount[type];
      if (value === "increase") {
        setGuestCount((prev) => ({ ...prev, [type]: currentValue + 1 }));
      } else if (value === "decrease") {
        setGuestCount((prev) => ({
          ...prev,
          [type]: Math.max(type === "adults" ? 1 : 0, currentValue - 1),
        }));
      }
    }
  };

  const getGuestDisplayText = () => {
    const totalGuests = guestCount.adults + guestCount.children;
    if (totalGuests === 1) {
      return "1 guest";
    } else if (totalGuests > 1) {
      return `${totalGuests} guests`;
    }
    return "Add guests";
  };

  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: "350px",
        zIndex: 1000,
      });
    }
  }, [showSuggestions]);

  return (
    <div className="w-full flex justify-center items-center mt-8 mb-8">
      <div className="relative w-full max-w-4xl">
        <div className="flex items-center bg-white rounded-full shadow-2xl px-2 py-2 md:py-0 md:px-2 border-0 min-h-[72px]">
          {/* Where */}
          <div className="flex flex-col justify-center px-6 py-2">
            <span className="text-sm font-bold text-gray-900">Where</span>
            <input
              ref={inputRef}
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={handleBlur}
              className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-500 font-normal mt-0.5"
              style={{ minWidth: 0 }}
            />
            {/* Portal-based dropdown rendering */}
            {showSuggestions &&
              createPortal(
                <div
                  style={dropdownStyle}
                  className="bg-white rounded-2xl shadow-2xl max-h-90 overflow-y-auto border border-gray-100"
                >
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
                          <div className="font-medium text-gray-900">
                            {s.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {s.subtitle}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>,
                document.body
              )}
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px bg-gray-200 mx-2" />

          {/* Check-in */}
          <div
            className="flex flex-col justify-center px-6 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            onClick={handleCheckInClick}
          >
            <span className="text-sm font-bold text-gray-900">Check in</span>
            <div className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-500 font-normal mt-0.5">
              {checkIn ? format(checkIn, "MMM d") : "Add dates"}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px bg-gray-200 mx-2" />

          {/* Check-out */}
          <div
            className="flex flex-col justify-center px-6 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            onClick={handleCheckOutClick}
          >
            <span className="text-sm font-bold text-gray-900">Check out</span>
            <div className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-500 font-normal mt-0.5">
              {checkOut ? format(checkOut, "MMM d") : "Add dates"}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px bg-gray-200 mx-2" />

          {/* Who */}
          <div
            className="flex flex-col justify-center px-6 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            onClick={handleGuestClick}
          >
            <span className="text-sm font-bold text-gray-900">Who</span>
            <div className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-500 font-normal mt-0.5">
              {getGuestDisplayText()}
            </div>
          </div>

          {/* Floating Search Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-4 border-white focus:outline-none transition"
            style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Date Filter Modal */}
      <DateFilter
        isOpen={showDateFilter}
        onClose={() => setShowDateFilter(false)}
        onSelectDates={handleDateSelect}
        initialDateRange={{ from: checkIn, to: checkOut }}
        currentDateRange={
          checkIn && checkOut ? { from: checkIn, to: checkOut } : undefined
        }
      />

      {/* Guest Filter Modal */}
      <GuestFilter
        isOpen={showGuestFilter}
        onClose={() => setShowGuestFilter(false)}
        guestCount={guestCount}
        onGuestChange={handleGuestChange}
      />
    </div>
  );
}
