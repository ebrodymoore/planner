'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import FinancialPlan from '@/components/FinancialPlan';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
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


  // Check if user has no questionnaire data
  const hasNoData = !questionnaireData || Object.keys(questionnaireData).length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Show questionnaire selection alert if no data */}
      {hasNoData && (
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <Alert className="bg-blue-50 border-blue-200 mb-6">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-2">Welcome to your Financial Dashboard!</p>
                    <p>To get started with your personalized financial plan, please complete a questionnaire.</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            
            <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Choose Your Financial Planning Experience
                </CardTitle>
                <p className="text-gray-600">
                  Select the questionnaire that best fits your needs and time availability
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Quick Plan Option */}
                  <Card className="border-2 border-emerald-200 hover:border-emerald-300 transition-colors cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Loader2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Plan</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Get essential financial insights in just 5 minutes. Perfect for getting started quickly.
                        </p>
                        <Button 
                          onClick={() => router.push('/questionnaire/quick')}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          Start Quick Plan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comprehensive Plan Option */}
                  <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Comprehensive Plan</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Complete detailed analysis covering all aspects of your financial life. Takes 15-20 minutes.
                        </p>
                        <Button 
                          onClick={() => router.push('/questionnaire/comprehensive')}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Start Comprehensive Plan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Show normal financial plan if data exists */}
      {!hasNoData && (
        <FinancialPlan 
          clientData={questionnaireData}
          analysisResults={analysisResults}
          onUpdateData={handleUpdateData}
        />
      )}
      
      {/* Show action buttons only when user has data */}
      {!hasNoData && (
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
      )}
      
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