import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  Calendar,
  MessageCircle,
  Bell,
  Settings,
  CreditCard,
  MapPin,
  Edit,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Compass,
  ArrowRight,
  LogOut,
  Send,
  Sparkles,
  Lock,
  User as UserIcon,
  Phone,
  Mail,
  Camera,
  Check,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { useTripsQuery } from '@/modules/bookings/hooks/useTrips';
import { TripOrderCard } from '@/modules/bookings/components/TripOrderCard';
import { useWishlistQuery, useWishlistMutations } from '@/modules/wishlist';
import { toast } from '@/hooks/use-toast';

interface MessageThread {
  id: number;
  host: string;
  image: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  history: Array<{ sender: 'host' | 'user'; text: string; time: string }>;
}

type DashboardTab = 'bookings' | 'wishlist' | 'messages' | 'notifications' | 'settings';

const DASHBOARD_TABS: DashboardTab[] = [
  'bookings',
  'wishlist',
  'messages',
  'notifications',
  'settings',
];

export default function UserDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: DashboardTab =
    tabParam && DASHBOARD_TABS.includes(tabParam as DashboardTab)
      ? (tabParam as DashboardTab)
      : 'bookings';
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: tripOrders, isLoading: tripsLoading } = useTripsQuery();
  const {
    data: wishlistItems,
    isLoading: wishlistLoading,
    isError: wishlistError,
  } = useWishlistQuery();
  const { removeItem, isToggling } = useWishlistMutations();

  useEffect(() => {
    if (tabParam && DASHBOARD_TABS.includes(tabParam as DashboardTab)) {
      setActiveTab(tabParam as DashboardTab);
    }
  }, [tabParam]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (tab === 'bookings') {
      setSearchParams({}, { replace: true });
      return;
    }
    setSearchParams({ tab }, { replace: true });
  };

  // Messages state
  const [messages, setMessages] = useState<MessageThread[]>([
    {
      id: 1,
      host: 'Priya Sharma (Superhost)',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100&h=100&fit=crop&crop=face',
      property: 'Cozy Munnar Hill Cottage',
      lastMessage: 'Hi there! Looking forward to hosting you in Munnar. Let me know if you need anything before arrival.',
      time: '2 hours ago',
      unread: true,
      history: [
        { sender: 'host', text: 'Hi Tanvi, welcome to our hill cottage! Your booking is confirmed.', time: '10:00 AM' },
        { sender: 'user', text: 'Thank you Priya! Is there vehicle parking available on premises?', time: '10:15 AM' },
        { sender: 'host', text: 'Yes, we have private covered parking right beside the cottage.', time: '10:20 AM' },
        { sender: 'host', text: 'Hi there! Looking forward to hosting you in Munnar. Let me know if you need anything before arrival.', time: '11:30 AM' },
      ],
    },
    {
      id: 2,
      host: 'Mathew Thomas',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      property: 'Vembanad Lake Backwater Stay',
      lastMessage: 'The sunset canoe boat tour is scheduled for 5:30 PM tomorrow.',
      time: '1 day ago',
      unread: false,
      history: [
        { sender: 'host', text: 'Hello! Looking forward to taking you on the lake.', time: 'Yesterday' },
        { sender: 'host', text: 'The sunset canoe boat tour is scheduled for 5:30 PM tomorrow.', time: 'Yesterday' },
      ],
    },
  ]);

  const [selectedThreadId, setSelectedThreadId] = useState<number>(1);
  const [chatInput, setChatInput] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your stay at Cozy Munnar Hill Cottage has been locked in and verified.',
      time: '3 hours ago',
      read: false,
      type: 'booking',
    },
    {
      id: 2,
      title: 'Special Host Price Drop',
      message: 'Tea Garden Heritage Bungalow in your wishlist is now 15% off for next month.',
      time: '1 day ago',
      read: true,
      type: 'promo',
    },
    {
      id: 3,
      title: 'Review Reminder',
      message: 'Share your travel memories for your recent Kerala Backwaters trip.',
      time: '3 days ago',
      read: true,
      type: 'review',
    },
  ]);

  // Settings form state
  const [fullName, setFullName] = useState(user?.full_name || 'Tanvi Patel');
  const [email, setEmail] = useState(user?.email || 'tanvi.patel@example.com');
  const [phone, setPhone] = useState(user?.phone_number || '+91 98765 43210');
  const [location, setLocation] = useState('Mumbai, Maharashtra, India');
  const [bio, setBio] = useState('Travel enthusiast passionate about serene backwaters, heritage villas, and culinary journeys across Kerala.');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  // Derived user display
  const displayName = fullName || user?.full_name || 'Guest Traveler';
  const displayEmail = email || user?.email || 'guest@triphavenco.com';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const activeThread = messages.find((m) => m.id === selectedThreadId) || messages[0];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'user' as const, text: chatInput.trim(), time: 'Just now' };
    setMessages((prev) =>
      prev.map((thread) =>
        thread.id === selectedThreadId
          ? {
              ...thread,
              lastMessage: newMsg.text,
              time: 'Just now',
              history: [...thread.history, newMsg],
            }
          : thread
      )
    );
    setChatInput('');
  };

  const handleRemoveFromWishlist = (propertyId: number) => {
    removeItem.mutate(propertyId);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: 'Notifications updated',
      description: 'All notifications marked as read.',
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your account preferences and profile information have been saved.',
    });
  };

  const unreadMessagesCount = messages.filter((m) => m.unread).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Welcome Banner */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2BB0BB] via-teal-400 to-[#FFD26E]" />
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-white shadow-md">
                <AvatarImage src={user?.profile_image || 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=200&h=200&fit=crop&crop=face'} />
                <AvatarFallback className="bg-teal-100 text-[#1A8491] font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm" title="Verified Account">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 tracking-tight">
                  Welcome back, {displayName}
                </h1>
                <Badge className="bg-teal-50 text-[#1A8491] border-teal-200 font-medium text-xs">
                  Verified Guest
                </Badge>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span>{displayEmail}</span>
                <span>•</span>
                <span>Kerala Explorer</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/properties')}
              className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-medium rounded-xl h-11 px-5 shadow-sm transition-all"
            >
              <Compass className="w-4 h-4 mr-2" />
              <span>Explore Escapes</span>
            </Button>
          </div>
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Navigation (4 cols on lg, 3 on xl) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            <Card className="rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-3.5 space-y-1">
                <button
                  type="button"
                  onClick={() => handleTabChange('bookings')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'bookings'
                      ? 'bg-teal-50 text-[#1A8491] shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className={`w-4 h-4 ${activeTab === 'bookings' ? 'text-[#1A8491]' : 'text-gray-400'}`} />
                    <span>My Trips & Stays</span>
                  </div>
                  {tripOrders && tripOrders.length > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100/70 text-[#1A8491]">
                      {tripOrders.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('wishlist')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'wishlist'
                      ? 'bg-teal-50 text-[#1A8491] shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'text-[#1A8491]' : 'text-gray-400'}`} />
                    <span>Wishlist</span>
                  </div>
                  {(wishlistItems?.length ?? 0) > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {wishlistItems?.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('messages')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'messages'
                      ? 'bg-teal-50 text-[#1A8491] shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className={`w-4 h-4 ${activeTab === 'messages' ? 'text-[#1A8491]' : 'text-gray-400'}`} />
                    <span>Host Messages</span>
                  </div>
                  {unreadMessagesCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {unreadMessagesCount} new
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('notifications')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'notifications'
                      ? 'bg-teal-50 text-[#1A8491] shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-[#1A8491]' : 'text-gray-400'}`} />
                    <span>Notifications</span>
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('settings')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-teal-50 text-[#1A8491] shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#1A8491]' : 'text-gray-400'}`} />
                    <span>Account Settings</span>
                  </div>
                </button>

                <Separator className="my-2 bg-gray-100" />

                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </CardContent>
            </Card>

            {/* Quick Travel Tip Card */}
            <div className="bg-gradient-to-br from-[#2BB0BB]/10 to-teal-50 rounded-3xl border border-teal-100 p-5 space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center gap-2 font-heading font-semibold text-[#1A8491]">
                <Sparkles className="w-4 h-4" />
                <span>Kerala Travel Tip</span>
              </div>
              <p className="leading-relaxed">
                Monsoon retreats in Wayanad and Munnar offer peaceful backwater boat cruises with serene mist. Check our curated seasonal escapes!
              </p>
              <button
                type="button"
                onClick={() => navigate('/properties')}
                className="font-semibold text-[#1A8491] hover:underline flex items-center gap-1 pt-1"
              >
                <span>Browse properties</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Main Content (8 cols on lg, 9 on xl) */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* 1. BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
                      My Trips & Reservations
                    </h2>
                    <p className="text-xs text-gray-500">
                      Track upcoming stays, check-in instructions, and payment receipts.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/trips')}
                    className="rounded-xl text-xs font-semibold h-9 border-gray-200"
                  >
                    Open Trips Page →
                  </Button>
                </div>

                {tripsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2BB0BB]" />
                    <p className="text-xs text-gray-500">Loading your reservations…</p>
                  </div>
                ) : !tripOrders?.length ? (
                  <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#1A8491] flex items-center justify-center mx-auto">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-lg text-gray-900">No active trips yet</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Ready to experience Kerala? Explore authentic backwater homestays and heritage plantations.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/properties')}
                      className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-medium rounded-xl px-5 h-10 text-xs shadow-sm"
                    >
                      Browse Stays
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tripOrders.map((order) => (
                      <TripOrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
                      Wishlist
                    </h2>
                    <p className="text-xs text-gray-500">
                      Homestays you have saved for later.
                    </p>
                  </div>
                </div>

                {wishlistLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2BB0BB]" />
                    <p className="text-xs text-gray-500">Loading your wishlist…</p>
                  </div>
                ) : wishlistError ? (
                  <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-2">
                    <h3 className="font-heading font-bold text-lg text-gray-900">
                      Could not load wishlist
                    </h3>
                    <p className="text-xs text-gray-500">
                      Please refresh the page and try again.
                    </p>
                  </div>
                ) : !wishlistItems?.length ? (
                  <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                      <Heart className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-lg text-gray-900">
                        No saved stays yet
                      </h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Tap the heart on a homestay to save it here for later.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/properties')}
                      className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-medium rounded-xl px-5 h-10 text-xs shadow-sm"
                    >
                      Browse Stays
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-gray-900">
                      Saved Homestays ({wishlistItems.length})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {wishlistItems.map((item) => {
                        const property = item.property;
                        const title = property.property_name || 'Untitled stay';
                        const location = property.location_address || 'Location TBA';
                        const image =
                          property.cover_image ||
                          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=350&fit=crop';
                        const price = property.price ?? 0;

                        return (
                          <div
                            key={item.id}
                            className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden hover:shadow-md hover:border-[#2BB0BB]/50 transition-all duration-300 flex flex-col"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                              <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              />
                              <button
                                type="button"
                                disabled={isToggling}
                                onClick={() => handleRemoveFromWishlist(property.id)}
                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-60"
                                title="Remove from wishlist"
                              >
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              </button>
                            </div>

                            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <h4 className="font-heading font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-[#1A8491] transition-colors">
                                  {title}
                                </h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span className="truncate">{location}</span>
                                </p>
                              </div>

                              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div>
                                  <span className="font-heading font-bold text-base text-gray-900">
                                    ₹{price.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-500"> / night</span>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/property/${property.id}`)}
                                  className="rounded-xl text-xs h-8 px-3 border-gray-200 hover:border-[#2BB0BB] hover:text-[#1A8491]"
                                >
                                  View Stay
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. MESSAGES TAB (Two-pane interactive messenger) */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-3 border-b border-gray-200">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
                    Host Conversations & Inquiries
                  </h2>
                  <p className="text-xs text-gray-500">
                    Direct communication with your Kerala stay hosts and tour guides.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                  {/* Left Chat Threads List (5 cols) */}
                  <div className="md:col-span-5 border-r border-gray-150 flex flex-col">
                    <div className="p-3.5 border-b border-gray-150 bg-gray-50/50">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Active Chats ({messages.length})
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                      {messages.map((thread) => {
                        const isSelected = thread.id === selectedThreadId;
                        return (
                          <div
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                              isSelected ? 'bg-teal-50/60' : 'hover:bg-gray-50'
                            }`}
                          >
                            <Avatar className="w-10 h-10 shrink-0">
                              <AvatarImage src={thread.image} />
                              <AvatarFallback>{thread.host[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-heading font-semibold text-xs text-gray-900 truncate">
                                  {thread.host}
                                </h4>
                                <span className="text-[10px] text-gray-400 shrink-0">{thread.time}</span>
                              </div>
                              <p className="text-[11px] font-medium text-[#1A8491] truncate">{thread.property}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">{thread.lastMessage}</p>
                            </div>

                            {thread.unread && (
                              <span className="w-2 h-2 rounded-full bg-[#2BB0BB] shrink-0 mt-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Active Conversation Pane (7 cols) */}
                  <div className="md:col-span-7 flex flex-col justify-between bg-gray-50/30">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-150 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={activeThread.image} />
                          <AvatarFallback>{activeThread.host[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-heading font-semibold text-sm text-gray-900">
                            {activeThread.host}
                          </h4>
                          <p className="text-xs text-gray-500">{activeThread.property}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs text-emerald-700 bg-emerald-50 border-emerald-200">
                        Host Online
                      </Badge>
                    </div>

                    {/* Messages Body */}
                    <div className="p-4 space-y-3 overflow-y-auto flex-1 max-h-[350px]">
                      {activeThread.history.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-[#2BB0BB] text-white rounded-br-none shadow-xs'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-xs'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`text-[9px] block mt-1 text-right ${
                                msg.sender === 'user' ? 'text-white/80' : 'text-gray-400'
                              }`}
                            >
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-3 bg-white border-t border-gray-150 flex items-center gap-2">
                      <Input
                        placeholder={`Message ${activeThread.host}…`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="rounded-xl border-gray-200 text-xs h-10"
                      />
                      <Button
                        size="sm"
                        onClick={handleSendMessage}
                        className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white rounded-xl h-10 px-4"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
                      Notifications & Updates
                    </h2>
                    <p className="text-xs text-gray-500">
                      Stay informed about booking confirmations, price alerts, and host replies.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="rounded-xl text-xs h-9 border-gray-200"
                  >
                    Mark All as Read
                  </Button>
                </div>

                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        !notif.read
                          ? 'bg-teal-50/50 border-teal-200 shadow-xs'
                          : 'bg-white border-gray-200/90'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.type === 'booking'
                              ? 'bg-emerald-100 text-emerald-700'
                              : notif.type === 'promo'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {notif.type === 'booking' ? (
                            <Calendar className="w-4 h-4" />
                          ) : notif.type === 'promo' ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <h4 className="font-heading font-semibold text-sm text-gray-900">
                            {notif.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-gray-400 block pt-1">{notif.time}</span>
                        </div>
                      </div>

                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#2BB0BB] shrink-0 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-3 border-b border-gray-200">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
                    Account & Profile Settings
                  </h2>
                  <p className="text-xs text-gray-500">
                    Update personal profile details, preferences, and payment security.
                  </p>
                </div>

                {/* Profile Information Card */}
                <Card className="rounded-3xl border border-gray-200/90 shadow-sm bg-white overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-heading font-bold text-gray-900">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border border-gray-200">
                        <AvatarImage src={user?.profile_image || 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=200&h=200&fit=crop&crop=face'} />
                        <AvatarFallback className="bg-teal-100 text-[#1A8491] font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast({ title: 'Photo Update', description: 'Upload dialog triggered.' })
                        }
                        className="rounded-xl text-xs h-9 border-gray-200"
                      >
                        <Camera className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                        <span>Change Photo</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-semibold text-gray-700">
                          Full Legal Name
                        </Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="rounded-xl border-gray-200 text-xs h-10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-xl border-gray-200 text-xs h-10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="rounded-xl border-gray-200 text-xs h-10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="location" className="text-xs font-semibold text-gray-700">
                          Home Location / City
                        </Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="rounded-xl border-gray-200 text-xs h-10"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="bio" className="text-xs font-semibold text-gray-700">
                          Travel Bio & Introduction
                        </Label>
                        <Textarea
                          id="bio"
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="rounded-xl border-gray-200 text-xs"
                          placeholder="Tell hosts a little about your travel interests..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods Card */}
                <Card className="rounded-3xl border border-gray-200/90 shadow-sm bg-white overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-heading font-bold text-gray-900">
                      Saved Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700">
                          <CreditCard className="w-5 h-5 text-[#1A8491]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 font-mono">
                            •••• •••• •••• 4528
                          </p>
                          <p className="text-[11px] text-gray-500">Expires 05/27 • Visa Gold</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
                        Default
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        toast({
                          title: 'Add Payment Method',
                          description: 'Secure card authorization via Cashfree gateway.',
                        })
                      }
                      className="w-full rounded-xl text-xs h-10 border-gray-200 text-gray-700"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add New Card or UPI ID
                    </Button>
                  </CardContent>
                </Card>

                {/* Notifications & Travel Preferences */}
                <Card className="rounded-3xl border border-gray-200/90 shadow-sm bg-white overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-heading font-bold text-gray-900">
                      Travel & Communication Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-gray-900">Email Booking Notifications</p>
                        <p className="text-xs text-gray-500">Receive booking receipts and host check-in vouchers via email</p>
                      </div>
                      <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-gray-900">WhatsApp & SMS Updates</p>
                        <p className="text-xs text-gray-500">Real-time trip updates, flight delay notices, and caretaker contacts</p>
                      </div>
                      <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-gray-900">Seasonal Travel Deals & Escapes</p>
                        <p className="text-xs text-gray-500">Curated Kerala offers, secret villa discounts, and monsoon specials</p>
                      </div>
                      <Switch checked={marketingNotifs} onCheckedChange={setMarketingNotifs} />
                    </div>
                  </CardContent>
                </Card>

                {/* Save CTA */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handleSaveSettings}
                    className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-heading font-semibold rounded-xl h-11 px-6 shadow-sm transition-all"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('bookings')}
                    className="rounded-xl h-11 px-6 border-gray-200 text-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
