'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { cn } from '../../lib/utils';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Function to check current auth status
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null); // Explicitly set to null if there's an error
      }
    };
    
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // User signed in or profile updated
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setUser(null);
      }
    });
    
    // Cleanup function
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  const isAuthPage = pathname.startsWith('/auth');
  
  // Navigation items

  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  if (isAuthPage) {
    return (
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            Todo App
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {/* No navigation links for auth pages */}
          </nav>
          {/* Mobile menu button for auth pages */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* No mobile menu for auth pages since no navigation items */}
      </header>
    );
  }
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Todo App
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {/* Show user profile when authenticated */}
          {user && <UserProfile />}
        </nav>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          <div className="container px-4 py-3 space-y-2">
            {/* Show user profile in mobile when authenticated */}
            {user && (
              <div className="pb-2 border-b border-gray-200">
                <UserProfile />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}