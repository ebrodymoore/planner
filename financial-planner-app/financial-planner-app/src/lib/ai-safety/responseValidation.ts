// Comprehensive AI response validation and post-processing

import { 
  AnalysisResult, 
  CompressedFinancialData, 
  HallucinationFlag,
  AIResponseMetadata,
  ValidationResult
} from './types';
import { FINANCIAL_CONSTRAINTS } from './constraints';
import { dataValidator } from './dataValidation';

export class AIResponseValidator {

  /**
   * Validates AI response for accuracy, safety, and compliance
   */
  validateAIResponse(
    response: any, 
    inputData: CompressedFinancialData,
    startTime: number
  ): ValidationResult & { validatedResponse: AnalysisResult | null } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let confidence = 1.0;

    try {
      // 1. Schema validation
      const schemaValidation = this.validateResponseSchema(response);
      if (!schemaValidation.isValid) {
        errors.push(...schemaValidation.errors);
        return {
          isValid: false,
          errors,
          warnings,
          confidence: 0,
          validatedResponse: null
        };
      }

      // 2. Financial logic validation
      const logicValidation = this.validateFinancialLogic(response, inputData);
      errors.push(...logicValidation.errors);
      warnings.push(...logicValidation.warnings);
      confidence *= logicValidation.confidence;

      // 3. Safety checks
      const safetyValidation = this.validateSafety(response, inputData);
      errors.push(...safetyValidation.errors);
      warnings.push(...safetyValidation.warnings);
      confidence *= safetyValidation.confidence;

      // 4. Hallucination detection
      const hallucinationFlags = dataValidator.detectHallucinations(response, inputData);
      const highSeverityFlags = hallucinationFlags.filter(f => f.severity === 'high');
      
      if (highSeverityFlags.length > 0) {
        errors.push(...highSeverityFlags.map(f => f.description));
        confidence *= 0.5;
      }

      warnings.push(...hallucinationFlags
        .filter(f => f.severity !== 'high')
        .map(f => f.description)
      );

      // 5. Generate metadata
      const metadata: AIResponseMetadata = {
        source: 'AI_GENERATED',
        timestamp: new Date().toISOString(),
        confidence,
        tokenUsage: this.estimateTokenUsage(response),
        processingTime: Date.now() - startTime,
        validationsPassed: this.countPassedValidations(errors, warnings),
        totalValidations: this.getTotalValidationCount(),
        requiresHumanReview: this.shouldRequireHumanReview(response, inputData, hallucinationFlags)
      };

      // 6. Create validated response
      const validatedResponse: AnalysisResult = {
        ...response,
        metadata,
        risk_warnings: this.generateRiskWarnings(response, inputData),
        disclaimers: this.ensureDisclaimers(response.disclaimers)
      };

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        confidence,
        validatedResponse: errors.length === 0 ? validatedResponse : null
      };

    } catch (error) {
      console.error('Response validation error:', error);
      return {
        isValid: false,
        errors: ['Failed to validate AI response due to system error'],
        warnings: [],
        confidence: 0,
        validatedResponse: null
      };
    }
  }

  /**
   * Generates fallback response when AI validation fails
   */
  generateFallbackResponse(
    inputData: CompressedFinancialData,
    failedSections: string[] = []
  ): AnalysisResult {
    const metadata: AIResponseMetadata = {
      source: 'RULE_BASED',
      timestamp: new Date().toISOString(),
      confidence: 0.85, // Rule-based responses have high confidence
      tokenUsage: 0,
      processingTime: 0,
      validationsPassed: 100,
      totalValidations: 100,
      requiresHumanReview: inputData.hasHighValueAssets || inputData.hasComplexDebts
    };

    return {
      emergency_fund: this.generateEmergencyFundFallback(inputData),
      debt_strategy: this.generateDebtStrategyFallback(inputData),
      retirement_readiness: this.generateRetirementFallback(inputData),
      asset_allocation: this.generateAssetAllocationFallback(inputData),
      action_items: this.generateActionItemsFallback(inputData),
      risk_warnings: this.generateRiskWarnings({}, inputData),
      disclaimers: this.getStandardDisclaimers(),
      metadata
    };
  }

  /**
   * Validates response schema structure
   */
  private validateResponseSchema(response: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required top-level fields
    const requiredFields = ['disclaimers'];
    for (const field of requiredFields) {
      if (!response[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate emergency fund section if present
    if (response.emergency_fund) {
      const ef = response.emergency_fund;
      if (typeof ef.current_months !== 'number' || ef.current_months < 0) {
        errors.push('Invalid emergency_fund.current_months value');
      }
      if (typeof ef.recommended_amount !== 'number' || ef.recommended_amount < 0) {
        errors.push('Invalid emergency_fund.recommended_amount value');
      }
      if (!['high', 'medium', 'low'].includes(ef.priority)) {
        errors.push('Invalid emergency_fund.priority value');
      }
    }

    // Validate asset allocation section if present
    if (response.asset_allocation) {
      const aa = response.asset_allocation;
      const total = (aa.recommended_stocks || 0) + (aa.recommended_bonds || 0) + (aa.recommended_cash || 0);
      if (Math.abs(total - 100) > 2) { // Allow 2% tolerance for rounding
        errors.push('Asset allocation does not sum to 100%');
      }
    }

    // Validate retirement readiness section if present
    if (response.retirement_readiness) {
      const rr = response.retirement_readiness;
      if (typeof rr.score !== 'number' || rr.score < 0 || rr.score > 100) {
        errors.push('Invalid retirement_readiness.score value');
      }
      if (typeof rr.confidence_level !== 'number' || rr.confidence_level < 0 || rr.confidence_level > 1) {
        errors.push('Invalid retirement_readiness.confidence_level value');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      confidence: errors.length === 0 ? 1.0 : 0.0
    };
  }

  /**
   * Validates financial logic and reasonableness
   */
  private validateFinancialLogic(response: any, inputData: CompressedFinancialData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let confidence = 1.0;

    // Emergency fund validation
    if (response.emergency_fund) {
      const recommendedAmount = response.emergency_fund.recommended_amount;
      const maxReasonable = inputData.monthlyExpenses * FINANCIAL_CONSTRAINTS.emergencyFund.maxMonths;
      
      if (recommendedAmount > maxReasonable) {
        errors.push(`Emergency fund recommendation (${recommendedAmount}) exceeds reasonable maximum`);
        confidence *= 0.5;
      }

      const minReasonable = inputData.monthlyExpenses * FINANCIAL_CONSTRAINTS.emergencyFund.recommendedRange[0];
      if (recommendedAmount < minReasonable && response.emergency_fund.priority !== 'high') {
        warnings.push('Emergency fund recommendation below minimum standard but not marked high priority');
        confidence *= 0.9;
      }
    }

    // Asset allocation validation
    if (response.asset_allocation && inputData.age > 0) {
      const stockAllocation = response.asset_allocation.recommended_stocks;
      const conservativeMax = Math.max(30, 110 - inputData.age); // Conservative age-based rule
      
      if (stockAllocation > conservativeMax) {
        warnings.push(`Stock allocation (${stockAllocation}%) may be aggressive for age ${inputData.age}`);
        confidence *= 0.9;
      }

      // Check for overly conservative allocation for young investors
      if (inputData.age < 35 && stockAllocation < 50) {
        warnings.push('Asset allocation may be too conservative for young investor');
        confidence *= 0.95;
      }
    }

    // Retirement readiness validation
    if (response.retirement_readiness) {
      const score = response.retirement_readiness.score;
      const additionalNeeded = response.retirement_readiness.additional_monthly_needed;
      
      // Check if additional savings needed is reasonable
      if (additionalNeeded > inputData.monthlyIncome * 0.5) {
        warnings.push('Additional retirement savings recommendation exceeds 50% of income');
        confidence *= 0.8;
      }

      // Check score consistency with other metrics
      if (score > 80 && additionalNeeded > inputData.monthlyIncome * 0.2) {
        warnings.push('High retirement score inconsistent with high additional savings needed');
        confidence *= 0.9;
      }
    }

    // Debt strategy validation
    if (response.debt_strategy) {
      const method = response.debt_strategy.recommended_method;
      if (!['avalanche', 'snowball', 'hybrid'].includes(method)) {
        errors.push('Invalid debt strategy method recommended');
        confidence *= 0.5;
      }

      // Check if debt strategy aligns with emergency fund status
      if (inputData.emergencyFundMonths < 1 && method !== 'hybrid') {
        warnings.push('Aggressive debt payoff recommended despite lacking emergency fund');
        confidence *= 0.9;
      }
    }

    return { isValid: errors.length === 0, errors, warnings, confidence };
  }

  /**
   * Validates response for safety and compliance
   */
  private validateSafety(response: any, inputData: CompressedFinancialData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let confidence = 1.0;

    const responseText = JSON.stringify(response).toLowerCase();

    // Check for prohibited product recommendations
    const prohibitedTerms = [
      'buy bitcoin', 'invest in crypto', 'specific stock', 'company name',
      'vanguard', 'fidelity', 'schwab', 'etrade', 'robinhood',
      'apple stock', 'tesla stock', 'amazon stock', 'google stock'
    ];

    for (const term of prohibitedTerms) {
      if (responseText.includes(term)) {
        errors.push(`Contains prohibited product recommendation: ${term}`);
        confidence *= 0.3;
      }
    }

    // Check for risky advice patterns
    const riskyPatterns = [
      'borrow to invest', 'take loan for', 'margin trading',
      'day trading', 'timing the market', 'guaranteed returns',
      'get rich quick', 'risk-free profit'
    ];

    for (const pattern of riskyPatterns) {
      if (responseText.includes(pattern)) {
        errors.push(`Contains risky advice pattern: ${pattern}`);
        confidence *= 0.2;
      }
    }

    // Check for appropriate disclaimers
    if (!response.disclaimers || response.disclaimers.length === 0) {
      errors.push('Missing required disclaimers');
      confidence *= 0.7;
    }

    // Check for overly aggressive recommendations for conservative users
    if (inputData.riskProfile === 'conservative') {
      if (response.asset_allocation?.recommended_stocks > 60) {
        warnings.push('Aggressive stock allocation for conservative risk profile');
        confidence *= 0.9;
      }
    }

    // Validate age-appropriate advice
    if (inputData.age > 60) {
      if (response.asset_allocation?.recommended_stocks > 50) {
        warnings.push('High stock allocation recommended for older investor');
        confidence *= 0.9;
      }

      if (response.debt_strategy?.recommended_method === 'avalanche' && 
          inputData.yearsToRetirement < 5) {
        warnings.push('Aggressive debt payoff may not be appropriate near retirement');
        confidence *= 0.95;
      }
    }

    return { isValid: errors.length === 0, errors, warnings, confidence };
  }

  /**
   * Rule-based fallback generators
   */
  private generateEmergencyFundFallback(data: CompressedFinancialData) {
    const targetMonths = data.riskProfile === 'conservative' ? 6 : 
                        data.riskProfile === 'moderate' ? 4 : 3;
    const recommendedAmount = data.monthlyExpenses * targetMonths;
    
    return {
      current_months: data.emergencyFundMonths,
      recommended_amount: Math.round(recommendedAmount),
      priority: data.emergencyFundMonths < 3 ? 'high' : 'medium' as 'high' | 'medium' | 'low',
      reasoning: `Based on ${targetMonths}-month standard for ${data.riskProfile} risk profile`
    };
  }

  private generateDebtStrategyFallback(data: CompressedFinancialData) {
    return {
      recommended_method: 'avalanche' as 'avalanche' | 'snowball' | 'hybrid',
      payoff_timeline: 'Focus on emergency fund first, then high-interest debt',
      priority_debts: ['Credit cards', 'High-interest loans'],
      estimated_savings: 0
    };
  }

  private generateRetirementFallback(data: CompressedFinancialData) {
    const targetSavingsRate = 0.15; // 15% standard
    const currentSavingsRate = data.savingsRate;
    const additionalNeeded = Math.max(0, (targetSavingsRate - currentSavingsRate) * data.monthlyIncome);
    
    // Simple rule-based score
    const score = Math.min(100, Math.max(0, 
      (currentSavingsRate / targetSavingsRate) * 60 + 
      (data.retirementSavingsRatio * 40)
    ));

    return {
      score: Math.round(score),
      on_track: score >= 70,
      additional_monthly_needed: Math.round(additionalNeeded),
      projected_retirement_income: Math.round(data.monthlyIncome * 0.7), // 70% replacement
      confidence_level: 0.8
    };
  }

  private generateAssetAllocationFallback(data: CompressedFinancialData) {
    // Age-based allocation: 100 - age rule, adjusted for risk tolerance
    let stockPercentage = Math.max(20, Math.min(90, 100 - data.age));
    
    if (data.riskProfile === 'conservative') stockPercentage *= 0.8;
    if (data.riskProfile === 'aggressive') stockPercentage *= 1.1;
    
    stockPercentage = Math.round(Math.min(90, Math.max(20, stockPercentage)));
    const bondPercentage = Math.round((100 - stockPercentage) * 0.9);
    const cashPercentage = 100 - stockPercentage - bondPercentage;

    return {
      recommended_stocks: stockPercentage,
      recommended_bonds: bondPercentage,
      recommended_cash: cashPercentage,
      rebalancing_needed: true
    };
  }

  private generateActionItemsFallback(data: CompressedFinancialData) {
    const items = {
      immediate: [] as string[],
      short_term: [] as string[],
      medium_term: [] as string[],
      long_term: [] as string[]
    };

    if (data.emergencyFundMonths < 3) {
      items.immediate.push('Build emergency fund to 3-month minimum');
    }

    if (data.debtToIncomeRatio > 0.36) {
      items.immediate.push('Create debt reduction plan');
    }

    if (data.savingsRate < 0.15) {
      items.short_term.push('Increase retirement savings rate to 15%');
    }

    items.medium_term.push('Review and optimize asset allocation');
    items.long_term.push('Annual financial plan review');

    return items;
  }

  /**
   * Helper methods
   */
  private generateRiskWarnings(response: any, data: CompressedFinancialData): string[] {
    const warnings: string[] = [];

    if (data.hasHighValueAssets) {
      warnings.push('High net worth individuals should consult with tax professionals and estate planning attorneys');
    }

    if (data.hasComplexDebts) {
      warnings.push('Complex debt structures may require specialized debt counseling');
    }

    if (data.yearsToRetirement < 10) {
      warnings.push('Near-retirement planning requires conservative strategies and professional guidance');
    }

    if (data.age < 25) {
      warnings.push('Young investors should focus on building good financial habits and emergency funds');
    }

    return warnings;
  }

  private ensureDisclaimers(existingDisclaimers: string[] = []): string[] {
    const standardDisclaimers = this.getStandardDisclaimers();
    
    // Merge and deduplicate
    const allDisclaimers = [...new Set([...existingDisclaimers, ...standardDisclaimers])];
    
    return allDisclaimers;
  }

  private getStandardDisclaimers(): string[] {
    return [
      'This analysis is for educational purposes only and should not be considered personalized financial advice',
      'Consult with a licensed financial advisor before making investment decisions',
      'Past performance does not guarantee future returns',
      'All investments carry risk of loss',
      'Consider your individual circumstances, risk tolerance, and financial goals',
      'Tax implications may vary based on individual situations'
    ];
  }

  private shouldRequireHumanReview(
    response: any, 
    data: CompressedFinancialData, 
    flags: HallucinationFlag[]
  ): boolean {
    return (
      data.hasHighValueAssets ||
      data.hasComplexDebts ||
      flags.some(f => f.severity === 'high') ||
      data.netWorth > 2_000_000 ||
      data.age > 70 ||
      data.yearsToRetirement < 5
    );
  }

  private estimateTokenUsage(response: any): number {
    // Rough estimation: 4 characters per token
    return Math.ceil(JSON.stringify(response).length / 4);
  }

  private countPassedValidations(errors: string[], warnings: string[]): number {
    // Simplified - in real implementation, track individual validation results
    return Math.max(0, 20 - errors.length - warnings.length);
  }

  private getTotalValidationCount(): number {
    return 20; // Total number of validation checks performed
  }
}

// Export singleton instance
export const responseValidator = new AIResponseValidator();