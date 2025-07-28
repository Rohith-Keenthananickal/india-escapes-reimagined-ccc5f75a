import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingCart,
  Hotel,
  MapPin,
  Star,
  Users,
  Calendar,
  Clock,
  Trash2,
  Plus,
  Minus,
  X,
  CreditCard,
  ArrowRight,
  Map,
  Eye,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { format } from "date-fns";

const Cart = () => {
  const navigate = useNavigate();
  const {
    hotels,
    experiences,
    nearbySuggestions,
    removeHotel,
    removeExperience,
    removeNearbySuggestion,
    updateHotel,
    updateExperience,
    getTotalAmount,
    getTotalItems,
    clearCart,
  } = useCart();

  const selectedNearbySuggestions = nearbySuggestions.filter((s) => s.selected);

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative"
      onClick={handleCartClick}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Cart
      {getTotalItems() > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#9C27B0] text-white border-2 border-white"
        >
          {getTotalItems()}
        </Badge>
      )}
    </Button>
  );
};

export default Cart;
