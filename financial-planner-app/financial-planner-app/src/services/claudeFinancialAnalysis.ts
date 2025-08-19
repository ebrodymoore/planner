import { FinancialDataService } from './financialDataService';
import { FormData } from '@/types/financial';

export interface AnalysisRequest {
  type: 'comprehensive' | 'focused' | 'update' | 'follow_up';
  priority: 'high' | 'medium' | 'low';
  focus_areas?: string[];
  specific_questions?: string[];
}

export interface AnalysisResponse {
  summary: string;
  recommendations: FinancialRecommendation[];
  risk_assessment: RiskAssessment;
  action_items: ActionItem[];
  confidence_score: number;
  follow_up_suggestions: string[];
}

export interface FinancialRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  potential_impact: string;
  timeline: string;
  complexity: 'simple' | 'moderate' | 'complex';
  estimated_cost?: number;
  resources_needed?: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimated_time: string;
  deadline?: string;
  dependencies?: string[];
  category: string;
}

export interface RiskFactor {
  type: string;
  category: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  likelihood: 'low' | 'moderate' | 'high';
  potential_impact: string;
}

export interface RiskAssessment {
  overall_risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  risk_factors: RiskFactor[];
  mitigation_strategies: string[];
  insurance_gaps: string[];
  emergency_fund_adequacy: 'adequate' | 'insufficient' | 'excessive';
}

export class ClaudeFinancialAnalysis {
  
  /**
   * Generate comprehensive financial analysis
   */
  static async generateComprehensiveAnalysis(
    userId: string,
    formData: FormData,
    request?: AnalysisRequest
  ): Promise<AnalysisResponse | null> {
    const startTime = Date.now();
    const sessionId = `${userId}-${startTime}`;
    
    console.log(`🤖 [CLAUDE-${sessionId}] Starting comprehensive analysis generation`);
    
    try {
      console.log(`🤖 [CLAUDE-${sessionId}] Step 1: Preparing data for Claude API...`);
      
      // Prepare data for Claude API
      const claudeRequestData = FinancialDataService.prepareForClaudeAPI(formData);
      console.log(`🤖 [CLAUDE-${sessionId}] Data prepared:`, {
        hasClientProfile: !!claudeRequestData.client_profile,
        clientProfileKeys: claudeRequestData.client_profile ? Object.keys(claudeRequestData.client_profile) : 'none'
      });
      
      console.log(`🤖 [CLAUDE-${sessionId}] Step 2: Adding analysis context...`);
      
      // Add analysis context
      claudeRequestData.analysis_request = {
        type: request?.type || 'comprehensive',
        priority: request?.priority || 'high',
        focus_areas: request?.focus_areas || this.getDefaultFocusAreas(formData),
        specific_questions: request?.specific_questions || []
      };
      
      console.log(`🤖 [CLAUDE-${sessionId}] Analysis context added:`, claudeRequestData.analysis_request);

      console.log(`🤖 [CLAUDE-${sessionId}] Step 3: Building Claude API prompt...`);
      
      // Generate the Claude API prompt
      const prompt = this.buildFinancialAnalysisPrompt(claudeRequestData);
      console.log(`🤖 [CLAUDE-${sessionId}] Prompt built, length: ${prompt.length} characters`);
      
      console.log(`🤖 [CLAUDE-${sessionId}] Step 4: Calling Claude API...`);
      
      // Call Claude API
      const claudeResponse = await this.callClaudeAPI(prompt);
      
      console.log(`🤖 [CLAUDE-${sessionId}] Claude API response received:`, {
        hasResponse: !!claudeResponse,
        responseType: typeof claudeResponse,
        responseKeys: claudeResponse ? Object.keys(claudeResponse) : 'none'
      });
      
      if (!claudeResponse) {
        console.log(`🤖 [CLAUDE-${sessionId}] ERROR: No response from Claude API`);
        throw new Error('Failed to get response from Claude API');
      }

      console.log(`🤖 [CLAUDE-${sessionId}] Step 5: Parsing Claude response...`);
      
      // Parse and structure the response
      const structuredResponse = this.parseClaudeResponse(claudeResponse);
      
      console.log(`🤖 [CLAUDE-${sessionId}] Response parsed successfully:`, {
        hasStructuredResponse: !!structuredResponse,
        responseType: typeof structuredResponse,
        responseKeys: structuredResponse ? Object.keys(structuredResponse) : 'none'
      });
      
      console.log(`🤖 [CLAUDE-${sessionId}] Step 6: Loading questionnaire response for saving...`);
      
      // Save the analysis results
      const questionnaireResponse = await FinancialDataService.loadQuestionnaireResponse(userId);
      console.log(`🤖 [CLAUDE-${sessionId}] Questionnaire response loaded:`, {
        hasQuestionnaireResponse: !!questionnaireResponse,
        questionnaireId: questionnaireResponse?.id || 'none'
      });
      
      if (questionnaireResponse) {
        console.log(`🤖 [CLAUDE-${sessionId}] Step 7: Saving analysis results...`);
        
        await FinancialDataService.saveAnalysisResults(
          userId,
          questionnaireResponse.id,
          claudeRequestData,
          claudeResponse,
          request?.type || 'comprehensive'
        );
        
        console.log(`🤖 [CLAUDE-${sessionId}] Analysis results saved successfully`);
      } else {
        console.log(`🤖 [CLAUDE-${sessionId}] WARNING: No questionnaire response found, skipping save`);
      }

      console.log(`🤖 [CLAUDE-${sessionId}] Step 8: Logging API usage...`);
      
      // Log API usage
      const responseTime = Date.now() - startTime;
      await FinancialDataService.logAPIUsage(
        userId,
        'comprehensive_analysis',
        this.estimateTokenUsage(prompt, claudeResponse.content || claudeResponse.text || ''),
        responseTime,
        true
      );
      
      console.log(`🤖 [CLAUDE-${sessionId}] Analysis generation completed successfully in ${responseTime}ms`);

      return structuredResponse;
      
    } catch (error) {
      console.error(`🤖 [CLAUDE-${sessionId}] CRITICAL ERROR during analysis generation:`, {
        step: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        type: typeof error,
        errorObject: error
      });
      
      // Log the error
      const responseTime = Date.now() - startTime;
      try {
        await FinancialDataService.logAPIUsage(
          userId,
          'comprehensive_analysis',
          0,
          responseTime,
          false,
          error instanceof Error ? error.message : 'Unknown error'
        );
      } catch (logError) {
        console.error(`🤖 [CLAUDE-${sessionId}] Failed to log error:`, logError);
      }
      
      return null;
    }
  }

  /**
   * Build comprehensive financial analysis prompt for Claude
   */
  private static buildFinancialAnalysisPrompt(requestData: any): string {
    const clientDataJson = JSON.stringify(requestData.client_profile, null, 2);
    
    return `You are a Certified Financial Planner (CFP) with 20+ years of experience providing comprehensive financial planning services to high-net-worth individuals. Analyze the provided client financial data and create a detailed, actionable financial plan that matches the quality and depth of plans from top-tier financial advisory firms.

Client Financial Data
${clientDataJson}

Analysis Requirements
Generate a comprehensive financial plan with the following sections. Use specific numbers from the client data and provide detailed calculations, projections, and recommendations.

1. EXECUTIVE SUMMARY
• Calculate current net worth and provide 3-year projection
• Assign overall financial health score (1-100) with justification
• Identify top 3 financial strengths and top 3 areas needing immediate attention
• Summarize progress toward stated goals with specific metrics
• Provide one-paragraph assessment of overall financial trajectory

2. ASSET ALLOCATION ANALYSIS
• Calculate current asset allocation percentages across all accounts
• Recommend target allocation based on age, risk tolerance, and timeline
• Provide specific fund recommendations for 401k, IRA, and taxable accounts
• Calculate projected returns for current vs. recommended allocations
• Identify rebalancing frequency and triggers
• Recommend tax-efficient fund placement across account types

3. RETIREMENT PLANNING PROJECTIONS
• Calculate retirement income need based on current expenses and lifestyle
• Project current retirement savings trajectory to stated retirement age
• Analyze 401k strategy including employer match optimization
• Calculate optimal 401k contribution rate considering match and tax benefits
• Recommend Traditional vs. Roth IRA strategy based on current/future tax brackets
• Project Social Security benefits and optimal claiming strategy
• Estimate healthcare costs in retirement
• Provide Monte Carlo analysis or success probability for retirement goal
• Calculate required monthly savings to meet retirement target

4. DEBT MANAGEMENT STRATEGY
• Analyze all debts with current balances, rates, and terms
• Calculate debt-to-income ratios and compare to optimal targets
• Recommend debt payoff strategy (avalanche vs. snowball with calculations)
• Analyze mortgage: extra payment benefits vs. investment opportunity cost
• Provide specific monthly payment recommendations for optimal debt reduction
• Calculate interest savings from recommended strategies
• Project debt-free timeline with current vs. optimized payments

5. RISK ASSESSMENT & INSURANCE ANALYSIS
• Evaluate current insurance coverage adequacy
• Calculate life insurance needs using income replacement method
• Assess disability insurance needs and gaps
• Analyze property/casualty coverage limits vs. net worth
• Recommend umbrella policy limits
• Calculate HSA optimization strategy and tax benefits
• Assess emergency fund adequacy and recommend optimal target
• Evaluate investment risk alignment with stated risk tolerance

6. CASH FLOW OPTIMIZATION
• Analyze monthly cash flow with income vs. expenses breakdown
• Calculate current savings rate and compare to recommendations for age/goals
• Identify expense optimization opportunities
• Recommend automated savings and investment strategies
• Project cash flow impact of potential income changes
• Calculate optimal emergency fund target and funding timeline
• Recommend budget adjustments to maximize goal achievement

7. TAX OPTIMIZATION STRATEGIES
• Estimate current effective and marginal tax rates
• Calculate optimal 401k contribution for tax efficiency
• Analyze HSA maximization strategy and triple tax advantage
• Recommend Roth conversion opportunities and timing
• Evaluate tax-loss harvesting potential in taxable accounts
• Assess tax implications of potential side business/entrepreneurship
• Recommend tax-advantaged account prioritization
• Calculate tax savings from recommended strategies

8. GOAL-SPECIFIC PLANNING
• Emergency Fund: Calculate optimal target, current gap, funding timeline
• Real Estate Investment: Analyze readiness for rental property investment
• Side Business: Assess capital needs and funding strategy for entrepreneurship
• Second Home: Evaluate budget feasibility and financing options
• Early Retirement: Calculate requirements for stated retirement goal

9. PRIORITIZED ACTION PLAN
Rank recommendations by impact and urgency:

IMMEDIATE (Next 30 Days):
[List 3-5 highest priority actions with specific steps]

SHORT-TERM (3-6 Months):
[List 4-6 actions with timelines and expected outcomes]

MEDIUM-TERM (6-12 Months):
[List 3-5 strategic initiatives with success metrics]

LONG-TERM (1-3 Years):
[List major financial milestones and strategies]

10. ANNUAL REVIEW & MONITORING
• Establish review schedule and key performance indicators
• Define trigger events requiring plan adjustments
• Set specific measurable goals for next 12 months
• Recommend tracking tools and frequency

Calculation Standards
• Use current market assumptions for returns (conservative, moderate, aggressive scenarios)
• Apply appropriate inflation rates (2.5-3% annually)
• Use current tax brackets and regulations
• Show all major calculations with formulas
• Provide ranges and sensitivity analysis where appropriate
• Include assumptions clearly stated

Output Format Requirements
• Use professional financial planning language
• Include specific dollar amounts and percentages throughout
• Provide clear reasoning for all recommendations
• Use bullet points and numbered lists for actionability
• Include relevant financial planning concepts and terminology
• Maintain objective, advisory tone throughout
• Cite specific data points from client information to support recommendations

Please format your response as valid JSON with the following structure:
{
  "executive_summary": {
    "current_net_worth": 0,
    "three_year_projection": 0,
    "financial_health_score": 0,
    "score_justification": "",
    "top_strengths": ["", "", ""],
    "areas_needing_attention": ["", "", ""],
    "goal_progress_summary": "",
    "overall_trajectory": ""
  },
  "asset_allocation": {
    "current_allocation": {
      "cash": 0,
      "stocks": 0,
      "bonds": 0,
      "real_estate": 0,
      "other": 0
    },
    "recommended_allocation": {
      "cash": 0,
      "stocks": 0,
      "bonds": 0,
      "real_estate": 0,
      "other": 0
    },
    "specific_recommendations": [],
    "rebalancing_strategy": "",
    "tax_efficient_placement": ""
  },
  "retirement_planning": {
    "retirement_income_need": 0,
    "current_trajectory": "",
    "savings_gap": 0,
    "monthly_savings_required": 0,
    "401k_strategy": "",
    "ira_strategy": "",
    "social_security_projection": 0,
    "healthcare_cost_estimate": 0,
    "success_probability": 0
  },
  "debt_management": {
    "total_debt": 0,
    "debt_to_income_ratio": 0,
    "recommended_strategy": "",
    "payoff_timeline": "",
    "monthly_payment_plan": {},
    "interest_savings": 0
  },
  "risk_assessment": {
    "overall_risk_level": "",
    "insurance_needs": {
      "life_insurance": 0,
      "disability_insurance": "",
      "property_coverage": "",
      "umbrella_policy": 0
    },
    "emergency_fund_target": 0,
    "current_emergency_fund": 0,
    "risk_factors": [],
    "mitigation_strategies": []
  },
  "cash_flow": {
    "monthly_income": 0,
    "monthly_expenses": 0,
    "net_cash_flow": 0,
    "savings_rate": 0,
    "optimization_opportunities": [],
    "recommended_budget": {}
  },
  "tax_optimization": {
    "current_tax_rate": 0,
    "optimization_strategies": [],
    "annual_tax_savings": 0,
    "account_prioritization": []
  },
  "goal_specific_planning": {
    "emergency_fund": {
      "target": 0,
      "current": 0,
      "timeline": ""
    },
    "goals": []
  },
  "action_items": {
    "immediate": [],
    "short_term": [],
    "medium_term": [],
    "long_term": []
  },
  "monitoring": {
    "review_schedule": "",
    "key_metrics": [],
    "trigger_events": [],
    "next_year_goals": []
  },
  "calculations_and_assumptions": {
    "return_assumptions": {},
    "inflation_rate": 0.025,
    "tax_assumptions": {},
    "key_formulas": []
  },
  "confidence_score": 0.85,
  "follow_up_recommendations": []
}

Provide comprehensive analysis with specific calculations, dollar amounts, and actionable recommendations based on the client's actual financial data.`;
  }

  /**
   * Call Claude API with the financial analysis prompt
   */
  private static async callClaudeAPI(prompt: string): Promise<any> {
    const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
    const API_KEY = process.env.CLAUDE_API_KEY;
    const callId = Date.now().toString();

    console.log(`🔗 [CLAUDE-API-${callId}] Starting Claude API call`);

    if (!API_KEY) {
      console.log(`🔗 [CLAUDE-API-${callId}] ERROR: Claude API key not configured`);
      throw new Error('Claude API key not configured');
    }

    console.log(`🔗 [CLAUDE-API-${callId}] API key present, building request...`);

    const requestBody = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    console.log(`🔗 [CLAUDE-API-${callId}] Request details:`, {
      url: CLAUDE_API_URL,
      model: requestBody.model,
      maxTokens: requestBody.max_tokens,
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 200) + '...'
    });

    try {
      console.log(`🔗 [CLAUDE-API-${callId}] Making fetch request...`);
      
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      console.log(`🔗 [CLAUDE-API-${callId}] Fetch completed:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        console.log(`🔗 [CLAUDE-API-${callId}] Response not OK, reading error data...`);
        
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.log(`🔗 [CLAUDE-API-${callId}] Failed to parse error response:`, parseError);
          errorData = { error: { message: 'Failed to parse error response' } };
        }
        
        console.log(`🔗 [CLAUDE-API-${callId}] Error response:`, errorData);
        throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      console.log(`🔗 [CLAUDE-API-${callId}] Reading successful response...`);
      
      const data = await response.json();
      
      console.log(`🔗 [CLAUDE-API-${callId}] Response parsed successfully:`, {
        dataType: typeof data,
        dataKeys: Object.keys(data),
        hasContent: !!data.content,
        contentLength: data.content ? data.content.length : 0,
        usage: data.usage || 'no usage info'
      });
      
      return data;

    } catch (error) {
      console.error(`🔗 [CLAUDE-API-${callId}] Fetch error:`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        type: typeof error
      });
      throw error;
    }
  }

  /**
   * Parse Claude response into structured format
   */
  private static parseClaudeResponse(claudeResponse: any): AnalysisResponse {
    try {
      console.log('🤖 [DEBUG] Parsing Claude response structure:', typeof claudeResponse, Object.keys(claudeResponse));
      
      // Extract the JSON from Claude's response
      if (!claudeResponse.content || !Array.isArray(claudeResponse.content) || claudeResponse.content.length === 0) {
        throw new Error('Invalid Claude response structure - missing content array');
      }
      
      const content = claudeResponse.content[0].text;
      
      // Look for JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Claude response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      // Convert the new structured format to the expected AnalysisResponse format
      const structuredResponse: AnalysisResponse = {
        summary: parsedData.executive_summary?.overall_trajectory || 'Financial analysis completed',
        recommendations: this.convertToRecommendations(parsedData),
        risk_assessment: {
          overall_risk_level: parsedData.risk_assessment?.overall_risk_level || 'moderate',
          risk_factors: parsedData.risk_assessment?.risk_factors || [],
          mitigation_strategies: parsedData.risk_assessment?.mitigation_strategies || [],
          insurance_gaps: parsedData.risk_assessment?.insurance_needs ? ['Review insurance needs'] : [],
          emergency_fund_adequacy: parsedData.cash_flow?.net_cash_flow > 0 ? 'adequate' : 'insufficient'
        },
        action_items: this.convertToActionItems(parsedData),
        confidence_score: parsedData.confidence_score || 0.8,
        follow_up_suggestions: parsedData.follow_up_recommendations || []
      };

      // Store the full structured data in the response for UI use
      (structuredResponse as any).structured_data = parsedData;

      return structuredResponse;

    } catch (error) {
      console.error('Error parsing Claude response:', error);
      
      // Fallback response
      return {
        summary: 'Financial analysis completed. Please review the detailed recommendations.',
        recommendations: [],
        risk_assessment: {
          overall_risk_level: 'moderate',
          risk_factors: [],
          mitigation_strategies: [],
          insurance_gaps: [],
          emergency_fund_adequacy: 'adequate'
        },
        action_items: [],
        confidence_score: 0.5,
        follow_up_suggestions: ['Schedule follow-up review in 90 days']
      };
    }
  }

  /**
   * Convert structured data to legacy recommendations format
   */
  private static convertToRecommendations(parsedData: any): FinancialRecommendation[] {
    const recommendations: FinancialRecommendation[] = [];

    // Asset allocation recommendations
    if (parsedData.asset_allocation?.specific_recommendations) {
      parsedData.asset_allocation.specific_recommendations.forEach((rec: string, index: number) => {
        recommendations.push({
          category: 'investment',
          priority: 'high',
          title: `Asset Allocation Optimization ${index + 1}`,
          description: rec,
          potential_impact: 'Improved portfolio performance and risk management',
          timeline: '30-90 days',
          complexity: 'moderate'
        });
      });
    }

    // Tax optimization recommendations
    if (parsedData.tax_optimization?.optimization_strategies) {
      parsedData.tax_optimization.optimization_strategies.forEach((strategy: string, index: number) => {
        recommendations.push({
          category: 'tax',
          priority: 'medium',
          title: `Tax Optimization ${index + 1}`,
          description: strategy,
          potential_impact: `Potential annual savings: $${parsedData.tax_optimization.annual_tax_savings || 0}`,
          timeline: '3-6 months',
          complexity: 'moderate'
        });
      });
    }

    // Cash flow recommendations
    if (parsedData.cash_flow?.optimization_opportunities) {
      parsedData.cash_flow.optimization_opportunities.forEach((opp: string, index: number) => {
        recommendations.push({
          category: 'cash_flow',
          priority: 'high',
          title: `Cash Flow Optimization ${index + 1}`,
          description: opp,
          potential_impact: 'Increased savings capacity and financial flexibility',
          timeline: '30-60 days',
          complexity: 'simple'
        });
      });
    }

    return recommendations;
  }

  /**
   * Convert structured data to legacy action items format
   */
  private static convertToActionItems(parsedData: any): ActionItem[] {
    const actionItems: ActionItem[] = [];

    // Immediate actions
    if (parsedData.action_items?.immediate) {
      parsedData.action_items.immediate.forEach((action: string, index: number) => {
        actionItems.push({
          id: `immediate_${index + 1}`,
          title: action,
          description: `High-priority action requiring immediate attention`,
          priority: 'urgent',
          estimated_time: '1-2 weeks',
          category: 'immediate'
        });
      });
    }

    // Short-term actions
    if (parsedData.action_items?.short_term) {
      parsedData.action_items.short_term.forEach((action: string, index: number) => {
        actionItems.push({
          id: `short_term_${index + 1}`,
          title: action,
          description: `Short-term strategic action`,
          priority: 'high',
          estimated_time: '1-3 months',
          category: 'short_term'
        });
      });
    }

    // Medium-term actions
    if (parsedData.action_items?.medium_term) {
      parsedData.action_items.medium_term.forEach((action: string, index: number) => {
        actionItems.push({
          id: `medium_term_${index + 1}`,
          title: action,
          description: `Medium-term strategic initiative`,
          priority: 'medium',
          estimated_time: '3-12 months',
          category: 'medium_term'
        });
      });
    }

    return actionItems;
  }

  /**
   * Determine default focus areas based on financial profile
   */
  private static getDefaultFocusAreas(formData: FormData): string[] {
    const focusAreas: string[] = [];
    
    // Analyze the data to determine focus areas
    if (formData.cashFlow && formData.cashFlow.takeHomePay) {
      const savingsRate = this.calculateSavingsRate(formData);
      if (savingsRate < 0.1) focusAreas.push('cash_flow_improvement');
    }

    if (formData.liabilities) {
      const debtLevel = this.assessDebtLevel(formData);
      if (debtLevel === 'high') focusAreas.push('debt_management');
    }

    if (formData.assets) {
      const emergencyFund = this.assessEmergencyFund(formData);
      if (emergencyFund === 'insufficient') focusAreas.push('emergency_fund');
    }

    if (formData.goals && formData.goals.retirementAge) {
      focusAreas.push('retirement_planning');
    }

    // Default focus areas if none identified
    if (focusAreas.length === 0) {
      focusAreas.push('comprehensive_review', 'goal_setting', 'risk_assessment');
    }

    return focusAreas;
  }

  /**
   * Estimate token usage for cost tracking
   */
  private static estimateTokenUsage(prompt: string, response: string): number {
    // Rough estimation: ~4 characters per token
    const promptTokens = Math.ceil(prompt.length / 4);
    const responseTokens = Math.ceil(response.length / 4);
    return promptTokens + responseTokens;
  }

  /**
   * Generate follow-up analysis based on previous results
   */
  static async generateFollowUpAnalysis(
    _userId: string,
    _specificQuestions: string[],
    _previousAnalysisId: string
  ): Promise<AnalysisResponse | null> {
    // Implementation for follow-up analysis
    // This would be a lighter analysis focusing on specific questions
    // and referencing the previous comprehensive analysis
    return null; // Placeholder
  }

  // Helper methods for analysis
  private static calculateSavingsRate(_formData: FormData): number {
    // Calculate savings rate from form data
    return 0.15; // Placeholder
  }

  private static assessDebtLevel(_formData: FormData): 'low' | 'moderate' | 'high' {
    // Assess debt level
    return 'moderate'; // Placeholder
  }

  private static assessEmergencyFund(_formData: FormData): 'adequate' | 'insufficient' | 'excessive' {
    // Assess emergency fund adequacy
    return 'insufficient'; // Placeholder
  }
}