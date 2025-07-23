'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expenses } from '@/types/financial';

interface ExpensesFormProps {
  data?: Expenses;
  onUpdate: (data: Expenses) => void;
  onFieldUpdate: (field: keyof Expenses, value: any) => void;
}

export default function ExpensesForm({ data, onUpdate, onFieldUpdate }: ExpensesFormProps) {
  const expensesData = data || {} as Expenses;

  const handleFieldChange = (field: keyof Expenses, value: string | number) => {
    const updatedData = {
      ...expensesData,
      [field]: field !== 'fixedVsVariableRatio' && field !== 'seasonalVariations' && 
                field !== 'recentExpenseChanges' && field !== 'potentialReductions'
        ? (typeof value === 'string' ? parseFloat(value) || 0 : value)
        : value
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

  const getTotalMonthlyExpenses = () => {
    return (expensesData.housingPayment || 0) + 
           (expensesData.foodGroceries || 0) + 
           (expensesData.utilities || 0) + 
           (expensesData.gasoline || 0) + 
           (expensesData.diningEntertainment || 0);
  };

  const getAnnualExpenses = () => {
    return getTotalMonthlyExpenses() * 12;
  };

  return (
    <div className="space-y-6">
      {/* Housing Expenses */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Housing Expenses</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Housing Payment */}
            <div className="space-y-2">
              <Label htmlFor="housingPayment">Monthly Housing Payment *</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="housingPayment"
                  type="number"
                  placeholder="2500"
                  value={expensesData.housingPayment || ''}
                  onChange={(e) => handleFieldChange('housingPayment', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Mortgage/rent, insurance, HOA, property taxes
              </p>
            </div>

            {/* Housing Type */}
            <div className="space-y-2">
              <Label htmlFor="housingType">Housing Type</Label>
              <Select
                value={expensesData.housingType || ''}
                onValueChange={(value) => handleFieldChange('housingType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select housing situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="own_with_mortgage">Own with Mortgage</SelectItem>
                  <SelectItem value="own_outright">Own Outright (No Mortgage)</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="live_with_family">Live with Family/Friends</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Living Expenses */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Monthly Living Expenses</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Food & Groceries */}
            <div className="space-y-2">
              <Label htmlFor="food">Food & Groceries</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="food"
                  type="number"
                  placeholder="600"
                  value={expensesData.food || ''}
                  onChange={(e) => handleFieldChange('food', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Groceries, dining out, food delivery
              </p>
            </div>

            {/* Utilities */}
            <div className="space-y-2">
              <Label htmlFor="utilities">Utilities</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="utilities"
                  type="number"
                  placeholder="200"
                  value={expensesData.utilities || ''}
                  onChange={(e) => handleFieldChange('utilities', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Electricity, gas, water, internet, phone
              </p>
            </div>

            {/* Transportation */}
            <div className="space-y-2">
              <Label htmlFor="transportation">Transportation</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="transportation"
                  type="number"
                  placeholder="400"
                  value={expensesData.transportation || ''}
                  onChange={(e) => handleFieldChange('transportation', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Gas, car maintenance, public transit, parking
              </p>
            </div>

            {/* Entertainment & Discretionary */}
            <div className="space-y-2">
              <Label htmlFor="entertainment">Entertainment & Discretionary</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="entertainment"
                  type="number"
                  placeholder="300"
                  value={expensesData.entertainment || ''}
                  onChange={(e) => handleFieldChange('entertainment', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Movies, subscriptions, hobbies, personal care
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Summary */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-orange-900 mb-3">📊 Monthly Expense Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <p className="text-orange-700 font-medium">Housing</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.housingPayment || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Food</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.food || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Utilities</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.utilities || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Transportation</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.transportation || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Entertainment</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.entertainment || 0)}</p>
            </div>
            <div className="md:col-span-1">
              <p className="text-orange-700 font-medium">Total Monthly</p>
              <p className="text-orange-900 font-bold text-lg">{formatCurrency(getTotalMonthlyExpenses())}</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-orange-700 font-medium">Total Annual Expenses</span>
              <span className="text-orange-900 font-bold text-xl">{formatCurrency(getAnnualExpenses())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Expenses Note */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-yellow-900 mb-2">📝 Not Included Here</h4>
          <p className="text-sm text-yellow-800 mb-2">
            The following expenses are tracked separately in other sections:
          </p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• <strong>Debt payments:</strong> Credit cards, loans, and mortgage principal (Liabilities section)</li>
            <li>• <strong>Insurance premiums:</strong> Health, life, disability (calculated separately)</li>
            <li>• <strong>Savings & investments:</strong> 401k contributions, emergency fund (Assets section)</li>
            <li>• <strong>Taxes:</strong> Income, property, and other tax withholdings</li>
          </ul>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Expense Tracking Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Be realistic:</strong> Review bank statements for accurate amounts</li>
            <li>• <strong>Housing rule:</strong> Keep total housing costs under 28% of gross income</li>
            <li>• <strong>Track everything:</strong> Small expenses add up over time</li>
            <li>• <strong>Seasonal variation:</strong> Consider higher utility costs in winter/summer</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}