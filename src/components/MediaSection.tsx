
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Calendar } from 'lucide-react';

const MediaSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const testimonialVideos = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop&crop=face",
      title: "Amazing Backwater Experience",
      guest: "Sarah from Germany",
      location: "Alleppey Homestay",
      duration: "2:30"
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=300&h=200&fit=crop&crop=face",
      title: "Cultural Immersion Journey",
      guest: "Priya & Family",
      location: "Kochi Heritage Home",
      duration: "3:15"
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face",
      title: "Hill Station Adventure",
      guest: "Mike from Australia",
      location: "Munnar Mountain Stay",
      duration: "2:45"
    }
  ];

  const guestOfMonth = {
    name: "Anitha & Raj",
    story: "\"Our family homestay in Wayanad exceeded all expectations. The hosts treated us like family, and we learned to cook traditional Kerala dishes. The kids loved the spice garden tour!\"",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100&h=100&fit=crop&crop=face",
    location: "Wayanad Spice Homestay",
    date: "December 2024"
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">See What Guests Are Saying</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Testimonials */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-6">Guest Video Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonialVideos.map((video) => (
                <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100">
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-black bg-opacity-70 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{video.guest}</p>
                    <p className="text-xs text-gray-500">{video.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Guest of the Month */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Guest of the Month</h3>
            <Card className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={guestOfMonth.image} 
                    alt={guestOfMonth.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{guestOfMonth.name}</h4>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-4 italic">
                  {guestOfMonth.story}
                </blockquote>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">{guestOfMonth.location}</p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{guestOfMonth.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Follow our journey:</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  📸 Instagram
                </Button>
                <Button variant="outline" size="sm">
                  📺 YouTube
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
