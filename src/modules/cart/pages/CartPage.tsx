import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Hotel,
  MapPin,
  Users,
  Calendar,
  Clock,
  Trash2,
  CreditCard,
  ArrowRight,
  Map as MapIcon,
  ArrowLeft,
  Navigation,
  Grid,
  List,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import PropertyMap from '@/components/PropertyMap';
import { toast } from '@/hooks/use-toast';
import { useCart as useLocalCartExtras } from '@/hooks/use-cart';
import { propertyDetailsService } from '@/modules/property-details/services/propertyDetailsService';
import { useCartQuery } from '../hooks/useCart';
import { useCartMutations } from '../hooks/useCartMutations';
import { useRequireAuth } from '../hooks/useRequireAuth';
import type { CartItemPriced } from '../types/cart.types';

const DEFAULT_COORDS = { lat: 9.6788, lng: 76.9741 };

type MapCartItem = {
  id: string;
  /** Server cart line id — present for stays/experiences (removable). */
  cartItemId?: number;
  /** Nearby suggestion id — local-only removable. */
  nearbyId?: string;
  title?: string;
  name?: string;
  location?: string;
  type: string;
  category: string;
  position: { lat: number; lng: number };
  rating?: number;
  distance?: number;
  imageUrl?: string;
  image?: string;
};

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return format(parseISO(value), 'MMM d, yyyy');
  } catch {
    return value;
  }
}

function itemTitle(item: CartItemPriced, enrichedTitle?: string) {
  if (enrichedTitle) return enrichedTitle;
  if (item.item_type === 'EXPERIENCE') return `Experience #${item.experience_id}`;
  if (item.item_type === 'STAY_ROOM') return `Room stay · Property #${item.property_id}`;
  return `Whole property · #${item.property_id}`;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { data: cart, isLoading, isError, refetch } = useCartQuery(isAuthenticated);
  const { removeItem, clearCart } = useCartMutations();

  const { nearbySuggestions, removeNearbySuggestion } = useLocalCartExtras();
  const selectedNearby = nearbySuggestions.filter((s) => s.selected);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) requireAuth('/cart');
  }, [isAuthenticated, requireAuth]);

  const stayItems = useMemo(
    () => cart?.items.filter((i) => i.item_type !== 'EXPERIENCE') ?? [],
    [cart]
  );
  const experienceItems = useMemo(
    () => cart?.items.filter((i) => i.item_type === 'EXPERIENCE') ?? [],
    [cart]
  );

  const propertyIds = useMemo(
    () =>
      [...new Set(stayItems.map((i) => i.property_id).filter((id): id is number => !!id))],
    [stayItems]
  );

  const propertyQueries = useQueries({
    queries: propertyIds.map((id) => ({
      queryKey: ['property-details', id],
      queryFn: () => propertyDetailsService.getPropertyById(id),
      staleTime: 5 * 60_000,
      enabled: isAuthenticated && propertyIds.length > 0,
    })),
  });

  const propertyById = useMemo(() => {
    const map = new Map<
      number,
      Awaited<ReturnType<typeof propertyDetailsService.getPropertyById>>
    >();
    propertyIds.forEach((id, idx) => {
      const data = propertyQueries[idx]?.data;
      if (data) map.set(id, data);
    });
    return map;
  }, [propertyIds, propertyQueries]);

  const mapBase = useMemo(() => {
    for (const id of propertyIds) {
      const p = propertyById.get(id);
      const lat = p?.locationDetails?.latitude;
      const lng = p?.locationDetails?.longitude;
      if (lat != null && lng != null) return { lat, lng };
    }
    return DEFAULT_COORDS;
  }, [propertyIds, propertyById]);

  const cartItemsForMap: MapCartItem[] = useMemo(() => {
    const items: MapCartItem[] = [];
    let index = 0;

    stayItems.forEach((item) => {
      const prop = item.property_id ? propertyById.get(item.property_id) : undefined;
      const lat = prop?.locationDetails?.latitude ?? mapBase.lat + index * 0.002;
      const lng = prop?.locationDetails?.longitude ?? mapBase.lng + index * 0.001;
      items.push({
        id: `stay_${item.id}`,
        cartItemId: item.id,
        title: itemTitle(item, prop?.title),
        location: prop?.location || prop?.locationDetails?.address || 'Kerala, India',
        type: 'hotel',
        category: 'accommodations',
        position: { lat, lng },
        rating: prop?.rating,
        imageUrl: prop?.images?.[0],
        image: prop?.images?.[0],
      });
      index += 1;
    });

    experienceItems.forEach((item, expIdx) => {
      const angle = expIdx * 45 * (Math.PI / 180);
      const radius = 0.005 + expIdx * 0.002;
      items.push({
        id: `exp_${item.id}`,
        cartItemId: item.id,
        title: itemTitle(item),
        location: 'Kerala, India',
        type: 'experience',
        category: 'experiences',
        position: {
          lat: mapBase.lat + Math.cos(angle) * radius,
          lng: mapBase.lng + Math.sin(angle) * radius,
        },
        rating: 4.5,
      });
    });

    selectedNearby.forEach((suggestion, nIdx) => {
      const angle = nIdx * 30 * (Math.PI / 180);
      const radius = 0.008 + nIdx * 0.003;
      items.push({
        id: suggestion.id,
        nearbyId: suggestion.id,
        name: suggestion.name,
        type: suggestion.type,
        category: suggestion.category,
        position: {
          lat: mapBase.lat + Math.cos(angle) * radius,
          lng: mapBase.lng + Math.sin(angle) * radius,
        },
        rating: suggestion.rating || 4.0,
        distance: suggestion.distance,
        imageUrl: suggestion.imageUrl,
      });
    });

    return items;
  }, [stayItems, experienceItems, selectedNearby, propertyById, mapBase]);

  const totalItems = (cart?.items.length ?? 0) + selectedNearby.length;
  const totalAmount = Number(cart?.total_guest_payment || 0);
  const stayTotal = stayItems.reduce((s, i) => s + Number(i.total_guest_payment || 0), 0);
  const experienceTotal = experienceItems.reduce(
    (s, i) => s + Number(i.total_guest_payment || 0),
    0
  );
  const hasUnavailable = cart?.items.some((i) => !i.is_available) ?? false;

  const handleRemoveMapItem = (item: MapCartItem) => {
    if (item.cartItemId != null) {
      removeItem.mutate(item.cartItemId);
      return;
    }
    if (item.nearbyId) removeNearbySuggestion(item.nearbyId);
  };

  const handleClearCart = async () => {
    await clearCart.mutateAsync();
    setShowClearConfirm(false);
    toast({
      title: 'Cart cleared!',
      description: 'All trip items have been removed from your cart.',
    });
  };

  const handleProceedToCheckout = () => {
    if (hasUnavailable) {
      toast({
        title: 'Some items unavailable',
        description: 'Remove or update unavailable items before checkout.',
        variant: 'destructive',
      });
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-[#2BB0BB]/20 border-t-[#2BB0BB] animate-spin" />
            <Compass className="w-6 h-6 text-[#2BB0BB] absolute inset-0 m-auto" />
          </div>
          <p className="text-sm font-medium text-gray-500">Loading your trip itinerary...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
            Unable to load your itinerary
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            We encountered an issue fetching your cart. Please verify your connection and try again.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-medium px-6 rounded-xl"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-teal-50 text-[#2BB0BB] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100">
            <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight mb-3">
            Your trip itinerary is empty
          </h1>
          <p className="text-gray-600 text-base max-w-md mx-auto mb-8 leading-relaxed">
            Discover bespoke Kerala villas, authentic heritage homestays, and curated local backwater experiences to craft your bespoke holiday.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => navigate('/')}
              className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              size="lg"
            >
              <Compass className="w-4 h-4 mr-2" />
              Explore Escapes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200/80 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <button
                onClick={() => navigate(-1)}
                className="hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <span>/</span>
              <span className="text-[#1A8491] font-semibold">Itinerary & Checkout</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">
                Your Trip Itinerary
              </h1>
              <Badge className="bg-teal-50 text-[#1A8491] hover:bg-teal-100 border-teal-200 font-semibold px-2.5 py-0.5 text-xs rounded-full">
                {totalItems} {totalItems === 1 ? 'Booking' : 'Bookings'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Review your reserved stays and curated experiences before proceeding to secure payment.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100/80 p-0.5 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Clear All Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs font-medium h-9 px-3 gap-1.5 transition-colors"
              disabled={!cart?.items.length}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Trip
            </Button>
          </div>
        </div>

        {/* Main Grid: Left Items (8 cols) & Right Sticky Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary timeline and list of bookings */}
          <div className="lg:col-span-8 space-y-8">
            {/* Trip Timeline & Route Flow Card */}
            {cartItemsForMap.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#1A8491] flex items-center justify-center">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-heading font-semibold text-gray-900">
                        Trip Route & Stops
                      </h2>
                      <p className="text-xs text-gray-500">
                        {cartItemsForMap.length} planned destination{cartItemsForMap.length === 1 ? '' : 's'} across Kerala
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                      <span className="w-2 h-2 rounded-full bg-[#2BB0BB]" />
                      {stayItems.length} Stays
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                      <span className="w-2 h-2 rounded-full bg-[#FFD26E]" />
                      {experienceItems.length} Experiences
                    </span>
                  </div>
                </div>

                {/* Timeline Route Nodes */}
                <div className="relative pl-6 sm:pl-8 space-y-4">
                  {/* Vertical connecting line */}
                  <div className="absolute left-3.5 sm:left-4.5 top-3 bottom-5 w-0.5 bg-gradient-to-b from-[#2BB0BB] via-teal-200 to-gray-200" />

                  {cartItemsForMap.map((item, index) => {
                    const isLast = index === cartItemsForMap.length - 1;
                    const nextItem = !isLast ? cartItemsForMap[index + 1] : null;
                    const distKm = nextItem
                      ? haversineKm(
                          item.position.lat,
                          item.position.lng,
                          nextItem.position.lat,
                          nextItem.position.lng
                        )
                      : null;

                    return (
                      <div key={item.id} className="relative group">
                        {/* Milestone Marker Dot */}
                        <div className="absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full bg-white border-2 border-[#1A8491] text-[#1A8491] shadow-sm flex items-center justify-center text-[10px] font-bold z-10">
                          {index + 1}
                        </div>

                        {/* Stop Item Card */}
                        <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/70 hover:bg-white hover:border-[#2BB0BB]/40 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                              {item.imageUrl || item.image ? (
                                <img
                                  src={item.imageUrl || item.image}
                                  alt={item.title || item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <MapPin className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-heading font-medium text-sm text-gray-900 truncate">
                                  {item.title || item.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 capitalize bg-white text-gray-600 border border-gray-200 shrink-0"
                                >
                                  {item.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                {item.location || 'Kerala, India'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {distKm !== null && (
                              <div className="hidden sm:inline-flex items-center text-[11px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                <span>~{distKm.toFixed(1)} km to next</span>
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={removeItem.isPending}
                              onClick={() => handleRemoveMapItem(item)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 h-8 w-8 rounded-lg transition-colors"
                              title={`Remove ${item.title || item.name}`}
                              aria-label={`Remove ${item.title || item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Stays Section */}
            {stayItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-[#1A8491]" />
                    <h2 className="text-lg font-heading font-bold text-gray-900">
                      Accommodations ({stayItems.length})
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Verified properties with instant booking
                  </span>
                </div>

                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                      : 'space-y-4'
                  }
                >
                  {stayItems.map((item) => {
                    const prop = item.property_id
                      ? propertyById.get(item.property_id)
                      : undefined;

                    return (
                      <div
                        key={item.id}
                        className="group bg-white rounded-2xl border border-gray-200 hover:border-[#2BB0BB]/50 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Thumbnail & Badges */}
                          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                            {prop?.images?.[0] ? (
                              <img
                                src={prop.images[0]}
                                alt={prop.title || 'Stay'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                <Hotel className="w-8 h-8 mb-1 stroke-1" />
                                <span className="text-xs">No image available</span>
                              </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                                {item.item_type === 'STAY_ROOM' ? 'Private Room' : 'Entire Stay'}
                              </span>
                              {!item.is_available && (
                                <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                                  Unavailable
                                </Badge>
                              )}
                            </div>

                            {prop?.id && (
                              <button
                                type="button"
                                onClick={() => navigate(`/property/${prop.id}`)}
                                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-[#1A8491] flex items-center justify-center shadow-sm hover:scale-105 transition-all"
                                title="View property details"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Content Details */}
                          <div className="p-4 space-y-2.5">
                            <div>
                              <h3
                                onClick={() => prop?.id && navigate(`/property/${prop.id}`)}
                                className="font-heading font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-[#1A8491] cursor-pointer transition-colors"
                              >
                                {itemTitle(item, prop?.title)}
                              </h3>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                <span className="truncate">
                                  {prop?.location || prop?.locationDetails?.address || 'Kerala, India'}
                                </span>
                              </p>
                            </div>

                            {/* Booking Specifics */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#2BB0BB] shrink-0" />
                                <span className="truncate">
                                  {formatDate(item.check_in_date)} – {formatDate(item.check_out_date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 justify-end">
                                <Users className="w-3.5 h-3.5 text-[#2BB0BB] shrink-0" />
                                <span>
                                  {item.guest_count} {item.guest_count === 1 ? 'Guest' : 'Guests'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer Price & Remove */}
                        <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-gray-500 block leading-tight">Total stay price</span>
                            <span className="text-base font-heading font-bold text-gray-900">
                              ₹{Number(item.total_guest_payment || 0).toLocaleString()}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={removeItem.isPending}
                            onClick={() => removeItem.mutate(item.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 text-xs h-8 px-2.5 rounded-lg transition-colors gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Experiences Section */}
            {experienceItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D4A237]" />
                    <h2 className="text-lg font-heading font-bold text-gray-900">
                      Curated Experiences ({experienceItems.length})
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Host-led cultural & culinary adventures
                  </span>
                </div>

                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                      : 'space-y-4'
                  }
                >
                  {experienceItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#FFD26E] hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between"
                    >
                      <div className="flex gap-3.5">
                        <div className="w-16 h-16 rounded-xl bg-amber-50 text-[#D4A237] border border-amber-200/60 flex items-center justify-center shrink-0">
                          <Sparkles className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Activity
                            </span>
                            {!item.is_available && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                Unavailable
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-heading font-semibold text-gray-900 text-sm line-clamp-1">
                            {itemTitle(item)}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {formatDate(item.experience_date) || 'Date Flexible'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              {item.guest_count} {item.guest_count === 1 ? 'Guest' : 'Guests'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 block leading-tight">Total</span>
                          <span className="text-base font-heading font-bold text-gray-900">
                            ₹{Number(item.total_guest_payment || 0).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={removeItem.isPending}
                          onClick={() => removeItem.mutate(item.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 text-xs h-8 px-2.5 rounded-lg transition-colors gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Suggestions Add-ons */}
            {selectedNearby.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-heading font-bold text-gray-900">
                      Nearby Places & Stops ({selectedNearby.length})
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Added to your interactive itinerary
                  </span>
                </div>

                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                      : 'space-y-4'
                  }
                >
                  {selectedNearby.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 p-4 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {suggestion.imageUrl ? (
                          <img
                            src={suggestion.imageUrl}
                            alt={suggestion.name}
                            className="w-14 h-14 object-cover rounded-xl shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-heading font-semibold text-gray-900 text-sm truncate">
                            {suggestion.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                              {suggestion.type}
                            </span>
                            {suggestion.distance != null && (
                              <span className="text-xs text-gray-500">
                                {suggestion.distance} km away
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNearbySuggestion(suggestion.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-lg shrink-0"
                        title="Remove suggestion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Trip Map + Order Summary */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Interactive Trip Map Widget */}
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-[#1A8491]" />
                  <span className="font-heading font-semibold text-sm text-gray-900">
                    Interactive Trip Map
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                  className="h-8 px-2 text-xs text-gray-500 hover:text-gray-900 gap-1 rounded-lg"
                >
                  {showMap ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </Button>
              </div>

              {showMap && (
                <div className="h-64 sm:h-72 w-full relative">
                  <PropertyMap
                    latitude={mapBase.lat}
                    longitude={mapBase.lng}
                    propertyName={
                      (stayItems[0]?.property_id &&
                        propertyById.get(stayItems[0].property_id)?.title) ||
                      'Your Trip'
                    }
                    cartItems={cartItemsForMap}
                    showCartItems={true}
                  />
                </div>
              )}
            </div>

            {/* Order Price & Checkout Card */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-gray-900">
                  Fare & Price Breakdown
                </h3>
                <p className="text-xs text-gray-500">
                  Transparent pricing with no hidden fees at payment.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Accommodations ({stayItems.length})</span>
                  <span className="font-medium text-gray-900">
                    ₹{stayTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Experiences ({experienceItems.length})</span>
                  <span className="font-medium text-gray-900">
                    ₹{experienceTotal.toLocaleString()}
                  </span>
                </div>

                <Separator className="my-2 bg-gray-100" />

                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="font-heading font-bold text-base text-gray-900">
                      Total Payable
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      Includes all applicable taxes & resort fees
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-2xl text-[#1A8491]">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {hasUnavailable && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>
                    Some reserved dates are currently unavailable. Please remove or adjust them to proceed.
                  </span>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                onClick={handleProceedToCheckout}
                disabled={!cart?.items.length || hasUnavailable}
                className="w-full bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-heading font-semibold text-base py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                size="lg"
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Pay</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              {/* Trust Signals & Guarantee Badges */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bank-grade 256-bit encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free cancellation on most listings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Confirmation Dialog Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100 space-y-4 animate-scale-in">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-heading font-bold text-gray-900">
                  Clear entire itinerary?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  All stays and experiences will be removed from your trip. You will need to add them again.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 rounded-xl text-xs font-medium h-10 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearCart}
                  disabled={clearCart.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium h-10"
                >
                  {clearCart.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Yes, Clear All'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
