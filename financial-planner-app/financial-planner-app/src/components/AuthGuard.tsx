'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  loadingMessage?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/sign-in',
  loadingMessage = 'Loading...'
}: AuthGuardProps) {
  const user = useUser();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    // Small delay to let auth state settle
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
      
      if (requireAuth && !user) {
        console.log('🔒 [AuthGuard] Authentication required, redirecting to:', redirectTo);
        router.push(redirectTo);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, requireAuth, redirectTo, router]);

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-600">Redirecting to sign in...</div>
      </div>
    );
  }

  return <>{children}</>;
}