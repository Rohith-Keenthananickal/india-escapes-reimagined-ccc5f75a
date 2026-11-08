/**
 * Legacy booking flow (fake card form) — redirects to server cart checkout.
 */
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const BookingFlow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Prefer property detail + reserve, or checkout if already in cart
    if (id) {
      const qs = searchParams.toString();
      navigate(`/property/${id}${qs ? `?${qs}` : ''}`, { replace: true });
      return;
    }
    navigate('/checkout', { replace: true });
  }, [id, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#2BB0BB]" />
    </div>
  );
};

export default BookingFlow;
