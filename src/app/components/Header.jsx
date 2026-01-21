'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../../app/components/ui/button';
import { cn } from '../../lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAuthPage = pathname.startsWith('/auth');
  
  // Navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Login', href: '/auth/login' },
    { name: 'Sign Up', href: '/auth/signup' },
  ];
  
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
            <Link 
              href="/" 
              className="text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </Link>
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
        
        {/* Mobile menu for auth pages */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="container px-4 py-3 space-y-2">
              <Link 
                href="/" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-gray-100 hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-gray-100"
                )}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}