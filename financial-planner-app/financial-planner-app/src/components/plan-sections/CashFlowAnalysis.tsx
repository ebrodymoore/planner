'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Wallet,
  Home,
  Car,
  UtensilsCrossed,
  Plane,
  Shield
} from 'lucide-react';
import { FormData } from '@/types/financial';

interface CashFlowAnalysisProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  icon: React.ElementType;
  color: string;
  recommended: number;
  status: 'good' | 'warning' | 'danger';
}

export default function CashFlowAnalysis({ clientData, analysisResults }: CashFlowAnalysisProps) {
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateMonthlyIncome = () => {
    const annualIncome = clientData.income?.annualIncome || 0;
    const takeHomePay = clientData.cashFlow?.takeHomePay || annualIncome * 0.75; // Assume 25% taxes if not provided
    return takeHomePay / 12;
  };

  const getExpenseCategories = (): ExpenseCategory[] => {
    const expenses = clientData.expenses;
    if (!expenses) return [];

    const totalExpenses = getTotalMonthlyExpenses();
    
    const categories = [
      {
        name: 'Housing',
        amount: expenses.housing || 0,
        icon: Home,
        color: '#3B82F6',
        recommended: 0.30, // 30% of income
      },
      {
        name: 'Transportation',
        amount: expenses.transportation || 0,
        icon: Car,
        color: '#10B981',
        recommended: 0.15, // 15% of income
      },
      {
        name: 'Food',
        amount: expenses.food || 0,
        icon: UtensilsCrossed,
        color: '#F59E0B',
        recommended: 0.12, // 12% of income
      },
      {
        name: 'Healthcare',
        amount: expenses.healthcare || 0,
        icon: Shield,
        color: '#EF4444',
        recommended: 0.08, // 8% of income
      },
      {
        name: 'Entertainment',
        amount: expenses.entertainment || 0,
        icon: PieChart,
        color: '#8B5CF6',
        recommended: 0.05, // 5% of income
      },
      {
        name: 'Travel',
        amount: expenses.travel || 0,
        icon: Plane,
        color: '#06B6D4',
        recommended: 0.05, // 5% of income
      },
      {
        name: 'Shopping',
        amount: expenses.shopping || 0,
        icon: Wallet,
        color: '#F97316',
        recommended: 0.05, // 5% of income
      },
      {
        name: 'Technology',
        amount: expenses.technology || 0,
        icon: Calculator,
        color: '#6B7280',
        recommended: 0.03, // 3% of income
      }
    ];

    const monthlyIncome = calculateMonthlyIncome();

    return categories.map(category => {
      const percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
      const incomePercentage = monthlyIncome > 0 ? (category.amount / monthlyIncome) : 0;
      const recommendedAmount = monthlyIncome * category.recommended;
      
      let status: 'good' | 'warning' | 'danger' = 'good';
      if (incomePercentage > category.recommended * 1.5) {
        status = 'danger';
      } else if (incomePercentage > category.recommended * 1.2) {
        status = 'warning';
      }

      return {
        ...category,
        percentage,
        recommended: recommendedAmount,
        status
      };
    }).filter(category => category.amount > 0);
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

  const calculateCashFlowMetrics = () => {
    const monthlyIncome = calculateMonthlyIncome();
    const monthlyExpenses = getTotalMonthlyExpenses();
    const netCashFlow = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (netCashFlow / monthlyIncome) * 100 : 0;
    
    // Calculate emergency fund months
    const emergencyFund = clientData.assets?.savings || 0;
    const emergencyFundMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;

    return {
      monthlyIncome,
      monthlyExpenses,
      netCashFlow,
      savingsRate,
      emergencyFundMonths,
      expenseRatio: monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0
    };
  };

  const getOptimizationRecommendations = () => {
    const metrics = calculateCashFlowMetrics();
    const categories = getExpenseCategories();
    const recommendations = [];

    // Low savings rate
    if (metrics.savingsRate < 10) {
      recommendations.push({
        type: 'savings',
        priority: 'high',
        title: 'Increase Savings Rate',
        description: `Current savings rate is ${metrics.savingsRate.toFixed(1)}%. Aim for at least 20% of income.`,
        impact: formatCurrency((metrics.monthlyIncome * 0.20) - (metrics.monthlyIncome * (metrics.savingsRate / 100))),
        actions: [
          'Review and cut non-essential expenses',
          'Negotiate bills and subscriptions',
          'Consider increasing income through side work',
          'Automate savings to pay yourself first'
        ]
      });
    }

    // High housing costs
    const housingCategory = categories.find(cat => cat.name === 'Housing');
    if (housingCategory && housingCategory.status === 'danger') {
      recommendations.push({
        type: 'housing',
        priority: 'high',
        title: 'Reduce Housing Costs',
        description: `Housing costs are ${((housingCategory.amount / metrics.monthlyIncome) * 100).toFixed(1)}% of income. Target is 30%.`,
        impact: formatCurrency(housingCategory.amount - housingCategory.recommended),
        actions: [
          'Consider refinancing mortgage for lower rate',
          'Explore house hacking or rental income',
          'Downsize if overextended',
          'Review insurance and property taxes'
        ]
      });
    }

    // Insufficient emergency fund
    if (metrics.emergencyFundMonths < 3) {
      recommendations.push({
        type: 'emergency',
        priority: 'high',
        title: 'Build Emergency Fund',
        description: `Current emergency fund covers ${metrics.emergencyFundMonths.toFixed(1)} months. Target is 6 months.`,
        impact: formatCurrency((metrics.monthlyExpenses * 6) - (clientData.assets?.savings || 0)),
        actions: [
          'Open high-yield savings account',
          'Automate emergency fund contributions',
          'Use windfalls (tax refunds, bonuses) to boost fund',
          'Temporarily reduce investment contributions if needed'
        ]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    });
  };

  const generateCashFlowProjection = () => {
    const metrics = calculateCashFlowMetrics();
    const projection = [];
    
    for (let month = 1; month <= 12; month++) {
      const cumulativeSavings = metrics.netCashFlow * month;
      const emergencyFundGrowth = (clientData.assets?.savings || 0) + cumulativeSavings;
      
      projection.push({
        month,
        monthName: new Date(2024, month - 1).toLocaleString('default', { month: 'short' }),
        income: metrics.monthlyIncome,
        expenses: metrics.monthlyExpenses,
        netCashFlow: metrics.netCashFlow,
        cumulativeSavings,
        emergencyFundTotal: Math.max(0, emergencyFundGrowth)
      });
    }
    
    return projection;
  };

  const metrics = calculateCashFlowMetrics();
  const categories = getExpenseCategories();
  const recommendations = getOptimizationRecommendations();
  const projection = generateCashFlowProjection();

  // Get Claude analysis data if available
  const cashFlowData = analysisResults?.structured_data?.cash_flow || {};

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Cash Flow Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive analysis of your income, expenses, and optimization opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(metrics.monthlyIncome)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {cashFlowData.monthly_income ? `Claude: ${formatCurrency(cashFlowData.monthly_income)}` : 'After taxes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Expenses</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(metrics.monthlyExpenses)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {cashFlowData.monthly_expenses ? `Claude: ${formatCurrency(cashFlowData.monthly_expenses)}` : 'All categories'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Net Cash Flow</p>
            <p className={`text-2xl font-bold ${metrics.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.netCashFlow)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {cashFlowData.net_cash_flow ? `Claude: ${formatCurrency(cashFlowData.net_cash_flow)}` : 'Income - Expenses'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Savings Rate</p>
            <p className={`text-2xl font-bold ${metrics.savingsRate >= 20 ? 'text-green-600' : metrics.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
              {metrics.savingsRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {cashFlowData.savings_rate ? `Claude: ${(cashFlowData.savings_rate * 100).toFixed(1)}%` : 'Target: 20%+'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Expense Breakdown & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const incomePercentage = metrics.monthlyIncome > 0 ? (category.amount / metrics.monthlyIncome) * 100 : 0;
              
              return (
                <div key={category.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                        <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{category.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {incomePercentage.toFixed(1)}% of income
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(category.amount)}
                      </p>
                      <Badge variant={
                        category.status === 'good' ? 'default' : 
                        category.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {category.status === 'good' ? 'Good' : 
                         category.status === 'warning' ? 'Review' : 'High'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Recommended: {formatCurrency(category.recommended)}
                      </span>
                      <span className={category.amount > category.recommended ? 'text-red-600' : 'text-green-600'}>
                        {category.amount > category.recommended ? 'Over' : 'Under'} by {formatCurrency(Math.abs(category.amount - category.recommended))}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, (category.amount / category.recommended) * 100)} 
                      className="h-2" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Cash Flow Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            12-Month Cash Flow Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
                <p className="text-sm text-green-800 dark:text-green-200">Year-End Savings</p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(metrics.netCashFlow * 12)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
                <p className="text-sm text-blue-800 dark:text-blue-200">Emergency Fund</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(projection[11].emergencyFundTotal)}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
                <p className="text-sm text-purple-800 dark:text-purple-200">Avg Monthly Surplus</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(metrics.netCashFlow)}
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg text-center">
                <p className="text-sm text-orange-800 dark:text-orange-200">Total Income</p>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(metrics.monthlyIncome * 12)}
                </p>
              </div>
            </div>
            
            {/* Simple bar chart visualization */}
            <div className="space-y-2">
              {projection.slice(0, 6).map((month) => (
                <div key={month.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {month.monthName}
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded">
                      <div 
                        className="h-full bg-green-500 rounded"
                        style={{ 
                          width: `${Math.max(5, Math.min(100, (month.netCashFlow / metrics.monthlyIncome) * 100))}%` 
                        }}
                      />
                    </div>
                    <div className="absolute right-2 top-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {formatCurrency(month.cumulativeSavings)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Cash Flow Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                        {rec.priority} priority
                      </Badge>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {rec.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {rec.description}
                    </p>
                    <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Potential Monthly Impact: <span className="font-bold">{rec.impact}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Action Steps:</h5>
                  <ul className="space-y-1">
                    {rec.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded font-medium">
                          {actionIndex + 1}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {action}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Claude API Optimization Opportunities */}
            {cashFlowData.optimization_opportunities && (
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Claude AI Additional Recommendations
                </h4>
                <ul className="space-y-2">
                  {cashFlowData.optimization_opportunities.map((opportunity: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <span className="text-sm text-blue-800 dark:text-blue-200">
                        {opportunity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}