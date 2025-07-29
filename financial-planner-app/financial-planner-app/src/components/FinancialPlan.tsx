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
  Sun
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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Financial Plan
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {clientData.personal?.name ? `${clientData.personal.name}'s` : 'Your'} Comprehensive Financial Analysis
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Financial Health Score */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Financial Health</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {getFinancialHealthScore()}%
                  </p>
                </div>
                <div className="w-16 h-16">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2.51 * getFinancialHealthScore()} 251`}
                        className="text-green-500"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Net Worth */}
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">Net Worth</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(calculateNetWorth())}
                </p>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={isGenerating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                
                <Button
                  size="sm"
                  onClick={generatePDFReport}
                  disabled={isGenerating}
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
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
            <div className="overflow-x-auto">
              <TabsList className="flex gap-1 bg-transparent min-w-max">
                {planSections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex flex-col items-center gap-2 px-3 py-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 min-w-[80px] whitespace-nowrap"
                    >
                      <div className="relative">
                        <IconComponent className="w-4 h-4" />
                        {section.status === 'needs-attention' && (
                          <AlertTriangle className="w-2.5 h-2.5 text-orange-500 absolute -top-1 -right-1" />
                        )}
                        {section.status === 'complete' && (
                          <CheckCircle className="w-2.5 h-2.5 text-green-500 absolute -top-1 -right-1" />
                        )}
                      </div>
                      <span className="text-center leading-tight text-[10px] sm:text-xs font-medium">
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
                <SectionComponent 
                  clientData={clientData}
                  analysisResults={analysisResults}
                  onUpdateData={onUpdateData}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}