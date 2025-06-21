import { useState } from 'react';
import Navbar from '@/components/Navbar';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';
import BannerSlider from '@/components/BannerSlider';
import AIAssistant from '@/components/AIAssistant';
import SeasonalBooking from '@/components/SeasonalBooking';
import ValueProposition from '@/components/ValueProposition';
import MediaSection from '@/components/MediaSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MapPin, Wifi, Car, Users, Home, Compass, Wrench, Plane, Clock, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('homes');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const toggleLike = (id: number) => {
    setLikedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(propId => propId !== id)
        : [...prev, id]
    );
  };

  const mainTabs = [
    { id: 'homes', label: 'Homes', icon: Home },
    { id: 'experiences', label: 'Experiences', icon: Compass },
    { id: 'services', label: 'Services', icon: Wrench }
  ];

  const regions = [
    { id: 'backwater', label: 'Backwater & Scenic', count: 45 },
    { id: 'hills', label: 'Hill Stations & Wildlife', count: 38 },
    { id: 'beaches', label: 'Beaches & Coastal', count: 32 },
    { id: 'cultural', label: 'Cultural & Heritage', count: 28 },
    { id: 'spiritual', label: 'Spiritual & Wellness', count: 22 }
  ];

  const filters = [
    { id: 'all', label: 'All Stays' },
    { id: 'budget', label: 'Budget Friendly' },
    { id: 'activities', label: 'Activities Nearby' },
    { id: 'eco', label: 'Eco-Certified' }
  ];

  const airports = [
    { name: 'Ernakulam (Kochi)', code: 'COK', stays: 120 },
    { name: 'Trivandrum', code: 'TRV', stays: 85 },
    { name: 'Calicut (Kozhikode)', code: 'CCJ', stays: 67 },
    { name: 'Kannur', code: 'CNN', stays: 42 }
  ];

  const featuredProperties = [
    {
      id: 1,
      title: "Traditional Backwater Homestay",
      location: "Alleppey, Kerala",
      price: 3500,
      rating: 4.8,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Priya",
      isNew: true,
      region: 'backwater',
      amenities: ['Wifi', 'Car', 'Boat'],
      isEco: true
    },
    {
      id: 2,
      title: "Heritage Spice Garden Villa",
      location: "Thekkady, Kerala",
      price: 6500,
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      host: "Arjun",
      isCertified: true,
      region: 'cultural',
      amenities: ['Wifi', 'Car', 'Spa'],
      isEco: false
    },
    {
      id: 3,
      title: "Coastal Fishing Village Stay",
      location: "Varkala, Kerala",
      price: 4200,
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
      host: "Sunita",
      region: 'beaches',
      amenities: ['Wifi', 'Beach Access'],
      isEco: true
    },
    {
      id: 4,
      title: "Mountain View Tea Estate",
      location: "Munnar, Kerala",
      price: 2800,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      host: "Rajesh",
      isNew: true,
      region: 'hills',
      amenities: ['Wifi', 'Trek Guide'],
      isEco: true
    }
  ];

  const filteredProperties = featuredProperties.filter(property => {
    if (activeFilter === 'budget') return property.price < 4000;
    if (activeFilter === 'eco') return property.isEco;
    if (activeFilter === 'activities') return property.amenities.length > 2;
    return true;
  });

  const priorityHomestays = [
    {
      id: 101,
      title: "Premium Backwater Heritage Villa",
      location: "Kumarakom, Kottayam",
      price: 8500,
      rating: 4.9,
      reviews: 245,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Maya Krishnan",
      isPriority: true,
      district: "Kottayam"
    },
    {
      id: 102,
      title: "Royal Spice Estate Mansion",
      location: "Kumily, Idukki",
      price: 12000,
      rating: 4.8,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      host: "Ravi Menon",
      isPriority: true,
      district: "Idukki"
    },
    {
      id: 103,
      title: "Coastal Palace Homestay",
      location: "Kovalam, Thiruvananthapuram",
      price: 9500,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
      host: "Priya Nair",
      isPriority: true,
      district: "Thiruvananthapuram"
    }
  ];

  const airportDistricts = [
    { name: "Ernakulam", code: "COK", stays: 120, description: "Gateway to Backwaters" },
    { name: "Thiruvananthapuram", code: "TRV", stays: 85, description: "Capital Heritage" },
    { name: "Calicut", code: "CCJ", stays: 67, description: "Malabar Culture" },
    { name: "Kannur", code: "CNN", stays: 42, description: "Theyyam Land" }
  ];

  const newlyListedHomestays = [
    {
      id: 201,
      title: "Bamboo Grove Eco Stay",
      location: "Wayanad",
      price: 3800,
      rating: 4.7,
      reviews: 23,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      host: "Arjun Kumar",
      isNew: true,
      daysAgo: 2
    },
    {
      id: 202,
      title: "Traditional Tharavad",
      location: "Thrissur",
      price: 5200,
      rating: 4.6,
      reviews: 8,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
      host: "Lakshmi Pillai",
      isNew: true,
      daysAgo: 5
    },
    {
      id: 203,
      title: "Hillside Tea Cottage",
      location: "Munnar, Idukki",
      price: 4500,
      rating: 4.8,
      reviews: 15,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      host: "Suresh Varma",
      isNew: true,
      daysAgo: 1
    },
    {
      id: 204,
      title: "Fishing Village Home",
      location: "Kollam",
      price: 3200,
      rating: 4.5,
      reviews: 12,
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
      host: "Bindu Jose",
      isNew: true,
      daysAgo: 3
    }
  ];

  const districtHomestays = [
    { district: "Thiruvananthapuram", count: 85, featured: "Kovalam Beach Stays" },
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
    { district: "Kasaragod", count: 31, featured: "Northernmost Beauty" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div className="relative min-h-[600px] bg-cover bg-center bg-no-repeat" 
           style={{
             backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=800&fit=crop')"
           }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] px-4">
          {/* Hero Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Live like a local. Discover Kerala's soul<br />
              <span className="text-yellow-300">with a welcoming family</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Experience authentic homestays and connect with Kerala's rich culture
            </p>
          </div>

          {/* Main Tabs */}
          <div className="flex justify-center space-x-8 mb-8">
            {mainTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-gray-900 shadow-lg' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {(tab.id === 'experiences' || tab.id === 'services') && (
                    <Badge className="bg-pink-500 text-white text-xs">NEW</Badge>
                  )}
                </button>
              );
            })}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Kerala's Beauty</h2>
          <p className="text-lg text-gray-600">Discover the diverse landscapes and rich culture of God's Own Country</p>
        </div>
        <BannerSlider />
      </div>

      {/* Platform Introduction */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Hevan Connect Travel</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Hevan Connect Travel opens the doors to Kerala’s most authentic homestay experiences—
 connecting travelers with traditional homes, vibrant local culture, and warm-hearted hosts. Every 
stay is handpicked to offer more than comfort. a deeper connection to the people, traditions, and 
natural beauty of Kerala. As a meaningful alternative to conventional accommodations unit, our 
platform helps guests discover immersive, affordable stays while supporting sustainable tourism 
and local livelihoods.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">200+</div>
                <div className="text-sm text-gray-600">Verified Homestays</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">50+</div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=400&fit=crop"
              alt="Kerala homestay experience"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Homestay Discovery Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your next story starts in a Kerala home ?</h2>
        
        {/* Region Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {regions.map((region) => (
            <Badge
              key={region.id}
              variant="outline"
              className="px-4 py-2 cursor-pointer hover:bg-pink-100 hover:border-pink-300"
            >
              {region.label} ({region.count})
            </Badge>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Airport Access Districts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {airports.map((airport) => (
            <Card key={airport.code} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-lg font-bold text-gray-900">{airport.name}</div>
              <div className="text-sm text-gray-600">{airport.code}</div>
              <div className="text-xs text-pink-600 mt-1">{airport.stays} stays nearby</div>
            </Card>
          ))}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden" onClick={() => navigate(`/property/${property.id}`)}>
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
                {property.isEco && (
                  <Badge className="absolute bottom-3 left-3 bg-green-600">Eco-Friendly</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
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
                
                {/* Amenities */}
                <div className="flex items-center space-x-2 mb-2">
                  {property.amenities.includes('Wifi') && <Wifi className="w-3 h-3 text-gray-500" />}
                  {property.amenities.includes('Car') && <Car className="w-3 h-3 text-gray-500" />}
                  <Users className="w-3 h-3 text-gray-500" />
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
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/properties">View all Kerala homestays</Link>
          </Button>
        </div>
      </section>

      {/* Priority Homestays – District Focus */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-pink-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Priority Homestays – District Focus</h2>
          </div>
          <p className="text-lg text-gray-600">Handpicked premium homestays from Kerala's most sought-after districts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {priorityHomestays.map((homestay) => (
            <Card key={homestay.id} className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-pink-200" onClick={() => navigate(`/property/${homestay.id}`)}>
              <div className="relative">
                <img 
                  src={homestay.image} 
                  alt={homestay.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1">
                  Priority Choice
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center text-sm font-medium">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {homestay.rating}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{homestay.title}</h3>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {homestay.location}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-pink-600">₹{homestay.price.toLocaleString()}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <span className="text-sm text-gray-600">({homestay.reviews} reviews)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Host: {homestay.host}</span>
                  <Badge variant="outline" className="text-pink-600 border-pink-300">
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
            <h2 className="text-3xl font-bold text-gray-900">Airport-Accessible District Highlights</h2>
          </div>
          <p className="text-lg text-gray-600">Quick access to Kerala's best homestays from major airports</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {airportDistricts.map((district) => (
            <Card key={district.code} className="group cursor-pointer hover:shadow-lg transition-all duration-300 text-center p-6 border-2 hover:border-blue-300">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">✈️ {district.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{district.description}</p>
                <Badge className="bg-blue-100 text-blue-800">{district.code}</Badge>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-2xl font-bold text-blue-600">{district.stays}</div>
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
            <h2 className="text-3xl font-bold text-gray-900">Newly Listed Homestays</h2>
          </div>
          <p className="text-lg text-gray-600">Fresh experiences just added to our platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newlyListedHomestays.map((homestay) => (
            <Card key={homestay.id} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden" onClick={() => navigate(`/property/${homestay.id}`)}>
              <div className="relative">
                <img 
                  src={homestay.image} 
                  alt={homestay.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <Badge className="absolute top-3 left-3 bg-green-500">
                  {homestay.daysAgo === 1 ? 'Today' : `${homestay.daysAgo} days ago`}
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
                    className={`w-4 h-4 ${likedProperties.includes(homestay.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{homestay.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {homestay.location}
                    </p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{homestay.rating}</span>
                    <span className="text-gray-500 ml-1">({homestay.reviews})</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">₹{homestay.price.toLocaleString()}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <span className="text-sm text-gray-600">Host: {homestay.host}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
            View More New Listings
          </Button>
        </div>
      </section>

      {/* Homestays by District */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Homestays by District</h2>
          <p className="text-lg text-gray-600">Explore authentic stays across all 14 districts of Kerala</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {districtHomestays.map((district) => (
            <Card key={district.district} className="group cursor-pointer hover:shadow-md transition-all duration-200 p-4 hover:bg-gray-50">
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{district.district}</h3>
                <p className="text-sm text-gray-600 mb-2">{district.featured}</p>
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="outline" className="text-pink-600 border-pink-300">
                    {district.count} stays
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button asChild>
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

      {/* Updated Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Hevan Connect Travel</h3>
              <p className="text-gray-400 mb-4">Your trusted platform for authentic Kerala homestay experiences.</p>
              <p className="text-sm text-gray-500">Supporting Kerala tourism and local communities through sustainable travel.</p>
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
                <li>📸 Instagram Stories</li>
                <li>📺 YouTube Channel</li>
                <li>About Us</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hevan Connect Travel. All rights reserved. | Promoting sustainable Kerala tourism.</p>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Index;
