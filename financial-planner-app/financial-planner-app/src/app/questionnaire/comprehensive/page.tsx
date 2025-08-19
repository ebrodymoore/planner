'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import OnboardingWizard from '@/components/OnboardingWizard';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/financial';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import AuthGuard from '@/components/AuthGuard';

function ComprehensiveContent() {
  const router = useRouter();
  const { questionnaireData, saveQuestionnaireData, generateNewAnalysis } = useFinancialPlan();

  const handleComplete = async (data: FormData) => {
    try {
      await saveQuestionnaireData(data);
      await generateNewAnalysis();
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error completing questionnaire:', err);
    }
  };

  const handleSave = async (data: FormData) => {
    try {
      await saveQuestionnaireData(data);
    } catch (err) {
      console.error('Error saving questionnaire data:', err);
    }
  };

  const handleBackToSelector = () => {
    router.push('/questionnaire');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <OnboardingWizard 
        onComplete={handleComplete}
        onSave={handleSave}
        initialData={questionnaireData || {}}
      />
      
      <div className="fixed bottom-6 left-6">
        <Button
          onClick={handleBackToSelector}
          variant="outline"
          className="bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 shadow-xl px-6 py-3"
        >
          ← Back to Plan Selection
        </Button>
      </div>
    </div>
  );
}

export default function ComprehensivePage() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthGuard 
        requireAuth={true} 
        redirectTo="/sign-in"
        loadingMessage="Loading comprehensive questionnaire..."
      >
        <ComprehensiveContent />
      </AuthGuard>
    </SessionContextProvider>
  );
}