
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const EnhancedSearchBar = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Where</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Kerala destinations..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 border-gray-300 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Check-in */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="pl-10 border-gray-300 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="pl-10 border-gray-300 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-pink-500 focus:outline-none"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
            <Search className="w-4 h-4 mr-2" />
            Search Kerala Homestays
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSearchBar;
