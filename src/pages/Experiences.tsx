import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MapPin,
  Users,
  Clock,
  Heart,
  Search,
  Filter,
  Camera,
  Utensils,
  Waves,
  Mountain,
  TreePalm,
  Compass,
  Music,
  Palette,
  ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

const Experiences = () => {
  const [likedExperiences, setLikedExperiences] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const { addExperience } = useCart();

  const toggleLike = (id: number) => {
    setLikedExperiences((prev) =>
      prev.includes(id) ? prev.filter((expId) => expId !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (experience: any) => {
    const experienceData = {
      id: experience.id,
      title: experience.title,
      location: experience.location,
      price: experience.price,
      duration: experience.duration,
      image: experience.image,
      guests: 1,
    };

    addExperience(experienceData);
    toast({
      title: "Added to cart!",
      description: `${experience.title} has been added to your cart.`,
    });
  };

  const categories = [
    { id: "all", label: "All Experiences", icon: Compass },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "cultural", label: "Cultural", icon: Palette },
    { id: "culinary", label: "Culinary", icon: Utensils },
    { id: "nature", label: "Nature", icon: TreePalm },
    { id: "water", label: "Water Sports", icon: Waves },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "music", label: "Music & Arts", icon: Music },
  ];

  const experiences = [
    {
      id: 1,
      title: "Traditional Cooking Class with Local Family",
      location: "Kochi, Ernakulam",
      category: "culinary",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
      price: 2500,
      duration: "3 hours",
      rating: 4.9,
      reviews: 124,
      maxGuests: 8,
      description:
        "Learn to cook authentic Kerala dishes with spices from our garden",
      host: "Priya Nair",
      isNew: true,
    },
    {
      id: 2,
      title: "Backwater Sunrise Canoe Experience",
      location: "Alleppey, Alappuzha",
      category: "nature",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=400&fit=crop",
      price: 1800,
      duration: "2 hours",
      rating: 4.8,
      reviews: 89,
      maxGuests: 4,
      description:
        "Paddle through serene backwaters as the sun rises over Kerala",
      host: "Ravi Kumar",
      isNew: false,
    },
    {
      id: 3,
      title: "Spice Plantation Walking Tour",
      location: "Thekkady, Idukki",
      category: "nature",
      image:
        "https://images.unsplash.com/photo-1596040033229-a65c5dd3482a?w=500&h=400&fit=crop",
      price: 1200,
      duration: "2.5 hours",
      rating: 4.7,
      reviews: 156,
      maxGuests: 12,
      description:
        "Discover aromatic spices and medicinal plants with expert guides",
      host: "Arjun Menon",
      isNew: false,
    },
    {
      id: 4,
      title: "Kathakali Dance Performance & Workshop",
      location: "Thrissur",
      category: "cultural",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop",
      price: 3200,
      duration: "4 hours",
      rating: 4.9,
      reviews: 67,
      maxGuests: 15,
      description: "Experience Kerala's classical dance with makeup tutorial",
      host: "Guru Krishnan",
      isNew: true,
    },
    {
      id: 5,
      title: "Surfing Lessons with Locals",
      location: "Varkala, Thiruvananthapuram",
      category: "water",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=400&fit=crop",
      price: 2800,
      duration: "3 hours",
      rating: 4.6,
      reviews: 134,
      maxGuests: 6,
      description:
        "Learn to surf on Kerala's famous beaches with experienced instructors",
      host: "Suresh Varma",
      isNew: false,
    },
    {
      id: 6,
      title: "Photography Tour: Kerala's Hidden Gems",
      location: "Munnar, Idukki",
      category: "photography",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
      price: 4500,
      duration: "6 hours",
      rating: 4.8,
      reviews: 92,
      maxGuests: 8,
      description:
        "Capture breathtaking landscapes with professional photographer",
      host: "Maya Joseph",
      isNew: true,
    },
    {
      id: 7,
      title: "Traditional Percussion Workshop",
      location: "Palakkad",
      category: "music",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop",
      price: 2200,
      duration: "2.5 hours",
      rating: 4.7,
      reviews: 78,
      maxGuests: 10,
      description: "Learn traditional Kerala percussion instruments",
      host: "Raman Nair",
      isNew: false,
    },
    {
      id: 8,
      title: "Tea Plantation Trekking Experience",
      location: "Wayanad",
      category: "adventure",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop",
      price: 3800,
      duration: "5 hours",
      rating: 4.9,
      reviews: 103,
      maxGuests: 12,
      description:
        "Trek through lush tea gardens with local guides and tea tasting",
      host: "Deepak Pillai",
      isNew: false,
    },
  ];

  // Filter experiences
  const filteredExperiences = experiences.filter((experience) => {
    const matchesSearch =
      experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || experience.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort experiences
  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default: // popularity
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Authentic Kerala Experiences
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with local culture through immersive activities and
            adventures guided by passionate locals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search experiences..."
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
              <SelectItem value="newest">Newest First</SelectItem>
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
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
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
            {sortedExperiences.length} experience
            {sortedExperiences.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedExperiences.map((experience) => (
            <Card
              key={experience.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {experience.isNew && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    New
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(experience.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedExperiences.includes(experience.id)
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
                      {experience.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {experience.location}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {experience.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {experience.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Up to {experience.maxGuests}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">
                        {experience.rating}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({experience.reviews})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-foreground">
                        ₹{experience.price.toLocaleString()}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        per person
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      Hosted by {experience.host}
                    </p>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(experience);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedExperiences.length === 0 && (
          <div className="text-center py-12">
            <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No experiences found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more experiences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiences;
