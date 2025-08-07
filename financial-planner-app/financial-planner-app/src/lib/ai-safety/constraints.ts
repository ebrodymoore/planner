// Comprehensive financial constraints and rules based on industry standards

import { FinancialConstraints, ValidationRule } from './types';

export const FINANCIAL_CONSTRAINTS: FinancialConstraints = {
  emergencyFund: {
    minMonths: 1,
    maxMonths: 12, // Never recommend more than 12 months
    recommendedRange: [3, 6], // Standard 3-6 months
  },
  debtToIncome: {
    maxRatio: 0.43, // FHA maximum debt-to-income ratio
    warningThreshold: 0.36, // Generally recommended maximum
  },
  savingsRate: {
    minRecommended: 0.10, // 10% minimum
    maxRealistic: 0.50, // 50% is extremely high but possible
  },
  assetAllocation: {
    maxStockPercentage: 100,
    minBondPercentage: 0,
    maxCashPercentage: 30, // More than 30% cash is generally inefficient
  },
  income: {
    minAnnual: 0,
    maxAnnual: 50_000_000, // Reasonable upper bound for validation
  },
  age: {
    minAge: 16,
    maxAge: 100,
  },
};

// Comprehensive financial rules and principles
export const FINANCIAL_RULES = `
FUNDAMENTAL FINANCIAL PLANNING PRINCIPLES:

EMERGENCY FUND:
- 3-6 months of expenses for stable employment
- 6-12 months for variable income or high-risk jobs
- Never recommend more than 12 months (opportunity cost too high)
- Should be in liquid, safe accounts (savings, money market, CDs)

DEBT MANAGEMENT:
- Total debt-to-income ratio should not exceed 36% (including mortgage)
- Credit card debt should be paid off before investing in taxable accounts
- Mortgage debt up to 28% of gross income is generally acceptable
- Student loans: aim to keep total education debt below annual starting salary
- Avalanche method saves most money (pay highest interest first)
- Snowball method provides psychological wins (pay smallest balance first)

RETIREMENT PLANNING:
- Save 10-20% of gross income for retirement
- General rule: 100 - age = percentage in stocks (e.g., 30-year-old = 70% stocks)
- Target replacement ratio: 70-90% of pre-retirement income
- Social Security replaces ~40% of income for average earners
- Rule of 25: Need 25x annual expenses saved for retirement (4% withdrawal rule)
- Contribute to 401(k) up to employer match first (free money)
- Max out tax-advantaged accounts before taxable investing

ASSET ALLOCATION:
- Diversification is crucial - never put all money in one investment
- Age-appropriate risk tolerance (younger = more aggressive)
- Emergency fund should be separate from investments
- Don't invest money needed within 5 years in stocks
- Rebalance annually or when allocation drifts 5%+ from target

INSURANCE:
- Life insurance: 10-12x annual income if you have dependents
- Term life insurance is usually more cost-effective than whole life
- Disability insurance: 60-70% of income replacement
- Health insurance is essential - never go without coverage
- Umbrella policy if net worth > $500k

TAX STRATEGIES:
- Maximize tax-advantaged accounts (401k, IRA, HSA)
- Tax-loss harvesting in taxable accounts
- Roth conversions during low-income years
- HSA is triple tax-advantaged if used for medical expenses

PROHIBITED RECOMMENDATIONS:
- Never recommend specific stocks, funds, or financial products
- Never suggest taking on debt for investments (except mortgage for primary residence)
- Never recommend high-risk investments for emergency funds
- Never suggest market timing strategies
- Never recommend payday loans, title loans, or other predatory lending
- Never suggest borrowing from retirement accounts except dire emergencies
- Never recommend cryptocurrency for more than 5% of portfolio
- Never suggest investing emergency fund money

CONSERVATIVE ASSUMPTIONS:
- Use 7% nominal returns for stock market (historical average)
- Use 3% inflation rate for planning purposes
- Assume 25% effective tax rate unless otherwise specified
- Plan for longer lifespans (90+ years)
- Build in buffer for unexpected expenses

RISK MANAGEMENT:
- Always discuss importance of diversification
- Emphasize that past performance doesn't guarantee future returns
- Recommend professional advice for complex situations
- Stress importance of starting early due to compound interest
- Always include appropriate disclaimers about market risk
`;

// Detailed validation rules for all financial inputs
export const VALIDATION_RULES: ValidationRule[] = [
  // Income validation
  {
    field: 'annualIncome',
    type: 'range',
    constraint: { min: 0, max: FINANCIAL_CONSTRAINTS.income.maxAnnual },
    errorMessage: 'Annual income must be between $0 and $50,000,000',
    severity: 'error',
  },
  {
    field: 'annualIncome',
    type: 'custom',
    constraint: (value: number, data: any) => {
      // Warning if income seems unusually high for reported age/expenses
      const monthlyExpenses = data.monthlyExpenses || 0;
      const monthlyIncome = value / 12;
      return monthlyIncome > 0 && monthlyExpenses > 0 ? monthlyExpenses < monthlyIncome * 2 : true;
    },
    errorMessage: 'Monthly expenses exceed 200% of monthly income - please verify values',
    severity: 'warning',
  },

  // Emergency fund validation
  {
    field: 'emergencyFundMonths',
    type: 'range',
    constraint: { min: 0, max: FINANCIAL_CONSTRAINTS.emergencyFund.maxMonths },
    errorMessage: 'Emergency fund should not exceed 12 months of expenses',
    severity: 'error',
  },

  // Debt-to-income validation
  {
    field: 'debtToIncomeRatio',
    type: 'range',
    constraint: { min: 0, max: 1 },
    errorMessage: 'Debt-to-income ratio cannot exceed 100%',
    severity: 'error',
  },
  {
    field: 'debtToIncomeRatio',
    type: 'range',
    constraint: { min: 0, max: FINANCIAL_CONSTRAINTS.debtToIncome.maxRatio },
    errorMessage: 'Debt-to-income ratio exceeds recommended maximum of 43%',
    severity: 'warning',
  },

  // Age validation
  {
    field: 'age',
    type: 'range',
    constraint: { min: FINANCIAL_CONSTRAINTS.age.minAge, max: FINANCIAL_CONSTRAINTS.age.maxAge },
    errorMessage: 'Age must be between 16 and 100 years',
    severity: 'error',
  },

  // Savings rate validation
  {
    field: 'savingsRate',
    type: 'range',
    constraint: { min: -1, max: FINANCIAL_CONSTRAINTS.savingsRate.maxRealistic },
    errorMessage: 'Savings rate cannot exceed 50% - please verify income and expenses',
    severity: 'warning',
  },

  // Asset allocation validation
  {
    field: 'assetAllocation',
    type: 'custom',
    constraint: (allocation: any) => {
      const total = (allocation.stocks || 0) + (allocation.bonds || 0) + (allocation.cash || 0);
      return Math.abs(total - 100) < 1; // Allow for rounding
    },
    errorMessage: 'Asset allocation must total 100%',
    severity: 'error',
  },

  // Net worth validation
  {
    field: 'netWorth',
    type: 'custom',
    constraint: (netWorth: number, data: any) => {
      // Warning if net worth is negative and no debt management plan
      return netWorth >= 0 || data.hasDebtStrategy;
    },
    errorMessage: 'Negative net worth detected - debt management should be prioritized',
    severity: 'warning',
  },

  // Retirement timeline validation
  {
    field: 'yearsToRetirement',
    type: 'range',
    constraint: { min: 0, max: 50 },
    errorMessage: 'Years to retirement must be between 0 and 50',
    severity: 'error',
  },
  {
    field: 'yearsToRetirement',
    type: 'custom',
    constraint: (years: number) => years >= 5,
    errorMessage: 'Less than 5 years to retirement - consider conservative investment strategy',
    severity: 'warning',
  },

  // Monthly expenses validation
  {
    field: 'monthlyExpenses',
    type: 'custom',
    constraint: (expenses: number, data: any) => {
      const monthlyIncome = data.monthlyIncome || 0;
      return monthlyIncome === 0 || expenses <= monthlyIncome * 1.5;
    },
    errorMessage: 'Monthly expenses exceed 150% of income - budget review recommended',
    severity: 'warning',
  },

  // Housing cost validation (should be under 30% of income)
  {
    field: 'housingCostRatio',
    type: 'range',
    constraint: { min: 0, max: 0.50 },
    errorMessage: 'Housing costs exceed 50% of income - consider housing alternatives',
    severity: 'warning',
  },

  // Credit card debt validation
  {
    field: 'creditCardDebt',
    type: 'custom',
    constraint: (debt: number, data: any) => {
      const monthlyIncome = data.monthlyIncome || 0;
      return monthlyIncome === 0 || debt <= monthlyIncome * 6; // 6 months of income max
    },
    errorMessage: 'Credit card debt exceeds 6 months of income - immediate attention required',
    severity: 'error',
  },

  // Investment risk validation
  {
    field: 'stockAllocation',
    type: 'custom',
    constraint: (stockPercent: number, data: any) => {
      const age = data.age || 30;
      const maxRecommended = Math.min(100, 110 - age); // Conservative age-based rule
      return stockPercent <= maxRecommended;
    },
    errorMessage: 'Stock allocation may be too aggressive for age - consider more conservative approach',
    severity: 'warning',
  },
];

// Risk tolerance questionnaire constraints
export const RISK_TOLERANCE_RULES = {
  conservative: {
    maxStockAllocation: 30,
    recommendedEmergencyMonths: 6,
    prioritizeDebtPayoff: true,
  },
  moderate: {
    maxStockAllocation: 70,
    recommendedEmergencyMonths: 4,
    prioritizeDebtPayoff: false,
  },
  aggressive: {
    maxStockAllocation: 90,
    recommendedEmergencyMonths: 3,
    prioritizeDebtPayoff: false,
  },
};

// Income stability factors
export const INCOME_STABILITY_MULTIPLIERS = {
  very_stable: 1.0, // Government, tenured positions
  stable: 1.2, // Regular employment
  variable: 1.5, // Commission, freelance
  uncertain: 2.0, // Startup, high-risk industry
};

// Life stage adjustments
export const LIFE_STAGE_ADJUSTMENTS = {
  young_single: {
    emergencyFundMultiplier: 0.8,
    riskToleranceBoost: 0.1,
  },
  young_family: {
    emergencyFundMultiplier: 1.2,
    insuranceMultiplier: 2.0,
  },
  middle_aged: {
    emergencyFundMultiplier: 1.0,
    conservativeShift: 0.1,
  },
  pre_retirement: {
    emergencyFundMultiplier: 1.5,
    conservativeShift: 0.3,
  },
  retired: {
    emergencyFundMultiplier: 2.0,
    conservativeShift: 0.5,
  },
};

// Economic environment adjustments
export const ECONOMIC_ADJUSTMENTS = {
  recession: {
    emergencyFundMultiplier: 1.5,
    conservativeShift: 0.2,
    debtPayoffPriority: true,
  },
  inflation: {
    realReturnAdjustment: -0.02,
    fixedIncomeReduction: 0.1,
  },
  normal: {
    // No adjustments
  },
};