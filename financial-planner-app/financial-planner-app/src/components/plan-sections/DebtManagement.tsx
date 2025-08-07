'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingDown, 
  CreditCard, 
  Home, 
  GraduationCap, 
  Car,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { FormData } from '@/types/financial';

interface DebtManagementProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

interface DebtItem {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minimumPayment: number;
  type: 'credit_card' | 'student' | 'auto' | 'mortgage' | 'other';
  icon: React.ElementType;
}

export default function DebtManagement({ clientData, analysisResults }: DebtManagementProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [extraPayment] = useState(500);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAllDebts = (): DebtItem[] => {
    const debts: DebtItem[] = [];
    const liabilities = clientData.liabilities;
    
    if (!liabilities) return debts;

    // Mortgage
    if (liabilities.mortgageBalance && liabilities.mortgageBalance > 0) {
      debts.push({
        id: 'mortgage',
        name: 'Mortgage',
        balance: liabilities.mortgageBalance,
        rate: liabilities.mortgageRate || 3.5,
        minimumPayment: calculateMortgagePayment(liabilities.mortgageBalance, liabilities.mortgageRate || 3.5),
        type: 'mortgage',
        icon: Home
      });
    }

    // Credit Cards
    if (liabilities.creditCards) {
      liabilities.creditCards.forEach((card, index) => {
        if (card.balance > 0) {
          debts.push({
            id: `credit_${index}`,
            name: `Credit Card ${index + 1}`,
            balance: card.balance,
            rate: card.rate || 18.0,
            minimumPayment: Math.max(25, card.balance * 0.02),
            type: 'credit_card',
            icon: CreditCard
          });
        }
      });
    }

    // Student Loans
    if (liabilities.studentLoans) {
      liabilities.studentLoans.forEach((loan, index) => {
        if (loan.balance > 0) {
          debts.push({
            id: `student_${index}`,
            name: `Student Loan ${index + 1}`,
            balance: loan.balance,
            rate: loan.rate || 5.5,
            minimumPayment: calculateLoanPayment(loan.balance, loan.rate || 5.5, 10),
            type: 'student',
            icon: GraduationCap
          });
        }
      });
    }

    // Auto Loans
    if (liabilities.autoLoans) {
      liabilities.autoLoans.forEach((loan, index) => {
        if (loan.balance > 0) {
          debts.push({
            id: `auto_${index}`,
            name: `Auto Loan ${index + 1}`,
            balance: loan.balance,
            rate: loan.rate || 4.5,
            minimumPayment: calculateLoanPayment(loan.balance, loan.rate || 4.5, 5),
            type: 'auto',
            icon: Car
          });
        }
      });
    }

    return debts;
  };

  const calculateMortgagePayment = (balance: number, rate: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = 30 * 12; // 30 years
    return (balance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const calculateLoanPayment = (balance: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return (balance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const calculatePayoffStrategy = (debts: DebtItem[], strategy: 'avalanche' | 'snowball', extraAmount: number) => {
    if (debts.length === 0) return [];

    const sortedDebts = [...debts];
    
    if (strategy === 'avalanche') {
      sortedDebts.sort((a, b) => b.rate - a.rate);
    } else {
      sortedDebts.sort((a, b) => a.balance - b.balance);
    }

    const payoffPlan = [];
    const remainingDebts = [...sortedDebts];
    let currentMonth = 1;
    let totalInterestSaved = 0;

    while (remainingDebts.length > 0 && currentMonth <= 360) { // Max 30 years
      const targetDebt = remainingDebts[0];
      const payment = targetDebt.minimumPayment + (remainingDebts.length === 1 ? extraAmount : extraAmount);
      
      const monthlyInterest = (targetDebt.balance * targetDebt.rate / 100) / 12;
      const principalPayment = Math.min(payment - monthlyInterest, targetDebt.balance);
      
      targetDebt.balance -= principalPayment;
      totalInterestSaved += monthlyInterest;

      if (targetDebt.balance <= 0) {
        payoffPlan.push({
          debtName: targetDebt.name,
          monthsToPayoff: currentMonth,
          totalInterest: totalInterestSaved
        });
        remainingDebts.shift();
      }

      // Update minimum payments for other debts
      remainingDebts.forEach(debt => {
        if (debt.id !== targetDebt.id) {
          const interest = (debt.balance * debt.rate / 100) / 12;
          debt.balance = Math.max(0, debt.balance - (debt.minimumPayment - interest));
        }
      });

      currentMonth++;
    }

    return payoffPlan;
  };

  const getDebtMetrics = (debts: DebtItem[]) => {
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const weightedAverageRate = debts.reduce((sum, debt) => sum + (debt.rate * debt.balance), 0) / totalDebt;
    const annualIncome = clientData.income?.annualIncome || 0;
    const debtToIncomeRatio = annualIncome > 0 ? (totalDebt / annualIncome) * 100 : 0;

    return {
      totalDebt,
      totalMinimumPayments,
      weightedAverageRate: isNaN(weightedAverageRate) ? 0 : weightedAverageRate,
      debtToIncomeRatio
    };
  };

  const debts = getAllDebts();
  const metrics = getDebtMetrics(debts);
  calculatePayoffStrategy(debts, 'avalanche', extraPayment);
  calculatePayoffStrategy(debts, 'snowball', extraPayment);

  // Get Claude analysis data if available
  const debtData = analysisResults?.structured_data?.debt_management || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
          Debt Management Strategy
        </h2>
        <p className="text-slate-400 text-lg">
          Optimize your debt payoff strategy and accelerate financial freedom
        </p>
      </div>

      {/* Debt Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:bg-slate-700/40 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl blur-sm"></div>
              <div className="relative p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl border border-red-500/20 mb-3 inline-block">
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Total Debt</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
              {formatCurrency(metrics.totalDebt)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {debtData.total_debt ? `Claude: ${formatCurrency(debtData.total_debt)}` : 'All debts combined'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:bg-slate-700/40 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl blur-sm"></div>
              <div className="relative p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20 mb-3 inline-block">
                <Calculator className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Monthly Payments</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              {formatCurrency(metrics.totalMinimumPayments)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Minimum required</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30 hover:bg-slate-700/40 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 mb-3 inline-block">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Avg Interest Rate</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              {metrics.weightedAverageRate.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Weighted average</p>
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
            <p className="text-sm text-slate-400 font-medium">Debt-to-Income</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
              {metrics.debtToIncomeRatio.toFixed(0)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {debtData.debt_to_income_ratio ? `Claude: ${(debtData.debt_to_income_ratio * 100).toFixed(0)}%` : 'Target: <36%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Debts */}
      <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30">
              <CreditCard className="w-5 h-5 text-red-400" />
            </div>
            Debt Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debts.map((debt) => {
              const IconComponent = debt.icon;
              const balancePercentage = metrics.totalDebt > 0 ? (debt.balance / metrics.totalDebt) * 100 : 0;
              
              return (
                <div key={debt.id} className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-600/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg border border-slate-600/30">
                        <IconComponent className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{debt.name}</h4>
                        <p className="text-sm text-slate-300">
                          {debt.rate.toFixed(1)}% APR
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(debt.balance)}
                      </p>
                      <p className="text-sm text-slate-300">
                        Min: {formatCurrency(debt.minimumPayment)}/mo
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        {balancePercentage.toFixed(1)}% of total debt
                      </span>
                      <Badge variant={debt.rate > 15 ? 'destructive' : debt.rate > 8 ? 'secondary' : 'default'}>
                        {debt.rate > 15 ? 'High Interest' : debt.rate > 8 ? 'Medium Interest' : 'Low Interest'}
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-red-500 to-orange-500"
                        style={{ width: `${balancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payoff Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debt Avalanche */}
        <Card className={`bg-slate-700/30 backdrop-blur-sm border-slate-600/30 transition-all duration-300 ${selectedStrategy === 'avalanche' ? 'ring-2 ring-blue-400 bg-slate-700/50' : 'hover:bg-slate-700/40'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                <TrendingDown className="w-5 h-5 text-blue-400" />
              </div>
              Debt Avalanche Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4">
                <h4 className="font-semibold text-blue-400 mb-2">
                  Pay highest interest rates first
                </h4>
                <p className="text-sm text-slate-300">
                  Mathematically optimal - saves the most money in interest payments
                </p>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-medium text-white">Payoff Order:</h5>
                {debts.sort((a, b) => b.rate - a.rate).map((debt, index) => (
                  <div key={debt.id} className="flex items-center justify-between p-3 bg-slate-600/20 border border-slate-600/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-white">{debt.name}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-400">{debt.rate.toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setSelectedStrategy('avalanche')}
                className={`w-full transition-all duration-300 ${
                  selectedStrategy === 'avalanche' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
                    : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                }`}
              >
                Use Avalanche Strategy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debt Snowball */}
        <Card className={`bg-slate-700/30 backdrop-blur-sm border-slate-600/30 transition-all duration-300 ${selectedStrategy === 'snowball' ? 'ring-2 ring-emerald-400 bg-slate-700/50' : 'hover:bg-slate-700/40'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-500/30">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              Debt Snowball Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-400 mb-2">
                  Pay smallest balances first
                </h4>
                <p className="text-sm text-slate-300">
                  Psychologically motivating - builds momentum with quick wins
                </p>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-medium text-white">Payoff Order:</h5>
                {debts.sort((a, b) => a.balance - b.balance).map((debt, index) => (
                  <div key={debt.id} className="flex items-center justify-between p-3 bg-slate-600/20 border border-slate-600/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-white">{debt.name}</span>
                    </div>
                    <span className="text-sm font-medium text-emerald-400">{formatCurrency(debt.balance)}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setSelectedStrategy('snowball')}
                className={`w-full transition-all duration-300 ${
                  selectedStrategy === 'snowball' 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white' 
                    : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                }`}
              >
                Use Snowball Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claude API Recommendations */}
      {debtData.recommended_strategy && (
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              Claude AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-5">
              <h4 className="font-semibold text-blue-400 mb-3">
                Recommended Strategy: {debtData.recommended_strategy}
              </h4>
              <p className="text-sm text-slate-300 mb-3">
                {debtData.payoff_timeline}
              </p>
              {debtData.monthly_payment_plan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Monthly Payment Plan:</p>
                    <pre className="text-xs text-slate-300 mt-1 bg-slate-700/50 p-3 rounded-lg border border-slate-600/30">
                      {JSON.stringify(debtData.monthly_payment_plan, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Interest Savings:</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                      {formatCurrency(debtData.interest_savings || 0)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Your Debt Elimination Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-900/30 border border-orange-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-100 mb-2">
                  Immediate Actions (30 days)
                </h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• List all debts with balances and rates</li>
                  <li>• Stop using credit cards for new purchases</li>
                  <li>• Set up automatic minimum payments</li>
                  <li>• Choose your payoff strategy</li>
                </ul>
              </div>
              
              <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-100 mb-2">
                  Short-term (3-6 months)
                </h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Increase income through side work</li>
                  <li>• Reduce expenses to free up money</li>
                  <li>• Apply extra payments to target debt</li>
                  <li>• Consider debt consolidation if beneficial</li>
                </ul>
              </div>
              
              <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-green-100 mb-2">
                  Long-term (6+ months)
                </h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Maintain discipline with strategy</li>
                  <li>• Celebrate debt payoff milestones</li>
                  <li>• Build emergency fund as debts are paid</li>
                  <li>• Redirect payments to investments</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}