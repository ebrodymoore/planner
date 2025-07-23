'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Assets } from '@/types/financial';

interface AssetsFormProps {
  data?: Assets;
  onUpdate: (data: Assets) => void;
  onFieldUpdate: (field: keyof Assets, value: any) => void;
}

export default function AssetsForm({ data, onUpdate, onFieldUpdate }: AssetsFormProps) {
  const assetsData = data || {} as Assets;

  const handleFieldChange = (field: keyof Assets, value: string | number) => {
    const updatedData = {
      ...assetsData,
      [field]: field !== 'emergencyTarget'
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

  const getLiquidAssets = () => {
    return (assetsData.checking || 0) + (assetsData.savings || 0);
  };

  const getRetirementAssets = () => {
    return (assetsData.retirement401k || 0) + (assetsData.ira || 0);
  };

  const getTotalInvestments = () => {
    return getRetirementAssets() + (assetsData.taxableAccounts || 0);
  };

  const getTotalAssets = () => {
    return getLiquidAssets() + getTotalInvestments() + (assetsData.homeValue || 0);
  };

  return (
    <div className="space-y-6">
      {/* Liquid Assets */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💰 Liquid Assets</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Checking Account */}
            <div className="space-y-2">
              <Label htmlFor="checking">Checking Account</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="checking"
                  type="number"
                  placeholder="5000"
                  value={assetsData.checking || ''}
                  onChange={(e) => handleFieldChange('checking', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Primary checking account balance
              </p>
            </div>

            {/* Savings Account */}
            <div className="space-y-2">
              <Label htmlFor="savings">Savings Account</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="savings"
                  type="number"
                  placeholder="15000"
                  value={assetsData.savings || ''}
                  onChange={(e) => handleFieldChange('savings', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Emergency fund, high-yield savings
              </p>
            </div>

            {/* Emergency Fund Target */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergencyTarget">Emergency Fund Target</Label>
              <Select
                value={assetsData.emergencyTarget || ''}
                onValueChange={(value) => handleFieldChange('emergencyTarget', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How many months of expenses do you target?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No emergency fund target</SelectItem>
                  <SelectItem value="1_month">1 month of expenses</SelectItem>
                  <SelectItem value="3_months">3 months of expenses</SelectItem>
                  <SelectItem value="6_months">6 months of expenses</SelectItem>
                  <SelectItem value="9_months">9 months of expenses</SelectItem>
                  <SelectItem value="12_months">12+ months of expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-700">
              Total Liquid Assets: <span className="text-green-600 font-bold">{formatCurrency(getLiquidAssets())}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Retirement Accounts */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏦 Retirement Accounts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 401(k) Balance */}
            <div className="space-y-2">
              <Label htmlFor="retirement401k">401(k) Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="retirement401k"
                  type="number"
                  placeholder="50000"
                  value={assetsData.retirement401k || ''}
                  onChange={(e) => handleFieldChange('retirement401k', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Current employer 401(k) or 403(b) balance
              </p>
            </div>

            {/* IRA Balance */}
            <div className="space-y-2">
              <Label htmlFor="ira">IRA Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="ira"
                  type="number"
                  placeholder="25000"
                  value={assetsData.ira || ''}
                  onChange={(e) => handleFieldChange('ira', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Traditional and Roth IRA combined
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm font-medium text-blue-700">
              Total Retirement Savings: <span className="text-blue-800 font-bold">{formatCurrency(getRetirementAssets())}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Investment Accounts */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📈 Investment Accounts</h3>
          
          <div className="space-y-4">
            {/* Taxable Investment Accounts */}
            <div className="space-y-2">
              <Label htmlFor="taxableAccounts">Taxable Investment Accounts</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="taxableAccounts"
                  type="number"
                  placeholder="10000"
                  value={assetsData.taxableAccounts || ''}
                  onChange={(e) => handleFieldChange('taxableAccounts', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Brokerage accounts, stocks, bonds, mutual funds
              </p>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded">
            <p className="text-sm font-medium text-purple-700">
              Total Investments: <span className="text-purple-800 font-bold">{formatCurrency(getTotalInvestments())}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Real Estate */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏠 Real Estate</h3>
          
          <div className="space-y-4">
            {/* Primary Residence Value */}
            <div className="space-y-2">
              <Label htmlFor="homeValue">Primary Residence Value</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="homeValue"
                  type="number"
                  placeholder="400000"
                  value={assetsData.homeValue || ''}
                  onChange={(e) => handleFieldChange('homeValue', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Current estimated market value of your home
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-900 mb-3">📊 Total Assets Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <p className="text-green-700 font-medium">Liquid Assets</p>
              <p className="text-green-900 font-bold">{formatCurrency(getLiquidAssets())}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Retirement</p>
              <p className="text-green-900 font-bold">{formatCurrency(getRetirementAssets())}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Investments</p>
              <p className="text-green-900 font-bold">{formatCurrency(assetsData.taxableAccounts || 0)}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Real Estate</p>
              <p className="text-green-900 font-bold">{formatCurrency(assetsData.homeValue || 0)}</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Total Asset Value</span>
              <span className="text-green-900 font-bold text-xl">{formatCurrency(getTotalAssets())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Asset Building Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Emergency fund:</strong> 3-6 months of expenses is typically recommended</li>
            <li>• <strong>Employer matching:</strong> Maximize 401(k) match before other investments</li>
            <li>• <strong>Asset allocation:</strong> Diversify across different asset classes</li>
            <li>• <strong>Home equity:</strong> Consider your home as part of your net worth calculation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}