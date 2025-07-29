import { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
  Libraries,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  Loader2,
  Maximize2,
  Minimize2,
  ShoppingCart,
  Layers,
  Navigation,
} from "lucide-react";

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
  propertyImage?: string;
  cartItems?: CartItem[];
  showCartItems?: boolean;
}

// Define libraries array outside component to prevent reloading
const mapLibraries: Libraries = ["places"];

const PropertyMap = ({
  latitude,
  longitude,
  propertyName,
  propertyImage,
  cartItems = [],
  showCartItems = false,
}: PropertyMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<CartItem | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState<google.maps.MapTypeId | null>(null);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [showRoutes, setShowRoutes] = useState(true);
  const [totalTripDistance, setTotalTripDistance] = useState(0);
  const [useOptimalRoute, setUseOptimalRoute] = useState(false);

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

  // Initialize mapType when Google Maps API is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      setMapType(window.google.maps.MapTypeId.ROADMAP);
    }
  }, [isLoaded]);

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

  // Create custom marker for property with image
  const createPropertyMarker = (map: google.maps.Map) => {
    if (!propertyCoords.lat || !propertyCoords.lng || !window.google) return null;

    // Create a div element for the marker
    const markerElement = document.createElement("div");
    markerElement.className = "property-marker";
    markerElement.style.position = "absolute";
    markerElement.style.cursor = "pointer";

    // Create the image element
    const imageElement = document.createElement("div");
    imageElement.className = "marker-image";
    imageElement.style.width = "40px";
    imageElement.style.height = "40px";
    imageElement.style.borderRadius = "50%";
    imageElement.style.overflow = "hidden";
    imageElement.style.border = "3px solid white";
    imageElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
    imageElement.style.backgroundColor = "#9C27B0"; // Default background color if image fails

    const img = document.createElement("img");
    img.src = propertyImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&crop=center";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    // Add error handler for the image
    img.onerror = () => {
      img.style.display = "none";
      imageElement.style.display = "flex";
      imageElement.style.alignItems = "center";
      imageElement.style.justifyContent = "center";
      imageElement.style.color = "white";
      imageElement.style.fontWeight = "bold";
      imageElement.style.fontSize = "16px";
      imageElement.innerText = propertyName.charAt(0).toUpperCase();
    };

    imageElement.appendChild(img);
    markerElement.appendChild(imageElement);

    // Add click handler to redirect to Google Maps
    markerElement.onclick = () => {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyName)}@${propertyCoords.lat},${propertyCoords.lng}`;
      window.open(url, "_blank");
    };

    // Add hover effects
    markerElement.onmouseenter = () => {
      markerElement.style.transform = "scale(1.1)";
      markerElement.style.transition = "transform 0.2s ease";
    };

    markerElement.onmouseleave = () => {
      markerElement.style.transform = "scale(1)";
    };

    // Create the overlay
    const overlay = new window.google.maps.OverlayView();

    overlay.onAdd = function () {
      const panes = overlay.getPanes();
      panes.overlayMouseTarget.appendChild(markerElement);
    };

    overlay.draw = function () {
      const projection = overlay.getProjection();
      if (projection) {
        const point = projection.fromLatLngToDivPixel(
          new window.google.maps.LatLng(propertyCoords)
        );

        if (point) {
          markerElement.style.left = point.x - 20 + "px";
          markerElement.style.top = point.y - 20 + "px";
        }
      }
    };

    overlay.onRemove = function () {
      if (markerElement.parentNode) {
        markerElement.parentNode.removeChild(markerElement);
      }
    };

    overlay.setMap(map);
    return overlay;
  };

  // Create custom marker for cart items
  const createCartItemMarker = (map: google.maps.Map, item: CartItem, index: number) => {
    if (!item.position || !window.google) return null;

    // Create a div element for the marker
    const markerElement = document.createElement("div");
    markerElement.className = "cart-item-marker";
    markerElement.style.position = "absolute";
    markerElement.style.cursor = "pointer";

    // Create the number badge
    const numberBadge = document.createElement("div");
    numberBadge.style.position = "absolute";
    numberBadge.style.top = "-8px";
    numberBadge.style.right = "-8px";
    numberBadge.style.width = "20px";
    numberBadge.style.height = "20px";
    numberBadge.style.borderRadius = "50%";
    numberBadge.style.backgroundColor = getCartItemColor(item);
    numberBadge.style.color = "white";
    numberBadge.style.fontSize = "12px";
    numberBadge.style.fontWeight = "bold";
    numberBadge.style.display = "flex";
    numberBadge.style.alignItems = "center";
    numberBadge.style.justifyContent = "center";
    numberBadge.style.border = "2px solid white";
    numberBadge.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";
    numberBadge.innerText = (index + 1).toString();

    // Create the image element
    const imageElement = document.createElement("div");
    imageElement.className = "marker-image";
    imageElement.style.width = "32px";
    imageElement.style.height = "32px";
    imageElement.style.borderRadius = "50%";
    imageElement.style.overflow = "hidden";
    imageElement.style.border = "2px solid white";
    imageElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    imageElement.style.backgroundColor = getCartItemColor(item);

    const img = document.createElement("img");
    img.src = item.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&crop=center";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    // Add error handler for the image
    img.onerror = () => {
      img.style.display = "none";
      imageElement.style.display = "flex";
      imageElement.style.alignItems = "center";
      imageElement.style.justifyContent = "center";
      imageElement.style.color = "white";
      imageElement.style.fontWeight = "bold";
      imageElement.style.fontSize = "14px";
      imageElement.innerText = (item.title || item.name || "?").charAt(0).toUpperCase();
    };

    imageElement.appendChild(img);
    markerElement.appendChild(imageElement);
    markerElement.appendChild(numberBadge);

    // Add click handler to show info window and redirect option
    markerElement.onclick = () => {
      setSelectedLocation(item);
    };

    // Add hover effects
    markerElement.onmouseenter = () => {
      markerElement.style.transform = "scale(1.1)";
      markerElement.style.transition = "transform 0.2s ease";
    };

    markerElement.onmouseleave = () => {
      markerElement.style.transform = "scale(1)";
    };

    // Create the overlay
    const overlay = new window.google.maps.OverlayView();

    overlay.onAdd = function () {
      const panes = overlay.getPanes();
      panes.overlayMouseTarget.appendChild(markerElement);
    };

    overlay.draw = function () {
      const projection = overlay.getProjection();
      if (projection) {
        const point = projection.fromLatLngToDivPixel(
          new window.google.maps.LatLng(item.position!)
        );

        if (point) {
          markerElement.style.left = point.x - 16 + "px";
          markerElement.style.top = point.y - 16 + "px";
        }
      }
    };

    overlay.onRemove = function () {
      if (markerElement.parentNode) {
        markerElement.parentNode.removeChild(markerElement);
      }
    };

    overlay.setMap(map);
    return overlay;
  };

  useEffect(() => {
    if (isLoaded && map) {
      // Create property marker
      createPropertyMarker(map);

      // Create cart item markers if showing cart items
      if (showCartItems && cartItems.length > 0) {
        cartItems.forEach((item, index) => {
          createCartItemMarker(map, item, index);
        });
      }
    }
  }, [isLoaded, map, latitude, longitude, propertyName, propertyImage, showCartItems, cartItems]);

  useEffect(() => {
    if (showCartItems && cartItems.length > 0) {
      calculateRoutesBetweenCartItems();
    }
  }, [cartItems, showCartItems, useOptimalRoute]);

  useEffect(() => {
    if (map && isLoaded && window.google) {
      const timer = setTimeout(() => {
        window.google.maps.event.trigger(map, "resize");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, map, isLoaded]);

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (map && window.google) {
        window.google.maps.event.trigger(map, "resize");
      }
    }, 100);
  };

  const handleMapTypeToggle = () => {
    if (!isLoaded || !window.google || !mapType) return;
    
    const newMapType = mapType === window.google.maps.MapTypeId.ROADMAP 
      ? window.google.maps.MapTypeId.SATELLITE 
      : window.google.maps.MapTypeId.ROADMAP;
    setMapType(newMapType);
    if (map) {
      map.setMapTypeId(newMapType);
    }
  };

  const handleDirections = (location: CartItem) => {
    if (location.position) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
      window.open(url, "_blank");
    }
  };

  const handleViewOnGoogleMaps = (location: CartItem) => {
    if (location.position) {
      const searchQuery = location.title || location.name || "location";
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}@${location.position.lat},${location.position.lng}`;
      window.open(url, "_blank");
    }
  };

  const handlePropertyViewOnGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyName)}@${propertyCoords.lat},${propertyCoords.lng}`;
    window.open(url, "_blank");
  };

  const handleFitBounds = () => {
    if (map && cartItems.length > 0 && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      cartItems.forEach((item) => {
        if (item.position) {
          bounds.extend(item.position);
        }
      });
      map.fitBounds(bounds);
    }
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
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleMapTypeToggle}
          className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95"
          title={mapType === (isLoaded && window.google ? window.google.maps.MapTypeId.ROADMAP : null) ? "Switch to Satellite" : "Switch to Map"}
        >
          <Layers className="w-4 h-4" />
        </Button>

        {showCartItems && cartItems.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFitBounds}
            className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95"
            title="Fit all items in view"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>
            {showCartItems
              ? `${cartItems.length} trip items`
              : propertyName}
          </span>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={propertyCoords}
        zoom={14}
        onLoad={setMap}
        mapTypeId={mapType || (isLoaded && window.google ? window.google.maps.MapTypeId.ROADMAP : undefined)}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          // Show labels in satellite mode
          styles: mapType === (isLoaded && window.google ? window.google.maps.MapTypeId.SATELLITE : null) ? [] : undefined,
        }}
      >
        {/* Show route lines between cart items */}
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

        {/* Info window for selected location */}
        {selectedLocation && selectedLocation.position && (
          <InfoWindow
            position={selectedLocation.position}
            onCloseClick={() => setSelectedLocation(null)}
            options={{
              pixelOffset: window.google ? new window.google.maps.Size(0, -20) : undefined,
              maxWidth: 300,
              disableAutoPan: false,
            }}
          >
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-base">
                  {selectedLocation.title || selectedLocation.name}
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

              <p className="text-sm text-gray-600 mt-1 capitalize">
                {selectedLocation.type || "location"}
              </p>

              {selectedLocation.location && (
                <p className="text-xs text-gray-600 mt-2">
                  {selectedLocation.location}
                </p>
              )}

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewOnGoogleMaps(selectedLocation)}
                >
                  View on Maps
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 bg-[#9C27B0] hover:bg-[#7B1FA2]"
                  onClick={() => handleDirections(selectedLocation)}
                >
                  Directions
                </Button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Property info panel when not showing cart items */}
      {!showCartItems && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            {propertyName}
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePropertyViewOnGoogleMaps}
              className="flex-1 text-xs h-8"
            >
              View on Maps
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${propertyCoords.lat},${propertyCoords.lng}`;
                window.open(url, "_blank");
              }}
              className="flex-1 text-xs h-8 bg-[#9C27B0] hover:bg-[#7B1FA2]"
            >
              Directions
            </Button>
          </div>
        </div>
      )}

      {/* Trip summary when showing cart items */}
      {showCartItems && cartItems.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Trip Summary
          </h4>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
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
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">Total Distance:</span>
                <span className="font-medium text-blue-600">
                  {totalTripDistance.toFixed(1)} km
                </span>
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
      )}
    </div>
  );
};

export default PropertyMap;
