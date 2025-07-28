'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Calendar, DollarSign, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { FormData } from '@/types/financial';

interface RetirementPlanningProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

export default function RetirementPlanning({ clientData, analysisResults }: RetirementPlanningProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentAge = clientData.personal?.dateOfBirth ? 
    new Date().getFullYear() - new Date(clientData.personal.dateOfBirth).getFullYear() : 35;
  const retirementAge = clientData.goals?.retirementAge || 65;
  const yearsToRetirement = retirementAge - currentAge;
  const annualIncome = clientData.income?.annualIncome || 0;
  const currentRetirementSavings = (clientData.assets?.retirement401k || 0) + (clientData.assets?.ira || 0);
  
  // Get Claude analysis data if available
  const retirementData = analysisResults?.structured_data?.retirement_planning || {};
  
  // Calculate retirement projections
  const calculateRetirementProjections = () => {
    const assumedReturn = 0.07; // 7% annual return
    const inflationRate = 0.025; // 2.5% inflation
    const incomeReplacementRate = 0.8; // 80% of current income
    
    // Current monthly contribution (assuming 10% of gross income)
    const monthlyContribution = (annualIncome * 0.1) / 12;
    
    // Future value calculation with monthly contributions
    const monthlyReturn = assumedReturn / 12;
    const totalMonths = yearsToRetirement * 12;
    
    // Future value of current savings
    const futureValueCurrent = currentRetirementSavings * Math.pow(1 + assumedReturn, yearsToRetirement);
    
    // Future value of monthly contributions
    const futureValueContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    
    const totalProjected = futureValueCurrent + futureValueContributions;
    
    // Annual withdrawal using 4% rule
    const annualWithdrawal = totalProjected * 0.04;
    
    // Required income in today's dollars (adjusted for inflation)
    const requiredIncomeToday = annualIncome * incomeReplacementRate;
    const requiredIncomeFuture = requiredIncomeToday * Math.pow(1 + inflationRate, yearsToRetirement);
    
    // Gap analysis
    const incomeGap = Math.max(0, requiredIncomeFuture - annualWithdrawal);
    const additionalSavingsNeeded = incomeGap / 0.04;
    const additionalMonthlySavings = additionalSavingsNeeded / totalMonths;
    
    return {
      totalProjected,
      annualWithdrawal,
      requiredIncomeFuture,
      incomeGap,
      additionalSavingsNeeded,
      additionalMonthlySavings,
      monthlyContribution,
      successProbability: incomeGap <= 0 ? 95 : Math.max(30, 95 - (incomeGap / requiredIncomeFuture) * 100)
    };
  };
  
  const projections = calculateRetirementProjections();
  
  // Generate savings timeline
  const generateSavingsTimeline = () => {
    const timeline = [];
    const yearsToShow = Math.min(yearsToRetirement, 30);
    const assumedReturn = 0.07;
    
    for (let year = 0; year <= yearsToShow; year += 5) {
      const futureValue = currentRetirementSavings * Math.pow(1 + assumedReturn, year);
      timeline.push({
        year: new Date().getFullYear() + year,
        age: currentAge + year,
        projectedSavings: futureValue,
        isRetirement: year >= yearsToRetirement
      });
    }
    
    return timeline;
  };
  
  const timeline = generateSavingsTimeline();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Retirement Planning Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your path to a secure retirement with detailed projections
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Years to Retirement</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{yearsToRetirement}</p>
            <p className="text-xs text-gray-500 mt-1">Age {currentAge} → {retirementAge}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Current Savings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentRetirementSavings)}
            </p>
            <p className="text-xs text-gray-500 mt-1">401k + IRA</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Projected Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(projections.totalProjected)}
            </p>
            <p className="text-xs text-gray-500 mt-1">At retirement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {projections.successProbability.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Probability</p>
          </CardContent>
        </Card>
      </div>

      {/* Retirement Readiness Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Retirement Readiness Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Retirement Goal Progress
                </h3>
                <Badge variant={projections.successProbability >= 80 ? 'default' : 
                              projections.successProbability >= 60 ? 'secondary' : 'destructive'}>
                  {projections.successProbability >= 80 ? 'On Track' : 
                   projections.successProbability >= 60 ? 'Needs Work' : 'Behind'}
                </Badge>
              </div>
              <Progress value={projections.successProbability} className="h-3 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Based on current savings rate and projected growth
              </p>
            </div>

            {/* Income Projections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Projected Annual Income
                  </h4>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(projections.annualWithdrawal)}
                </p>
                <p className="text-sm text-green-800 dark:text-green-200">
                  4% withdrawal rule
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Income Need
                  </h4>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(projections.requiredIncomeFuture)}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  80% of current income
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${
                projections.incomeGap > 0 
                  ? 'bg-red-50 dark:bg-red-900' 
                  : 'bg-green-50 dark:bg-green-900'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {projections.incomeGap > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                  <h4 className={`font-medium ${
                    projections.incomeGap > 0
                      ? 'text-red-900 dark:text-red-100'
                      : 'text-green-900 dark:text-green-100'
                  }`}>
                    {projections.incomeGap > 0 ? 'Shortfall' : 'Surplus'}
                  </h4>
                </div>
                <p className={`text-2xl font-bold ${
                  projections.incomeGap > 0
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-green-900 dark:text-green-100'
                }`}>
                  {formatCurrency(Math.abs(projections.incomeGap))}
                </p>
                <p className={`text-sm ${
                  projections.incomeGap > 0
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  {projections.incomeGap > 0 ? 'Annual gap' : 'Annual surplus'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      {projections.incomeGap > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Retirement Savings Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">
                  Required Additional Savings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-orange-800 dark:text-orange-200">Additional Monthly Savings Needed</p>
                    <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                      {formatCurrency(projections.additionalMonthlySavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-800 dark:text-orange-200">Total Additional Savings Needed</p>
                    <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                      {formatCurrency(projections.additionalSavingsNeeded)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Optimization Strategies
                </h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Maximize employer 401(k) match - free money!</li>
                  <li>• Consider increasing contribution rate by 1% annually</li>
                  <li>• Explore Roth IRA for tax diversification</li>
                  <li>• Review and optimize investment allocation</li>
                  <li>• Consider catch-up contributions if 50+</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Savings Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Projected Savings Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((milestone, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                milestone.isRetirement 
                  ? 'bg-green-50 dark:bg-green-900 border-2 border-green-200 dark:border-green-700'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.isRetirement
                      ? 'bg-green-100 dark:bg-green-800'
                      : 'bg-blue-100 dark:bg-blue-800'
                  }`}>
                    <span className={`font-bold ${
                      milestone.isRetirement
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-blue-700 dark:text-blue-300'
                    }`}>
                      {milestone.age}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {milestone.year} {milestone.isRetirement ? '(Retirement)' : ''}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Age {milestone.age}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(milestone.projectedSavings)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Projected savings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}