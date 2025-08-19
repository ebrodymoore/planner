'use client';

import React from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import AuthComponent from '@/components/AuthComponent';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || '';

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <div className="min-h-screen">
        <AuthComponent 
          initialError={decodeURIComponent(errorMessage)} 
          onErrorClear={() => {}}
          defaultMode="signin" 
        />
      </div>
    </SessionContextProvider>
  );
}