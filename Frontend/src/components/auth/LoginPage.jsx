import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Play, Video, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Role-based redirect: admin, viewer, others
        let targetPath = '/dashboard';
        if (result.role === 'admin') targetPath = '/admin';
        else if (result.role === 'viewer') targetPath = '/dashboard';
        navigate(targetPath, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
              <Play className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">EventStream</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Welcome to the Future of Event Broadcasting</h2>
            <p className="text-xl text-white/80">
              Stream, manage, and engage with your audience through our professional event platform.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur">
              <Video className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/80">Events Hosted</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-white/80">Active Users</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur">
              <Play className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-white/80">Uptime</div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, rememberMe: checked })
                    }
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;