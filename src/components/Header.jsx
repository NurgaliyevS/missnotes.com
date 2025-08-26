import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Home,
  NotebookPen,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    closeMobileMenu();
    // Small delay to ensure menu closes smoothly before navigation
    setTimeout(() => {
      router.push(path);
    }, 150);
  };

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on the menu button itself
      if (
        menuButtonRef.current &&
        menuButtonRef.current.contains(event.target)
      ) {
        return;
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      // Use both mousedown and touchstart for better mobile support
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <NotebookPen className="h-8 w-8" />
            MissNotes
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {session &&
              (router.pathname === "/" ? (
                <Link
                  href="/upload"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Link>
              ) : router.pathname === "/upload" ? (
                <Link
                  href="/"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              ) : (
                <>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    href="/upload"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Link>
                </>
              ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => signIn("google", { callbackUrl: "/upload" })}
                  size="sm"
                  variant="outline"
                  className="hover:bg-slate-50 transition-colors rounded-lg border-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Button>
                <Button
                  onClick={() => signIn("google", { callbackUrl: "/upload" })}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label={
                isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
              }
              aria-expanded={isMobileMenuOpen}
              className="relative z-50"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {session ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  closeMobileMenu();
                }}
                className="w-full"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => signIn("google", { callbackUrl: "/upload" })}
                size="sm"
                variant="outline"
                className="hover:bg-slate-50 transition-colors rounded-lg border-2"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="md:hidden fixed inset-0 bg-black/20 z-30"
              onClick={closeMobileMenu}
            />

            {/* Menu */}
            <div
              ref={mobileMenuRef}
              className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md absolute left-0 right-0 top-16 z-40 shadow-lg"
            >
              <nav className="py-4 space-y-2 px-4">
                {session &&
                  (router.pathname === "/" ? (
                    <button
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-3 hover:bg-slate-50 rounded-lg active:bg-slate-100 w-full text-left touch-manipulation"
                      onClick={() => handleNavigation("/upload")}
                      onTouchEnd={() => handleNavigation("/upload")}
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </button>
                  ) : router.pathname === "/upload" ? (
                    <button
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-3 hover:bg-slate-50 rounded-lg active:bg-slate-100 w-full text-left touch-manipulation"
                      onClick={() => handleNavigation("/")}
                      onTouchEnd={() => handleNavigation("/")}
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </button>
                  ) : (
                    <>
                      <button
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-3 hover:bg-slate-50 rounded-lg active:bg-slate-100 w-full text-left touch-manipulation"
                        onClick={() => handleNavigation("/")}
                        onTouchEnd={() => handleNavigation("/")}
                      >
                        <Home className="h-4 w-4" />
                        Home
                      </button>
                      <button
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-3 hover:bg-slate-50 rounded-lg active:bg-slate-100 w-full text-left touch-manipulation"
                        onClick={() => handleNavigation("/upload")}
                        onTouchEnd={() => handleNavigation("/upload")}
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </button>
                    </>
                  ))}

                {/* Mobile Auth Section */}
                <div className="">
                  {session ? (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          closeMobileMenu();
                        }}
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          signIn("google", { callbackUrl: "/upload" });
                          closeMobileMenu();
                        }}
                        size="sm"
                        variant="outline"
                        className="hover:bg-slate-50 transition-colors rounded-lg border-2 w-full"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign in
                      </Button>
                      <Button
                        onClick={() => {
                          signIn("google", { callbackUrl: "/upload" });
                          closeMobileMenu();
                        }}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
