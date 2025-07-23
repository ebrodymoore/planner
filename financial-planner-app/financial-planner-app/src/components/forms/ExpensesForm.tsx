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
  onFieldUpdate?: (field: string, value: any) => void;
}

export default function ExpensesForm({ data, onUpdate }: ExpensesFormProps) {
  const expensesData = data || {} as Expenses;

  const handleFieldChange = (field: keyof Expenses, value: string | number) => {
    const stringFields = ['housingType', 'fixedVsVariableRatio', 'seasonalVariations', 'recentExpenseChanges', 'potentialReductions'];
    const updatedData = {
      ...expensesData,
      [field]: stringFields.includes(field as string)
        ? value
        : (typeof value === 'string' ? parseFloat(value) || 0 : value)
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
    return (expensesData.housing || 0) + 
           (expensesData.transportation || 0) + 
           (expensesData.travel || 0) + 
           (expensesData.recreation || 0) + 
           (expensesData.food || 0) + 
           (expensesData.healthcare || 0) + 
           (expensesData.shopping || 0) + 
           (expensesData.technology || 0) + 
           (expensesData.personalCare || 0) + 
           (expensesData.entertainment || 0);
  };

  const getAnnualExpenses = () => {
    return getTotalMonthlyExpenses() * 12;
  };

  return (
    <div className="space-y-6">
      {/* Housing Type */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Housing Information</h3>
          
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
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Monthly Expense Categories</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Housing */}
            <div className="space-y-2">
              <Label htmlFor="housing">Housing</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="housing"
                  type="number"
                  placeholder="1491"
                  value={expensesData.housing || ''}
                  onChange={(e) => handleFieldChange('housing', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Mortgage + utilities + home expenses
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
                  placeholder="830"
                  value={expensesData.transportation || ''}
                  onChange={(e) => handleFieldChange('transportation', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Auto finance + gas + service + rideshare
              </p>
            </div>

            {/* Travel */}
            <div className="space-y-2">
              <Label htmlFor="travel">Travel</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="travel"
                  type="number"
                  placeholder="521"
                  value={expensesData.travel || ''}
                  onChange={(e) => handleFieldChange('travel', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Flights and lodging
              </p>
            </div>

            {/* Recreation */}
            <div className="space-y-2">
              <Label htmlFor="recreation">Recreation</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="recreation"
                  type="number"
                  placeholder="660"
                  value={expensesData.recreation || ''}
                  onChange={(e) => handleFieldChange('recreation', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                All recreation expenses
              </p>
            </div>

            {/* Food */}
            <div className="space-y-2">
              <Label htmlFor="food">Food</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="food"
                  type="number"
                  placeholder="275"
                  value={expensesData.food || ''}
                  onChange={(e) => handleFieldChange('food', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Groceries + dining
              </p>
            </div>

            {/* Healthcare */}
            <div className="space-y-2">
              <Label htmlFor="healthcare">Healthcare</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="healthcare"
                  type="number"
                  placeholder="420"
                  value={expensesData.healthcare || ''}
                  onChange={(e) => handleFieldChange('healthcare', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Medical + pet care + insurance
              </p>
            </div>

            {/* Shopping */}
            <div className="space-y-2">
              <Label htmlFor="shopping">Shopping</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="shopping"
                  type="number"
                  placeholder="340"
                  value={expensesData.shopping || ''}
                  onChange={(e) => handleFieldChange('shopping', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Online + clothing
              </p>
            </div>

            {/* Technology */}
            <div className="space-y-2">
              <Label htmlFor="technology">Technology</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="technology"
                  type="number"
                  placeholder="20"
                  value={expensesData.technology || ''}
                  onChange={(e) => handleFieldChange('technology', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Apps and subscriptions
              </p>
            </div>

            {/* Personal Care */}
            <div className="space-y-2">
              <Label htmlFor="personalCare">Personal Care</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="personalCare"
                  type="number"
                  placeholder="31"
                  value={expensesData.personalCare || ''}
                  onChange={(e) => handleFieldChange('personalCare', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Haircuts, personal items
              </p>
            </div>

            {/* Entertainment */}
            <div className="space-y-2">
              <Label htmlFor="entertainment">Entertainment</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="entertainment"
                  type="number"
                  placeholder="5"
                  value={expensesData.entertainment || ''}
                  onChange={(e) => handleFieldChange('entertainment', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Streaming services
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Summary */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-orange-900 mb-3">📊 Monthly Expense Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-orange-700 font-medium">Housing</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.housing || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Transportation</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.transportation || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Food</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.food || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Healthcare</p>
              <p className="text-orange-900 font-bold">{formatCurrency(expensesData.healthcare || 0)}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">Other</p>
              <p className="text-orange-900 font-bold">{formatCurrency(
                (expensesData.travel || 0) + 
                (expensesData.recreation || 0) + 
                (expensesData.shopping || 0) + 
                (expensesData.technology || 0) + 
                (expensesData.personalCare || 0) + 
                (expensesData.entertainment || 0)
              )}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-orange-900 font-semibold">Total Monthly:</span>
              <span className="text-orange-900 font-bold text-lg">{formatCurrency(getTotalMonthlyExpenses())}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-orange-700">Total Annual:</span>
              <span className="text-orange-700 font-semibold">{formatCurrency(getAnnualExpenses())}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}