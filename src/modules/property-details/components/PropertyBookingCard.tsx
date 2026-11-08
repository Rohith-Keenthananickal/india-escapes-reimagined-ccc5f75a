import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Check, Loader2, AlertTriangle, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';
import { useCartQuery } from '@/modules/cart/hooks/useCart';
import { useCartMutations } from '@/modules/cart/hooks/useCartMutations';
import { useQuoteQuery, useAvailabilityQuery } from '@/modules/bookings/hooks/useQuote';
import type { NormalizedPropertyDetails } from '../types/propertyDetails.types';

interface PropertyBookingCardProps {
  property: NormalizedPropertyDetails;
}

export const PropertyBookingCard = ({ property }: PropertyBookingCardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { data: cart } = useCartQuery(isAuthenticated);
  const { addItem } = useCartMutations();

  const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');
  const getTomorrowStr = () => format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || getTodayStr());
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || getTomorrowStr());
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    property.rooms?.[0]?.id ?? null
  );

  useEffect(() => {
    const qIn = searchParams.get('checkIn');
    if (qIn) setCheckIn(qIn);
    const qOut = searchParams.get('checkOut');
    if (qOut) setCheckOut(qOut);
    const qG = Number(searchParams.get('guests'));
    if (qG) setGuests(qG);
  }, [searchParams]);

  const hasRooms = (property.rooms?.length ?? 0) > 0;
  const bookingType = hasRooms ? 'ROOM' : 'WHOLE_PROPERTY';
  const itemType = hasRooms ? 'STAY_ROOM' : 'STAY_WHOLE_PROPERTY';

  const quotePayload = useMemo(
    () =>
      checkIn && checkOut
        ? {
            property_id: property.id,
            booking_type: bookingType as 'ROOM' | 'WHOLE_PROPERTY',
            check_in_date: checkIn,
            check_out_date: checkOut,
            guest_count: Math.max(1, guests || 1),
            ...(hasRooms && selectedRoomId
              ? { rooms: [{ room_id: selectedRoomId, quantity: 1 }], room_id: selectedRoomId }
              : {}),
          }
        : null,
    [property.id, bookingType, checkIn, checkOut, guests, hasRooms, selectedRoomId]
  );

  const { data: quote, isFetching: isQuoteLoading } = useQuoteQuery(quotePayload, true);
  const { data: availability } = useAvailabilityQuery(quotePayload, true);

  // One stay per property — if this property is already in cart, show View Cart
  const isInCart =
    cart?.items?.some(
      (item) =>
        item.property_id === property.id &&
        (item.item_type === 'STAY_ROOM' || item.item_type === 'STAY_WHOLE_PROPERTY')
    ) ?? false;

  const displayTotal =
    quote?.total_guest_payment ??
    (property.price > 0 ? property.price * Math.max(1, guests || 1) : 0);
  const nights = quote?.nights_count ?? 1;
  const isAvailable = availability?.is_available !== false;

  const buildCartPayload = () => ({
    item_type: itemType as 'STAY_ROOM' | 'STAY_WHOLE_PROPERTY',
    property_id: property.id,
    check_in_date: checkIn,
    check_out_date: checkOut,
    guest_count: Math.max(1, guests || 1),
    ...(hasRooms && selectedRoomId
      ? { rooms: [{ room_id: selectedRoomId, quantity: 1 }] }
      : {}),
  });

  const handleAddToCart = async () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }
    if (!requireAuth(`/property/${property.id}`)) return;
    if (!checkIn || !checkOut) {
      toast({ title: 'Select dates', description: 'Choose check-in and check-out.', variant: 'destructive' });
      return;
    }
    await addItem.mutateAsync(buildCartPayload());
  };

  const handleReserve = async () => {
    if (isInCart) {
      navigate('/checkout');
      return;
    }
    if (!requireAuth(`/property/${property.id}`)) return;
    if (!checkIn || !checkOut) {
      toast({ title: 'Select dates', description: 'Choose check-in and check-out.', variant: 'destructive' });
      return;
    }
    await addItem.mutateAsync(buildCartPayload());
    navigate('/checkout');
  };

  return (
    <Card className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-3xl p-6">
      <CardContent className="p-0 space-y-6">
        <div className="flex justify-between items-baseline border-b pb-4">
          <div>
            {displayTotal > 0 ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">
                    ₹{Number(displayTotal).toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm"> total</span>
                </div>
                {isQuoteLoading && (
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Updating quote…
                  </p>
                )}
                {nights > 1 && !isQuoteLoading && (
                  <p className="text-xs text-gray-500 mt-0.5">{nights} nights</p>
                )}
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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Check-in</Label>
            <Input
              type="date"
              value={checkIn}
              min={getTodayStr()}
              onChange={(e) => setCheckIn(e.target.value)}
              className="text-xs bg-gray-50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Check-out</Label>
            <Input
              type="date"
              value={checkOut}
              min={checkIn || getTomorrowStr()}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-xs bg-gray-50"
            />
          </div>
        </div>

        {hasRooms && (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Room</Label>
            <select
              value={selectedRoomId ?? ''}
              onChange={(e) => setSelectedRoomId(Number(e.target.value))}
              className="w-full text-sm bg-gray-50 border border-gray-200 rounded-md p-2"
            >
              {property.rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomType} · up to {room.maxOccupancy} guests
                </option>
              ))}
            </select>
          </div>
        )}

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

        <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
          {quote ? (
            <>
              <div className="flex justify-between">
                <span>Accommodation</span>
                <span>₹{Number(quote.base_accommodation_amount || 0).toLocaleString()}</span>
              </div>
              {(quote.accommodation_gst_amount as number) > 0 && (
                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{Number(quote.accommodation_gst_amount).toLocaleString()}</span>
                </div>
              )}
              {(quote.total_guest_platform_fee as number) > 0 && (
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{Number(quote.total_guest_platform_fee).toLocaleString()}</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between">
              <span>Estimated</span>
              <span>{displayTotal > 0 ? `₹${Number(displayTotal).toLocaleString()}` : '—'}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-gray-900 border-t pt-2">
            <span>Total</span>
            <span className="text-[#1A8491]">
              {displayTotal > 0 ? `₹${Number(displayTotal).toLocaleString()}` : 'Price on request'}
            </span>
          </div>
        </div>

        {!isAvailable && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{availability?.message || 'Not available for these dates.'}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {isInCart ? (
            <>
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl py-2.5 px-3">
                <Check className="w-4 h-4" />
                Already in your trip cart
              </div>
              <Button
                onClick={() => navigate('/cart')}
                className="w-full py-6 text-base font-bold bg-[#2BB0BB] hover:bg-[#1A8491] text-white shadow-lg shadow-[#2BB0BB]/20 rounded-xl transition-all duration-300 gap-2"
              >
                <Eye className="w-4 h-4" /> View Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/checkout')}
                className="w-full py-5 text-sm font-semibold border-gray-300 hover:bg-gray-50 rounded-xl"
              >
                Continue to Checkout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleReserve}
                disabled={!isAvailable || addItem.isPending}
                className="w-full py-6 text-base font-bold bg-[#2BB0BB] hover:bg-[#1A8491] text-white shadow-lg shadow-[#2BB0BB]/20 rounded-xl transition-all duration-300"
              >
                {addItem.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait…
                  </>
                ) : (
                  'Reserve Now'
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleAddToCart}
                disabled={!isAvailable || addItem.isPending}
                className="w-full py-5 text-sm font-semibold border-gray-300 hover:bg-gray-50 rounded-xl gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Trip
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyBookingCard;
