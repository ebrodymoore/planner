'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { InvestmentPhilosophy } from '@/types/financial';

interface InvestmentPhilosophyFormProps {
  data?: InvestmentPhilosophy;
  onUpdate: (data: InvestmentPhilosophy) => void;
  onFieldUpdate: (field: keyof InvestmentPhilosophy, value: any) => void;
}

export default function InvestmentPhilosophyForm({ data, onUpdate, onFieldUpdate }: InvestmentPhilosophyFormProps) {
  const investmentData = data || {} as InvestmentPhilosophy;

  const handleFieldChange = (field: keyof InvestmentPhilosophy, value: any) => {
    const updatedData = {
      ...investmentData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  const handleArrayFieldChange = (field: keyof InvestmentPhilosophy, value: string, isChecked: boolean) => {
    const currentArray = (investmentData[field] as string[]) || [];
    const updatedArray = isChecked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFieldChange(field, updatedArray);
  };

  return (
    <div className="space-y-6">
      {/* Investment Management Preferences */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">⚖️ Investment Management Style</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investmentManagementStyle">Investment Management Preference</Label>
              <Select
                value={investmentData.investmentManagementStyle || ''}
                onValueChange={(value) => handleFieldChange('investmentManagementStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you prefer to manage investments?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hands_off">Hands-off (Target date funds, robo-advisor)</SelectItem>
                  <SelectItem value="some_involvement">Some involvement with guidance</SelectItem>
                  <SelectItem value="active_management">Active management</SelectItem>
                  <SelectItem value="very_hands_on">Very hands-on (individual stocks)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rebalancingFrequency">Rebalancing Frequency</Label>
              <Select
                value={investmentData.rebalancingFrequency || ''}
                onValueChange={(value) => handleFieldChange('rebalancingFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How often do you rebalance?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never rebalance</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="as_needed">As needed (threshold-based)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentResearchInterest">Investment Research Interest</Label>
              <Select
                value={investmentData.investmentResearchInterest || ''}
                onValueChange={(value) => handleFieldChange('investmentResearchInterest', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Interest in investment research" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_interest">No interest in research</SelectItem>
                  <SelectItem value="basic_understanding">Basic understanding preferred</SelectItem>
                  <SelectItem value="moderate_interest">Moderate interest</SelectItem>
                  <SelectItem value="high_interest">High interest in research</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAssetAllocationKnowledge">Asset Allocation Knowledge</Label>
              <Select
                value={investmentData.currentAssetAllocationKnowledge || ''}
                onValueChange={(value) => handleFieldChange('currentAssetAllocationKnowledge', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Current allocation knowledge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dont_know">Don't know current allocation</SelectItem>
                  <SelectItem value="rough_idea">Rough idea</SelectItem>
                  <SelectItem value="know_well">Know allocation well</SelectItem>
                  <SelectItem value="monitor_closely">Monitor closely</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Allocation Preferences */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🌍 Asset Allocation Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="internationalInvestmentComfort">International Investment Comfort</Label>
              <Select
                value={investmentData.internationalInvestmentComfort || ''}
                onValueChange={(value) => handleFieldChange('internationalInvestmentComfort', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Comfort with international investments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us_only">US investments only</SelectItem>
                  <SelectItem value="some_international">Some international (10-20%)</SelectItem>
                  <SelectItem value="significant_international">Significant international (20-40%)</SelectItem>
                  <SelectItem value="global_approach">Global approach (40%+ international)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternativeInvestmentInterest">Alternative Investment Interest</Label>
              <Select
                value={investmentData.alternativeInvestmentInterest || ''}
                onValueChange={(value) => handleFieldChange('alternativeInvestmentInterest', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Interest in alternatives" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_interest">No interest</SelectItem>
                  <SelectItem value="curious">Curious but cautious</SelectItem>
                  <SelectItem value="moderate_allocation">Moderate allocation (5-15%)</SelectItem>
                  <SelectItem value="significant_allocation">Significant allocation (15%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="esgSustainableInvestingInterest">ESG/Sustainable Investing</Label>
              <Select
                value={investmentData.esgSustainableInvestingInterest || ''}
                onValueChange={(value) => handleFieldChange('esgSustainableInvestingInterest', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ESG investing interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_interest">No interest in ESG</SelectItem>
                  <SelectItem value="some_interest">Some interest</SelectItem>
                  <SelectItem value="important_factor">Important factor</SelectItem>
                  <SelectItem value="primary_focus">Primary investment focus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxableAccountStrategy">Taxable Account Strategy</Label>
              <Select
                value={investmentData.taxableAccountStrategy || ''}
                onValueChange={(value) => handleFieldChange('taxableAccountStrategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Taxable account approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_efficient_funds">Tax-efficient index funds</SelectItem>
                  <SelectItem value="individual_stocks">Individual stocks</SelectItem>
                  <SelectItem value="mixed_approach">Mixed approach</SelectItem>
                  <SelectItem value="dont_consider_taxes">Don't consider tax implications</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account-Specific Strategies */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏦 Account-Specific Investment Strategies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retirement401kOptionsQuality">401(k) Investment Options Quality</Label>
              <Select
                value={investmentData.retirement401kOptionsQuality || ''}
                onValueChange={(value) => handleFieldChange('retirement401kOptionsQuality', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quality of 401(k) options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (low-cost index funds)</SelectItem>
                  <SelectItem value="good">Good options available</SelectItem>
                  <SelectItem value="fair">Fair but limited</SelectItem>
                  <SelectItem value="poor">Poor/high-cost options</SelectItem>
                  <SelectItem value="dont_know">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iraInvestmentApproach">IRA Investment Approach</Label>
              <Select
                value={investmentData.iraInvestmentApproach || ''}
                onValueChange={(value) => handleFieldChange('iraInvestmentApproach', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="IRA investment strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="target_date_fund">Target date fund</SelectItem>
                  <SelectItem value="three_fund_portfolio">Three-fund portfolio</SelectItem>
                  <SelectItem value="individual_funds">Individual index funds</SelectItem>
                  <SelectItem value="individual_stocks">Individual stocks</SelectItem>
                  <SelectItem value="managed_professionally">Professionally managed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Circumstances */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎯 Special Circumstances</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="anticipatedInheritance">Anticipated Inheritance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="anticipatedInheritance"
                  type="number"
                  placeholder="0"
                  value={investmentData.anticipatedInheritance || ''}
                  onChange={(e) => handleFieldChange('anticipatedInheritance', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Estimated amount and timeline</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedWindfalls">Expected Windfalls</Label>
              <Input
                id="expectedWindfalls"
                type="text"
                placeholder="Stock options, bonuses, property sales, etc."
                value={investmentData.expectedWindfalls || ''}
                onChange={(e) => handleFieldChange('expectedWindfalls', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependentSpecialNeeds">Dependent Special Needs</Label>
              <Input
                id="dependentSpecialNeeds"
                type="text"
                placeholder="Special needs planning considerations"
                value={investmentData.dependentSpecialNeeds || ''}
                onChange={(e) => handleFieldChange('dependentSpecialNeeds', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eldercareResponsibilities">Eldercare Responsibilities</Label>
              <Input
                id="eldercareResponsibilities"
                type="text"
                placeholder="Expected financial support for aging parents"
                value={investmentData.eldercareResponsibilities || ''}
                onChange={(e) => handleFieldChange('eldercareResponsibilities', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessSuccessionPlans">Business Succession Plans</Label>
              <Textarea
                id="businessSuccessionPlans"
                placeholder="Business ownership and succession planning needs"
                value={investmentData.businessSuccessionPlans || ''}
                onChange={(e) => handleFieldChange('businessSuccessionPlans', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Concerns & Priorities */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💭 Investment Philosophy & Priorities</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mostImportantOutcome">Most Important Investment Outcome</Label>
              <Select
                value={investmentData.mostImportantOutcome || ''}
                onValueChange={(value) => handleFieldChange('mostImportantOutcome', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Primary investment goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="capital_preservation">Capital preservation</SelectItem>
                  <SelectItem value="steady_income">Steady income generation</SelectItem>
                  <SelectItem value="balanced_growth">Balanced growth and income</SelectItem>
                  <SelectItem value="long_term_growth">Long-term growth</SelectItem>
                  <SelectItem value="maximum_returns">Maximum returns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biggestObstacle">Biggest Investment Obstacle</Label>
              <Select
                value={investmentData.biggestObstacle || ''}
                onValueChange={(value) => handleFieldChange('biggestObstacle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Primary investment concern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lack_of_knowledge">Lack of investment knowledge</SelectItem>
                  <SelectItem value="market_volatility">Market volatility concerns</SelectItem>
                  <SelectItem value="insufficient_funds">Insufficient funds to invest</SelectItem>
                  <SelectItem value="time_constraints">Time constraints</SelectItem>
                  <SelectItem value="analysis_paralysis">Too many options (analysis paralysis)</SelectItem>
                  <SelectItem value="past_losses">Past investment losses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInformation">Additional Investment Information</Label>
              <Textarea
                id="additionalInformation"
                placeholder="Any other investment philosophy, constraints, or considerations we should know about?"
                value={investmentData.additionalInformation || ''}
                onChange={(e) => handleFieldChange('additionalInformation', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Education & Resources */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📚 Investment Education Preferences</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Investment Education Resources (select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Written reports',
                  'Video explanations',
                  'One-on-one meetings',
                  'Group seminars',
                  'Online courses',
                  'Podcasts',
                  'Books/articles',
                  'Interactive tools'
                ].map(resource => (
                  <div key={resource} className="flex items-center space-x-2">
                    <Checkbox
                      id={resource}
                      checked={(investmentData.educationResources || []).includes(resource)}
                      onCheckedChange={(checked) => handleArrayFieldChange('educationResources', resource, !!checked)}
                    />
                    <Label htmlFor={resource} className="text-sm">{resource}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="communicationFrequency">Investment Review Frequency</Label>
                <Select
                  value={investmentData.communicationFrequency || ''}
                  onValueChange={(value) => handleFieldChange('communicationFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How often to review investments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi_annually">Semi-annually</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="as_needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="decisionMakingStyle">Investment Decision Making</Label>
                <Select
                  value={investmentData.decisionMakingStyle || ''}
                  onValueChange={(value) => handleFieldChange('decisionMakingStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Decision making approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delegate_completely">Delegate completely</SelectItem>
                    <SelectItem value="collaborate">Collaborate on decisions</SelectItem>
                    <SelectItem value="final_approval">Want final approval</SelectItem>
                    <SelectItem value="full_control">Want full control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Investment Philosophy Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Diversification:</strong> Don't put all eggs in one basket - spread risk across assets</li>
            <li>• <strong>Time horizon:</strong> Longer timelines allow for more growth-oriented strategies</li>
            <li>• <strong>Cost matters:</strong> Lower expense ratios compound to significant savings over time</li>
            <li>• <strong>Stay consistent:</strong> Regular investing and rebalancing beats market timing</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}