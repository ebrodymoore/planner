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
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              {formatCurrency(totalAssets)}
            </div>
            <div className="text-sm text-slate-400 font-medium">Total Assets</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
          Asset Allocation Analysis
        </h2>
        <p className="text-slate-400 text-lg">
          Current portfolio breakdown and optimization recommendations
        </p>
      </div>

      {/* Current vs Recommended Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Allocation */}
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                <PieChart className="w-5 h-5 text-blue-400" />
              </div>
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
                    <span className="text-sm font-medium text-white">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{formatCurrency(item.amount)}</div>
                    <div className="text-xs text-slate-400">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Allocation */}
        <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-500/30">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
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
                      <span className="text-sm font-medium text-white">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{item.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4">
              <h4 className="font-medium text-blue-400 mb-2">
                Age-Based Strategy
              </h4>
              <p className="text-sm text-slate-300">
                This allocation is optimized for your age and risk tolerance, following the principle 
                of reducing equity exposure as you approach retirement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rebalancing Recommendations */}
      <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg border border-orange-500/30">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            Rebalancing Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <h4 className="font-medium text-yellow-400">
                  Portfolio Review Needed
                </h4>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Your current allocation may not align with your target risk profile. Consider these adjustments:
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Increase retirement account contributions to reach target allocation</li>
                <li>• Consider diversifying beyond cash and real estate</li>
                <li>• Review and rebalance quarterly or when allocation drifts 5%+ from target</li>
                <li>• Prioritize tax-advantaged accounts for growth investments</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-600/30 transition-all duration-300">
                <h4 className="font-medium text-emerald-400 mb-2">
                  Tax-Efficient Placement
                </h4>
                <p className="text-sm text-slate-300">
                  Hold growth stocks in tax-advantaged accounts, bonds in taxable accounts for tax efficiency.
                </p>
              </div>
              
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-600/30 transition-all duration-300">
                <h4 className="font-medium text-blue-400 mb-2">
                  Rebalancing Frequency
                </h4>
                <p className="text-sm text-slate-300">
                  Review quarterly and rebalance when any asset class deviates 5%+ from target.
                </p>
              </div>
              
              <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-4 hover:bg-slate-600/30 transition-all duration-300">
                <h4 className="font-medium text-purple-400 mb-2">
                  Dollar-Cost Averaging
                </h4>
                <p className="text-sm text-slate-300">
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