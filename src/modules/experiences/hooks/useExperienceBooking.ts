import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';
import { useCartQuery } from '@/modules/cart/hooks/useCart';
import { useCartMutations } from '@/modules/cart/hooks/useCartMutations';
import type { NormalizedExperience } from '../types/experiences.types';

/** Add-to-cart flow for an experience (same cart API as before the redesign). */
export function useExperienceBooking(experience: NormalizedExperience | null) {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { data: cart } = useCartQuery(isAuthenticated);
  const { addItem } = useCartMutations();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [guests, setGuests] = useState(1);

  const isInCart =
    !!experience &&
    (cart?.items?.some((item) => item.item_type === 'EXPERIENCE' && item.experience_id === experience.id) ?? false);

  const canBook = !!experience && !experience.isMock;

  const addToCart = async () => {
    if (!experience || !canBook) return;
    if (isInCart) {
      navigate('/cart');
      return;
    }
    if (!requireAuth('/experiences')) return;
    await addItem.mutateAsync({
      item_type: 'EXPERIENCE',
      experience_id: experience.id,
      experience_date: date,
      guest_count: Math.max(1, guests),
    });
  };

  return {
    date,
    setDate,
    guests,
    setGuests,
    isInCart,
    canBook,
    isPending: addItem.isPending,
    addToCart,
    minDate: format(new Date(), 'yyyy-MM-dd'),
  };
}
