// Intelligent caching system for AI responses

import { AnalysisResult, CompressedFinancialData, CacheEntry } from './types';
import { FinancialDataProcessor } from './dataProcessor';

export class AnalysisCacheManager {
  private static cache = new Map<string, CacheEntry>();
  private static readonly MAX_CACHE_SIZE = 1000;
  private static readonly CACHE_TTL_HOURS = 24;
  private static readonly STALE_THRESHOLD_HOURS = 6;

  /**
   * Retrieves cached analysis if available and not stale
   */
  static getCachedAnalysis(data: CompressedFinancialData): AnalysisResult | null {
    const dataHash = FinancialDataProcessor.generateDataHash(data);
    const entry = this.cache.get(dataHash);
    
    if (!entry) return null;
    
    // Check if entry is expired
    const now = Date.now();
    const ageHours = (now - entry.timestamp) / (1000 * 60 * 60);
    
    if (ageHours > this.CACHE_TTL_HOURS) {
      this.cache.delete(dataHash);
      return null;
    }
    
    // Update access statistics
    entry.lastAccessed = now;
    entry.hitCount++;
    
    // Check if analysis should be considered stale for high-value clients
    if (data.hasHighValueAssets && ageHours > this.STALE_THRESHOLD_HOURS) {
      return null; // Force fresh analysis for important clients
    }
    
    return entry.analysis;
  }

  /**
   * Stores analysis result in cache
   */
  static setCachedAnalysis(
    data: CompressedFinancialData, 
    analysis: AnalysisResult
  ): void {
    const dataHash = FinancialDataProcessor.generateDataHash(data);
    const now = Date.now();
    
    // Don't cache analyses with low confidence or requiring human review
    if (analysis.metadata.confidence < 0.7 || analysis.metadata.requiresHumanReview) {
      return;
    }
    
    // Clean cache if at capacity
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldEntries();
    }
    
    const entry: CacheEntry = {
      dataHash,
      analysis,
      timestamp: now,
      hitCount: 0,
      lastAccessed: now
    };
    
    this.cache.set(dataHash, entry);
  }

  /**
   * Checks if similar analysis exists (for near-matches)
   */
  static findSimilarAnalysis(data: CompressedFinancialData): AnalysisResult | null {
    // Create variations of the data with small tolerances
    const variations = this.generateDataVariations(data);
    
    for (const variation of variations) {
      const cached = this.getCachedAnalysis(variation);
      if (cached) {
        // Mark as derived from cache
        return {
          ...cached,
          metadata: {
            ...cached.metadata,
            source: 'AI_GENERATED', // Keep original source
            confidence: cached.metadata.confidence * 0.95 // Slight confidence reduction
          }
        };
      }
    }
    
    return null;
  }

  /**
   * Invalidates cache entries for similar financial profiles
   */
  static invalidateSimilarEntries(data: CompressedFinancialData): void {
    const variations = this.generateDataVariations(data);
    
    for (const variation of variations) {
      const hash = FinancialDataProcessor.generateDataHash(variation);
      this.cache.delete(hash);
    }
  }

  /**
   * Pre-warms cache with common financial scenarios
   */
  static preWarmCache(): void {
    const commonScenarios = this.generateCommonScenarios();
    
    // Note: In production, this would trigger background AI analysis
    // For now, we just prepare the cache structure
    console.log(`Cache pre-warming prepared for ${commonScenarios.length} scenarios`);
  }

  /**
   * Gets cache statistics
   */
  static getCacheStats(): {
    size: number;
    hitRate: number;
    avgAge: number;
    topHits: Array<{ hash: string; hits: number; age: number }>;
  } {
    const now = Date.now();
    let totalHits = 0;
    let totalRequests = 0;
    let totalAge = 0;
    const hitsByEntry: Array<{ hash: string; hits: number; age: number }> = [];

    for (const [hash, entry] of this.cache.entries()) {
      const ageHours = (now - entry.timestamp) / (1000 * 60 * 60);
      totalHits += entry.hitCount;
      totalRequests += entry.hitCount > 0 ? 1 : 0;
      totalAge += ageHours;
      
      hitsByEntry.push({
        hash: hash.substring(0, 8), // Truncate for privacy
        hits: entry.hitCount,
        age: ageHours
      });
    }

    const hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;
    const avgAge = this.cache.size > 0 ? totalAge / this.cache.size : 0;
    
    // Sort by hits descending
    hitsByEntry.sort((a, b) => b.hits - a.hits);

    return {
      size: this.cache.size,
      hitRate,
      avgAge,
      topHits: hitsByEntry.slice(0, 10)
    };
  }

  /**
   * Clears expired cache entries
   */
  static cleanupExpiredEntries(): number {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      const ageHours = (now - entry.timestamp) / (1000 * 60 * 60);
      if (ageHours > this.CACHE_TTL_HOURS) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      this.cache.delete(key);
    }
    
    return expiredKeys.length;
  }

  /**
   * Manual cache invalidation (for testing or data updates)
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Exports cache for persistence (if needed)
   */
  static exportCache(): Record<string, CacheEntry> {
    const exported: Record<string, CacheEntry> = {};
    
    for (const [key, entry] of this.cache.entries()) {
      // Only export recent, high-confidence entries
      const ageHours = (Date.now() - entry.timestamp) / (1000 * 60 * 60);
      if (ageHours < this.STALE_THRESHOLD_HOURS && entry.analysis.metadata.confidence > 0.8) {
        exported[key] = entry;
      }
    }
    
    return exported;
  }

  /**
   * Imports cache from persistence
   */
  static importCache(cacheData: Record<string, CacheEntry>): void {
    const now = Date.now();
    
    for (const [key, entry] of Object.entries(cacheData)) {
      // Validate entry age and quality
      const ageHours = (now - entry.timestamp) / (1000 * 60 * 60);
      
      if (ageHours < this.CACHE_TTL_HOURS && entry.analysis.metadata.confidence > 0.7) {
        this.cache.set(key, entry);
      }
    }
  }

  // Private helper methods

  /**
   * Evicts least recently used entries when cache is full
   */
  private static evictOldEntries(): void {
    const entries = Array.from(this.cache.entries());
    
    // Sort by last accessed time (oldest first)
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Remove oldest 25% of entries
    const removeCount = Math.floor(this.MAX_CACHE_SIZE * 0.25);
    
    for (let i = 0; i < removeCount; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Generates data variations for fuzzy cache matching
   */
  private static generateDataVariations(data: CompressedFinancialData): CompressedFinancialData[] {
    const variations: CompressedFinancialData[] = [];
    
    // Tolerance levels for fuzzy matching
    const tolerances = {
      income: 0.05,    // 5% income variance
      expenses: 0.05,  // 5% expense variance
      netWorth: 0.10,  // 10% net worth variance
      age: 1           // 1 year age variance
    };
    
    // Generate variations within tolerance
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue; // Skip original
        
        const variation: CompressedFinancialData = {
          ...data,
          monthlyIncome: data.monthlyIncome * (1 + i * tolerances.income),
          monthlyExpenses: data.monthlyExpenses * (1 + j * tolerances.expenses),
          netWorth: data.netWorth * (1 + i * tolerances.netWorth),
          age: Math.max(16, Math.min(100, data.age + i)) // Clamp age to valid range
        };
        
        // Recalculate dependent metrics
        variation.debtToIncomeRatio = variation.monthlyIncome > 0 ? 
          (data.debtToIncomeRatio * data.monthlyIncome) / variation.monthlyIncome : 0;
        
        variation.savingsRate = variation.monthlyIncome > 0 ? 
          (variation.monthlyIncome - variation.monthlyExpenses) / variation.monthlyIncome : 0;
        
        variations.push(variation);
      }
    }
    
    return variations;
  }

  /**
   * Generates common financial scenarios for cache pre-warming
   */
  private static generateCommonScenarios(): CompressedFinancialData[] {
    const scenarios: CompressedFinancialData[] = [];
    
    // Common demographic/income combinations
    const ageGroups = [25, 30, 35, 40, 45, 50, 55, 60];
    const incomeGroups = [3000, 5000, 7500, 10000, 15000]; // Monthly income
    const riskProfiles: Array<'conservative' | 'moderate' | 'aggressive'> = ['conservative', 'moderate', 'aggressive'];
    
    for (const age of ageGroups) {
      for (const income of incomeGroups) {
        for (const risk of riskProfiles) {
          // Generate realistic scenario
          const expenses = income * (0.6 + Math.random() * 0.3); // 60-90% of income
          const savingsRate = (income - expenses) / income;
          const netWorth = income * age * 0.5; // Rough accumulation estimate
          
          scenarios.push({
            netWorth,
            monthlyIncome: income,
            monthlyExpenses: expenses,
            debtToIncomeRatio: Math.random() * 0.4, // 0-40%
            savingsRate,
            emergencyFundMonths: Math.random() * 8, // 0-8 months
            retirementSavingsRatio: age * 0.02, // Rough rule of thumb
            age,
            yearsToRetirement: Math.max(5, 65 - age),
            riskProfile: risk,
            primaryGoal: 'retirement',
            hasHighValueAssets: netWorth > 1_000_000,
            hasComplexDebts: Math.random() > 0.7
          });
        }
      }
    }
    
    return scenarios;
  }
}