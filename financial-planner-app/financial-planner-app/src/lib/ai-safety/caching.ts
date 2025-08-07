// Intelligent caching system for AI responses and cost optimization

import { AnalysisResult, CompressedFinancialData, CacheEntry } from './types';
import crypto from 'crypto';

export class AnalysisCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly MAX_CACHE_SIZE = 1000; // Maximum number of cached entries
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly STALENESS_THRESHOLD = 6 * 60 * 60 * 1000; // 6 hours

  /**
   * Generates a hash key for financial data to enable caching
   */
  generateDataHash(data: CompressedFinancialData): string {
    // Round values to reduce cache fragmentation while maintaining accuracy
    const normalizedData = {
      netWorth: Math.round(data.netWorth / 1000) * 1000, // Round to nearest $1k
      monthlyIncome: Math.round(data.monthlyIncome / 100) * 100, // Round to nearest $100
      monthlyExpenses: Math.round(data.monthlyExpenses / 100) * 100,
      debtToIncomeRatio: Math.round(data.debtToIncomeRatio * 100) / 100, // 2 decimal places
      savingsRate: Math.round(data.savingsRate * 100) / 100,
      emergencyFundMonths: Math.round(data.emergencyFundMonths * 10) / 10, // 1 decimal place
      retirementSavingsRatio: Math.round(data.retirementSavingsRatio * 100) / 100,
      age: data.age,
      yearsToRetirement: Math.round(data.yearsToRetirement),
      riskProfile: data.riskProfile,
      primaryGoal: data.primaryGoal,
      hasHighValueAssets: data.hasHighValueAssets,
      hasComplexDebts: data.hasComplexDebts
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(normalizedData))
      .digest('hex')
      .substring(0, 16); // Use first 16 characters for shorter keys
  }

  /**
   * Retrieves cached analysis if available and not stale
   */
  getCachedAnalysis(dataHash: string): AnalysisResult | null {
    const entry = this.cache.get(dataHash);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if entry is expired
    if (age > this.CACHE_TTL) {
      this.cache.delete(dataHash);
      return null;
    }

    // Update access statistics
    entry.hitCount++;
    entry.lastAccessed = now;

    // Check if entry is stale but still usable
    if (age > this.STALENESS_THRESHOLD) {
      // Mark as stale in metadata but still return it
      entry.analysis.metadata.confidence *= 0.9;
      entry.analysis.disclaimers.push('Analysis based on cached data - consider regenerating for latest insights');
    }

    return entry.analysis;
  }

  /**
   * Stores analysis result in cache
   */
  setCachedAnalysis(dataHash: string, analysis: AnalysisResult): void {
    // Don't cache low-confidence or human-review-required responses
    if (analysis.metadata.confidence < 0.7 || analysis.metadata.requiresHumanReview) {
      return;
    }

    // Enforce cache size limit
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry = {
      dataHash,
      analysis: this.cloneAnalysis(analysis),
      timestamp: Date.now(),
      hitCount: 0,
      lastAccessed: Date.now()
    };

    this.cache.set(dataHash, entry);
  }

  /**
   * Determines cache effectiveness and hit rate
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    totalHits: number;
    averageAge: number;
    memoryUsage: number;
  } {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hitCount, 0);
    const totalRequests = entries.length + totalHits; // Approximation
    const hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;

    const now = Date.now();
    const averageAge = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + (now - entry.timestamp), 0) / entries.length
      : 0;

    // Rough memory usage estimation
    const memoryUsage = entries.reduce((sum, entry) => {
      return sum + JSON.stringify(entry).length * 2; // Rough bytes estimation
    }, 0);

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      totalHits,
      averageAge: Math.round(averageAge / (1000 * 60)), // Convert to minutes
      memoryUsage: Math.round(memoryUsage / 1024) // Convert to KB
    };
  }

  /**
   * Clears expired cache entries
   */
  cleanupExpiredEntries(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Preemptively warms cache with common scenarios
   */
  warmCache(commonScenarios: CompressedFinancialData[]): void {
    // This would be called during application startup or low-traffic periods
    // to pre-populate cache with analyses for common financial profiles
    
    for (const scenario of commonScenarios) {
      const hash = this.generateDataHash(scenario);
      if (!this.cache.has(hash)) {
        // In a real implementation, this would trigger background analysis
        console.log(`Would warm cache for scenario: ${hash}`);
      }
    }
  }

  /**
   * Invalidates cache entries that might be affected by market changes
   */
  invalidateMarketSensitiveEntries(): number {
    let invalidatedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      // Invalidate entries with asset allocation or retirement projections
      if (entry.analysis.asset_allocation || entry.analysis.retirement_readiness) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    return invalidatedCount;
  }

  /**
   * Finds similar cached analyses for partial matches
   */
  findSimilarAnalyses(data: CompressedFinancialData, tolerance: number = 0.1): CacheEntry[] {
    const similar: CacheEntry[] = [];
    
    for (const entry of this.cache.values()) {
      const similarity = this.calculateSimilarity(data, entry);
      if (similarity > (1 - tolerance)) {
        similar.push(entry);
      }
    }

    return similar.sort((a, b) => b.hitCount - a.hitCount);
  }

  /**
   * Private helper methods
   */
  private evictLeastUsed(): void {
    let leastUsedKey: string | null = null;
    let leastUsedScore = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Score based on hit count and recency (lower is worse)
      const age = Date.now() - entry.lastAccessed;
      const score = entry.hitCount - (age / (1000 * 60 * 60)); // Subtract hours since last access
      
      if (score < leastUsedScore) {
        leastUsedScore = score;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private cloneAnalysis(analysis: AnalysisResult): AnalysisResult {
    // Deep clone to prevent cache corruption
    return JSON.parse(JSON.stringify(analysis));
  }

  private calculateSimilarity(data1: CompressedFinancialData, entry: CacheEntry): number {
    // This is a simplified similarity calculation
    // In production, you'd want more sophisticated matching
    
    const factors = [
      { weight: 0.2, diff: Math.abs(data1.age - (entry.analysis.metadata as any).age) / 100 },
      { weight: 0.15, diff: Math.abs(data1.netWorth - (entry.analysis.metadata as any).netWorth) / Math.max(data1.netWorth, 1) },
      { weight: 0.15, diff: Math.abs(data1.monthlyIncome - (entry.analysis.metadata as any).monthlyIncome) / Math.max(data1.monthlyIncome, 1) },
      { weight: 0.1, diff: Math.abs(data1.debtToIncomeRatio - (entry.analysis.metadata as any).debtToIncomeRatio) },
      { weight: 0.1, diff: Math.abs(data1.savingsRate - (entry.analysis.metadata as any).savingsRate) },
      { weight: 0.1, diff: data1.riskProfile === (entry.analysis.metadata as any).riskProfile ? 0 : 1 },
      { weight: 0.1, diff: Math.abs(data1.yearsToRetirement - (entry.analysis.metadata as any).yearsToRetirement) / 50 },
      { weight: 0.1, diff: data1.primaryGoal === (entry.analysis.metadata as any).primaryGoal ? 0 : 1 }
    ];

    const weightedDifference = factors.reduce((sum, factor) => {
      return sum + (factor.weight * Math.min(1, factor.diff));
    }, 0);

    return Math.max(0, 1 - weightedDifference);
  }

  /**
   * Exports cache for analysis and debugging
   */
  exportCacheAnalytics(): {
    entries: Array<{
      hash: string;
      age: number;
      hits: number;
      confidence: number;
      requiresHumanReview: boolean;
    }>;
    statistics: ReturnType<typeof this.getCacheStats>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([hash, entry]) => ({
      hash,
      age: Math.round((now - entry.timestamp) / (1000 * 60)), // Age in minutes
      hits: entry.hitCount,
      confidence: entry.analysis.metadata.confidence,
      requiresHumanReview: entry.analysis.metadata.requiresHumanReview
    }));

    return {
      entries,
      statistics: this.getCacheStats()
    };
  }

  /**
   * Clears all cache entries (for testing or emergency situations)
   */
  clearAll(): void {
    this.cache.clear();
  }
}

/**
 * Common financial scenarios for cache warming
 */
export const COMMON_SCENARIOS: CompressedFinancialData[] = [
  // Young professional, starting out
  {
    netWorth: 10000,
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    debtToIncomeRatio: 0.2,
    savingsRate: 0.3,
    emergencyFundMonths: 2,
    retirementSavingsRatio: 0.1,
    age: 25,
    yearsToRetirement: 40,
    riskProfile: 'moderate',
    primaryGoal: 'retirement',
    hasHighValueAssets: false,
    hasComplexDebts: false
  },
  // Mid-career, family
  {
    netWorth: 150000,
    monthlyIncome: 8000,
    monthlyExpenses: 6000,
    debtToIncomeRatio: 0.3,
    savingsRate: 0.25,
    emergencyFundMonths: 4,
    retirementSavingsRatio: 1.5,
    age: 40,
    yearsToRetirement: 25,
    riskProfile: 'moderate',
    primaryGoal: 'retirement',
    hasHighValueAssets: false,
    hasComplexDebts: true
  },
  // Pre-retirement
  {
    netWorth: 800000,
    monthlyIncome: 10000,
    monthlyExpenses: 7000,
    debtToIncomeRatio: 0.1,
    savingsRate: 0.3,
    emergencyFundMonths: 8,
    retirementSavingsRatio: 6,
    age: 55,
    yearsToRetirement: 10,
    riskProfile: 'conservative',
    primaryGoal: 'retirement',
    hasHighValueAssets: false,
    hasComplexDebts: false
  }
];

// Export singleton instance
export const analysisCache = new AnalysisCache();