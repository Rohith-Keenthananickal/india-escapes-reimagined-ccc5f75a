
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchFilters from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Play, MapPin, Users, Wifi, Car } from 'lucide-react';

const Index = () => {
  const [likedProperties, setLikedProperties] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(propId => propId !== id)
        : [...prev, id]
    );
  };

  const featuredProperties = [
    {
      id: 1,
      title: "Cozy Hill Station Cottage",
      location: "Mussoorie, Uttarakhand",
      price: 3500,
      rating: 4.8,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
      host: "Priya",
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
      host: "Sunita"
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
      isNew: true
    }
  ];

  const collections = [
    {
      title: "Hill Stations",
      count: "200+ stays",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
    },
    {
      title: "Beach Houses",
      count: "150+ stays",
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=300&h=200&fit=crop"
    },
    {
      title: "Heritage Stays",
      count: "80+ stays",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop"
    },
    {
      title: "Luxury Villas",
      count: "120+ stays",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=300&h=200&fit=crop"
    }
  ];

  const guestStories = [
    {
      name: "Amit & Family",
      story: "The most peaceful getaway we've had in years. The host was incredibly welcoming!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      location: "Stayed in Coorg"
    },
    {
      name: "Neha & Friends",
      story: "Perfect for our girl's trip! Beautiful views and amazing local food recommendations.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=60&h=60&fit=crop&crop=face",
      location: "Stayed in Goa"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-pink-500 to-orange-500">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find your perfect<br />
              <span className="text-yellow-300">getaway</span>
            </h1>
            <p className="text-xl mb-8 max-w-lg">
              Discover unique stays and experiences across India, from cozy homestays to luxury villas.
            </p>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <SearchFilters />
      </div>

      {/* Popular Homestays */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Popular homestays</h2>
          <Button variant="outline">View all</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Card key={property.id} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
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
      </section>

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-40">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-bold text-lg">{collection.title}</h3>
                    <p className="text-sm opacity-90">{collection.count}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Video Highlight */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
            alt="Experience video"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100">
              <Play className="w-6 h-6 mr-2" />
              Watch experiences
            </Button>
          </div>
        </div>
      </section>

      {/* Guest Stories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Guest stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guestStories.map((story, index) => (
            <Card key={index} className="p-6">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <blockquote className="text-gray-700 mb-3">
                      "{story.story}"
                    </blockquote>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{story.name}</p>
                      <p className="text-gray-600">{story.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">VacayRentals</h3>
              <p className="text-gray-400">Your trusted platform for unique stays across India.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Cancellation Options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hosting</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Become a Host</li>
                <li>Host Resources</li>
                <li>Community Forum</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VacayRentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
