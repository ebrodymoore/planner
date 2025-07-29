'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SessionContextProvider, useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import FinancialPlan from '@/components/FinancialPlan';
import AuthComponent from '@/components/AuthComponent';
import { TestUserService } from '@/services/testUserService';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { FormData } from '@/types/financial';
import { AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';

function TestPlanPage() {
  const user = useUser();
  const [testData, setTestData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    analysisResults,
    isGeneratingAnalysis,
    generateNewAnalysis,
    saveQuestionnaireData,
    error: planError,
    clearError
  } = useFinancialPlan();

  useEffect(() => {
    const loadTestData = async () => {
      if (user) {
        try {
          setLoading(true);
          const userData = await TestUserService.getTestUserData(user.id);
          setTestData(userData);
          
          if (userData) {
            // Save the test data to the hook
            await saveQuestionnaireData(userData);
          }
        } catch (err) {
          console.error('Error loading test data:', err);
          setError('Failed to load test data');
        } finally {
          setLoading(false);
        }
      }
    };

    loadTestData();
  }, [user, saveQuestionnaireData]);

  const handleGenerateAnalysis = async () => {
    if (testData) {
      try {
        await generateNewAnalysis();
      } catch (err) {
        console.error('Error generating analysis:', err);
        setError('Failed to generate analysis');
      }
    }
  };

  const handleUpdateData = async (data: FormData) => {
    await saveQuestionnaireData(data);
    setTestData(data);
  };

  const handleBackToLogin = () => {
    supabase.auth.signOut();
    window.location.href = '/';
  };

  // Show authentication if user not logged in
  if (!user) {
    return <AuthComponent />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading test financial data...</p>
        </div>
      </div>
    );
  }

  // Show error if exists
  if (error || planError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || planError}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center space-x-4">
            <Button onClick={clearError} variant="outline">
              Try Again
            </Button>
            <Button onClick={handleBackToLogin} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no test data
  if (!testData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <Alert>
            <AlertDescription>
              No test data found. Creating sample EBM data...
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Test Financial Plan - EBM
            </h1>
            <p className="text-gray-600">
              Testing the financial planning system with sample data
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {!analysisResults && (
              <Button
                onClick={handleGenerateAnalysis}
                disabled={isGeneratingAnalysis}
                className="bg-blue-600 hover:bg-blue-700"
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
            <Button onClick={handleBackToLogin} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Plan */}
      <FinancialPlan 
        clientData={testData}
        analysisResults={analysisResults}
        onUpdateData={handleUpdateData}
      />

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

export default function TestPlanPageWrapper() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TestPlanPage />
    </SessionContextProvider>
  );
}