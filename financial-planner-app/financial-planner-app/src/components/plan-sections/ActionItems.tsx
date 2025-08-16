'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Shield
} from 'lucide-react';
import { FormData } from '@/types/financial';

interface ActionItemsProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeline: '30 days' | '60 days' | '90 days' | '6 months' | '1 year';
  category: 'emergency' | 'debt' | 'retirement' | 'insurance' | 'tax' | 'investment';
  impact: 'high' | 'medium' | 'low';
  completed: boolean;
  steps: string[];
  expectedOutcome: string;
}

export default function ActionItems({ clientData, analysisResults }: ActionItemsProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generateActionItems = (): ActionItem[] => {
    const items: ActionItem[] = [];
    
    // Try to get Claude API structured action items first
    const claudeActionItems = analysisResults?.structured_data?.action_items;
    
    if (claudeActionItems) {
      // Convert Claude API action items to our format
      const timelineMapping: Record<string, '30 days' | '60 days' | '90 days' | '6 months' | '1 year'> = {
        'immediate': '30 days',
        'short_term': '60 days', 
        'medium_term': '90 days',
        'long_term': '6 months'
      };
      
      Object.entries(claudeActionItems).forEach(([timeline, actions]: [string, any]) => {
        if (Array.isArray(actions)) {
          actions.forEach((action: string, index: number) => {
            items.push({
              id: `claude_${timeline}_${index}`,
              title: action,
              description: `Claude AI recommended action for ${timeline.replace('_', ' ')} implementation`,
              priority: timeline === 'immediate' ? 'high' : timeline === 'short_term' ? 'high' : 'medium',
              timeline: timelineMapping[timeline] || '90 days',
              category: determineCategory(action),
              impact: timeline === 'immediate' || timeline === 'short_term' ? 'high' : 'medium',
              completed: false,
              steps: generateSteps(action),
              expectedOutcome: `Implementation of ${action} to improve financial position`
            });
          });
        }
      });
    }
    
    // Add fallback action items if Claude data not available
    if (items.length === 0) {
      const monthlyExpenses = getTotalMonthlyExpenses();
      const emergencyFund = clientData.assets?.savings || 0;
      const annualIncome = clientData.income?.annualIncome || 0;
      const retirementSavings = (clientData.assets?.retirement401k || 0) + (clientData.assets?.ira || 0);

    // Emergency Fund
    if (emergencyFund < monthlyExpenses * 3) {
      const needed = (monthlyExpenses * 6) - emergencyFund;
      items.push({
        id: 'emergency-fund',
        title: 'Build Emergency Fund',
        description: `Save ${formatCurrency(needed)} to reach 6-month expense target`,
        priority: 'high',
        timeline: '90 days',
        category: 'emergency',
        impact: 'high',
        completed: false,
        steps: [
          'Open high-yield savings account',
          `Set up automatic transfer of ${formatCurrency(needed / 6)} monthly`,
          'Track progress monthly',
          'Adjust budget to free up additional savings'
        ],
        expectedOutcome: 'Financial security against unexpected expenses'
      });
    }

    // Retirement Savings
    if (retirementSavings < annualIncome * 2 && annualIncome > 0) {
      items.push({
        id: 'retirement-boost',
        title: 'Increase Retirement Contributions',
        description: 'Boost retirement savings to get on track for retirement',
        priority: 'high',
        timeline: '30 days',
        category: 'retirement',
        impact: 'high',
        completed: false,
        steps: [
          'Review current 401(k) contribution rate',
          'Increase contribution by 2-3% if possible',
          'Ensure you are getting full employer match',
          'Consider opening an IRA if not maxing 401(k)'
        ],
        expectedOutcome: 'Accelerated retirement savings growth'
      });
    }

    // High-Interest Debt
    const creditCardDebt = clientData.liabilities?.creditCards?.reduce((sum, card) => sum + (card.balance || 0), 0) || 0;
    if (creditCardDebt > 0) {
      items.push({
        id: 'debt-payoff',
        title: 'Eliminate High-Interest Debt',
        description: `Pay off ${formatCurrency(creditCardDebt)} in credit card debt`,
        priority: 'high',
        timeline: '60 days',
        category: 'debt',
        impact: 'high',
        completed: false,
        steps: [
          'List all debts by interest rate (highest first)',
          'Pay minimums on all, extra on highest rate',
          'Consider debt consolidation if beneficial',
          'Stop using credit cards for new purchases'
        ],
        expectedOutcome: 'Eliminate high-interest debt payments'
      });
    }

    // Insurance Review
    if (!clientData.insurance?.healthInsuranceType) {
      items.push({
        id: 'insurance-review',
        title: 'Complete Insurance Assessment',
        description: 'Review and optimize all insurance coverage',
        priority: 'medium',
        timeline: '30 days',
        category: 'insurance',
        impact: 'medium',
        completed: false,
        steps: [
          'Review current health insurance coverage',
          'Assess life insurance needs',
          'Check disability insurance coverage',
          'Review auto and home insurance policies'
        ],
        expectedOutcome: 'Adequate protection against major risks'
      });
    }

    // Tax Optimization
    items.push({
      id: 'tax-strategy',
      title: 'Optimize Tax Strategy',
      description: 'Implement tax-efficient investment and savings strategies',
      priority: 'medium',
      timeline: '60 days',
      category: 'tax',
      impact: 'medium',
      completed: false,
      steps: [
        'Maximize contributions to tax-advantaged accounts',
        'Consider Roth IRA conversion opportunities',
        'Review tax-loss harvesting in taxable accounts',
        'Plan timing of major financial decisions for tax efficiency'
      ],
      expectedOutcome: 'Reduced tax burden and increased after-tax returns'
    });

    // Investment Diversification
    const totalAssets = getTotalAssets();
    const realEstatePercentage = totalAssets > 0 ? ((clientData.assets?.homeValue || 0) / totalAssets) * 100 : 0;
    if (realEstatePercentage > 50) {
      items.push({
        id: 'diversification',
        title: 'Improve Portfolio Diversification',
        description: 'Reduce concentration risk in real estate',
        priority: 'medium',
        timeline: '90 days',
        category: 'investment',
        impact: 'medium',
        completed: false,
        steps: [
          'Increase contributions to investment accounts',
          'Consider REITs for real estate exposure',
          'Build balanced portfolio across asset classes',
          'Review and rebalance quarterly'
        ],
        expectedOutcome: 'Better risk-adjusted returns through diversification'
      });
    }
    }

    return items.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const determineCategory = (action: string): ActionItem['category'] => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('emergency') || actionLower.includes('fund')) return 'emergency';
    if (actionLower.includes('debt') || actionLower.includes('pay')) return 'debt';
    if (actionLower.includes('retirement') || actionLower.includes('401k') || actionLower.includes('ira')) return 'retirement';
    if (actionLower.includes('insurance') || actionLower.includes('coverage')) return 'insurance';
    if (actionLower.includes('tax') || actionLower.includes('deduction')) return 'tax';
    return 'investment';
  };

  const generateSteps = (action: string): string[] => {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('emergency')) {
      return [
        'Calculate 6 months of expenses',
        'Open high-yield savings account',
        'Set up automatic transfers',
        'Monitor progress monthly'
      ];
    }
    
    if (actionLower.includes('retirement') || actionLower.includes('401k')) {
      return [
        'Review current contribution rate',
        'Calculate optimal contribution amount',
        'Increase contributions through HR portal',
        'Monitor investment allocation'
      ];
    }
    
    if (actionLower.includes('debt')) {
      return [
        'List all debts by interest rate',
        'Create debt payoff strategy',
        'Set up automatic payments',
        'Track progress monthly'
      ];
    }
    
    if (actionLower.includes('insurance')) {
      return [
        'Review current coverage',
        'Get quotes from multiple providers',
        'Compare coverage options',
        'Update beneficiaries and coverage'
      ];
    }
    
    return [
      'Research implementation options',
      'Create action plan with timeline',
      'Begin implementation process',
      'Monitor and adjust as needed'
    ];
  };

  const getTotalMonthlyExpenses = () => {
    const expenses = clientData.expenses;
    if (!expenses) return 0;
    
    return (expenses.housing || 0) + 
           (expenses.transportation || 0) + 
           (expenses.travel || 0) + 
           (expenses.recreation || 0) + 
           (expenses.food || 0) + 
           (expenses.healthcare || 0) + 
           (expenses.shopping || 0) + 
           (expenses.technology || 0) + 
           (expenses.personalCare || 0) + 
           (expenses.entertainment || 0);
  };

  const getTotalAssets = () => {
    const assets = clientData.assets;
    if (!assets) return 0;
    
    return (assets.checking || 0) + 
           (assets.savings || 0) + 
           (assets.retirement401k || 0) + 
           (assets.ira || 0) + 
           (assets.taxableAccounts || 0) + 
           (assets.homeValue || 0);
  };

  const toggleCompletion = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return AlertTriangle;
      case 'debt': return TrendingUp;
      case 'retirement': return Target;
      case 'insurance': return Shield;
      case 'tax': return DollarSign;
      case 'investment': return TrendingUp;
      default: return CheckCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      case 'low': return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0';
    }
  };

  const actionItems = generateActionItems();
  const completedCount = Array.from(completedItems).length;
  const totalCount = actionItems.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
          Prioritized Action Items
        </h2>
        <p className="text-slate-400 text-lg">
          Your personalized financial action plan with step-by-step guidance
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Implementation Progress
              </h3>
              <p className="text-sm text-slate-300">
                {completedCount} of {totalCount} action items completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                {completionPercentage.toFixed(0)}%
              </p>
              <p className="text-sm text-slate-400">Complete</p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['30 days', '60 days', '90 days'].map(timeline => {
          const timelineItems = actionItems.filter(item => item.timeline === timeline);
          return (
            <Card key={timeline} className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  {timeline}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timelineItems.map(item => {
                    const IconComponent = getCategoryIcon(item.category);
                    const isCompleted = completedItems.has(item.id);
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 border rounded-xl transition-all duration-300 ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-600/20 border-slate-600/30 hover:bg-slate-600/30'}`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => toggleCompletion(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IconComponent className="w-4 h-4" />
                              <h4 className={`font-medium ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-300 mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.impact} impact
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {timelineItems.length === 0 && (
                    <p className="text-slate-400 text-center py-4">
                      No items for this timeline
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Action Items */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-100">
          Detailed Action Plan
        </h3>
        {actionItems.map((item, index) => {
          const IconComponent = getCategoryIcon(item.category);
          const isCompleted = completedItems.has(item.id);
          
          return (
            <Card key={item.id} className={isCompleted ? 'opacity-75' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleCompletion(item.id)}
                      />
                      <div className={`p-3 rounded-lg ${getPriorityColor(item.priority)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          #{index + 1}. {item.title}
                        </h3>
                      </div>
                      <p className="text-slate-300 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.timeline}
                        </Badge>
                        <Badge variant="outline">
                          {item.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      Implementation Steps:
                    </h4>
                    <ul className="space-y-2">
                      {item.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded font-medium">
                            {stepIndex + 1}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      Expected Outcome:
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {item.expectedOutcome}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}