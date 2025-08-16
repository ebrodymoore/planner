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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
          Executive Summary
        </h2>
        <p className="text-gray-600 text-lg">
          Your complete financial overview and key insights
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Worth</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  {formatCurrency(netWorth.total)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Assets: {formatCurrency(netWorth.assets)} | Debt: {formatCurrency(netWorth.liabilities)}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl blur-sm"></div>
                <div className="relative p-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  {formatCurrency(getTotalMonthlyExpenses())}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Annual: {formatCurrency(getTotalMonthlyExpenses() * 12)}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-sm"></div>
                <div className="relative p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                  <TrendingDown className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Income</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  {formatCurrency(clientData.income?.annualIncome || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Stability: {clientData.income?.stability?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            Progress Toward Major Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goalProgress.map((goal, index) => (
              <div key={index} className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                    <p className="text-sm text-gray-600">
                      Target: {goal.target} | Current: {goal.current}
                    </p>
                  </div>
                  <Badge className={`${
                    goal.status === 'complete' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 
                    goal.status === 'on-track' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
                    'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  } border-0`}>
                    {goal.status === 'complete' ? 'Complete' : 
                     goal.status === 'on-track' ? 'On Track' : 'Behind'}
                  </Badge>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-300 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        goal.status === 'complete' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                        goal.status === 'on-track' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                      style={{ width: `${Math.min(100, goal.progress)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">{goal.progress.toFixed(1)}% complete</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Strengths */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-400">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-500/30">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              Key Financial Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strengths.length > 0 ? strengths.map((strength, index) => {
                const IconComponent = strength.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-100 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300">
                    <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-500/30">
                      <IconComponent className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {strength.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {strength.description}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-600 text-center py-8">
                  Continue building your financial foundation to unlock more strengths.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-400">
              <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {improvements.length > 0 ? improvements.map((improvement, index) => {
                const IconComponent = improvement.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-100 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300">
                    <div className={`p-2 rounded-lg border ${
                      improvement.priority === 'high' 
                        ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30' 
                        : 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        improvement.priority === 'high' ? 'text-red-400' : 'text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">
                          {improvement.title}
                        </h4>
                        <Badge className={`text-xs border-0 ${
                          improvement.priority === 'high' 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                            : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                        }`}>
                          {improvement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {improvement.description}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-600 text-center py-8">
                  Great work! No major areas for improvement identified.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Action Items */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-400">
            <div className="p-2 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            Critical Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalActions.map((action) => (
              <div key={action.id} className="bg-gray-100 border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-lg">
                        #{action.id}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {action.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {action.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Timeline: <span className="text-gray-800 font-medium">{action.timeline}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                        <span className="text-gray-600">Impact: <span className="text-gray-800 font-medium">{action.impact}</span></span>
                      </div>
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