'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { RiskAssessment } from '@/types/financial';

interface RiskAssessmentFormProps {
  data?: RiskAssessment;
  onUpdate: (data: RiskAssessment) => void;
  onFieldUpdate: (field: keyof RiskAssessment, value: any) => void;
}

export default function RiskAssessmentForm({ data, onUpdate, onFieldUpdate }: RiskAssessmentFormProps) {
  const riskData = data || {} as RiskAssessment;

  const handleFieldChange = (field: keyof RiskAssessment, value: string) => {
    const updatedData = {
      ...riskData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  const calculateRiskScore = () => {
    let score = 0;
    const maxScore = 100;

    // Experience Level (25 points)
    switch (riskData.experienceLevel) {
      case 'very_experienced':
        score += 25;
        break;
      case 'experienced':
        score += 20;
        break;
      case 'some_experience':
        score += 12;
        break;
      case 'beginner':
        score += 5;
        break;
    }

    // Portfolio Drop Response (35 points)
    switch (riskData.portfolioDrop) {
      case 'buy_more':
        score += 35;
        break;
      case 'hold_steady':
        score += 25;
        break;
      case 'sell_some':
        score += 10;
        break;
      case 'sell_everything':
        score += 0;
        break;
    }

    // Investment Timeline (25 points)
    switch (riskData.timeline) {
      case '20+_years':
        score += 25;
        break;
      case '10-20_years':
        score += 20;
        break;
      case '5-10_years':
        score += 12;
        break;
      case 'less_than_5_years':
        score += 5;
        break;
    }

    // Largest Loss Experience (15 points)
    switch (riskData.largestLoss) {
      case 'comfortable_50_plus':
        score += 15;
        break;
      case 'handled_20_50':
        score += 12;
        break;
      case 'stressed_10_20':
        score += 8;
        break;
      case 'very_stressed_under_10':
        score += 3;
        break;
    }

    return Math.min(score, maxScore);
  };

  const getRiskProfile = () => {
    const score = calculateRiskScore();
    if (score >= 80) return { label: 'Aggressive', color: 'red', description: 'High risk tolerance, seeks maximum growth potential' };
    if (score >= 60) return { label: 'Growth', color: 'orange', description: 'Above average risk tolerance, growth-focused' };
    if (score >= 40) return { label: 'Moderate', color: 'yellow', description: 'Balanced approach to risk and return' };
    if (score >= 20) return { label: 'Conservative', color: 'blue', description: 'Lower risk tolerance, values stability' };
    return { label: 'Very Conservative', color: 'green', description: 'Minimal risk tolerance, prioritizes capital preservation' };
  };

  const riskProfile = getRiskProfile();
  const riskScore = calculateRiskScore();

  return (
    <div className="space-y-6">
      {/* Investment Experience */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📊 Investment Experience</h3>
          
          <div className="space-y-4">
            {/* Experience Level */}
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Investment Experience Level</Label>
              <Select
                value={riskData.experienceLevel || ''}
                onValueChange={(value) => handleFieldChange('experienceLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How would you describe your investment experience?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Beginner</span>
                      <span className="text-xs text-gray-500">Little to no investment experience</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="some_experience">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Some Experience</span>
                      <span className="text-xs text-gray-500">Basic understanding, some investments</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="experienced">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Experienced</span>
                      <span className="text-xs text-gray-500">Good understanding, regular investor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="very_experienced">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Very Experienced</span>
                      <span className="text-xs text-gray-500">Extensive knowledge, sophisticated strategies</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Largest Loss Experience */}
            <div className="space-y-2">
              <Label htmlFor="largestLoss">Largest Investment Loss Experience</Label>
              <Select
                value={riskData.largestLoss || ''}
                onValueChange={(value) => handleFieldChange('largestLoss', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What's the largest investment loss you've experienced?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_experience">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">No Experience</span>
                      <span className="text-xs text-gray-500">Haven't experienced significant losses</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="very_stressed_under_10">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Under 10% - Very Stressful</span>
                      <span className="text-xs text-gray-500">Small losses caused significant stress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="stressed_10_20">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">10-20% - Stressful</span>
                      <span className="text-xs text-gray-500">Moderate losses were concerning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="handled_20_50">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">20-50% - Handled Well</span>
                      <span className="text-xs text-gray-500">Significant losses were manageable</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="comfortable_50_plus">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">50%+ - Comfortable</span>
                      <span className="text-xs text-gray-500">Large losses didn't change strategy</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Tolerance Scenarios */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎭 Risk Tolerance Scenarios</h3>
          
          <div className="space-y-4">
            {/* Portfolio Drop Reaction */}
            <div className="space-y-2">
              <Label htmlFor="portfolioDrop">Market Crash Response</Label>
              <p className="text-sm text-gray-600 mb-3">
                If your investment portfolio dropped 20% in value during a market downturn, you would:
              </p>
              <Select
                value={riskData.portfolioDrop || ''}
                onValueChange={(value) => handleFieldChange('portfolioDrop', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How would you respond to a 20% portfolio drop?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sell_everything">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Sell Everything</span>
                      <span className="text-xs text-gray-500">Cut losses and move to safer investments</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sell_some">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Sell Some Holdings</span>
                      <span className="text-xs text-gray-500">Reduce risk by selling part of portfolio</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hold_steady">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Hold Steady</span>
                      <span className="text-xs text-gray-500">Keep current strategy and wait it out</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="buy_more">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Buy More</span>
                      <span className="text-xs text-gray-500">See it as opportunity to invest at lower prices</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Investment Timeline */}
            <div className="space-y-2">
              <Label htmlFor="timeline">Investment Time Horizon</Label>
              <p className="text-sm text-gray-600 mb-3">
                How long do you plan to keep your investments before needing the money?
              </p>
              <Select
                value={riskData.timeline || ''}
                onValueChange={(value) => handleFieldChange('timeline', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What's your investment timeline?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less_than_5_years">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Less than 5 years</span>
                      <span className="text-xs text-gray-500">Short-term needs, lower risk appropriate</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="5-10_years">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">5-10 years</span>
                      <span className="text-xs text-gray-500">Medium-term goals, moderate risk</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="10-20_years">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">10-20 years</span>
                      <span className="text-xs text-gray-500">Long-term growth, higher risk tolerance</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="20+_years">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">20+ years</span>
                      <span className="text-xs text-gray-500">Very long-term, maximum growth potential</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Profile Results */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-4">🎯 Your Risk Profile Assessment</h4>
          
          <div className="space-y-4">
            {/* Risk Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-800">Risk Tolerance Score</span>
                <span className="text-lg font-bold text-blue-900">{riskScore}/100</span>
              </div>
              <Progress value={riskScore} className="h-3" />
            </div>

            {/* Risk Profile */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-lg text-gray-900">{riskProfile.label} Investor</h5>
                <div className={`w-4 h-4 rounded-full bg-${riskProfile.color}-500`}></div>
              </div>
              <p className="text-gray-700 text-sm">{riskProfile.description}</p>
            </div>

            {/* Investment Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <h6 className="font-medium text-gray-900 mb-2">✅ Suitable Investments</h6>
                <ul className="text-xs text-gray-700 space-y-1">
                  {riskProfile.label === 'Very Conservative' && (
                    <>
                      <li>• High-yield savings accounts</li>
                      <li>• CDs and treasury bonds</li>
                      <li>• Conservative bond funds</li>
                      <li>• Money market accounts</li>
                    </>
                  )}
                  {riskProfile.label === 'Conservative' && (
                    <>
                      <li>• Bond funds and ETFs</li>
                      <li>• Dividend-focused stocks</li>
                      <li>• Balanced mutual funds</li>
                      <li>• Target-date funds</li>
                    </>
                  )}
                  {riskProfile.label === 'Moderate' && (
                    <>
                      <li>• Diversified stock/bond mix</li>
                      <li>• Index funds and ETFs</li>
                      <li>• Real estate investment trusts</li>
                      <li>• International diversification</li>
                    </>
                  )}
                  {riskProfile.label === 'Growth' && (
                    <>
                      <li>• Growth stock funds</li>
                      <li>• Small and mid-cap stocks</li>
                      <li>• Emerging market exposure</li>
                      <li>• Technology sector funds</li>
                    </>
                  )}
                  {riskProfile.label === 'Aggressive' && (
                    <>
                      <li>• Individual growth stocks</li>
                      <li>• Sector-specific ETFs</li>
                      <li>• Options strategies</li>
                      <li>• Alternative investments</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-white p-3 rounded border">
                <h6 className="font-medium text-gray-900 mb-2">⚠️ Consider Avoiding</h6>
                <ul className="text-xs text-gray-700 space-y-1">
                  {riskProfile.label === 'Very Conservative' && (
                    <>
                      <li>• Individual stocks</li>
                      <li>• High-yield bonds</li>
                      <li>• Sector-specific funds</li>
                      <li>• Cryptocurrency</li>
                    </>
                  )}
                  {riskProfile.label === 'Conservative' && (
                    <>
                      <li>• Penny stocks</li>
                      <li>• Options trading</li>
                      <li>• Leveraged ETFs</li>
                      <li>• Speculative investments</li>
                    </>
                  )}
                  {riskProfile.label === 'Moderate' && (
                    <>
                      <li>• Day trading</li>
                      <li>• Highly leveraged products</li>
                      <li>• Concentrated positions</li>
                      <li>• Speculative stocks</li>
                    </>
                  )}
                  {riskProfile.label === 'Growth' && (
                    <>
                      <li>• Over-concentration in one asset</li>
                      <li>• Excessive leverage</li>
                      <li>• Emotional trading</li>
                      <li>• Market timing attempts</li>
                    </>
                  )}
                  {riskProfile.label === 'Aggressive' && (
                    <>
                      <li>• Putting all eggs in one basket</li>
                      <li>• Ignoring diversification</li>
                      <li>• Emotional decision-making</li>
                      <li>• Excessive portfolio turnover</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Risk Management Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Know yourself:</strong> Understanding your risk tolerance prevents emotional decisions</li>
            <li>• <strong>Diversification:</strong> Don't put all your eggs in one basket</li>
            <li>• <strong>Time horizon matters:</strong> Longer timelines allow for higher risk tolerance</li>
            <li>• <strong>Regular review:</strong> Risk tolerance can change with life circumstances</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}