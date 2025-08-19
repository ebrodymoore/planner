'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import OnboardingWizard from '@/components/OnboardingWizard';
import FinancialPlan from '@/components/FinancialPlan';
import AuthComponent from '@/components/AuthComponent';
import LandingPage from '@/components/LandingPage';
import PlanSelector from '@/components/PlanSelector';
import QuickPlanWizard, { QuickPlanData } from '@/components/QuickPlanWizard';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { useUser } from '@supabase/auth-helpers-react';
import { FormData } from '@/types/financial';
import { AlertTriangle, Loader2, Upload, Download } from 'lucide-react';

function HomePage() {
  const user = useUser();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'landing' | 'selector' | 'quick-plan' | 'questionnaire' | 'plan'>('landing');
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [isUploadingJSON, setIsUploadingJSON] = useState(false);
  
  const {
    questionnaireData,
    analysisResults,
    isLoadingQuestionnaire,
    isLoadingAnalysis,
    isGeneratingAnalysis,
    generateNewAnalysis,
    saveQuestionnaireData,
    error,
    clearError
  } = useFinancialPlan();

  // Handle questionnaire completion
  const handleComplete = async (data: FormData) => {
    try {
      await saveQuestionnaireData(data);
      
      // If user is not authenticated, show signup prompt before showing plan
      if (!user) {
        setShowSignupPrompt(true);
        return;
      }
      
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

  // Handle plan selection
  const handleSelectQuickPlan = () => {
    setCurrentView('quick-plan');
  };

  const handleSelectComprehensivePlan = () => {
    setCurrentView('questionnaire');
  };

  // Handle Quick Plan completion
  const handleQuickPlanComplete = async (data: QuickPlanData) => {
    try {
      // Convert QuickPlanData to FormData format for compatibility
      const formData: Partial<FormData> = {
        personal: {
          name: 'Quick Plan User',
          dateOfBirth: '', // Calculate from age if needed
          maritalStatus: 'unknown',
          dependents: 0,
          dependentAges: '',
          state: '',
          country: '',
          employmentStatus: data.employmentStatus,
          industry: '',
          profession: '',
          communicationMethod: '',
          meetingFrequency: ''
        },
        income: {
          annualIncome: data.annualHouseholdIncome,
          stability: '',
          growthExpectation: '',
          spouseIncome: 0,
          rentalIncome: 0,
          businessIncome: 0,
          investmentIncome: 0,
          otherIncome: 0,
          otherIncomeDescription: '',
          retirementAge: 65,
          majorIncomeChanges: ''
        },
        expenses: {
          housingType: 'unknown',
          housing: data.monthlyHousingCost,
          transportation: 0,
          travel: 0,
          recreation: 0,
          food: 0,
          healthcare: 0,
          shopping: 0,
          technology: 0,
          personalCare: 0,
          entertainment: 0,
          fixedVsVariableRatio: '',
          seasonalVariations: '',
          recentExpenseChanges: '',
          potentialReductions: ''
        },
        assets: {
          checking: 0,
          savings: data.currentSavings,
          emergencyTarget: data.emergencyFundCoverage,
          retirement401k: data.retirementBalance,
          ira: 0,
          taxableAccounts: 0,
          homeValue: 0
        },
        liabilities: {
          mortgageBalance: 0,
          mortgageRate: 0,
          mortgageYears: 0,
          autoLoans: [],
          creditCards: data.totalDebt > 0 ? [{
            name: 'Credit Cards (estimated)',
            balance: data.totalDebt,
            limit: data.totalDebt * 2,
            rate: 18
          }] : [],
          studentLoans: []
        },
        risk: {
          experienceLevel: data.riskTolerance,
          largestLoss: '',
          portfolioDrop: '',
          timeline: data.retirementTimeline
        }
      };

      await saveQuestionnaireData(formData as FormData);
      
      // If user is not authenticated, show signup prompt before showing plan
      if (!user) {
        setShowSignupPrompt(true);
        return;
      }
      
      await generateNewAnalysis();
      setCurrentView('plan');
    } catch (err) {
      console.error('Error completing Quick Plan:', err);
    }
  };

  const handleUpgradeToComprehensive = () => {
    setCurrentView('questionnaire');
  };

  // Handle navigation
  const handleBackToQuestionnaire = () => {
    setCurrentView('questionnaire');
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleGetStarted = () => {
    setCurrentView('selector');
  };

  const handleViewPlan = async () => {
    // If user is not authenticated, show signup prompt
    if (!user) {
      setShowSignupPrompt(true);
      return;
    }
    
    if (!analysisResults && questionnaireData) {
      await generateNewAnalysis();
    }
    setCurrentView('plan');
  };

  const handleUpdateData = async (data: FormData) => {
    await saveQuestionnaireData(data);
  };

  // Handle JSON file upload
  const handleJSONUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please upload a valid JSON file');
      return;
    }

    setIsUploadingJSON(true);
    clearError();

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Validate that it's financial data (basic check)
      if (typeof jsonData !== 'object' || jsonData === null) {
        throw new Error('Invalid JSON format - expected an object');
      }

      // Save the uploaded data
      await saveQuestionnaireData(jsonData as FormData);
      
      // Generate analysis automatically
      await generateNewAnalysis();
      
      // If user is not authenticated, show signup prompt before showing plan
      if (!user) {
        setShowSignupPrompt(true);
        return;
      }
      
      // Switch to plan view
      setCurrentView('plan');
      
    } catch (err) {
      console.error('Error uploading JSON:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload JSON file');
    } finally {
      setIsUploadingJSON(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  // Handle download sample JSON
  const handleDownloadSample = () => {
    const link = document.createElement('a');
    link.href = '/sample-financial-data.json';
    link.download = 'sample-financial-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check for auth errors in URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Check both URL params and hash params for auth errors
    const authErrorFlag = urlParams.get('auth_error') || hashParams.get('error');
    const errorParam = urlParams.get('error') || hashParams.get('error');
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
    
    if (authErrorFlag || errorParam) {
      let errorMessage = 'Authentication failed';
      
      if (errorDescription) {
        // Decode and format the error message
        const decodedError = decodeURIComponent(errorDescription);
        if (decodedError.includes('Database error granting user')) {
          errorMessage = 'Account creation failed due to a database error. Please try again or contact support if the issue persists.';
        } else if (decodedError.includes('server_error')) {
          errorMessage = 'Server error occurred during authentication. Please try again.';
        } else {
          errorMessage = decodedError;
        }
      } else if (errorParam === 'server_error') {
        errorMessage = 'Server error occurred during authentication. Please try again.';
      }
      
      // Navigate to sign-in with error info in URL
      const errorParams = new URLSearchParams({
        error: 'true',
        message: encodeURIComponent(errorMessage)
      });
      router.push(`/sign-in?${errorParams.toString()}`);
      
      // Clean up URL parameters
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('auth_error');
      cleanUrl.searchParams.delete('error');
      cleanUrl.searchParams.delete('error_code');
      cleanUrl.searchParams.delete('error_description');
      cleanUrl.hash = '';
      window.history.replaceState({}, '', cleanUrl.toString());
    }
  }, []);

  // Handle authentication and user flow
  React.useEffect(() => {
    if (user && questionnaireData && Object.keys(questionnaireData).length > 0) {
      // Existing user with data - take them to plan
      if (currentView === 'landing' || currentView === 'selector') {
        setCurrentView('plan');
      }
    } else if (!user && currentView === 'plan') {
      // Redirect to sign-in if trying to access plan without login
      router.push('/sign-in');
    } else if (!user && showSignupPrompt) {
      // Only redirect to sign-in when showSignupPrompt is true
      router.push('/sign-in');
      setShowSignupPrompt(false);
    }
  }, [user, questionnaireData, currentView, showSignupPrompt, router]);

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

  // Show landing page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen">
        <LandingPage 
          onGetStarted={handleGetStarted}
        />
      </div>
    );
  }

  // Redirect to sign-in if showing signup prompt
  if (!user && showSignupPrompt) {
    router.push('/sign-in');
    setShowSignupPrompt(false);
    return null;
  }

  // Show plan selector view
  if (currentView === 'selector') {
    return (
      <div className="min-h-screen">
        <PlanSelector 
          onSelectQuickPlan={handleSelectQuickPlan}
          onSelectComprehensivePlan={handleSelectComprehensivePlan}
          onSignIn={() => router.push('/sign-in')}
          onBackToHome={handleBackToLanding}
        />
      </div>
    );
  }

  // Show Quick Plan wizard view
  if (currentView === 'quick-plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <QuickPlanWizard 
          onComplete={handleQuickPlanComplete}
          onUpgradeToComprehensive={handleUpgradeToComprehensive}
          initialData={{}}
        />
        <div className="fixed bottom-6 left-6 space-y-3">
          <Button
            onClick={handleBackToSelector}
            variant="outline"
            className="bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 shadow-xl px-6 py-3"
          >
            ← Back to Plan Selection
          </Button>
          {!user && (
            <Button
              onClick={() => router.push('/sign-in')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl px-6 py-3"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show financial plan view
  if (currentView === 'plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <FinancialPlan 
          clientData={questionnaireData || {}}
          analysisResults={analysisResults}
          onUpdateData={handleUpdateData}
        />
        <div className="fixed bottom-6 right-6 space-y-3">
          <Button
            onClick={handleBackToSelector}
            variant="outline"
            className="bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 shadow-xl block w-full px-6 py-3"
          >
            Back to Plan Selection
          </Button>
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
      </div>
    );
  }

  // Show questionnaire view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <OnboardingWizard 
        onComplete={handleComplete}
        onSave={handleSave}
        initialData={questionnaireData || {}}
      />
      
      {/* Back to selector and auth buttons */}
      <div className="fixed bottom-6 left-6 space-y-3">
        <Button
          onClick={handleBackToSelector}
          variant="outline"
          className="bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 shadow-xl px-6 py-3"
        >
          ← Back to Plan Selection
        </Button>
        {!user && (
          <Button
            onClick={() => router.push('/sign-in')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl px-6 py-3"
          >
            Sign In to Save Progress
          </Button>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="fixed bottom-6 right-6 space-y-3">
        {/* JSON Upload and Sample Download Buttons */}
        <div className="space-y-3">
          {/* Download Sample Button */}
          <Button
            onClick={handleDownloadSample}
            variant="outline"
            className="bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 shadow-xl block w-full px-6 py-3"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Sample JSON
          </Button>
          
          {/* Upload JSON Button */}
          <div className="relative">
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleJSONUpload}
              className="hidden"
              id="json-upload"
              disabled={isUploadingJSON || isGeneratingAnalysis}
            />
            <Button
              onClick={() => document.getElementById('json-upload')?.click()}
              disabled={isUploadingJSON || isGeneratingAnalysis}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-xl block w-full px-6 py-3 disabled:opacity-50"
            >
              {isUploadingJSON ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading & Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload JSON & Generate Plan
                </>
              )}
            </Button>
          </div>
        </div>

        {questionnaireData && Object.keys(questionnaireData).length > 0 && (
          <Button
            onClick={handleViewPlan}
            disabled={isLoadingAnalysis}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl block w-full px-6 py-3 disabled:opacity-50"
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
            className="bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 shadow-xl block w-full px-6 py-3 disabled:opacity-50"
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
        <div className="fixed top-6 right-6">
          <Alert className="bg-white/90 backdrop-blur-xl border-gray-200/50 text-gray-800 shadow-xl">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <AlertDescription className="text-gray-600">
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
