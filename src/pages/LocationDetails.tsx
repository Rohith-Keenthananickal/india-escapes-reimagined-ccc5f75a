import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PropertyMap from "@/components/PropertyMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Heart,
  Share,
  MapPin,
  Users,
  Clock,
  Phone,
  Globe,
  Navigation,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Eye,
  Grid,
  Home,
  Mountain,
  TreePine,
  Flame,
  Map,
  ShoppingBag,
  Utensils,
  Hotel,
  Camera,
  Building2,
  Waves,
  Droplets,
  Car,
  Coffee,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  X,
  ShoppingCart,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import React from "react";

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
  icon?: any;
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

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [advancedView, setAdvancedView] = useState(false);
  const { addNearbySuggestion, nearbySuggestions } = useCart();

  const locationData: Location = location.state?.location || {
    id: "waterfall1",
    name: "Kempty Falls",
    type: "waterfall",
    category: "experiences",
    position: { lat: 30.4599, lng: 78.0648 },
    rating: 4.5,
    distance: 2.1,
    description: "Popular waterfall with scenic views and trekking trails",
    color: "blue",
    address: "Kempty Falls Road, Mussoorie",
    openingHours: "Open daily 6:00 AM - 6:00 PM",
    phone: "+91 98765 43212",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    isPopular: true,
    tags: ["Waterfall", "Trekking", "Scenic"],
  };

  const isInCart = nearbySuggestions.some(
    (suggestion) => suggestion.id === locationData.id && suggestion.selected
  );

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
      experiences: "Experience",
      services: "Service",
      accommodations: "Accommodation",
    };
    return titleMap[category as keyof typeof titleMap] || category;
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${locationData.position.lat},${locationData.position.lng}`;
    window.open(url, "_blank");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    const suggestionData = {
      id: locationData.id,
      name: locationData.name,
      type: locationData.type,
      category: locationData.category,
      rating: locationData.rating,
      distance: locationData.distance,
      imageUrl: locationData.imageUrl,
      selected: true,
    };

    addNearbySuggestion(suggestionData);
    toast({
      title: "Added to cart!",
      description: `${locationData.name} has been added to your cart.`,
    });
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  const mockReviews = [
    {
      name: "Amit Kumar",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      date: "March 2024",
      comment:
        "Absolutely beautiful place! The views are breathtaking and the experience was unforgettable. Highly recommended for nature lovers.",
    },
    {
      name: "Neha Patel",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      rating: 4,
      date: "February 2024",
      comment:
        "Great experience overall. The location is perfect and the staff was very helpful. Will definitely visit again.",
    },
  ];

  const mockAmenities = [
    { icon: MapPin, name: "Parking Available" },
    { icon: Clock, name: "Open Daily" },
    { icon: Users, name: "Family Friendly" },
    { icon: Mountain, name: "Scenic Views" },
    { icon: TreePine, name: "Nature Trails" },
    { icon: Camera, name: "Photo Opportunities" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                {locationData.name}
              </h1>
            </div>
            <Button
              variant={advancedView ? "default" : "outline"}
              onClick={() => setAdvancedView(!advancedView)}
              className="flex items-center space-x-2"
            >
              {advancedView ? (
                <Grid className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{advancedView ? "Standard view" : "Advanced view"}</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{locationData.rating}</span>
                <span className="text-gray-600 ml-1">(127 reviews)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {locationData.address}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {locationData.distance}km away
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced View Info Panel */}
        {advancedView && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">
                Advanced Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Location Stats</h4>
                  <div className="text-sm space-y-1">
                    <p>Location ID: {locationData.id}</p>
                    <p>Category: {getCategoryTitle(locationData.category)}</p>
                    <p>Type: {locationData.type}</p>
                    <p>Distance: {locationData.distance}km</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Contact Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Phone: {locationData.phone || "Not available"}</p>
                    <p>Website: {locationData.website || "Not available"}</p>
                    <p>Address: {locationData.address}</p>
                    <p>Hours: {locationData.openingHours || "Not available"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Additional Info</h4>
                  <div className="text-sm space-y-1">
                    <p>Rating: {locationData.rating}★</p>
                    <p>
                      Price Level: {locationData.priceLevel || "Not available"}
                    </p>
                    <p>Tags: {locationData.tags?.join(", ") || "None"}</p>
                    <p>
                      Coordinates: {locationData.position.lat.toFixed(4)},{" "}
                      {locationData.position.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 h-96 rounded-xl overflow-hidden">
          <div className="col-span-2 row-span-2">
            <img
              src={locationData.imageUrl}
              alt="Main view"
              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
            />
          </div>
          {[1, 2, 3].map((index) => (
            <div key={index} className="relative">
              <img
                src={locationData.imageUrl}
                alt={`View ${index + 2}`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
              />
              {index === 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Button variant="outline" className="bg-white text-black">
                    Show all photos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {getCategoryTitle(locationData.category)} Details
                  </h2>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    {React.createElement(getLocationIcon(locationData.type), {
                      className: "w-4 h-4 mr-1",
                    })}
                    {locationData.type} • {locationData.category}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {locationData.isPopular && (
                    <Badge className="bg-red-100 text-red-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {locationData.isTrending && (
                    <Badge className="bg-orange-100 text-orange-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3 py-6 border-y">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">
                      {locationData.address}
                    </p>
                  </div>
                </div>
                {locationData.openingHours && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Opening Hours</p>
                      <p className="text-sm text-gray-600">
                        {locationData.openingHours}
                      </p>
                    </div>
                  </div>
                )}
                {locationData.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-gray-600">
                        <a
                          href={`tel:${locationData.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {locationData.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">
                {locationData.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {mockAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {amenity.icon && (
                      <amenity.icon className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {locationData.tags && locationData.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {locationData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-50 text-gray-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      {locationData.rating}★
                    </span>
                    <span className="text-gray-600"> Rating</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-500">
                      {locationData.distance}km away
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-medium">
                      {locationData.distance}km
                    </span>
                  </div>
                  {locationData.priceLevel && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price Level</span>
                      <span className="font-medium">
                        {locationData.priceLevel}/5
                      </span>
                    </div>
                  )}
                  {locationData.openingHours && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium text-green-600">Open</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleDirections}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>

                  {isInCart ? (
                    <Button
                      onClick={handleViewCart}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      View Cart
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}

                  {locationData.website && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(locationData.website, "_blank")
                      }
                      className="w-full"
                      size="lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}

                  {locationData.phone && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(`tel:${locationData.phone}`, "_self")
                      }
                      className="w-full"
                      size="lg"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                </div>

                <p className="text-center text-sm text-gray-600">
                  Plan your visit today
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center space-x-4 mb-6">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <h2 className="text-2xl font-bold">
              {locationData.rating} • {mockReviews.length} reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockReviews.map((review, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.image} />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{review.name}</h4>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{review.date}</p>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">
              Show all {mockReviews.length} reviews
            </Button>
          </div>
        </div>

        {/* Location Map */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Location</h2>
              <p className="text-gray-600 mt-1">
                See where this place is located
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    locationData.name
                  )}`;
                  window.open(url, "_blank");
                }}
              >
                <Map className="w-4 h-4" />
                <span>View on Maps</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={handleDirections}
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </Button>
            </div>
          </div>

          <div className="h-96 rounded-xl overflow-hidden border shadow-lg">
            <PropertyMap
              latitude={locationData.position.lat}
              longitude={locationData.position.lng}
              propertyName={locationData.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
