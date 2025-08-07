// Comprehensive data validation and preprocessing for AI safety

import { FormData } from '@/types/financial';
import { 
  ValidationResult, 
  CompressedFinancialData, 
  ValidationRule,
  HallucinationFlag 
} from './types';
import { 
  FINANCIAL_CONSTRAINTS, 
  VALIDATION_RULES, 
  RISK_TOLERANCE_RULES,
  INCOME_STABILITY_MULTIPLIERS 
} from './constraints';

export class FinancialDataValidator {
  private validationRules: ValidationRule[];

  constructor() {
    this.validationRules = VALIDATION_RULES;
  }

  /**
   * Validates raw form data before AI processing
   */
  validateFinancialInputs(data: FormData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let passedValidations = 0;
    const totalValidations = this.validationRules.length;

    // Extract key metrics for validation
    const metrics = this.extractMetrics(data);

    for (const rule of this.validationRules) {
      try {
        const isValid = this.applyValidationRule(rule, metrics, data);
        
        if (!isValid) {
          if (rule.severity === 'error') {
            errors.push(rule.errorMessage);
          } else {
            warnings.push(rule.errorMessage);
          }
        } else {
          passedValidations++;
        }
      } catch (error) {
        console.error(`Validation rule error for ${rule.field}:`, error);
        warnings.push(`Validation check failed for ${rule.field}`);
      }
    }

    // Additional logical consistency checks
    const logicalChecks = this.performLogicalConsistencyChecks(data);
    errors.push(...logicalChecks.errors);
    warnings.push(...logicalChecks.warnings);

    const confidence = errors.length === 0 ? 
      Math.min(1.0, passedValidations / totalValidations) : 0;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      confidence
    };
  }

  /**
   * Compresses form data to essential metrics only for AI processing
   */
  compressFinancialData(data: FormData): CompressedFinancialData {
    const assets = data.assets || {};
    const liabilities = data.liabilities || {};
    const income = data.income || {};
    const expenses = data.expenses || {};
    const personal = data.personal || {};

    // Calculate core metrics
    const totalAssets = this.calculateTotalAssets(assets);
    const totalLiabilities = this.calculateTotalLiabilities(liabilities);
    const netWorth = totalAssets - totalLiabilities;
    
    const annualIncome = income.annualIncome || 0;
    const monthlyIncome = annualIncome / 12;
    
    const monthlyExpenses = this.calculateMonthlyExpenses(expenses);
    const debtToIncomeRatio = annualIncome > 0 ? (totalLiabilities / annualIncome) : 0;
    const savingsRate = monthlyIncome > 0 ? 
      Math.max(0, (monthlyIncome - monthlyExpenses) / monthlyIncome) : 0;

    const emergencyFund = assets.savings || 0;
    const emergencyFundMonths = monthlyExpenses > 0 ? 
      emergencyFund / monthlyExpenses : 0;

    const retirementSavings = (assets.retirement401k || 0) + (assets.ira || 0);
    const retirementSavingsRatio = annualIncome > 0 ? 
      retirementSavings / annualIncome : 0;

    const age = this.calculateAge(personal.dateOfBirth);
    const retirementAge = data.goals?.retirementAge || 65;
    const yearsToRetirement = Math.max(0, retirementAge - age);

    return {
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      debtToIncomeRatio,
      savingsRate,
      emergencyFundMonths,
      retirementSavingsRatio,
      age,
      yearsToRetirement,
      riskProfile: this.determineRiskProfile(data),
      primaryGoal: data.goals?.primaryGoal || 'general_planning',
      hasHighValueAssets: totalAssets > 1_000_000,
      hasComplexDebts: this.hasComplexDebtStructure(liabilities)
    };
  }

  /**
   * Detects potential hallucinations in AI responses
   */
  detectHallucinations(
    response: any, 
    inputData: CompressedFinancialData
  ): HallucinationFlag[] {
    const flags: HallucinationFlag[] = [];

    // Check for unrealistic amounts
    if (response.emergency_fund?.recommended_amount > inputData.monthlyIncome * 12) {
      flags.push({
        type: 'unrealistic_amount',
        severity: 'high',
        description: 'Emergency fund recommendation exceeds annual income',
        field: 'emergency_fund.recommended_amount',
        value: response.emergency_fund.recommended_amount
      });
    }

    // Check for impossible timelines
    if (response.debt_strategy?.payoff_timeline) {
      const timelineMatch = response.debt_strategy.payoff_timeline.match(/(\d+)\s*(year|month)/i);
      if (timelineMatch) {
        const amount = parseInt(timelineMatch[1]);
        const unit = timelineMatch[2].toLowerCase();
        const months = unit.startsWith('year') ? amount * 12 : amount;
        
        if (months > 600) { // 50 years
          flags.push({
            type: 'impossible_timeline',
            severity: 'medium',
            description: 'Debt payoff timeline exceeds reasonable limits',
            field: 'debt_strategy.payoff_timeline',
            value: response.debt_strategy.payoff_timeline
          });
        }
      }
    }

    // Check for contradictory advice
    if (response.asset_allocation && response.retirement_readiness) {
      const stockAllocation = response.asset_allocation.recommended_stocks;
      const isNearRetirement = inputData.yearsToRetirement < 10;
      
      if (isNearRetirement && stockAllocation > 60) {
        flags.push({
          type: 'contradictory_advice',
          severity: 'medium',
          description: 'High stock allocation recommended despite near retirement',
          field: 'asset_allocation.recommended_stocks',
          value: stockAllocation
        });
      }
    }

    // Check for product recommendations (prohibited)
    const responseText = JSON.stringify(response).toLowerCase();
    const prohibitedTerms = [
      'vanguard', 'fidelity', 'schwab', 'buy bitcoin', 'invest in',
      'apple stock', 'tesla', 'specific fund', 'etf recommendation'
    ];

    for (const term of prohibitedTerms) {
      if (responseText.includes(term)) {
        flags.push({
          type: 'product_recommendation',
          severity: 'high',
          description: `Contains prohibited product recommendation: ${term}`,
          field: 'general',
          value: term
        });
      }
    }

    // Check for off-topic content
    const financialKeywords = [
      'savings', 'investment', 'debt', 'retirement', 'emergency',
      'budget', 'income', 'expense', 'asset', 'liability'
    ];
    
    const hasFinancialContent = financialKeywords.some(keyword => 
      responseText.includes(keyword)
    );

    if (!hasFinancialContent && responseText.length > 100) {
      flags.push({
        type: 'off_topic',
        severity: 'high',
        description: 'Response appears to be off-topic for financial planning',
        field: 'general',
        value: 'No financial keywords detected'
      });
    }

    return flags;
  }

  /**
   * Performs comprehensive logical consistency checks
   */
  private performLogicalConsistencyChecks(data: FormData): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Income vs expenses consistency
    const monthlyIncome = (data.income?.annualIncome || 0) / 12;
    const monthlyExpenses = this.calculateMonthlyExpenses(data.expenses || {});
    
    if (monthlyIncome > 0 && monthlyExpenses > monthlyIncome * 2) {
      errors.push('Monthly expenses are more than double monthly income - please verify values');
    }

    // Asset vs liability consistency
    const totalAssets = this.calculateTotalAssets(data.assets || {});
    const totalLiabilities = this.calculateTotalLiabilities(data.liabilities || {});
    
    if (totalLiabilities > totalAssets * 3) {
      warnings.push('Liabilities significantly exceed assets - debt management is critical');
    }

    // Age and retirement consistency
    const age = this.calculateAge(data.personal?.dateOfBirth);
    const retirementAge = data.goals?.retirementAge || 65;
    
    if (age >= retirementAge && (data.assets?.retirement401k || 0) < monthlyExpenses * 60) {
      warnings.push('At or past retirement age with insufficient retirement savings');
    }

    // Emergency fund vs debt consistency
    const emergencyFund = data.assets?.savings || 0;
    const creditCardDebt = this.calculateCreditCardDebt(data.liabilities || {});
    
    if (emergencyFund > monthlyExpenses * 6 && creditCardDebt > monthlyExpenses) {
      warnings.push('Large emergency fund while carrying high-interest debt - consider debt payoff');
    }

    // Risk tolerance vs age consistency
    const riskTolerance = data.risk?.experienceLevel;
    if (riskTolerance === 'aggressive' && age > 55) {
      warnings.push('Aggressive risk tolerance may not be appropriate for age - consider more conservative approach');
    }

    return { errors, warnings };
  }

  /**
   * Applies individual validation rule
   */
  private applyValidationRule(
    rule: ValidationRule, 
    metrics: any, 
    fullData: FormData
  ): boolean {
    const value = this.getFieldValue(rule.field, metrics, fullData);
    
    switch (rule.type) {
      case 'range':
        const { min, max } = rule.constraint;
        return value >= min && value <= max;
        
      case 'enum':
        return rule.constraint.includes(value);
        
      case 'format':
        return new RegExp(rule.constraint).test(value);
        
      case 'custom':
        return rule.constraint(value, { ...metrics, ...fullData });
        
      default:
        return true;
    }
  }

  /**
   * Helper methods for calculations
   */
  private calculateTotalAssets(assets: any): number {
    return (assets.checking || 0) +
           (assets.savings || 0) +
           (assets.retirement401k || 0) +
           (assets.ira || 0) +
           (assets.taxableAccounts || 0) +
           (assets.homeValue || 0);
  }

  private calculateTotalLiabilities(liabilities: any): number {
    const mortgageBalance = liabilities.mortgageBalance || 0;
    const autoLoans = (liabilities.autoLoans || [])
      .reduce((sum: number, loan: any) => sum + (loan.balance || 0), 0);
    const creditCards = (liabilities.creditCards || [])
      .reduce((sum: number, card: any) => sum + (card.balance || 0), 0);
    const studentLoans = (liabilities.studentLoans || [])
      .reduce((sum: number, loan: any) => sum + (loan.balance || 0), 0);
    
    return mortgageBalance + autoLoans + creditCards + studentLoans;
  }

  private calculateMonthlyExpenses(expenses: any): number {
    return (expenses.housing || 0) +
           (expenses.transportation || 0) +
           (expenses.travel || 0) +
           (expenses.recreation || 0) +
           (expenses.food || 0) +
           (expenses.healthcare || 0) +
           (expenses.shopping || 0) +
           (expenses.technology || 0) +
           (expenses.personalCare || 0) +
           (expenses.entertainment || 0);
  }

  private calculateCreditCardDebt(liabilities: any): number {
    return (liabilities.creditCards || [])
      .reduce((sum: number, card: any) => sum + (card.balance || 0), 0);
  }

  private calculateAge(dateOfBirth?: string): number {
    if (!dateOfBirth) return 35; // Default assumption
    
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return Math.max(16, Math.min(100, age)); // Clamp to reasonable range
  }

  private determineRiskProfile(data: FormData): 'conservative' | 'moderate' | 'aggressive' {
    const age = this.calculateAge(data.personal?.dateOfBirth);
    const riskTolerance = data.risk?.experienceLevel;
    const yearsToRetirement = Math.max(0, (data.goals?.retirementAge || 65) - age);

    // Age-based default
    if (age > 55 || yearsToRetirement < 10) {
      return 'conservative';
    }

    // Use stated risk tolerance if available
    if (riskTolerance) {
      switch (riskTolerance) {
        case 'very_conservative':
        case 'conservative':
          return 'conservative';
        case 'moderate':
          return 'moderate';
        case 'aggressive':
        case 'very_aggressive':
          return 'aggressive';
        default:
          return 'moderate';
      }
    }

    // Default based on age
    return age < 35 ? 'moderate' : 'conservative';
  }

  private hasComplexDebtStructure(liabilities: any): boolean {
    const hasMultipleDebtTypes = [
      liabilities.mortgageBalance > 0,
      (liabilities.autoLoans || []).length > 0,
      (liabilities.creditCards || []).length > 1,
      (liabilities.studentLoans || []).length > 0
    ].filter(Boolean).length >= 3;

    const hasForeignDebt = liabilities.foreignDebt || false;
    const hasBusinessDebt = liabilities.businessDebt || false;

    return hasMultipleDebtTypes || hasForeignDebt || hasBusinessDebt;
  }

  private extractMetrics(data: FormData): any {
    const compressed = this.compressFinancialData(data);
    return {
      annualIncome: data.income?.annualIncome || 0,
      monthlyIncome: compressed.monthlyIncome,
      monthlyExpenses: compressed.monthlyExpenses,
      emergencyFundMonths: compressed.emergencyFundMonths,
      debtToIncomeRatio: compressed.debtToIncomeRatio,
      age: compressed.age,
      yearsToRetirement: compressed.yearsToRetirement,
      savingsRate: compressed.savingsRate,
      netWorth: compressed.netWorth,
      housingCostRatio: (data.expenses?.housing || 0) / compressed.monthlyIncome,
      creditCardDebt: this.calculateCreditCardDebt(data.liabilities || {}),
      stockAllocation: 0, // Would come from asset allocation if specified
    };
  }

  private getFieldValue(field: string, metrics: any, fullData: FormData): any {
    // Handle nested field access
    const parts = field.split('.');
    let value = metrics[field] !== undefined ? metrics[field] : fullData;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }
}

// Export singleton instance
export const dataValidator = new FinancialDataValidator();