// Comprehensive AI response validation and hallucination detection

import { 
  AnalysisResult, 
  CompressedFinancialData, 
  HallucinationFlag, 
  ValidationResult,
  MonitoringMetrics 
} from './types';
import { FINANCIAL_CONSTRAINTS } from './constraints';

export class AIResponseValidator {
  /**
   * Validates AI response for hallucinations, safety, and accuracy
   */
  static validateAIResponse(
    response: any, 
    inputData: CompressedFinancialData
  ): ValidationResult & { 
    hallucinationFlags: HallucinationFlag[];
    requiresHumanReview: boolean;
    safetyScore: number;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const hallucinationFlags: HallucinationFlag[] = [];
    
    // Core validation checks
    const structureValid = this.validateResponseStructure(response, errors);
    const amountsValid = this.validateFinancialAmounts(response, inputData, errors, warnings);
    const logicValid = this.validateLogicalConsistency(response, inputData, errors, warnings);
    
    // Hallucination detection
    hallucinationFlags.push(...this.detectUnrealisticAmounts(response, inputData));
    hallucinationFlags.push(...this.detectImpossibleTimelines(response));
    hallucinationFlags.push(...this.detectContradictoryAdvice(response, inputData));
    hallucinationFlags.push(...this.detectProhibitedContent(response));
    hallucinationFlags.push(...this.detectOffTopicContent(response));
    
    // Safety and compliance checks
    const safetyChecks = this.performSafetyValidation(response, inputData);
    errors.push(...safetyChecks.errors);
    warnings.push(...safetyChecks.warnings);
    
    const safetyScore = this.calculateSafetyScore(response, hallucinationFlags);
    const requiresHumanReview = this.shouldRequireHumanReview(
      response, 
      inputData, 
      hallucinationFlags, 
      safetyScore
    );
    
    const confidence = this.calculateConfidence(
      structureValid, 
      amountsValid, 
      logicValid, 
      hallucinationFlags.length,
      safetyScore
    );

    return {
      isValid: errors.length === 0 && hallucinationFlags.filter(f => f.severity === 'high').length === 0,
      errors,
      warnings,
      confidence,
      hallucinationFlags,
      requiresHumanReview,
      safetyScore
    };
  }

  /**
   * Detects unrealistic financial amounts
   */
  private static detectUnrealisticAmounts(
    response: any, 
    inputData: CompressedFinancialData
  ): HallucinationFlag[] {
    const flags: HallucinationFlag[] = [];

    // Emergency fund checks
    if (response.emergency_fund?.recommended_amount) {
      const recommended = response.emergency_fund.recommended_amount;
      const annualIncome = inputData.monthlyIncome * 12;
      
      if (recommended > annualIncome) {
        flags.push({
          type: 'unrealistic_amount',
          severity: 'high',
          description: 'Emergency fund recommendation exceeds annual income',
          field: 'emergency_fund.recommended_amount',
          value: recommended
        });
      }
      
      if (recommended > inputData.monthlyExpenses * FINANCIAL_CONSTRAINTS.emergencyFund.maxMonths) {
        flags.push({
          type: 'unrealistic_amount',
          severity: 'medium',
          description: 'Emergency fund exceeds maximum recommended months',
          field: 'emergency_fund.recommended_amount',
          value: recommended
        });
      }
    }

    // Retirement income checks
    if (response.retirement_readiness?.projected_retirement_income) {
      const projected = response.retirement_readiness.projected_retirement_income;
      const currentIncome = inputData.monthlyIncome * 12;
      
      if (projected > currentIncome * 1.5) {
        flags.push({
          type: 'unrealistic_amount',
          severity: 'medium',
          description: 'Projected retirement income exceeds 150% of current income',
          field: 'retirement_readiness.projected_retirement_income',
          value: projected
        });
      }
    }

    // Additional monthly savings checks
    if (response.retirement_readiness?.additional_monthly_needed) {
      const additional = response.retirement_readiness.additional_monthly_needed;
      
      if (additional > inputData.monthlyIncome * 0.8) {
        flags.push({
          type: 'unrealistic_amount',
          severity: 'high',
          description: 'Additional savings needed exceeds 80% of monthly income',
          field: 'retirement_readiness.additional_monthly_needed',
          value: additional
        });
      }
    }

    return flags;
  }

  /**
   * Detects impossible or unrealistic timelines
   */
  private static detectImpossibleTimelines(response: any): HallucinationFlag[] {
    const flags: HallucinationFlag[] = [];

    if (response.debt_strategy?.payoff_timeline) {
      const timeline = response.debt_strategy.payoff_timeline.toLowerCase();
      
      // Extract numbers and time units
      const timelineRegex = /(\d+)\s*(year|month|week|day)/gi;
      const matches = [...timeline.matchAll(timelineRegex)];
      
      for (const match of matches) {
        const amount = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        
        let totalMonths = 0;
        if (unit.startsWith('year')) totalMonths = amount * 12;
        else if (unit.startsWith('month')) totalMonths = amount;
        else if (unit.startsWith('week')) totalMonths = amount / 4.33;
        else if (unit.startsWith('day')) totalMonths = amount / 30;
        
        if (totalMonths > 600) { // 50 years
          flags.push({
            type: 'impossible_timeline',
            severity: 'medium',
            description: 'Debt payoff timeline exceeds reasonable limits (50+ years)',
            field: 'debt_strategy.payoff_timeline',
            value: timeline
          });
        }
        
        if (totalMonths < 1 && unit.startsWith('month')) {
          flags.push({
            type: 'impossible_timeline',
            severity: 'low',
            description: 'Unrealistically short timeline for debt payoff',
            field: 'debt_strategy.payoff_timeline',
            value: timeline
          });
        }
      }
    }

    return flags;
  }

  /**
   * Detects contradictory financial advice
   */
  private static detectContradictoryAdvice(
    response: any, 
    inputData: CompressedFinancialData
  ): HallucinationFlag[] {
    const flags: HallucinationFlag[] = [];

    // Check asset allocation vs. age/timeline consistency
    if (response.asset_allocation && inputData.yearsToRetirement < 10) {
      const stockAllocation = response.asset_allocation.recommended_stocks;
      
      if (stockAllocation > 60) {
        flags.push({
          type: 'contradictory_advice',
          severity: 'medium',
          description: 'High stock allocation recommended despite near retirement',
          field: 'asset_allocation.recommended_stocks',
          value: stockAllocation
        });
      }
    }

    // Check emergency fund vs. debt priority
    if (response.emergency_fund && response.debt_strategy) {
      const emergencyPriority = response.emergency_fund.priority;
      const hasHighInterestDebt = inputData.debtToIncomeRatio > 0.3;
      
      if (emergencyPriority === 'low' && hasHighInterestDebt) {
        flags.push({
          type: 'contradictory_advice',
          severity: 'low',
          description: 'Low emergency fund priority despite significant debt',
          field: 'emergency_fund.priority',
          value: emergencyPriority
        });
      }
    }

    // Check retirement readiness vs. savings rate
    if (response.retirement_readiness?.on_track === true && inputData.savingsRate < 0.05) {
      flags.push({
        type: 'contradictory_advice',
        severity: 'medium',
        description: 'Retirement marked as on-track despite low savings rate',
        field: 'retirement_readiness.on_track',
        value: true
      });
    }

    return flags;
  }

  /**
   * Detects prohibited content (product recommendations, etc.)
   */
  private static detectProhibitedContent(response: any): HallucinationFlag[] {
    const flags: HallucinationFlag[] = [];
    const responseText = JSON.stringify(response).toLowerCase();

    // Prohibited financial products/companies
    const prohibitedTerms = [
      // Specific companies
      'vanguard', 'fidelity', 'schwab', 'blackrock', 'morningstar',
      // Specific products
      'apple stock', 'tesla', 'bitcoin', 'ethereum', 'crypto',
      // Investment advice
      'buy ', 'sell ', 'invest in ', 'purchase ',
      // Specific funds/tickers
      'vti', 'spy', 'qqq', 'vtotal', 
      // Prohibited lending
      'payday loan', 'title loan', 'cash advance',
      // Gambling/speculation
      'day trading', 'options', 'forex', 'penny stocks'
    ];

    for (const term of prohibitedTerms) {
      if (responseText.includes(term)) {
        flags.push({
          type: 'product_recommendation',
          severity: 'high',
          description: `Contains prohibited content: ${term}`,
          field: 'general',
          value: term
        });
      }
    }

    // Check for borrowing to invest recommendations
    const borrowingPatterns = [
      'borrow to invest', 'leverage', 'margin', 'home equity loan for investment',
      'cash out refinance', 'loan to buy stocks'
    ];

    for (const pattern of borrowingPatterns) {
      if (responseText.includes(pattern)) {
        flags.push({
          type: 'product_recommendation',
          severity: 'high',
          description: `Prohibited borrowing recommendation: ${pattern}`,
          field: 'general',
          value: pattern
        });
      }
    }

    return flags;
  }

  /**
   * Detects off-topic content
   */
  private static detectOffTopicContent(response: any): HallucinationFlag[] {
    const flags: HallucinationFlag[] = [];
    const responseText = JSON.stringify(response).toLowerCase();

    // Required financial keywords
    const financialKeywords = [
      'savings', 'investment', 'debt', 'retirement', 'emergency',
      'budget', 'income', 'expense', 'asset', 'liability', 'financial',
      'money', 'dollar', 'fund', 'account', 'planning'
    ];

    const hasFinancialContent = financialKeywords.some(keyword => 
      responseText.includes(keyword)
    );

    // Check for non-financial content
    const nonFinancialTerms = [
      'recipe', 'weather', 'sports', 'celebrity', 'politics',
      'technology review', 'movie', 'book', 'travel destination',
      'medical advice', 'legal advice', 'relationship'
    ];

    const hasNonFinancialContent = nonFinancialTerms.some(term =>
      responseText.includes(term)
    );

    if (!hasFinancialContent && responseText.length > 100) {
      flags.push({
        type: 'off_topic',
        severity: 'high',
        description: 'Response lacks financial content',
        field: 'general',
        value: 'No financial keywords detected'
      });
    }

    if (hasNonFinancialContent) {
      flags.push({
        type: 'off_topic',
        severity: 'medium',
        description: 'Response contains non-financial content',
        field: 'general',
        value: 'Non-financial keywords detected'
      });
    }

    return flags;
  }

  /**
   * Validates response structure and required fields
   */
  private static validateResponseStructure(response: any, errors: string[]): boolean {
    let valid = true;

    // Check if response is valid JSON object
    if (typeof response !== 'object' || response === null) {
      errors.push('Response is not a valid JSON object');
      return false;
    }

    // Check for required disclaimers
    if (!response.disclaimers || !Array.isArray(response.disclaimers) || response.disclaimers.length === 0) {
      errors.push('Response missing required disclaimers');
      valid = false;
    }

    // Validate individual sections if present
    if (response.emergency_fund) {
      if (typeof response.emergency_fund.recommended_amount !== 'number') {
        errors.push('Emergency fund recommendation must be a number');
        valid = false;
      }
    }

    if (response.asset_allocation) {
      const allocation = response.asset_allocation;
      const total = (allocation.recommended_stocks || 0) + 
                   (allocation.recommended_bonds || 0) + 
                   (allocation.recommended_cash || 0);
      
      if (Math.abs(total - 100) > 5) { // Allow 5% tolerance
        errors.push('Asset allocation must total approximately 100%');
        valid = false;
      }
    }

    return valid;
  }

  /**
   * Validates financial amounts for reasonableness
   */
  private static validateFinancialAmounts(
    response: any, 
    inputData: CompressedFinancialData, 
    errors: string[], 
    warnings: string[]
  ): boolean {
    let valid = true;

    // Validate emergency fund amount
    if (response.emergency_fund?.recommended_amount) {
      const amount = response.emergency_fund.recommended_amount;
      const maxReasonable = inputData.monthlyExpenses * 12; // 12 months max
      
      if (amount > maxReasonable) {
        errors.push(`Emergency fund recommendation (${amount}) exceeds reasonable maximum`);
        valid = false;
      }
      
      if (amount < 0) {
        errors.push('Emergency fund recommendation cannot be negative');
        valid = false;
      }
    }

    // Validate retirement projections
    if (response.retirement_readiness?.score) {
      const score = response.retirement_readiness.score;
      
      if (score < 0 || score > 100) {
        errors.push('Retirement readiness score must be between 0 and 100');
        valid = false;
      }
    }

    return valid;
  }

  /**
   * Validates logical consistency within response
   */
  private static validateLogicalConsistency(
    response: any, 
    inputData: CompressedFinancialData, 
    errors: string[], 
    warnings: string[]
  ): boolean {
    let valid = true;

    // Check priority consistency
    if (response.emergency_fund?.priority === 'low' && inputData.emergencyFundMonths < 1) {
      warnings.push('Emergency fund marked low priority despite having less than 1 month saved');
    }

    // Check retirement vs. current financial health
    if (response.retirement_readiness?.on_track === true) {
      if (inputData.savingsRate < 0) {
        warnings.push('Retirement marked as on-track despite negative savings rate');
      }
      
      if (inputData.netWorth < 0 && inputData.age > 40) {
        warnings.push('Retirement marked as on-track despite negative net worth at age 40+');
      }
    }

    return valid;
  }

  /**
   * Performs safety validation
   */
  private static performSafetyValidation(
    response: any, 
    inputData: CompressedFinancialData
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for aggressive recommendations for conservative profiles
    if (inputData.riskProfile === 'conservative' && response.asset_allocation?.recommended_stocks > 50) {
      warnings.push('Aggressive stock allocation for conservative risk profile');
    }

    // Check for risky recommendations near retirement
    if (inputData.yearsToRetirement < 5 && response.asset_allocation?.recommended_stocks > 40) {
      warnings.push('High stock allocation recommended close to retirement');
    }

    // Check for unrealistic savings recommendations
    if (response.retirement_readiness?.additional_monthly_needed > inputData.monthlyIncome * 0.5) {
      errors.push('Recommended additional savings exceeds 50% of monthly income');
    }

    return { errors, warnings };
  }

  /**
   * Calculates overall safety score (0-1)
   */
  private static calculateSafetyScore(response: any, flags: HallucinationFlag[]): number {
    let score = 1.0;

    // Deduct for hallucination flags
    for (const flag of flags) {
      switch (flag.severity) {
        case 'high':
          score -= 0.3;
          break;
        case 'medium':
          score -= 0.15;
          break;
        case 'low':
          score -= 0.05;
          break;
      }
    }

    // Bonus for required safety elements
    if (response.disclaimers && response.disclaimers.length > 0) {
      score += 0.1;
    }

    if (response.risk_warnings && response.risk_warnings.length > 0) {
      score += 0.05;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Determines if human review is required
   */
  private static shouldRequireHumanReview(
    response: any,
    inputData: CompressedFinancialData,
    flags: HallucinationFlag[],
    safetyScore: number
  ): boolean {
    // High-value clients always require review
    if (inputData.hasHighValueAssets) return true;

    // Complex situations require review
    if (inputData.hasComplexDebts) return true;

    // Low safety score requires review
    if (safetyScore < 0.7) return true;

    // High-severity hallucination flags require review
    if (flags.some(f => f.severity === 'high')) return true;

    // Near retirement with significant recommendations
    if (inputData.yearsToRetirement < 5 && response.retirement_readiness?.additional_monthly_needed > 1000) {
      return true;
    }

    return false;
  }

  /**
   * Calculates overall confidence score
   */
  private static calculateConfidence(
    structureValid: boolean,
    amountsValid: boolean,
    logicValid: boolean,
    flagCount: number,
    safetyScore: number
  ): number {
    let confidence = 1.0;

    if (!structureValid) confidence *= 0.3;
    if (!amountsValid) confidence *= 0.5;
    if (!logicValid) confidence *= 0.7;

    // Reduce confidence for each flag
    confidence *= Math.max(0.1, 1 - (flagCount * 0.1));

    // Factor in safety score
    confidence *= safetyScore;

    return Math.max(0.1, confidence);
  }
}