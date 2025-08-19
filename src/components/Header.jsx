import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Upload, Home, NotebookPen, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <NotebookPen className="h-8 w-8" />
            MissNotes
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link href="/upload" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md"
          >
            <nav className="py-4 space-y-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                href="/upload" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Upload className="h-4 w-4" />
                Upload
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
