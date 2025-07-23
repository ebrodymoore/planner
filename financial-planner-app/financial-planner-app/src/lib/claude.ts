import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface FinancialData {
  client_profile: {
    personal_info: {
      name: string;
      age: number;
      marital_status: string;
      dependents: {
        count: number;
        ages: number[];
      };
      location: {
        state: string;
        country: string;
      };
      employment: {
        status: string;
        industry: string;
        profession: string;
      };
    };
  };
  income: {
    primary: {
      annual_gross: number;
      stability: string;
      growth_expectation: string;
    };
    additional_sources: {
      spouse_income: number;
      rental_income: number;
      investment_income: number;
    };
    timeline: {
      expected_retirement_age: number;
    };
  };
  expenses: {
    housing: {
      monthly_payment: number;
      type: string;
    };
    living_expenses: {
      monthly_food_groceries: number;
      monthly_utilities: number;
      monthly_transportation: number;
      monthly_entertainment: number;
    };
  };
  assets: {
    liquid: {
      checking_balance: number;
      savings_balance: number;
      emergency_fund_target: string;
    };
    investments: {
      "401k_balance": number;
      ira_balance: number;
      taxable_accounts: number;
    };
    real_estate: {
      primary_residence: number;
    };
  };
  liabilities: {
    mortgage_debt: {
      primary_balance: number;
      primary_rate: number;
      years_remaining: number;
    };
    auto_loans: Array<{
      balance: number;
      rate: number;
      term: string;
      description: string;
    }>;
    credit_cards: Array<{
      name: string;
      balance: number;
      limit: number;
      rate: number;
    }>;
    student_loans: Array<{
      balance: number;
      rate: number;
      servicer: string;
      type: string;
    }>;
  };
  financial_goals: {
    priority_ranking: {
      retirement_security: number;
      emergency_fund: number;
      debt_elimination: number;
    };
    specific_goals: {
      retirement: {
        target_age: number;
        desired_annual_income: number;
      };
    };
  };
  specific_life_goals: {
    real_estate: {
      second_home_interest: string;
      second_home_budget: number;
    };
    business: {
      entrepreneurship_interest: string;
      business_capital_needed: number;
    };
  };
  risk_assessment: {
    investment_experience: {
      experience_level: string;
      largest_loss: string;
    };
    risk_tolerance: {
      portfolio_drop_20_percent: string;
      investment_timeline: string;
    };
  };
  current_market_context: {
    request_date: string;
    market_conditions: string;
  };
  analysis_requirements: {
    comprehensive_assessment: boolean;
    priority_recommendations: number;
    implementation_timeline: string;
    regulatory_compliance: string;
  };
}

export interface FinancialAnalysis {
  client_summary: {
    name: string;
    age: number;
    financial_health_score: number;
    net_worth: number;
    monthly_cash_flow: number;
  };
  priority_recommendations: Array<{
    id: number;
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
    estimated_impact: string;
    implementation_steps: string[];
  }>;
  detailed_analysis: {
    cash_flow: {
      monthly_surplus_deficit: number;
      annual_savings_rate: number;
      recommendations: string[];
    };
    investment_strategy: {
      current_allocation: string;
      recommended_allocation: string;
      risk_tolerance_assessment: string;
      specific_recommendations: string[];
    };
    retirement_planning: {
      retirement_readiness_score: number;
      projected_retirement_income: number;
      savings_gap: number;
      catch_up_recommendations: string[];
    };
    debt_management: {
      debt_to_income_ratio: number;
      total_debt: number;
      payoff_strategy: string;
      priority_debts: string[];
    };
    insurance_analysis: {
      coverage_gaps: string[];
      cost_optimization_opportunities: string[];
    };
    tax_optimization: {
      current_tax_efficiency: string;
      optimization_opportunities: string[];
      estimated_annual_savings: number;
    };
  };
  action_plan: {
    immediate_actions: string[];
    short_term_goals: string[];
    long_term_strategy: string[];
  };
  disclaimers: string[];
}

const FINANCIAL_ANALYSIS_PROMPT = `
You are a Certified Financial Planner (CFP) with 20+ years of experience providing comprehensive financial planning advice. Analyze the provided client financial data and return a detailed financial plan in JSON format.

CRITICAL REQUIREMENTS:
1. Follow fiduciary standards - always act in the client's best interest
2. Provide specific, actionable recommendations
3. Include implementation timelines and expected outcomes
4. Consider current market conditions and economic environment
5. Address all major areas of financial planning
6. Return ONLY valid JSON without any markdown formatting or explanations

JSON STRUCTURE REQUIRED:
{
  "client_summary": {
    "name": "string",
    "age": number,
    "financial_health_score": number (1-100),
    "net_worth": number,
    "monthly_cash_flow": number
  },
  "priority_recommendations": [
    {
      "id": number,
      "category": "string (cash_flow|investment|retirement|debt|insurance|tax)",
      "title": "string",
      "description": "string",
      "priority": "high|medium|low",
      "timeline": "string",
      "estimated_impact": "string",
      "implementation_steps": ["string", "string", ...]
    }
  ],
  "detailed_analysis": {
    "cash_flow": {
      "monthly_surplus_deficit": number,
      "annual_savings_rate": number,
      "recommendations": ["string", ...]
    },
    "investment_strategy": {
      "current_allocation": "string",
      "recommended_allocation": "string", 
      "risk_tolerance_assessment": "string",
      "specific_recommendations": ["string", ...]
    },
    "retirement_planning": {
      "retirement_readiness_score": number (1-100),
      "projected_retirement_income": number,
      "savings_gap": number,
      "catch_up_recommendations": ["string", ...]
    },
    "debt_management": {
      "debt_to_income_ratio": number,
      "total_debt": number,
      "payoff_strategy": "string",
      "priority_debts": ["string", ...]
    },
    "insurance_analysis": {
      "coverage_gaps": ["string", ...],
      "cost_optimization_opportunities": ["string", ...]
    },
    "tax_optimization": {
      "current_tax_efficiency": "string",
      "optimization_opportunities": ["string", ...],
      "estimated_annual_savings": number
    }
  },
  "action_plan": {
    "immediate_actions": ["string", ...],
    "short_term_goals": ["string", ...],
    "long_term_strategy": ["string", ...]
  },
  "disclaimers": ["string", ...]
}

ANALYSIS FOCUS AREAS:
1. Calculate accurate net worth and cash flow
2. Assess emergency fund adequacy (3-6 months expenses)
3. Evaluate debt-to-income ratios and payoff strategies
4. Review retirement savings adequacy and catch-up opportunities
5. Analyze investment allocation and risk tolerance alignment
6. Identify tax optimization opportunities
7. Assess insurance coverage needs
8. Prioritize goals based on urgency and impact
9. Provide specific dollar amounts and timelines
10. Consider life stage and family situation

Client Financial Data:
`;

export async function generateFinancialAnalysis(financialData: FinancialData): Promise<FinancialAnalysis> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.1,
      messages: [
        {
          role: 'user',
          content: FINANCIAL_ANALYSIS_PROMPT + JSON.stringify(financialData, null, 2)
        }
      ]
    });

    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    const analysisText = textContent.text;
    
    // Clean the response to ensure it's valid JSON
    let cleanedResponse = analysisText.trim();
    
    // Remove any markdown code block formatting if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const analysis = JSON.parse(cleanedResponse) as FinancialAnalysis;
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      console.error('Raw response:', analysisText);
      throw new Error('Invalid JSON response from Claude API');
    }
  } catch (error) {
    console.error('Error generating financial analysis:', error);
    throw error;
  }
}

export async function generateQuickInsight(financialData: Partial<FinancialData>, category: string): Promise<string> {
  const prompt = `
As a financial advisor, provide a brief insight about the ${category} based on this financial data.
Keep it under 100 words and focus on actionable advice.

Financial Data:
${JSON.stringify(financialData, null, 2)}
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 150,
      temperature: 0.1,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return textContent.text;
  } catch (error) {
    console.error('Error generating quick insight:', error);
    throw error;
  }
}