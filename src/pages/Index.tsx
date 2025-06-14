import { useState } from 'react';
import Navbar from '@/components/Navbar';
import BannerSlider from '@/components/BannerSlider';
import AIAssistant from '@/components/AIAssistant';
import SeasonalBooking from '@/components/SeasonalBooking';
import ValueProposition from '@/components/ValueProposition';
import MediaSection from '@/components/MediaSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MapPin, Wifi, Car, Users, Home, Compass, Wrench, Calendar, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('homes');
  const [activeFilter, setActiveFilter] = useState('all');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Banner Slider */}
      <section className="relative">
        <BannerSlider />
        
        {/* Search Overlay */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="flex space-x-1">
                {mainTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                        activeTab === tab.id 
                          ? 'bg-gray-900 text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                      {(tab.id === 'experiences' || tab.id === 'services') && (
                        <Badge className="bg-blue-500 text-xs px-2 py-1">NEW</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="w-full shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Where */}
                <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Where</label>
                    <input
                      type="text"
                      placeholder="Search destinations"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Check in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent text-sm"
                      placeholder="Add dates"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Check out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent text-sm"
                      placeholder="Add dates"
                    />
                  </div>
                </div>

                {/* Who - with search button */}
                <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Who</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full text-gray-600 border-none outline-none bg-transparent text-sm cursor-pointer"
                      >
                        <option value="1">1 guest</option>
                        <option value="2">2 guests</option>
                        <option value="3">3 guests</option>
                        <option value="4">4+ guests</option>
                      </select>
                    </div>
                    <Button className="ml-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full p-4 h-12 w-12 flex items-center justify-center shadow-lg">
                      <Search className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Platform Introduction */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Hevan Connect Travel</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Hevan Connect Travel opens the doors to Kerala's most authentic homestay experiences—connecting travelers with traditional homes, vibrant local culture, and warm-hearted hosts. Discover the real Kerala through the eyes of locals who call it home.
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
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Discover Kerala by Region</h2>
        
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
