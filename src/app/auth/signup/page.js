'use client';

import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, getCurrentUser } from '../../../lib/auth';



export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Add loading state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    country: '',
    password: ''
  });
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // If user is already logged in, redirect to home page
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setCheckingAuth(false); // Stop checking auth
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Show nothing while checking auth
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="h-6 w-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Rest of the component logic continues here...

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(formData);
      
      // Redirect to login after successful signup
      router.push('/auth/login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                placeholder="john@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
              />
            </div>

            {/* Country Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <Input
                placeholder="Enter your country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}