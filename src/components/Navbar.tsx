import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  Globe,
  User,
  Heart,
  Home,
  Compass,
  Wrench,
  LayoutDashboard,
  Luggage,
  ShoppingCart,
  LogIn,
  UserPlus,
  LogOut,
  Info,
} from "lucide-react";
import Cart from "./Cart";
import { useAuth } from "@/modules/auth";
import { useCartItemCount } from "@/modules/cart/hooks/useCart";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const itemCount = useCartItemCount();
  const [activeTab, setActiveTab] = useState("homes");
  const navigate = useNavigate();
  const location = useLocation();

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveTab("homes");
    } else if (path === "/experiences") {
      setActiveTab("experiences");
    } else if (path === "/services") {
      setActiveTab("services");
    }
  }, [location.pathname]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "homes") {
      navigate("/");
    } else if (tabId === "experiences") {
      navigate("/experiences");
    } else if (tabId === "services") {
      navigate("/services");
    }
  };

  const mainTabs = [
    { id: "homes", label: "Homes", icon: Home },
    { id: "experiences", label: "Experiences", icon: Compass },
    // { id: "services", label: "Services", icon: Wrench },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0 z-10">
            <img
              src="/Logo_color.svg"
              alt="TriphavenCo"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </Link>

          {/* Main Tabs - Desktop (centered) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-2">
            {mainTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-brand-teal-50 text-brand-primary-700 border border-brand-teal-200 font-semibold shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                  {/* {(tab.id === "experiences" || tab.id === "services") && (
                    <Badge className="bg-brand-secondary text-brand-dark font-semibold text-xs border border-brand-secondary-700/30">
                      NEW
                    </Badge>
                  )} */}
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4 z-10">
            {/* Desktop: Become a host */}
            <Button
              variant="ghost"
              onClick={() => window.open("https://triphavenco.com/", "_blank", "noopener,noreferrer")}
              className="hidden sm:flex text-sm font-medium hover:text-[#1A8491]"
            >
              Become a host
            </Button>

            {/* Desktop: Cart */}
            <div className="hidden sm:flex items-center">
              <Cart />
            </div>

            {/* User Dropdown Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center space-x-2 border border-gray-200 hover:border-gray-300 rounded-full px-3 py-2 transition-all"
                  >
                    <Menu className="w-4 h-4 text-gray-700" />
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.profile_image || undefined} alt={user?.full_name || 'User'} />
                      <AvatarFallback className="text-xs bg-[#1A8491] text-white font-medium">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Notification indicator dot on mobile when cart has items */}
                    {itemCount > 0 && (
                      <span className="sm:hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2BB0BB] rounded-full border-2 border-white ring-1 ring-[#2BB0BB]/30" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-gray-200">
                  <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.full_name || 'TriphavenCo Guest'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => navigate("/trips")}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <Luggage className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Trips</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard?tab=wishlist")}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <Heart className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>

                  {/* Mobile-only Cart Item */}
                  <DropdownMenuItem
                    onClick={() => navigate("/cart")}
                    className="sm:hidden flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                      <span>Cart</span>
                    </div>
                    {itemCount > 0 && (
                      <Badge className="h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#2BB0BB] text-white border-0">
                        {itemCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>

                  {/* Mobile-only Become a host Item */}
                  <DropdownMenuItem
                    onClick={() => window.open("https://triphavenco.com/", "_blank", "noopener,noreferrer")}
                    className="sm:hidden flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <Home className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Become a host</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 border-gray-100" />

                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center space-x-2 border border-gray-200 hover:border-gray-300 rounded-full px-3 py-2 transition-all"
                  >
                    <Menu className="w-4 h-4 text-gray-700" />
                    <User className="w-4 h-4 text-gray-700" />
                    {/* Notification indicator dot on mobile when cart has items */}
                    {itemCount > 0 && (
                      <span className="sm:hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2BB0BB] rounded-full border-2 border-white ring-1 ring-[#2BB0BB]/30" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl border-gray-200">
                  <DropdownMenuItem
                    onClick={() => navigate("/login")}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Login</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => navigate("/signup")}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Sign up</span>
                  </DropdownMenuItem>

                  {/* Mobile-only Cart Item */}
                  <DropdownMenuItem
                    onClick={() => navigate("/cart")}
                    className="sm:hidden flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                      <span>Cart</span>
                    </div>
                    {itemCount > 0 && (
                      <Badge className="h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#2BB0BB] text-white border-0">
                        {itemCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>

                  {/* Mobile-only Become a host Item */}
                  <DropdownMenuItem
                    onClick={() => window.open("https://triphavenco.com/", "_blank", "noopener,noreferrer")}
                    className="sm:hidden flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <Home className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Become a host</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 border-gray-100" />

                  <DropdownMenuItem
                    onClick={() => navigate("/about")}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <Info className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>About Us</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden pb-4">
          <div className="flex justify-center space-x-4">
            {mainTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-teal-50 text-brand-primary-700 border border-brand-teal-200 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                  {(tab.id === "experiences" || tab.id === "services") && (
                    <Badge className="bg-brand-secondary text-brand-dark font-semibold text-xs border border-brand-secondary-700/30">
                      NEW
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
