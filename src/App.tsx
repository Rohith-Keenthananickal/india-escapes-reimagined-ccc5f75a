import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
import BookingCheckout from "./pages/BookingCheckout";
import BookingSuccess from "./pages/BookingSuccess";
import PaymentReturn from "./pages/PaymentReturn";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import SearchResults from "./pages/SearchResults";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AccountDeletion from "./pages/AccountDeletion";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./lib/ScrollToTop";
import {
  AuthProvider,
  GoogleOneTap,
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  EmailVerificationPage,
} from "@/modules/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <GoogleOneTap />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/email-verification" element={<EmailVerificationPage />} />
            <Route path="/properties" element={<PropertyListing />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/location/:id" element={<LocationDetails />} />
            <Route path="/booking/:id" element={<BookingFlow />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/location-demo" element={<LocationDemo />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<BookingCheckout />} />
            <Route path="/booking/payment-return" element={<PaymentReturn />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:orderId" element={<TripDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/account_deletion" element={<AccountDeletion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
