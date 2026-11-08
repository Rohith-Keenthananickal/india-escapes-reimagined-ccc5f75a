import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <ShoppingCart className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Your trip cart is empty</h2>
      <p className="text-gray-600 mb-6 max-w-sm">
        Add a stay or experience to start building your Kerala journey.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          className="bg-[#2BB0BB] hover:bg-[#1A8491] text-[#1F1F1F] hover:text-white font-semibold"
          onClick={() => navigate('/properties')}
        >
          Browse stays
        </Button>
        <Button variant="outline" onClick={() => navigate('/experiences')}>
          Browse experiences
        </Button>
      </div>
    </div>
  );
}

export default EmptyCart;
