
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    setIsSubmitted(true);
    toast({
      title: "Reset link sent!",
      description: "Check your email for password reset instructions.",
    });
  };

  const handleResend = () => {
    toast({
      title: "Email resent!",
      description: "Check your inbox for the new reset link.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <p className="text-gray-600">
                We've sent a password reset link to<br />
                <span className="font-medium">{email}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or{' '}
                <Button variant="link" onClick={handleResend} className="p-0 h-auto font-medium">
                  resend
                </Button>
              </div>
              
              <Button onClick={() => navigate('/login')} className="w-full bg-pink-500 hover:bg-pink-600">
                Back to login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">VR</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Hevan Connect Travel</span>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Forgot your password?</CardTitle>
            <p className="text-gray-600">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                Send reset link
              </Button>
            </form>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <img 
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=150&fit=crop" 
            alt="Heritage building" 
            className="w-full h-32 object-cover rounded-xl opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
