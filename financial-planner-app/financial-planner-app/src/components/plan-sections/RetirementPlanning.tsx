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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
          Retirement Planning Analysis
        </h2>
        <p className="text-slate-400 text-lg">
          Your path to a secure retirement with detailed projections
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:bg-slate-700/40 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 mb-3 inline-block">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Years to Retirement</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">{yearsToRetirement}</p>
            <p className="text-xs text-slate-500 mt-1">Age {currentAge} → {retirementAge}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:bg-slate-700/40 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl blur-sm"></div>
              <div className="relative p-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20 mb-3 inline-block">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Current Savings</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              {formatCurrency(currentRetirementSavings)}
            </p>
            <p className="text-xs text-slate-500 mt-1">401k + IRA</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:bg-slate-700/40 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl blur-sm"></div>
              <div className="relative p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 mb-3 inline-block">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Projected Total</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
              {formatCurrency(projections.totalProjected)}
            </p>
            <p className="text-xs text-slate-500 mt-1">At retirement</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:bg-slate-700/40 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl blur-sm"></div>
              <div className="relative p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20 mb-3 inline-block">
                <BarChart3 className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Success Rate</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              {projections.successProbability.toFixed(0)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Probability</p>
          </CardContent>
        </Card>
      </div>

      {/* Retirement Readiness Assessment */}
      <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            Retirement Readiness Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">
                  Retirement Goal Progress
                </h3>
                <Badge variant={projections.successProbability >= 80 ? 'default' : 
                              projections.successProbability >= 60 ? 'secondary' : 'destructive'}>
                  {projections.successProbability >= 80 ? 'On Track' : 
                   projections.successProbability >= 60 ? 'Needs Work' : 'Behind'}
                </Badge>
              </div>
              <div className="relative mb-3">
                <div className="w-full bg-slate-700 rounded-full h-4">
                  <div 
                    className="h-4 rounded-full transition-all duration-1000 bg-gradient-to-r from-emerald-500 to-emerald-600"
                    style={{ width: `${projections.successProbability}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Based on current savings rate and projected growth
              </p>
            </div>

            {/* Income Projections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-600/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-500/30">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="font-medium text-emerald-400">
                    Projected Annual Income
                  </h4>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(projections.annualWithdrawal)}
                </p>
                <p className="text-sm text-slate-300">
                  4% withdrawal rule
                </p>
              </div>
              
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-600/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="font-medium text-blue-400">
                    Income Need
                  </h4>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(projections.requiredIncomeFuture)}
                </p>
                <p className="text-sm text-slate-300">
                  80% of current income
                </p>
              </div>
              
              <div className={`p-4 rounded-xl border hover:bg-slate-600/30 transition-all duration-300 ${
                projections.incomeGap > 0 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-emerald-500/10 border-emerald-500/20'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg border ${
                    projections.incomeGap > 0
                      ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30'
                      : 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30'
                  }`}>
                    {projections.incomeGap > 0 ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <h4 className={`font-medium ${
                    projections.incomeGap > 0
                      ? 'text-red-400'
                      : 'text-emerald-400'
                  }`}>
                    {projections.incomeGap > 0 ? 'Shortfall' : 'Surplus'}
                  </h4>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(Math.abs(projections.incomeGap))}
                </p>
                <p className="text-sm text-slate-300">
                  {projections.incomeGap > 0 ? 'Annual gap' : 'Annual surplus'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      {projections.incomeGap > 0 && (
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-400">
              <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              Retirement Savings Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-5">
                <h4 className="font-semibold text-orange-400 mb-3">
                  Required Additional Savings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-300">Additional Monthly Savings Needed</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(projections.additionalMonthlySavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Total Additional Savings Needed</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(projections.additionalSavingsNeeded)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-5">
                <h4 className="font-semibold text-blue-400 mb-3">
                  Optimization Strategies
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
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
      <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            Projected Savings Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((milestone, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                milestone.isRetirement 
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg'
                  : 'bg-slate-600/20 border-slate-600/30 hover:bg-slate-600/30'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    milestone.isRetirement
                      ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30'
                      : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30'
                  }`}>
                    <span className={`font-bold ${
                      milestone.isRetirement
                        ? 'text-emerald-400'
                        : 'text-blue-400'
                    }`}>
                      {milestone.age}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {milestone.year} {milestone.isRetirement ? '(Retirement)' : ''}
                    </p>
                    <p className="text-sm text-slate-300">
                      Age {milestone.age}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(milestone.projectedSavings)}
                  </p>
                  <p className="text-sm text-slate-300">
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