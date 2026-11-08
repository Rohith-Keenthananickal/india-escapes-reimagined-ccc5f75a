import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Loader2,
  Compass,
  Sparkles,
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'password' | 'email_otp' | 'phone_otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Email OTP state
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const user = await loginWithEmail({
        email: email.trim().toLowerCase(),
        password,
        remember_me: rememberMe,
      });

      toast({
        title: 'Welcome back!',
        description: `Successfully signed in as ${user.full_name || user.email}.`,
      });

      const searchParams = new URLSearchParams(location.search);
      const returnUrl = searchParams.get('returnUrl');
      const locationState = location.state as { from?: { pathname?: string } } | null;
      const redirectPath =
        returnUrl ||
        locationState?.from?.pathname ||
        (user.user_type === 'HOST' ? '/host' : '/');
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Invalid credentials. Please verify your email and password.';
      setErrorMessage(msg);
      toast({
        title: 'Sign in failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email OTP flow
  const handleSendEmailOtp = async () => {
    if (!otpEmail || !otpEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive an OTP.');
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage(null);

    try {
      await authService.sendEmailOtp(otpEmail.trim(), 'EMAIL_VERIFICATION');
      setOtpSent(true);
      toast({
        title: 'OTP code sent',
        description: `We sent a 6-digit verification code to ${otpEmail}.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send verification code.';
      setErrorMessage(msg);
      toast({
        title: 'Request failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyEmailOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authService.verifyEmailOtp(otpEmail.trim(), otpCode.trim(), 'EMAIL_VERIFICATION');
      toast({
        title: 'Verified successfully',
        description: 'Signing you in...',
      });
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired OTP code.';
      setErrorMessage(msg);
      toast({
        title: 'Verification failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFCFC] flex flex-col lg:flex-row">
      {/* Left Column: Visual Showcase (Airbnb / Booking.com Luxury Style) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 flex-col justify-between p-12 text-white">
        {/* Background Luxury Travel Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80")',
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
          {/* <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <Compass className="w-6 h-6 text-[#2BB0BB]" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              triphaven<span className="text-[#2BB0BB]">.</span>co
            </span> */}
          <div className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-white/90 flex items-center space-x-1.5">

            <Sparkles className="w-3.5 h-3.5 text-[#FFD26E]" />
            <span>Luxury Escapes</span>
          </div>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2BB0BB]/20 backdrop-blur-md border border-[#2BB0BB]/40 text-[#52C2CC] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-heading font-extrabold text-white leading-tight mb-4">
            Ready for your next unforgettable escape?
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-8">
            Pick up right where you left off. Access your itinerary, message verified hosts, or browse newly added secluded villas.
          </p>

          {/* Floating Luxury Stay Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFD26E] text-[#FFD26E]" />
              ))}
              <span className="text-xs font-bold text-white ml-2">4.98 / 5.0</span>
              <span className="text-xs text-white/70">· Cloud Valley Estate, Munnar</span>
            </div>
            <p className="text-sm italic text-gray-200">
              “The check-in was seamless, the plantation views surreal. Easily our favorite getaway platform in India.”
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                alt="Traveler avatar"
                className="w-8 h-8 rounded-full border border-white/40 object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-white">Dr. Siddharth Menon</p>
                <p className="text-[11px] text-gray-400">Verified Guest · Stayed October 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Highlights */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-gray-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#2BB0BB]" />
            <span>Encrypted Login</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#2BB0BB]" />
            <span>Instant Access</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#2BB0BB]" />
            <span>Host Protection</span>
          </div>
        </div>
      </div>

      {/* Right Column: Clean, Modern Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Mobile Top Header */}
        <div className="flex lg:hidden items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img src="/Logo_color.svg" alt="TriphavenCo" className="h-8 w-auto object-contain" />
          </Link>
          <Link
            to="/signup"
            className="text-xs font-semibold text-[#1A8491] hover:text-[#2BB0BB] transition-colors"
          >
            Create Account →
          </Link>
        </div>

        {/* Main Card Content */}
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Header Title */}
          <div className="mb-6">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <Link to="/" className="inline-flex items-center space-x-2">
                <img src="/Logo_color.svg" alt="TriphavenCo" className="h-8 w-auto object-contain" />
              </Link>
              <div className="text-xs text-gray-500">
                New traveler?{' '}
                <Link to="/signup" className="font-semibold text-[#1A8491] hover:text-[#2BB0BB]">
                  Create an account
                </Link>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your TriphavenCo account</p>
          </div>

          {/* Mode Switcher Tabs with Phone Coming Soon */}
          <div className="flex p-1 mb-6 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'password'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('email_otp');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'email_otp'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Email OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('phone_otp');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1 ${
                authMode === 'phone_otp'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Phone</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 font-bold uppercase">
                Soon
              </span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-700 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* TAB 1: EMAIL & PASSWORD SIGN IN */}
          {authMode === 'password' && (
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 animate-in fade-in duration-200">
              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-semibold text-gray-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="pl-9 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs font-semibold text-gray-700">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[#1A8491] hover:text-[#2BB0BB] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
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
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-xs text-gray-600 font-normal cursor-pointer">
                  Remember this device for 30 days
                </Label>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !email || !password}
                className="w-full h-11 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </Button>
            </form>
          )}

          {/* TAB 2: EMAIL OTP SIGN IN */}
          {authMode === 'email_otp' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <Label htmlFor="otp-email" className="text-xs font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="Enter registered email"
                    value={otpEmail}
                    onChange={(e) => {
                      setOtpEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    disabled={otpSent}
                    className="pl-9 h-11 bg-white border-gray-200 focus:border-[#2BB0BB] focus:ring-[#2BB0BB]/20 rounded-xl"
                  />
                </div>
              </div>

              {!otpSent ? (
                <Button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={isSendingOtp || !otpEmail}
                  className="w-full h-11 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Sending OTP code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <form onSubmit={handleVerifyEmailOtpSubmit} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp-code" className="text-xs font-semibold text-gray-700">
                        6-Digit Verification Code
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                        }}
                        className="text-xs text-[#1A8491] hover:underline"
                      >
                        Change email
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="otp-code"
                        placeholder="••••••"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        className="pl-9 h-11 tracking-widest font-mono text-center text-lg bg-white border-gray-200 focus:border-[#2BB0BB] rounded-xl"
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || otpCode.length < 4}
                    className="w-full h-11 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify & Sign In</span>
                    )}
                  </Button>

                  <div className="text-center text-xs text-gray-500">
                    Didn’t receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={isSendingOtp}
                      className="font-semibold text-[#1A8491] hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: PHONE OTP (COMING SOON) */}
          {authMode === 'phone_otp' && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Feature in development</span>
                </div>
                <h4 className="text-base font-heading font-bold text-gray-900">
                  Phone SMS Sign-in Coming Soon
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  We are currently integrating telecom gateways for seamless OTP and WhatsApp verification. Please sign in using your email and password or Google in the meantime.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className="w-full h-10 bg-[#2BB0BB] hover:bg-[#1A8491] text-white text-xs font-semibold rounded-xl"
                >
                  Switch to Password Sign In
                </Button>
              </div>
            </div>
          )}

          {/* Social Login Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FAFCFC] px-3 text-gray-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Integration */}
          <div className="w-full">
            <GoogleAuthButton mode="signin" className="shadow-sm rounded-xl" />
          </div>

          {/* Sign Up Link on Mobile/Desktop */}
          <div className="mt-6 text-center text-xs text-gray-600">
            Don’t have a TriphavenCo account?{' '}
            <Link to="/signup" className="font-bold text-[#1A8491] hover:text-[#2BB0BB] transition-colors">
              Sign up free
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="hidden lg:block text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Triphaven Hospitality Technologies Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
