'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Refs to prevent duplicate loading
  const hasLoadedDataForUser = useRef<string | null>(null);
  const isCurrentlyLoading = useRef(false);

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
    const requestId = Date.now().toString();
    console.log(`📡 [HOOK-${requestId}] Starting analysis generation process`);
    
    if (!questionnaireData) {
      console.log(`📡 [HOOK-${requestId}] ERROR: Missing questionnaire data`);
      setError('Missing questionnaire data');
      return;
    }

    if (!user) {
      console.log(`📡 [HOOK-${requestId}] ERROR: User not authenticated`);
      setError('User not authenticated');
      return;
    }

    console.log(`📡 [HOOK-${requestId}] Pre-flight checks passed:`, {
      userId: user.id,
      hasQuestionnaireData: !!questionnaireData,
      questionnaireDataKeys: Object.keys(questionnaireData),
      questionnaireDataSize: JSON.stringify(questionnaireData).length
    });

    setIsGeneratingAnalysis(true);
    setError(null);

    try {
      console.log(`📡 [HOOK-${requestId}] Preparing request payload...`);
      
      const requestPayload = {
        userId: user.id,
        formData: questionnaireData
      };
      
      console.log(`📡 [HOOK-${requestId}] Request payload prepared:`, {
        userId: requestPayload.userId,
        formDataKeys: Object.keys(requestPayload.formData),
        payloadSize: JSON.stringify(requestPayload).length
      });
      
      console.log(`📡 [HOOK-${requestId}] Making fetch request to /api/analyze...`);
      
      // Call the Claude API through our backend endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      console.log(`📡 [HOOK-${requestId}] Fetch response received:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        console.log(`📡 [HOOK-${requestId}] Response not OK, attempting to read error details...`);
        
        let errorDetails;
        try {
          errorDetails = await response.text();
          console.log(`📡 [HOOK-${requestId}] Error response body:`, errorDetails);
        } catch (readError) {
          console.log(`📡 [HOOK-${requestId}] Failed to read error response:`, readError);
          errorDetails = 'Unable to read error details';
        }
        
        const errorMessage = `Analysis API call failed: ${response.status} ${response.statusText}`;
        console.log(`📡 [HOOK-${requestId}] Throwing error:`, errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`📡 [HOOK-${requestId}] Reading successful response...`);
      
      const result = await response.json();
      
      console.log(`📡 [HOOK-${requestId}] Response parsed successfully:`, {
        resultType: typeof result,
        resultKeys: result ? Object.keys(result) : 'null',
        hasAnalysis: !!result
      });
      
      // The API should return the saved analysis from the database
      setAnalysisResults(result);
      
      console.log(`📡 [HOOK-${requestId}] Analysis generation completed successfully`);
      
    } catch (err) {
      console.error(`📡 [HOOK-${requestId}] CRITICAL ERROR during analysis generation:`, {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace',
        type: typeof err,
        errorObject: err
      });
      
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      throw err; // Re-throw to let the calling component handle it
    } finally {
      console.log(`📡 [HOOK-${requestId}] Setting isGeneratingAnalysis to false`);
      setIsGeneratingAnalysis(false);
    }
  };

  // Save questionnaire data to database and generate fresh analysis
  const saveQuestionnaireData = async (data: FormData) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      console.log('💾 [DEBUG] Saving questionnaire data to database for user:', user.id);
      await FinancialDataService.saveQuestionnaireResponse(user.id, data);
      setQuestionnaireData(data);
      console.log('💾 [DEBUG] Successfully saved questionnaire data');
      
      // Auto-generate fresh analysis with updated data
      console.log('💾 [DEBUG] Auto-generating fresh analysis with updated data...');
      await generateNewAnalysis();
      console.log('💾 [DEBUG] Fresh analysis generated successfully');
    } catch (err) {
      console.error('💾 [DEBUG] Error saving questionnaire data or generating analysis:', err);
      setError(`Failed to save questionnaire data: ${(err as any)?.message || 'Unknown error'}`);
      throw err; // Re-throw to let the calling component handle it
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Load data when user becomes available (optimized to prevent duplicates)
  useEffect(() => {
    const userId = user?.id;
    
    if (!userId) {
      console.log('🔍 [DEBUG] No user available yet, waiting...');
      hasLoadedDataForUser.current = null;
      return;
    }

    // Skip if we've already loaded data for this user or currently loading
    if (hasLoadedDataForUser.current === userId || isCurrentlyLoading.current) {
      return;
    }

    console.log('🔍 [DEBUG] User available, loading financial data for:', userId);
    isCurrentlyLoading.current = true;
    hasLoadedDataForUser.current = userId;
    
    // Load data
    Promise.all([
      loadQuestionnaireData(),
      loadAnalysisResults()
    ]).finally(() => {
      isCurrentlyLoading.current = false;
    });
    
  }, [user?.id, loadQuestionnaireData, loadAnalysisResults]);

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