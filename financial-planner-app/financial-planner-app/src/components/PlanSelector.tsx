'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Target, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Shield,
  PieChart,
  Calculator,
  FileText,
  Star,
  Sparkles,
  Crown,
  Award
} from 'lucide-react';

interface PlanSelectorProps {
  onSelectQuickPlan: () => void;
  onSelectComprehensivePlan: () => void;
  onSignIn?: () => void;
  onBackToHome?: () => void;
}

export default function PlanSelector({ 
  onSelectQuickPlan, 
  onSelectComprehensivePlan,
  onSignIn,
  onBackToHome
}: PlanSelectorProps) {
  const quickPlanFeatures = [
    'Basic retirement readiness assessment',
    'Emergency fund recommendations',
    'High-level debt payoff strategy',
    'Savings rate targets',
    'Risk-appropriate investment allocation',
    'Top 3 priority action items',
    'Financial health score'
  ];

  const comprehensiveFeatures = [
    'Everything in Quick Plan PLUS:',
    'Detailed retirement projections with scenarios',
    'Complete estate planning recommendations',
    'Tax optimization strategies',
    'Insurance gap analysis',
    'Custom investment portfolio construction',
    'Cash flow projections & scenario modeling',
    'Monte Carlo retirement analysis',
    'Comprehensive written financial plan',
    'Advanced tax minimization strategies',
    'Detailed action plan with timelines'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Premium Financial Planning</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6 leading-tight">
            Choose Your Path to
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Financial Freedom</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Experience AI-powered financial planning designed for the modern investor. 
            Select the perfect plan tailored to your needs and goals.
          </p>
        </div>

        {/* Back to Home Button */}
        {onBackToHome && (
          <div className="text-center mb-8">
            <Button 
              onClick={onBackToHome}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              ← Back to Home
            </Button>
          </div>
        )}

        {/* Sign In Option for Existing Users */}
        {onSignIn && (
          <div className="text-center mb-8">
            <Card className="inline-block bg-slate-800/40 backdrop-blur-xl border-slate-700/30 px-8 py-6">
              <CardContent className="p-0">
                <p className="text-slate-300 mb-4">Already have an account?</p>
                <Button 
                  onClick={onSignIn}
                  variant="outline"
                  className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50 text-slate-200 hover:text-white"
                >
                  Sign In to View Your Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plan Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Quick Plan */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <Card className="relative bg-slate-800/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/90 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
              
              <div className="absolute -top-4 left-6">
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                  <Zap className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              
              <CardHeader className="pb-6 pt-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30">
                    <Zap className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-white mb-2">Quick Start Plan</CardTitle>
                    <p className="text-slate-400">Get instant financial clarity</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>5-7 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>17 questions</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-0">
                <div>
                  <h4 className="font-semibold text-white mb-4">What you'll get:</h4>
                  <ul className="space-y-3">
                    {quickPlanFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-300 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 p-5 rounded-xl border border-emerald-500/20">
                  <h5 className="font-medium text-emerald-400 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Perfect for:
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                      Getting started with financial planning
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                      Quick priority identification
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                      Immediate actionable guidance
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                      Testing our recommendations
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={onSelectQuickPlan}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 border-0"
                  size="lg"
                >
                  Start Quick Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Comprehensive Plan */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <Card className="relative bg-slate-800/80 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/90 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
              
              <div className="absolute -top-4 left-6">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Analysis
                </Badge>
              </div>

              <CardHeader className="pb-6 pt-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-500/30">
                    <Target className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-white mb-2">Comprehensive Plan</CardTitle>
                    <p className="text-slate-400">Complete wealth strategy</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>20-30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>All sections</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-0">
                <div>
                  <h4 className="font-semibold text-white mb-4">What you'll get:</h4>
                  <ul className="space-y-3">
                    {comprehensiveFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className={`text-sm leading-relaxed ${index === 0 ? 'font-medium text-blue-300' : 'text-slate-300'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 p-5 rounded-xl border border-blue-500/20">
                  <h5 className="font-medium text-blue-400 mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Perfect for:
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      Detailed financial planning
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      Complex financial situations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      Tax optimization strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      Long-term wealth building
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={onSelectComprehensivePlan}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 border-0"
                  size="lg"
                >
                  Start Comprehensive Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Comparison */}
        <Card className="mb-16 bg-slate-800/60 backdrop-blur-xl border-slate-700/50 overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-700/50">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Detailed Feature Comparison
            </CardTitle>
            <p className="text-slate-400">See exactly what's included in each plan</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700/50">
                    <th className="text-left py-4 px-6 font-semibold text-white">Feature</th>
                    <th className="text-center py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-emerald-400">Quick Plan</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-blue-400">Comprehensive</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300 font-medium">Financial health score</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-blue-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <Target className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300 font-medium">Retirement readiness</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">Basic</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">Detailed</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <PieChart className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300 font-medium">Investment allocation</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">High-level</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">Custom</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300 font-medium">Tax optimization</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="text-slate-500 text-lg">—</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-blue-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300 font-medium">Insurance analysis</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="text-slate-500 text-lg">—</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-blue-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300 font-medium">Written plan document</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="text-slate-500 text-lg">—</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-blue-400 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Path */}
        <Card className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-600/10 border border-slate-700/30 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-600/5"></div>
          <CardContent className="pt-8 pb-8 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">Still deciding?</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Not sure which plan to choose?
              </h3>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Start with the Quick Plan to get immediate insights and actionable recommendations. 
                You can always upgrade to unlock comprehensive analysis and advanced wealth strategies.
              </p>
              <div className="flex items-center justify-center gap-4 text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-medium">Quick Start</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-medium">Get Results</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Crown className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="font-medium">Upgrade Later</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}