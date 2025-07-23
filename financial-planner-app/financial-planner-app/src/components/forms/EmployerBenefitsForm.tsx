'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { EmployerBenefits } from '@/types/financial';

interface EmployerBenefitsFormProps {
  data?: EmployerBenefits;
  onUpdate: (data: EmployerBenefits) => void;
  onFieldUpdate: (field: keyof EmployerBenefits, value: any) => void;
}

export default function EmployerBenefitsForm({ data, onUpdate, onFieldUpdate }: EmployerBenefitsFormProps) {
  const benefitsData = data || {} as EmployerBenefits;

  const handleFieldChange = (field: keyof EmployerBenefits, value: any) => {
    const updatedData = {
      ...benefitsData,
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

  return (
    <div className="space-y-6">
      {/* 401(k) Benefits */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏦 401(k)/403(b) Benefits</h3>
          
          <div className="space-y-4">
            {/* 401(k) Match Available */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="match401kAvailable"
                checked={benefitsData.match401kAvailable || false}
                onCheckedChange={(checked) => handleFieldChange('match401kAvailable', checked)}
              />
              <Label htmlFor="match401kAvailable">
                Employer 401(k) match available
              </Label>
            </div>

            {benefitsData.match401kAvailable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                {/* Match Details */}
                <div className="space-y-2">
                  <Label htmlFor="match401kDetails">401(k) Match Details</Label>
                  <Input
                    id="match401kDetails"
                    type="text"
                    placeholder="e.g., 50% up to 6% or $3,000 annually"
                    value={benefitsData.match401kDetails || ''}
                    onChange={(e) => handleFieldChange('match401kDetails', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Current Contribution Rate */}
                <div className="space-y-2">
                  <Label htmlFor="current401kContributionRate">Current Contribution Rate (%)</Label>
                  <Input
                    id="current401kContributionRate"
                    type="number"
                    placeholder="10"
                    value={benefitsData.current401kContributionRate || ''}
                    onChange={(e) => handleFieldChange('current401kContributionRate', parseFloat(e.target.value) || 0)}
                    max="100"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Percentage of salary you currently contribute
                  </p>
                </div>
              </div>
            )}

            {/* 401(k) Loan Outstanding */}
            <div className="space-y-2">
              <Label htmlFor="loan401kOutstanding">Outstanding 401(k) Loan Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="loan401kOutstanding"
                  type="number"
                  placeholder="0"
                  value={benefitsData.loan401kOutstanding || ''}
                  onChange={(e) => handleFieldChange('loan401kOutstanding', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Current balance: {formatCurrency(benefitsData.loan401kOutstanding || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pension and Other Benefits */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏛️ Pension and Other Benefits</h3>
          
          <div className="space-y-4">
            {/* Pension Available */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pensionAvailable"
                checked={benefitsData.pensionAvailable || false}
                onCheckedChange={(checked) => handleFieldChange('pensionAvailable', checked)}
              />
              <Label htmlFor="pensionAvailable">
                Pension plan available
              </Label>
            </div>

            {benefitsData.pensionAvailable && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="pensionExpectedBenefit">Expected Monthly Pension Benefit</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="pensionExpectedBenefit"
                    type="number"
                    placeholder="2500"
                    value={benefitsData.pensionExpectedBenefit || ''}
                    onChange={(e) => handleFieldChange('pensionExpectedBenefit', parseFloat(e.target.value) || 0)}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Estimated monthly benefit at retirement
                </p>
              </div>
            )}

            {/* Stock Purchase Plan */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stockPurchasePlan"
                checked={benefitsData.stockPurchasePlan || false}
                onCheckedChange={(checked) => handleFieldChange('stockPurchasePlan', checked)}
              />
              <Label htmlFor="stockPurchasePlan">
                Employee stock purchase plan available
              </Label>
            </div>

            {/* FSA Contribution */}
            <div className="space-y-2">
              <Label htmlFor="fsaContribution">Annual FSA Contribution</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="fsaContribution"
                  type="number"
                  placeholder="0"
                  value={benefitsData.fsaContribution || ''}
                  onChange={(e) => handleFieldChange('fsaContribution', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Flexible Spending Account annual election
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Benefits */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎁 Additional Benefits</h3>
          
          <div className="space-y-2">
            <Label htmlFor="otherBenefits">Other Employer Benefits</Label>
            <Textarea
              id="otherBenefits"
              placeholder="Describe any other benefits: commuter benefits, tuition reimbursement, wellness programs, etc."
              value={benefitsData.otherBenefits || ''}
              onChange={(e) => handleFieldChange('otherBenefits', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Benefits Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-3">📋 Benefits Summary</h4>
          <div className="space-y-2 text-sm">
            {benefitsData.match401kAvailable && (
              <div className="flex justify-between">
                <span className="text-blue-700">401(k) Match:</span>
                <span className="text-blue-900 font-medium">{benefitsData.match401kDetails || 'Available'}</span>
              </div>
            )}
            {benefitsData.pensionAvailable && (
              <div className="flex justify-between">
                <span className="text-blue-700">Pension Benefit:</span>
                <span className="text-blue-900 font-medium">{formatCurrency(benefitsData.pensionExpectedBenefit || 0)}/month</span>
              </div>
            )}
            {benefitsData.stockPurchasePlan && (
              <div className="flex justify-between">
                <span className="text-blue-700">Stock Purchase Plan:</span>
                <span className="text-blue-900 font-medium">Available</span>
              </div>
            )}
            {benefitsData.fsaContribution && benefitsData.fsaContribution > 0 && (
              <div className="flex justify-between">
                <span className="text-blue-700">FSA Contribution:</span>
                <span className="text-blue-900 font-medium">{formatCurrency(benefitsData.fsaContribution)} annually</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-900 mb-2">💡 Benefits Optimization Tips</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>401(k) match:</strong> Always contribute enough to get full employer match - it's free money</li>
            <li>• <strong>Contribution limits:</strong> 2024 401(k) limit is $23,000 ($30,500 if 50+)</li>
            <li>• <strong>FSA planning:</strong> Use it or lose it - plan contributions carefully</li>
            <li>• <strong>Stock purchase plans:</strong> Can offer instant returns through discounts</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}