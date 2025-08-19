'use client';

import React, { Suspense } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import AuthComponent from '@/components/AuthComponent';
import { useSearchParams } from 'next/navigation';

function SignInContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || '';

  return (
    <AuthComponent 
      initialError={errorMessage ? decodeURIComponent(errorMessage) : ''} 
      onErrorClear={() => {}}
      defaultMode="signin" 
    />
  );
}

export default function SignInPage() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <div className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>}>
          <SignInContent />
        </Suspense>
      </div>
    </SessionContextProvider>
  );
}