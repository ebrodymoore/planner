'use client';

import { useState, useEffect } from 'react';
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
  const loadQuestionnaireData = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsLoadingQuestionnaire(true);
    setError(null);

    try {
      const response = await FinancialDataService.loadQuestionnaireResponse(user.id);
      
      if (response) {
        setQuestionnaireData(response.questionnaire_data);
      } else {
        setQuestionnaireData({});
      }
    } catch (err) {
      console.error('Error loading questionnaire data:', err);
      setError('Failed to load questionnaire data');
    } finally {
      setIsLoadingQuestionnaire(false);
    }
  };

  // Load existing analysis results
  const loadAnalysisResults = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsLoadingAnalysis(true);
    setError(null);

    try {
      const analysis = await FinancialDataService.getCurrentAnalysis(user.id);
      setAnalysisResults(analysis);
    } catch (err) {
      console.error('Error loading analysis results:', err);
      setError('Failed to load analysis results');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Generate new financial analysis using Claude AI
  const generateNewAnalysis = async () => {
    if (!user?.id || !questionnaireData) {
      setError('Missing user ID or questionnaire data');
      return;
    }

    setIsGeneratingAnalysis(true);
    setError(null);

    try {
      // First save/update questionnaire data
      const questionnaireResponse = await FinancialDataService.saveQuestionnaireResponse(
        user.id, 
        questionnaireData, 
        'completed'
      );

      if (!questionnaireResponse) {
        throw new Error('Failed to save questionnaire data');
      }

      // Generate comprehensive analysis using Claude API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          formData: questionnaireData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate Claude analysis');
      }

      const { analysis } = await response.json();
      
      if (!analysis) {
        throw new Error('No analysis returned from API');
      }

      // Create financial snapshot for historical tracking
      await FinancialDataService.createFinancialSnapshot(user.id, questionnaireData);

      // Set the analysis results (they're already saved by the API)
      setAnalysisResults(analysis);
      
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      
      // Error is already logged by ClaudeFinancialAnalysis service
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  // Save questionnaire data to database
  const saveQuestionnaireData = async (data: FormData) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await FinancialDataService.saveQuestionnaireResponse(
        user.id, 
        data, 
        'in_progress'
      );
      
      if (response) {
        setQuestionnaireData(data);
      } else {
        throw new Error('Failed to save questionnaire data');
      }
    } catch (err) {
      console.error('Error saving questionnaire data:', err);
      setError('Failed to save questionnaire data');
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Load data on user change
  useEffect(() => {
    if (user?.id) {
      loadQuestionnaireData();
      loadAnalysisResults();
    } else {
      // Clear data when user logs out
      setQuestionnaireData(null);
      setAnalysisResults(null);
    }
  }, [user?.id]);

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