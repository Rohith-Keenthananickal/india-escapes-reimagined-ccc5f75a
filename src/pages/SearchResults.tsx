import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow, OverlayView } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Heart,
  Map,
  List,
  Users,
  Bed,
  Bath,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { GoogleMapsLoader } from "@/components/GoogleMapsLoader";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  host: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  position: { lat: number; lng: number };
  isNew?: boolean;
  isCertified?: boolean;
  isSuperhost?: boolean;
}

// Custom Price Marker Component
const PriceMarker = ({ property, onClick, isSelected }: { 
  property: Property; 
  onClick: () => void; 
  isSelected: boolean;
}) => {
  return (
    <OverlayView
      position={property.position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={onClick}
        className={`
          cursor-pointer transform transition-all duration-200 hover:scale-110
          ${isSelected ? 'z-50' : 'z-10'}
        `}
      >
                       <div className={`
                 border-2 rounded-lg shadow-lg px-3 py-2 min-w-[80px]
                 ${isSelected
                   ? 'bg-black shadow-xl scale-110 z-50'
                   : 'bg-white border-gray-300 hover:border-pink-400'
                 }
               `}>
                 <div className="text-center">
                   <div className={`text-sm font-bold ${
                     isSelected ? 'text-white' : 'text-gray-900'
                   }`}>
                     ₹{property.price.toLocaleString()}
                   </div>
            {/* <div className="text-xs text-gray-500">
              per night
            </div>
            {property.isNew && (
              <div className="text-xs text-green-600 font-medium mt-1">
                NEW
              </div>
            )} */}
            {/* {property.isSuperhost && (
              <div className="text-xs text-purple-600 font-medium mt-1">
                SUPERHOST
              </div>
            )} */}
          </div>
        </div>
        {/* Arrow pointing down */}
        <div className="flex justify-center">
          <div className={`
            w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent
            ${isSelected ? 'border-t-pink-500' : 'border-t-gray-300'}
          `}></div>
        </div>
      </div>
    </OverlayView>
  );
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showPropertyOverlay, setShowPropertyOverlay] = useState(false);

  // Get search parameters
  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "1";

  // Mock properties data - in a real app, this would come from an API
  const [properties] = useState<Property[]>([
    {
      id: 1,
      title: "Fort Kochi Heritage Villa",
      location: "Fort Kochi, Ernakulam",
      price: 4500,
      rating: 4.8,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Priya",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["Wifi", "Kitchen", "Parking", "Sea View"],
      position: { lat: 9.9312, lng: 76.2673 },
      isNew: true,
    },
    {
      id: 2,
      title: "Marine Drive Luxury Apartment",
      location: "Marine Drive, Ernakulam",
      price: 6500,
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      host: "Arjun",
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ["AC", "Pool", "Wifi", "Garden"],
      position: { lat: 9.9312, lng: 76.2673 },
      isCertified: true,
    },
    {
      id: 3,
      title: "Mattancherry Traditional House",
      location: "Mattancherry, Kochi",
      price: 3800,
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Sunita",
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ["Boat", "Wifi", "Kitchen", "Backwater View"],
      position: { lat: 9.9579, lng: 76.2529 },
    },
    {
      id: 4,
      title: "Jew Town Heritage Stay",
      location: "Jew Town, Kochi",
      price: 4200,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      host: "Rajesh",
      guests: 5,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["Fireplace", "Wifi", "Parking", "Historic Area"],
      position: { lat: 9.9579, lng: 76.2529 },
      isNew: true,
    },
    {
      id: 5,
      title: "Willingdon Island Waterfront",
      location: "Willingdon Island, Kochi",
      price: 7500,
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Maria",
      guests: 10,
      bedrooms: 5,
      bathrooms: 4,
      amenities: ["Beach Access", "Pool", "BBQ", "Ocean View"],
      position: { lat: 9.9489, lng: 76.2739 },
      isSuperhost: true,
    },
    {
      id: 6,
      title: "Bolghatty Palace Homestay",
      location: "Bolghatty Island, Kochi",
      price: 8500,
      rating: 4.8,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      host: "Maharaja",
      guests: 12,
      bedrooms: 6,
      bathrooms: 5,
      amenities: ["Butler", "Pool", "Spa", "Palace View"],
      position: { lat: 9.9489, lng: 76.2739 },
      isCertified: true,
    },
    {
      id: 7,
      title: "Vypeen Island Beach House",
      location: "Vypeen Island, Kochi",
      price: 3200,
      rating: 4.5,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      host: "Lakshmi",
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ["Beach Access", "Wifi", "Kitchen", "Fishing"],
      position: { lat: 10.0889, lng: 76.2673 },
    },
    {
      id: 8,
      title: "Cherai Beach Villa",
      location: "Cherai Beach, Kochi",
      price: 4800,
      rating: 4.7,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      host: "Thomas",
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ["Beach Access", "Pool", "Wifi", "Water Sports"],
      position: { lat: 10.1419, lng: 76.1839 },
      isNew: true,
    },
    {
      id: 9,
      title: "Kumbalangi Village Stay",
      location: "Kumbalangi, Kochi",
      price: 2800,
      rating: 4.4,
      reviews: 76,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      host: "Antony",
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ["Backwater View", "Wifi", "Local Food", "Fishing"],
      position: { lat: 9.8579, lng: 76.2673 },
    },
    {
      id: 10,
      title: "Panampilly Nagar Luxury",
      location: "Panampilly Nagar, Ernakulam",
      price: 6800,
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      host: "Deepa",
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ["AC", "Gym", "Wifi", "City View"],
      position: { lat: 9.9312, lng: 76.2673 },
      isSuperhost: true,
    },
  ]);

  // Calculate center point for map
  const mapCenter = properties.length > 0 
    ? {
        lat: properties.reduce((sum, p) => sum + p.position.lat, 0) / properties.length,
        lng: properties.reduce((sum, p) => sum + p.position.lng, 0) / properties.length,
      }
    : { lat: 9.9312, lng: 76.2673 }; // Kochi center

  // Custom map styling for a modern, clean look
  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#bcbcbc" }]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [{ color: "#d6d6d6" }]
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "poi.business",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "poi.medical",
      elementType: "geometry",
      stylers: [{ color: "#fbd3da" }]
    },
    {
      featureType: "poi.business",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "landscape",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "landscape.man_made",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    }
  ];

  const toggleLike = (id: number) => {
    setLikedProperties(prev =>
      prev.includes(id) ? prev.filter(propId => propId !== id) : [...prev, id]
    );
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyOverlay(true);
  };

  const handleBookNow = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  const closePropertyOverlay = () => {
    setShowPropertyOverlay(false);
    setSelectedProperty(null);
  };

  const togglePropertyLike = (propertyId: number) => {
    setLikedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Property Overlay Component
  const PropertyOverlay = ({ property }: { property: Property }) => {
    if (!property) return null;

    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-[90vw] rounded-2xl">
        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            {/* Image Section */}
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              {/* Image Carousel Dots */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full opacity-100"></div>
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
              </div>
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePropertyLike(property.id)}
                  className={`w-8 h-8 p-0 rounded-full ${
                    likedProperties.includes(property.id)
                      ? "bg-white text-red-500"
                      : "bg-white/80 text-gray-700 hover:bg-white"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedProperties.includes(property.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePropertyOverlay}
                  className="w-8 h-8 p-0 rounded-full bg-white/80 text-gray-700 hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4 bg-white">
              <div className="space-y-3">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">
                  {property.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {property.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({property.reviews})
                  </span>
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{property.bedrooms}BHK near {property.location.split(',')[0]} (Non AC)</p>
                  <p>{property.bedrooms} double beds</p>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{property.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    for 16 nights
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className=" bg-gray-50">
      <GoogleMapsLoader>
        <Navbar />

        {/* Header */}
        <div className="bg-white border-b">
          <div className=" px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span></span>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {destination || "Search Results"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {checkIn && checkOut
                      ? `${checkIn} - ${checkOut} • ${guests} guest${
                          parseInt(guests) > 1 ? "s" : ""
                        }`
                      : `${properties.length} properties found`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center space-x-2"
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="flex items-center space-x-2"
                >
                  <Map className="w-4 h-4" />
                  <span>Map</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-6">
          <div className={`grid grid-cols-1 lg:${
                viewMode === "list" ? "grid-cols-3" : "grid-cols-1 "
              } gap-6`}>
            {/* Properties List */}
            <div
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE 10+
                overflow: "auto", // Enable scrolling
              }}
              className={`${
                viewMode === "list" ? "block" : "hidden "
              } lg:col-span-2 h-[calc(100vh-200px)]`}
            >
              <div
                style={{
                  display: "none",
                }}
              >
                ::-webkit-scrollbar {/* Chrome, Safari, Opera */}
              </div>

              {/* content */}

              <div className="space-y-4">
                {properties.map((property) => (
                  <Card
                    key={property.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 md:h-32 flex-shrink-0">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {property.title}
                                </h3>
                                {property.isNew && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    New
                                  </Badge>
                                )}
                                {property.isCertified && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    Certified
                                  </Badge>
                                )}
                                {property.isSuperhost && (
                                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                                    Superhost
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {property.location}
                              </p>

                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{property.guests} guests</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Bed className="w-4 h-4" />
                                  <span>{property.bedrooms} bedrooms</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Bath className="w-4 h-4" />
                                  <span>{property.bathrooms} bathrooms</span>
                                </span>
                              </div>

                              <div className="flex items-center space-x-2 mb-3">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">
                                    {property.rating}
                                  </span>
                                  <span className="text-gray-500">
                                    ({property.reviews})
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                <div>
                                  <span className="text-lg font-semibold">
                                    ₹{property.price}
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    {" "}
                                    / night
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleLike(property.id)}
                                    className={
                                      likedProperties.includes(property.id)
                                        ? "text-red-500"
                                        : ""
                                    }
                                  >
                                    <Heart
                                      className={`w-5 h-5 ${
                                        likedProperties.includes(property.id)
                                          ? "fill-current"
                                          : ""
                                      }`}
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleBookNow(property.id)}
                                  >
                                    Book now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map */}
            <div
              className={`${
                viewMode === "map" ? "block" : "hidden lg:block"
              } lg:col-span-1`}
            >
              <Card className="h-[calc(100vh-200px)] sticky top-6 rounded-xl relative">
                <CardContent className="p-0 h-full">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={mapCenter}
                    zoom={11}
                    onLoad={() => setIsMapLoaded(true)}
                    options={{
                      // styles: mapStyles,
                      mapTypeControl: false,
                      streetViewControl: false,
                      fullscreenControl: false,
                      zoomControl: true,
                      zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_TOP,
                      },
                      scaleControl: true,
                    }}
                  >
                    {properties.map((property) => (
                      <PriceMarker
                        key={property.id}
                        property={property}
                        onClick={() => handlePropertyClick(property)}
                        isSelected={selectedProperty?.id === property.id}
                      />
                    ))}
                  </GoogleMap>
                  
                  {/* Property Overlay */}
                  {showPropertyOverlay && selectedProperty && (
                    <PropertyOverlay property={selectedProperty} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </GoogleMapsLoader>
    </div>
  );
};

export default SearchResults; 