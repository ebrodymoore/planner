'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { FinancialDataService, QuestionnaireResponse, FinancialAnalysis } from '@/services/financialDataService';
// Claude API calls are now handled through the API route
import { FormData } from '@/types/financial';

interface UseFinancialPlanReturn {
  // Data
  questionnaireData: FormData | null;
  analysisResults: FinancialAnalysis | null;
  
  // Loading states
  isLoadingQuestionnaire: boolean;
  isLoadingAnalysis: boolean;
  isGeneratingAnalysis: boolean;
  
  // Actions
  loadQuestionnaireData: () => Promise<void>;
  loadAnalysisResults: () => Promise<void>;
  generateNewAnalysis: () => Promise<void>;
  saveQuestionnaireData: (data: FormData) => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useFinancialPlan(): UseFinancialPlanReturn {
  const user = useUser();
  
  // State
  const [questionnaireData, setQuestionnaireData] = useState<FormData | null>(null);
  const [analysisResults, setAnalysisResults] = useState<FinancialAnalysis | null>(null);
  const [isLoadingQuestionnaire, setIsLoadingQuestionnaire] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load questionnaire data from database
  const loadQuestionnaireData = useCallback(async () => {
    console.log('🔍 [DEBUG] loadQuestionnaireData called, user:', user?.id);
    
    if (!user) {
      console.log('🔍 [DEBUG] No user, skipping database load');
      return;
    }
    
    setIsLoadingQuestionnaire(true);
    setError(null);

    try {
      console.log('🔍 [DEBUG] Calling FinancialDataService.loadQuestionnaireResponse...');
      const response = await FinancialDataService.loadQuestionnaireResponse(user.id);
      console.log('🔍 [DEBUG] Response from loadQuestionnaireResponse:', response);
      setQuestionnaireData(response?.questionnaire_data || {});
    } catch (err) {
      console.error('🔍 [DEBUG] Error loading questionnaire data:', err);
      console.error('🔍 [DEBUG] Error details:', {
        message: (err as any)?.message,
        code: (err as any)?.code,
        details: (err as any)?.details,
        hint: (err as any)?.hint
      });
      setError(`Failed to load questionnaire data: ${(err as any)?.message || 'Unknown error'}`);
    } finally {
      setIsLoadingQuestionnaire(false);
    }
  }, [user]);

  // Load existing analysis results
  const loadAnalysisResults = useCallback(async () => {
    console.log('🔍 [DEBUG] loadAnalysisResults called, user:', user?.id);
    
    if (!user) {
      console.log('🔍 [DEBUG] No user, skipping analysis load');
      return;
    }
    
    setIsLoadingAnalysis(true);
    setError(null);

    try {
      console.log('🔍 [DEBUG] Calling FinancialDataService.getCurrentAnalysis...');
      const data = await FinancialDataService.getCurrentAnalysis(user.id);
      console.log('🔍 [DEBUG] Response from getCurrentAnalysis:', data);
      setAnalysisResults(data);
    } catch (err) {
      console.error('🔍 [DEBUG] Error loading analysis results:', err);
      console.error('🔍 [DEBUG] Analysis error details:', {
        message: (err as any)?.message,
        code: (err as any)?.code,
        details: (err as any)?.details,
        hint: (err as any)?.hint
      });
      setError(`Failed to load analysis results: ${(err as any)?.message || 'Unknown error'}`);
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [user]);

  // Generate new financial analysis using Claude AI
  const generateNewAnalysis = async () => {
    if (!questionnaireData) {
      setError('Missing questionnaire data');
      return;
    }

    setIsGeneratingAnalysis(true);
    setError(null);

    try {
      // TEMPORARILY DISABLED FOR TESTING - Generate mock analysis
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis: any = {
        id: 'mock-analysis-1',
        user_id: 'test-user',
        analysis_date: new Date().toISOString(),
        claude_response: {
          executive_summary: 'Based on your financial profile, you have a solid foundation with $70,000 in total assets and moderate debt levels. Your primary focus should be on building emergency savings and optimizing debt payoff strategies.',
          key_recommendations: [
            'Build emergency fund to 6 months of expenses ($15,000)',
            'Pay off high-interest credit cards using debt avalanche method',
            'Increase 401k contribution to maximize employer match',
            'Consider debt consolidation for student loans'
          ]
        },
        structured_data: {
          debt_management: {
            total_debt: 30000,
            debt_to_income_ratio: 0.25,
            recommended_strategy: 'debt_avalanche',
            payoff_timeline: '24 months with extra payments',
            interest_savings: 5000,
            monthly_payment_plan: {
              'credit_card_1': 500,
              'credit_card_2': 300,
              'student_loan': 250
            }
          },
          action_items: {
            immediate: [
              'Set up automatic emergency fund transfer of $500/month',
              'Consolidate credit card debt to lowest rate card'
            ],
            short_term: [
              'Increase 401k contribution by 2%',
              'Research high-yield savings accounts'
            ],
            medium_term: [
              'Review insurance coverage',
              'Consider increasing income through side work'
            ]
          },
          cash_flow: {
            monthly_surplus: 800,
            projected_savings_rate: 0.15,
            optimization_opportunities: [
              'Reduce dining out by $200/month',
              'Switch to cheaper phone plan'
            ]
          }
        },
        recommendations: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to localStorage for persistence
      localStorage.setItem('financial-analysis-results', JSON.stringify(mockAnalysis));
      setAnalysisResults(mockAnalysis);
      
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  // Save questionnaire data to database
  const saveQuestionnaireData = async (data: FormData) => {
    // TEMPORARILY DISABLED FOR TESTING - Using localStorage instead
    try {
      localStorage.setItem('financial-planning-data', JSON.stringify(data));
      setQuestionnaireData(data);
    } catch (err) {
      console.error('Error saving questionnaire data:', err);
      setError('Failed to save questionnaire data');
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Load data on mount (temporarily disabled user dependency)
  // Load data when user becomes available
  useEffect(() => {
    if (user) {
      console.log('🔍 [DEBUG] User available, loading financial data for:', user.id);
      loadQuestionnaireData();
      loadAnalysisResults();
    } else {
      console.log('🔍 [DEBUG] No user available yet, waiting...');
    }
  }, [user, loadQuestionnaireData, loadAnalysisResults]);

  return {
    // Data
    questionnaireData,
    analysisResults,
    
    // Loading states
    isLoadingQuestionnaire,
    isLoadingAnalysis,
    isGeneratingAnalysis,
    
    // Actions
    loadQuestionnaireData,
    loadAnalysisResults,
    generateNewAnalysis,
    saveQuestionnaireData,
    
    // Error handling
    error,
    clearError
  };
}