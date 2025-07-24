'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CashFlow } from '@/types/financial';

interface CashFlowAnalysisFormProps {
  data?: CashFlow;
  onUpdate: (data: CashFlow) => void;
  onFieldUpdate: (field: keyof CashFlow, value: any) => void;
}

export default function CashFlowAnalysisForm({ data, onUpdate, onFieldUpdate }: CashFlowAnalysisFormProps) {
  const cashFlowData = data || {} as CashFlow;

  const handleFieldChange = (field: keyof CashFlow, value: any) => {
    const updatedData = {
      ...cashFlowData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const calculateNetCashFlow = () => {
    const takeHome = cashFlowData.takeHomePay || 0;
    const totalExpenses = (cashFlowData.essentialExpenses || 0) + 
                         (cashFlowData.discretionaryExpenses || 0);
    return takeHome - totalExpenses;
  };

  const calculateSavingsRate = () => {
    const takeHome = cashFlowData.takeHomePay || 0;
    if (takeHome === 0) return 0;
    return ((calculateNetCashFlow()) / takeHome) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Take-Home Pay */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💰 Take-Home Pay</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="takeHomePay">Monthly Take-Home Pay</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="takeHomePay"
                  type="number"
                  placeholder="5500"
                  value={cashFlowData.takeHomePay || ''}
                  onChange={(e) => handleFieldChange('takeHomePay', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">After taxes and deductions</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payFrequency">Pay Frequency</Label>
              <Select
                value={cashFlowData.payFrequency || ''}
                onValueChange={(value) => handleFieldChange('payFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How often are you paid?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="semimonthly">Semi-monthly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="irregularIncome">Irregular Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="irregularIncome"
                  type="number"
                  placeholder="0"
                  value={cashFlowData.irregularIncome || ''}
                  onChange={(e) => handleFieldChange('irregularIncome', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Monthly average from bonuses, commissions, etc.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeStability">Income Stability Assessment</Label>
              <Select
                value={cashFlowData.incomeStability || ''}
                onValueChange={(value) => handleFieldChange('incomeStability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How stable is your income?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_stable">Very stable (less than 5% variation)</SelectItem>
                  <SelectItem value="stable">Stable (5-15% variation)</SelectItem>
                  <SelectItem value="somewhat_variable">Somewhat variable (15-30%)</SelectItem>
                  <SelectItem value="highly_variable">Highly variable (30%+ variation)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Essential Expenses */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏠 Essential Expenses</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="essentialExpenses">Total Essential Expenses</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="essentialExpenses"
                  type="number"
                  placeholder="3500"
                  value={cashFlowData.essentialExpenses || ''}
                  onChange={(e) => handleFieldChange('essentialExpenses', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Housing, utilities, food, transport, min debt payments</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="housingCostPercentage">Housing Cost as % of Income</Label>
              <Input
                id="housingCostPercentage"
                type="number"
                placeholder="28"
                value={cashFlowData.housingCostPercentage || ''}
                onChange={(e) => handleFieldChange('housingCostPercentage', parseFloat(e.target.value) || 0)}
                max="100"
              />
              <p className="text-xs text-gray-500">Recommended: under 28% of gross income</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="debtToIncomeRatio">Debt-to-Income Ratio</Label>
              <Input
                id="debtToIncomeRatio"
                type="number"
                placeholder="36"
                value={cashFlowData.debtToIncomeRatio || ''}
                onChange={(e) => handleFieldChange('debtToIncomeRatio', parseFloat(e.target.value) || 0)}
                max="100"
              />
              <p className="text-xs text-gray-500">Total debt payments as % of gross income</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseFlexibility">Expense Flexibility</Label>
              <Select
                value={cashFlowData.expenseFlexibility || ''}
                onValueChange={(value) => handleFieldChange('expenseFlexibility', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How flexible are your expenses?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_flexible">Very flexible - can cut 20%+</SelectItem>
                  <SelectItem value="somewhat_flexible">Somewhat flexible - can cut 10-20%</SelectItem>
                  <SelectItem value="limited_flexibility">Limited flexibility - can cut 5-10%</SelectItem>
                  <SelectItem value="no_flexibility">No flexibility - all fixed costs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discretionary Spending */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎯 Discretionary Spending</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discretionaryExpenses">Monthly Discretionary Expenses</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="discretionaryExpenses"
                  type="number"
                  placeholder="800"
                  value={cashFlowData.discretionaryExpenses || ''}
                  onChange={(e) => handleFieldChange('discretionaryExpenses', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Entertainment, dining out, hobbies, shopping</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="largestDiscretionaryCategory">Largest Discretionary Category</Label>
              <Select
                value={cashFlowData.largestDiscretionaryCategory || ''}
                onValueChange={(value) => handleFieldChange('largestDiscretionaryCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Where do you spend most discretionary money?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dining_out">Dining out</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping/clothes</SelectItem>
                  <SelectItem value="hobbies">Hobbies/sports</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="subscriptions">Subscriptions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seasonalSpendingVariation">Seasonal Spending Variation</Label>
              <Select
                value={cashFlowData.seasonalSpendingVariation || ''}
                onValueChange={(value) => handleFieldChange('seasonalSpendingVariation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How much do expenses vary seasonally?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal variation (under 10%)</SelectItem>
                  <SelectItem value="moderate">Moderate variation (10-25%)</SelectItem>
                  <SelectItem value="significant">Significant variation (25%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unexpectedExpenseHandling">Unexpected Expense Handling</Label>
              <Select
                value={cashFlowData.unexpectedExpenseHandling || ''}
                onValueChange={(value) => handleFieldChange('unexpectedExpenseHandling', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you handle unexpected expenses?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency_fund">Emergency fund</SelectItem>
                  <SelectItem value="reduce_spending">Reduce other spending</SelectItem>
                  <SelectItem value="credit_card">Credit card</SelectItem>
                  <SelectItem value="borrow_family">Borrow from family</SelectItem>
                  <SelectItem value="struggle">Struggle to cover</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Analysis */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-green-900">📊 Cash Flow Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-green-700 font-medium">Take-Home Pay</p>
              <p className="text-green-900 font-bold text-lg">{formatCurrency(cashFlowData.takeHomePay || 0)}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Essential Expenses</p>
              <p className="text-green-900 font-bold text-lg">{formatCurrency(cashFlowData.essentialExpenses || 0)}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Discretionary Expenses</p>
              <p className="text-green-900 font-bold text-lg">{formatCurrency(cashFlowData.discretionaryExpenses || 0)}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Net Cash Flow</p>
              <p className={`font-bold text-lg ${calculateNetCashFlow() >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {formatCurrency(calculateNetCashFlow())}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-green-700 font-medium">Savings Rate</p>
              <p className={`font-bold text-xl ${calculateSavingsRate() >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {calculateSavingsRate().toFixed(1)}%
              </p>
              <p className="text-xs text-green-600">Recommended: 20%+</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Annual Surplus/Deficit</p>
              <p className={`font-bold text-xl ${calculateNetCashFlow() >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {formatCurrency(calculateNetCashFlow() * 12)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings & Investment Allocation */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💼 Savings & Investment Allocation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentSavingsAllocation">Current Monthly Savings</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="currentSavingsAllocation"
                  type="number"
                  placeholder="1000"
                  value={cashFlowData.currentSavingsAllocation || ''}
                  onChange={(e) => handleFieldChange('currentSavingsAllocation', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirementContributions">Monthly Retirement Contributions</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="retirementContributions"
                  type="number"
                  placeholder="500"
                  value={cashFlowData.retirementContributions || ''}
                  onChange={(e) => handleFieldChange('retirementContributions', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="savingsGoalProgress">Savings Goals Progress</Label>
              <Select
                value={cashFlowData.savingsGoalProgress || ''}
                onValueChange={(value) => handleFieldChange('savingsGoalProgress', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How are you tracking toward goals?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ahead_of_schedule">Ahead of schedule</SelectItem>
                  <SelectItem value="on_track">On track</SelectItem>
                  <SelectItem value="behind_schedule">Behind schedule</SelectItem>
                  <SelectItem value="significantly_behind">Significantly behind</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Management */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">⚖️ Cash Flow Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetingMethod">Budgeting Method</Label>
              <Select
                value={cashFlowData.budgetingMethod || ''}
                onValueChange={(value) => handleFieldChange('budgetingMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you budget?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zero_based">Zero-based budgeting</SelectItem>
                  <SelectItem value="50_30_20">50/30/20 rule</SelectItem>
                  <SelectItem value="envelope">Envelope method</SelectItem>
                  <SelectItem value="priority_based">Priority-based budgeting</SelectItem>
                  <SelectItem value="no_formal_budget">No formal budget</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashFlowTiming">Cash Flow Timing Issues</Label>
              <Select
                value={cashFlowData.cashFlowTiming || ''}
                onValueChange={(value) => handleFieldChange('cashFlowTiming', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Do you have timing mismatches?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_issues">No timing issues</SelectItem>
                  <SelectItem value="occasional">Occasional timing issues</SelectItem>
                  <SelectItem value="regular">Regular timing issues</SelectItem>
                  <SelectItem value="chronic">Chronic cash flow problems</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="automaticTransfers">Automatic Transfers/Savings</Label>
              <Select
                value={cashFlowData.automaticTransfers || ''}
                onValueChange={(value) => handleFieldChange('automaticTransfers', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How automated are your savings?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fully_automated">Fully automated</SelectItem>
                  <SelectItem value="mostly_automated">Mostly automated</SelectItem>
                  <SelectItem value="partially_automated">Partially automated</SelectItem>
                  <SelectItem value="all_manual">All manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountStrategy">Bank Account Strategy</Label>
              <Select
                value={cashFlowData.bankAccountStrategy || ''}
                onValueChange={(value) => handleFieldChange('bankAccountStrategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you organize accounts?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_account">Single checking account</SelectItem>
                  <SelectItem value="two_accounts">Checking + savings</SelectItem>
                  <SelectItem value="multiple_purpose">Multiple purpose-based accounts</SelectItem>
                  <SelectItem value="complex_system">Complex account system</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cashFlowChallenges">Cash Flow Challenges</Label>
            <Textarea
              id="cashFlowChallenges"
              placeholder="What are your biggest cash flow challenges or concerns?"
              value={cashFlowData.cashFlowChallenges || ''}
              onChange={(e) => handleFieldChange('cashFlowChallenges', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Cash Flow Management Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>50/30/20 rule:</strong> 50% needs, 30% wants, 20% savings/debt repayment</li>
            <li>• <strong>Pay yourself first:</strong> Automate savings before discretionary spending</li>
            <li>• <strong>Track patterns:</strong> Understand your spending cycles and plan accordingly</li>
            <li>• <strong>Emergency buffer:</strong> Keep 1-2 weeks of expenses in checking for timing</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}