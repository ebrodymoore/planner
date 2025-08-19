'use client';

import React from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import PlanSelector from '@/components/PlanSelector';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

export default function QuestionnairePage() {
  const router = useRouter();

  const handleSelectQuickPlan = () => {
    router.push('/questionnaire/quick');
  };

  const handleSelectComprehensivePlan = () => {
    router.push('/questionnaire/comprehensive');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthGuard 
        requireAuth={true} 
        redirectTo="/sign-in"
        loadingMessage="Loading questionnaire options..."
      >
        <div className="min-h-screen">
          <PlanSelector 
            onSelectQuickPlan={handleSelectQuickPlan}
            onSelectComprehensivePlan={handleSelectComprehensivePlan}
            onSignIn={handleSignIn}
            onBackToHome={handleBackToHome}
          />
        </div>
      </AuthGuard>
    </SessionContextProvider>
  );
}