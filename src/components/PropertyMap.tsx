import { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LocationCard from "./LocationCard";
import {
  MapPin,
  Mountain,
  Droplets,
  Car,
  Coffee,
  ShoppingBag,
  Home,
  Star,
  Navigation,
  Utensils,
  Hotel,
  Camera,
  TreePine,
  Waves,
  Building2,
  Heart,
  ExternalLink,
  Phone,
  Globe,
  Filter,
  Search,
  X,
  Loader2,
  Map,
  Layers,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapIcon,
} from "lucide-react";

interface Location {
  id: string;
  name: string;
  type:
    | "waterfall"
    | "service"
    | "homestay"
    | "attraction"
    | "restaurant"
    | "hotel"
    | "park"
    | "beach"
    | "temple"
    | "museum";
  position: { lat: number; lng: number };
  rating?: number;
  distance?: number;
  description?: string;
  icon: any;
  color: string;
  placeId?: string;
  photos?: string[];
  phone?: string;
  website?: string;
  address?: string;
  openingHours?: string;
  priceLevel?: number;
}

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
}

const PropertyMap = ({
  latitude,
  longitude,
  propertyName,
}: PropertyMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mapContainerStyle = {
    width: "100%",
    height: isFullscreen ? "100vh" : "100%",
  };

  const propertyCoords = { lat: latitude, lng: longitude };
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: ["places"],
  });

  const getLocationIcon = (type: string) => {
    const iconMap = {
      waterfall: Droplets,
      homestay: Home,
      hotel: Hotel,
      restaurant: Utensils,
      service: ShoppingBag,
      attraction: Mountain,
      park: TreePine,
      beach: Waves,
      temple: Building2,
      museum: Camera,
    };
    return iconMap[type as keyof typeof iconMap] || MapPin;
  };

  const getLocationColor = (type: string) => {
    const colorMap = {
      waterfall: "blue",
      homestay: "purple",
      hotel: "indigo",
      restaurant: "orange",
      service: "green",
      attraction: "red",
      park: "emerald",
      beach: "cyan",
      temple: "amber",
      museum: "violet",
    };
    return colorMap[type as keyof typeof colorMap] || "gray";
  };

  const getLocationTypeLabel = (type: string) => {
    const labelMap = {
      waterfall: "Waterfall",
      homestay: "Homestay",
      hotel: "Hotel",
      restaurant: "Restaurant",
      service: "Service",
      attraction: "Attraction",
      park: "Park",
      beach: "Beach",
      temple: "Temple",
      museum: "Museum",
    };
    return labelMap[type as keyof typeof labelMap] || "Location";
  };

  const getGoogleMapsIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      waterfall: "https://maps.google.com/mapfiles/ms/micons/water.png",
      homestay: "https://maps.google.com/mapfiles/ms/micons/lodging.png",
      hotel: "https://maps.google.com/mapfiles/ms/micons/lodging.png",
      restaurant: "https://maps.google.com/mapfiles/ms/micons/restaurant.png",
      service: "https://maps.google.com/mapfiles/ms/micons/shopping.png",
      attraction: "https://maps.google.com/mapfiles/ms/micons/attraction.png",
      park: "https://maps.google.com/mapfiles/ms/micons/park.png",
      beach: "https://maps.google.com/mapfiles/ms/micons/beach.png",
      temple: "https://maps.google.com/mapfiles/ms/micons/religious.png",
      museum: "https://maps.google.com/mapfiles/ms/micons/museum.png",
    };
    return (
      iconMap[type] || "https://maps.google.com/mapfiles/ms/micons/blue-dot.png"
    );
  };

  const createPropertyMarkerIcon = () => {
    return {
      url: "https://maps.google.com/mapfiles/ms/micons/red-pushpin.png",
      scaledSize: new window.google.maps.Size(48, 48),
      anchor: new window.google.maps.Point(24, 24),
    };
  };

  const createLocationMarkerIcon = (type: string) => {
    return {
      url: getGoogleMapsIcon(type),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16),
    };
  };

  const fetchNearbyPlaces = async () => {
    if (!map || !googleMapsApiKey) return;

    setIsLoadingPlaces(true);
    const service = new google.maps.places.PlacesService(map);

    const placeTypes = [
      "tourist_attraction",
      "lodging",
      "restaurant",
      "natural_feature",
      "establishment",
    ];
    const allResults: google.maps.places.PlaceResult[] = [];

    try {
      for (const type of placeTypes) {
        const request = {
          location: propertyCoords,
          radius: 5000,
          type: type,
        };

        const results = await new Promise<google.maps.places.PlaceResult[]>(
          (resolve) => {
            service.nearbySearch(request, (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                resolve(results);
              } else {
                resolve([]);
              }
            });
          }
        );

        allResults.push(...results);
      }

      const locations: Location[] = allResults
        .slice(0, 15)
        .map((place, index) => {
          const type = place.types?.[0] || "attraction";
          const locationType = getLocationTypeFromGoogleType(type);

          return {
            id: `place_${index}`,
            name: place.name || "Unknown Place",
            type: locationType,
            position: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
            rating: place.rating,
            distance: calculateDistance(
              propertyCoords.lat,
              propertyCoords.lng,
              place.geometry?.location?.lat() || 0,
              place.geometry?.location?.lng() || 0
            ),
            description: place.vicinity || "",
            icon: getLocationIcon(locationType),
            color: getLocationColor(locationType),
            placeId: place.place_id,
            photos:
              place.photos?.map((photo) => photo.getUrl({ maxWidth: 300 })) ||
              [],
            phone: place.formatted_phone_number,
            website: place.website,
            address: place.vicinity,
            openingHours: place.opening_hours?.weekday_text?.join(", "),
            priceLevel: place.price_level,
          };
        });

      setNearbyLocations(locations);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      generateFallbackLocations();
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const getLocationTypeFromGoogleType = (
    googleType: string
  ): Location["type"] => {
    const typeMap: Record<string, Location["type"]> = {
      natural_feature: "waterfall",
      lodging: "homestay",
      restaurant: "restaurant",
      tourist_attraction: "attraction",
      park: "park",
      beach: "beach",
      establishment: "service",
    };
    return typeMap[googleType] || "attraction";
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const generateFallbackLocations = () => {
    const locations: Location[] = [
      {
        id: "waterfall1",
        name: "Kempty Falls",
        type: "waterfall",
        position: { lat: latitude + 0.02, lng: longitude + 0.01 },
        rating: 4.5,
        distance: 2.1,
        description: "Popular waterfall with scenic views",
        icon: Droplets,
        color: "blue",
        address: "Kempty Falls Road, Mussoorie",
        openingHours: "Open daily 6:00 AM - 6:00 PM",
      },
      {
        id: "homestay1",
        name: "Pine View Homestay",
        type: "homestay",
        position: { lat: latitude + 0.025, lng: longitude - 0.005 },
        rating: 4.6,
        distance: 2.8,
        description: "Family-run homestay with garden",
        icon: Home,
        color: "purple",
        address: "Pine View Road, Mussoorie",
        phone: "+91 98765 43210",
      },
      {
        id: "restaurant1",
        name: "Mountain View Restaurant",
        type: "restaurant",
        position: { lat: latitude + 0.005, lng: longitude - 0.008 },
        rating: 4.4,
        distance: 0.9,
        description: "Cozy restaurant with mountain views",
        icon: Utensils,
        color: "orange",
        address: "Mall Road, Mussoorie",
        openingHours: "Open daily 8:00 AM - 10:00 PM",
        phone: "+91 98765 43211",
      },
      {
        id: "attraction1",
        name: "Gun Hill",
        type: "attraction",
        position: { lat: latitude + 0.03, lng: longitude - 0.02 },
        rating: 4.8,
        distance: 3.5,
        description: "Famous viewpoint and cable car",
        icon: Mountain,
        color: "red",
        address: "Gun Hill Road, Mussoorie",
        openingHours: "Open daily 9:00 AM - 5:00 PM",
      },
      {
        id: "park1",
        name: "Municipal Garden",
        type: "park",
        position: { lat: latitude - 0.01, lng: longitude + 0.015 },
        rating: 4.2,
        distance: 1.5,
        description: "Beautiful garden with walking trails",
        icon: TreePine,
        color: "emerald",
        address: "Library Road, Mussoorie",
        openingHours: "Open daily 6:00 AM - 8:00 PM",
      },
      {
        id: "service1",
        name: "Local Market",
        type: "service",
        position: { lat: latitude - 0.008, lng: longitude + 0.015 },
        rating: 4.0,
        distance: 1.8,
        description: "Local grocery and essentials market",
        icon: ShoppingBag,
        color: "green",
        address: "Market Road, Mussoorie",
        openingHours: "Open daily 7:00 AM - 9:00 PM",
      },
    ];
    setNearbyLocations(locations);
  };

  useEffect(() => {
    if (isLoaded && map) {
      console.log("Property coordinates:", propertyCoords);
      fetchNearbyPlaces();
    } else if (latitude && longitude) {
      generateFallbackLocations();
    }
  }, [isLoaded, map, latitude, longitude]);

  useEffect(() => {
    if (map && isLoaded) {
      const timer = setTimeout(() => {
        google.maps.event.trigger(map, "resize");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, map, isLoaded]);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleDirections = (location: Location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
    window.open(url, "_blank");
  };

  const handleLocationClick = (location: Location) => {
    if (location.placeId) {
      const url = `https://www.google.com/maps/place/?q=place_id:${location.placeId}`;
      window.open(url, "_blank");
    } else {
      handleDirections(location);
    }
  };

  const handleViewOnGoogleMaps = (location: Location) => {
    if (location.placeId) {
      const url = `https://www.google.com/maps/place/?q=place_id:${location.placeId}`;
      window.open(url, "_blank");
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location.name
      )}`;
      window.open(url, "_blank");
    }
  };

  const filteredLocations = nearbyLocations.filter((location) => {
    const matchesType =
      selectedType === "all" || location.type === selectedType;
    const matchesSearch = location.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const locationTypes = [
    { value: "all", label: "All Places", icon: MapIcon },
    { value: "waterfall", label: "Waterfalls", icon: Droplets },
    { value: "homestay", label: "Homestays", icon: Home },
    { value: "hotel", label: "Hotels", icon: Hotel },
    { value: "restaurant", label: "Restaurants", icon: Utensils },
    { value: "attraction", label: "Attractions", icon: Mountain },
    { value: "park", label: "Parks", icon: TreePine },
    { value: "service", label: "Services", icon: ShoppingBag },
  ];

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (map) {
        google.maps.event.trigger(map, "resize");
      }
    }, 100);
  };

  if (!googleMapsApiKey) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Google Maps API key not configured
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Please add VITE_GOOGLE_MAPS_API_KEY to your .env file to enable map
            functionality
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 rounded-xl">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Failed to load Google Maps
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Please check your API key configuration and internet connection
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
        <div className="text-center p-8">
          <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Loading map...
          </h3>
          <p className="text-sm text-gray-500">
            Preparing your interactive map experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${
        isFullscreen ? "fixed inset-0 z-20 bg-white" : "h-full"
      }`}
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleFullscreenToggle}
          className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={propertyCoords}
        zoom={14}
        onLoad={setMap}
        options={{
          disableDefaultUI: false,
          clickableIcons: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {propertyCoords.lat && propertyCoords.lng && (
          <Marker
            position={propertyCoords}
            icon={createPropertyMarkerIcon()}
            onClick={() => {
              console.log("Property marker clicked:", propertyCoords);
              setSelectedLocation({
                id: "property",
                name: propertyName,
                type: "homestay",
                position: propertyCoords,
                rating: 4.8,
                distance: 0,
                description: `Your selected property - ${propertyName}. This is where you'll be staying during your visit.`,
                icon: Home,
                color: "blue",
                address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                openingHours: "Check-in: 3:00 PM, Check-out: 11:00 AM",
              });
            }}
          />
        )}

        {nearbyLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={createLocationMarkerIcon(location.type)}
            onClick={() => handleMarkerClick(location)}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.position}
            onCloseClick={() => setSelectedLocation(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -40),
            }}
          >
            <div className="max-w-sm">
              <LocationCard
                location={selectedLocation}
                variant="compact"
                showActions={true}
              />
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {isFullscreen && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleFullscreenToggle}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default PropertyMap;
