'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Clock, Zap, Sparkles, TrendingUp } from 'lucide-react';

export interface QuickPlanData {
  // Personal Information (3 questions)
  age: number;
  annualHouseholdIncome: number;
  primaryFinancialGoal: string;
  
  // Current Financial Snapshot (6 questions)
  monthlyExpenses: number;
  currentSavings: number;
  retirementBalance: number;
  totalDebt: number;
  monthlyDebtPayments: number;
  monthlyHousingCost: number;
  
  // Employment & Security (3 questions)
  employmentStatus: string;
  jobSecurity: string;
  emergencyFundCoverage: string;
  
  // Risk & Planning (4 questions)
  riskTolerance: string;
  retirementTimeline: string;
  urgentFinancialConcern: string;
  expectedLifeChanges: string;
  
  // Optional Context (1 question)
  additionalContext?: string;
}

interface QuickPlanWizardProps {
  onComplete: (data: QuickPlanData) => void;
  onUpgradeToComprehensive: () => void;
  initialData?: Partial<QuickPlanData>;
}

export default function QuickPlanWizard({ 
  onComplete, 
  onUpgradeToComprehensive,
  initialData = {}
}: QuickPlanWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<QuickPlanData>>(initialData);

  const steps = [
    {
      title: 'Personal Information',
      description: 'Basic details to get started',
      questions: 3
    },
    {
      title: 'Financial Snapshot',
      description: 'Current financial situation',
      questions: 6
    },
    {
      title: 'Employment & Security',
      description: 'Job and emergency preparedness',
      questions: 3
    },
    {
      title: 'Risk & Planning',
      description: 'Goals and preferences',
      questions: 4
    },
    {
      title: 'Final Details',
      description: 'Any additional context',
      questions: 1
    }
  ];

  const updateFormData = (field: keyof QuickPlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getProgress = () => {
    const totalQuestions = 17;
    const completedQuestions = Object.keys(formData).filter(key => 
      formData[key as keyof QuickPlanData] !== undefined && 
      formData[key as keyof QuickPlanData] !== ''
    ).length;
    return Math.round((completedQuestions / totalQuestions) * 100);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (isFormValid()) {
      onComplete(formData as QuickPlanData);
    }
  };

  const isFormValid = () => {
    const requiredFields: (keyof QuickPlanData)[] = [
      'age', 'annualHouseholdIncome', 'primaryFinancialGoal',
      'monthlyExpenses', 'currentSavings', 'retirementBalance',
      'totalDebt', 'monthlyDebtPayments', 'monthlyHousingCost',
      'employmentStatus', 'jobSecurity', 'emergencyFundCoverage',
      'riskTolerance', 'retirementTimeline', 'urgentFinancialConcern',
      'expectedLifeChanges'
    ];
    
    return requiredFields.every(field => 
      formData[field] !== undefined && formData[field] !== ''
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="age" className="text-white font-medium text-base">What is your age?</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 35"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', parseInt(e.target.value) || 0)}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="income" className="text-white font-medium text-base">Annual household income (combined if married)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                <Input
                  id="income"
                  type="number"
                  placeholder="75,000"
                  value={formData.annualHouseholdIncome || ''}
                  onChange={(e) => updateFormData('annualHouseholdIncome', parseInt(e.target.value) || 0)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 text-lg pl-8"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-white font-medium text-base">What is your primary financial goal?</Label>
              <RadioGroup 
                value={formData.primaryFinancialGoal || ''} 
                onValueChange={(value) => updateFormData('primaryFinancialGoal', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <RadioGroupItem value="retirement" id="retirement" className="border-slate-500 text-emerald-400" />
                  <Label htmlFor="retirement" className="text-slate-300 font-medium cursor-pointer flex-1">Retirement planning</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <RadioGroupItem value="debt-payoff" id="debt-payoff" className="border-slate-500 text-emerald-400" />
                  <Label htmlFor="debt-payoff" className="text-slate-300 font-medium cursor-pointer flex-1">Debt payoff</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <RadioGroupItem value="emergency-fund" id="emergency-fund" className="border-slate-500 text-emerald-400" />
                  <Label htmlFor="emergency-fund" className="text-slate-300 font-medium cursor-pointer flex-1">Emergency fund</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <RadioGroupItem value="home-purchase" id="home-purchase" className="border-slate-500 text-emerald-400" />
                  <Label htmlFor="home-purchase" className="text-slate-300 font-medium cursor-pointer flex-1">Home purchase</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <RadioGroupItem value="investment-growth" id="investment-growth" className="border-slate-500 text-emerald-400" />
                  <Label htmlFor="investment-growth" className="text-slate-300 font-medium cursor-pointer flex-1">Investment growth</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <RadioGroupItem value="other" id="other" className="border-slate-500 text-emerald-400" />
                  <Label htmlFor="other" className="text-slate-300 font-medium cursor-pointer flex-1">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 1: // Financial Snapshot
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="expenses">Total monthly expenses (approximate)</Label>
              <Input
                id="expenses"
                type="number"
                placeholder="e.g., 4500"
                value={formData.monthlyExpenses || ''}
                onChange={(e) => updateFormData('monthlyExpenses', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="savings">Current savings balance (all savings accounts combined)</Label>
              <Input
                id="savings"
                type="number"
                placeholder="e.g., 15000"
                value={formData.currentSavings || ''}
                onChange={(e) => updateFormData('currentSavings', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirement">Retirement account balance (401k, IRA, etc. combined)</Label>
              <Input
                id="retirement"
                type="number"
                placeholder="e.g., 50000"
                value={formData.retirementBalance || ''}
                onChange={(e) => updateFormData('retirementBalance', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debt">Total debt balance (all debts excluding mortgage)</Label>
              <Input
                id="debt"
                type="number"
                placeholder="e.g., 25000"
                value={formData.totalDebt || ''}
                onChange={(e) => updateFormData('totalDebt', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debt-payments">Monthly debt payments (minimum payments excluding mortgage)</Label>
              <Input
                id="debt-payments"
                type="number"
                placeholder="e.g., 800"
                value={formData.monthlyDebtPayments || ''}
                onChange={(e) => updateFormData('monthlyDebtPayments', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="housing">Monthly housing cost (mortgage/rent + taxes + insurance)</Label>
              <Input
                id="housing"
                type="number"
                placeholder="e.g., 2200"
                value={formData.monthlyHousingCost || ''}
                onChange={(e) => updateFormData('monthlyHousingCost', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        );

      case 2: // Employment & Security
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Employment status</Label>
              <Select 
                value={formData.employmentStatus || ''} 
                onValueChange={(value) => updateFormData('employmentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time employed</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="part-time">Part-time employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Job security level</Label>
              <RadioGroup 
                value={formData.jobSecurity || ''} 
                onValueChange={(value) => updateFormData('jobSecurity', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-secure" id="very-secure" />
                  <Label htmlFor="very-secure">Very secure</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="secure" id="secure" />
                  <Label htmlFor="secure">Secure</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="uncertain" id="uncertain" />
                  <Label htmlFor="uncertain">Somewhat uncertain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="at-risk" id="at-risk" />
                  <Label htmlFor="at-risk">At risk</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Emergency fund coverage</Label>
              <RadioGroup 
                value={formData.emergencyFundCoverage || ''} 
                onValueChange={(value) => updateFormData('emergencyFundCoverage', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less-1-month" id="less-1-month" />
                  <Label htmlFor="less-1-month">Less than 1 month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-3-months" id="1-3-months" />
                  <Label htmlFor="1-3-months">1-3 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-6-months" id="3-6-months" />
                  <Label htmlFor="3-6-months">3-6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6-plus-months" id="6-plus-months" />
                  <Label htmlFor="6-plus-months">6+ months</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3: // Risk & Planning
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Risk tolerance</Label>
              <RadioGroup 
                value={formData.riskTolerance || ''} 
                onValueChange={(value) => updateFormData('riskTolerance', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-conservative" id="very-conservative" />
                  <Label htmlFor="very-conservative">Very conservative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative">Conservative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aggressive" id="aggressive" />
                  <Label htmlFor="aggressive">Aggressive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-aggressive" id="very-aggressive" />
                  <Label htmlFor="very-aggressive">Very aggressive</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Retirement timeline</Label>
              <RadioGroup 
                value={formData.retirementTimeline || ''} 
                onValueChange={(value) => updateFormData('retirementTimeline', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="already-retired" id="already-retired" />
                  <Label htmlFor="already-retired">Already retired</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20-plus-years" id="20-plus-years" />
                  <Label htmlFor="20-plus-years">20+ years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-20-years" id="10-20-years" />
                  <Label htmlFor="10-20-years">10-20 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5-10-years" id="5-10-years" />
                  <Label htmlFor="5-10-years">5-10 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less-5-years" id="less-5-years" />
                  <Label htmlFor="less-5-years">Less than 5 years</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Most urgent financial concern</Label>
              <RadioGroup 
                value={formData.urgentFinancialConcern || ''} 
                onValueChange={(value) => updateFormData('urgentFinancialConcern', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-saving-enough" id="not-saving-enough" />
                  <Label htmlFor="not-saving-enough">Not saving enough</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="too-much-debt" id="too-much-debt" />
                  <Label htmlFor="too-much-debt">Too much debt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-emergency-fund" id="no-emergency-fund" />
                  <Label htmlFor="no-emergency-fund">No emergency fund</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="investment-strategy" id="investment-strategy" />
                  <Label htmlFor="investment-strategy">Investment strategy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="insurance-gaps" id="insurance-gaps" />
                  <Label htmlFor="insurance-gaps">Insurance gaps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tax-optimization" id="tax-optimization" />
                  <Label htmlFor="tax-optimization">Tax optimization</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Expected major life changes in next 2 years</Label>
              <Select 
                value={formData.expectedLifeChanges || ''} 
                onValueChange={(value) => updateFormData('expectedLifeChanges', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expected changes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marriage">Marriage</SelectItem>
                  <SelectItem value="divorce">Divorce</SelectItem>
                  <SelectItem value="baby">Having a baby</SelectItem>
                  <SelectItem value="job-change">Job change</SelectItem>
                  <SelectItem value="home-purchase">Home purchase</SelectItem>
                  <SelectItem value="inheritance">Inheritance</SelectItem>
                  <SelectItem value="health-event">Health event</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4: // Final Details
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="context">Additional important financial context (optional)</Label>
              <Textarea
                id="context"
                placeholder="Any additional information that might be relevant to your financial planning..."
                value={formData.additionalContext || ''}
                onChange={(e) => updateFormData('additionalContext', e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-blue-900">Ready for your Quick Financial Plan!</h4>
              <p className="text-sm text-blue-800">
                Based on your answers, we'll provide immediate guidance on your top financial priorities, 
                basic retirement readiness, and actionable next steps.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Analysis ready in seconds</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onUpgradeToComprehensive}
                  className="text-blue-700 border-blue-300"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade to Comprehensive
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-4 w-72 h-72 bg-emerald-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Quick Financial Analysis</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30">
              <Zap className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Quick Financial Plan
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get essential financial guidance powered by AI in just minutes
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>5-7 minutes</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>17 questions</span>
            </div>
            <span>•</span>
            <span>Immediate results</span>
          </div>
        </div>

        {/* Progress */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-white">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                  <div className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                    {steps[currentStep].title}
                  </div>
                </div>
                <div className="text-sm text-slate-400 font-medium">{getProgress()}% Complete</div>
              </div>
              <div className="relative">
                <Progress value={getProgress()} className="h-3 bg-slate-700/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-full" style={{width: `${getProgress()}%`}}></div>
              </div>
              <div className="text-sm text-slate-400 text-center font-medium">
                {steps[currentStep].description}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-xl font-bold text-white">{steps[currentStep].title}</span>
              <span className="text-sm font-medium text-slate-400 px-2 py-1 bg-slate-700/50 rounded-full">
                {steps[currentStep].questions} questions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700/60 hover:text-white disabled:opacity-50 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-slate-500 font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={handleComplete} 
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Get My Quick Plan
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}