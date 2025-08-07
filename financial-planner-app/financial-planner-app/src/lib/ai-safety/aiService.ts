// Main AI service orchestrator integrating all safety components

import { 
  CompressedFinancialData, 
  AnalysisResult, 
  AnalysisTier,
  PlanSection,
  ValidationResult,
  MonitoringMetrics,
  AIResponseMetadata
} from './types';

import { FinancialDataProcessor } from './dataProcessor';
import { dataValidator } from './dataValidation';
import { promptEngine } from './promptEngineering';
import { responseValidator } from './responseValidation';
import { AnalysisCacheManager } from './cacheManager';

export class FinancialAIService {
  private static instance: FinancialAIService;
  private readonly dataProcessor: FinancialDataProcessor;
  private metrics: MonitoringMetrics;

  private constructor() {
    this.dataProcessor = new FinancialDataProcessor();
    this.metrics = {
      totalRequests: 0,
      successfulResponses: 0,
      failedResponses: 0,
      cachedResponses: 0,
      averageProcessingTime: 0,
      averageConfidence: 0,
      humanReviewsTriggered: 0,
      hallucinationsFlagged: 0,
      averageTokenUsage: 0
    };
  }

  static getInstance(): FinancialAIService {
    if (!FinancialAIService.instance) {
      FinancialAIService.instance = new FinancialAIService();
    }
    return FinancialAIService.instance;
  }

  /**
   * Main entry point for financial analysis with full safety pipeline
   */
  async generateFinancialAnalysis(
    rawFinancialData: any,
    sections: PlanSection[],
    tier: AnalysisTier,
    options: {
      useCache?: boolean;
      maxRetries?: number;
      fallbackToRules?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    result?: AnalysisResult;
    error?: string;
    metadata: {
      source: 'cache' | 'ai' | 'fallback';
      processingTime: number;
      confidence: number;
      requiresHumanReview: boolean;
    };
  }> {
    const startTime = Date.now();
    const { useCache = true, maxRetries = 2, fallbackToRules = true } = options;

    this.metrics.totalRequests++;

    try {
      // 1. Validate and compress input data
      const dataValidation = dataValidator.validateFinancialData(rawFinancialData);
      if (!dataValidation.isValid) {
        this.metrics.failedResponses++;
        return {
          success: false,
          error: `Invalid input data: ${dataValidation.errors.join(', ')}`,
          metadata: {
            source: 'ai',
            processingTime: Date.now() - startTime,
            confidence: 0,
            requiresHumanReview: true
          }
        };
      }

      const compressedData = this.dataProcessor.compressFinancialData(rawFinancialData);

      // 2. Check cache first (if enabled)
      if (useCache) {
        const cachedResult = AnalysisCacheManager.getCachedAnalysis(compressedData);
        if (cachedResult) {
          this.metrics.cachedResponses++;
          this.updateAverageMetrics(
            Date.now() - startTime, 
            cachedResult.metadata.confidence, 
            cachedResult.metadata.tokenUsage || 0
          );

          return {
            success: true,
            result: cachedResult,
            metadata: {
              source: 'cache',
              processingTime: Date.now() - startTime,
              confidence: cachedResult.metadata.confidence,
              requiresHumanReview: cachedResult.metadata.requiresHumanReview
            }
          };
        }

        // Check for similar cached analysis
        const similarResult = AnalysisCacheManager.findSimilarAnalysis(compressedData);
        if (similarResult) {
          this.metrics.cachedResponses++;
          this.updateAverageMetrics(
            Date.now() - startTime, 
            similarResult.metadata.confidence, 
            similarResult.metadata.tokenUsage || 0
          );

          return {
            success: true,
            result: similarResult,
            metadata: {
              source: 'cache',
              processingTime: Date.now() - startTime,
              confidence: similarResult.metadata.confidence * 0.95, // Slight reduction for similarity match
              requiresHumanReview: similarResult.metadata.requiresHumanReview
            }
          };
        }
      }

      // 3. Generate AI analysis with retries
      let aiResult: AnalysisResult | null = null;
      let lastError: string = '';

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const aiResponse = await this.callAIAnalysis(compressedData, sections, tier);
          
          if (aiResponse) {
            aiResult = aiResponse;
            break;
          }
        } catch (error) {
          lastError = error instanceof Error ? error.message : 'Unknown error';
          console.warn(`AI analysis attempt ${attempt} failed:`, lastError);
          
          if (attempt === maxRetries) {
            this.metrics.failedResponses++;
          }
        }
      }

      // 4. Use fallback if AI failed and fallback enabled
      if (!aiResult && fallbackToRules) {
        console.log('Using rule-based fallback analysis');
        aiResult = responseValidator.generateFallbackResponse(compressedData, sections);
        
        this.metrics.successfulResponses++;
        this.updateAverageMetrics(
          Date.now() - startTime, 
          aiResult.metadata.confidence, 
          0 // No token usage for rule-based
        );

        return {
          success: true,
          result: aiResult,
          metadata: {
            source: 'fallback',
            processingTime: Date.now() - startTime,
            confidence: aiResult.metadata.confidence,
            requiresHumanReview: aiResult.metadata.requiresHumanReview
          }
        };
      }

      // 5. Return AI result if successful
      if (aiResult) {
        // Cache successful result
        if (useCache) {
          AnalysisCacheManager.setCachedAnalysis(compressedData, aiResult);
        }

        this.metrics.successfulResponses++;
        this.updateAverageMetrics(
          Date.now() - startTime, 
          aiResult.metadata.confidence, 
          aiResult.metadata.tokenUsage || 0
        );

        return {
          success: true,
          result: aiResult,
          metadata: {
            source: 'ai',
            processingTime: Date.now() - startTime,
            confidence: aiResult.metadata.confidence,
            requiresHumanReview: aiResult.metadata.requiresHumanReview
          }
        };
      }

      // 6. Complete failure
      this.metrics.failedResponses++;
      return {
        success: false,
        error: `AI analysis failed after ${maxRetries} attempts: ${lastError}`,
        metadata: {
          source: 'ai',
          processingTime: Date.now() - startTime,
          confidence: 0,
          requiresHumanReview: true
        }
      };

    } catch (error) {
      this.metrics.failedResponses++;
      console.error('Financial AI Service error:', error);
      
      return {
        success: false,
        error: 'System error occurred during analysis',
        metadata: {
          source: 'ai',
          processingTime: Date.now() - startTime,
          confidence: 0,
          requiresHumanReview: true
        }
      };
    }
  }

  /**
   * Calls AI analysis with full safety pipeline
   */
  private async callAIAnalysis(
    data: CompressedFinancialData,
    sections: PlanSection[],
    tier: AnalysisTier
  ): Promise<AnalysisResult | null> {
    const startTime = Date.now();

    try {
      // 1. Generate optimized prompt
      const prompt = promptEngine.generateAnalysisPrompt(data, sections, tier);

      // 2. Call AI service (placeholder - in real implementation, this would call OpenAI, etc.)
      const rawResponse = await this.mockAICall(prompt, tier.maxTokens);

      // 3. Validate AI response
      const validation = responseValidator.validateAIResponse(
        rawResponse, 
        data, 
        startTime
      );

      if (!validation.isValid || !validation.validatedResponse) {
        console.warn('AI response validation failed:', validation.errors);
        this.metrics.hallucinationsFlagged++;
        return null;
      }

      // 4. Track human review requirements
      if (validation.validatedResponse.metadata.requiresHumanReview) {
        this.metrics.humanReviewsTriggered++;
      }

      return validation.validatedResponse;

    } catch (error) {
      console.error('AI call failed:', error);
      return null;
    }
  }

  /**
   * Mock AI call for development (replace with real AI service)
   */
  private async mockAICall(prompt: string, maxTokens: number): Promise<any> {
    // Simulate AI response time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Return mock response based on prompt analysis
    if (prompt.includes('emergency_fund')) {
      return {
        emergency_fund: {
          current_months: 2.5,
          recommended_amount: 15000,
          priority: "high",
          reasoning: "Current emergency fund is below recommended 3-6 month standard"
        },
        disclaimers: [
          "This analysis is for educational purposes only",
          "Consult with a licensed financial advisor for personalized advice"
        ]
      };
    }

    // Default comprehensive response
    return {
      emergency_fund: {
        current_months: 3.5,
        recommended_amount: 18000,
        priority: "medium",
        reasoning: "Emergency fund meets basic requirements but could be optimized"
      },
      debt_strategy: {
        recommended_method: "avalanche",
        payoff_timeline: "Focus on highest interest debt first",
        priority_debts: ["Credit Cards", "Personal Loans"],
        estimated_savings: 2400
      },
      retirement_readiness: {
        score: 65,
        on_track: true,
        additional_monthly_needed: 300,
        projected_retirement_income: 4200,
        confidence_level: 0.8
      },
      asset_allocation: {
        recommended_stocks: 70,
        recommended_bonds: 25,
        recommended_cash: 5,
        rebalancing_needed: true
      },
      action_items: {
        immediate: ["Review emergency fund allocation"],
        short_term: ["Increase retirement contributions"],
        medium_term: ["Rebalance investment portfolio"],
        long_term: ["Review comprehensive financial plan annually"]
      },
      disclaimers: [
        "This analysis is for educational purposes only",
        "Consult with a licensed financial advisor for personalized advice",
        "Past performance does not guarantee future returns",
        "All investments carry risk of loss"
      ]
    };
  }

  /**
   * Gets service metrics and performance statistics
   */
  getServiceMetrics(): MonitoringMetrics & {
    cacheStats: ReturnType<typeof AnalysisCacheManager.getCacheStats>;
    successRate: number;
    cacheHitRate: number;
  } {
    const cacheStats = AnalysisCacheManager.getCacheStats();
    const totalResponses = this.metrics.successfulResponses + this.metrics.failedResponses;
    const successRate = totalResponses > 0 ? this.metrics.successfulResponses / totalResponses : 0;
    const cacheHitRate = this.metrics.totalRequests > 0 ? this.metrics.cachedResponses / this.metrics.totalRequests : 0;

    return {
      ...this.metrics,
      cacheStats,
      successRate: Math.round(successRate * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100
    };
  }

  /**
   * Clears all caches and resets metrics
   */
  resetService(): void {
    AnalysisCacheManager.clearCache();
    this.metrics = {
      totalRequests: 0,
      successfulResponses: 0,
      failedResponses: 0,
      cachedResponses: 0,
      averageProcessingTime: 0,
      averageConfidence: 0,
      humanReviewsTriggered: 0,
      hallucinationsFlagged: 0,
      averageTokenUsage: 0
    };
  }

  /**
   * Performs maintenance tasks
   */
  performMaintenance(): {
    cacheEntriesRemoved: number;
    cacheStats: ReturnType<typeof AnalysisCacheManager.getCacheStats>;
  } {
    const entriesRemoved = AnalysisCacheManager.cleanupExpiredEntries();
    const cacheStats = AnalysisCacheManager.getCacheStats();

    return {
      cacheEntriesRemoved: entriesRemoved,
      cacheStats
    };
  }

  /**
   * Pre-warms cache with common scenarios
   */
  preWarmCache(): void {
    AnalysisCacheManager.preWarmCache();
  }

  /**
   * Updates running averages for metrics
   */
  private updateAverageMetrics(processingTime: number, confidence: number, tokenUsage: number): void {
    const totalResponses = this.metrics.successfulResponses + this.metrics.cachedResponses;
    
    this.metrics.averageProcessingTime = (
      (this.metrics.averageProcessingTime * (totalResponses - 1)) + processingTime
    ) / totalResponses;

    this.metrics.averageConfidence = (
      (this.metrics.averageConfidence * (totalResponses - 1)) + confidence
    ) / totalResponses;

    this.metrics.averageTokenUsage = (
      (this.metrics.averageTokenUsage * (totalResponses - 1)) + tokenUsage
    ) / totalResponses;
  }

  /**
   * Validates service health
   */
  healthCheck(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    issues: string[];
    metrics: MonitoringMetrics;
  } {
    const issues: string[] = [];
    const totalResponses = this.metrics.successfulResponses + this.metrics.failedResponses;
    const successRate = totalResponses > 0 ? this.metrics.successfulResponses / totalResponses : 1;

    // Check success rate
    if (successRate < 0.8) {
      issues.push(`Low success rate: ${Math.round(successRate * 100)}%`);
    }

    // Check average confidence
    if (this.metrics.averageConfidence < 0.7) {
      issues.push(`Low average confidence: ${Math.round(this.metrics.averageConfidence * 100)}%`);
    }

    // Check processing time
    if (this.metrics.averageProcessingTime > 10000) { // 10 seconds
      issues.push(`High average processing time: ${Math.round(this.metrics.averageProcessingTime)}ms`);
    }

    // Check hallucination rate
    const hallucinationRate = totalResponses > 0 ? this.metrics.hallucinationsFlagged / totalResponses : 0;
    if (hallucinationRate > 0.1) { // 10% threshold
      issues.push(`High hallucination rate: ${Math.round(hallucinationRate * 100)}%`);
    }

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (issues.length > 0) {
      status = issues.length > 2 ? 'unhealthy' : 'degraded';
    }

    return {
      status,
      issues,
      metrics: this.metrics
    };
  }
}

// Export singleton instance
export const financialAIService = FinancialAIService.getInstance();