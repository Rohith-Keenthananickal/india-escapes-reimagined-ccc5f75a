import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Navigation,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  Globe,
  Heart,
  Share,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    type: string;
    position: { lat: number; lng: number };
    rating?: number;
    distance?: number;
    description?: string;
    icon: any;
    color: string;
    placeId?: string;
    photos?: string[];
    phone?: string;
    website?: string;
    address?: string;
    openingHours?: string;
    priceLevel?: number;
    category?: string;
    imageUrl?: string;
  };
  variant?: "compact" | "detailed";
  onClick?: () => void;
  showActions?: boolean;
  showAddToCart?: boolean;
}

const LocationCard = ({
  location,
  variant = "detailed",
  onClick,
  showActions = true,
  showAddToCart = false,
}: LocationCardProps) => {
  const IconComponent = location.icon;
  const { addNearbySuggestion } = useCart();

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
    window.open(url, "_blank");
  };

  const handleViewOnGoogleMaps = () => {
    if (location.placeId) {
      const url = `https://www.google.com/maps/place/?q=place_id:${location.placeId}`;
      window.open(url, "_blank");
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location.name
      )}`;
      window.open(url, "_blank");
    }
  };

  const handlePhoneClick = () => {
    if (location.phone) {
      window.open(`tel:${location.phone}`, "_self");
    }
  };

  const handleWebsiteClick = () => {
    if (location.website) {
      window.open(location.website, "_blank");
    }
  };

  const handleAddToCart = () => {
    const suggestionData = {
      id: location.id,
      name: location.name,
      type: location.type,
      category: location.category || "services",
      rating: location.rating,
      distance: location.distance,
      imageUrl: location.imageUrl,
      selected: true,
    };

    addNearbySuggestion(suggestionData);
    toast({
      title: "Added to cart!",
      description: `${location.name} has been added to your cart.`,
    });
  };

  if (variant === "compact") {
    return (
      <Card
        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/95 backdrop-blur-sm"
        onClick={onClick}
      >
        <div className="flex items-start space-x-3 p-4">
          <div className={`p-2 rounded-lg bg-${location.color}-100`}>
            <IconComponent className={`w-5 h-5 text-${location.color}-600`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h5 className="font-semibold text-sm text-gray-900 truncate">
                {location.name}
              </h5>
              <Badge
                variant="secondary"
                className={`text-xs bg-${location.color}-100 text-${location.color}-800 border-${location.color}-200`}
              >
                {location.type}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {location.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {location.rating && (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-700 ml-1">
                      {location.rating}
                    </span>
                  </div>
                )}
                {location.distance && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location.distance}km
                  </div>
                )}
              </div>
              {location.openingHours && (
                <div className="flex items-center text-xs text-green-600">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Open</span>
                </div>
              )}
            </div>
            {showAddToCart && (
              <div className="mt-3">
                <Button
                  size="sm"
                  className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-xl bg-${location.color}-100 shadow-sm`}
            >
              <IconComponent className={`w-6 h-6 text-${location.color}-600`} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {location.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="secondary"
                  className={`bg-${location.color}-100 text-${location.color}-800 border-${location.color}-200 font-medium`}
                >
                  {location.type}
                </Badge>
                {location.priceLevel && (
                  <div className="flex items-center">
                    {[...Array(location.priceLevel)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-sm">
                        ₹
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {location.rating && (
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900 ml-1">
                {location.rating}
              </span>
            </div>
            {location.distance && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="font-medium">{location.distance}km away</span>
              </div>
            )}
          </div>
        )}

        {location.description && (
          <p className="text-gray-700 leading-relaxed mb-4">
            {location.description}
          </p>
        )}

        <div className="space-y-3 mb-6">
          {location.address && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Address</p>
                <p className="text-sm text-blue-700">{location.address}</p>
              </div>
            </div>
          )}

          {location.openingHours && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <Clock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Opening Hours
                </p>
                <p className="text-sm text-green-700">
                  {location.openingHours}
                </p>
              </div>
            </div>
          )}

          {location.phone && (
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Phone className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-900">Phone</p>
                <p className="text-sm text-purple-700">{location.phone}</p>
              </div>
            </div>
          )}

          {location.website && (
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <Globe className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900">Website</p>
                <p className="text-sm text-orange-700 truncate">
                  {location.website}
                </p>
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center justify-center space-x-2 border-2 hover:border-blue-500 hover:bg-blue-50"
              onClick={handleDirections}
            >
              <Navigation className="w-4 h-4" />
              <span className="font-medium">Directions</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center justify-center space-x-2 border-2 hover:border-green-500 hover:bg-green-50"
              onClick={handleViewOnGoogleMaps}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="font-medium">View Details</span>
            </Button>
            {location.phone && (
              <Button
                size="sm"
                variant="outline"
                className="flex items-center justify-center space-x-2 border-2 hover:border-purple-500 hover:bg-purple-50"
                onClick={handlePhoneClick}
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">Call</span>
              </Button>
            )}
            {location.website && (
              <Button
                size="sm"
                variant="outline"
                className="flex items-center justify-center space-x-2 border-2 hover:border-orange-500 hover:bg-orange-50"
                onClick={handleWebsiteClick}
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">Website</span>
              </Button>
            )}
            {showAddToCart && (
              <Button
                size="sm"
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="font-medium">Add to Cart</span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;
