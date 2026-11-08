import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const EmailVerificationPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a 6-digit verification code.',
        variant: 'destructive',
      });
      return;
    }

    setIsVerified(true);
    toast({
      title: 'Email verified!',
      description: 'Your account has been successfully verified.',
    });
    setTimeout(() => navigate('/'), 2000);
  };

  const handleResend = () => {
    setTimeLeft(300);
    toast({
      title: 'Verification email sent!',
      description: 'Check your inbox for the new verification code.',
    });
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-teal-50/60 to-[#F8FAFB] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl text-center border-border">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold font-heading text-emerald-800">
                Email verified!
              </CardTitle>
              <p className="text-gray-600">
                Your account has been successfully verified. You'll be redirected to the homepage.
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-[#2BB0BB] hover:bg-[#1A8491] text-[#1F1F1F] hover:text-white font-bold transition-colors"
              >
                Continue to TriphavenCo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal-50/60 to-[#F8FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img
              src="/Logo_color.svg"
              alt="TriphavenCo Logo"
              className="h-9 w-auto"
            />
          </Link>
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#E1F4F6] rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[#1A8491]" />
            </div>
            <CardTitle className="text-2xl font-bold font-heading text-[#1F1F1F]">
              Verify your email
            </CardTitle>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to your email address.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification code</Label>
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="text-center text-2xl tracking-widest focus-visible:ring-[#2BB0BB]"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2BB0BB] hover:bg-[#1A8491] text-[#1F1F1F] hover:text-white font-bold transition-colors"
                disabled={verificationCode.length !== 6}
              >
                Verify email
              </Button>
            </form>

            <div className="text-center space-y-2">
              {timeLeft > 0 ? (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Resend in {formatTime(timeLeft)}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <Button
                    variant="link"
                    onClick={handleResend}
                    className="p-0 h-auto font-medium text-[#1A8491] hover:text-[#2BB0BB]"
                  >
                    Resend
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-[#1A8491] font-medium"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <img
            src="https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=300&h=150&fit=crop"
            alt="Coastal view"
            className="w-full h-32 object-cover rounded-xl opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
