
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, CreditCard, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const BookingFlow = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const bookingData = location.state || {};
  const { property, checkIn, checkOut, guests, total } = bookingData;

  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    postalCode: ''
  });

  const handleGuestInfoChange = (field: string, value: string) => {
    setGuestInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'phone'];
    return required.every(field => guestInfo[field as keyof typeof guestInfo].trim() !== '');
  };

  const validateStep2 = () => {
    if (paymentMethod === 'card') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
      return required.every(field => paymentInfo[field as keyof typeof paymentInfo].trim() !== '');
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      toast({
        title: "Please complete payment information",
        variant: "destructive"
      });
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmBooking = () => {
    // Handle booking confirmation logic here
    toast({
      title: "Booking confirmed!",
      description: "You'll receive a confirmation email shortly.",
    });
    setCurrentStep(4);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Confirmation Screen
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Your reservation at {property.title} has been confirmed.<br />
              Booking ID: VR{Date.now().toString().slice(-6)}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Property:</span>
                  <span className="font-medium">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{checkIn ? format(checkIn, "MMM d, yyyy") : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{checkOut ? format(checkOut, "MMM d, yyyy") : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Paid:</span>
                  <span>₹{total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                View in Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm ${
                  step <= currentStep ? 'text-pink-500 font-medium' : 'text-gray-600'
                }`}>
                  {step === 1 ? 'Guest Info' : step === 2 ? 'Payment' : 'Review'}
                </span>
                {step < 3 && <div className="w-16 h-px bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 ? 'Guest Information' : 
                   currentStep === 2 ? 'Payment Details' : 'Review & Confirm'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Guest Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First name *</Label>
                        <Input
                          id="firstName"
                          value={guestInfo.firstName}
                          onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name *</Label>
                        <Input
                          id="lastName"
                          value={guestInfo.lastName}
                          onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                        placeholder="+91 99999 99999"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="specialRequests">Special requests (optional)</Label>
                      <Textarea
                        id="specialRequests"
                        value={guestInfo.specialRequests}
                        onChange={(e) => handleGuestInfoChange('specialRequests', e.target.value)}
                        placeholder="Any special requests or notes for the host..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Payment method</Label>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <Button
                          variant={paymentMethod === 'card' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('card')}
                          className="h-16 flex flex-col items-center"
                        >
                          <CreditCard className="w-6 h-6 mb-1" />
                          <span className="text-xs">Credit/Debit Card</span>
                        </Button>
                        <Button
                          variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('upi')}
                          className="h-16 flex flex-col items-center"
                        >
                          <span className="text-xs font-bold">UPI</span>
                        </Button>
                        <Button
                          variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('wallet')}
                          className="h-16 flex flex-col items-center"
                        >
                          <span className="text-xs">Wallet</span>
                        </Button>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card number *</Label>
                          <Input
                            id="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry date *</Label>
                            <Input
                              id="expiryDate"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => handlePaymentInfoChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={paymentInfo.cvv}
                              onChange={(e) => handlePaymentInfoChange('cvv', e.target.value)}
                              placeholder="123"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="nameOnCard">Name on card *</Label>
                          <Input
                            id="nameOnCard"
                            value={paymentInfo.nameOnCard}
                            onChange={(e) => handlePaymentInfoChange('nameOnCard', e.target.value)}
                            placeholder="Full name as on card"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div>
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="example@paytm"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-800">
                        Your payment information is encrypted and secure
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Guest Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p><span className="font-medium">Name:</span> {guestInfo.firstName} {guestInfo.lastName}</p>
                        <p><span className="font-medium">Email:</span> {guestInfo.email}</p>
                        <p><span className="font-medium">Phone:</span> {guestInfo.phone}</p>
                        {guestInfo.specialRequests && (
                          <p><span className="font-medium">Special requests:</span> {guestInfo.specialRequests}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Payment Method</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="capitalize">{paymentMethod} payment</p>
                        {paymentMethod === 'card' && paymentInfo.cardNumber && (
                          <p className="text-sm text-gray-600">
                            Card ending in {paymentInfo.cardNumber.slice(-4)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Cancellation Policy</h3>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          Free cancellation until 24 hours before check-in. After that, cancel before check-in and get a 50% refund.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Ground Rules</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>• Follow the house rules</p>
                        <p>• Treat the place like your own</p>
                        <p>• Communicate with the host if needed</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button onClick={handleNext} className="bg-pink-500 hover:bg-pink-600">
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={handleConfirmBooking} className="bg-green-600 hover:bg-green-700">
                      Confirm Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <img 
                    src={property.images?.[0]} 
                    alt={property.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2">{property.title}</h4>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <div className="flex items-center text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{property.rating}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{checkIn ? format(checkIn, "MMM d") : 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{checkOut ? format(checkOut, "MMM d") : 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{guests}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>₹{property.price?.toLocaleString()} x {nights} nights</span>
                    <span>₹{(property.price * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₹{Math.round(property.price * nights * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>₹{Math.round(property.price * nights * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total (INR)</span>
                  <span>₹{total?.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
