'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import FinancialPlan from '@/components/FinancialPlan';
import { Button } from '@/components/ui/button';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { useUser } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

function DashboardContent() {
  const router = useRouter();
  const {
    questionnaireData,
    analysisResults,
    isLoadingQuestionnaire,
    isLoadingAnalysis,
    isGeneratingAnalysis,
    generateNewAnalysis,
    saveQuestionnaireData
  } = useFinancialPlan();

  const handleUpdateData = async (data: any) => {
    await saveQuestionnaireData(data);
  };

  const handleBackToQuestionnaire = () => {
    router.push('/questionnaire');
  };


  // Show loading state while data is being fetched
  if (isLoadingQuestionnaire || isLoadingAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to questionnaire if no data
  if (!questionnaireData || Object.keys(questionnaireData).length === 0) {
    router.push('/questionnaire');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-600">Redirecting to questionnaire...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <FinancialPlan 
        clientData={questionnaireData}
        analysisResults={analysisResults}
        onUpdateData={handleUpdateData}
      />
      
      <div className="fixed bottom-6 right-6 space-y-3">
        <Button
          onClick={handleBackToQuestionnaire}
          variant="outline"
          className="bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 shadow-xl block w-full px-6 py-3"
        >
          Back to Questionnaire
        </Button>
        {questionnaireData && !analysisResults && (
          <Button
            onClick={generateNewAnalysis}
            disabled={isGeneratingAnalysis}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-xl block w-full px-6 py-3 disabled:opacity-50"
          >
            {isGeneratingAnalysis ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating Analysis...
              </>
            ) : (
              'Generate New Analysis'
            )}
          </Button>
        )}
      </div>
      
      {/* Status indicator */}
      {isGeneratingAnalysis && (
        <div className="fixed top-6 right-6">
          <div className="bg-white/90 backdrop-blur-xl border-gray-200/50 text-gray-800 shadow-xl rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
              <span className="text-gray-600">Generating your personalized financial analysis...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }>
        <AuthGuard 
          requireAuth={true} 
          redirectTo="/sign-in"
          loadingMessage="Loading your financial dashboard..."
        >
          <DashboardContent />
        </AuthGuard>
      </Suspense>
    </SessionContextProvider>
  );
}