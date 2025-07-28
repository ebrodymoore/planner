'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import OnboardingWizard from '@/components/OnboardingWizard';
import FinancialPlan from '@/components/FinancialPlan';
import AuthComponent from '@/components/AuthComponent';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { useUser } from '@supabase/auth-helpers-react';
import { FormData } from '@/types/financial';
import { AlertTriangle, Loader2 } from 'lucide-react';

function HomePage() {
  const user = useUser();
  const [currentView, setCurrentView] = useState<'questionnaire' | 'plan'>('questionnaire');
  
  const {
    questionnaireData,
    analysisResults,
    isLoadingQuestionnaire,
    isLoadingAnalysis,
    isGeneratingAnalysis,
    loadQuestionnaireData,
    loadAnalysisResults,
    generateNewAnalysis,
    saveQuestionnaireData,
    error,
    clearError
  } = useFinancialPlan();

  // Handle questionnaire completion
  const handleComplete = async (data: FormData) => {
    try {
      await saveQuestionnaireData(data);
      await generateNewAnalysis();
      setCurrentView('plan');
    } catch (err) {
      console.error('Error completing questionnaire:', err);
    }
  };

  // Handle auto-save during questionnaire
  const handleSave = async (data: FormData) => {
    try {
      await saveQuestionnaireData(data);
    } catch (err) {
      console.error('Error saving questionnaire data:', err);
    }
  };

  // Handle navigation
  const handleBackToQuestionnaire = () => {
    setCurrentView('questionnaire');
  };

  const handleViewPlan = async () => {
    if (!analysisResults && questionnaireData) {
      await generateNewAnalysis();
    }
    setCurrentView('plan');
  };

  const handleUpdateData = async (data: FormData) => {
    await saveQuestionnaireData(data);
  };

  // Show authentication if user not logged in
  if (!user) {
    return <AuthComponent />;
  }

  // Show loading state
  if (isLoadingQuestionnaire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Show error if exists
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={clearError} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show financial plan view
  if (currentView === 'plan') {
    return (
      <div className="min-h-screen">
        <FinancialPlan 
          clientData={questionnaireData || {}}
          analysisResults={analysisResults}
          onUpdateData={handleUpdateData}
        />
        <div className="fixed bottom-4 right-4 space-y-2">
          <Button
            onClick={handleBackToQuestionnaire}
            variant="outline"
            className="bg-white shadow-lg block w-full"
          >
            Back to Questionnaire
          </Button>
          {questionnaireData && !analysisResults && (
            <Button
              onClick={generateNewAnalysis}
              disabled={isGeneratingAnalysis}
              className="bg-green-600 hover:bg-green-700 shadow-lg block w-full"
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
      </div>
    );
  }

  // Show questionnaire view
  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingWizard 
        onComplete={handleComplete}
        onSave={handleSave}
        initialData={questionnaireData || {}}
      />
      
      {/* Action buttons */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {questionnaireData && Object.keys(questionnaireData).length > 0 && (
          <Button
            onClick={handleViewPlan}
            disabled={isLoadingAnalysis}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg block w-full"
          >
            {isLoadingAnalysis ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading Plan...
              </>
            ) : (
              'View Financial Plan'
            )}
          </Button>
        )}
        
        {questionnaireData && Object.keys(questionnaireData).length > 0 && !analysisResults && (
          <Button
            onClick={generateNewAnalysis}
            disabled={isGeneratingAnalysis}
            variant="outline"
            className="bg-white shadow-lg block w-full"
          >
            {isGeneratingAnalysis ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating Analysis...
              </>
            ) : (
              'Generate Analysis'
            )}
          </Button>
        )}
      </div>
      
      {/* Status indicator */}
      {isGeneratingAnalysis && (
        <div className="fixed top-4 right-4">
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Generating your personalized financial analysis...
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <HomePage />
    </SessionContextProvider>
  );
}
