import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      signIn('google');
    }
  }, [session, status, router]);

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="bg-[#F3F4EF] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto py-32 px-4">
          <LogIn className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-slate-600 mb-6">
            You need to sign in with your Google account to access this page.
          </p>
          <Button 
            onClick={() => signIn('google')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  // Render the protected content if authenticated
  return children;
}
