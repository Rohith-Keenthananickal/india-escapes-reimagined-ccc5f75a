import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Menu, Globe, User, Heart, Home, Compass, Wrench } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    { id: "services", label: "Services", icon: Wrench },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Hevan Connect Travel</span>
          </Link>

          {/* Main Tabs - Desktop */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            {mainTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-pink-100 text-pink-700 border border-pink-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium text-sm">{tab.label}</span>
                  {(tab.id === "experiences" || tab.id === "services") && (
                    <Badge className="bg-pink-500 text-white text-xs">
                      NEW
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden sm:flex text-sm font-medium">
              Become a host
            </Button>
            
            <Button variant="ghost" size="icon">
              <Globe className="w-4 h-4" />
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 border rounded-full px-3 py-2">
                    <Menu className="w-4 h-4" />
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlists
                  </DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 border rounded-full px-3 py-2">
                    <Menu className="w-4 h-4" />
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/login')}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/signup')}>
                    Sign up
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Become a host
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
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-pink-100 text-pink-700 border border-pink-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium text-sm">{tab.label}</span>
                  {(tab.id === "experiences" || tab.id === "services") && (
                    <Badge className="bg-pink-500 text-white text-xs">
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