// Comprehensive prompt engineering for financial AI safety

import { CompressedFinancialData, PlanSection, AnalysisTier } from './types';
import { FINANCIAL_RULES } from './constraints';

export class FinancialPromptEngine {
  
  /**
   * Core system prompt with role definition and constraints
   */
  private readonly SYSTEM_PROMPT = `
You are a conservative financial education assistant. Your role is strictly limited to:

1. PROVIDING EDUCATIONAL FINANCIAL INFORMATION ONLY
2. NEVER GIVING SPECIFIC INVESTMENT ADVICE
3. ALWAYS RECOMMENDING CONSULTATION WITH LICENSED PROFESSIONALS
4. BASING ALL RECOMMENDATIONS ON ESTABLISHED FINANCIAL PLANNING PRINCIPLES
5. USING CONSERVATIVE ASSUMPTIONS IN ALL CALCULATIONS

CRITICAL CONSTRAINTS:
- You must ONLY respond with valid JSON in the exact schema provided
- NEVER recommend specific financial products, companies, or investments
- NEVER suggest borrowing to invest (except primary residence mortgage)
- NEVER recommend market timing or get-rich-quick schemes
- ALWAYS include appropriate disclaimers about market risk
- Use conservative assumptions (7% stock returns, 3% inflation, 25% tax rate)

RESPONSE REQUIREMENTS:
- All monetary amounts in USD
- All percentages as decimals (e.g., 0.15 for 15%)
- Conservative recommendations aligned with industry standards
- Include confidence levels for all major recommendations
- Provide clear reasoning for each recommendation

${FINANCIAL_RULES}

Remember: This is educational content only. Always recommend consulting with licensed financial professionals for personalized advice.
`;

  /**
   * Few-shot examples to guide response format
   */
  private readonly FEW_SHOT_EXAMPLES = `
EXAMPLE 1:
Input: {netWorth: 50000, monthlyIncome: 6000, monthlyExpenses: 4500, age: 28, emergencyFundMonths: 1.5}

Output: {
  "emergency_fund": {
    "current_months": 1.5,
    "recommended_amount": 27000,
    "priority": "high",
    "reasoning": "Current emergency fund covers only 1.5 months of expenses. Industry standard recommends 3-6 months for financial security."
  },
  "debt_strategy": {
    "recommended_method": "avalanche",
    "payoff_timeline": "Focus on emergency fund first before aggressive debt payoff",
    "priority_debts": [],
    "estimated_savings": 0
  },
  "retirement_readiness": {
    "score": 45,
    "on_track": false,
    "additional_monthly_needed": 600,
    "projected_retirement_income": 3200,
    "confidence_level": 0.8
  },
  "disclaimers": ["This analysis is for educational purposes only", "Consult with a licensed financial advisor for personalized advice"]
}

EXAMPLE 2:
Input: {netWorth: 250000, monthlyIncome: 8000, monthlyExpenses: 5000, age: 45, emergencyFundMonths: 8, debtToIncomeRatio: 0.15}

Output: {
  "emergency_fund": {
    "current_months": 8,
    "recommended_amount": 30000,
    "priority": "low",
    "reasoning": "Emergency fund exceeds 6-month recommendation. Consider investing excess funds for long-term growth."
  },
  "asset_allocation": {
    "recommended_stocks": 65,
    "recommended_bonds": 30,
    "recommended_cash": 5,
    "rebalancing_needed": true
  },
  "retirement_readiness": {
    "score": 75,
    "on_track": true,
    "additional_monthly_needed": 200,
    "projected_retirement_income": 5600,
    "confidence_level": 0.85
  }
}
`;

  /**
   * Schema definitions for each analysis section
   */
  private readonly RESPONSE_SCHEMAS = {
    emergency_fund: {
      type: "object",
      required: ["current_months", "recommended_amount", "priority", "reasoning"],
      properties: {
        current_months: { type: "number", minimum: 0, maximum: 24 },
        recommended_amount: { type: "number", minimum: 0, maximum: 1000000 },
        priority: { enum: ["high", "medium", "low"] },
        reasoning: { type: "string", maxLength: 200 }
      }
    },
    debt_strategy: {
      type: "object",
      required: ["recommended_method", "payoff_timeline", "priority_debts", "estimated_savings"],
      properties: {
        recommended_method: { enum: ["avalanche", "snowball", "hybrid"] },
        payoff_timeline: { type: "string", maxLength: 100 },
        priority_debts: { type: "array", items: { type: "string" } },
        estimated_savings: { type: "number", minimum: 0 }
      }
    },
    retirement_readiness: {
      type: "object",
      required: ["score", "on_track", "additional_monthly_needed", "projected_retirement_income", "confidence_level"],
      properties: {
        score: { type: "number", minimum: 0, maximum: 100 },
        on_track: { type: "boolean" },
        additional_monthly_needed: { type: "number", minimum: 0, maximum: 50000 },
        projected_retirement_income: { type: "number", minimum: 0 },
        confidence_level: { type: "number", minimum: 0, maximum: 1 }
      }
    },
    asset_allocation: {
      type: "object",
      required: ["recommended_stocks", "recommended_bonds", "recommended_cash", "rebalancing_needed"],
      properties: {
        recommended_stocks: { type: "number", minimum: 0, maximum: 100 },
        recommended_bonds: { type: "number", minimum: 0, maximum: 100 },
        recommended_cash: { type: "number", minimum: 0, maximum: 30 },
        rebalancing_needed: { type: "boolean" }
      }
    }
  };

  /**
   * Section-specific prompts with focused instructions
   */
  private readonly SECTION_PROMPTS = {
    emergency_fund: `
Analyze the emergency fund situation based on:
- Current monthly expenses and income stability
- Existing emergency fund balance
- Employment type and income predictability

Provide recommendation following 3-6 month standard, adjusting for:
- Job security level (stable jobs = 3 months, variable income = 6+ months)
- Family situation (more dependents = larger fund)
- Industry risk factors

NEVER recommend more than 12 months of expenses in emergency fund.
`,

    debt_management: `
Analyze debt situation and recommend strategy:
- List debts by interest rate (avalanche) vs balance (snowball)
- Consider psychological factors vs mathematical optimization
- Account for minimum payments and available extra payment capacity

PROHIBITED recommendations:
- Borrowing from retirement accounts
- Taking on additional debt to pay debt
- Payday or title loans
- Investment while carrying high-interest debt

Prioritize high-interest debt (>15% APR) over investments.
`,

    retirement_planning: `
Calculate retirement readiness using:
- Current age and planned retirement age
- Existing retirement savings (401k, IRA, etc.)
- Current contribution rate
- Expected Social Security benefits (~40% income replacement)

Use conservative assumptions:
- 7% nominal stock returns
- 3% inflation
- 4% withdrawal rate in retirement
- 80% income replacement target

Account for catch-up contributions if over 50.
`,

    asset_allocation: `
Recommend age-appropriate asset allocation:
- Basic rule: 100 - age = stock percentage (adjust for risk tolerance)
- Consider time horizon and risk capacity
- Account for existing assets and target allocation

Guidelines:
- Minimum 10% bonds for diversification
- Maximum 30% cash allocation
- More conservative if within 10 years of retirement
- Consider tax-advantaged vs taxable account placement
`,

    risk_assessment: `
Evaluate financial risk factors:
- Income stability and concentration risk
- Asset diversification
- Insurance coverage gaps
- Emergency fund adequacy
- Debt levels and structure

Focus on protection strategies, not speculation.
`
  };

  /**
   * Generates comprehensive prompt for AI analysis
   */
  generateAnalysisPrompt(
    data: CompressedFinancialData,
    sections: PlanSection[],
    tier: AnalysisTier
  ): string {
    const sectionInstructions = sections
      .map(section => this.SECTION_PROMPTS[section])
      .filter(Boolean)
      .join('\n\n');

    const requiredSchema = this.buildResponseSchema(sections);

    return `
${this.SYSTEM_PROMPT}

${this.FEW_SHOT_EXAMPLES}

ANALYSIS TASK:
Analyze the following financial profile and provide recommendations for: ${sections.join(', ')}

FINANCIAL PROFILE:
${JSON.stringify(data, null, 2)}

SECTION-SPECIFIC INSTRUCTIONS:
${sectionInstructions}

RESPONSE REQUIREMENTS:
1. Respond ONLY with valid JSON matching the exact schema below
2. Include all required fields for each section
3. Use conservative assumptions throughout
4. Provide clear reasoning for major recommendations
5. Include appropriate disclaimers

REQUIRED JSON SCHEMA:
${JSON.stringify(requiredSchema, null, 2)}

IMPORTANT REMINDERS:
- This is educational content only
- All recommendations should be conservative
- Never suggest specific products or companies
- Include confidence levels for major recommendations
- Recommend professional consultation for complex situations

Respond with valid JSON only:
`;
  }

  /**
   * Generates prompts for specific analysis tiers
   */
  generateTieredPrompt(
    data: CompressedFinancialData,
    tier: 'basic' | 'standard' | 'comprehensive'
  ): string {
    const tierConfigs = {
      basic: {
        sections: ['emergency_fund', 'debt_management', 'retirement_readiness'] as PlanSection[],
        maxComplexity: 'Focus on top 3 financial priorities only. Keep recommendations simple and actionable.',
      },
      standard: {
        sections: ['emergency_fund', 'debt_management', 'retirement_planning', 'asset_allocation'] as PlanSection[],
        maxComplexity: 'Provide standard financial planning analysis. Include asset allocation if portfolio exists.',
      },
      comprehensive: {
        sections: ['emergency_fund', 'debt_management', 'retirement_planning', 'asset_allocation', 'risk_assessment'] as PlanSection[],
        maxComplexity: 'Provide detailed analysis covering all major financial planning areas.',
      }
    };

    const config = tierConfigs[tier];
    const basePrompt = this.generateAnalysisPrompt(data, config.sections, {
      name: tier,
      sections: config.sections,
      maxTokens: tier === 'basic' ? 1000 : tier === 'standard' ? 2000 : 4000,
      cacheEnabled: true,
      humanReviewRequired: data.hasHighValueAssets || data.hasComplexDebts
    });

    return `${basePrompt}\n\nCOMPLEXITY GUIDANCE: ${config.maxComplexity}`;
  }

  /**
   * Builds JSON schema for required response format
   */
  private buildResponseSchema(sections: PlanSection[]): any {
    const schema: any = {
      type: "object",
      required: [...sections, "disclaimers", "risk_warnings"],
      properties: {
        disclaimers: {
          type: "array",
          items: { type: "string" },
          minItems: 1
        },
        risk_warnings: {
          type: "array", 
          items: { type: "string" }
        }
      }
    };

    // Add schema for each requested section
    for (const section of sections) {
      if (this.RESPONSE_SCHEMAS[section]) {
        schema.properties[section] = this.RESPONSE_SCHEMAS[section];
      }
    }

    return schema;
  }

  /**
   * Generates validation prompt for response checking
   */
  generateValidationPrompt(originalData: CompressedFinancialData, aiResponse: any): string {
    return `
You are a financial planning validation system. Review the AI response below for:

1. FACTUAL ACCURACY - Are calculations reasonable?
2. INTERNAL CONSISTENCY - Do recommendations align with each other?
3. SAFETY - Are recommendations conservative and appropriate?
4. COMPLIANCE - Does response avoid prohibited content?

ORIGINAL DATA:
${JSON.stringify(originalData, null, 2)}

AI RESPONSE TO VALIDATE:
${JSON.stringify(aiResponse, null, 2)}

VALIDATION CHECKLIST:
□ Emergency fund recommendation is 3-12 months of expenses
□ Asset allocation totals ~100% 
□ Debt strategy prioritizes high-interest debt
□ Retirement projections use conservative assumptions
□ No specific product recommendations
□ Appropriate disclaimers included
□ Recommendations align with risk tolerance and age

Respond with:
{
  "validation_passed": boolean,
  "confidence_score": number (0-1),
  "issues_found": ["list of specific issues"],
  "risk_level": "low|medium|high",
  "human_review_needed": boolean
}
`;
  }

  /**
   * Generates explanation prompt for user-facing content
   */
  generateExplanationPrompt(recommendation: any, userLevel: 'beginner' | 'intermediate' | 'advanced'): string {
    const complexityGuidance = {
      beginner: "Use simple language, avoid jargon, include basic explanations of financial concepts",
      intermediate: "Use standard financial terms with brief explanations when needed",
      advanced: "Use precise financial terminology, assume familiarity with concepts"
    };

    return `
Convert the following financial recommendation into a clear, user-friendly explanation suitable for a ${userLevel} level user.

RECOMMENDATION:
${JSON.stringify(recommendation, null, 2)}

REQUIREMENTS:
- ${complexityGuidance[userLevel]}
- Include the reasoning behind the recommendation
- Explain potential benefits and risks
- Suggest specific next steps
- Include timeline for implementation
- Maintain educational tone (not advisory)

Format as friendly, informative text that helps the user understand both WHAT to do and WHY.
`;
  }
}

// Export singleton instance
export const promptEngine = new FinancialPromptEngine();