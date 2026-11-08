import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Users, Heart, ShoppingCart, ImageOff, Loader2, Eye } from 'lucide-react';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';
import { useCartQuery } from '@/modules/cart/hooks/useCart';
import { useCartMutations } from '@/modules/cart/hooks/useCartMutations';
import type { NormalizedExperience } from '../types/experiences.types';

interface ExperienceCardProps {
  experience: NormalizedExperience;
  isLiked?: boolean;
  onToggleLike?: (id: number) => void;
}

export const ExperienceCard = ({
  experience,
  isLiked = false,
  onToggleLike,
}: ExperienceCardProps) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { data: cart } = useCartQuery(isAuthenticated);
  const { addItem } = useCartMutations();
  const [experienceDate, setExperienceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isInCart =
    cart?.items?.some(
      (item) => item.item_type === 'EXPERIENCE' && item.experience_id === experience.id
    ) ?? false;

  const handleAddToCart = async () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }
    if (!requireAuth('/experiences')) return;
    if (!showDatePicker) {
      setShowDatePicker(true);
      return;
    }
    await addItem.mutateAsync({
      item_type: 'EXPERIENCE',
      experience_id: experience.id,
      experience_date: experienceDate,
      guest_count: Math.max(1, guests),
    });
    setShowDatePicker(false);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#2BB0BB]/50 bg-white flex flex-col justify-between rounded-2xl">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 flex items-center justify-center">
          {experience.image ? (
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
              <ImageOff className="w-8 h-8 text-gray-300 mb-1" />
              <span className="text-xs">No photo provided</span>
            </div>
          )}

          {experience.category && (
            <Badge className="absolute top-3 left-3 bg-[#D4A237] text-white shadow-sm font-semibold text-xs">
              {experience.category}
            </Badge>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/85 hover:bg-white z-10 h-8 w-8 rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.(experience.id);
            }}
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#1A8491] transition-colors line-clamp-1 font-heading">
              {experience.title}
            </h3>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed min-h-[38px]">
            {experience.description || 'No description provided by the host.'}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{experience.duration}</span>
            </div>
            {experience.groupSize > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Up to {experience.groupSize} guests</span>
              </div>
            )}
          </div>

          {showDatePicker && !isInCart && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Input
                type="date"
                value={experienceDate}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setExperienceDate(e.target.value)}
                className="text-xs"
              />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="text-xs border border-gray-200 rounded-md px-2 bg-gray-50"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} guest{n === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center mt-auto">
        <div>
          {experience.price > 0 ? (
            <>
              <span className="text-xl font-extrabold text-gray-900">
                ₹{experience.price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-xs">
                {' '}
                / {experience.isPriceByGuest ? 'guest' : 'group'}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-600">Price on inquiry</span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={addItem.isPending}
          className={`font-semibold text-xs py-2 px-3 gap-1.5 transition-all ${
            isInCart
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#2BB0BB] hover:bg-[#1A8491] text-[#1F1F1F] hover:text-white font-bold'
          }`}
        >
          {addItem.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isInCart ? (
            <>
              <Eye className="w-3.5 h-3.5" /> View Cart
            </>
          ) : showDatePicker ? (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Confirm
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ExperienceCard;
