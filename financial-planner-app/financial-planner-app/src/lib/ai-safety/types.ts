// Core types for AI safety and validation system

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: number;
}

export interface CompressedFinancialData {
  // Core metrics only (no verbose form data)
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  debtToIncomeRatio: number;
  savingsRate: number;
  emergencyFundMonths: number;
  retirementSavingsRatio: number;
  age: number;
  yearsToRetirement: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  primaryGoal: string;
  hasHighValueAssets: boolean;
  hasComplexDebts: boolean;
}

export interface FinancialConstraints {
  emergencyFund: {
    minMonths: number;
    maxMonths: number;
    recommendedRange: [number, number];
  };
  debtToIncome: {
    maxRatio: number;
    warningThreshold: number;
  };
  savingsRate: {
    minRecommended: number;
    maxRealistic: number;
  };
  assetAllocation: {
    maxStockPercentage: number;
    minBondPercentage: number;
    maxCashPercentage: number;
  };
  income: {
    minAnnual: number;
    maxAnnual: number;
  };
  age: {
    minAge: number;
    maxAge: number;
  };
}

export interface AIResponseMetadata {
  source: 'AI_GENERATED' | 'RULE_BASED' | 'HYBRID';
  timestamp: string;
  confidence: number;
  tokenUsage: number;
  processingTime: number;
  validationsPassed: number;
  totalValidations: number;
  requiresHumanReview: boolean;
}

export interface AnalysisResult {
  emergency_fund: {
    current_months: number;
    recommended_amount: number;
    priority: 'high' | 'medium' | 'low';
    reasoning: string;
  };
  debt_strategy: {
    recommended_method: 'avalanche' | 'snowball' | 'hybrid';
    payoff_timeline: string;
    priority_debts: string[];
    estimated_savings: number;
  };
  retirement_readiness: {
    score: number;
    on_track: boolean;
    additional_monthly_needed: number;
    projected_retirement_income: number;
    confidence_level: number;
  };
  asset_allocation: {
    recommended_stocks: number;
    recommended_bonds: number;
    recommended_cash: number;
    rebalancing_needed: boolean;
  };
  action_items: {
    immediate: string[];
    short_term: string[];
    medium_term: string[];
    long_term: string[];
  };
  risk_warnings: string[];
  disclaimers: string[];
  metadata: AIResponseMetadata;
}

export interface MonitoringMetrics {
  responseTime: number;
  tokenUsage: number;
  validationsPassed: number;
  userSatisfaction?: number;
  hallucinationFlags: HallucinationFlag[];
  costEstimate: number;
}

export interface HallucinationFlag {
  type: 'unrealistic_amount' | 'impossible_timeline' | 'contradictory_advice' | 'off_topic' | 'product_recommendation';
  severity: 'low' | 'medium' | 'high';
  description: string;
  field: string;
  value: any;
}

export interface UserFeedback {
  rating: number; // 1-5
  helpful: boolean;
  accurate: boolean;
  comments?: string;
  flagged_content?: string;
}

export type PlanSection = 
  | 'emergency_fund'
  | 'debt_management' 
  | 'retirement_planning'
  | 'asset_allocation'
  | 'risk_assessment'
  | 'tax_strategy'
  | 'insurance_review'
  | 'goal_planning';

export interface SectionAnalysisConfig {
  maxTokens: number;
  requiredFields: string[];
  validationRules: ValidationRule[];
  fallbackEnabled: boolean;
}

export interface ValidationRule {
  field: string;
  type: 'range' | 'enum' | 'format' | 'logical' | 'custom';
  constraint: any;
  errorMessage: string;
  severity: 'error' | 'warning';
}

export interface CacheEntry {
  dataHash: string;
  analysis: AnalysisResult;
  timestamp: number;
  hitCount: number;
  lastAccessed: number;
}

export interface AnalysisTier {
  name: 'basic' | 'standard' | 'comprehensive';
  sections: PlanSection[];
  maxTokens: number;
  cacheEnabled: boolean;
  humanReviewRequired: boolean;
}