'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { FinancialDataService, QuestionnaireResponse, FinancialAnalysis } from '@/services/financialDataService';
import { generateFinancialAnalysis } from '@/services/claudeFinancialAnalysis';
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

      // Prepare data for Claude API
      const claudeRequestData = FinancialDataService.prepareForClaudeAPI(questionnaireData);
      
      // Generate analysis using Claude
      const startTime = Date.now();
      const claudeResponse = await generateFinancialAnalysis(claudeRequestData);
      const responseTime = Date.now() - startTime;

      // Save analysis results to database
      const analysisResult = await FinancialDataService.saveAnalysisResults(
        user.id,
        questionnaireResponse.id,
        claudeRequestData,
        claudeResponse,
        'comprehensive'
      );

      if (!analysisResult) {
        throw new Error('Failed to save analysis results');
      }

      // Log API usage for cost tracking
      await FinancialDataService.logAPIUsage(
        user.id,
        'comprehensive_analysis',
        claudeResponse.usage?.total_tokens || 0,
        responseTime,
        true
      );

      // Create financial snapshot for historical tracking
      await FinancialDataService.createFinancialSnapshot(user.id, questionnaireData);

      setAnalysisResults(analysisResult);
      
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      
      // Log failed API usage
      if (user?.id) {
        await FinancialDataService.logAPIUsage(
          user.id,
          'comprehensive_analysis',
          0,
          0,
          false,
          err instanceof Error ? err.message : 'Unknown error'
        );
      }
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