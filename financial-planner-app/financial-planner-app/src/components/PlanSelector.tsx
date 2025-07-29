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
  Star
} from 'lucide-react';

interface PlanSelectorProps {
  onSelectQuickPlan: () => void;
  onSelectComprehensivePlan: () => void;
}

export default function PlanSelector({ 
  onSelectQuickPlan, 
  onSelectComprehensivePlan 
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Financial Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the level of financial guidance that's right for you. Start with our Quick Plan for immediate insights, 
            or dive deep with our Comprehensive Plan for detailed analysis.
          </p>
        </div>

        {/* Plan Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Quick Plan */}
          <Card className="relative border-2 hover:border-green-300 transition-colors">
            <div className="absolute -top-3 left-6">
              <Badge className="bg-green-600 hover:bg-green-600">
                <Zap className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Quick Financial Plan</CardTitle>
                  <p className="text-gray-600">Essential guidance in minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>5-7 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>17 questions</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
                <ul className="space-y-2">
                  {quickPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">Perfect for:</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Getting started with financial planning</li>
                  <li>• Quick priority identification</li>
                  <li>• Immediate actionable guidance</li>
                  <li>• Testing our recommendations</li>
                </ul>
              </div>

              <Button 
                onClick={onSelectQuickPlan}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Start Quick Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Comprehensive Plan */}
          <Card className="relative border-2 hover:border-blue-300 transition-colors">
            <div className="absolute -top-3 left-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Star className="w-3 h-3 mr-1" />
                Complete Analysis
              </Badge>
            </div>

            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Comprehensive Plan</CardTitle>
                  <p className="text-gray-600">Complete financial roadmap</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>20-30 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>All sections</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
                <ul className="space-y-2">
                  {comprehensiveFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className={`text-sm ${index === 0 ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Perfect for:</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Detailed financial planning</li>
                  <li>• Complex financial situations</li>
                  <li>• Tax optimization strategies</li>
                  <li>• Long-term wealth building</li>
                </ul>
              </div>

              <Button 
                onClick={onSelectComprehensivePlan}
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                size="lg"
              >
                Start Comprehensive Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Feature</th>
                    <th className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span>Quick Plan</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span>Comprehensive</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      Financial health score
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="w-4 h-4 text-blue-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      Retirement readiness
                    </td>
                    <td className="text-center py-3 px-4 text-green-600 font-medium">Basic</td>
                    <td className="text-center py-3 px-4 text-blue-600 font-medium">Detailed</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-gray-500" />
                      Investment allocation
                    </td>
                    <td className="text-center py-3 px-4 text-green-600 font-medium">High-level</td>
                    <td className="text-center py-3 px-4 text-blue-600 font-medium">Custom</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-gray-500" />
                      Tax optimization
                    </td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="w-4 h-4 text-blue-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      Insurance analysis
                    </td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="w-4 h-4 text-blue-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Written plan document
                    </td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="w-4 h-4 text-blue-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Path */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Not sure which plan to choose?
              </h3>
              <p className="text-gray-600 mb-4">
                Start with the Quick Plan to get immediate insights. You can always upgrade to the 
                Comprehensive Plan later to unlock detailed analysis and advanced strategies.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>Quick Plan</span>
                <ArrowRight className="w-4 h-4" />
                <span>See results</span>
                <ArrowRight className="w-4 h-4" />
                <span>Upgrade if needed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}