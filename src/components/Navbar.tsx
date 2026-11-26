import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Menu,
  User,
  Heart,
  Home,
  Compass,
  Plane,
  MapPinned,
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
import { toast } from "@/hooks/use-toast";

const scrollToEcosystem = () => {
  const el = document.getElementById("ecosystem");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.location.hash = "ecosystem";
};

interface NavbarProps {
  /** When false, navbar is not sticky (use inside a parent sticky stack). Default true. */
  sticky?: boolean;
}

const Navbar = ({ sticky = true }: NavbarProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const itemCount = useCartItemCount();
  const [activeTab, setActiveTab] = useState("stays");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveTab("stays");
    } else if (path === "/experiences") {
      setActiveTab("experiences");
    } else {
      setActiveTab("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#ecosystem") {
      const timer = window.setTimeout(() => scrollToEcosystem(), 150);
      return () => window.clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const handleTabClick = (tabId: string) => {
    if (tabId === "flights") {
      toast({
        title: "Flights coming soon",
        description: "We're preparing flight bookings for Kerala journeys.",
      });
      return;
    }

    setActiveTab(tabId);
    if (tabId === "stays") {
      navigate("/");
    } else if (tabId === "experiences") {
      navigate("/experiences");
    }
  };

  const handleAtpClick = () => {
    if (location.pathname === "/") {
      scrollToEcosystem();
    } else {
      navigate("/#ecosystem");
    }
  };

  const handleBecomeHost = () => {
    window.open("https://triphavenco.com/", "_blank", "noopener,noreferrer");
  };

  const mainTabs = [
    { id: "stays", label: "Stays", icon: Home, comingSoon: false },
    { id: "experiences", label: "Experiences", icon: Compass, comingSoon: false },
    { id: "flights", label: "Flights", icon: Plane, comingSoon: true },
  ];

  return (
    <nav
      className={`${sticky ? "sticky top-0 z-50 border-b shadow-sm" : "relative z-10 border-b-0 shadow-none"} bg-white`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16 gap-1.5">
          <Link to="/" className="flex items-center space-x-2 shrink-0 z-10">
            <img
              src="/logo-icon.png"
              alt="TripHavenCo"
              className="h-8 min-[360px]:h-9 w-auto object-contain md:hidden"
            />
            <img
              src="/Logo_color.svg"
              alt="TripHavenCo"
              className="hidden md:block h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex min-w-0 md:absolute md:left-1/2 md:-translate-x-1/2 items-center gap-0.5 min-[360px]:gap-1 md:gap-0 md:space-x-1.5 lg:space-x-2">
            {mainTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  aria-label={tab.label}
                  className={`relative flex items-center gap-1.5 lg:space-x-2 shrink-0 px-2 min-[360px]:px-2.5 lg:px-4 py-2 rounded-xl border border-transparent transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-brand-teal-50 text-brand-primary-700 !border-brand-teal-200 font-semibold shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                  } ${tab.comingSoon ? "opacity-80" : ""}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className={`text-xs min-[360px]:text-sm ${activeTab === tab.id ? "" : "hidden md:inline"}`}>{tab.label}</span>
                  {tab.comingSoon && (
                    <span className="md:hidden absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-secondary border border-white" />
                  )}
                  {tab.comingSoon && (
                    <Badge className="hidden md:inline-flex bg-brand-secondary text-brand-dark font-semibold text-[10px] border border-brand-secondary-700/30 px-1.5 py-0">
                      Soon
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 z-10 shrink-0">
            <div className="hidden sm:flex items-center">
              <Cart />
            </div>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center space-x-2 border border-gray-200 hover:border-gray-300 rounded-full px-2.5 min-[360px]:px-3 py-2 transition-all"
                  >
                    <Menu className="w-4 h-4 text-gray-700 max-[359px]:hidden" />
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.profile_image || undefined} alt={user?.full_name || "User"} />
                      <AvatarFallback className="text-xs bg-[#1A8491] text-white font-medium">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    {itemCount > 0 && (
                      <span className="sm:hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2BB0BB] rounded-full border-2 border-white ring-1 ring-[#2BB0BB]/30" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-gray-200">
                  <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.full_name || "TripHavenCo Guest"}
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

                  <DropdownMenuSeparator className="my-1 border-gray-100" />

                  <DropdownMenuItem
                    onClick={handleAtpClick}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <MapPinned className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>ATP</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleBecomeHost}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <Home className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Become a Host</span>
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
                    className="relative flex items-center space-x-2 border border-gray-200 hover:border-gray-300 rounded-full px-2.5 min-[360px]:px-3 py-2 transition-all"
                  >
                    <Menu className="w-4 h-4 text-gray-700 max-[359px]:hidden" />
                    <User className="w-4 h-4 text-gray-700" />
                    {itemCount > 0 && (
                      <span className="sm:hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2BB0BB] rounded-full border-2 border-white ring-1 ring-[#2BB0BB]/30" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-gray-200">
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

                  <DropdownMenuSeparator className="my-1 border-gray-100" />

                  <DropdownMenuItem
                    onClick={handleAtpClick}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <MapPinned className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>ATP</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleBecomeHost}
                    className="flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <Home className="w-4 h-4 mr-2.5 text-[#1A8491]" />
                    <span>Become a Host</span>
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
      </div>
    </nav>
  );
};

export default Navbar;
