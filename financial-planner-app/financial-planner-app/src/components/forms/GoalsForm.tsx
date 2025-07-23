'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goals } from '@/types/financial';

interface GoalsFormProps {
  data?: Goals;
  onUpdate: (data: Goals) => void;
  onFieldUpdate: (field: keyof Goals, value: any) => void;
}

export default function GoalsForm({ data, onUpdate, onFieldUpdate }: GoalsFormProps) {
  const goalsData = data || {} as Goals;

  const handleFieldChange = (field: keyof Goals, value: string | number) => {
    const updatedData = {
      ...goalsData,
      [field]: typeof value === 'string' ? (parseInt(value) || 0) : value
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

  const priorityOptions = [
    { value: '1', label: '1 - Highest Priority' },
    { value: '2', label: '2 - High Priority' },
    { value: '3', label: '3 - Medium Priority' },
    { value: '4', label: '4 - Lower Priority' },
    { value: '5', label: '5 - Low Priority' },
    { value: '6', label: '6 - Someday Goal' },
    { value: '7', label: '7 - Not Important' },
    { value: '8', label: '8 - Not Applicable' }
  ];

  return (
    <div className="space-y-6">
      {/* Goal Prioritization */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎯 Goal Prioritization</h3>
          <p className="text-sm text-gray-600 mb-4">
            Rank your financial goals from 1 (highest priority) to 8 (lowest priority)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Retirement Security */}
            <div className="space-y-2">
              <Label htmlFor="retirementPriority">Retirement Security</Label>
              <Select
                value={goalsData.retirementPriority?.toString() || ''}
                onValueChange={(value) => handleFieldChange('retirementPriority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Emergency Fund */}
            <div className="space-y-2">
              <Label htmlFor="emergencyPriority">Emergency Fund</Label>
              <Select
                value={goalsData.emergencyPriority?.toString() || ''}
                onValueChange={(value) => handleFieldChange('emergencyPriority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Debt Elimination */}
            <div className="space-y-2">
              <Label htmlFor="debtPriority">Debt Elimination</Label>
              <Select
                value={goalsData.debtPriority?.toString() || ''}
                onValueChange={(value) => handleFieldChange('debtPriority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retirement Goals */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏖️ Retirement Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Retirement Age */}
            <div className="space-y-2">
              <Label htmlFor="retirementAge">Target Retirement Age</Label>
              <Input
                id="retirementAge"
                type="number"
                placeholder="65"
                value={goalsData.retirementAge || ''}
                onChange={(e) => handleFieldChange('retirementAge', e.target.value)}
                min="50"
                max="80"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Age when you want to stop working full-time
              </p>
            </div>

            {/* Desired Annual Income */}
            <div className="space-y-2">
              <Label htmlFor="retirementIncome">Desired Annual Retirement Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="retirementIncome"
                  type="number"
                  placeholder="80000"
                  value={goalsData.retirementIncome || ''}
                  onChange={(e) => handleFieldChange('retirementIncome', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Annual income needed in today's dollars: {formatCurrency(goalsData.retirementIncome || 0)}
              </p>
            </div>
          </div>

          {/* Retirement Insights */}
          <Card className="bg-blue-50 border-blue-200 mt-4">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Retirement Rule of Thumb</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Common guidelines:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Plan for 70-90% of pre-retirement income</li>
                  <li>Save 10-15% of annual income for retirement</li>
                  <li>Consider inflation over time</li>
                  <li>Factor in Social Security and pensions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Additional Financial Goals */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎯 Other Financial Goals</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Education Funding */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🎓 Education Funding</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Planning to fund children's education or your own continuing education?
                </p>
                <div className="space-y-2">
                  <Label className="text-sm">Priority Level</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Home Purchase */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🏠 Home Purchase</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Planning to buy your first home or upgrade to a larger home?
                </p>
                <div className="space-y-2">
                  <Label className="text-sm">Priority Level</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Major Purchase */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🚗 Major Purchase</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Planning for a car, boat, RV, or other significant purchase?
                </p>
                <div className="space-y-2">
                  <Label className="text-sm">Priority Level</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Travel & Experiences */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">✈️ Travel & Experiences</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Saving for vacations, travel, or life experiences?
                </p>
                <div className="space-y-2">
                  <Label className="text-sm">Priority Level</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-900 mb-3">📋 Your Top Priorities</h4>
          <div className="space-y-2">
            {[
              { name: 'Retirement Security', priority: goalsData.retirementPriority },
              { name: 'Emergency Fund', priority: goalsData.emergencyPriority },
              { name: 'Debt Elimination', priority: goalsData.debtPriority }
            ]
              .filter(goal => goal.priority)
              .sort((a, b) => (a.priority || 99) - (b.priority || 99))
              .slice(0, 3)
              .map((goal, index) => (
                <div key={goal.name} className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">
                    {index + 1}. {goal.name}
                  </span>
                  <span className="text-green-700 text-sm">
                    Priority {goal.priority}
                  </span>
                </div>
              ))}
          </div>
          
          {goalsData.retirementAge && goalsData.retirementIncome && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-green-800 text-sm">
                <strong>Retirement Goal:</strong> {formatCurrency(goalsData.retirementIncome)} annually 
                starting at age {goalsData.retirementAge}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Goal Setting Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>SMART goals:</strong> Make goals Specific, Measurable, Achievable, Relevant, Time-bound</li>
            <li>• <strong>Priority order:</strong> Focus on high-priority goals first to maximize progress</li>
            <li>• <strong>Emergency fund first:</strong> Build 3-6 months of expenses before other goals</li>
            <li>• <strong>Balance short & long-term:</strong> Mix immediate needs with future planning</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}