'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Save, Eye, Download } from 'lucide-react';
import { FormData, FinancialSection } from '@/types/financial';
import PersonalInfoForm from './forms/PersonalInfoForm';
import IncomeForm from './forms/IncomeForm';
import ExpensesForm from './forms/ExpensesForm';
import AssetsForm from './forms/AssetsForm';
import LiabilitiesForm from './forms/LiabilitiesForm';
import GoalsForm from './forms/GoalsForm';
import PreferencesForm from './forms/PreferencesForm';
import RiskAssessmentForm from './forms/RiskAssessmentForm';
import EmployerBenefitsForm from './forms/EmployerBenefitsForm';
import InsuranceForm from './forms/InsuranceForm';
import TaxSituationForm from './forms/TaxSituationForm';
import EstatePlanningForm from './forms/EstatePlanningForm';
import BehavioralAssessmentForm from './forms/BehavioralAssessmentForm';
import CashFlowAnalysisForm from './forms/CashFlowAnalysisForm';
import LifeCareerPlanningForm from './forms/LifeCareerPlanningForm';
import InvestmentPhilosophyForm from './forms/InvestmentPhilosophyForm';

interface OnboardingWizardProps {
  onComplete?: (data: FormData) => void;
  onSave?: (data: FormData) => void;
  initialData?: FormData;
}

export default function OnboardingWizard({ 
  onComplete, 
  onSave, 
  initialData 
}: OnboardingWizardProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [showPreview, setShowPreview] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const sections: FinancialSection[] = [
    {
      title: 'Personal Information',
      key: 'personal',
      icon: '👤',
      description: 'Demographics, contact preferences',
      completed: !!formData.personal?.name
    },
    {
      title: 'Income Assessment',
      key: 'income',
      icon: '💰',
      description: 'All income sources and expectations (before taxes and deductions)',
      completed: !!formData.income?.annualIncome
    },
    {
      title: 'Expenses & Budget',
      key: 'expenses',
      icon: '🏠',
      description: 'Comprehensive monthly and annual expenses',
      completed: !!formData.expenses?.housing
    },
    {
      title: 'Assets',
      key: 'assets',
      icon: '📈',
      description: 'Savings, investments, and property',
      completed: !!formData.assets?.savings
    },
    {
      title: 'Liabilities',
      key: 'liabilities',
      icon: '💳',
      description: 'All debts and credit obligations',
      completed: Boolean(formData.liabilities?.mortgageBalance || 
                  (formData.liabilities?.autoLoans && formData.liabilities.autoLoans.length > 0) ||
                  (formData.liabilities?.creditCards && formData.liabilities.creditCards.length > 0))
    },
    {
      title: 'Financial Goals',
      key: 'goals',
      icon: '🎯',
      description: 'Goal prioritization and targets',
      completed: !!formData.goals?.retirementAge
    },
    {
      title: 'Life Goals',
      key: 'preferences',
      icon: '🏡',
      description: 'Real estate, business, and lifestyle',
      completed: !!formData.preferences?.secondHome
    },
    {
      title: 'Employer Benefits',
      key: 'employerBenefits',
      icon: '🏢',
      description: '401k, pension, and workplace benefits',
      completed: !!formData.employerBenefits?.match401kAvailable
    },
    {
      title: 'Retirement Planning',
      key: 'risk',
      icon: '🏖️',
      description: 'Retirement lifestyle and Social Security',
      completed: !!formData.risk?.experienceLevel
    },
    {
      title: 'Investment & Risk',
      key: 'investmentPhilosophy',
      icon: '⚖️',
      description: 'Investment philosophy and risk tolerance',
      completed: !!formData.investmentPhilosophy?.investmentManagementStyle
    },
    {
      title: 'Insurance Review',
      key: 'insurance',
      icon: '🛡️',
      description: 'Health, life, disability, and property insurance',
      completed: !!formData.insurance?.healthInsuranceType
    },
    {
      title: 'Tax Situation',
      key: 'taxSituation',
      icon: '📊',
      description: 'Tax planning and optimization',
      completed: !!formData.taxSituation?.filingStatus
    },
    {
      title: 'Estate Planning',
      key: 'estatePlanning',
      icon: '📜',
      description: 'Wills, trusts, and estate documents',
      completed: !!formData.estatePlanning?.will
    },
    {
      title: 'Behavioral Assessment',
      key: 'behavioral',
      icon: '🧠',
      description: 'Financial history and psychology',
      completed: !!formData.behavioral?.moneyPersonality
    },
    {
      title: 'Cash Flow Analysis',
      key: 'cashFlow',
      icon: '💹',
      description: 'Income vs expenses validation',
      completed: !!formData.cashFlow?.takeHomePay
    },
    {
      title: 'Life & Career',
      key: 'lifeCareer',
      icon: '🚀',
      description: 'Career plans and family considerations',
      completed: !!formData.lifeCareer?.expectedIncomeGrowthRate
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Initialize form data from props
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateSectionData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const getCompletedSectionsCount = () => {
    return sections.filter(section => {
      const sectionData = formData[section.key as keyof FormData];
      return sectionData && Object.keys(sectionData).some(key => (sectionData as any)[key] != null && (sectionData as any)[key] !== '');
    }).length;
  };

  const getOverallProgress = () => {
    return Math.round((getCompletedSectionsCount() / sections.length) * 100);
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = async () => {
    try {
      if (onComplete) {
        await onComplete(formData);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderCurrentForm = () => {
    const currentSectionKey = sections[currentSection].key;
    const sectionData = formData[currentSectionKey as keyof FormData];
    const onUpdate = (data: any) => updateSectionData(currentSectionKey, data);
    const onFieldUpdate = (field: string, value: any) => updateFormData(currentSectionKey, field, value);

    switch (currentSectionKey) {
      case 'personal':
        return <PersonalInfoForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'income':
        return <IncomeForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'expenses':
        return <ExpensesForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'assets':
        return <AssetsForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'liabilities':
        return <LiabilitiesForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'goals':
        return <GoalsForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'preferences':
        return <PreferencesForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'employerBenefits':
        return <EmployerBenefitsForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'risk':
        return <RiskAssessmentForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'investmentPhilosophy':
        return <InvestmentPhilosophyForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'insurance':
        return <InsuranceForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'taxSituation':
        return <TaxSituationForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'estatePlanning':
        return <EstatePlanningForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'behavioral':
        return <BehavioralAssessmentForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'cashFlow':
        return <CashFlowAnalysisForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      case 'lifeCareer':
        return <LifeCareerPlanningForm data={sectionData as any} onUpdate={onUpdate} onFieldUpdate={onFieldUpdate} />;
      default:
        return <div>Form not implemented</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Financial Planning Questionnaire</h1>
        <p className="text-gray-600">Complete your comprehensive financial profile to receive personalized recommendations</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{getOverallProgress()}% Complete</span>
              {isAutoSaving && (
                <Badge variant="secondary" className="text-xs">
                  <Save className="w-3 h-3 mr-1" />
                  Saving...
                </Badge>
              )}
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
            <div className="text-xs text-gray-500 text-center">
              {getCompletedSectionsCount()} of {sections.length} sections completed
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Section Navigation */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={currentSection.toString()} className="w-full">
            <div className="flex overflow-x-auto pb-2 gap-2">
              {sections.map((section, index) => {
                const isCompleted = sections.find(s => s.key === section.key)?.completed;
                const isActive = currentSection === index;
                return (
                  <button
                    key={section.key}
                    onClick={() => setCurrentSection(index)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-20 whitespace-nowrap transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {section.title.split(' ').map((word, i) => (
                        <span key={i} className="block">
                          {word}
                        </span>
                      ))}
                    </span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                    {isCompleted && <CheckCircle className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />}
                  </button>
                );
              })}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Current Section Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{sections[currentSection].icon}</span>
                {sections[currentSection].title}
                {sections[currentSection].completed && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">{sections[currentSection].description}</p>
            </div>
            <Badge variant="outline">
              {currentSection + 1} of {sections.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCurrentForm()}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSection === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-gray-500">
          Section {currentSection + 1} of {sections.length}
        </div>

        {currentSection === sections.length - 1 ? (
          <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
            Complete Assessment
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide' : 'Preview'} Data
        </Button>
        <Button
          variant="outline"
          onClick={exportData}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Data Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-700">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}