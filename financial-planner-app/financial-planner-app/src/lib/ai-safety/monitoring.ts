// Comprehensive monitoring and analytics for AI system performance

import { 
  MonitoringMetrics, 
  AnalysisResult, 
  CompressedFinancialData, 
  UserFeedback,
  HallucinationFlag
} from './types';

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  metrics: {
    averageResponseTime: number;
    successRate: number;
    hallucinationRate: number;
    humanReviewRate: number;
    cacheHitRate: number;
    costPerAnalysis: number;
  };
  alerts: Alert[];
  recommendations: string[];
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  category: 'performance' | 'accuracy' | 'safety' | 'cost';
  actionRequired: boolean;
}

export interface PerformanceReport {
  period: { start: number; end: number };
  totalAnalyses: number;
  metrics: {
    responseTime: {
      mean: number;
      median: number;
      p95: number;
      p99: number;
    };
    accuracy: {
      validationPassRate: number;
      averageConfidence: number;
      hallucinationsByType: Record<string, number>;
    };
    userSatisfaction: {
      averageRating: number;
      helpfulnessRate: number;
      accuracyRate: number;
    };
    costs: {
      totalTokens: number;
      totalCost: number;
      costPerAnalysis: number;
      cacheEfficiency: number;
    };
  };
  trends: {
    responseTimeChange: number;
    accuracyChange: number;
    costChange: number;
  };
}

export class AISystemMonitor {
  private metrics: MonitoringMetrics[] = [];
  private feedback: UserFeedback[] = [];
  private alerts: Alert[] = [];
  private readonly MAX_METRICS_HISTORY = 10000;
  private readonly ALERT_THRESHOLDS = {
    responseTime: 30000, // 30 seconds
    hallucinationRate: 0.05, // 5%
    successRate: 0.95, // 95%
    costPerAnalysis: 1.00, // $1.00
    humanReviewRate: 0.20 // 20%
  };

  /**
   * Records metrics for a completed analysis
   */
  recordAnalysis(
    inputData: CompressedFinancialData,
    result: AnalysisResult,
    metrics: MonitoringMetrics,
    hallucinationFlags: HallucinationFlag[]
  ): void {
    const enhancedMetrics: MonitoringMetrics = {
      ...metrics,
      hallucinationFlags,
      costEstimate: this.calculateCost(metrics.tokenUsage),
      timestamp: Date.now(),
      inputComplexity: this.calculateInputComplexity(inputData),
      outputQuality: this.assessOutputQuality(result),
      cacheUsed: metrics.responseTime < 1000 // Assume cache if very fast
    };

    this.metrics.push(enhancedMetrics);

    // Trim old metrics to prevent memory bloat
    if (this.metrics.length > this.MAX_METRICS_HISTORY) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS_HISTORY);
    }

    // Check for alerts
    this.checkAlerts(enhancedMetrics);

    // Log for external monitoring systems
    this.logToExternalMonitoring(enhancedMetrics);
  }

  /**
   * Records user feedback for quality monitoring
   */
  recordUserFeedback(
    analysisId: string,
    feedback: UserFeedback
  ): void {
    const enhancedFeedback = {
      ...feedback,
      analysisId,
      timestamp: Date.now()
    };

    this.feedback.push(enhancedFeedback);

    // Alert on negative feedback patterns
    this.checkFeedbackAlerts(enhancedFeedback);
  }

  /**
   * Generates system health report
   */
  getSystemHealth(): SystemHealth {
    const recentMetrics = this.getRecentMetrics(24 * 60 * 60 * 1000); // Last 24 hours
    const recentFeedback = this.getRecentFeedback(24 * 60 * 60 * 1000);

    if (recentMetrics.length === 0) {
      return {
        status: 'warning',
        metrics: {
          averageResponseTime: 0,
          successRate: 0,
          hallucinationRate: 0,
          humanReviewRate: 0,
          cacheHitRate: 0,
          costPerAnalysis: 0
        },
        alerts: [this.createAlert('warning', 'No recent analysis data available', 'performance')],
        recommendations: ['Monitor system for recent activity']
      };
    }

    const metrics = {
      averageResponseTime: this.calculateAverage(recentMetrics.map(m => m.responseTime)),
      successRate: recentMetrics.filter(m => m.validationsPassed > m.validationsPassed * 0.8).length / recentMetrics.length,
      hallucinationRate: recentMetrics.filter(m => (m as any).hallucinationFlags?.length > 0).length / recentMetrics.length,
      humanReviewRate: recentMetrics.filter(m => (m as any).requiresHumanReview).length / recentMetrics.length,
      cacheHitRate: recentMetrics.filter(m => (m as any).cacheUsed).length / recentMetrics.length,
      costPerAnalysis: this.calculateAverage(recentMetrics.map(m => m.costEstimate))
    };

    const status = this.determineSystemStatus(metrics);
    const activeAlerts = this.getActiveAlerts();
    const recommendations = this.generateRecommendations(metrics, activeAlerts);

    return {
      status,
      metrics,
      alerts: activeAlerts,
      recommendations
    };
  }

  /**
   * Generates detailed performance report
   */
  generatePerformanceReport(startTime: number, endTime: number): PerformanceReport {
    const periodMetrics = this.metrics.filter(m => 
      (m as any).timestamp >= startTime && (m as any).timestamp <= endTime
    );
    const periodFeedback = this.feedback.filter(f => 
      (f as any).timestamp >= startTime && (f as any).timestamp <= endTime
    );

    if (periodMetrics.length === 0) {
      throw new Error('No data available for the specified period');
    }

    const responseTimes = periodMetrics.map(m => m.responseTime);
    const tokenUsages = periodMetrics.map(m => m.tokenUsage);
    const costEstimates = periodMetrics.map(m => m.costEstimate);

    return {
      period: { start: startTime, end: endTime },
      totalAnalyses: periodMetrics.length,
      metrics: {
        responseTime: {
          mean: this.calculateAverage(responseTimes),
          median: this.calculateMedian(responseTimes),
          p95: this.calculatePercentile(responseTimes, 0.95),
          p99: this.calculatePercentile(responseTimes, 0.99)
        },
        accuracy: {
          validationPassRate: this.calculateAverage(periodMetrics.map(m => m.validationsPassed / (m.validationsPassed + 1))),
          averageConfidence: this.calculateAverage(periodMetrics.map(m => (m as any).confidence || 0.8)),
          hallucinationsByType: this.countHallucinationsByType(periodMetrics)
        },
        userSatisfaction: {
          averageRating: this.calculateAverage(periodFeedback.map(f => f.rating)),
          helpfulnessRate: periodFeedback.filter(f => f.helpful).length / Math.max(1, periodFeedback.length),
          accuracyRate: periodFeedback.filter(f => f.accurate).length / Math.max(1, periodFeedback.length)
        },
        costs: {
          totalTokens: tokenUsages.reduce((sum, tokens) => sum + tokens, 0),
          totalCost: costEstimates.reduce((sum, cost) => sum + cost, 0),
          costPerAnalysis: this.calculateAverage(costEstimates),
          cacheEfficiency: periodMetrics.filter(m => (m as any).cacheUsed).length / periodMetrics.length
        }
      },
      trends: this.calculateTrends(periodMetrics)
    };
  }

  /**
   * Real-time monitoring dashboard data
   */
  getDashboardData() {
    const last24h = this.getRecentMetrics(24 * 60 * 60 * 1000);
    const last1h = this.getRecentMetrics(60 * 60 * 1000);

    return {
      realTime: {
        analysesLastHour: last1h.length,
        averageResponseTime: this.calculateAverage(last1h.map(m => m.responseTime)),
        activeAlerts: this.getActiveAlerts().length,
        systemStatus: this.getSystemHealth().status
      },
      trends: {
        analysesLast24h: last24h.length,
        responseTimeTrend: this.calculateTrend(last24h.map(m => m.responseTime)),
        costTrend: this.calculateTrend(last24h.map(m => m.costEstimate)),
        qualityTrend: this.calculateTrend(last24h.map(m => m.validationsPassed))
      },
      topIssues: this.getTopIssues(),
      costBreakdown: this.getCostBreakdown(last24h),
      userFeedbackSummary: this.getUserFeedbackSummary()
    };
  }

  /**
   * Anomaly detection for unusual patterns
   */
  detectAnomalies(): Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    value: number;
    threshold: number;
  }> {
    const anomalies = [];
    const recent = this.getRecentMetrics(60 * 60 * 1000); // Last hour

    if (recent.length < 5) return anomalies; // Need minimum data

    // Response time anomaly
    const avgResponseTime = this.calculateAverage(recent.map(m => m.responseTime));
    const historical = this.getRecentMetrics(7 * 24 * 60 * 60 * 1000); // Last week
    const historicalAvg = this.calculateAverage(historical.map(m => m.responseTime));
    
    if (avgResponseTime > historicalAvg * 2) {
      anomalies.push({
        type: 'response_time_spike',
        severity: 'high',
        description: 'Response time significantly higher than normal',
        value: avgResponseTime,
        threshold: historicalAvg * 2
      });
    }

    // Cost anomaly
    const avgCost = this.calculateAverage(recent.map(m => m.costEstimate));
    const historicalCost = this.calculateAverage(historical.map(m => m.costEstimate));
    
    if (avgCost > historicalCost * 1.5) {
      anomalies.push({
        type: 'cost_spike',
        severity: 'medium',
        description: 'Cost per analysis higher than normal',
        value: avgCost,
        threshold: historicalCost * 1.5
      });
    }

    // Hallucination rate anomaly
    const hallucinationRate = recent.filter(m => (m as any).hallucinationFlags?.length > 0).length / recent.length;
    if (hallucinationRate > this.ALERT_THRESHOLDS.hallucinationRate) {
      anomalies.push({
        type: 'hallucination_spike',
        severity: 'high',
        description: 'Higher than normal hallucination rate detected',
        value: hallucinationRate,
        threshold: this.ALERT_THRESHOLDS.hallucinationRate
      });
    }

    return anomalies;
  }

  /**
   * Private helper methods
   */
  private calculateCost(tokenUsage: number): number {
    // Estimate cost based on token usage
    // Using approximate GPT-4 pricing: $0.03 per 1K tokens input, $0.06 per 1K tokens output
    // Assume 70% input, 30% output
    const inputTokens = tokenUsage * 0.7;
    const outputTokens = tokenUsage * 0.3;
    return (inputTokens / 1000) * 0.03 + (outputTokens / 1000) * 0.06;
  }

  private calculateInputComplexity(data: CompressedFinancialData): number {
    // Simple complexity score based on various factors
    let score = 0;
    
    if (data.hasHighValueAssets) score += 20;
    if (data.hasComplexDebts) score += 15;
    if (data.age > 60) score += 10;
    if (data.yearsToRetirement < 10) score += 10;
    if (data.debtToIncomeRatio > 0.4) score += 15;
    if (data.netWorth < 0) score += 20;
    if (data.riskProfile === 'aggressive' && data.age > 50) score += 10;

    return Math.min(100, score);
  }

  private assessOutputQuality(result: AnalysisResult): number {
    let score = 100;

    // Deduct for missing sections
    if (!result.emergency_fund) score -= 20;
    if (!result.retirement_readiness) score -= 20;
    if (!result.disclaimers || result.disclaimers.length === 0) score -= 30;

    // Deduct for low confidence
    if (result.metadata.confidence < 0.8) score -= 20;
    if (result.metadata.confidence < 0.6) score -= 30;

    // Deduct for requiring human review
    if (result.metadata.requiresHumanReview) score -= 10;

    return Math.max(0, score);
  }

  private checkAlerts(metrics: MonitoringMetrics): void {
    // Response time alert
    if (metrics.responseTime > this.ALERT_THRESHOLDS.responseTime) {
      this.addAlert('warning', `Slow response time: ${metrics.responseTime}ms`, 'performance');
    }

    // Cost alert
    if (metrics.costEstimate > this.ALERT_THRESHOLDS.costPerAnalysis) {
      this.addAlert('warning', `High cost analysis: $${metrics.costEstimate.toFixed(2)}`, 'cost');
    }

    // Validation failure alert
    if (metrics.validationsPassed < 15) {
      this.addAlert('error', `Low validation pass rate: ${metrics.validationsPassed}/20`, 'accuracy');
    }
  }

  private checkFeedbackAlerts(feedback: UserFeedback & { timestamp: number }): void {
    if (feedback.rating <= 2) {
      this.addAlert('warning', `Poor user rating: ${feedback.rating}/5`, 'accuracy');
    }

    if (feedback.flagged_content) {
      this.addAlert('error', `User flagged content: ${feedback.flagged_content}`, 'safety');
    }
  }

  private addAlert(severity: Alert['severity'], message: string, category: Alert['category']): void {
    const alert: Alert = {
      id: crypto.randomUUID(),
      severity,
      message,
      timestamp: Date.now(),
      category,
      actionRequired: severity === 'error' || severity === 'critical'
    };

    this.alerts.push(alert);

    // Keep only recent alerts (last 7 days)
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(a => a.timestamp > weekAgo);
  }

  private getRecentMetrics(timeWindow: number): MonitoringMetrics[] {
    const cutoff = Date.now() - timeWindow;
    return this.metrics.filter(m => (m as any).timestamp > cutoff);
  }

  private getRecentFeedback(timeWindow: number): UserFeedback[] {
    const cutoff = Date.now() - timeWindow;
    return this.feedback.filter(f => (f as any).timestamp > cutoff);
  }

  private getActiveAlerts(): Alert[] {
    const hourAgo = Date.now() - (60 * 60 * 1000);
    return this.alerts.filter(a => a.timestamp > hourAgo);
  }

  private determineSystemStatus(metrics: SystemHealth['metrics']): SystemHealth['status'] {
    if (metrics.successRate < 0.9 || metrics.hallucinationRate > 0.1) {
      return 'critical';
    }
    
    if (metrics.averageResponseTime > 20000 || metrics.humanReviewRate > 0.3) {
      return 'warning';
    }

    return 'healthy';
  }

  private generateRecommendations(metrics: SystemHealth['metrics'], alerts: Alert[]): string[] {
    const recommendations = [];

    if (metrics.averageResponseTime > 15000) {
      recommendations.push('Consider optimizing prompt size or implementing request queuing');
    }

    if (metrics.cacheHitRate < 0.3) {
      recommendations.push('Review caching strategy to improve performance and reduce costs');
    }

    if (metrics.hallucinationRate > 0.05) {
      recommendations.push('Review prompt engineering and validation rules');
    }

    if (metrics.humanReviewRate > 0.25) {
      recommendations.push('Consider adjusting human review thresholds');
    }

    if (alerts.filter(a => a.category === 'cost').length > 0) {
      recommendations.push('Implement token usage optimization strategies');
    }

    return recommendations;
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.length > 0 ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
  }

  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private calculatePercentile(numbers: number[], percentile: number): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  private countHallucinationsByType(metrics: MonitoringMetrics[]): Record<string, number> {
    const counts: Record<string, number> = {};
    
    for (const metric of metrics) {
      const flags = (metric as any).hallucinationFlags || [];
      for (const flag of flags) {
        counts[flag.type] = (counts[flag.type] || 0) + 1;
      }
    }

    return counts;
  }

  private calculateTrends(metrics: MonitoringMetrics[]): PerformanceReport['trends'] {
    // Simple trend calculation - could be enhanced with linear regression
    const midpoint = Math.floor(metrics.length / 2);
    const firstHalf = metrics.slice(0, midpoint);
    const secondHalf = metrics.slice(midpoint);

    const firstResponse = this.calculateAverage(firstHalf.map(m => m.responseTime));
    const secondResponse = this.calculateAverage(secondHalf.map(m => m.responseTime));

    const firstAccuracy = this.calculateAverage(firstHalf.map(m => m.validationsPassed));
    const secondAccuracy = this.calculateAverage(secondHalf.map(m => m.validationsPassed));

    const firstCost = this.calculateAverage(firstHalf.map(m => m.costEstimate));
    const secondCost = this.calculateAverage(secondHalf.map(m => m.costEstimate));

    return {
      responseTimeChange: (secondResponse - firstResponse) / firstResponse,
      accuracyChange: (secondAccuracy - firstAccuracy) / firstAccuracy,
      costChange: (secondCost - firstCost) / firstCost
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const recent = values.slice(-Math.floor(values.length / 3));
    const older = values.slice(0, Math.floor(values.length / 3));
    const recentAvg = this.calculateAverage(recent);
    const olderAvg = this.calculateAverage(older);
    return olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0;
  }

  private getTopIssues(): Array<{ issue: string; count: number; severity: string }> {
    const issues = new Map<string, { count: number; severity: string }>();
    
    for (const alert of this.getActiveAlerts()) {
      const existing = issues.get(alert.message) || { count: 0, severity: alert.severity };
      issues.set(alert.message, { 
        count: existing.count + 1, 
        severity: alert.severity 
      });
    }

    return Array.from(issues.entries())
      .map(([issue, data]) => ({ issue, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getCostBreakdown(metrics: MonitoringMetrics[]) {
    const totalCost = metrics.reduce((sum, m) => sum + m.costEstimate, 0);
    const totalTokens = metrics.reduce((sum, m) => sum + m.tokenUsage, 0);
    
    return {
      totalCost,
      totalTokens,
      averageCostPerAnalysis: this.calculateAverage(metrics.map(m => m.costEstimate)),
      cacheHitRate: metrics.filter(m => (m as any).cacheUsed).length / metrics.length
    };
  }

  private getUserFeedbackSummary() {
    const recent = this.getRecentFeedback(24 * 60 * 60 * 1000);
    
    return {
      totalFeedback: recent.length,
      averageRating: this.calculateAverage(recent.map(f => f.rating)),
      positiveRate: recent.filter(f => f.rating >= 4).length / Math.max(1, recent.length),
      helpfulRate: recent.filter(f => f.helpful).length / Math.max(1, recent.length)
    };
  }

  private logToExternalMonitoring(metrics: MonitoringMetrics): void {
    // In production, this would send to external monitoring systems
    // like DataDog, New Relic, CloudWatch, etc.
    console.log('AI Metrics:', {
      responseTime: metrics.responseTime,
      tokenUsage: metrics.tokenUsage,
      validationsPassed: metrics.validationsPassed,
      cost: metrics.costEstimate
    });
  }
}

// Export singleton instance
export const aiMonitor = new AISystemMonitor();