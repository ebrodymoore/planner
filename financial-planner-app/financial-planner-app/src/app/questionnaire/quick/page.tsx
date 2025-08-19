'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import QuickPlanWizard, { QuickPlanData } from '@/components/QuickPlanWizard';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/financial';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import AuthGuard from '@/components/AuthGuard';

function QuickPlanContent() {
  const router = useRouter();
  const { saveQuestionnaireData, generateNewAnalysis } = useFinancialPlan();

  const handleQuickPlanComplete = async (data: QuickPlanData) => {
    try {
      // Convert QuickPlanData to FormData format for compatibility
      const formData: Partial<FormData> = {
        personal: {
          name: 'Quick Plan User',
          dateOfBirth: '',
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
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error completing Quick Plan:', err);
    }
  };

  const handleUpgradeToComprehensive = () => {
    router.push('/questionnaire/comprehensive');
  };

  const handleBackToSelector = () => {
    router.push('/questionnaire');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <QuickPlanWizard 
        onComplete={handleQuickPlanComplete}
        onUpgradeToComprehensive={handleUpgradeToComprehensive}
        initialData={{}}
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

export default function QuickPlanPage() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthGuard 
        requireAuth={true} 
        redirectTo="/sign-in"
        loadingMessage="Loading quick questionnaire..."
      >
        <QuickPlanContent />
      </AuthGuard>
    </SessionContextProvider>
  );
}