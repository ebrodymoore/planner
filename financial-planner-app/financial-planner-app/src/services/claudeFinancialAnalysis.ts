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
    
    try {
      // Prepare data for Claude API
      const claudeRequestData = FinancialDataService.prepareForClaudeAPI(formData);
      
      // Add analysis context
      claudeRequestData.analysis_request = {
        type: request?.type || 'comprehensive',
        priority: request?.priority || 'high',
        focus_areas: request?.focus_areas || this.getDefaultFocusAreas(formData),
        specific_questions: request?.specific_questions || []
      };

      // Generate the Claude API prompt
      const prompt = this.buildFinancialAnalysisPrompt(claudeRequestData);
      
      // Call Claude API
      const claudeResponse = await this.callClaudeAPI(prompt);
      
      if (!claudeResponse) {
        throw new Error('Failed to get response from Claude API');
      }

      // Parse and structure the response
      const structuredResponse = this.parseClaudeResponse(claudeResponse);
      
      // Save the analysis results
      const questionnaireResponse = await FinancialDataService.loadQuestionnaireResponse(userId);
      if (questionnaireResponse) {
        await FinancialDataService.saveAnalysisResults(
          userId,
          questionnaireResponse.id,
          claudeRequestData,
          claudeResponse,
          request?.type || 'comprehensive'
        );
      }

      // Log API usage
      const responseTime = Date.now() - startTime;
      await FinancialDataService.logAPIUsage(
        userId,
        'comprehensive_analysis',
        this.estimateTokenUsage(prompt, claudeResponse.content),
        responseTime,
        true
      );

      return structuredResponse;
      
    } catch (error) {
      console.error('Error generating financial analysis:', error);
      
      // Log the error
      const responseTime = Date.now() - startTime;
      await FinancialDataService.logAPIUsage(
        userId,
        'comprehensive_analysis',
        0,
        responseTime,
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      return null;
    }
  }

  /**
   * Build comprehensive financial analysis prompt for Claude
   */
  private static buildFinancialAnalysisPrompt(requestData: any): string {
    return `You are a Certified Financial Planner (CFP) providing comprehensive financial analysis. Please analyze the following client profile and provide detailed recommendations.

CLIENT PROFILE:
${JSON.stringify(requestData.client_profile, null, 2)}

ANALYSIS CONTEXT:
${JSON.stringify(requestData.analysis_context, null, 2)}

ANALYSIS REQUEST:
${JSON.stringify(requestData.analysis_request, null, 2)}

Please provide a comprehensive financial analysis with the following structure:

## EXECUTIVE SUMMARY
- Overall financial health assessment (1-2 paragraphs)
- Key strengths and areas of concern
- Primary recommendations summary

## DETAILED ANALYSIS

### 1. CASH FLOW & BUDGETING
- Monthly cash flow analysis
- Savings rate assessment
- Budget optimization opportunities
- Emergency fund evaluation

### 2. DEBT MANAGEMENT
- Debt-to-income ratio analysis
- Debt prioritization strategy
- Payoff timeline recommendations
- Refinancing opportunities

### 3. INVESTMENT STRATEGY
- Current asset allocation review
- Risk tolerance alignment
- Diversification assessment
- Tax-efficient investing strategies

### 4. RETIREMENT PLANNING
- Retirement readiness assessment
- Savings rate requirements
- Investment allocation recommendations
- Social Security optimization

### 5. TAX OPTIMIZATION
- Current tax efficiency review
- Tax reduction strategies
- Tax-advantaged account optimization
- Estate tax considerations

### 6. INSURANCE ANALYSIS
- Coverage adequacy assessment
- Gap analysis and recommendations
- Cost optimization opportunities
- Risk mitigation strategies

### 7. ESTATE PLANNING
- Current estate plan review
- Document update recommendations
- Tax minimization strategies
- Legacy planning considerations

## RISK ASSESSMENT
- Overall risk profile
- Identified risk factors
- Mitigation strategies
- Insurance recommendations

## PRIORITIZED ACTION PLAN
For each recommendation, include:
- Priority level (Urgent/High/Medium/Low)
- Timeline for implementation
- Estimated cost/effort
- Potential impact
- Resources needed

## FOLLOW-UP RECOMMENDATIONS
- Monitoring metrics
- Review schedule
- Adjustment triggers
- Professional referrals if needed

Please format the response as valid JSON with the following structure:
{
  "summary": "Executive summary text",
  "detailed_analysis": {
    "cash_flow": {...},
    "debt_management": {...},
    "investment_strategy": {...},
    "retirement_planning": {...},
    "tax_optimization": {...},
    "insurance_analysis": {...},
    "estate_planning": {...}
  },
  "risk_assessment": {
    "overall_risk_level": "moderate",
    "risk_factors": [...],
    "mitigation_strategies": [...],
    "insurance_gaps": [...],
    "emergency_fund_adequacy": "adequate"
  },
  "action_items": [
    {
      "id": "action_1",
      "title": "Build Emergency Fund",
      "description": "...",
      "priority": "high",
      "estimated_time": "3-6 months",
      "category": "cash_flow",
      "potential_impact": "..."
    }
  ],
  "recommendations": [
    {
      "category": "investment",
      "priority": "high",
      "title": "...",
      "description": "...",
      "potential_impact": "...",
      "timeline": "...",
      "complexity": "moderate"
    }
  ],
  "confidence_score": 0.85,
  "follow_up_suggestions": [...]
}

Focus on providing specific, actionable advice based on the client's unique situation. Consider their risk tolerance, time horizon, and stated goals. Be thorough but practical in your recommendations.`;
  }

  /**
   * Call Claude API with the financial analysis prompt
   */
  private static async callClaudeAPI(prompt: string): Promise<any> {
    const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
    const API_KEY = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;

    if (!API_KEY) {
      throw new Error('Claude API key not configured');
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        temperature: 0.3, // Lower temperature for more consistent financial advice
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Parse Claude response into structured format
   */
  private static parseClaudeResponse(claudeResponse: any): AnalysisResponse {
    try {
      // Extract the JSON from Claude's response
      const content = claudeResponse.content[0].text;
      
      // Look for JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Claude response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      // Validate and structure the response
      return {
        summary: parsedData.summary || 'Analysis completed',
        recommendations: parsedData.recommendations || [],
        risk_assessment: parsedData.risk_assessment || {
          overall_risk_level: 'moderate',
          risk_factors: [],
          mitigation_strategies: [],
          insurance_gaps: [],
          emergency_fund_adequacy: 'adequate'
        },
        action_items: parsedData.action_items || [],
        confidence_score: parsedData.confidence_score || 0.8,
        follow_up_suggestions: parsedData.follow_up_suggestions || []
      };

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