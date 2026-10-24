import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Heart, ShoppingCart, Check, ImageOff } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
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
  const { addExperience, experiences: cartExperiences } = useCart();
  const isInCart = cartExperiences.some((item) => item.id === experience.id);

  const handleAddToCart = () => {
    addExperience({
      id: experience.id,
      title: experience.title,
      location: 'Kerala, India',
      price: experience.price,
      duration: experience.duration,
      image: experience.image,
      guests: 1,
    });

    toast({
      title: 'Added to Cart',
      description: `${experience.title} added to your journey.`,
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-amber-400 bg-white flex flex-col justify-between rounded-2xl">
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
            <Badge className="absolute top-3 left-3 bg-amber-600 text-white shadow-sm font-semibold text-xs">
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
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-amber-600 transition-colors line-clamp-1">
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
        </CardContent>
      </div>

      <div className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center mt-auto">
        <div>
          {experience.price > 0 ? (
            <>
              <span className="text-xl font-extrabold text-gray-900">
                ₹{experience.price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-xs"> / {experience.isPriceByGuest ? 'guest' : 'group'}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-600">Price on inquiry</span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`font-semibold text-xs py-2 px-3 gap-1.5 transition-all ${
            isInCart
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
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
