import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EnhancedSearchBar from "@/components/EnhancedSearchBar";
import BannerSlider from "@/components/BannerSlider";
import AIAssistant from "@/components/AIAssistant";
import SeasonalBooking from "@/components/SeasonalBooking";
import ValueProposition from "@/components/ValueProposition";
import MediaSection from "@/components/MediaSection";
import Certifications from "@/components/Certifications";
import HomestayFilters from "@/components/HomestayFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Star,
  Heart,
  MapPin,
  Wifi,
  Car,
  Users,
  Home,
  Compass,
  Wrench,
  Plane,
  Clock,
  Award,
  Waves,
  Mountain,
  TreePalm,
  Landmark,
  HeartPulse,
  DollarSign,
  Activity,
  Leaf,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const Index = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    filters: [] as string[],
    sortBy: 'popularity'
  });
  const navigate = useNavigate();

  const toggleLike = (id: number) => {
    setLikedProperties((prev) =>
      prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]
    );
  };

  const regions = [
    { id: "backwater", label: "Backwater & Scenic", count: 45, icon: Waves },
    { id: "hills", label: "Hill Stations & Wildlife", count: 38, icon: Mountain },
    { id: "beaches", label: "Beaches & Coastal", count: 32, icon: TreePalm },
    { id: "cultural", label: "Cultural & Heritage", count: 28, icon: Landmark },
    { id: "spiritual", label: "Spiritual & Wellness", count: 22, icon: HeartPulse },
  ];

  const filters = [
    { id: "all", label: "All Stays", icon: Home },
    { id: "budget", label: "Budget Friendly", icon: DollarSign },
    { id: "activities", label: "Activities Nearby", icon: Activity },
    { id: "eco", label: "Eco-Certified", icon: Leaf },
  ];

  const airports = [
    { name: "Ernakulam (Kochi)", code: "COK", stays: 120 },
    { name: "Trivandrum", code: "TRV", stays: 85 },
    { name: "Calicut (Kozhikode)", code: "CCJ", stays: 67 },
    { name: "Kannur", code: "CNN", stays: 42 },
  ];

  const featuredProperties = [
    {
      id: 1,
      title: "Traditional Backwater Homestay",
      location: "Alleppey, Kerala",
      price: 3500,
      rating: 4.8,
      reviews: 127,
      images: [
        "https://gos3.ibcdn.com/19d4e61e623f11e7b5020a4cef95d023.jpg",
        "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=400&fit=crop"
      ],
      host: "Priya",
      isNew: true,
      region: "backwater",
      amenities: ["Wifi", "Car", "Boat"],
      isEco: true,
    },
    {
      id: 2,
      title: "Heritage Spice Garden Villa",
      location: "Thekkady, Kerala",
      price: 6500,
      rating: 4.9,
      reviews: 89,
      images: [
        "https://spiceslapthekkady.com/images/gallery/gall-img-46.jpg",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop"
      ],
      host: "Arjun",
      isCertified: true,
      region: "cultural",
      amenities: ["Wifi", "Car", "Spa"],
      isEco: false,
    },
    {
      id: 3,
      title: "Coastal Fishing Village Stay",
      location: "Varkala, Kerala",
      price: 4200,
      rating: 4.7,
      reviews: 203,
      images: [
        "https://www.keralatourism.org/images/newsbytes/large/varkala_papanasam_beach20240315082235_2211_1.jpg",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop"
      ],
      host: "Sunita",
      region: "beaches",
      amenities: ["Wifi", "Beach Access"],
      isEco: true,
    },
    {
      id: 4,
      title: "Mountain View Tea Estate",
      location: "Munnar, Kerala",
      price: 2800,
      rating: 4.6,
      reviews: 156,
      images: [
        "https://media-cdn.tripadvisor.com/media/photo-s/09/0b/a5/f7/dream-catcher-plantation.jpg",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop"
      ],
      host: "Rajesh",
      isNew: true,
      region: "hills",
      amenities: ["Wifi", "Trek Guide"],
      isEco: true,
    },
  ];

  // Apply filters to properties
  const filteredProperties = featuredProperties.filter((property) => {
    // Category filter
    if (activeFilters.category !== 'all' && property.region !== activeFilters.category) {
      return false;
    }
    
    // Additional filters
    if (activeFilters.filters.includes('budget') && property.price >= 4000) return false;
    if (activeFilters.filters.includes('eco') && !property.isEco) return false;
    if (activeFilters.filters.includes('activities') && property.amenities.length <= 2) return false;
    
    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (activeFilters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
      default: // popularity
        return b.reviews - a.reviews;
    }
  });

  const handleFiltersChange = (newFilters: { category: string; filters: string[]; sortBy: string }) => {
    setActiveFilters(newFilters);
  };

  const priorityHomestays = [
    {
      id: 101,
      title: "Premium Backwater Heritage Villa",
      location: "Kumarakom, Kottayam",
      price: 8500,
      rating: 4.9,
      reviews: 245,
      images: [
        "https://www.kumarakomlakeresort.in/assets/images/about-kumarakom-lake-resort/about/gallery/meandering-pool-duplex-villas-zoom.jpg",
        "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop"
      ],
      host: "Maya Krishnan",
      isPriority: true,
      district: "Kottayam",
    },
    {
      id: 102,
      title: "Royal Spice Estate Mansion",
      location: "Kumily, Idukki",
      price: 12000,
      rating: 4.8,
      reviews: 189,
      images: [
        "https://hectindiai.s3.ap-south-1.amazonaws.com/0000/126/2024/10/15/spice-jungle-resort-by-maat-hotels-14-600.webp",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=400&fit=crop"
      ],
      host: "Ravi Menon",
      isPriority: true,
      district: "Idukki",
    },
    {
      id: 103,
      title: "Coastal Palace Homestay",
      location: "Kovalam, Thiruvananthapuram",
      price: 9500,
      rating: 4.9,
      reviews: 156,
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/01KovalamBeach%26Kerala.jpg/330px-01KovalamBeach%26Kerala.jpg",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=400&fit=crop"
      ],
      host: "Priya Nair",
      isPriority: true,
      district: "Thiruvananthapuram",
    },
  ];

  const airportDistricts = [
    {
      name: "Ernakulam",
      code: "COK",
      stays: 120,
      description: "Gateway to Backwaters",
    },
    {
      name: "Thiruvananthapuram",
      code: "TRV",
      stays: 85,
      description: "Capital Heritage",
    },
    { name: "Calicut", code: "CCJ", stays: 67, description: "Malabar Culture" },
    { name: "Kannur", code: "CNN", stays: 42, description: "Theyyam Land" },
  ];

  const newlyListedHomestays = [
    {
      id: 201,
      title: "Bamboo Grove Eco Stay",
      location: "Wayanad",
      price: 3800,
      rating: 4.7,
      reviews: 23,
      images: [
        "https://uravuecolinks.com/wp-content/uploads/2020/07/Honeymoon-Cottage-3.jpg",
        "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop"
      ],
      host: "Arjun Kumar",
      isNew: true,
      daysAgo: 2,
    },
    {
      id: 202,
      title: "Traditional Tharavad",
      location: "Thrissur",
      price: 5200,
      rating: 4.6,
      reviews: 8,
      images: [
        "https://a0.muscache.com/im/pictures/34cb93b4-3960-4e57-a619-126a95573fa1.jpg?im_w=720",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=400&fit=crop"
      ],
      host: "Lakshmi Pillai",
      isNew: true,
      daysAgo: 5,
    },
    {
      id: 203,
      title: "Hillside Tea Cottage",
      location: "Munnar, Idukki",
      price: 4500,
      rating: 4.8,
      reviews: 15,
      images: [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/322999418.jpg?k=606c35151e0bea2eaf660185db79e322dc1ff6a7e10b84f84db0fb80bfb7407d&o=&hp=1",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop"
      ],
      host: "Suresh Varma",
      isNew: true,
      daysAgo: 1,
    },
    {
      id: 204,
      title: "Fishing Village Home",
      location: "Kollam",
      price: 3200,
      rating: 4.5,
      reviews: 12,
      images: [
        "https://www.keralatourism.org/images/newsbytes/large/varkala_papanasam_beach20240315082235_2211_1.jpg",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=400&fit=crop"
      ],
      host: "Bindu Jose",
      isNew: true,
      daysAgo: 3,
    },
  ];

  const districtHomestays = [
    {
      district: "Thiruvananthapuram",
      count: 85,
      featured: "Kovalam Beach Stays",
    },
    { district: "Kollam", count: 42, featured: "Backwater Heritage" },
    { district: "Pathanamthitta", count: 28, featured: "Pilgrimage & Nature" },
    { district: "Alappuzha", count: 76, featured: "Houseboat Experience" },
    { district: "Kottayam", count: 54, featured: "Kumarakom Luxury" },
    { district: "Idukki", count: 63, featured: "Hill Station Retreats" },
    { district: "Ernakulam", count: 120, featured: "Urban & Backwater Mix" },
    { district: "Thrissur", count: 48, featured: "Cultural Hub" },
    { district: "Palakkad", count: 35, featured: "Gateway to Kerala" },
    { district: "Malappuram", count: 29, featured: "Historical Heritage" },
    { district: "Kozhikode", count: 67, featured: "Spice Coast" },
    { district: "Wayanad", count: 58, featured: "Wildlife & Adventure" },
    { district: "Kannur", count: 42, featured: "Theyyam Culture" },
    { district: "Kasaragod", count: 31, featured: "Northernmost Beauty" },
  ];

  const heroImages = [
    "https://www.keralatourism.holiday/blog/wp-content/uploads/2024/11/Untitled-3.jpg",
    "https://t3.ftcdn.net/jpg/08/66/94/00/360_F_866940051_zYRBRlqHLSSWMM3Su2Mr0AiLDja8cQwM.jpg",
    "https://cdn.guidetour.in/wp-content/uploads/2018/01/Kovalam-Tourist-Places.jpg.webp",
    "https://www.tusktravel.com/blog/wp-content/uploads/2022/03/Kerala-kumarakom-Place.jpg",
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Background Image */}
      <div className="relative min-h-[600px] bg-cover bg-center bg-no-repeat overflow-hidden">
        {/* Animated Background Images */}
        {heroImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="Kerala landscape background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentHeroIndex ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
            draggable={false}
            aria-hidden={idx !== currentHeroIndex}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[600px] px-4">
          {/* Hero Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Live like a local. Discover Kerala's soul
              <br />
              <span className="text-yellow-300">with a welcoming family</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Experience authentic homestays and connect with Kerala's rich
              culture
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="w-full max-w-5xl">
            <EnhancedSearchBar />
          </div>
        </div>
      </div>

      {/* Banner Slider Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Kerala's Beauty
          </h2>
          <p className="text-lg text-gray-600">
            Discover the diverse landscapes and rich culture of God's Own
            Country
          </p>
        </div>
        <BannerSlider />
      </div>

      {/* Platform Introduction */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className=" items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Hevan Connect Travel
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Hevan Connect Travel opens the doors to Kerala's most authentic
              homestay experiences— connecting travelers with traditional homes,
              vibrant local culture, and warm-hearted hosts. Every stay is
              handpicked to offer more than comfort. a deeper connection to the
              people, traditions, and natural beauty of Kerala. As a meaningful
              alternative to conventional accommodations unit, our platform
              helps guests discover immersive, affordable stays while supporting
              sustainable tourism and local livelihoods.
            </p>
            {/* Animated Stats Grid */}
            <AnimatedStats />
          </div>
          {/* <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=400&fit=crop"
              alt="Kerala homestay experience"
              className="rounded-2xl shadow-lg"
            />
          </div> */}
        </div>
      </section>

      {/* Homestay Discovery Section with New Filters */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Your next story starts in a Kerala home ?
        </h2>

        {/* New Filters Component */}
        <HomestayFilters onFiltersChange={handleFiltersChange} />

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProperties.map((property) => (
            <Card
              key={property.id}
              className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {property.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 border-0 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-12" onClick={e => e.stopPropagation()} />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 border-0 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-rotate-12" onClick={e => e.stopPropagation()} />
                </Carousel>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white z-10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(property.id);
                  }}
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-300 ${
                      likedProperties.includes(property.id)
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-600 hover:text-red-500 hover:scale-110"
                    }`}
                  />
                </Button>
                {property.isNew && (
                  <Badge className="absolute top-3 left-3 bg-green-500 z-10">
                    New
                  </Badge>
                )}
                {property.isCertified && (
                  <Badge className="absolute top-3 left-3 bg-blue-500 z-10">
                    Certified
                  </Badge>
                )}
                {property.isEco && (
                  <Badge className="absolute bottom-3 left-3 bg-green-600 z-10">
                    Eco-Friendly
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.location}
                    </p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({property.reviews})
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex items-center space-x-2 mb-2">
                  {property.amenities.includes("Wifi") && (
                    <Wifi className="w-3 h-3 text-gray-500" />
                  )}
                  {property.amenities.includes("Car") && (
                    <Car className="w-3 h-3 text-gray-500" />
                  )}
                  <Users className="w-3 h-3 text-gray-500" />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">
                      ₹{property.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Host: {property.host}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            asChild
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-yellow-50 hover:border-pink-300 hover:text-pink-700"
          >
            <Link to="/properties">View all Kerala homestays</Link>
          </Button>
        </div>
      </section>

      {/* Priority Homestays – District Focus */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-pink-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Priority Homestays – District Focus
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Handpicked premium homestays from Kerala's most sought-after
            districts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {priorityHomestays.map((homestay) => (
            <Card
              key={homestay.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-pink-200"
              onClick={() => navigate(`/property/${homestay.id}`)}
            >
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {homestay.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={image}
                          alt={`${homestay.title} - Image ${index + 1}`}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 border-0 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-12" onClick={e => e.stopPropagation()} />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 border-0 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-rotate-12" onClick={e => e.stopPropagation()} />
                </Carousel>
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 z-10">
                  Priority Choice
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                  <div className="flex items-center text-sm font-medium">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {homestay.rating}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {homestay.title}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {homestay.location}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-pink-600">
                      ₹{homestay.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    ({homestay.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Host: {homestay.host}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-pink-600 border-pink-300"
                  >
                    {homestay.district}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Airport-Accessible District Highlights */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Plane className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Airport-Accessible District Highlights
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Quick access to Kerala's best homestays from major airports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {airportDistricts.map((district) => (
            <Card
              key={district.code}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 text-center p-6 border-2 hover:border-blue-300"
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  ✈️ {district.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {district.description}
                </p>
                <Badge className="bg-blue-100 text-blue-800">
                  {district.code}
                </Badge>
              </div>

              <div className="border-t pt-4">
                <div className="text-2xl font-bold text-blue-600">
                  {district.stays}
                </div>
                <div className="text-sm text-gray-600">Homestays Available</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Newly Listed Homestays */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-green-50">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Newly Listed Homestays
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Fresh experiences just added to our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newlyListedHomestays.map((homestay) => (
            <Card
              key={homestay.id}
              className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => navigate(`/property/${homestay.id}`)}
            >
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {homestay.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={image}
                          alt={`${homestay.title} - Image ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 border-0 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-12" onClick={e => e.stopPropagation()} />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-gradient-to-r hover:from-pink-100 hover:to-red-100 border-0 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-rotate-12" onClick={e => e.stopPropagation()} />
                </Carousel>
                <Badge className="absolute top-3 left-3 bg-green-500">
                  {homestay.daysAgo === 1
                    ? "Today"
                    : `${homestay.daysAgo} days ago`}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(homestay.id);
                  }}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedProperties.includes(homestay.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {homestay.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {homestay.location}
                    </p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{homestay.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({homestay.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">
                      ₹{homestay.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Host: {homestay.host}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="border-green-300 text-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-400 hover:text-green-800"
          >
            View More New Listings
          </Button>
        </div>
      </section>

      {/* Homestays by District */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Homestays by District
          </h2>
          <p className="text-lg text-gray-600">
            Explore authentic stays across all 14 districts of Kerala
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {districtHomestays.map((district) => (
            <Card
              key={district.district}
              className="group cursor-pointer hover:shadow-md transition-all duration-200 p-4 hover:bg-gray-50"
            >
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {district.district}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {district.featured}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Badge
                    variant="outline"
                    className="text-pink-600 border-pink-300"
                  >
                    {district.count} stays
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            asChild
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
          >
            <Link to="/districts">Explore All Districts</Link>
          </Button>
        </div>
      </section>

      {/* Seasonal Booking Section */}
      <SeasonalBooking />

      {/* Value Proposition Section */}
      <ValueProposition />

      {/* Media Section */}
      <MediaSection />

      {/* Certifications Section */}
      <Certifications />

      {/* Updated Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Hevan Connect Travel</h3>
              <p className="text-gray-400 mb-4">
                Your trusted platform for authentic Kerala homestay experiences.
              </p>
              <p className="text-sm text-gray-500">
                Supporting Kerala tourism and local communities through
                sustainable travel.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Cancellation Options</li>
                <li>Travel Insurance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kerala Experiences</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Backwater Tours</li>
                <li>Spice Garden Visits</li>
                <li>Cultural Programs</li>
                <li>Ayurveda Wellness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li
                  tabIndex={0}
                  aria-label="Instagram"
                  className="group icon instagram relative flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg cursor-pointer transition-transform transform hover:scale-110 focus:scale-110 outline-none mx-auto px-4 py-2 gap-2"
                  onClick={() =>
                    window.open(
                      "https://instagram.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.open(
                        "https://instagram.com",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.3em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="bi bi-instagram"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                  <span className="text-xs font-medium">Instagram</span>
                </li>
                <li
                  tabIndex={0}
                  aria-label="YouTube"
                  className="group icon youtube relative flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg cursor-pointer transition-transform transform hover:scale-110 focus:scale-110 outline-none mx-auto px-4 py-2 gap-2"
                  onClick={() =>
                    window.open(
                      "https://youtube.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.open(
                        "https://youtube.com",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    fill="currentColor"
                    height="1.3em"
                  >
                    <path d="M549.655 124.083c-6.281-23.65-24.84-42.21-48.48-48.48C458.781 64 288 64 288 64s-170.781 0-213.175 11.603c-23.64 6.27-42.199 24.83-48.48 48.48C16 166.477 16 256 16 256s0 89.523 10.345 131.917c6.281 23.65 24.84 42.21 48.48 48.48C117.219 448 288 448 288 448s170.781 0 213.175-11.603c23.64-6.27 42.199-24.83 48.48-48.48C560 345.523 560 256 560 256s0-89.523-10.345-131.917zM232 336V176l142.857 80L232 336z" />
                  </svg>
                  <span className="text-xs font-medium">YouTube</span>
                </li>
                <li>About Us</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Hevan Connect Travel. All rights reserved. | Promoting
              sustainable Kerala tourism.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

function AnimatedStats() {
  const stats = [
    { label: "Verified Homestays", value: 200, suffix: "+", color: "text-pink-600" },
    { label: "Destinations", value: 50, suffix: "+", color: "text-pink-600" },
    { label: "Happy Guests", value: 5000, suffix: "+", color: "text-green-600" },
    { label: "Local Hosts", value: 300, suffix: "+", color: "text-blue-600" },
    { label: "Unique Experiences", value: 120, suffix: "+", color: "text-yellow-600" },
    { label: "Years of Service", value: 10, suffix: "+", color: "text-purple-600" },
  ];
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
      {stats.map((stat, idx) => (
        <div className="text-center" key={stat.label}>
          <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
            {inView ? (
              <CountUp end={stat.value} duration={1.5} suffix={stat.suffix} />
            ) : (
              `0${stat.suffix}`
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default Index;
