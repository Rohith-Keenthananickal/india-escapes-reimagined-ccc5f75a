import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { format } from "date-fns";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {getTotalItems() > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Shopping Cart</span>
              {getTotalItems() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {getTotalItems() === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600">
                  Start adding hotels, experiences, and nearby suggestions to
                  your cart.
                </p>
              </div>
            ) : (
              <>
                {hotels.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Hotel className="w-5 h-5 mr-2" />
                      Selected Hotels ({hotels.length})
                    </h3>
                    <div className="space-y-4">
                      {hotels.map((hotel) => (
                        <Card key={hotel.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={hotel.image}
                                alt={hotel.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
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
                  </div>
                )}

                {experiences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Selected Experiences ({experiences.length})
                    </h3>
                    <div className="space-y-4">
                      {experiences.map((experience) => (
                        <Card key={experience.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={experience.image}
                                alt={experience.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
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
                                    onClick={() =>
                                      removeExperience(experience.id)
                                    }
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
                  </div>
                )}

                {selectedNearbySuggestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Nearby Suggestions ({selectedNearbySuggestions.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedNearbySuggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {suggestion.imageUrl && (
                                <img
                                  src={suggestion.imageUrl}
                                  alt={suggestion.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
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
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{getTotalAmount().toLocaleString()}</span>
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
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
