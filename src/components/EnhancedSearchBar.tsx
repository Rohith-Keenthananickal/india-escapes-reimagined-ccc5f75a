import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import DateFilter from "@/components/ui/DateFilter";
import GuestFilter from "@/components/ui/GuestFilter";
import { format } from "date-fns";
import { useGooglePlaces, type PlaceDetails } from "@/hooks/use-google-places";
import { GoogleMapsLoader } from "@/components/GoogleMapsLoader";

/** Short display / match token from a place label ("Kochi, Keralam, India" → "Kochi"). */
const toPlaceToken = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.split(",")[0].trim();
};

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
    icon: <Mountain className="text-[#2BB0BB] w-6 h-6" />,
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getToday = () => new Date();
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  };

  // Read initial values from URL query parameters if available
  const initialDestination = searchParams.get("destination") || searchParams.get("searchQuery") || "";
  const initialCheckInStr = searchParams.get("checkIn");
  const initialCheckOutStr = searchParams.get("checkOut");
  const initialGuests = Number(searchParams.get("guests")) || 2;

  const [destination, setDestination] = useState(initialDestination);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    initialCheckInStr && !isNaN(new Date(initialCheckInStr).getTime())
      ? new Date(initialCheckInStr)
      : getToday()
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    initialCheckOutStr && !isNaN(new Date(initialCheckOutStr).getTime())
      ? new Date(initialCheckOutStr)
      : getTomorrow()
  );
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showGuestFilter, setShowGuestFilter] = useState(false);
  const [guestCount, setGuestCount] = useState({
    adults: Math.max(1, initialGuests),
    children: 0,
    rooms: 1,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Google Places hook
  const { predictions, isLoading, error, isInitialized, getPlacePredictions, getPlaceDetails, clearPredictions } = useGooglePlaces();

  // Handle destination input change with debounced search
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    setSelectedPlace(null);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce the search
    const timeout = setTimeout(() => {
      if (value.trim().length >= 2) {
        if (isInitialized) {
          getPlacePredictions(value);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } else {
        clearPredictions();
        setShowSuggestions(false);
      }
    }, 300);

    setSearchTimeout(timeout);
  };

  // Handle place selection
  const handlePlaceSelect = async (prediction: {
    place_id: string;
    description: string;
    structured_formatting: { main_text: string; secondary_text: string };
  }) => {
    const placeDetails = await getPlaceDetails(prediction.place_id);
    if (placeDetails) {
      setSelectedPlace(placeDetails);
      // Display short place name (not the full Google label) for search matching
      setDestination(prediction.structured_formatting.main_text || placeDetails.name);
      setShowSuggestions(false);
      clearPredictions();
    }
  };

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
    const totalGuests = (guestCount.adults || 0) + (guestCount.children || 0);
    if (totalGuests === 1) {
      return "1 guest";
    } else if (totalGuests > 1) {
      return `${totalGuests} guests`;
    }
    return "2 guests";
  };

  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY + 6,
        left: isMobile ? 16 : rect.left + window.scrollX,
        width: isMobile ? "calc(100vw - 32px)" : "350px",
        maxWidth: "420px",
        zIndex: 1000,
      });
    }
  }, [showSuggestions]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Keep state synced if URL params change
  useEffect(() => {
    const dest = searchParams.get("destination") || searchParams.get("searchQuery");
    if (dest !== null) setDestination(dest);

    const cIn = searchParams.get("checkIn");
    if (cIn) {
      const parsedIn = new Date(cIn);
      if (!isNaN(parsedIn.getTime())) setCheckIn(parsedIn);
    } else {
      setCheckIn(getToday());
    }

    const cOut = searchParams.get("checkOut");
    if (cOut) {
      const parsedOut = new Date(cOut);
      if (!isNaN(parsedOut.getTime())) setCheckOut(parsedOut);
    } else {
      setCheckOut(getTomorrow());
    }

    const g = Number(searchParams.get("guests"));
    if (g && g > 0) {
      setGuestCount((prev) => ({ ...prev, adults: g, children: 0 }));
    } else {
      setGuestCount((prev) => ({ ...prev, adults: 2, children: 0 }));
    }
  }, [searchParams]);

  // Handle search button click
  const handleSearch = () => {
    const params = new URLSearchParams();
    const placeToken = toPlaceToken(
      selectedPlace?.name || destination
    );

    if (placeToken) {
      params.set("destination", placeToken);
    }

    if (selectedPlace?.geometry?.location) {
      params.set("lat", String(selectedPlace.geometry.location.lat));
      params.set("lng", String(selectedPlace.geometry.location.lng));
      params.set("radius", String(selectedPlace.radius_km || 40));
    }

    const effectiveCheckIn = checkIn || getToday();
    const effectiveCheckOut = checkOut || getTomorrow();
    params.set("checkIn", format(effectiveCheckIn, "yyyy-MM-dd"));
    params.set("checkOut", format(effectiveCheckOut, "yyyy-MM-dd"));
    const totalGuests = Math.max(1, (guestCount.adults || 0) + (guestCount.children || 0)) || 2;
    params.set("guests", totalGuests.toString());

    // Navigate to /properties with geo + stay filters (Booking.com style)
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center items-center my-4 sm:my-8 px-3 sm:px-4">
      <GoogleMapsLoader>
        <div className="relative w-full max-w-4xl">
          {/* Mobile Search Card (< 768px) */}
          <div className="flex md:hidden flex-col bg-white rounded-3xl shadow-xl p-3 border border-gray-150 w-full space-y-2.5">
            {/* Destination Input Row */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 rounded-2xl border border-gray-200/80">
              <Search className="w-4 h-4 text-[#2BB0BB] shrink-0" />
              <input
                ref={inputRef}
                placeholder="Where to? (e.g. Munnar, Alleppey)"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={() => {
                  if (destination.trim().length >= 2) {
                    if (isInitialized) {
                      getPlacePredictions(destination);
                      setShowSuggestions(true);
                    } else {
                      setShowSuggestions(false);
                    }
                  }
                }}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500 font-medium w-full"
              />
            </div>

            {/* Dates & Guests Compact Selector Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCheckInClick}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200/80 text-left hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#1A8491] shrink-0" />
                <div className="overflow-hidden">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dates</div>
                  <div className="text-xs font-semibold text-gray-800 truncate">
                    {checkIn ? format(checkIn, "MMM d") : "Add dates"} - {checkOut ? format(checkOut, "MMM d") : ""}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleGuestClick}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200/80 text-left hover:bg-gray-100 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-[#1A8491] shrink-0" />
                <div className="overflow-hidden">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Guests</div>
                  <div className="text-xs font-semibold text-gray-800 truncate">
                    {getGuestDisplayText()}
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#2BB0BB] to-[#1A8491] text-white font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Homestays</span>
            </button>
          </div>

          {/* Desktop Search Pill (>= 768px) */}
          <div className="hidden md:flex items-center bg-white rounded-full shadow-2xl px-2 py-0 border-0 min-h-[72px]">
            {/* Where */}
            <div className="flex flex-col justify-center px-6 py-2">
              <span className="text-sm font-bold text-gray-900">Where</span>
              <input
                placeholder="Search destinations"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={() => {
                  if (destination.trim().length >= 2) {
                    if (isInitialized) {
                      getPlacePredictions(destination);
                      setShowSuggestions(true);
                            } else {
          setShowSuggestions(false);
        }
                  }
                }}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-500 font-normal mt-0.5"
                style={{ minWidth: 0 }}
              />
              {/* {selectedPlace && (
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {selectedPlace.geometry.location.lat.toFixed(4)}, {selectedPlace.geometry.location.lng.toFixed(4)}
                  </span>
                </div>
              )} */}
            {/* Portal-based dropdown rendering */}
            {showSuggestions &&
              createPortal(
                <div
                  style={dropdownStyle}
                  className="bg-white rounded-2xl shadow-2xl max-h-90 overflow-y-auto border border-gray-100"
                >
                  <div className="px-5 py-3 border-b text-xs text-gray-500 font-semibold">
                    {isLoading ? "Searching..." : "Suggested destinations"}
                  </div>
                  <ul>
                    {isLoading ? (
                      <li className="flex items-center justify-center px-5 py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-[#2BB0BB]" />
                        <span className="ml-2 text-sm text-gray-600">Searching destinations...</span>
                      </li>
                    ) : predictions.length > 0 ? (
                      predictions.map((prediction, idx) => (
                        <li
                          key={prediction.place_id}
                          className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-100 transition"
                          onMouseDown={() => handlePlaceSelect(prediction)}
                        >
                          <MapPin className="text-[#2BB0BB] w-5 h-5" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {prediction.structured_formatting.main_text}
                            </div>
                            <div className="text-xs text-gray-500">
                              {prediction.structured_formatting.secondary_text}
                            </div>
                          </div>
                        </li>
                      ))
                                         ) : error ? (
                       <li className="px-5 py-4 text-sm text-red-500 text-center">
                         <div>API Error: {error}</div>
                         <div className="text-xs text-gray-400 mt-1">
                           {!isInitialized ? 'Google Places API is still loading...' : 'Please check your Google Maps API configuration'}
                         </div>
                       </li>
                     ) : !isInitialized ? (
                       <li className="px-5 py-4 text-sm text-gray-500 text-center">
                         <div className="flex items-center justify-center">
                           <Loader2 className="w-4 h-4 animate-spin text-[#2BB0BB] mr-2" />
                           <span>Initializing Google Places...</span>
                         </div>
                       </li>
                     ) : destination.trim().length >= 2 ? (
                       <li className="px-5 py-4 text-sm text-gray-500 text-center">
                         <div>No destinations found</div>
                         <div className="text-xs text-gray-400 mt-1">
                           Try a different search term or check your internet connection
                         </div>
                       </li>
                     ) : (
                      SUGGESTIONS.map((s, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-100 transition"
                          onMouseDown={() => {
                            setSelectedPlace(null);
                            setDestination(toPlaceToken(s.title));
                          }}
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
                      ))
                    )}
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
              {checkIn ? format(checkIn, "MMM d") : format(getToday(), "MMM d")}
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
              {checkOut ? format(checkOut, "MMM d") : format(getTomorrow(), "MMM d")}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px bg-gray-200 mx-2" />

          {/* Who */}
          <div
            className="flex flex-col justify-center px-6 pr-20 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            onClick={handleGuestClick}
          >
            <span className="text-sm font-bold text-gray-900">Who</span>
            <div className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-500 font-normal mt-0.5">
              {getGuestDisplayText()}
            </div>
          </div>

          {/* Floating Search Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2BB0BB] hover:bg-[#1A8491] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-4 border-white focus:outline-none transition-all duration-300 hover:scale-105"
            style={{ boxShadow: "0 4px 24px 0 rgba(43, 176, 187, 0.25)" }}
            aria-label="Search"
            onClick={handleSearch}
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
      </GoogleMapsLoader>
    </div>
  );
}
