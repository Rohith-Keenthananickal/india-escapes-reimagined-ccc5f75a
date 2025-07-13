import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  MapPin, 
  Heart,
  Search,
  Filter,
  Camera,
  Utensils,
  Car,
  Users,
  Palmtree,
  Wrench,
  Music,
  MapIcon,
  Plane,
  ShieldCheck,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Services = () => {
  const [likedServices, setLikedServices] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const toggleLike = (id: number) => {
    setLikedServices((prev) =>
      prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: "all", label: "All Services", icon: Wrench },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "culinary", label: "Personal Chef", icon: Utensils },
    { id: "transport", label: "Transportation", icon: Car },
    { id: "guide", label: "Local Guide", icon: MapIcon },
    { id: "wellness", label: "Wellness", icon: Palmtree },
    { id: "event", label: "Event Planning", icon: Users },
    { id: "music", label: "Music & Entertainment", icon: Music },
  ];

  const services = [
    {
      id: 1,
      title: "Professional Wedding Photography",
      provider: "Arun Prakash",
      location: "Kochi, Ernakulam",
      category: "photography",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&h=400&fit=crop",
      startingPrice: 25000,
      rating: 4.9,
      reviews: 156,
      description: "Capturing your special moments with artistic Kerala backdrops",
      experience: "8 years",
      availability: "Available",
      isVerified: true,
      responseTime: "2 hours",
    },
    {
      id: 2,
      title: "Authentic Kerala Personal Chef",
      provider: "Priya Menon",
      location: "Alleppey, Alappuzha",
      category: "culinary",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
      startingPrice: 3500,
      rating: 4.8,
      reviews: 89,
      description: "Traditional Kerala cuisine prepared in your homestay",
      experience: "12 years",
      availability: "Available",
      isVerified: true,
      responseTime: "1 hour",
    },
    {
      id: 3,
      title: "Luxury Car Rental & Driver",
      provider: "Kerala Premium Drives",
      location: "Thiruvananthapuram",
      category: "transport",
      image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=500&h=400&fit=crop",
      startingPrice: 4500,
      rating: 4.7,
      reviews: 234,
      description: "Comfortable travel across Kerala with experienced drivers",
      experience: "5 years",
      availability: "Available",
      isVerified: true,
      responseTime: "30 minutes",
    },
    {
      id: 4,
      title: "Expert Local Guide & Storyteller",
      provider: "Rajesh Kumar",
      location: "Munnar, Idukki",
      category: "guide",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop",
      startingPrice: 2800,
      rating: 4.9,
      reviews: 127,
      description: "Discover hidden gems and local stories with passionate guide",
      experience: "15 years",
      availability: "Busy until Dec 20",
      isVerified: true,
      responseTime: "3 hours",
    },
    {
      id: 5,
      title: "Ayurvedic Massage Therapist",
      provider: "Dr. Lakshmi Nair",
      location: "Varkala, Thiruvananthapuram",
      category: "wellness",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=400&fit=crop",
      startingPrice: 3200,
      rating: 4.8,
      reviews: 178,
      description: "Traditional Ayurvedic treatments and therapeutic massages",
      experience: "20 years",
      availability: "Available",
      isVerified: true,
      responseTime: "2 hours",
    },
    {
      id: 6,
      title: "Destination Wedding Planner",
      provider: "Malabar Events",
      location: "Kumarakom, Kottayam",
      category: "event",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=400&fit=crop",
      startingPrice: 85000,
      rating: 4.9,
      reviews: 64,
      description: "Complete wedding planning services in stunning Kerala venues",
      experience: "10 years",
      availability: "Booking 2024",
      isVerified: true,
      responseTime: "4 hours",
    },
    {
      id: 7,
      title: "Traditional Music Performance",
      provider: "Kerala Folk Ensemble",
      location: "Thrissur",
      category: "music",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop",
      startingPrice: 8500,
      rating: 4.7,
      reviews: 92,
      description: "Live performances of classical and folk Kerala music",
      experience: "8 years",
      availability: "Available",
      isVerified: true,
      responseTime: "6 hours",
    },
    {
      id: 8,
      title: "Travel & Adventure Photography",
      provider: "Maya Joseph",
      location: "Wayanad",
      category: "photography",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=400&fit=crop",
      startingPrice: 15000,
      rating: 4.8,
      reviews: 103,
      description: "Capture your Kerala adventure with professional photographer",
      experience: "6 years",
      availability: "Available",
      isVerified: true,
      responseTime: "2 hours",
    },
  ];

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.startingPrice - b.startingPrice;
      case 'price-high':
        return b.startingPrice - a.startingPrice;
      case 'rating':
        return b.rating - a.rating;
      case 'response':
        const responseTimeA = parseFloat(a.responseTime);
        const responseTimeB = parseFloat(b.responseTime);
        return responseTimeA - responseTimeB;
      default: // popularity
        return b.reviews - a.reviews;
    }
  });

  const getAvailabilityColor = (availability: string) => {
    if (availability === "Available") return "bg-green-100 text-green-800";
    if (availability.includes("Busy")) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Professional Services in Kerala
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with verified local service providers to enhance your Kerala
            experience with professional support
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="response">Fastest Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {service.isVerified && (
                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(service.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedServices.includes(service.id)
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {service.provider}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {service.location}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className={getAvailabilityColor(service.availability)}>
                      {service.availability}
                    </Badge>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Responds in {service.responseTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({service.reviews})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-foreground">
                        ₹{service.startingPrice.toLocaleString()}
                      </span>
                      <p className="text-xs text-muted-foreground">starting from</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {service.experience} experience
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedServices.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No services found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;