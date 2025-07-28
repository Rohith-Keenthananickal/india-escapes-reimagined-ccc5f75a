import { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
  Libraries,
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
  ShoppingCart,
  MessageCircle,
  Plus,
  Clipboard,
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
    | "museum"
    | "cafe"
    | "bar"
    | "bakery"
    | "hospital"
    | "pharmacy"
    | "dentist"
    | "doctor"
    | "bank"
    | "atm"
    | "gas"
    | "parking"
    | "bus"
    | "train"
    | "airport"
    | "school"
    | "library"
    | "post_office"
    | "police"
    | "fire_station"
    | "gym"
    | "pool"
    | "spa"
    | "golf"
    | "tennis"
    | "cinema"
    | "theater"
    | "stadium"
    | "zoo"
    | "aquarium"
    | "amusement_park"
    | "casino"
    | "night_club"
    | "convenience_store"
    | "grocery_store"
    | "clothing_store"
    | "jewelry_store"
    | "book_store"
    | "electronics_store"
    | "hardware_store"
    | "car_dealer"
    | "car_rental"
    | "car_repair"
    | "gas_station"
    | "taxi"
    | "church"
    | "mosque"
    | "synagogue"
    | "hindu_temple"
    | "buddhist_temple"
    | "city_hall"
    | "courthouse"
    | "embassy"
    | "beauty_salon"
    | "laundry"
    | "locksmith"
    | "plumber"
    | "electrician"
    | "travel_agency"
    | "real_estate_agency"
    | "lawyer"
    | "pet_store"
    | "veterinary_care"
    | "florist"
    | "farm"
    | "winery"
    | "brewery";
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
  profileImage?: string;
  status?: "selected" | "active" | "inactive" | "completed";
  taskInfo?: {
    title: string;
    taskId: string;
    company: string;
    timeSlot: string;
    nextJob?: string;
  };
}

interface CartItem {
  id: string;
  title?: string;
  name?: string;
  location?: string;
  type?: string;
  category?: string;
  position?: { lat: number; lng: number };
  rating?: number;
  distance?: number;
  imageUrl?: string;
  selected?: boolean;
}

interface RouteSegment {
  from: CartItem;
  to: CartItem;
  distance: number;
  duration?: string;
}

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  cartItems?: any[];
  showCartItems?: boolean;
}

// Define libraries array outside component to prevent reloading
const mapLibraries: Libraries = ["places"];

const PropertyMap = ({
  latitude,
  longitude,
  propertyName,
  cartItems = [],
  showCartItems = false,
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
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [showRoutes, setShowRoutes] = useState(true);
  const [totalTripDistance, setTotalTripDistance] = useState(0);
  const [useOptimalRoute, setUseOptimalRoute] = useState(false);

  // Add state to track custom markers
  const [customMarkers, setCustomMarkers] = useState<google.maps.OverlayView[]>(
    []
  );

  const mapContainerStyle = {
    width: "100%",
    height: isFullscreen ? "100vh" : "100%",
  };

  const propertyCoords = { lat: latitude, lng: longitude };
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: mapLibraries,
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
      cafe: "orange",
      bar: "pink",
      bakery: "amber",
      hospital: "red",
      pharmacy: "green",
      dentist: "blue",
      doctor: "red",
      bank: "green",
      atm: "blue",
      gas: "yellow",
      parking: "gray",
      bus: "blue",
      train: "purple",
      airport: "blue",
      school: "indigo",
      library: "blue",
      post_office: "blue",
      police: "blue",
      fire_station: "red",
      gym: "green",
      pool: "cyan",
      spa: "pink",
      golf: "green",
      tennis: "green",
      cinema: "purple",
      theater: "purple",
      stadium: "orange",
      zoo: "amber",
      aquarium: "cyan",
      amusement_park: "pink",
      casino: "purple",
      night_club: "pink",
      convenience_store: "green",
      grocery_store: "green",
      clothing_store: "purple",
      jewelry_store: "amber",
      book_store: "blue",
      electronics_store: "blue",
      hardware_store: "orange",
      car_dealer: "blue",
      car_rental: "blue",
      car_repair: "orange",
      gas_station: "yellow",
      taxi: "yellow",
      church: "amber",
      mosque: "green",
      synagogue: "blue",
      hindu_temple: "orange",
      buddhist_temple: "amber",
      city_hall: "blue",
      courthouse: "blue",
      embassy: "blue",
      beauty_salon: "pink",
      laundry: "blue",
      locksmith: "orange",
      plumber: "blue",
      electrician: "yellow",
      travel_agency: "blue",
      real_estate_agency: "green",
      lawyer: "blue",
      pet_store: "pink",
      veterinary_care: "green",
      florist: "pink",
      farm: "green",
      winery: "purple",
      brewery: "amber",
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
    // Use official Google Maps icons
    const baseUrl = "https://maps.google.com/mapfiles/";

    const iconMap: Record<string, string> = {
      // Basic location types
      waterfall: `${baseUrl}kml/paddle/blu-circle.png`,
      homestay: `${baseUrl}kml/paddle/ylw-stars.png`,
      hotel: `${baseUrl}kml/paddle/purple-square.png`,
      restaurant: `${baseUrl}kml/paddle/orange-diamond.png`,
      service: `${baseUrl}kml/paddle/grn-diamond.png`,
      attraction: `${baseUrl}kml/paddle/red-stars.png`,
      park: `${baseUrl}kml/paddle/grn-stars.png`,
      beach: `${baseUrl}kml/paddle/blu-diamond.png`,
      temple: `${baseUrl}kml/paddle/ylw-diamond.png`,
      museum: `${baseUrl}kml/paddle/purple-stars.png`,

      // Food & Dining
      cafe: `${baseUrl}kml/paddle/orange-circle.png`,
      bar: `${baseUrl}kml/paddle/pink-circle.png`,
      bakery: `${baseUrl}kml/paddle/ylw-circle.png`,

      // Healthcare
      hospital: `${baseUrl}kml/paddle/red-circle.png`,
      pharmacy: `${baseUrl}kml/paddle/grn-circle.png`,
      dentist: `${baseUrl}kml/paddle/blu-square.png`,
      doctor: `${baseUrl}kml/paddle/red-square.png`,

      // Financial
      bank: `${baseUrl}kml/paddle/wht-circle.png`,
      atm: `${baseUrl}kml/paddle/wht-diamond.png`,

      // Transportation
      gas: `${baseUrl}kml/paddle/ylw-circle.png`,
      parking: `${baseUrl}kml/paddle/wht-square.png`,
      bus: `${baseUrl}kml/paddle/blu-diamond.png`,
      train: `${baseUrl}kml/paddle/ltblu-diamond.png`,
      airport: `${baseUrl}kml/paddle/pink-diamond.png`,
      taxi: `${baseUrl}kml/paddle/ylw-diamond.png`,

      // Education
      school: `${baseUrl}kml/paddle/blu-stars.png`,
      library: `${baseUrl}kml/paddle/purple-circle.png`,
      university: `${baseUrl}kml/paddle/blu-stars.png`,

      // Government & Services
      post_office: `${baseUrl}kml/paddle/ltblu-circle.png`,
      police: `${baseUrl}kml/paddle/blu-square.png`,
      fire_station: `${baseUrl}kml/paddle/red-square.png`,

      // Recreation & Sports
      gym: `${baseUrl}kml/paddle/grn-square.png`,
      pool: `${baseUrl}kml/paddle/blu-diamond.png`,
      spa: `${baseUrl}kml/paddle/pink-square.png`,
      golf: `${baseUrl}kml/paddle/grn-stars.png`,
      tennis: `${baseUrl}kml/paddle/grn-diamond.png`,

      // Entertainment
      cinema: `${baseUrl}kml/paddle/purple-circle.png`,
      theater: `${baseUrl}kml/paddle/purple-diamond.png`,
      stadium: `${baseUrl}kml/paddle/orange-stars.png`,
      zoo: `${baseUrl}kml/paddle/grn-stars.png`,
      aquarium: `${baseUrl}kml/paddle/blu-stars.png`,
      amusement_park: `${baseUrl}kml/paddle/pink-stars.png`,
      casino: `${baseUrl}kml/paddle/purple-stars.png`,
      night_club: `${baseUrl}kml/paddle/pink-diamond.png`,

      // Shopping
      convenience_store: `${baseUrl}kml/paddle/grn-circle.png`,
      grocery_or_supermarket: "grocery_store",
      clothing_store: "clothing_store",
      jewelry_store: "jewelry_store",
      book_store: "book_store",
      electronics_store: "electronics_store",
      hardware_store: "hardware_store",

      // Automotive
      car_dealer: "car_dealer",
      car_rental: "car_rental",
      car_repair: "car_repair",

      // Religious
      church: "church",
      mosque: "mosque",
      synagogue: "synagogue",
      hindu_temple: "hindu_temple",
      buddhist_temple: "buddhist_temple",

      // Services
      beauty_salon: "beauty_salon",
      laundry: "laundry",
      locksmith: "locksmith",
      plumber: "plumber",
      electrician: "electrician",

      // Travel & Business
      travel_agency: "travel_agency",
      real_estate_agency: "real_estate_agency",
      lawyer: "lawyer",

      // Specialized
      pet_store: "pet_store",
      florist: "florist",
      farm: "farm",
      winery: "winery",
      brewery: "brewery",

      // Default fallbacks
      tourist_attraction: "attraction",
      establishment: "service",
      point_of_interest: "attraction",
    };

    // Return the icon URL with fallback
    return iconMap[type] || `${baseUrl}kml/paddle/blu-circle.png`;
  };

  const createProfileImageMarkerIcon = (location: Location) => {
    // Create a circular marker with image and label
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#9C27B0", // Purple color
      fillOpacity: 0.9,
      strokeWeight: 0,
      scale: location.status === "selected" ? 18 : 14,
      labelOrigin: new google.maps.Point(0, -2),
    };
  };

  // Add a new function to create a custom HTML marker
  const createCustomMarker = (
    map: google.maps.Map,
    position: google.maps.LatLngLiteral,
    name: string,
    imageUrl?: string
  ) => {
    // Create a div element for the marker
    const markerElement = document.createElement("div");
    markerElement.className = "custom-marker";
    markerElement.style.position = "absolute";

    // Create the label container
    const labelContainer = document.createElement("div");
    labelContainer.className = "marker-label";
    labelContainer.style.backgroundColor = "white";
    labelContainer.style.padding = "4px 8px";
    labelContainer.style.borderRadius = "4px";
    labelContainer.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    labelContainer.style.fontSize = "12px";
    labelContainer.style.fontWeight = "500";
    labelContainer.style.whiteSpace = "nowrap";
    labelContainer.style.position = "relative";
    labelContainer.style.zIndex = "1";
    labelContainer.innerText = name;

    // Create the image element
    const imageElement = document.createElement("div");
    imageElement.className = "marker-image";
    imageElement.style.width = "32px";
    imageElement.style.height = "32px";
    imageElement.style.borderRadius = "50%";
    imageElement.style.overflow = "hidden";
    imageElement.style.marginTop = "4px";
    imageElement.style.border = "2px solid white";
    imageElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    imageElement.style.backgroundColor = "#9C27B0"; // Default background color if image fails

    const img = document.createElement("img");
    // Use a more reliable placeholder or a data URI
    img.src =
      imageUrl ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    // Add error handler for the image
    img.onerror = () => {
      // If image fails to load, show a colored background with first letter
      img.style.display = "none";
      imageElement.style.display = "flex";
      imageElement.style.alignItems = "center";
      imageElement.style.justifyContent = "center";
      imageElement.style.color = "white";
      imageElement.style.fontWeight = "bold";
      imageElement.innerText = name.charAt(0).toUpperCase();
    };

    imageElement.appendChild(img);

    // Append elements to marker
    markerElement.appendChild(labelContainer);
    markerElement.appendChild(imageElement);

    // Create the overlay
    const overlay = new google.maps.OverlayView();

    overlay.onAdd = function () {
      const panes = overlay.getPanes();
      panes.overlayMouseTarget.appendChild(markerElement);
    };

    overlay.draw = function () {
      const projection = overlay.getProjection();
      if (projection) {
        const point = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(position)
        );

        if (point) {
          markerElement.style.left = point.x - 16 + "px";
          markerElement.style.top = point.y - 50 + "px"; // Position above the actual location
        }
      }
    };

    // Properly implement onRemove to handle cleanup
    overlay.onRemove = function () {
      if (markerElement.parentNode) {
        markerElement.parentNode.removeChild(markerElement);
      }
    };

    overlay.setMap(map);
    return overlay;
  };

  const createProfileImageMarkerWithBorder = (location: Location) => {
    // Create circular purple markers with ratings display
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#9C27B0", // Purple color
      fillOpacity: 0.9,
      strokeWeight: 0,
      scale: location.status === "selected" ? 18 : 14,
      labelOrigin: new google.maps.Point(0, -2),
    };
  };

  const createPropertyMarkerIcon = () => {
    // Property marker as a larger purple circle
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#9C27B0", // Purple color
      fillOpacity: 0.9,
      strokeWeight: 0,
      scale: 20,
      labelOrigin: new google.maps.Point(0, -2),
    };
  };

  const createLocationMarkerIcon = (type: string) => {
    // All locations as purple circles
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#9C27B0", // Purple color
      fillOpacity: 0.9,
      strokeWeight: 0,
      scale: 14,
      labelOrigin: new google.maps.Point(0, -2),
    };
  };

  const createCartItemMarkerIcon = () => {
    // Cart items as purple circles
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#9C27B0", // Purple color
      fillOpacity: 0.9,
      strokeWeight: 0,
      scale: 16,
      labelOrigin: new google.maps.Point(0, -2),
    };
  };

  const fetchNearbyPlaces = async () => {
    if (!map || !googleMapsApiKey) {
      generateFallbackLocations();
      return;
    }

    setIsLoadingPlaces(true);

    try {
      // Use the Places Service but be prepared for it to be deprecated
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

        // If we got results, process them
        if (allResults.length > 0) {
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
                  place.photos?.map((photo) =>
                    photo.getUrl({ maxWidth: 300 })
                  ) || [],
                phone: place.formatted_phone_number,
                website: place.website,
                address: place.vicinity,
                openingHours: place.opening_hours?.weekday_text?.join(", "),
                priceLevel: place.price_level,
              };
            });

          setNearbyLocations(locations);
        } else {
          // If no results, use fallback
          generateFallbackLocations();
        }
      } catch (error) {
        console.error("Error fetching nearby places:", error);
        generateFallbackLocations();
      }
    } catch (error) {
      console.error("Error initializing Places service:", error);
      generateFallbackLocations();
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const getLocationTypeFromGoogleType = (
    googleType: string
  ): Location["type"] => {
    const typeMap: Record<string, Location["type"]> = {
      // Natural features
      natural_feature: "waterfall",
      waterfall: "waterfall",

      // Accommodation
      lodging: "homestay",
      hotel: "hotel",

      // Food & Dining
      restaurant: "restaurant",
      cafe: "cafe",
      bar: "bar",
      bakery: "bakery",

      // Healthcare
      hospital: "hospital",
      pharmacy: "pharmacy",
      dentist: "dentist",
      doctor: "doctor",
      veterinary_care: "veterinary_care",

      // Financial
      bank: "bank",
      atm: "atm",

      // Transportation
      gas_station: "gas_station",
      parking: "parking",
      bus_station: "bus",
      train_station: "train",
      airport: "airport",
      taxi_stand: "taxi",

      // Education
      school: "school",
      library: "library",
      university: "school",

      // Government & Services
      post_office: "post_office",
      police: "police",
      fire_station: "fire_station",
      city_hall: "city_hall",
      courthouse: "courthouse",
      embassy: "embassy",

      // Recreation & Sports
      gym: "gym",
      swimming_pool: "pool",
      spa: "spa",
      golf_course: "golf",
      tennis_court: "tennis",

      // Entertainment
      movie_theater: "cinema",
      theater: "theater",
      stadium: "stadium",
      zoo: "zoo",
      aquarium: "aquarium",
      amusement_park: "amusement_park",
      casino: "casino",
      night_club: "night_club",

      // Shopping
      convenience_store: "convenience_store",
      grocery_or_supermarket: "grocery_store",
      clothing_store: "clothing_store",
      jewelry_store: "jewelry_store",
      book_store: "book_store",
      electronics_store: "electronics_store",
      hardware_store: "hardware_store",

      // Automotive
      car_dealer: "car_dealer",
      car_rental: "car_rental",
      car_repair: "car_repair",

      // Religious
      church: "church",
      mosque: "mosque",
      synagogue: "synagogue",
      hindu_temple: "hindu_temple",
      buddhist_temple: "buddhist_temple",

      // Services
      beauty_salon: "beauty_salon",
      laundry: "laundry",
      locksmith: "locksmith",
      plumber: "plumber",
      electrician: "electrician",

      // Travel & Business
      travel_agency: "travel_agency",
      real_estate_agency: "real_estate_agency",
      lawyer: "lawyer",

      // Specialized
      pet_store: "pet_store",
      florist: "florist",
      farm: "farm",
      winery: "winery",
      brewery: "brewery",

      // Default fallbacks
      tourist_attraction: "attraction",
      establishment: "service",
      point_of_interest: "attraction",
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

  const calculateOptimalRoute = (items: CartItem[]): CartItem[] => {
    if (items.length <= 2) return items;

    const unvisited = [...items];
    const route: CartItem[] = [];

    // Start with the first item (usually the hotel)
    const start = unvisited.shift()!;
    route.push(start);

    while (unvisited.length > 0) {
      const current = route[route.length - 1];
      let nearestIndex = 0;
      let minDistance = Infinity;

      // Find the nearest unvisited item
      for (let i = 0; i < unvisited.length; i++) {
        const item = unvisited[i];
        if (current.position && item.position) {
          const distance = calculateDistance(
            current.position.lat,
            current.position.lng,
            item.position.lat,
            item.position.lng
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
          }
        }
      }

      // Add the nearest item to the route
      route.push(unvisited.splice(nearestIndex, 1)[0]);
    }

    return route;
  };

  const calculateRoutesBetweenCartItems = () => {
    if (cartItems.length < 2) {
      setRouteSegments([]);
      setTotalTripDistance(0);
      return;
    }

    const segments: RouteSegment[] = [];
    let totalDistance = 0;

    // Use optimal route if enabled and we have more than 2 items
    const orderedItems =
      useOptimalRoute && cartItems.length > 2
        ? calculateOptimalRoute([...cartItems])
        : cartItems;

    // Create route segments
    for (let i = 0; i < orderedItems.length - 1; i++) {
      const currentItem = orderedItems[i];
      const nextItem = orderedItems[i + 1];

      if (currentItem.position && nextItem.position) {
        const distance = calculateDistance(
          currentItem.position.lat,
          currentItem.position.lng,
          nextItem.position.lat,
          nextItem.position.lng
        );

        segments.push({
          from: currentItem,
          to: nextItem,
          distance,
        });

        totalDistance += distance;
      }
    }

    setRouteSegments(segments);
    setTotalTripDistance(totalDistance);
  };

  const getRouteColor = (index: number) => {
    const colors = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#8B5CF6", // Purple
      "#06B6D4", // Cyan
      "#F97316", // Orange
      "#EC4899", // Pink
    ];
    return colors[index % colors.length];
  };

  const getRouteOpacity = (index: number) => {
    return 0.6 + index * 0.1;
  };

  const getCartItemColor = (item: CartItem) => {
    const colorMap: Record<string, string> = {
      hotel: "#3B82F6",
      homestay: "#8B5CF6",
      experience: "#10B981",
      attraction: "#EF4444",
      restaurant: "#F97316",
      service: "#059669",
      waterfall: "#0EA5E9",
      park: "#10B981",
      beach: "#06B6D4",
      temple: "#F59E0B",
      museum: "#8B5CF6",
    };

    return colorMap[item.type || "service"] || "#6B7280";
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
        profileImage:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center",
        status: "active",
        taskInfo: {
          title: "Maintain hiking trails",
          taskId: "T22001",
          company: "Nature Trails Inc.",
          timeSlot: "08:00 AM - 11:30 AM",
          nextJob: "02:00 PM - 04:00 PM",
        },
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
        profileImage:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&crop=center",
        status: "selected",
        taskInfo: {
          title: "Fix broken heating vent",
          taskId: "J22008",
          company: "Lions Dane Inc.",
          timeSlot: "09:30 AM - 12:45 PM",
          nextJob: "02:00 PM - 04:00 PM",
        },
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
        profileImage:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=center",
        status: "active",
        taskInfo: {
          title: "Kitchen equipment maintenance",
          taskId: "R22015",
          company: "Culinary Services Ltd.",
          timeSlot: "10:00 AM - 01:00 PM",
        },
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
        profileImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
        status: "inactive",
        taskInfo: {
          title: "Cable car inspection",
          taskId: "A22022",
          company: "Mountain Transport Co.",
          timeSlot: "11:00 AM - 02:00 PM",
        },
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
        profileImage:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center",
        status: "completed",
        taskInfo: {
          title: "Garden maintenance completed",
          taskId: "P22005",
          company: "Green Thumb Services",
          timeSlot: "07:00 AM - 10:00 AM",
        },
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
        phone: "+91 98765 43213",
        profileImage:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center",
        status: "active",
        taskInfo: {
          title: "Inventory check",
          taskId: "S22012",
          company: "Market Management Ltd.",
          timeSlot: "09:00 AM - 12:00 PM",
        },
      },
    ];
    setNearbyLocations(locations);
  };

  useEffect(() => {
    if (isLoaded && map) {
      console.log("Property coordinates:", propertyCoords);
      fetchNearbyPlaces();

      // Clear any existing markers first
      customMarkers.forEach((marker) => marker.setMap(null));

      const newMarkers: google.maps.OverlayView[] = [];

      // Create property marker
      if (propertyCoords.lat && propertyCoords.lng) {
        const propertyMarker = createCustomMarker(
          map,
          propertyCoords,
          propertyName,
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&crop=center"
        );
        newMarkers.push(propertyMarker);
      }

      // Create markers for nearby locations
      nearbyLocations.forEach((location) => {
        const locationMarker = createCustomMarker(
          map,
          location.position,
          location.name,
          location.profileImage
        );
        newMarkers.push(locationMarker);
      });

      // Store the new markers
      setCustomMarkers(newMarkers);

      // Add a custom control to the map for better navigation
      const centerControlDiv = document.createElement("div");
      const centerControl = new CenterControl(
        centerControlDiv,
        map,
        propertyCoords
      );
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        centerControlDiv
      );

      return () => {
        // Clean up custom markers when component unmounts
        newMarkers.forEach((marker) => marker.setMap(null));
      };
    } else if (latitude && longitude) {
      generateFallbackLocations();
    }
  }, [isLoaded, map, latitude, longitude, nearbyLocations, propertyName]);

  // Clean up markers when component unmounts
  useEffect(() => {
    return () => {
      customMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [customMarkers]);

  useEffect(() => {
    if (showCartItems && cartItems.length > 0) {
      calculateRoutesBetweenCartItems();
    }
  }, [cartItems, showCartItems, useOptimalRoute]);

  // Add hover effects to markers
  const handleMarkerMouseOver = (locationId: string) => {
    setHoveredLocation(locationId);
  };

  const handleMarkerMouseOut = () => {
    setHoveredLocation(null);
  };

  // Update the marker creation to include hover effects
  const getMarkerOptions = (location: Location) => {
    const isHovered = hoveredLocation === location.id;

    return {
      position: location.position,
      icon: {
        ...createProfileImageMarkerWithBorder(location),
        scaledSize: new window.google.maps.Size(
          isHovered ? 42 : 36,
          isHovered ? 42 : 36
        ),
      },
      animation: isHovered ? google.maps.Animation.BOUNCE : null,
      zIndex: isHovered ? 1000 : 1,
    };
  };

  // Custom control for re-centering the map
  class CenterControl {
    constructor(
      controlDiv: HTMLElement,
      map: google.maps.Map,
      center: google.maps.LatLngLiteral
    ) {
      // Set CSS for the control border
      const controlUI = document.createElement("div");
      controlUI.style.backgroundColor = "#fff";
      controlUI.style.border = "2px solid #fff";
      controlUI.style.borderRadius = "3px";
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlUI.style.cursor = "pointer";
      controlUI.style.marginBottom = "22px";
      controlUI.style.marginRight = "10px";
      controlUI.style.textAlign = "center";
      controlUI.title = "Click to recenter the map";
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior
      const controlText = document.createElement("div");
      controlText.style.color = "rgb(25,25,25)";
      controlText.style.fontFamily = "Roboto,Arial,sans-serif";
      controlText.style.fontSize = "12px";
      controlText.style.lineHeight = "38px";
      controlText.style.paddingLeft = "10px";
      controlText.style.paddingRight = "10px";
      controlText.innerHTML = "Center Map";
      controlUI.appendChild(controlText);

      // Setup the click event listener
      controlUI.addEventListener("click", () => {
        map.setCenter(center);
        map.setZoom(14);
      });
    }
  }

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

  // const MapLegend = () => (
  //   <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
  //     <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
  //       <MapIcon className="w-4 h-4" />
  //       Map Legend
  //     </h4>
  //     <div className="grid grid-cols-2 gap-3">
  //       {[
  //         { type: "homestay", label: "Homestay" },
  //         { type: "hotel", label: "Hotel" },
  //         { type: "restaurant", label: "Restaurant" },
  //         { type: "attraction", label: "Attraction" },
  //         { type: "waterfall", label: "Waterfall" },
  //         { type: "park", label: "Park" },
  //       ].map((item) => (
  //         <div key={item.type} className="flex items-center gap-2 text-xs">
  //           <img
  //             src={getGoogleMapsIcon(item.type)}
  //             alt={item.label}
  //             className="w-6 h-6 object-contain"
  //           />
  //           <span className="text-gray-700">{item.label}</span>
  //         </div>
  //       ))}
  //     </div>
  //     <div className="mt-3 pt-2 border-t border-gray-200">
  //       <div className="flex items-center gap-2 text-xs">
  //         <img
  //           src="https://maps.google.com/mapfiles/kml/pal3/icon21.png"
  //           alt="Your Property"
  //           className="w-6 h-6 object-contain"
  //         />
  //         <span className="text-gray-700 font-medium">Your Property</span>
  //       </div>
  //     </div>
  //   </div>
  // );

  const CartItemsLegend = () => (
    <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
      <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        Your Trip Items
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {cartItems.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <div
              className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
              style={{ backgroundColor: getCartItemColor(item) }}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 truncate">
                {item.title || item.name}
              </div>
              <div className="text-gray-500 text-xs">
                {item.type} • {item.location}
              </div>
            </div>
          </div>
        ))}
      </div>

      {routeSegments.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700">Total Distance:</span>
              <span className="font-medium text-blue-600">
                {totalTripDistance.toFixed(1)} km
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700">Route Segments:</span>
              <span className="font-medium text-green-600">
                {routeSegments.length}
              </span>
            </div>
            {routeSegments.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {routeSegments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {index + 1}. {segment.from.title || segment.from.name} →{" "}
                      {segment.to.title || segment.to.name}
                    </span>
                    <span className="font-medium">
                      {segment.distance.toFixed(1)} km
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRoutes(!showRoutes)}
          className="flex-1 text-xs h-8"
        >
          {showRoutes ? "Hide" : "Show"} Routes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (map && cartItems.length > 0) {
              const bounds = new google.maps.LatLngBounds();
              cartItems.forEach((item) => {
                if (item.position) {
                  bounds.extend(item.position);
                }
              });
              map.fitBounds(bounds);
            }
          }}
          className="text-xs h-8"
          title="Fit all items in view"
        >
          <Maximize2 className="w-3 h-3" />
        </Button>
      </div>

      {cartItems.length > 2 && (
        <div className="mt-2">
          <Button
            variant={useOptimalRoute ? "default" : "outline"}
            size="sm"
            onClick={() => setUseOptimalRoute(!useOptimalRoute)}
            className="w-full text-xs h-8"
          >
            {useOptimalRoute ? "✓" : "⚡"} Optimal Route
          </Button>
        </div>
      )}
    </div>
  );

  const LocationDetailCard = ({ location }: { location: Location }) => (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full mx-4">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={
                location.profileImage ||
                "https://via.placeholder.com/60/6B7280/FFFFFF?text=?"
              }
              alt={location.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                location.status === "selected"
                  ? "bg-blue-500"
                  : location.status === "active"
                  ? "bg-green-500"
                  : location.status === "completed"
                  ? "bg-gray-500"
                  : "bg-red-500"
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">
              {location.name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {location.status || "active"}
            </p>
          </div>
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>

        {location.taskInfo && (
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Clipboard className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {location.taskInfo.title}
                </p>
                <p className="text-sm text-gray-600">
                  #{location.taskInfo.taskId} • {location.taskInfo.company}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{location.address}</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  Navigate
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {location.taskInfo.timeSlot}
                </p>
                {location.taskInfo.nextJob && (
                  <p className="text-sm text-gray-600">
                    Next job at {location.taskInfo.nextJob}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        </div>
      </div>
    </div>
  );

  // Enhanced map styling for better visual appeal - update to match image
  const mapStyles = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ color: "#fefefe" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#fefefe" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }],
    },
  ];

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

      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>
            {showCartItems
              ? `${cartItems.length} trip items`
              : `${filteredLocations.length} locations found`}
          </span>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={propertyCoords}
        zoom={14}
        onLoad={setMap}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: mapStyles,
        }}
      >
        {/* Fallback property marker if custom markers aren't working */}
        {propertyCoords.lat &&
          propertyCoords.lng &&
          customMarkers.length === 0 && (
            <Marker
              position={propertyCoords}
              icon={createPropertyMarkerIcon()}
              zIndex={1000}
            />
          )}

        {/* Only show route lines and cart items */}
        {showCartItems &&
          cartItems.map((item, index) => {
            if (!item.position) return null;
            return (
              <Marker
                key={item.id}
                position={item.position}
                icon={createCartItemMarkerIcon()}
                onClick={() => {
                  const routeInfo = routeSegments.find(
                    (segment) =>
                      segment.from.id === item.id || segment.to.id === item.id
                  );

                  setSelectedLocation({
                    id: item.id,
                    name: item.title || item.name || "Cart Item",
                    type: (item.type as any) || "service",
                    position: item.position!,
                    rating: item.rating,
                    distance: item.distance,
                    description: `Selected for your trip: ${
                      item.title || item.name
                    }${
                      routeInfo
                        ? `\n\nRoute Info: ${
                            routeInfo.from.title || routeInfo.from.name
                          } → ${
                            routeInfo.to.title || routeInfo.to.name
                          } (${routeInfo.distance.toFixed(1)} km)`
                        : ""
                    }`,
                    icon: ShoppingCart,
                    color: getCartItemColor(item),
                    address: item.location || "",
                    profileImage:
                      item.imageUrl || "https://via.placeholder.com/100",
                    status: "selected",
                    taskInfo: {
                      title: item.title || item.name || "Trip Item",
                      taskId: `T${String(index + 1).padStart(5, "0")}`,
                      company: "Your Trip",
                      timeSlot: "Flexible timing",
                    },
                  });
                }}
                label={{
                  text: item.rating?.toString() || "",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                zIndex={1000 + index}
              />
            );
          })}

        {showCartItems &&
          showRoutes &&
          routeSegments.map((segment, index) => (
            <Polyline
              key={`route-${index}`}
              path={[segment.from.position!, segment.to.position!]}
              options={{
                strokeColor: "#9C27B0",
                strokeOpacity: 0.6,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
          ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.position}
            onCloseClick={() => setSelectedLocation(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -20),
              maxWidth: 300,
              disableAutoPan: false,
            }}
          >
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-base">
                  {selectedLocation.name}
                </h3>
                {selectedLocation.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">
                      {selectedLocation.rating}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {getLocationTypeLabel(selectedLocation.type)}
              </p>

              {selectedLocation.distance !== undefined && (
                <p className="text-xs text-gray-600 mt-2">
                  {selectedLocation.distance} km from property
                </p>
              )}

              <Button
                size="sm"
                variant="default"
                className="w-full mt-3 bg-[#9C27B0] hover:bg-[#7B1FA2]"
                onClick={() => handleDirections(selectedLocation)}
              >
                Get Directions
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Simplify UI by removing legends when not needed */}
      {/* {!selectedLocation && !showCartItems && <MapLegend />}
      {!selectedLocation && showCartItems && <CartItemsLegend />} */}
    </div>
  );
};

export default PropertyMap;
