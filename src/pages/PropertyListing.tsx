
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Star, Heart, MapPin, Users, Wifi, Car, Filter, Map } from 'lucide-react';

const PropertyListing = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [showMap, setShowMap] = useState(false);

  const toggleLike = (id: number) => {
    setLikedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(propId => propId !== id)
        : [...prev, id]
    );
  };

  const properties = [
    {
      id: 1,
      title: "Cozy Hill Station Cottage",
      location: "Mussoorie, Uttarakhand",
      price: 3500,
      rating: 4.8,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
      host: "Priya",
      guests: 4,
      bedrooms: 2,
      amenities: ["Wifi", "Kitchen", "Parking"],
      isNew: true
    },
    {
      id: 2,
      title: "Heritage Haveli Experience",
      location: "Jaipur, Rajasthan",
      price: 6500,
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      host: "Arjun",
      guests: 6,
      bedrooms: 3,
      amenities: ["AC", "Pool", "Wifi"],
      isCertified: true
    },
    {
      id: 3,
      title: "Backwater Villa Retreat",
      location: "Alleppey, Kerala",
      price: 4200,
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Sunita",
      guests: 8,
      bedrooms: 4,
      amenities: ["Boat", "Wifi", "Kitchen"]
    },
    {
      id: 4,
      title: "Mountain View Homestay",
      location: "Manali, Himachal Pradesh",
      price: 2800,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      host: "Rajesh",
      guests: 5,
      bedrooms: 2,
      amenities: ["Fireplace", "Wifi", "Parking"],
      isNew: true
    },
    {
      id: 5,
      title: "Beach House Paradise",
      location: "Goa",
      price: 7500,
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Maria",
      guests: 10,
      bedrooms: 5,
      amenities: ["Beach Access", "Pool", "BBQ"]
    },
    {
      id: 6,
      title: "Royal Palace Stay",
      location: "Udaipur, Rajasthan",
      price: 12000,
      rating: 4.8,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      host: "Maharaj",
      guests: 12,
      bedrooms: 6,
      amenities: ["Butler", "Pool", "Spa"],
      isCertified: true
    }
  ];

  const filteredProperties = properties.filter(
    property => property.price >= priceRange[0] && property.price <= priceRange[1]
  );

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">300+ stays in India</h1>
            <p className="text-gray-600 mt-2">Find the perfect place for your vacation</p>
          </div>
          <Button
            variant={showMap ? "default" : "outline"}
            onClick={() => setShowMap(!showMap)}
            className="flex items-center space-x-2"
          >
            <Map className="w-4 h-4" />
            <span>{showMap ? "Hide map" : "Show map"}</span>
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              
              {/* Sort By */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-medium">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to high</SelectItem>
                    <SelectItem value="price-high">Price: High to low</SelectItem>
                    <SelectItem value="rating">Highest rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-medium">Price range (per night)</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={20000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-medium">Property type</Label>
                <div className="space-y-2">
                  {["House", "Apartment", "Villa", "Homestay", "Resort"].map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Amenities</Label>
                <div className="space-y-2">
                  {["WiFi", "Kitchen", "AC", "Pool", "Parking", "Pet-friendly"].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {showMap && (
              <div className="mb-8 h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <Map className="w-12 h-12 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                  <p className="text-sm">Showing {sortedProperties.length} properties</p>
                </div>
              </div>
            )}

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((property) => (
                <Link key={property.id} to={`/property/${property.id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(property.id);
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 ${likedProperties.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                      </Button>
                      {property.isNew && (
                        <Badge className="absolute top-3 left-3 bg-green-500">New</Badge>
                      )}
                      {property.isCertified && (
                        <Badge className="absolute top-3 left-3 bg-blue-500">Certified</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {property.location}
                          </p>
                        </div>
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">{property.rating}</span>
                          <span className="text-gray-500 ml-1">({property.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{property.guests} guests • {property.bedrooms} bedrooms</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold">₹{property.price.toLocaleString()}</span>
                          <span className="text-gray-600"> / night</span>
                        </div>
                        <span className="text-sm text-gray-600">Host: {property.host}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load more properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
