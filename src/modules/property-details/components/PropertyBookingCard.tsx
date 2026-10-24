import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import type { NormalizedPropertyDetails } from '../types/propertyDetails.types';

interface PropertyBookingCardProps {
  property: NormalizedPropertyDetails;
}

export const PropertyBookingCard = ({ property }: PropertyBookingCardProps) => {
  const navigate = useNavigate();
  const { addHotel, hotels } = useCart();
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const isInCart = hotels.some((item) => String(item.id) === String(property.id));
  const nightPrice = property.price || 0;
  const sustainabilityFee = nightPrice > 0 ? 150 : 0;
  const totalPrice = nightPrice + sustainabilityFee;

  const handleAddToCart = () => {
    const parsedCheckIn = checkIn ? new Date(checkIn) : new Date();
    const parsedCheckOut = checkOut ? new Date(checkOut) : new Date(Date.now() + 86400000);

    addHotel({
      id: String(property.id),
      title: property.title,
      location: property.location || 'Kerala, India',
      price: nightPrice,
      rating: property.rating || 0,
      image: property.images && property.images.length > 0 ? property.images[0] : '',
      checkIn: parsedCheckIn,
      checkOut: parsedCheckOut,
      guests,
      rooms: 1,
      totalAmount: totalPrice,
    });

    toast({
      title: 'Added to Trip Cart',
      description: `${property.title} has been added to your journey.`,
    });
  };

  const handleInstantBook = () => {
    handleAddToCart();
    navigate(`/booking/${property.id}`);
  };

  return (
    <Card className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-3xl p-6">
      <CardContent className="p-0 space-y-6">
        <div className="flex justify-between items-baseline border-b pb-4">
          <div>
            {nightPrice > 0 ? (
              <>
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{nightPrice.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm"> / night</span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-700">Price on Request</span>
            )}
          </div>
          {property.classification && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              {property.classification}
            </span>
          )}
        </div>

        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Check-in</Label>
            <div className="relative">
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="text-xs bg-gray-50"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Check-out</Label>
            <div className="relative">
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="text-xs bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Guests selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Guests</Label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-md p-2"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing calculations */}
        <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Base Fare (1 night)</span>
            <span>{nightPrice > 0 ? `₹${nightPrice.toLocaleString()}` : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span>Community & Sustainability Fee</span>
            <span>{sustainabilityFee > 0 ? `₹${sustainabilityFee}` : '—'}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-gray-900 border-t pt-2">
            <span>Total</span>
            <span className="text-pink-600">
              {totalPrice > 0 ? `₹${totalPrice.toLocaleString()}` : 'Price on request'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleInstantBook}
            className="w-full py-6 text-base font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-600/20 rounded-xl"
          >
            Reserve Now
          </Button>

          <Button
            variant="outline"
            onClick={handleAddToCart}
            disabled={isInCart}
            className="w-full py-5 text-sm font-semibold border-gray-300 hover:bg-gray-50 rounded-xl gap-2"
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> In Your Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Journey Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyBookingCard;
