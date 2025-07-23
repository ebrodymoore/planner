import { supabase } from '@/lib/supabase';
import { FormData } from '@/types/financial';

export interface QuestionnaireResponse {
  id: string;
  user_id: string;
  form_version: string;
  questionnaire_data: FormData;
  completion_status: 'in_progress' | 'completed' | 'submitted';
  sections_completed: number[];
  overall_progress: number;
  last_section_completed: number;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

export interface FinancialAnalysis {
  id: string;
  user_id: string;
  questionnaire_id: string;
  analysis_type: string;
  claude_request_data: any;
  claude_response: any;
  analysis_summary: string | null;
  recommendations: any;
  risk_assessment: any;
  action_items: any;
  confidence_score: number | null;
  created_at: string;
  expires_at: string;
  is_current: boolean;
}

export class FinancialDataService {
  
  /**
   * Save or update questionnaire responses
   */
  static async saveQuestionnaireResponse(
    userId: string, 
    formData: FormData, 
    completionStatus: 'in_progress' | 'completed' | 'submitted' = 'in_progress'
  ): Promise<QuestionnaireResponse | null> {
    
    // Calculate completion metrics
    const sectionsCompleted = this.calculateCompletedSections(formData);
    const overallProgress = (sectionsCompleted.length / 16) * 100; // 16 total sections
    
    const questionnaireData = {
      user_id: userId,
      form_version: '2024.1',
      questionnaire_data: formData,
      completion_status: completionStatus,
      sections_completed: sectionsCompleted,
      overall_progress: overallProgress,
      last_section_completed: Math.max(...sectionsCompleted, 0),
      submitted_at: completionStatus === 'submitted' ? new Date().toISOString() : null
    };

    const { data, error } = await supabase
      .from('financial_questionnaire_responses')
      .upsert(questionnaireData, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving questionnaire response:', error);
      return null;
    }

    // Also update legacy tables for backward compatibility
    await this.updateLegacyTables(userId, formData);
    
    return data;
  }

  /**
   * Load user's questionnaire response
   */
  static async loadQuestionnaireResponse(userId: string): Promise<QuestionnaireResponse | null> {
    const { data, error } = await supabase
      .from('financial_questionnaire_responses')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error loading questionnaire response:', error);
      return null;
    }

    return data;
  }

  /**
   * Prepare data for Claude API analysis
   */
  static prepareForClaudeAPI(formData: FormData): any {
    // Clean and structure data specifically for Claude API
    const claudeData = {
      client_profile: {
        personal: this.sanitizePersonalData(formData.personal),
        financial_situation: {
          income: this.calculateTotalIncome(formData.income),
          expenses: this.calculateTotalExpenses(formData.expenses),
          assets: this.calculateTotalAssets(formData.assets),
          liabilities: this.calculateTotalLiabilities(formData.liabilities),
          net_worth: this.calculateNetWorth(formData.assets, formData.liabilities)
        },
        goals_and_priorities: this.extractGoalsAndPriorities(formData.goals, formData.preferences),
        risk_profile: formData.risk,
        behavioral_profile: this.extractBehavioralInsights(formData.behavioral),
        tax_situation: this.extractTaxSituation(formData.taxSituation),
        insurance_coverage: this.extractInsuranceCoverage(formData.insurance),
        estate_planning: formData.estatePlanning,
        career_and_life_planning: this.extractCareerPlanning(formData.lifeCareer),
        cash_flow_analysis: this.extractCashFlowMetrics(formData.cashFlow)
      },
      analysis_context: {
        form_completion_date: new Date().toISOString(),
        data_completeness_score: this.calculateDataCompleteness(formData),
        primary_concerns: this.identifyPrimaryConcerns(formData),
        complexity_indicators: this.assessFinancialComplexity(formData)
      },
      analysis_request: {
        type: 'comprehensive_financial_plan',
        focus_areas: this.determineFocusAreas(formData),
        priority_level: 'high',
        detail_level: 'professional'
      }
    };

    return claudeData;
  }

  /**
   * Save Claude API analysis results
   */
  static async saveAnalysisResults(
    userId: string,
    questionnaireId: string,
    claudeRequest: any,
    claudeResponse: any,
    analysisType: string = 'comprehensive'
  ): Promise<FinancialAnalysis | null> {
    
    // Extract structured data from Claude response
    const structuredRecommendations = this.extractRecommendations(claudeResponse);
    const riskAssessment = this.extractRiskAssessment(claudeResponse);
    const actionItems = this.extractActionItems(claudeResponse);
    const confidenceScore = this.assessConfidenceScore(claudeResponse);

    const analysisData = {
      user_id: userId,
      questionnaire_id: questionnaireId,
      analysis_type: analysisType,
      claude_request_data: claudeRequest,
      claude_response: claudeResponse,
      analysis_summary: this.extractSummary(claudeResponse),
      recommendations: structuredRecommendations,
      risk_assessment: riskAssessment,
      action_items: actionItems,
      confidence_score: confidenceScore,
      is_current: true
    };

    // Mark previous analyses as not current
    await supabase
      .from('financial_analysis')
      .update({ is_current: false })
      .eq('user_id', userId);

    const { data, error } = await supabase
      .from('financial_analysis')
      .insert(analysisData)
      .select()
      .single();

    if (error) {
      console.error('Error saving analysis results:', error);
      return null;
    }

    return data;
  }

  /**
   * Get current financial analysis
   */
  static async getCurrentAnalysis(userId: string): Promise<FinancialAnalysis | null> {
    const { data, error } = await supabase
      .from('financial_analysis')
      .select('*')
      .eq('user_id', userId)
      .eq('is_current', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading current analysis:', error);
      return null;
    }

    return data;
  }

  /**
   * Log API usage for cost tracking
   */
  static async logAPIUsage(
    userId: string,
    requestType: string,
    tokensUsed: number,
    responseTimeMs: number,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    const costEstimate = this.estimateAPIcost(tokensUsed);

    await supabase
      .from('claude_api_log')
      .insert({
        user_id: userId,
        request_type: requestType,
        tokens_used: tokensUsed,
        cost_estimate: costEstimate,
        response_time_ms: responseTimeMs,
        success: success,
        error_message: errorMessage
      });
  }

  /**
   * Create financial snapshot for tracking over time
   */
  static async createFinancialSnapshot(userId: string, formData: FormData): Promise<void> {
    const snapshot = {
      user_id: userId,
      snapshot_date: new Date().toISOString().split('T')[0],
      net_worth: this.calculateNetWorth(formData.assets, formData.liabilities),
      liquid_assets: this.calculateLiquidAssets(formData.assets),
      monthly_income: this.calculateMonthlyIncome(formData.income),
      monthly_expenses: this.calculateMonthlyExpenses(formData.expenses),
      debt_to_income_ratio: this.calculateDebtToIncomeRatio(formData.income, formData.liabilities),
      savings_rate: this.calculateSavingsRate(formData.income, formData.expenses),
      emergency_fund_months: this.calculateEmergencyFundMonths(formData.assets, formData.expenses),
      retirement_on_track: this.assessRetirementProgress(formData),
      calculated_data: {
        total_debt: this.calculateTotalDebt(formData.liabilities),
        investment_allocation: this.calculateInvestmentAllocation(formData.assets),
        insurance_coverage_adequacy: this.assessInsuranceCoverage(formData.insurance, formData.income),
        tax_efficiency_score: this.calculateTaxEfficiencyScore(formData.taxSituation)
      }
    };

    await supabase
      .from('financial_snapshots')
      .insert(snapshot);
  }

  // ===== PRIVATE HELPER METHODS =====

  private static calculateCompletedSections(formData: FormData): number[] {
    const sections = [
      'personal', 'income', 'expenses', 'assets', 'liabilities', 
      'goals', 'preferences', 'risk', 'employerBenefits', 'insurance',
      'taxSituation', 'estatePlanning', 'behavioral', 'cashFlow', 
      'lifeCareer', 'investmentPhilosophy'
    ];

    return sections
      .map((section, index) => {
        const sectionData = formData[section as keyof FormData];
        return sectionData && Object.keys(sectionData).length > 0 ? index : null;
      })
      .filter(index => index !== null) as number[];
  }

  private static calculateTotalIncome(income?: any): number {
    if (!income) return 0;
    return (income.annualIncome || 0) + 
           (income.spouseIncome || 0) + 
           (income.businessIncome || 0) + 
           (income.investmentIncome || 0) + 
           (income.rentalIncome || 0) +
           (income.otherIncome || 0);
  }

  private static calculateNetWorth(assets?: any, liabilities?: any): number {
    const totalAssets = this.calculateTotalAssets(assets);
    const totalLiabilities = this.calculateTotalLiabilities(liabilities);
    return totalAssets - totalLiabilities;
  }

  private static calculateTotalAssets(assets?: any): number {
    if (!assets) return 0;
    return (assets.checking || 0) + 
           (assets.savings || 0) + 
           (assets.retirement401k || 0) + 
           (assets.ira || 0) + 
           (assets.taxableAccounts || 0) + 
           (assets.homeValue || 0);
  }

  private static calculateTotalLiabilities(liabilities?: any): number {
    if (!liabilities) return 0;
    let total = liabilities.mortgageBalance || 0;
    
    if (liabilities.autoLoans) {
      total += liabilities.autoLoans.reduce((sum: number, loan: any) => sum + (loan.balance || 0), 0);
    }
    
    if (liabilities.creditCards) {
      total += liabilities.creditCards.reduce((sum: number, card: any) => sum + (card.balance || 0), 0);
    }
    
    if (liabilities.studentLoans) {
      total += liabilities.studentLoans.reduce((sum: number, loan: any) => sum + (loan.balance || 0), 0);
    }
    
    return total;
  }

  private static estimateAPIcost(tokensUsed: number): number {
    // Estimate based on Claude pricing (adjust as needed)
    const costPerToken = 0.0000025; // Example rate
    return tokensUsed * costPerToken;
  }

  private static sanitizePersonalData(personal?: any): any {
    if (!personal) return {};
    return {
      age: this.calculateAge(personal.dateOfBirth),
      marital_status: personal.maritalStatus,
      dependents: personal.dependents,
      employment_status: personal.employmentStatus,
      industry: personal.industry,
      state: personal.state,
      // Exclude PII like name, exact date of birth
    };
  }

  private static calculateAge(dateOfBirth?: string): number {
    if (!dateOfBirth) return 0;
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  private static calculateDataCompleteness(formData: FormData): number {
    const totalSections = 16;
    const completedSections = this.calculateCompletedSections(formData).length;
    return (completedSections / totalSections) * 100;
  }

  private static extractSummary(claudeResponse: any): string {
    // Extract key summary from Claude response
    // Implementation depends on Claude response format
    return claudeResponse?.analysis_summary || 'Analysis completed';
  }

  private static extractRecommendations(claudeResponse: any): any {
    // Structure recommendations from Claude response
    return claudeResponse?.recommendations || {};
  }

  private static extractActionItems(claudeResponse: any): any {
    // Extract prioritized action items
    return claudeResponse?.action_items || [];
  }

  private static assessConfidenceScore(claudeResponse: any): number {
    // Assess AI confidence in the analysis
    return claudeResponse?.confidence_score || 0.8;
  }

  private static async updateLegacyTables(userId: string, formData: FormData): Promise<void> {
    // Update existing normalized tables for backward compatibility
    // This maintains the existing structure while adding new capabilities
    
    if (formData.personal) {
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...formData.personal,
          date_of_birth: formData.personal.dateOfBirth
        }, { onConflict: 'user_id' });
    }

    if (formData.income) {
      await supabase
        .from('client_income')
        .upsert({
          user_id: userId,
          annual_gross: formData.income.annualIncome,
          stability: formData.income.stability,
          spouse_income: formData.income.spouseIncome,
          rental_income: formData.income.rentalIncome,
          investment_income: formData.income.investmentIncome
        }, { onConflict: 'user_id' });
    }

    // Continue for other sections as needed...
  }

  // Additional helper methods for data processing...
  private static calculateTotalExpenses(_expenses?: any): number { return 0; }
  private static extractGoalsAndPriorities(_goals?: any, _preferences?: any): any { return {}; }
  private static extractBehavioralInsights(_behavioral?: any): any { return {}; }
  private static extractTaxSituation(_taxSituation?: any): any { return {}; }
  private static extractInsuranceCoverage(_insurance?: any): any { return {}; }
  private static extractCareerPlanning(_lifeCareer?: any): any { return {}; }
  private static extractCashFlowMetrics(_cashFlow?: any): any { return {}; }
  private static identifyPrimaryConcerns(_formData: FormData): string[] { return []; }
  private static assessFinancialComplexity(_formData: FormData): any { return {}; }
  private static determineFocusAreas(_formData: FormData): string[] { return []; }
  private static extractRiskAssessment(claudeResponse: any): any { return {}; }
  private static calculateLiquidAssets(assets?: any): number { return 0; }
  private static calculateMonthlyIncome(income?: any): number { return 0; }
  private static calculateMonthlyExpenses(expenses?: any): number { return 0; }
  private static calculateDebtToIncomeRatio(income?: any, liabilities?: any): number { return 0; }
  private static calculateSavingsRate(income?: any, expenses?: any): number { return 0; }
  private static calculateEmergencyFundMonths(assets?: any, expenses?: any): number { return 0; }
  private static assessRetirementProgress(formData: FormData): boolean { return false; }
  private static calculateTotalDebt(liabilities?: any): number { return 0; }
  private static calculateInvestmentAllocation(assets?: any): any { return {}; }
  private static assessInsuranceCoverage(insurance?: any, income?: any): number { return 0; }
  private static calculateTaxEfficiencyScore(taxSituation?: any): number { return 0; }
}