
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    toast({
      title: "Login successful!",
      description: "Welcome back to Hevan Connect Travel.",
    });
    navigate('/');
  };

  const handleOTPLogin = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to receive OTP.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "OTP sent!",
      description: "Check your email for the verification code.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
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
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
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

              {!useOTP && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-pink-600 hover:text-pink-500"
                >
                  Forgot password?
                </Link>
              </div>

              {useOTP ? (
                <Button 
                  type="button" 
                  onClick={handleOTPLogin}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Send OTP
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                  Sign in
                </Button>
              )}
            </form>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setUseOTP(!useOTP)}
                className="text-sm text-gray-600"
              >
                {useOTP ? 'Use password instead' : 'Use OTP instead'}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full">
                <Smartphone className="w-4 h-4 mr-2" />
                Continue with Phone
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-pink-600 hover:text-pink-500 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
};

export default Login;
