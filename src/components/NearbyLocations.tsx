import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Filter,
  Map,
  ExternalLink,
  Heart,
  Share,
  Clock,
  Phone,
  Globe,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  Zap,
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
  category: "experiences" | "services" | "accommodations";
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
  imageUrl?: string;
  isPopular?: boolean;
  isTrending?: boolean;
  tags?: string[];
}

interface NearbyLocationsProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  showMap?: boolean;
  onLocationClick?: (location: Location) => void;
}

const NearbyLocations = ({
  latitude,
  longitude,
  propertyName,
  showMap = false,
  onLocationClick,
}: NearbyLocationsProps) => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);

  const locationTypes = [
    { value: "all", label: "All Places", icon: MapPin, count: 0 },
    { value: "experiences", label: "Experiences", icon: Mountain, count: 0 },
    { value: "services", label: "Services", icon: ShoppingBag, count: 0 },
    { value: "accommodations", label: "Accommodations", icon: Hotel, count: 0 },
  ];

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

  const generateSampleLocations = () => {
    const sampleLocations: Location[] = [
      {
        id: "waterfall1",
        name: "Kempty Falls",
        type: "waterfall",
        category: "experiences",
        position: { lat: latitude + 0.02, lng: longitude + 0.01 },
        rating: 4.5,
        distance: 2.1,
        description: "Popular waterfall with scenic views and trekking trails",
        icon: Droplets,
        color: "blue",
        address: "Kempty Falls Road, Mussoorie",
        openingHours: "Open daily 6:00 AM - 6:00 PM",
        phone: "+91 98765 43212",
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        isPopular: true,
        tags: ["Waterfall", "Trekking", "Scenic"],
      },
      {
        id: "homestay1",
        name: "Pine View Homestay",
        type: "homestay",
        category: "accommodations",
        position: { lat: latitude + 0.025, lng: longitude - 0.005 },
        rating: 4.6,
        distance: 2.8,
        description: "Family-run homestay with garden and mountain views",
        icon: Home,
        color: "purple",
        address: "Pine View Road, Mussoorie",
        phone: "+91 98765 43210",
        website: "https://pineview.com",
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        isTrending: true,
        tags: ["Homestay", "Family-friendly", "Mountain View"],
      },
      {
        id: "restaurant1",
        name: "Mountain View Restaurant",
        type: "restaurant",
        category: "experiences",
        position: { lat: latitude + 0.005, lng: longitude - 0.008 },
        rating: 4.4,
        distance: 0.9,
        description: "Cozy restaurant with mountain views and local cuisine",
        icon: Utensils,
        color: "orange",
        address: "Mall Road, Mussoorie",
        openingHours: "Open daily 8:00 AM - 10:00 PM",
        phone: "+91 98765 43211",
        priceLevel: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        tags: ["Restaurant", "Local Cuisine", "Mountain View"],
      },
      {
        id: "attraction1",
        name: "Gun Hill",
        type: "attraction",
        category: "experiences",
        position: { lat: latitude + 0.03, lng: longitude - 0.02 },
        rating: 4.8,
        distance: 3.5,
        description: "Famous viewpoint and cable car with panoramic views",
        icon: Mountain,
        color: "red",
        address: "Gun Hill Road, Mussoorie",
        openingHours: "Open daily 9:00 AM - 5:00 PM",
        website: "https://gunhill.com",
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        isPopular: true,
        tags: ["Viewpoint", "Cable Car", "Panoramic"],
      },
      {
        id: "park1",
        name: "Municipal Garden",
        type: "park",
        category: "experiences",
        position: { lat: latitude - 0.01, lng: longitude + 0.015 },
        rating: 4.2,
        distance: 1.5,
        description: "Beautiful garden with walking trails and picnic spots",
        icon: TreePine,
        color: "emerald",
        address: "Library Road, Mussoorie",
        openingHours: "Open daily 6:00 AM - 8:00 PM",
        imageUrl:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        tags: ["Garden", "Walking", "Picnic"],
      },
      {
        id: "service1",
        name: "Local Market",
        type: "service",
        category: "services",
        position: { lat: latitude - 0.008, lng: longitude + 0.015 },
        rating: 4.0,
        distance: 1.8,
        description: "Local grocery and essentials market",
        icon: ShoppingBag,
        color: "green",
        address: "Market Road, Mussoorie",
        openingHours: "Open daily 7:00 AM - 9:00 PM",
        phone: "+91 98765 43213",
        imageUrl:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        tags: ["Market", "Grocery", "Essentials"],
      },
      {
        id: "temple1",
        name: "Hanuman Temple",
        type: "temple",
        category: "experiences",
        position: { lat: latitude + 0.015, lng: longitude + 0.02 },
        rating: 4.7,
        distance: 2.3,
        description: "Ancient temple with spiritual significance",
        icon: Building2,
        color: "amber",
        address: "Temple Road, Mussoorie",
        openingHours: "Open daily 5:00 AM - 9:00 PM",
        imageUrl:
          "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=600&fit=crop",
        tags: ["Temple", "Spiritual", "Ancient"],
      },
      {
        id: "museum1",
        name: "Local Heritage Museum",
        type: "museum",
        category: "experiences",
        position: { lat: latitude - 0.02, lng: longitude - 0.01 },
        rating: 4.1,
        distance: 2.7,
        description: "Museum showcasing local history and culture",
        icon: Camera,
        color: "violet",
        address: "Heritage Road, Mussoorie",
        openingHours: "Open daily 10:00 AM - 6:00 PM",
        website: "https://heritagemuseum.com",
        imageUrl:
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop",
        tags: ["Museum", "Heritage", "Culture"],
      },
      {
        id: "hotel1",
        name: "Royal Mountain Resort",
        type: "hotel",
        category: "accommodations",
        position: { lat: latitude + 0.01, lng: longitude + 0.02 },
        rating: 4.9,
        distance: 1.2,
        description: "Luxury resort with spa and mountain views",
        icon: Hotel,
        color: "indigo",
        address: "Resort Road, Mussoorie",
        phone: "+91 98765 43214",
        website: "https://royalmountain.com",
        priceLevel: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        isPopular: true,
        tags: ["Luxury", "Spa", "Resort"],
      },
      {
        id: "service2",
        name: "Adventure Sports Center",
        type: "service",
        category: "services",
        position: { lat: latitude + 0.015, lng: longitude - 0.01 },
        rating: 4.6,
        distance: 2.0,
        description: "Rock climbing, rappelling, and adventure activities",
        icon: Mountain,
        color: "red",
        address: "Adventure Road, Mussoorie",
        openingHours: "Open daily 8:00 AM - 6:00 PM",
        phone: "+91 98765 43215",
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        isTrending: true,
        tags: ["Adventure", "Rock Climbing", "Rappelling"],
      },
      {
        id: "hotel2",
        name: "Cozy Mountain Lodge",
        type: "hotel",
        category: "accommodations",
        position: { lat: latitude - 0.005, lng: longitude + 0.01 },
        rating: 4.3,
        distance: 1.8,
        description: "Boutique lodge with cozy rooms and fireplace",
        icon: Hotel,
        color: "indigo",
        address: "Lodge Road, Mussoorie",
        phone: "+91 98765 43216",
        priceLevel: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        tags: ["Boutique", "Cozy", "Fireplace"],
      },
      {
        id: "service3",
        name: "Local Pharmacy",
        type: "service",
        category: "services",
        position: { lat: latitude + 0.008, lng: longitude - 0.005 },
        rating: 4.2,
        distance: 1.1,
        description: "24/7 pharmacy with essential medicines",
        icon: ShoppingBag,
        color: "green",
        address: "Medical Road, Mussoorie",
        openingHours: "Open 24/7",
        phone: "+91 98765 43217",
        imageUrl:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        tags: ["Pharmacy", "24/7", "Medicine"],
      },
      {
        id: "restaurant2",
        name: "Café De Mussoorie",
        type: "restaurant",
        category: "experiences",
        position: { lat: latitude - 0.012, lng: longitude + 0.008 },
        rating: 4.7,
        distance: 1.6,
        description: "Charming café with coffee and pastries",
        icon: Coffee,
        color: "orange",
        address: "Café Street, Mussoorie",
        openingHours: "Open daily 7:00 AM - 9:00 PM",
        phone: "+91 98765 43218",
        priceLevel: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        isTrending: true,
        tags: ["Café", "Coffee", "Pastries"],
      },
      {
        id: "service4",
        name: "Car Rental Service",
        type: "service",
        category: "services",
        position: { lat: latitude + 0.02, lng: longitude - 0.015 },
        rating: 4.4,
        distance: 2.5,
        description: "Reliable car rental for local exploration",
        icon: Car,
        color: "blue",
        address: "Transport Road, Mussoorie",
        openingHours: "Open daily 8:00 AM - 8:00 PM",
        phone: "+91 98765 43219",
        imageUrl:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        tags: ["Car Rental", "Transport", "Exploration"],
      },
    ];
    return sampleLocations;
  };

  useEffect(() => {
    setIsLoading(true);
    const sampleLocations = generateSampleLocations();
    setLocations(sampleLocations);
    setFilteredLocations(sampleLocations);
    setIsLoading(false);
  }, [latitude, longitude]);

  useEffect(() => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          location.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(
        (location) => location.category === selectedType
      );
    }

    setFilteredLocations(filtered);
  }, [locations, searchTerm, selectedType]);

  const handleLocationClick = (location: Location) => {
    if (onLocationClick) {
      onLocationClick(location);
    } else {
      navigate(`/location/${location.id}`);
    }
  };

  const handleCardClick = (location: Location) => {
    const serializableLocation = {
      id: location.id,
      name: location.name,
      type: location.type,
      category: location.category,
      position: location.position,
      rating: location.rating,
      distance: location.distance,
      description: location.description,
      color: location.color,
      placeId: location.placeId,
      photos: location.photos,
      phone: location.phone,
      website: location.website,
      address: location.address,
      openingHours: location.openingHours,
      priceLevel: location.priceLevel,
      imageUrl: location.imageUrl,
      isPopular: location.isPopular,
      isTrending: location.isTrending,
      tags: location.tags,
    };
    navigate(`/location/${location.id}`, {
      state: { location: serializableLocation },
    });
  };

  const handleDirections = (location: Location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
    window.open(url, "_blank");
  };

  const handleFavoriteToggle = (locationId: string) => {
    setFavorites((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  const getLocationsByCategory = (category: string) => {
    return filteredLocations.filter(
      (location) => location.category === category
    );
  };

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      experiences: Sparkles,
      services: Zap,
      accommodations: Hotel,
    };
    return iconMap[category as keyof typeof iconMap] || MapPin;
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      experiences: "purple",
      services: "green",
      accommodations: "indigo",
    };
    return colorMap[category as keyof typeof colorMap] || "gray";
  };

  const getCategoryTitle = (category: string) => {
    const titleMap = {
      experiences: "Unforgettable Experiences",
      services: "Essential Services",
      accommodations: "Places to Stay",
    };
    return titleMap[category as keyof typeof titleMap] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Discovering amazing places...</p>
          <p className="text-gray-500 text-sm mt-2">
            Loading nearby attractions and services
          </p>
        </div>
      </div>
    );
  }

  const categories = ["experiences", "services", "accommodations"];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Nearby Experiences & Services
        </h2>
        <p className="text-gray-600 text-lg">
          Discover amazing experiences and essential services around{" "}
          {propertyName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Experiences</p>
              <p className="text-2xl font-bold text-purple-900">
                {getLocationsByCategory("experiences").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-200 rounded-lg">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Services</p>
              <p className="text-2xl font-bold text-green-900">
                {getLocationsByCategory("services").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-200 rounded-lg">
              <Hotel className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">
                Accommodations
              </p>
              <p className="text-2xl font-bold text-indigo-900">
                {getLocationsByCategory("accommodations").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for experiences, services, or places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-base border-2 focus:border-blue-500 shadow-md"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full lg:w-64 h-12 text-base border-2 shadow-md">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {locationTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{type.label}</span>
                    {type.count > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {type.count}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
            className="h-12 px-4 shadow-md"
          >
            <Grid className="w-5 h-5 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="h-12 px-4 shadow-md"
          >
            <List className="w-5 h-5 mr-2" />
            List
          </Button>
        </div>
      </div>

      {filteredLocations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No experiences or services found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
            }}
            className="shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryLocations = getLocationsByCategory(category);
            if (categoryLocations.length === 0) return null;

            const CategoryIcon = getCategoryIcon(category);
            const categoryColor = getCategoryColor(category);

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl bg-${categoryColor}-100 shadow-sm`}
                    >
                      <CategoryIcon
                        className={`w-6 h-6 text-${categoryColor}-600`}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {getCategoryTitle(category)}
                      </h3>
                      <p className="text-gray-600">
                        {categoryLocations.length} {category} found nearby
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {category === "experiences" && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {category === "accommodations" && (
                      <Badge
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-800"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Top Rated
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-2 hover:border-blue-500 hover:bg-blue-50 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      View All {category}
                    </Button>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categoryLocations.map((location) => (
                      <Card
                        key={location.id}
                        className="group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 bg-white/95 backdrop-blur-sm"
                        onClick={() => handleCardClick(location)}
                      >
                        <div className="relative">
                          <div className="h-32 relative overflow-hidden">
                            {location.imageUrl ? (
                              <img
                                src={location.imageUrl}
                                alt={location.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <div
                                className={`h-full bg-gradient-to-br from-${location.color}-50 to-${location.color}-100 flex items-center justify-center`}
                              >
                                <location.icon
                                  className={`w-12 h-12 text-${location.color}-600 transition-transform group-hover:scale-110`}
                                />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>

                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            {location.isPopular && (
                              <Badge className="bg-red-100 text-red-800 border-red-200 text-xs shadow-md">
                                Popular
                              </Badge>
                            )}
                            {location.isTrending && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs shadow-md">
                                Trending
                              </Badge>
                            )}
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(location.id);
                            }}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.includes(location.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600"
                              }`}
                            />
                          </Button>

                          {location.rating && (
                            <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                              <div className="flex items-center text-xs font-semibold">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                {location.rating}
                              </div>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="mb-3">
                            <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
                              {location.name}
                            </h4>
                            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                              {location.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-gray-600 text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="font-medium">
                                {location.distance}km
                              </span>
                            </div>
                            {location.openingHours && (
                              <div className="flex items-center text-green-600 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className="font-medium">Open</span>
                              </div>
                            )}
                          </div>

                          {location.tags && location.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {location.tags.slice(0, 2).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 bg-gray-50 shadow-sm"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categoryLocations.map((location) => (
                      <LocationCard
                        key={location.id}
                        location={location}
                        variant="compact"
                        onClick={() => handleCardClick(location)}
                        showActions={false}
                        showAddToCart={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center pt-8">
        <Button
          variant="outline"
          size="lg"
          className="border-blue-300 text-blue-700 hover:bg-blue-100 px-8 py-3 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          View All Nearby Experiences & Services
        </Button>
      </div>
    </div>
  );
};

export default NearbyLocations;
