'use client';

import { FormData } from '@/types/financial';

export type PlanType = 'quick' | 'comprehensive';

export interface PlanAccess {
  planType: PlanType;
  isQuickPlan: boolean;
  isComprehensivePlan: boolean;
  canAccessSection: (sectionId: string) => boolean;
}

/**
 * Hook to determine user's plan type and section access
 */
export function usePlanType(clientData: FormData | null): PlanAccess {
  const planType = getPlanType(clientData);
  
  return {
    planType,
    isQuickPlan: planType === 'quick',
    isComprehensivePlan: planType === 'comprehensive',
    canAccessSection: (sectionId: string) => canAccessSection(sectionId, planType)
  };
}

/**
 * Determine plan type based on client data completeness
 */
export function getPlanType(clientData: FormData | null): PlanType {
  if (!clientData) return 'quick';
  
  // Check for quick plan identifier
  if (clientData.personal?.name === 'Quick Plan User') {
    return 'quick';
  }
  
  // Count completed sections to determine plan comprehensiveness
  const completedSections = calculateCompletedSections(clientData);
  
  // Quick plan typically has 4-6 basic sections
  // Comprehensive plan has 10+ detailed sections
  return completedSections.length < 7 ? 'quick' : 'comprehensive';
}

/**
 * Determine which sections are accessible for each plan type
 */
export function canAccessSection(sectionId: string, planType: PlanType): boolean {
  // Sections accessible to quick plan users (free tier)
  const quickPlanSections = [
    'executive',    // Executive Summary - Core insights
    'debt',        // Basic Debt Management  
    'risk',        // Basic Risk Assessment
    'actions'      // Top Priority Actions
  ];
  
  // All sections accessible to comprehensive plan users
  const comprehensiveSections = [
    'executive',
    'assets',      // Asset Allocation
    'retirement',  // Retirement Planning  
    'debt',
    'risk',
    'actions',
    'goals',       // Goal Timeline
    'cashflow',    // Cash Flow Analysis
    'insurance',   // Insurance Coverage
    'tax'          // Tax Strategy
  ];
  
  if (planType === 'quick') {
    return quickPlanSections.includes(sectionId);
  }
  
  return comprehensiveSections.includes(sectionId);
}

/**
 * Get sections that are gated for quick plan users
 */
export function getGatedSections(): string[] {
  return [
    'assets',
    'retirement', 
    'goals',
    'cashflow',
    'insurance',
    'tax'
  ];
}

/**
 * Get upgrade messaging for specific sections
 */
export function getUpgradeMessage(sectionId: string): { title: string; description: string } {
  const messages: Record<string, { title: string; description: string }> = {
    assets: {
      title: "Unlock Asset Allocation Strategy",
      description: "Get detailed investment recommendations and portfolio optimization strategies tailored to your risk profile and goals."
    },
    retirement: {
      title: "Unlock Advanced Retirement Planning", 
      description: "Access Monte Carlo projections, Social Security optimization, and detailed retirement income planning."
    },
    goals: {
      title: "Unlock Goal Timeline Planning",
      description: "Create detailed timelines for your financial goals with milestone tracking and progress monitoring."
    },
    cashflow: {
      title: "Unlock Cash Flow Analysis",
      description: "Get comprehensive income and expense optimization with savings rate analysis and budget recommendations."
    },
    insurance: {
      title: "Unlock Insurance Coverage Analysis",
      description: "Receive detailed insurance needs analysis including life, disability, and property coverage recommendations."
    },
    tax: {
      title: "Unlock Tax Strategy Planning",
      description: "Access advanced tax optimization strategies including Roth conversions, tax-loss harvesting, and deduction planning."
    }
  };
  
  return messages[sectionId] || {
    title: "Unlock Premium Features",
    description: "Upgrade to our comprehensive plan for detailed analysis and personalized recommendations."
  };
}

/**
 * Calculate number of completed sections in form data
 */
function calculateCompletedSections(formData: FormData): string[] {
  const sections = [
    'personal', 'income', 'expenses', 'assets', 'liabilities', 
    'goals', 'preferences', 'risk', 'employerBenefits', 'insurance',
    'taxSituation', 'estatePlanning', 'behavioral', 'cashFlow', 
    'lifeCareer', 'investmentPhilosophy'
  ];

  return sections.filter(section => {
    const sectionData = formData[section as keyof FormData];
    return sectionData && Object.keys(sectionData).length > 0;
  });
}