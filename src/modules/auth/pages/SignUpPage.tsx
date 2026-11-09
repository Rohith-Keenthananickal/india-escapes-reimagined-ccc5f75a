import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Star,
  MapPin,
  Loader2,
  AlertCircle,
  Globe,
  KeyRound,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import type { UserProfile } from '../types/auth.types';

export const SignUpPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
    nationality: 'Indian',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

  // Email OTP verification state (optional pre-verification)
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Google Signup Post-Auth WhatsApp Phone Collection
  const [showGooglePhoneModal, setShowGooglePhoneModal] = useState(false);
  const [googleUser, setGoogleUser] = useState<UserProfile | null>(null);
  const [googlePhone, setGooglePhone] = useState('');
  const [googleCountryCode, setGoogleCountryCode] = useState('+91');
  const [isSavingGooglePhone, setIsSavingGooglePhone] = useState(false);
  const [googlePhoneError, setGooglePhoneError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const digitsOnly = (value: string) => value.replace(/\D/g, '');
  const countryCodeOnly = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    if (!cleaned) return '';
    // Keep a single leading +, digits after
    const hasPlus = cleaned.startsWith('+');
    const digits = cleaned.replace(/\D/g, '').slice(0, 4);
    return hasPlus ? `+${digits}` : digits;
  };

  const handleInputChange = (field: string, value: string) => {
    let nextValue = value;
    if (field === 'phone') nextValue = digitsOnly(value).slice(0, 15);
    if (field === 'countryCode') nextValue = countryCodeOnly(value);

    setFormData((prev) => ({ ...prev, [field]: nextValue }));
    if (errorMessage) setErrorMessage(null);
    // Changing email invalidates any prior OTP verification
    if (field === 'email') {
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtpCode('');
    }
  };

  // Password strength calculations
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-teal-500', text: 'text-teal-600' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-red-400', text: 'text-red-400' };
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  // Step 1 Validation
  const canProceedStep1 =
    formData.firstName.trim().length >= 2 &&
    formData.lastName.trim().length >= 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  // Step 2 Validation
  const canProceedStep2 =
    formData.password.length >= 8 &&
    passwordsMatch &&
    (formData.phone.trim().length === 0 || formData.phone.trim().length >= 8);

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        setErrorMessage('Please enter your first name (minimum 2 characters).');
        return;
      }
      if (!formData.lastName.trim()) {
        setErrorMessage('Please enter your last name.');
        return;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.password || formData.password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
        return;
      }
      if (!passwordsMatch) {
        setErrorMessage('Passwords do not match. Please verify both password entries.');
        return;
      }
      setCurrentStep(3);
    }
  };

  // Google Signup Success Handler -> Prompt for WhatsApp phone
  const handleGoogleSignupSuccess = (user: UserProfile) => {
    if (user.phone_number && user.phone_number.trim().length >= 8) {
      // User already has phone number
      const locationState = location.state as { from?: { pathname?: string } } | null;
      navigate(locationState?.from?.pathname || '/', { replace: true });
      return;
    }

    // Prompt for WhatsApp phone number
    setGoogleUser(user);
    setShowGooglePhoneModal(true);
  };

  const handleSaveGooglePhone = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGooglePhoneError(null);

    const cleanDigits = googlePhone.trim().replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 8 || cleanDigits.length > 15) {
      setGooglePhoneError('Please enter a valid phone number (8 to 15 digits).');
      return;
    }

    if (!googleUser) {
      navigate('/');
      return;
    }

    setIsSavingGooglePhone(true);
    try {
      const formattedPhone = `${googleCountryCode}${cleanDigits}`;
      await authService.updateUserPhone(googleUser.id, formattedPhone, googleCountryCode);
      toast({
        title: 'WhatsApp alerts enabled!',
        description: 'Your mobile number was linked successfully for instant booking notifications.',
      });
      setShowGooglePhoneModal(false);
      const locationState = location.state as { from?: { pathname?: string } } | null;
      navigate(locationState?.from?.pathname || '/', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update phone number.';
      setGooglePhoneError(msg);
      toast({
        title: 'Update failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsSavingGooglePhone(false);
    }
  };

  const handleSkipGooglePhone = () => {
    setShowGooglePhoneModal(false);
    const locationState = location.state as { from?: { pathname?: string } } | null;
    navigate(locationState?.from?.pathname || '/', { replace: true });
  };

  // Optional OTP send
  const handleSendOtp = async () => {
    if (!formData.email) return;
    setIsSendingOtp(true);
    setErrorMessage(null);
    try {
      await authService.sendEmailOtp(formData.email.trim(), 'EMAIL_VERIFICATION');
      setOtpSent(true);
      toast({
        title: 'Verification code sent',
        description: `We sent a 6-digit verification code to ${formData.email}.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send verification code.';
      setErrorMessage(msg);
      toast({
        title: 'Error sending OTP',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Optional OTP verify
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Please enter the complete verification code.');
      return;
    }
    setIsVerifyingOtp(true);
    setErrorMessage(null);
    try {
      await authService.verifyEmailOtp(formData.email.trim(), otpCode.trim(), 'EMAIL_VERIFICATION');
      setIsEmailVerified(true);
      toast({
        title: 'Email verified!',
        description: 'Your email has been confirmed successfully.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired OTP.';
      setErrorMessage(msg);
      toast({
        title: 'Verification failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Final Registration Submission (Always strictly GUEST; email OTP required)
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setErrorMessage('Please review and agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    if (!isEmailVerified || !otpCode.trim()) {
      setErrorMessage('Please verify your email with the OTP before creating your account.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const phoneDigits = formData.phone.trim().replace(/\D/g, '');
      const formattedPhone = phoneDigits ? `${formData.countryCode}${phoneDigits}` : undefined;

      const registeredUser = await register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        full_name: fullName,
        phone_number: formattedPhone,
        country_code: formData.countryCode,
        user_type: 'GUEST',
        portal: 'GUEST',
        nationality: formData.nationality,
        agree_marketing: agreeToMarketing,
        otp_code: otpCode.trim(),
      });

      const otherRoles = (registeredUser.roles || []).filter((role) => role !== 'GUEST');
      toast({
        title: otherRoles.length > 0 ? 'Guest access enabled!' : 'Account created!',
        description:
          otherRoles.length > 0
            ? `Welcome back, ${registeredUser.full_name || 'Traveler'}! Your account can now book as a guest.`
            : `Welcome to TriphavenCo, ${registeredUser.full_name || 'Traveler'}! Your journey begins now.`,
      });

      const locationState = location.state as { from?: { pathname?: string } } | null;
      navigate(locationState?.from?.pathname || '/', { replace: true });
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to complete registration. Please check your information and try again.';
      setErrorMessage(msg);
      toast({
        title: 'Registration failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFCFC] flex flex-col lg:flex-row relative">
      {/* Google WhatsApp Alert Phone Modal */}
      {showGooglePhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
              <MessageCircle className="w-6 h-6 fill-emerald-500 text-white" />
            </div>

            <h3 className="text-xl font-heading font-bold text-gray-900">
              Enable WhatsApp Alerts
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              We send booking confirmations, host check-in instructions, and stay location coordinates directly on WhatsApp for seamless travel.
            </p>

            {googlePhoneError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{googlePhoneError}</span>
              </div>
            )}

            <form onSubmit={handleSaveGooglePhone} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="google-phone" className="text-xs font-semibold text-gray-700">
                  WhatsApp Mobile Number <span className="text-emerald-600">*</span>
                </Label>
                <div className="flex space-x-2">
                  <div className="w-24 shrink-0">
                    <Input
                      value={googleCountryCode}
                      onChange={(e) => setGoogleCountryCode(countryCodeOnly(e.target.value))}
                      inputMode="tel"
                      className="h-11 text-center font-medium bg-white border-gray-200 rounded-xl"
                      placeholder="+91"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="google-phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="9876543210"
                      value={googlePhone}
                      onChange={(e) => {
                        setGooglePhone(digitsOnly(e.target.value).slice(0, 15));
                        if (googlePhoneError) setGooglePhoneError(null);
                      }}
                      className="pl-9 h-11 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <Button
                  type="submit"
                  disabled={isSavingGooglePhone || !googlePhone}
                  className="w-full sm:flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isSavingGooglePhone ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save & Continue</span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkipGooglePhone}
                  className="w-full sm:w-auto h-11 text-xs text-gray-500 hover:text-gray-800"
                >
                  Add later
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Left Column: Visual Showcase (Airbnb / Booking.com Luxury Style) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 flex-col justify-between p-12 text-white">
        {/* Background Image with Rich Scrim */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&auto=format&fit=crop&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-gray-950/60" />

        {/* Top Header on Visual Side */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md shadow-sm hover:bg-white transition-all">
            <img
              src="/Logo_color.svg"
              alt="TriphavenCo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-white/90 flex items-center space-x-1.5">

            <Sparkles className="w-3.5 h-3.5 text-[#FFD26E]" />
            <span>Guest Escapes</span>
          </div>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2BB0BB]/20 backdrop-blur-md border border-[#2BB0BB]/40 text-[#52C2CC] text-xs font-semibold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Discover India Differently</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-heading font-extrabold text-white leading-tight mb-4">
            Join the community of conscious travelers.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-8">
            Access handpicked private villas, boutique heritage stays, and unforgettable local adventures across India’s most scenic destinations.
          </p>

          {/* Social Proof / Verified Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFD26E] text-[#FFD26E]" />
              ))}
              <span className="text-xs font-bold text-white ml-2">4.96 / 5.0</span>
              <span className="text-xs text-white/70">· 14,000+ reviews</span>
            </div>
            <p className="text-sm italic text-gray-200">
              “Finding authentic, serene villas in Wayanad and Himachal was effortless. Triphaven verified every detail.”
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                alt="Traveler avatar"
                className="w-8 h-8 rounded-full border border-white/40 object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-white">Ananya Mukherjee</p>
                <p className="text-[11px] text-gray-400">Bangalore, Traveler since 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-gray-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#2BB0BB]" />
            <span>100% Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#2BB0BB]" />
            <span>Best Rate Promise</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#2BB0BB]" />
            <span>24/7 Concierge</span>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Stepper Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Mobile Top Header */}
        <div className="flex lg:hidden items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img src="/Logo_color.svg" alt="TriphavenCo" className="h-8 w-auto object-contain" />
          </Link>
          <Link
            to="/login"
            className="text-xs font-semibold text-[#1A8491] hover:text-[#2BB0BB] transition-colors"
          >
            Sign In →
          </Link>
        </div>

        {/* Main Card Content */}
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Header Title & Subtitle */}
          <div className="mb-6">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <Link to="/" className="inline-flex items-center space-x-2">
                <img src="/Logo_color.svg" alt="TriphavenCo" className="h-8 w-auto object-contain" />
              </Link>
              <div className="text-xs text-gray-500">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-[#1A8491] hover:text-[#2BB0BB]">
                  Sign in
                </Link>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of 3: {currentStep === 1 && 'Personal details'}
              {currentStep === 2 && 'Security & mobile'}
              {currentStep === 3 && 'Preferences & confirmation'}
            </p>
          </div>

          {/* Stepper Progress Bar & Steps Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {/* Step 1 Indicator */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center space-x-2 text-xs font-semibold transition-colors ${
                  currentStep >= 1 ? 'text-[#1A8491]' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep > 1
                      ? 'bg-[#2BB0BB] text-white'
                      : currentStep === 1
                      ? 'bg-[#1A8491] text-white ring-4 ring-[#2BB0BB]/20'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </div>
                <span className="hidden sm:inline">Basics</span>
              </button>

              <div
                className={`flex-1 h-1 mx-3 rounded-full transition-colors ${
                  currentStep > 1 ? 'bg-[#2BB0BB]' : 'bg-gray-200'
                }`}
              />

              {/* Step 2 Indicator */}
              <button
                type="button"
                onClick={() => canProceedStep1 && setCurrentStep(2)}
                className={`flex items-center space-x-2 text-xs font-semibold transition-colors ${
                  currentStep >= 2
                    ? 'text-[#1A8491]'
                    : canProceedStep1
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep > 2
                      ? 'bg-[#2BB0BB] text-white'
                      : currentStep === 2
                      ? 'bg-[#1A8491] text-white ring-4 ring-[#2BB0BB]/20'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                </div>
                <span className="hidden sm:inline">Security</span>
              </button>

              <div
                className={`flex-1 h-1 mx-3 rounded-full transition-colors ${
                  currentStep > 2 ? 'bg-[#2BB0BB]' : 'bg-gray-200'
                }`}
              />

              {/* Step 3 Indicator */}
              <button
                type="button"
                onClick={() => canProceedStep1 && canProceedStep2 && setCurrentStep(3)}
                className={`flex items-center space-x-2 text-xs font-semibold transition-colors ${
                  currentStep === 3
                    ? 'text-[#1A8491]'
                    : canProceedStep1 && canProceedStep2
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep === 3
                      ? 'bg-[#1A8491] text-white ring-4 ring-[#2BB0BB]/20'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span className="hidden sm:inline">Finish</span>
              </button>
            </div>
          </div>

          {/* Inline Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-700 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* STEP 1: BASICS */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-5 animate-in fade-in duration-300">
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-gray-700">
                    First name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      placeholder="Rohith"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-9 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold text-gray-700">
                    Last name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Kumar"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                  Email address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="rohith@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-9 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-500">We will send your booking confirmations here.</p>
              </div>

              {/* Continue to Step 2 */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Social Login Separator */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#FAFCFC] px-2 text-gray-400 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Google Fast Onboarding with WhatsApp Phone Interceptor */}
              <div className="w-full">
                <GoogleAuthButton
                  mode="signup"
                  className="shadow-sm rounded-xl"
                  onSuccessWithUser={handleGoogleSignupSuccess}
                />
              </div>
            </form>
          )}

          {/* STEP 2: SECURITY & CONTACT */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="space-y-5 animate-in fade-in duration-300">
              {/* Phone Number with Country Code */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                  Mobile number <span className="text-gray-400 font-normal">(for WhatsApp alerts)</span>
                </Label>
                <div className="flex space-x-2">
                  <div className="w-24 shrink-0">
                    <Input
                      value={formData.countryCode}
                      onChange={(e) => handleInputChange('countryCode', e.target.value)}
                      inputMode="tel"
                      className="h-11 text-center font-medium bg-white border-gray-200 rounded-xl"
                      placeholder="+91"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-9 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">For WhatsApp booking coordinates, vouchers, and host check-in details.</p>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-9 pr-10 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Strength:</span>
                      <span className={`font-semibold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">
                  Confirm password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-type your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`pl-9 pr-10 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl ${
                      formData.confirmPassword && !passwordsMatch ? 'border-red-400' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p
                    className={`text-[11px] flex items-center space-x-1 ${
                      passwordsMatch ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <span>Passwords do not match yet</span>
                    )}
                  </p>
                )}
              </div>

              {/* Step 2 Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="h-11 px-4 border-gray-300 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: PREFERENCES, OPTIONAL VERIFICATION & FINISH */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-5 animate-in fade-in duration-300">
              {/* Profile Preview Card */}
              <div className="p-4 rounded-xl bg-[#F0F9FA] border border-[#B6E5E9] flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-[#2BB0BB] text-white font-bold text-lg flex items-center justify-center shadow-sm">
                  {formData.firstName.charAt(0).toUpperCase()}
                  {formData.lastName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900 truncate">
                      {formData.firstName} {formData.lastName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#1A8491] border border-[#B6E5E9]">
                      Traveler
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{formData.email}</p>
                  {formData.phone && (
                    <p className="text-[11px] text-gray-500">
                      {formData.countryCode} {formData.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Nationality */}
              <div className="space-y-1.5">
                <Label htmlFor="nationality" className="text-xs font-semibold text-gray-700">
                  Nationality
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="nationality"
                    placeholder="Indian"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="pl-9 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Required Email Verification */}
              <div className="p-3.5 rounded-xl border border-[#2BB0BB]/40 bg-[#F0F9FA] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#1A8491]" />
                    <span className="text-xs font-bold text-gray-800">Email Verification</span>
                  </div>
                  {isEmailVerified ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600">Required</span>
                  )}
                </div>

                {!isEmailVerified && (
                  <div>
                    {!otpSent ? (
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] text-gray-600">
                          Verify your email with an OTP before creating your guest account.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                          className="text-xs h-8 shrink-0 border-[#2BB0BB] text-[#1A8491] hover:bg-white"
                        >
                          {isSendingOtp ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : null}
                          Send OTP
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="one-time-code"
                            placeholder="Enter 6-digit code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(digitsOnly(e.target.value).slice(0, 6))}
                            maxLength={6}
                            className="h-9 text-xs tracking-widest font-mono bg-white"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleVerifyOtp}
                            disabled={isVerifyingOtp}
                            className="h-9 bg-[#2BB0BB] hover:bg-[#1A8491] text-white text-xs px-3"
                          >
                            {isVerifyingOtp ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span>Code sent to {formData.email}</span>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-[#1A8491] hover:underline"
                          >
                            Resend code
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Consents */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-2.5">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-0.5"
                    required
                  />
                  <Label htmlFor="terms" className="text-xs text-gray-600 leading-normal cursor-pointer">
                    I agree to Triphaven’s{' '}
                    <Link to="/terms" target="_blank" className="font-semibold text-[#1A8491] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" target="_blank" className="font-semibold text-[#1A8491] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Checkbox
                    id="marketing"
                    checked={agreeToMarketing}
                    onCheckedChange={(checked) => setAgreeToMarketing(checked as boolean)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="marketing" className="text-xs text-gray-500 leading-normal cursor-pointer">
                    Receive curated weekend getaway recommendations and exclusive member rates (optional).
                  </Label>
                </div>
              </div>

              {/* Step 3 Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="h-11 px-4 border-gray-300 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !agreeToTerms || !isEmailVerified}
                  className="flex-1 h-11 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1 text-[#FFD26E]" />
                      <span>Complete Registration</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Bottom Card Navigation */}
          <div className="mt-8 text-center text-xs text-gray-500">
            Protected by reCAPTCHA and TriphavenCo Data Security Standards.
          </div>
        </div>

        {/* Desktop Footer copyright */}
        <div className="hidden lg:block text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Triphaven Hospitality Technologies Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
