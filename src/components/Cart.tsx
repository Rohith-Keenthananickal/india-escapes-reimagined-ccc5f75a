import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCartItemCount } from '@/modules/cart/hooks/useCart';
import { useAuth } from '@/modules/auth';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const itemCount = useCartItemCount();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <Button variant="outline" size="sm" className="relative" onClick={handleCartClick}>
      <ShoppingCart className="w-4 h-4 mr-2" />
      Cart
      {isAuthenticated && itemCount > 0 && (
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-[#2BB0BB] text-white border-2 border-white shadow-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default Cart;
