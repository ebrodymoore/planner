'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  PieChart,
  Target,
  Shield,
  Calendar,
  FileText,
  Download,
  Moon,
  Sun,
  Sparkles,
  Crown,
  Zap,
  Activity
} from 'lucide-react';
import { FormData } from '@/types/financial';

// Import individual plan components
import ExecutiveSummary from './plan-sections/ExecutiveSummary';
import AssetAllocation from './plan-sections/AssetAllocation';
import RetirementPlanning from './plan-sections/RetirementPlanning';
import DebtManagement from './plan-sections/DebtManagement';
import RiskAssessment from './plan-sections/RiskAssessment';
import ActionItems from './plan-sections/ActionItems';
import GoalTimeline from './plan-sections/GoalTimeline';
import CashFlowAnalysis from './plan-sections/CashFlowAnalysis';
import InsuranceCoverage from './plan-sections/InsuranceCoverage';
import TaxStrategy from './plan-sections/TaxStrategy';

import { FinancialAnalysis } from '@/services/financialDataService';

interface FinancialPlanProps {
  clientData: FormData;
  analysisResults?: FinancialAnalysis | null;
  onUpdateData?: (data: FormData) => void;
}

export default function FinancialPlan({ 
  clientData, 
  analysisResults, 
  onUpdateData 
}: FinancialPlanProps) {
  const [activeTab, setActiveTab] = useState('executive');
  const [darkMode, setDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate key metrics for navigation
  const calculateNetWorth = () => {
    const assets = clientData.assets;
    const liabilities = clientData.liabilities;
    
    if (!assets || !liabilities) return 0;
    
    const totalAssets = (assets.checking || 0) + 
                       (assets.savings || 0) + 
                       (assets.retirement401k || 0) + 
                       (assets.ira || 0) + 
                       (assets.taxableAccounts || 0) + 
                       (assets.homeValue || 0);
    
    const totalLiabilities = (liabilities.mortgageBalance || 0) + 
                            (liabilities.autoLoans?.reduce((sum, loan) => sum + (loan.balance || 0), 0) || 0) +
                            (liabilities.creditCards?.reduce((sum, card) => sum + (card.balance || 0), 0) || 0) +
                            (liabilities.studentLoans?.reduce((sum, loan) => sum + (loan.balance || 0), 0) || 0);
    
    return totalAssets - totalLiabilities;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFinancialHealthScore = () => {
    // Simple scoring algorithm - would be more sophisticated in production
    let score = 0;
    
    // Emergency fund score (0-25 points)
    const monthlyExpenses = getTotalMonthlyExpenses();
    const emergencyFund = (clientData.assets?.savings || 0);
    const emergencyMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
    score += Math.min(25, emergencyMonths * 4.17); // Max at 6 months
    
    // Debt-to-income ratio (0-25 points)
    const annualIncome = clientData.income?.annualIncome || 0;
    const totalDebt = getTotalDebt();
    const debtToIncomeRatio = annualIncome > 0 ? (totalDebt / annualIncome) : 1;
    score += Math.max(0, 25 - (debtToIncomeRatio * 50));
    
    // Retirement savings rate (0-25 points)
    const retirement401k = clientData.assets?.retirement401k || 0;
    const ira = clientData.assets?.ira || 0;
    const totalRetirement = retirement401k + ira;
    const retirementRatio = annualIncome > 0 ? (totalRetirement / annualIncome) : 0;
    score += Math.min(25, retirementRatio * 25);
    
    // Investment diversification (0-25 points)
    const hasMultipleAccounts = [
      clientData.assets?.checking,
      clientData.assets?.savings,
      clientData.assets?.retirement401k,
      clientData.assets?.ira,
      clientData.assets?.taxableAccounts
    ].filter(account => (account || 0) > 0).length;
    score += Math.min(25, hasMultipleAccounts * 5);
    
    return Math.round(Math.max(0, Math.min(100, score)));
  };

  const getTotalMonthlyExpenses = () => {
    const expenses = clientData.expenses;
    if (!expenses) return 0;
    
    return (expenses.housing || 0) + 
           (expenses.transportation || 0) + 
           (expenses.travel || 0) + 
           (expenses.recreation || 0) + 
           (expenses.food || 0) + 
           (expenses.healthcare || 0) + 
           (expenses.shopping || 0) + 
           (expenses.technology || 0) + 
           (expenses.personalCare || 0) + 
           (expenses.entertainment || 0);
  };

  const getTotalDebt = () => {
    const liabilities = clientData.liabilities;
    if (!liabilities) return 0;
    
    return (liabilities.mortgageBalance || 0) + 
           (liabilities.autoLoans?.reduce((sum, loan) => sum + (loan.balance || 0), 0) || 0) +
           (liabilities.creditCards?.reduce((sum, card) => sum + (card.balance || 0), 0) || 0) +
           (liabilities.studentLoans?.reduce((sum, loan) => sum + (loan.balance || 0), 0) || 0);
  };

  const planSections = [
    {
      id: 'executive',
      label: 'Executive Summary',
      icon: FileText,
      component: ExecutiveSummary,
      status: 'complete'
    },
    {
      id: 'assets',
      label: 'Asset Allocation',
      icon: PieChart,
      component: AssetAllocation,
      status: 'complete'
    },
    {
      id: 'retirement',
      label: 'Retirement Planning',
      icon: Target,
      component: RetirementPlanning,
      status: 'needs-attention'
    },
    {
      id: 'debt',
      label: 'Debt Management',
      icon: TrendingDown,
      component: DebtManagement,
      status: getTotalDebt() > 0 ? 'needs-attention' : 'complete'
    },
    {
      id: 'risk',
      label: 'Risk Assessment',
      icon: Shield,
      component: RiskAssessment,
      status: 'complete'
    },
    {
      id: 'actions',
      label: 'Action Items',
      icon: CheckCircle,
      component: ActionItems,
      status: 'needs-attention'
    },
    {
      id: 'goals',
      label: 'Goal Timeline',
      icon: Calendar,
      component: GoalTimeline,
      status: 'in-progress'
    },
    {
      id: 'cashflow',
      label: 'Cash Flow',
      icon: TrendingUp,
      component: CashFlowAnalysis,
      status: 'complete'
    },
    {
      id: 'insurance',
      label: 'Insurance',
      icon: Shield,
      component: InsuranceCoverage,
      status: 'needs-review'
    },
    {
      id: 'tax',
      label: 'Tax Strategy',
      icon: DollarSign,
      component: TaxStrategy,
      status: 'complete'
    }
  ];

  const generatePDFReport = async () => {
    setIsGenerating(true);
    // Implementation would generate PDF report
    setTimeout(() => {
      setIsGenerating(false);
      // Trigger download
    }, 2000);
  };

  const exportToExcel = async () => {
    setIsGenerating(true);
    // Implementation would export to Excel
    setTimeout(() => {
      setIsGenerating(false);
      // Trigger download
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30">
                <Activity className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Financial Plan
                  </h1>
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-medium text-slate-300">AI-Powered</span>
                  </div>
                </div>
                <p className="text-slate-400 text-lg">
                  {clientData.personal?.name ? `${clientData.personal.name}'s` : 'Your'} Comprehensive Financial Analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Financial Health Score */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-400 font-medium">Financial Health</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    {getFinancialHealthScore()}%
                  </p>
                </div>
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 blur-sm"></div>
                  <svg className="w-20 h-20 transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-slate-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="url(#healthGradient)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2.199 * getFinancialHealthScore()} 220`}
                      strokeLinecap="round"
                      className="drop-shadow-sm"
                    />
                    <defs>
                      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              
              {/* Net Worth */}
              <div className="text-right bg-slate-700/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-600/30">
                <p className="text-sm text-slate-400 font-medium">Net Worth</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(calculateNetWorth())}
                </p>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={isGenerating}
                  className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                
                <Button
                  size="sm"
                  onClick={generatePDFReport}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'PDF Report'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Navigation Tabs */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-3">
            <div className="overflow-x-auto">
              <TabsList className="flex gap-2 bg-transparent min-w-max p-1">
                {planSections.map((section) => {
                  const IconComponent = section.icon;
                  const isActive = activeTab === section.id;
                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl text-xs transition-all duration-300 min-w-[90px] whitespace-nowrap border ${
                        isActive 
                          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-500/30 text-white shadow-lg' 
                          : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:bg-slate-600/40 hover:text-slate-300'
                      }`}
                    >
                      <div className="relative">
                        <IconComponent className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        {section.status === 'needs-attention' && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-1.5 h-1.5 text-white" />
                            </div>
                          </div>
                        )}
                        {section.status === 'complete' && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-1.5 h-1.5 text-white" />
                            </div>
                          </div>
                        )}
                        {section.status === 'in-progress' && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                        {section.status === 'needs-review' && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <span className={`text-center leading-tight text-[11px] font-medium ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}>
                        {section.label}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          {planSections.map((section) => {
            const SectionComponent = section.component;
            return (
              <TabsContent key={section.id} value={section.id} className="space-y-6">
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-6">
                  <SectionComponent 
                    clientData={clientData}
                    analysisResults={analysisResults}
                    onUpdateData={onUpdateData}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}