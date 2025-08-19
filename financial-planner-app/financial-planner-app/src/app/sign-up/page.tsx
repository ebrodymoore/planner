'use client';

import React from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import AuthComponent from '@/components/AuthComponent';

export default function SignUpPage() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <div className="min-h-screen">
        <AuthComponent 
          initialError="" 
          onErrorClear={() => {}}
          defaultMode="signup" 
        />
      </div>
    </SessionContextProvider>
  );
}