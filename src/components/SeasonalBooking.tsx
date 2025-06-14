
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Waves, Leaf, Sun, Snowflake } from 'lucide-react';

const SeasonalBooking = () => {
  const [activeTab, setActiveTab] = useState('summer');

  const seasons = [
    {
      id: 'summer',
      title: 'Summer Escapes',
      icon: Sun,
      color: 'bg-yellow-500',
      properties: [
        { name: 'Hill Station Cottage', location: 'Munnar', price: 3200, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" },
        { name: 'Cool Mountain Retreat', location: 'Wayanad', price: 2800, image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: 'monsoon',
      title: 'Monsoon Magic',
      icon: Waves,
      color: 'bg-blue-500',
      properties: [
        { name: 'Rainforest Lodge', location: 'Thekkady', price: 2500, image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=300&h=200&fit=crop" },
        { name: 'Misty Valley Home', location: 'Idukki', price: 2200, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: 'onam',
      title: 'Onam Specials',
      icon: Leaf,
      color: 'bg-green-500',
      properties: [
        { name: 'Heritage Homestay', location: 'Kochi', price: 4500, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop" },
        { name: 'Cultural Village Stay', location: 'Alappuzha', price: 3800, image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: 'winter',
      title: 'Winter Holidays',
      icon: Snowflake,
      color: 'bg-purple-500',
      properties: [
        { name: 'Cozy Beach Cottage', location: 'Varkala', price: 3500, image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=300&h=200&fit=crop" },
        { name: 'Backwater Villa', location: 'Kumarakom', price: 4200, image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=300&h=200&fit=crop" }
      ]
    }
  ];

  const activeSeason = seasons.find(s => s.id === activeTab);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book by Season or Festival</h2>
        
        {/* Season Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {seasons.map((season) => {
            const IconComponent = season.icon;
            return (
              <Button
                key={season.id}
                variant={activeTab === season.id ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  activeTab === season.id ? season.color : ''
                }`}
                onClick={() => setActiveTab(season.id)}
              >
                <IconComponent className="w-4 h-4" />
                <span>{season.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Seasonal Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSeason?.properties.map((property, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <Badge className={`absolute top-3 left-3 ${activeSeason.color}`}>
                  {activeSeason.title}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">₹{property.price.toLocaleString()}</span>
                  <span className="text-gray-600 text-sm">/ night</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mini Calendar */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Festivals: Onam (Aug-Sep), Diwali (Oct-Nov), Christmas (Dec)</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SeasonalBooking;
