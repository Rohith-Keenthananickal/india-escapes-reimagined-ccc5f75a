import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Home,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  ArrowRight,
  Download,
  Share2,
  Mail,
  Phone,
  Clock,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/hooks/use-cart";
import { format } from "date-fns";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, getTotalAmount } = useCart();
  const [bookingDetails, setBookingDetails] = useState<{
    bookingId: string;
    bookingDate: string;
    totalAmount: number;
    items: {
      hotels: any[];
      experiences: any[];
      nearbySuggestions: any[];
    };
  } | null>(null);

  useEffect(() => {
    // Get booking details from location state or localStorage
    const details = location.state?.bookingDetails || JSON.parse(localStorage.getItem('bookingDetails') || '{}');
    setBookingDetails(details);
    
    // Clear cart after successful booking
    clearCart();
    
    // Remove booking details from localStorage
    localStorage.removeItem('bookingDetails');
  }, [clearCart, location.state]);

  const handleContinueExploring = () => {
    navigate("/");
  };

  const handleViewBookings = () => {
    navigate("/dashboard");
  };

  const handleDownloadReceipt = () => {
    // Generate and download receipt (placeholder for now)
    const receiptContent = `
      Booking Receipt
      ================
      
      Booking ID: ${bookingDetails?.bookingId || 'BK' + Date.now()}
      Date: ${format(new Date(), 'PPP')}
      Amount: ₹${getTotalAmount()}
      
      Thank you for your booking!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Booking Confirmation',
        text: `I just booked an amazing trip! Booking ID: ${bookingDetails?.bookingId || 'BK' + Date.now()}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your booking has been successfully processed. We've sent a confirmation email with all the details.
          </p>
        </div>

        {/* Booking Summary Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-green-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Booking Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <Badge variant="secondary" className="font-mono">
                    {bookingDetails?.bookingId || 'BK' + Date.now()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium">{format(new Date(), 'PPP')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-green-600 text-lg">
                    ₹{getTotalAmount()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>support@indiaescapes.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={handleContinueExploring}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Exploring
          </Button>
          
          <Button
            onClick={handleViewBookings}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View My Bookings
          </Button>
          
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          <Button
            onClick={handleShareBooking}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Booking
          </Button>
        </div>

        {/* What's Next Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Confirmation Email</h3>
                <p className="text-sm text-gray-600">
                  You'll receive a detailed confirmation email within the next few minutes.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Booking Reminders</h3>
                <p className="text-sm text-gray-600">
                  We'll send you reminders before your trip with important details.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Special Offers</h3>
                <p className="text-sm text-gray-600">
                  Get exclusive offers and discounts for your next adventure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingSuccess; 