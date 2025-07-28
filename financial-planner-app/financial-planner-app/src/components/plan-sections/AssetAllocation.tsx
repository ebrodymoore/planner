'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { FormData } from '@/types/financial';

interface AssetAllocationProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

export default function AssetAllocation({ clientData }: AssetAllocationProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentAllocation = () => {
    const assets = clientData.assets;
    if (!assets) return [];

    const allocations = [
      { name: 'Cash/Checking', amount: assets.checking || 0, color: '#10B981', category: 'cash' },
      { name: 'Savings', amount: assets.savings || 0, color: '#059669', category: 'cash' },
      { name: '401(k)', amount: assets.retirement401k || 0, color: '#3B82F6', category: 'retirement' },
      { name: 'IRA', amount: assets.ira || 0, color: '#1D4ED8', category: 'retirement' },
      { name: 'Taxable Investments', amount: assets.taxableAccounts || 0, color: '#7C3AED', category: 'investment' },
      { name: 'Real Estate', amount: assets.homeValue || 0, color: '#F59E0B', category: 'real_estate' }
    ];

    const total = allocations.reduce((sum, item) => sum + item.amount, 0);
    return allocations.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    })).filter(item => item.amount > 0);
  };

  const getRecommendedAllocation = () => {
    const currentAge = clientData.personal?.dateOfBirth ? 
      new Date().getFullYear() - new Date(clientData.personal.dateOfBirth).getFullYear() : 35;
    
    const riskLevel = clientData.risk?.experienceLevel || 'moderate';
    
    // Age-based allocation with risk adjustment
    let stockPercentage = Math.max(20, Math.min(90, 100 - currentAge));
    
    if (riskLevel === 'conservative') stockPercentage *= 0.7;
    if (riskLevel === 'aggressive') stockPercentage *= 1.2;
    
    stockPercentage = Math.min(90, stockPercentage);
    const bondPercentage = Math.max(10, 100 - stockPercentage - 10);
    const cashPercentage = 10;

    return [
      { name: 'Stocks/Equity', percentage: stockPercentage, color: '#3B82F6' },
      { name: 'Bonds/Fixed Income', percentage: bondPercentage, color: '#10B981' },
      { name: 'Cash/Emergency', percentage: cashPercentage, color: '#F59E0B' }
    ];
  };

  const currentAllocation = getCurrentAllocation();
  const recommendedAllocation = getRecommendedAllocation();
  const totalAssets = currentAllocation.reduce((sum, item) => sum + item.amount, 0);

  // Simple pie chart component
  const PieChartComponent = ({ data, size = 200 }: { data: any[], size?: number }) => {
    let cumulativePercentage = 0;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 20}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          {data.map((item, index) => {
            const circumference = 2 * Math.PI * (size / 2 - 20);
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercentage * circumference / 100;
            cumulativePercentage += item.percentage;
            
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 20}
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalAssets)}
            </div>
            <div className="text-sm text-gray-500">Total Assets</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Asset Allocation Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Current portfolio breakdown and optimization recommendations
        </p>
      </div>

      {/* Current vs Recommended Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Current Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <PieChartComponent data={currentAllocation} />
            </div>
            <div className="space-y-3">
              {currentAllocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(item.amount)}</div>
                    <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Recommended Target
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {recommendedAllocation.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Age-Based Strategy
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This allocation is optimized for your age and risk tolerance, following the principle 
                of reducing equity exposure as you approach retirement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rebalancing Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Rebalancing Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  Portfolio Review Needed
                </h4>
              </div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Your current allocation may not align with your target risk profile. Consider these adjustments:
              </p>
              <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                <li>• Increase retirement account contributions to reach target allocation</li>
                <li>• Consider diversifying beyond cash and real estate</li>
                <li>• Review and rebalance quarterly or when allocation drifts 5%+ from target</li>
                <li>• Prioritize tax-advantaged accounts for growth investments</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Tax-Efficient Placement
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Hold growth stocks in tax-advantaged accounts, bonds in taxable accounts for tax efficiency.
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Rebalancing Frequency
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Review quarterly and rebalance when any asset class deviates 5%+ from target.
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Dollar-Cost Averaging
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Invest consistently through automatic contributions to smooth market volatility.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}