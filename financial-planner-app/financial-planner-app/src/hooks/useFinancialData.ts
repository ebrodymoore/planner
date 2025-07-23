import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FinancialDataService, QuestionnaireResponse } from '@/services/financialDataService';
import { ClaudeFinancialAnalysis, AnalysisResponse } from '@/services/claudeFinancialAnalysis';
import { FormData } from '@/types/financial';

export interface UseFinancialDataReturn {
  // Data state
  formData: FormData;
  questionnaireResponse: QuestionnaireResponse | null;
  currentAnalysis: AnalysisResponse | null;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isAnalyzing: boolean;
  
  // Methods
  saveFormData: (data: FormData, status?: 'in_progress' | 'completed' | 'submitted') => Promise<void>;
  loadFormData: () => Promise<void>;
  generateAnalysis: () => Promise<void>;
  
  // Status
  completionStatus: 'in_progress' | 'completed' | 'submitted';
  overallProgress: number;
  lastSaved: Date | null;
  error: string | null;
}

export const useFinancialData = (): UseFinancialDataReturn => {
  const [user, setUser] = useState<any>(null);
  
  // State management
  const [formData, setFormData] = useState<FormData>({});
  const [questionnaireResponse, setQuestionnaireResponse] = useState<QuestionnaireResponse | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Status
  const [completionStatus, setCompletionStatus] = useState<'in_progress' | 'completed' | 'submitted'>('in_progress');
  const [overallProgress, setOverallProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load existing form data and analysis
   */
  const loadFormData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load questionnaire response
      const response = await FinancialDataService.loadQuestionnaireResponse(user.id);
      
      if (response) {
        setQuestionnaireResponse(response);
        setFormData(response.questionnaire_data);
        setCompletionStatus(response.completion_status);
        setOverallProgress(response.overall_progress);
        setLastSaved(new Date(response.updated_at));

        // Load current analysis if available
        const analysis = await FinancialDataService.getCurrentAnalysis(user.id);
        if (analysis) {
          // Parse the analysis data into our expected format
          const analysisResponse: AnalysisResponse = {
            summary: analysis.analysis_summary || '',
            recommendations: analysis.recommendations || [],
            risk_assessment: analysis.risk_assessment || {
              overall_risk_level: 'moderate',
              risk_factors: [],
              mitigation_strategies: [],
              insurance_gaps: [],
              emergency_fund_adequacy: 'adequate'
            },
            action_items: analysis.action_items || [],
            confidence_score: analysis.confidence_score || 0.8,
            follow_up_suggestions: []
          };
          setCurrentAnalysis(analysisResponse);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load financial data');
      console.error('Error loading financial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Save form data to Supabase
   */
  const saveFormData = useCallback(async (
    data: FormData, 
    status: 'in_progress' | 'completed' | 'submitted' = 'in_progress'
  ) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await FinancialDataService.saveQuestionnaireResponse(
        user.id,
        data,
        status
      );

      if (response) {
        setFormData(data);
        setQuestionnaireResponse(response);
        setCompletionStatus(status);
        setOverallProgress(response.overall_progress);
        setLastSaved(new Date());

        // Create financial snapshot for tracking
        if (status === 'completed' || status === 'submitted') {
          await FinancialDataService.createFinancialSnapshot(user.id, data);
        }
      } else {
        throw new Error('Failed to save questionnaire response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save financial data');
      console.error('Error saving financial data:', err);
    } finally {
      setIsSaving(false);
    }
  }, [user?.id]);

  /**
   * Generate financial analysis using Claude API
   */
  const generateAnalysis = useCallback(async () => {
    if (!user?.id || !formData || Object.keys(formData).length === 0) {
      setError('No data available for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResponse = await ClaudeFinancialAnalysis.generateComprehensiveAnalysis(
        user.id,
        formData,
        {
          type: 'comprehensive',
          priority: 'high'
        }
      );

      if (analysisResponse) {
        setCurrentAnalysis(analysisResponse);
      } else {
        throw new Error('Failed to generate financial analysis');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      console.error('Error generating analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [user?.id, formData]);

  /**
   * Auto-save functionality
   */
  useEffect(() => {
    if (!user?.id || Object.keys(formData).length === 0) return;

    const autoSaveTimer = setTimeout(() => {
      if (!isSaving) {
        saveFormData(formData, completionStatus);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formData, user?.id, isSaving, completionStatus, saveFormData]);

  /**
   * Get current user and load data on component mount
   */
  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadFormData();
    }
  }, [user?.id, loadFormData]);

  /**
   * Update form data helper
   */
  const updateFormData = useCallback((section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  return {
    // Data state
    formData,
    questionnaireResponse,
    currentAnalysis,
    
    // Loading states
    isLoading,
    isSaving,
    isAnalyzing,
    
    // Methods
    saveFormData,
    loadFormData,
    generateAnalysis,
    
    // Status
    completionStatus,
    overallProgress,
    lastSaved,
    error
  };
};

/**
 * Hook for managing individual form sections
 */
export const useFormSection = <T extends keyof FormData>(
  sectionKey: T,
  financialData: UseFinancialDataReturn
) => {
  const sectionData = financialData.formData[sectionKey];
  
  const updateSection = useCallback((data: FormData[T]) => {
    const updatedFormData = {
      ...financialData.formData,
      [sectionKey]: data
    };
    // This will trigger auto-save through the main hook
    financialData.saveFormData(updatedFormData, financialData.completionStatus);
  }, [sectionKey, financialData]);

  const updateField = useCallback((field: string, value: any) => {
    const updatedSectionData = {
      ...sectionData,
      [field]: value
    };
    updateSection(updatedSectionData);
  }, [sectionData, updateSection]);

  return {
    data: sectionData,
    updateSection,
    updateField,
    isLoading: financialData.isSaving
  };
};