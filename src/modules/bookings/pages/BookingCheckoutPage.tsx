import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import {
  Loader2,
  ArrowLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Hotel,
  Clock,
  Calendar,
  Users,
  MapPin,
  Trash2,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  User,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartQuery } from '@/modules/cart/hooks/useCart';
import { useCartMutations } from '@/modules/cart/hooks/useCartMutations';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';
import { propertyDetailsService } from '@/modules/property-details/services/propertyDetailsService';
import { openCashfreeCheckout } from '@/modules/payments/lib/cashfree';
import { toast } from '@/hooks/use-toast';
import type { CartItemPriced } from '@/modules/cart/types/cart.types';

function formatDate(value?: string | null): string {
  if (!value) return '—';
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

export default function BookingCheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth, user } = useRequireAuth();
  const { data: cart, isLoading } = useCartQuery(isAuthenticated);
  const { checkout, removeItem } = useCartMutations();

  const [guestName, setGuestName] = useState(user?.full_name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone_number || '');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) requireAuth('/checkout');
  }, [isAuthenticated, requireAuth]);

  useEffect(() => {
    if (user?.full_name) setGuestName(user.full_name);
    if (user?.email) setGuestEmail(user.email);
    if (user?.phone_number) setGuestPhone(user.phone_number);
  }, [user]);

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

  const stayTotal = stayItems.reduce((s, i) => s + Number(i.total_guest_payment || 0), 0);
  const experienceTotal = experienceItems.reduce(
    (s, i) => s + Number(i.total_guest_payment || 0),
    0
  );
  const hasUnavailable = cart?.items.some((i) => !i.is_available) ?? false;

  const handlePay = async () => {
    if (!cart?.items?.length) {
      toast({ title: 'Cart is empty', variant: 'destructive' });
      return;
    }
    if (cart.items.some((i) => !i.is_available)) {
      toast({ title: 'Some items unavailable', variant: 'destructive' });
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      toast({
        title: 'Guest details required',
        description: 'Please enter your name and email.',
        variant: 'destructive',
      });
      return;
    }

    setIsPaying(true);
    try {
      const result = await checkout.mutateAsync({
        provider: 'CASHFREE',
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim(),
        guest_phone: guestPhone.trim() || undefined,
      });

      if (!result.payment_session_id) {
        toast({
          title: 'Payment session missing',
          description: 'Could not start Cashfree checkout. Try again.',
          variant: 'destructive',
        });
        setIsPaying(false);
        return;
      }

      await openCashfreeCheckout(result.payment_session_id);
    } catch (err) {
      console.error(err);
      setIsPaying(false);
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-28 space-y-3">
          <Loader2 className="w-9 h-9 animate-spin text-[#2BB0BB]" />
          <p className="text-sm font-medium text-gray-500">Preparing secure checkout…</p>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <Navbar />
        <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#1A8491] flex items-center justify-center mx-auto mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            There are no stays or experiences currently queued for checkout.
          </p>
          <Button
            onClick={() => navigate('/cart')}
            className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-medium rounded-xl px-6 h-11"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Cart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200/80 mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="h-10 w-10 rounded-xl hover:bg-gray-100 text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-0.5">
                <span className="text-[#1A8491] font-semibold">Step 2 of 2</span>
                <span>•</span>
                <span>Final Review & Payment</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 tracking-tight">
                Confirm & Pay
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Guest Details, Review Items, House Rules */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* 1. Guest Verification Section */}
            <section className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1A8491] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-900">
                      Primary Guest Contact
                    </h2>
                    <p className="text-xs text-gray-500">
                      Booking confirmations and check-in instructions are delivered here.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-teal-700 bg-teal-50/50 border-teal-200">
                  Required
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="guest-name" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    Full Legal Name *
                  </Label>
                  <Input
                    id="guest-name"
                    placeholder="e.g. John Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 h-11 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guest-email" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    Email Address *
                  </Label>
                  <Input
                    id="guest-email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 h-11 text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="guest-phone" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    Mobile Phone Number (for WhatsApp & SMS confirmation)
                  </Label>
                  <Input
                    id="guest-phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 h-11 text-sm"
                  />
                </div>
              </div>
            </section>

            {/* 2. Review Reserved Items */}
            <section className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1A8491] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-900">
                      Your Reserved Escapes ({cart.items.length})
                    </h2>
                    <p className="text-xs text-gray-500">
                      Double-check your dates and travel party before confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => {
                  const prop = item.property_id ? propertyById.get(item.property_id) : undefined;
                  const isStay = item.item_type !== 'EXPERIENCE';

                  return (
                    <div
                      key={item.id}
                      className="group p-4 rounded-2xl border border-gray-200/80 hover:border-[#2BB0BB]/40 hover:shadow-sm transition-all duration-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        {/* Thumbnail image or icon */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {prop?.images?.[0] ? (
                            <img
                              src={prop.images[0]}
                              alt={prop.title || 'Property'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                              {isStay ? <Hotel className="w-6 h-6" /> : <Clock className="w-6 h-6 text-[#D4A237]" />}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-semibold text-sm sm:text-base text-gray-900 truncate">
                              {itemTitle(item, prop?.title)}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 capitalize bg-gray-100 text-gray-700"
                            >
                              {item.item_type.replace(/_/g, ' ')}
                            </Badge>
                            {!item.is_available && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Unavailable
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            {isStay ? (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#2BB0BB] shrink-0" />
                                {formatDate(item.check_in_date)} – {formatDate(item.check_out_date)}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#D4A237] shrink-0" />
                                {formatDate(item.experience_date)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              {item.guest_count} {item.guest_count === 1 ? 'Guest' : 'Guests'}
                            </span>
                            {prop?.location && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                {prop.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-gray-400 block leading-tight">Price</span>
                          <span className="text-base font-heading font-bold text-gray-900">
                            ₹{Number(item.total_guest_payment || 0).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={removeItem.isPending}
                          onClick={() => removeItem.mutate(item.id)}
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Cancellation Policy & Ground Rules */}
            <section className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1A8491] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-base font-heading font-bold text-gray-900">
                    Important Travel Policies
                  </h2>
                  <p className="text-xs text-gray-500">
                    Standard Triphaven policies for safe & hassle-free hosting.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-150 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free Cancellation Policy</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Cancel up to 48 hours before check-in for a full refund on eligible stays.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-150 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A8491]" />
                    <span>Host Ground Rules</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Treat the home with care and respect quiet hours from 10:00 PM to 7:00 AM.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (4-5 cols): Sticky Price Summary & Cashfree Payment Button */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-6">
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-sm space-y-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900">
                  Price Breakdown
                </h3>
                <p className="text-xs text-gray-500">
                  Guaranteed best rates with all taxes included.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Stays ({stayItems.length})</span>
                  <span className="font-medium text-gray-900">
                    ₹{stayTotal.toLocaleString()}
                  </span>
                </div>

                {experienceItems.length > 0 && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Experiences ({experienceItems.length})</span>
                    <span className="font-medium text-gray-900">
                      ₹{experienceTotal.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-600">
                  <span>Taxes & Service Fees</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Included
                  </span>
                </div>

                <Separator className="my-2 bg-gray-100" />

                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="font-heading font-bold text-base text-gray-900">
                      Total Payable
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      INR (Indian Rupees)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-2xl text-[#1A8491]">
                      ₹{Number(cart.total_guest_payment || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {hasUnavailable && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Some items in your cart are currently unavailable. Please remove them before paying.
                  </span>
                </div>
              )}

              {/* Payment CTA Button */}
              <Button
                className="w-full py-6 text-base font-heading font-semibold bg-[#2BB0BB] hover:bg-[#1A8491] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                disabled={isPaying || checkout.isPending || hasUnavailable}
                onClick={handlePay}
              >
                {isPaying || checkout.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting to Cashfree…</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay with Cashfree</span>
                  </>
                )}
              </Button>

              {/* Supported Payment Logos / Badges */}
              <div className="pt-3 border-t border-gray-150 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Supported payment modes:</span>
                  <span className="font-semibold text-gray-700">Instant UPI & Cards</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                    UPI (GPay / PhonePe / Paytm)
                  </span>
                  <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                    Credit / Debit Cards
                  </span>
                  <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                    NetBanking
                  </span>
                </div>
              </div>

              {/* Guarantee badges */}
              <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100/70 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-1.5 font-semibold text-[#1A8491]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Triphaven Secure Booking Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your payment is processed securely via Cashfree Payments Ltd with RBI compliant guidelines.
                </p>
              </div>
            </div>

            {/* Assistance link */}
            <div className="text-center text-xs text-gray-500">
              <span>Need help completing booking? </span>
              <a href="mailto:support@triphavenco.com" className="text-[#1A8491] hover:underline font-medium">
                Contact Concierge
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
