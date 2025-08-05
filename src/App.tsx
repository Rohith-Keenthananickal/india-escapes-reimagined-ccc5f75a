import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerification from "./pages/EmailVerification";
import PropertyListing from "./pages/PropertyListing";
import PropertyDetails from "./pages/PropertyDetails";
import LocationDetails from "./pages/LocationDetails";
import BookingFlow from "./pages/BookingFlow";
import UserDashboard from "./pages/UserDashboard";
import HostDashboard from "./pages/HostDashboard";
import Experiences from "./pages/Experiences";
import Services from "./pages/Services";
import LocationDemo from "./pages/LocationDemo";
import CartPage from "./pages/CartPage";
import BookingSuccess from "./pages/BookingSuccess";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./lib/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
  <ScrollToTop /> {/* ✅ Move it here */}
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/experiences" element={<Experiences />} />
    <Route path="/services" element={<Services />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/email-verification" element={<EmailVerification />} />
    <Route path="/properties" element={<PropertyListing />} />
    <Route path="/property/:id" element={<PropertyDetails />} />
    <Route path="/location/:id" element={<LocationDetails />} />
    <Route path="/booking/:id" element={<BookingFlow />} />
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/host" element={<HostDashboard />} />
    <Route path="/location-demo" element={<LocationDemo />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/booking-success" element={<BookingSuccess />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
