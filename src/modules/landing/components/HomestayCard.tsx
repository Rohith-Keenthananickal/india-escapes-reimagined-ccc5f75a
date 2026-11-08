import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Star, Heart, MapPin, Wifi, Car, Users, Utensils, ImageOff } from 'lucide-react';
import type { LandingPropertyCard } from '../types/landing.types';

interface HomestayCardProps {
  property: LandingPropertyCard;
  isLiked?: boolean;
  onToggleLike?: (id: number) => void;
  badgeLabel?: string;
  stayDates?: { checkIn?: string; checkOut?: string; guests?: number };
}

export const HomestayCard = ({
  property,
  isLiked = false,
  onToggleLike,
  badgeLabel,
  stayDates,
}: HomestayCardProps) => {
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleCardClick = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const tomorrowStr = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

    const params = new URLSearchParams();
    params.set('checkIn', stayDates?.checkIn || todayStr);
    params.set('checkOut', stayDates?.checkOut || tomorrowStr);
    params.set('guests', String(stayDates?.guests || 2));
    const query = params.toString();
    navigate(`/property/${property.id}${query ? `?${query}` : ''}`);
  };

  const images = property.images || [];
  const hasImages = images.length > 0;

  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#2BB0BB]/50 flex flex-col h-full bg-white rounded-2xl w-full"
      onClick={handleCardClick}
    >
      {/* Photo Media Container with responsive aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex items-center justify-center select-none">
        {hasImages ? (
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {images.map((image, index) => (
                <CarouselItem key={index} className="pl-0 h-full w-full">
                  {failedImages[index] ? (
                    <div className="w-full h-full min-h-[200px] bg-gray-50 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                      <ImageOff className="w-8 h-8 mb-1 text-gray-300" />
                      <span className="text-xs font-medium">Image unavailable</span>
                    </div>
                  ) : (
                    <div className="w-full h-full overflow-hidden">
                      <img
                        src={image}
                        alt={`${property.title} - photo ${index + 1}`}
                        loading="lazy"
                        onError={() => handleImageError(index)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Desktop Carousel Navigation Chevrons */}
            {images.length > 1 && (
              <>
                <CarouselPrevious
                  className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                  onClick={(e) => e.stopPropagation()}
                />
                <CarouselNext
                  className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                  onClick={(e) => e.stopPropagation()}
                />
              </>
            )}

            {/* Carousel Dot Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
                {images.slice(0, 5).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        ) : (
          <div className="w-full h-full min-h-[200px] bg-gray-50 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <ImageOff className="w-8 h-8 mb-1.5 text-gray-300" />
            <span className="text-xs font-medium">No photo uploaded</span>
          </div>
        )}

        {/* Favorite heart button */}
        <Button
          variant="ghost"
          size="icon"
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 bg-white/85 hover:bg-white z-10 h-8 w-8 rounded-full shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
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

        {/* Dynamic Status / Quality Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-wrap gap-1 z-10 max-w-[80%] items-center">
          {!property.isAvailable && (
            <Badge variant="destructive" className="bg-rose-600 text-white shadow-xs font-semibold text-[10px] sm:text-xs px-2 py-0.5">
              Sold Out
            </Badge>
          )}
          {badgeLabel && (
            <Badge className="bg-emerald-600 text-white shadow-xs font-semibold text-[10px] sm:text-xs px-2 py-0.5">
              {badgeLabel}
            </Badge>
          )}
          {property.isNew && !badgeLabel && (
            <Badge className="bg-emerald-500 text-white shadow-xs font-semibold text-[10px] sm:text-xs px-2 py-0.5">
              New
            </Badge>
          )}
          {property.isCertified && (
            <Badge className="bg-blue-600 text-white shadow-xs font-semibold text-[10px] sm:text-xs px-2 py-0.5">
              Certified
            </Badge>
          )}
          {property.classification && property.classification !== 'UNCLASSIFIED' && (
            <Badge variant="outline" className="bg-[#FFD26E]/90 text-[#1F1F1F] font-bold border-[#D4A237]/40 text-[10px] sm:text-xs px-2 py-0.5 backdrop-blur-xs">
              {property.classification}
            </Badge>
          )}
          {property.isEco && (
            <Badge className="bg-emerald-700/90 text-white backdrop-blur-xs text-[10px] sm:text-xs px-2 py-0.5">
              🌿 Eco
            </Badge>
          )}
        </div>
      </div>

      {/* Card Content Information */}
      <CardContent className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Title & Rating */}
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-bold text-gray-900 line-clamp-1 text-sm sm:text-base group-hover:text-[#1A8491] transition-colors font-heading leading-tight">
              {property.title}
            </h3>
            <div className="flex items-center text-xs shrink-0 text-gray-700 font-medium">
              {property.rating > 0 ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{property.rating}</span>
                  <span className="text-gray-400 text-[11px] ml-0.5">({property.reviews})</span>
                </>
              ) : (
                <span className="text-[10px] text-gray-400">New</span>
              )}
            </div>
          </div>

          {/* Location */}
          <p className="text-xs sm:text-sm text-gray-600 flex items-center mb-2 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[#1A8491] shrink-0" />
            <span className="truncate">{property.location}</span>
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2 text-gray-600 text-[11px] sm:text-xs">
            {property.amenities.includes('Wifi') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600" title="WiFi Available">
                <Wifi className="w-3 h-3 text-[#1A8491]" /> WiFi
              </span>
            )}
            {property.amenities.includes('Car') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600" title="Parking / Car Service">
                <Car className="w-3 h-3 text-[#1A8491]" /> Parking
              </span>
            )}
            {property.amenities.includes('Meals') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600" title="Meals Available">
                <Utensils className="w-3 h-3 text-[#1A8491]" /> Meals
              </span>
            )}
            {property.amenities.length === 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-500" title="Homestay Stay">
                <Users className="w-3 h-3 text-[#1A8491]" /> Homestay
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Host Footer */}
        <div className="flex justify-between items-end pt-2 border-t border-gray-100 mt-auto">
          <div>
            {!property.isAvailable ? (
              <div>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Sold out
                </span>
                {property.price > 0 && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Usually ₹{property.price.toLocaleString()} / night
                  </p>
                )}
              </div>
            ) : property.price > 0 ? (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-extrabold text-gray-900">
                    ₹{property.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-[11px] sm:text-xs">
                    {property.numberOfNights && property.numberOfNights > 1 ? '/ night avg' : '/ night'}
                  </span>
                </div>
                {property.totalPrice && property.numberOfNights && property.numberOfNights > 1 ? (
                  <div className="text-[10px] sm:text-[11px] text-[#1A8491] font-semibold">
                    ₹{property.totalPrice.toLocaleString()} total ({property.numberOfNights}n)
                  </div>
                ) : (
                  property.pricingType === 'STARTING_FROM' && (
                    <div className="text-[10px] text-gray-400">Starting from</div>
                  )
                )}
              </div>
            ) : (
              <span className="text-xs sm:text-sm font-semibold text-gray-600">Price on request</span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium truncate max-w-[110px] block" title={`Hosted by ${property.host}`}>
              By {property.host}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomestayCard;
