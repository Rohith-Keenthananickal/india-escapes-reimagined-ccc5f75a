import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star, Heart, MapPin, Wifi, Car, Users, Utensils, ImageOff } from 'lucide-react';
import type { LandingPropertyCard } from '../types/landing.types';

interface HomestayCardProps {
  property: LandingPropertyCard;
  isLiked?: boolean;
  onToggleLike?: (id: number) => void;
  badgeLabel?: string;
}

export const HomestayCard = ({
  property,
  isLiked = false,
  onToggleLike,
  badgeLabel,
}: HomestayCardProps) => {
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const images = property.images || [];
  const hasImages = images.length > 0;

  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-pink-300 flex flex-col h-full bg-white"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {hasImages ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full -ml-0">
              {images.map((image, index) => (
                <CarouselItem key={index} className="pl-0 h-full">
                  {failedImages[index] ? (
                    <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                      <ImageOff className="w-8 h-8 mb-1 text-gray-300" />
                      <span className="text-xs">Image unavailable</span>
                    </div>
                  ) : (
                    <img
                      src={image}
                      alt={`${property.title} - photo ${index + 1}`}
                      loading="lazy"
                      onError={() => handleImageError(index)}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-md transition-all duration-200 hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                />
                <CarouselNext
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-md transition-all duration-200 hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                />
              </>
            )}
          </Carousel>
        ) : (
          <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <ImageOff className="w-8 h-8 mb-1 text-gray-300" />
            <span className="text-xs font-medium">No photo uploaded</span>
          </div>
        )}

        {/* Favorite heart button */}
        <Button
          variant="ghost"
          size="icon"
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 bg-white/85 hover:bg-white z-10 h-8 w-8 rounded-full shadow-md transition-all duration-300 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike?.(property.id);
          }}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </Button>

        {/* Dynamic badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {badgeLabel && (
            <Badge className="bg-emerald-600 text-white shadow-sm font-medium text-xs">
              {badgeLabel}
            </Badge>
          )}
          {property.isNew && !badgeLabel && (
            <Badge className="bg-emerald-500 text-white shadow-sm font-medium text-xs">
              New
            </Badge>
          )}
          {property.isCertified && (
            <Badge className="bg-blue-600 text-white shadow-sm font-medium text-xs">
              Certified
            </Badge>
          )}
          {property.classification && property.classification !== 'UNCLASSIFIED' && (
            <Badge variant="outline" className="bg-white/90 text-gray-800 font-semibold border-amber-300 text-xs">
              {property.classification}
            </Badge>
          )}
        </div>

        {property.isEco && (
          <Badge className="absolute bottom-3 left-3 bg-emerald-700/90 text-white backdrop-blur-sm z-10 text-xs">
            🌿 Eco-Friendly
          </Badge>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="font-semibold text-gray-900 line-clamp-1 text-base group-hover:text-pink-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-xs shrink-0 text-gray-500">
              {property.rating > 0 ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span className="font-medium text-gray-900">{property.rating}</span>
                  <span className="ml-0.5">({property.reviews})</span>
                </>
              ) : (
                <span className="text-[11px] text-gray-400">No ratings yet</span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 flex items-center mb-2 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
            <span>{property.location}</span>
          </p>

          {/* Real Amenities */}
          <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs min-h-[18px]">
            {property.amenities.includes('Wifi') && (
              <span className="flex items-center gap-0.5" title="WiFi Available">
                <Wifi className="w-3.5 h-3.5" /> WiFi
              </span>
            )}
            {property.amenities.includes('Car') && (
              <span className="flex items-center gap-0.5" title="Parking / Car Service">
                <Car className="w-3.5 h-3.5" /> Parking
              </span>
            )}
            {property.amenities.includes('Meals') && (
              <span className="flex items-center gap-0.5" title="Meals Available">
                <Utensils className="w-3.5 h-3.5" /> Meals
              </span>
            )}
            {property.amenities.length === 0 && (
              <span className="flex items-center gap-0.5 text-gray-400" title="Homestay Stay">
                <Users className="w-3.5 h-3.5" /> Homestay
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div>
            {property.price > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ₹{property.price.toLocaleString()}
                </span>
                <span className="text-gray-500 text-xs"> / night</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-gray-600">Price on request</span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
            {property.host}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomestayCard;
