'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Income } from '@/types/financial';

interface IncomeFormProps {
  data?: Income;
  onUpdate: (data: Income) => void;
  onFieldUpdate: (field: keyof Income, value: any) => void;
}

export default function IncomeForm({ data, onUpdate, onFieldUpdate }: IncomeFormProps) {
  const incomeData = data || {} as Income;
  const [additionalIncomes, setAdditionalIncomes] = useState<Array<{amount: number, description: string}>>([]);

  const handleFieldChange = (field: keyof Income, value: string | number) => {
    const updatedData = {
      ...incomeData,
      [field]: field === 'annualIncome' || field === 'spouseIncome' || field === 'rentalIncome' || 
                field === 'investmentIncome'
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

  return (
    <div className="space-y-6">
      {/* Primary Income */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Primary Income</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Annual Gross Income */}
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Gross Income *</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="annualIncome"
                  type="number"
                  placeholder="0"
                  value={incomeData.annualIncome || ''}
                  onChange={(e) => handleFieldChange('annualIncome', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Current: {formatCurrency(incomeData.annualIncome || 0)}
              </p>
            </div>

            {/* Income Stability */}
            <div className="space-y-2">
              <Label htmlFor="stability">Income Stability</Label>
              <Select
                value={incomeData.stability || ''}
                onValueChange={(value) => handleFieldChange('stability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select income stability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_stable">Very Stable (Salary, Government)</SelectItem>
                  <SelectItem value="somewhat_stable">Somewhat Stable (Salary + Bonus)</SelectItem>
                  <SelectItem value="variable">Variable (Commission, Freelance)</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="unpredictable">Unpredictable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Growth Expectation */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="growthExpectation">Income Growth Expectation</Label>
              <Select
                value={incomeData.growthExpectation || ''}
                onValueChange={(value) => handleFieldChange('growthExpectation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Expected income growth over next 5 years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="declining">Declining (0-5% decrease)</SelectItem>
                  <SelectItem value="flat">Flat (0-2% growth)</SelectItem>
                  <SelectItem value="modest">Modest Growth (2-5% annually)</SelectItem>
                  <SelectItem value="strong">Strong Growth (5-10% annually)</SelectItem>
                  <SelectItem value="aggressive">Aggressive Growth (10%+ annually)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Income Sources */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Additional Income Sources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spouse Income */}
            <div className="space-y-2">
              <Label htmlFor="spouseIncome">Spouse/Partner Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="spouseIncome"
                  type="number"
                  placeholder="0"
                  value={incomeData.spouseIncome || ''}
                  onChange={(e) => handleFieldChange('spouseIncome', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Annual gross income: {formatCurrency(incomeData.spouseIncome || 0)}
              </p>
            </div>

            {/* Rental Income */}
            <div className="space-y-2">
              <Label htmlFor="rentalIncome">Rental Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="rentalIncome"
                  type="number"
                  placeholder="0"
                  value={incomeData.rentalIncome || ''}
                  onChange={(e) => handleFieldChange('rentalIncome', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Annual net rental: {formatCurrency(incomeData.rentalIncome || 0)}
              </p>
            </div>

            {/* Business Income */}
            <div className="space-y-2">
              <Label htmlFor="businessIncome">Business Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="businessIncome"
                  type="number"
                  placeholder="0"
                  value={incomeData.businessIncome || ''}
                  onChange={(e) => handleFieldChange('businessIncome', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Self-employment, business: {formatCurrency(incomeData.businessIncome || 0)}
              </p>
            </div>

            {/* Investment Income */}
            <div className="space-y-2">
              <Label htmlFor="investmentIncome">Investment Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="investmentIncome"
                  type="number"
                  placeholder="0"
                  value={incomeData.investmentIncome || ''}
                  onChange={(e) => handleFieldChange('investmentIncome', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Dividends, interest, etc: {formatCurrency(incomeData.investmentIncome || 0)}
              </p>
            </div>

            {/* Other Income */}
            <div className="space-y-2">
              <Label htmlFor="otherIncome">Other Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="otherIncome"
                  type="number"
                  placeholder="0"
                  value={incomeData.otherIncome || ''}
                  onChange={(e) => handleFieldChange('otherIncome', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Other Income Description */}
            <div className="space-y-2">
              <Label htmlFor="otherIncomeDescription">Other Income Description</Label>
              <Input
                id="otherIncomeDescription"
                type="text"
                placeholder="Describe source of other income"
                value={incomeData.otherIncomeDescription || ''}
                onChange={(e) => handleFieldChange('otherIncomeDescription', e.target.value)}
                className="w-full"
              />
            </div>

          </div>

          {/* Additional Other Income Sources */}
          {additionalIncomes.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Additional Other Income Sources</h4>
              {additionalIncomes.map((income, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={income.amount || ''}
                        onChange={(e) => {
                          const newIncomes = [...additionalIncomes];
                          newIncomes[index].amount = parseFloat(e.target.value) || 0;
                          setAdditionalIncomes(newIncomes);
                        }}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      type="text"
                      placeholder="Describe this income source"
                      value={income.description}
                      onChange={(e) => {
                        const newIncomes = [...additionalIncomes];
                        newIncomes[index].description = e.target.value;
                        setAdditionalIncomes(newIncomes);
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newIncomes = additionalIncomes.filter((_, i) => i !== index);
                        setAdditionalIncomes(newIncomes);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Additional Income Button */}
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAdditionalIncomes([...additionalIncomes, { amount: 0, description: '' }]);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Income Source
            </Button>

          </div>

          {/* Major Income Changes */}
          <div className="space-y-2">
            <Label htmlFor="majorIncomeChanges">Major Income Changes Expected</Label>
            <Textarea
              id="majorIncomeChanges"
              placeholder="Describe timing and nature of any expected major income changes (promotions, career changes, retirement, etc.)"
              value={incomeData.majorIncomeChanges || ''}
              onChange={(e) => handleFieldChange('majorIncomeChanges', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Income Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-900 mb-3">📊 Total Household Income</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-green-700 font-medium">Primary Income</p>
              <p className="text-green-900 font-bold">{formatCurrency(incomeData.annualIncome || 0)}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Spouse Income</p>
              <p className="text-green-900 font-bold">{formatCurrency(incomeData.spouseIncome || 0)}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Other Income</p>
              <p className="text-green-900 font-bold">
                {formatCurrency(
                  (incomeData.rentalIncome || 0) + 
                  (incomeData.businessIncome || 0) + 
                  (incomeData.investmentIncome || 0) + 
                  (incomeData.otherIncome || 0) +
                  additionalIncomes.reduce((sum, income) => sum + (income.amount || 0), 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Total Annual</p>
              <p className="text-green-900 font-bold text-lg">
                {formatCurrency(
                  (incomeData.annualIncome || 0) + 
                  (incomeData.spouseIncome || 0) + 
                  (incomeData.rentalIncome || 0) + 
                  (incomeData.businessIncome || 0) + 
                  (incomeData.investmentIncome || 0) + 
                  (incomeData.otherIncome || 0) +
                  additionalIncomes.reduce((sum, income) => sum + (income.amount || 0), 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why We Ask For This Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Why We Ask For This</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Income sources:</strong> Understanding all income helps create accurate financial projections</li>
            <li>• <strong>Income stability:</strong> Affects emergency fund recommendations and investment risk tolerance</li>
            <li>• <strong>Growth expectations:</strong> Used to model future financial capacity and retirement planning</li>
            <li>• <strong>Household income:</strong> Determines tax brackets and eligibility for financial strategies</li>
            <li>• <strong>Before taxes:</strong> Allows accurate calculation of tax liabilities and net income</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}