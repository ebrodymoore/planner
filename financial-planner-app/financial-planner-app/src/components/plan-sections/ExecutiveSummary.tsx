'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Target,
  Shield,
  Briefcase
} from 'lucide-react';
import { FormData } from '@/types/financial';

interface ExecutiveSummaryProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

export default function ExecutiveSummary({ clientData, analysisResults }: ExecutiveSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateNetWorth = () => {
    const assets = clientData.assets;
    const liabilities = clientData.liabilities;
    
    if (!assets || !liabilities) return { total: 0, assets: 0, liabilities: 0 };
    
    const totalAssets = (assets.checking || 0) + 
                       (assets.savings || 0) + 
                       (assets.retirement401k || 0) + 
                       (assets.ira || 0) + 
                       (assets.taxableAccounts || 0) + 
                       (assets.homeValue || 0);
    
    const totalLiabilities = (liabilities.mortgageBalance || 0) + 
                            (liabilities.autoLoans?.reduce((sum, loan) => sum + (loan.balance || 0), 0) || 0) +
                            (liabilities.creditCards?.reduce((sum, card) => sum + (card.balance || 0), 0) || 0) +
                            (liabilities.studentLoans?.reduce((sum, loan) => sum + (loan.balance || 0), 0) || 0);
    
    return {
      total: totalAssets - totalLiabilities,
      assets: totalAssets,
      liabilities: totalLiabilities
    };
  };

  const calculateGoalProgress = () => {
    const goals = clientData.goals;
    if (!goals) return [];

    const progress = [];
    
    // Emergency Fund Goal
    const monthlyExpenses = getTotalMonthlyExpenses();
    const emergencyFund = clientData.assets?.savings || 0;
    const emergencyMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
    progress.push({
      name: 'Emergency Fund',
      target: '6 months expenses',
      current: `${emergencyMonths.toFixed(1)} months`,
      progress: Math.min(100, (emergencyMonths / 6) * 100),
      status: emergencyMonths >= 6 ? 'complete' : emergencyMonths >= 3 ? 'on-track' : 'behind'
    });

    // Retirement Goal
    const currentAge = clientData.personal?.dateOfBirth ? 
      new Date().getFullYear() - new Date(clientData.personal.dateOfBirth).getFullYear() : 35;
    const retirementAge = goals.retirementAge || 65;
    const yearsToRetirement = retirementAge - currentAge;
    const retirementSavings = (clientData.assets?.retirement401k || 0) + (clientData.assets?.ira || 0);
    const annualIncome = clientData.income?.annualIncome || 0;
    const retirementTarget = annualIncome * 10; // Simple 10x income rule
    const retirementProgress = retirementTarget > 0 ? (retirementSavings / retirementTarget) * 100 : 0;
    
    progress.push({
      name: 'Retirement Savings',
      target: formatCurrency(retirementTarget),
      current: formatCurrency(retirementSavings),
      progress: Math.min(100, retirementProgress),
      status: retirementProgress >= 80 ? 'complete' : retirementProgress >= 50 ? 'on-track' : 'behind'
    });

    return progress;
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

  const getFinancialStrengths = () => {
    const strengths = [];
    const netWorth = calculateNetWorth();
    const monthlyExpenses = getTotalMonthlyExpenses();
    const emergencyFund = clientData.assets?.savings || 0;
    const annualIncome = clientData.income?.annualIncome || 0;

    if (netWorth.total > 0) {
      strengths.push({
        title: 'Positive Net Worth',
        description: `Your assets exceed liabilities by ${formatCurrency(netWorth.total)}`,
        icon: TrendingUp,
        color: 'text-green-600'
      });
    }

    if (emergencyFund > monthlyExpenses * 3) {
      strengths.push({
        title: 'Strong Emergency Fund',
        description: `${(emergencyFund / monthlyExpenses).toFixed(1)} months of expenses saved`,
        icon: Shield,
        color: 'text-blue-600'
      });
    }

    if (annualIncome > 0 && clientData.income?.stability === 'very_stable') {
      strengths.push({
        title: 'Stable Income',
        description: 'Very stable income provides planning foundation',
        icon: Briefcase,
        color: 'text-purple-600'
      });
    }

    const retirementSavings = (clientData.assets?.retirement401k || 0) + (clientData.assets?.ira || 0);
    if (retirementSavings > annualIncome) {
      strengths.push({
        title: 'Retirement Focus',
        description: 'Retirement savings exceed annual income',
        icon: Target,
        color: 'text-indigo-600'
      });
    }

    return strengths;
  };

  const getAreasForImprovement = () => {
    const improvements = [];
    const netWorth = calculateNetWorth();
    const monthlyExpenses = getTotalMonthlyExpenses();
    const emergencyFund = clientData.assets?.savings || 0;
    const annualIncome = clientData.income?.annualIncome || 0;

    if (emergencyFund < monthlyExpenses * 3) {
      improvements.push({
        title: 'Emergency Fund Gap',
        description: `Need ${formatCurrency((monthlyExpenses * 6) - emergencyFund)} more for 6-month target`,
        priority: 'high',
        icon: AlertTriangle
      });
    }

    const totalDebt = netWorth.liabilities;
    if (totalDebt > annualIncome * 0.4) {
      improvements.push({
        title: 'High Debt Burden',
        description: 'Total debt exceeds 40% of annual income',
        priority: 'high',
        icon: TrendingDown
      });
    }

    const retirementSavings = (clientData.assets?.retirement401k || 0) + (clientData.assets?.ira || 0);
    if (retirementSavings < annualIncome * 3) {
      improvements.push({
        title: 'Retirement Savings Behind',
        description: 'Consider increasing retirement contributions',
        priority: 'medium',
        icon: Target
      });
    }

    if (!clientData.insurance?.healthInsuranceType) {
      improvements.push({
        title: 'Insurance Review Needed',
        description: 'Complete insurance coverage assessment',
        priority: 'medium',
        icon: Shield
      });
    }

    return improvements;
  };

  const getCriticalActions = () => {
    const actions = [];
    const improvements = getAreasForImprovement();
    
    improvements.filter(item => item.priority === 'high').forEach((item, index) => {
      actions.push({
        id: index + 1,
        title: item.title,
        description: item.description,
        timeline: '30 days',
        impact: 'High'
      });
    });

    if (actions.length === 0) {
      actions.push({
        id: 1,
        title: 'Review and Optimize',
        description: 'Continue monitoring and optimizing your financial plan',
        timeline: '90 days',
        impact: 'Medium'
      });
    }

    return actions.slice(0, 3); // Top 3 actions
  };

  const netWorth = calculateNetWorth();
  const goalProgress = calculateGoalProgress();
  const strengths = getFinancialStrengths();
  const improvements = getAreasForImprovement();
  const criticalActions = getCriticalActions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Executive Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your complete financial overview and key insights
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Net Worth</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(netWorth.total)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Assets: {formatCurrency(netWorth.assets)} | Debt: {formatCurrency(netWorth.liabilities)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Expenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(getTotalMonthlyExpenses())}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Annual: {formatCurrency(getTotalMonthlyExpenses() * 12)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Annual Income</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(clientData.income?.annualIncome || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Stability: {clientData.income?.stability?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progress Toward Major Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goalProgress.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{goal.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Target: {goal.target} | Current: {goal.current}
                    </p>
                  </div>
                  <Badge variant={goal.status === 'complete' ? 'default' : 
                                goal.status === 'on-track' ? 'secondary' : 'destructive'}>
                    {goal.status === 'complete' ? 'Complete' : 
                     goal.status === 'on-track' ? 'On Track' : 'Behind'}
                  </Badge>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{goal.progress.toFixed(1)}% complete</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Key Financial Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strengths.length > 0 ? strengths.map((strength, index) => {
                const IconComponent = strength.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${strength.color} bg-opacity-10`}>
                      <IconComponent className={`w-4 h-4 ${strength.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {strength.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {strength.description}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Continue building your financial foundation to unlock more strengths.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {improvements.length > 0 ? improvements.map((improvement, index) => {
                const IconComponent = improvement.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      improvement.priority === 'high' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        improvement.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {improvement.title}
                        </h4>
                        <Badge variant={improvement.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {improvement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {improvement.description}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Great work! No major areas for improvement identified.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Critical Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalActions.map((action) => (
              <div key={action.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium px-2 py-1 rounded">
                        #{action.id}
                      </span>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {action.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {action.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Timeline: {action.timeline}</span>
                      <span>Impact: {action.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}