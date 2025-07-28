import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingCart,
  Hotel,
  MapPin,
  Star,
  Users,
  Calendar,
  Clock,
  Trash2,
  Plus,
  Minus,
  X,
  CreditCard,
  ArrowRight,
  Map,
  ArrowLeft,
  Navigation,
  ExternalLink,
  Heart,
  Share,
  Phone,
  Globe,
  Filter,
  Search,
  Grid,
  List,
  Eye,
  EyeOff,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import PropertyMap from "@/components/PropertyMap";

const CartPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const {
    hotels,
    experiences,
    nearbySuggestions,
    removeHotel,
    removeExperience,
    removeNearbySuggestion,
    updateHotel,
    updateExperience,
    getTotalAmount,
    getTotalItems,
    clearCart,
  } = useCart();

  const selectedNearbySuggestions = nearbySuggestions.filter((s) => s.selected);

  const handleUpdateHotelGuests = (hotelId: string, newGuests: number) => {
    if (newGuests < 1) return;
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      const nights =
        hotel.checkIn && hotel.checkOut
          ? Math.ceil(
              (hotel.checkOut.getTime() - hotel.checkIn.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 1;
      const basePrice = hotel.price * nights;
      const serviceFee = Math.round(basePrice * 0.1);
      const taxes = Math.round(basePrice * 0.12);
      const totalAmount = basePrice + serviceFee + taxes;

      updateHotel(hotelId, { guests: newGuests, totalAmount });
    }
  };

  const handleUpdateHotelRooms = (hotelId: string, newRooms: number) => {
    if (newRooms < 1) return;
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      const nights =
        hotel.checkIn && hotel.checkOut
          ? Math.ceil(
              (hotel.checkOut.getTime() - hotel.checkIn.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 1;
      const basePrice = hotel.price * nights * newRooms;
      const serviceFee = Math.round(basePrice * 0.1);
      const taxes = Math.round(basePrice * 0.12);
      const totalAmount = basePrice + serviceFee + taxes;

      updateHotel(hotelId, { rooms: newRooms, totalAmount });
    }
  };

  const handleUpdateExperienceGuests = (
    experienceId: number,
    newGuests: number
  ) => {
    if (newGuests < 1) return;
    const experience = experiences.find((e) => e.id === experienceId);
    if (experience) {
      updateExperience(experienceId, { guests: newGuests });
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
  };

  const getLocationCoordinates = () => {
    if (hotels.length > 0) {
      const hotel = hotels[0];
      const locationParts = hotel.location.split(", ");
      if (locationParts.length >= 2) {
        const city = locationParts[locationParts.length - 1];
        if (city === "Mussoorie") {
          return { lat: 30.4599, lng: 78.0648 };
        }
      }
    }
    return { lat: 30.4599, lng: 78.0648 };
  };

  const coordinates = getLocationCoordinates();

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

  const getCartItemsForMap = () => {
    const items = [];
    const baseCoordinates = coordinates;

    // Add hotels with their actual positions
    hotels.forEach((hotel, index) => {
      items.push({
        id: hotel.id,
        title: hotel.title,
        location: hotel.location,
        type: "hotel",
        category: "accommodations",
        position: {
          lat: baseCoordinates.lat + index * 0.002,
          lng: baseCoordinates.lng + index * 0.001,
        },
        rating: hotel.rating,
        imageUrl: hotel.image,
      });
    });

    // Add experiences with realistic positions around the area
    experiences.forEach((experience, index) => {
      const angle = index * 45 * (Math.PI / 180); // Spread experiences in a circle
      const radius = 0.005 + index * 0.002; // Varying distances

      items.push({
        id: `exp_${experience.id}`,
        title: experience.title,
        location: experience.location,
        type: "experience",
        category: "experiences",
        position: {
          lat: baseCoordinates.lat + Math.cos(angle) * radius,
          lng: baseCoordinates.lng + Math.sin(angle) * radius,
        },
        rating: 4.5,
        imageUrl: experience.image,
      });
    });

    // Add nearby suggestions with realistic positions
    selectedNearbySuggestions.forEach((suggestion, index) => {
      const angle = index * 30 * (Math.PI / 180); // Different angle pattern
      const radius = 0.008 + index * 0.003; // Further distances for nearby places

      items.push({
        id: suggestion.id,
        name: suggestion.name,
        type: suggestion.type,
        category: suggestion.category,
        position: {
          lat: baseCoordinates.lat + Math.cos(angle) * radius,
          lng: baseCoordinates.lng + Math.sin(angle) * radius,
        },
        rating: suggestion.rating || 4.0,
        distance: suggestion.distance,
        imageUrl: suggestion.imageUrl,
      });
    });

    return items;
  };

  const cartItemsForMap = getCartItemsForMap();

  if (getTotalItems() === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Start adding hotels, experiences, and nearby suggestions to your
              cart.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {getTotalItems()} items • ₹{getTotalAmount().toLocaleString()}{" "}
                total
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Enlarged Map Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Map className="w-6 h-6 mr-2" />
              Your Trip Map
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center space-x-2"
            >
              {showMap ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{showMap ? "Hide" : "Show"} Map</span>
            </Button>
          </div>

          {showMap && (
            <div className="h-96 rounded-xl overflow-hidden border shadow-lg">
              <PropertyMap
                latitude={coordinates.lat}
                longitude={coordinates.lng}
                propertyName={hotels[0]?.title || "Your Trip"}
                cartItems={cartItemsForMap}
                showCartItems={true}
              />
            </div>
          )}
        </div>

        {/* Trip Summary Section */}
        {cartItemsForMap.length > 1 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Trip Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {cartItemsForMap.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Stops</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {hotels.length}
                    </div>
                    <div className="text-sm text-gray-600">Accommodations</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {experiences.length}
                    </div>
                    <div className="text-sm text-gray-600">Experiences</div>
                  </div>
                </div>

                {/* Update the Trip Summary Section with circular images and city labels */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Trip Route
                  </h4>
                  <div className="space-y-6 relative">
                    {/* Add connecting line */}
                    <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-blue-200 z-0"></div>

                    {cartItemsForMap.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 relative z-10"
                      >
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-[#9C27B0] text-white text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                            {item.type === "hotel" && (
                              <Hotel className="w-2.5 h-2.5 text-blue-600" />
                            )}
                            {item.type === "experience" && (
                              <Clock className="w-2.5 h-2.5 text-green-600" />
                            )}
                            {item.type !== "hotel" &&
                              item.type !== "experience" && (
                                <MapPin className="w-2.5 h-2.5 text-amber-600" />
                              )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {item.title || item.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.type} • {item.location}
                          </div>
                        </div>
                        {index < cartItemsForMap.length - 1 && (
                          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                            {calculateDistance(
                              item.position!.lat,
                              item.position!.lng,
                              cartItemsForMap[index + 1].position!.lat,
                              cartItemsForMap[index + 1].position!.lng
                            ).toFixed(1)}{" "}
                            km
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Selected Items Section */}
        <div className="space-y-8">
          {hotels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hotel className="w-5 h-5 mr-2" />
                  Selected Hotels ({hotels.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-4"
                  }
                >
                  {hotels.map((hotel) => (
                    <Card key={hotel.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative">
                            <img
                              src={hotel.image}
                              alt={hotel.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Hotel className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {hotel.title}
                                </h4>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {hotel.location}
                                </div>
                                <div className="flex items-center mb-2">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="text-sm font-medium">
                                    {hotel.rating}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeHotel(hotel.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                  Rooms
                                </label>
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateHotelRooms(
                                        hotel.id,
                                        hotel.rooms - 1
                                      )
                                    }
                                    disabled={hotel.rooms <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="px-3 py-1">
                                    {hotel.rooms}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateHotelRooms(
                                        hotel.id,
                                        hotel.rooms + 1
                                      )
                                    }
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                  Guests
                                </label>
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateHotelGuests(
                                        hotel.id,
                                        hotel.guests - 1
                                      )
                                    }
                                    disabled={hotel.guests <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="px-3 py-1">
                                    {hotel.guests}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateHotelGuests(
                                        hotel.id,
                                        hotel.guests + 1
                                      )
                                    }
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {hotel.checkIn && hotel.checkOut && (
                              <div className="flex items-center text-sm text-gray-600 mt-2">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(hotel.checkIn, "MMM d")} -{" "}
                                {format(hotel.checkOut, "MMM d, yyyy")}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-4">
                              <span className="text-lg font-bold">
                                ₹{hotel.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Selected Experiences ({experiences.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-4"
                  }
                >
                  {experiences.map((experience) => (
                    <Card key={experience.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative">
                            <img
                              src={experience.image}
                              alt={experience.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Clock className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {experience.title}
                                </h4>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {experience.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {experience.duration}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(experience.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="mt-4">
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Guests
                              </label>
                              <div className="flex items-center border rounded-md w-32">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateExperienceGuests(
                                      experience.id,
                                      experience.guests - 1
                                    )
                                  }
                                  disabled={experience.guests <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="px-3 py-1">
                                  {experience.guests}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateExperienceGuests(
                                      experience.id,
                                      experience.guests + 1
                                    )
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <span className="text-lg font-bold">
                                ₹
                                {(
                                  experience.price * experience.guests
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedNearbySuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Nearby Suggestions ({selectedNearbySuggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-4"
                  }
                >
                  {selectedNearbySuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {suggestion.imageUrl && (
                            <div className="relative">
                              <img
                                src={suggestion.imageUrl}
                                alt={suggestion.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <MapPin className="w-4 h-4 text-amber-600" />
                              </div>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {suggestion.name}
                                </h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">
                                    {suggestion.type}
                                  </Badge>
                                  <Badge variant="outline">
                                    {suggestion.category}
                                  </Badge>
                                </div>
                                {suggestion.rating && (
                                  <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                    {suggestion.rating}
                                  </div>
                                )}
                                {suggestion.distance && (
                                  <div className="text-sm text-gray-600">
                                    {suggestion.distance} km away
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeNearbySuggestion(suggestion.id)
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary and Checkout */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Hotels</span>
                  <span>
                    ₹
                    {hotels
                      .reduce((sum, hotel) => sum + hotel.totalAmount, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Experiences</span>
                  <span>
                    ₹
                    {experiences
                      .reduce((sum, exp) => sum + exp.price * exp.guests, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{getTotalAmount().toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleProceedToCheckout}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
