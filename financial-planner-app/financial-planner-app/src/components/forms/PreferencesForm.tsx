'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Preferences } from '@/types/financial';

interface PreferencesFormProps {
  data?: Preferences;
  onUpdate: (data: Preferences) => void;
  onFieldUpdate: (field: keyof Preferences, value: any) => void;
}

export default function PreferencesForm({ data, onUpdate, onFieldUpdate }: PreferencesFormProps) {
  const preferencesData = data || {} as Preferences;

  const handleFieldChange = (field: keyof Preferences, value: string | number) => {
    const updatedData = {
      ...preferencesData,
      [field]: field === 'secondHomeBudget' || field === 'businessCapital'
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
      {/* Real Estate Goals */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏡 Real Estate & Housing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Second Home Interest */}
            <div className="space-y-2">
              <Label htmlFor="secondHome">Second Home Interest</Label>
              <Select
                value={preferencesData.secondHome || ''}
                onValueChange={(value) => handleFieldChange('secondHome', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Interest in owning a second home?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_interest">No Interest</SelectItem>
                  <SelectItem value="someday">Someday Maybe</SelectItem>
                  <SelectItem value="considering">Actively Considering</SelectItem>
                  <SelectItem value="planning_5yr">Planning Within 5 Years</SelectItem>
                  <SelectItem value="planning_2yr">Planning Within 2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Second Home Budget */}
            <div className="space-y-2">
              <Label htmlFor="secondHomeBudget">Second Home Budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="secondHomeBudget"
                  type="number"
                  placeholder="500000"
                  value={preferencesData.secondHomeBudget || ''}
                  onChange={(e) => handleFieldChange('secondHomeBudget', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Expected purchase price: {formatCurrency(preferencesData.secondHomeBudget || 0)}
              </p>
            </div>
          </div>

          {/* Second Home Details */}
          {preferencesData.secondHome && preferencesData.secondHome !== 'no_interest' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-blue-900 mb-3">🏖️ Second Home Considerations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Potential Benefits</h5>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>• Personal vacation retreat</li>
                      <li>• Potential rental income</li>
                      <li>• Real estate appreciation</li>
                      <li>• Family legacy asset</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Financial Considerations</h5>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>• Higher down payment required</li>
                      <li>• Property taxes and maintenance</li>
                      <li>• Insurance costs</li>
                      <li>• Opportunity cost of capital</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Business & Entrepreneurship */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💼 Business & Entrepreneurship</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Interest */}
            <div className="space-y-2">
              <Label htmlFor="businessInterest">Entrepreneurship Interest</Label>
              <Select
                value={preferencesData.businessInterest || ''}
                onValueChange={(value) => handleFieldChange('businessInterest', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Interest in starting a business?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_interest">No Interest</SelectItem>
                  <SelectItem value="someday">Someday Maybe</SelectItem>
                  <SelectItem value="side_hustle">Side Hustle Interest</SelectItem>
                  <SelectItem value="considering">Seriously Considering</SelectItem>
                  <SelectItem value="planning_2yr">Planning Within 2 Years</SelectItem>
                  <SelectItem value="active_planning">Actively Planning Now</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Capital */}
            <div className="space-y-2">
              <Label htmlFor="businessCapital">Business Capital Needed</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="businessCapital"
                  type="number"
                  placeholder="50000"
                  value={preferencesData.businessCapital || ''}
                  onChange={(e) => handleFieldChange('businessCapital', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Estimated startup/investment needed: {formatCurrency(preferencesData.businessCapital || 0)}
              </p>
            </div>
          </div>

          {/* Business Planning Details */}
          {preferencesData.businessInterest && preferencesData.businessInterest !== 'no_interest' && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-purple-900 mb-3">🚀 Business Planning Considerations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">Financial Preparation</h5>
                    <ul className="text-purple-700 space-y-1 text-xs">
                      <li>• Emergency fund for personal expenses</li>
                      <li>• Business startup capital</li>
                      <li>• Cash flow for first 6-12 months</li>
                      <li>• Separate business banking</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">Risk Management</h5>
                    <ul className="text-purple-700 space-y-1 text-xs">
                      <li>• Business insurance needs</li>
                      <li>• Income replacement planning</li>
                      <li>• Tax implications</li>
                      <li>• Legal structure considerations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Lifestyle & Values */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎨 Lifestyle & Values</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Early Retirement */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🏖️ Early Retirement (FIRE)</h4>
              <p className="text-sm text-gray-600 mb-3">
                Interest in Financial Independence, Retire Early movement?
              </p>
              <Select defaultValue="">
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="FIRE interest level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_interest">Not Interested</SelectItem>
                  <SelectItem value="curious">Curious About It</SelectItem>
                  <SelectItem value="considering">Actively Considering</SelectItem>
                  <SelectItem value="pursuing">Actively Pursuing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Charitable Giving */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">❤️ Charitable Giving</h4>
              <p className="text-sm text-gray-600 mb-3">
                Important to include regular charitable contributions?
              </p>
              <Select defaultValue="">
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Giving importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_priority">Not a Priority</SelectItem>
                  <SelectItem value="occasional">Occasional Giving</SelectItem>
                  <SelectItem value="regular_small">Regular Small Amounts</SelectItem>
                  <SelectItem value="significant">Significant Annual Giving</SelectItem>
                  <SelectItem value="major_focus">Major Financial Focus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Work-Life Balance */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">⚖️ Work-Life Balance</h4>
              <p className="text-sm text-gray-600 mb-3">
                Willingness to sacrifice current lifestyle for future security?
              </p>
              <Select defaultValue="">
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Lifestyle approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enjoy_now">Enjoy Life Now</SelectItem>
                  <SelectItem value="balanced">Balanced Approach</SelectItem>
                  <SelectItem value="save_focused">Save-Focused</SelectItem>
                  <SelectItem value="extreme_saver">Extreme Saver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Family Legacy */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">👨‍👩‍👧‍👦 Family Legacy</h4>
              <p className="text-sm text-gray-600 mb-3">
                Importance of leaving wealth to children/heirs?
              </p>
              <Select defaultValue="">
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Legacy priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_important">Not Important</SelectItem>
                  <SelectItem value="some_inheritance">Some Inheritance</SelectItem>
                  <SelectItem value="significant">Significant Legacy</SelectItem>
                  <SelectItem value="generational">Generational Wealth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-900 mb-3">📋 Your Life Goals Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {preferencesData.secondHome && preferencesData.secondHome !== 'no_interest' && (
              <div>
                <p className="text-green-700 font-medium">Second Home Plans</p>
                <p className="text-green-800">
                  {preferencesData.secondHome?.replace('_', ' ')} - {formatCurrency(preferencesData.secondHomeBudget || 0)}
                </p>
              </div>
            )}
            
            {preferencesData.businessInterest && preferencesData.businessInterest !== 'no_interest' && (
              <div>
                <p className="text-green-700 font-medium">Business Plans</p>
                <p className="text-green-800">
                  {preferencesData.businessInterest?.replace('_', ' ')} - {formatCurrency(preferencesData.businessCapital || 0)}
                </p>
              </div>
            )}
          </div>

          {(!preferencesData.secondHome || preferencesData.secondHome === 'no_interest') && 
           (!preferencesData.businessInterest || preferencesData.businessInterest === 'no_interest') && (
            <p className="text-green-800 text-center py-4">
              Complete the sections above to see your life goals summary
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Life Planning Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Timeline matters:</strong> Earlier goals need more aggressive saving</li>
            <li>• <strong>Opportunity cost:</strong> Consider what you might give up for each goal</li>
            <li>• <strong>Flexibility:</strong> Life goals can change - review regularly</li>
            <li>• <strong>Financial foundation first:</strong> Ensure basic needs are met before luxury goals</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}