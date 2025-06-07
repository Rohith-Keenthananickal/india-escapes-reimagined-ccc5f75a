
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Star, Heart, Share, MapPin, Users, Bed, Bath, Wifi, Car, Shield, Calendar as CalendarIcon, Eye, Grid, Home, Thermometer, Mountain, TreePine, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [advancedView, setAdvancedView] = useState(false);

  // Mock property data
  const property = {
    id: 1,
    title: "Cozy Hill Station Cottage",
    location: "Mussoorie, Uttarakhand",
    price: 3500,
    rating: 4.8,
    reviewCount: 127,
    images: [
      "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop"
    ],
    host: {
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100&h=100&fit=crop&crop=face",
      joinedYear: "2019",
      isVerified: true,
      rating: 4.9,
      responseRate: "100%",
      responseTime: "within an hour"
    },
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      { icon: Wifi, name: "Free WiFi" },
      { icon: Car, name: "Free parking" },
      { icon: Shield, name: "Self check-in" },
      { icon: Home, name: "Kitchen" },
      { icon: Thermometer, name: "Heating" },
      { icon: Mountain, name: "Mountain view" },
      { icon: TreePine, name: "Garden" },
      { icon: Flame, name: "Fireplace" }
    ],
    description: "Escape to this charming cottage nestled in the serene hills of Mussoorie. Perfect for a peaceful getaway with stunning mountain views, cozy interiors, and all modern amenities. The property features a beautiful garden, fireplace for cold evenings, and easy access to local attractions.",
    houseRules: [
      "Check-in: 3:00 PM - 9:00 PM",
      "Check-out: 11:00 AM",
      "No smoking",
      "No pets",
      "No parties or events"
    ],
    reviews: [
      {
        name: "Amit Kumar",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "March 2024",
        comment: "Absolutely beautiful place! The view from the cottage is breathtaking. Priya was very helpful and responsive. Highly recommended for a peaceful getaway."
      },
      {
        name: "Neha Patel",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "February 2024",
        comment: "Perfect for a family vacation. The cottage is well-maintained and has everything you need. The location is quiet yet accessible to local markets."
      }
    ]
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = property.price * nights;
    const serviceFee = Math.round(basePrice * 0.1);
    const taxes = Math.round(basePrice * 0.12);
    return basePrice + serviceFee + taxes;
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Select dates",
        description: "Please select check-in and check-out dates.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/booking/${id}`, { 
      state: { 
        property, 
        checkIn, 
        checkOut, 
        guests,
        total: calculateTotal()
      } 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <Button
              variant={advancedView ? "default" : "outline"}
              onClick={() => setAdvancedView(!advancedView)}
              className="flex items-center space-x-2"
            >
              {advancedView ? <Grid className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{advancedView ? "Standard view" : "Advanced view"}</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{property.rating}</span>
                <span className="text-gray-600 ml-1">({property.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {property.location}
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
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced View Info Panel */}
        {advancedView && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">Advanced Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Property Stats</h4>
                  <div className="text-sm space-y-1">
                    <p>Property ID: {property.id}</p>
                    <p>Total Reviews: {property.reviewCount}</p>
                    <p>Host Since: {property.host.joinedYear}</p>
                    <p>Response Rate: {property.host.responseRate}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Accommodation Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Max Guests: {property.guests}</p>
                    <p>Bedrooms: {property.bedrooms}</p>
                    <p>Bathrooms: {property.bathrooms}</p>
                    <p>Amenities: {property.amenities.length} available</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Pricing Info</h4>
                  <div className="text-sm space-y-1">
                    <p>Base Price: ₹{property.price}/night</p>
                    <p>Service Fee: 10%</p>
                    <p>Taxes: 12%</p>
                    <p>Host Rating: {property.host.rating}★</p>
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
              src={property.images[1]} 
              alt="Main view"
              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
            />
          </div>
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image} 
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
            {/* Host & Property Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Hosted by {property.host.name}</h2>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Users className="w-4 h-4 mr-1" />
                    {property.guests} guests • {property.bedrooms} bedrooms • {property.bathrooms} bathrooms
                  </div>
                </div>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={property.host.image} />
                  <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-3 py-6 border-y">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Self check-in</p>
                    <p className="text-sm text-gray-600">Check yourself in with the lockbox.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium">{property.host.name} is a Superhost</p>
                    <p className="text-sm text-gray-600">Superhosts are experienced, highly rated hosts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {amenity.icon && <amenity.icon className="w-5 h-5 text-gray-600" />}
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div>
              <h3 className="text-lg font-semibold mb-4">House rules</h3>
              <div className="space-y-2">
                {property.houseRules.map((rule, index) => (
                  <p key={index} className="text-gray-700">{rule}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">₹{property.price.toLocaleString()}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-500 ml-1">({property.reviewCount})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "MMM d") : "Check-in"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "MMM d") : "Check-out"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Guests</span>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span>{guests}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setGuests(Math.min(property.guests, guests + 1))}
                      disabled={guests >= property.guests}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                {checkIn && checkOut && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>₹{property.price.toLocaleString()} x {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                      <span>₹{(property.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>₹{Math.round(property.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) * 0.1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>₹{Math.round(property.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  size="lg"
                >
                  Reserve
                </Button>
                
                <p className="text-center text-sm text-gray-600">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center space-x-4 mb-6">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <h2 className="text-2xl font-bold">{property.rating} • {property.reviews.length} reviews</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {property.reviews.map((review, index) => (
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
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
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
            <Button variant="outline">Show all {property.reviews.length} reviews</Button>
          </div>
        </div>

        {/* Location */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Where you'll be</h2>
          <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>Interactive map showing {property.location}</p>
            </div>
          </div>
        </div>

        {/* Host Info */}
        <div className="mt-12">
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={property.host.image} />
                <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h3 className="text-xl font-bold">Hosted by {property.host.name}</h3>
                  {property.host.isVerified && (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="font-medium">{property.host.rating}★ Rating</p>
                  </div>
                  <div>
                    <p className="font-medium">{property.host.responseRate} Response rate</p>
                  </div>
                  <div>
                    <p className="font-medium">Responds {property.host.responseTime}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  {property.host.name} joined in {property.host.joinedYear}. She loves sharing her beautiful hill station home with travelers from around the world.
                </p>
                <Button variant="outline">Contact Host</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
