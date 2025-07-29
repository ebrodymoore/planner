'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import OnboardingWizard from '@/components/OnboardingWizard';
import FinancialPlan from '@/components/FinancialPlan';
import AuthComponent from '@/components/AuthComponent';
import PlanSelector from '@/components/PlanSelector';
import QuickPlanWizard, { QuickPlanData } from '@/components/QuickPlanWizard';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { useUser } from '@supabase/auth-helpers-react';
import { FormData } from '@/types/financial';
import { AlertTriangle, Loader2, Upload, Download } from 'lucide-react';

function HomePage() {
  const user = useUser();
  const [currentView, setCurrentView] = useState<'selector' | 'quick-plan' | 'questionnaire' | 'plan'>('selector');
  const [isUploadingJSON, setIsUploadingJSON] = useState(false);
  
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

  const handleViewPlan = async () => {
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

  // TEMPORARILY DISABLED FOR TESTING - Show authentication if user not logged in
  // if (!user) {
  //   return <AuthComponent />;
  // }

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

  // Show plan selector view
  if (currentView === 'selector') {
    return (
      <div className="min-h-screen">
        <PlanSelector 
          onSelectQuickPlan={handleSelectQuickPlan}
          onSelectComprehensivePlan={handleSelectComprehensivePlan}
        />
      </div>
    );
  }

  // Show Quick Plan wizard view
  if (currentView === 'quick-plan') {
    return (
      <div className="min-h-screen bg-gray-50">
        <QuickPlanWizard 
          onComplete={handleQuickPlanComplete}
          onUpgradeToComprehensive={handleUpgradeToComprehensive}
          initialData={{}}
        />
        <div className="fixed bottom-4 left-4">
          <Button
            onClick={handleBackToSelector}
            variant="outline"
            className="bg-white shadow-lg"
          >
            ← Back to Plan Selection
          </Button>
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
            onClick={handleBackToSelector}
            variant="outline"
            className="bg-white shadow-lg block w-full"
          >
            Back to Plan Selection
          </Button>
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
      
      {/* Back to selector button */}
      <div className="fixed bottom-4 left-4">
        <Button
          onClick={handleBackToSelector}
          variant="outline"
          className="bg-white shadow-lg"
        >
          ← Back to Plan Selection
        </Button>
      </div>
      
      {/* Action buttons */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {/* JSON Upload and Sample Download Buttons */}
        <div className="space-y-2">
          {/* Download Sample Button */}
          <Button
            onClick={handleDownloadSample}
            variant="outline"
            className="bg-white hover:bg-gray-50 shadow-lg block w-full"
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
              className="bg-purple-600 hover:bg-purple-700 shadow-lg block w-full"
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
