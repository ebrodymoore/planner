'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Behavioral } from '@/types/financial';

interface BehavioralAssessmentFormProps {
  data?: Behavioral;
  onUpdate: (data: Behavioral) => void;
  onFieldUpdate: (field: keyof Behavioral, value: any) => void;
}

export default function BehavioralAssessmentForm({ data, onUpdate, onFieldUpdate }: BehavioralAssessmentFormProps) {
  const behavioralData = data || {} as Behavioral;

  const handleFieldChange = (field: keyof Behavioral, value: any) => {
    const updatedData = {
      ...behavioralData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  const handleArrayFieldChange = (field: keyof Behavioral, value: string, isChecked: boolean) => {
    const currentArray = (behavioralData[field] as string[]) || [];
    const updatedArray = isChecked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFieldChange(field, updatedArray);
  };

  return (
    <div className="space-y-6">
      {/* Money Personality */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🧠 Money Personality</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moneyPersonality">Primary Money Personality</Label>
              <Select
                value={behavioralData.moneyPersonality || ''}
                onValueChange={(value) => handleFieldChange('moneyPersonality', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your money personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saver">Saver - Prioritize saving over spending</SelectItem>
                  <SelectItem value="spender">Spender - Enjoy spending and lifestyle</SelectItem>
                  <SelectItem value="investor">Investor - Focus on growing wealth</SelectItem>
                  <SelectItem value="avoider">Avoider - Prefer not to think about money</SelectItem>
                  <SelectItem value="worrier">Worrier - Anxious about money matters</SelectItem>
                  <SelectItem value="mixed">Mixed - Combination of types</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spendingTriggers">Spending Triggers</Label>
              <Select
                value={behavioralData.spendingTriggers || ''}
                onValueChange={(value) => handleFieldChange('spendingTriggers', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What triggers spending?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stress">Stress/emotions</SelectItem>
                  <SelectItem value="social">Social situations</SelectItem>
                  <SelectItem value="deals">Sales and deals</SelectItem>
                  <SelectItem value="convenience">Convenience</SelectItem>
                  <SelectItem value="status">Status/image</SelectItem>
                  <SelectItem value="minimal">Very disciplined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialDecisionMaking">Financial Decision Making</Label>
              <Select
                value={behavioralData.financialDecisionMaking || ''}
                onValueChange={(value) => handleFieldChange('financialDecisionMaking', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you make financial decisions?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research_heavy">Extensive research</SelectItem>
                  <SelectItem value="quick_intuitive">Quick/intuitive</SelectItem>
                  <SelectItem value="seek_advice">Seek advice from others</SelectItem>
                  <SelectItem value="procrastinate">Tend to procrastinate</SelectItem>
                  <SelectItem value="emotional">Emotional decisions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moneyDiscussion">Money Discussions</Label>
              <Select
                value={behavioralData.moneyDiscussion || ''}
                onValueChange={(value) => handleFieldChange('moneyDiscussion', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Comfort discussing money" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_comfortable">Very comfortable</SelectItem>
                  <SelectItem value="somewhat_comfortable">Somewhat comfortable</SelectItem>
                  <SelectItem value="uncomfortable">Uncomfortable</SelectItem>
                  <SelectItem value="avoid">Avoid discussing money</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Habits */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💳 Financial Habits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetingApproach">Budgeting Approach</Label>
              <Select
                value={behavioralData.budgetingApproach || ''}
                onValueChange={(value) => handleFieldChange('budgetingApproach', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you budget?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detailed_tracking">Detailed tracking/spreadsheets</SelectItem>
                  <SelectItem value="budgeting_apps">Budgeting apps</SelectItem>
                  <SelectItem value="rough_mental">Rough mental budget</SelectItem>
                  <SelectItem value="spending_limits">Set spending limits</SelectItem>
                  <SelectItem value="no_budget">No formal budget</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billPaymentStyle">Bill Payment Style</Label>
              <Select
                value={behavioralData.billPaymentStyle || ''}
                onValueChange={(value) => handleFieldChange('billPaymentStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you pay bills?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autopay_all">Autopay everything</SelectItem>
                  <SelectItem value="autopay_some">Autopay some, manual others</SelectItem>
                  <SelectItem value="manual_scheduled">Manual but scheduled</SelectItem>
                  <SelectItem value="manual_reactive">Manual when reminded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialCheckFrequency">Account Check Frequency</Label>
              <Select
                value={behavioralData.financialCheckFrequency || ''}
                onValueChange={(value) => handleFieldChange('financialCheckFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How often check accounts?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impulsePurchases">Impulse Purchase Tendency</Label>
              <Select
                value={behavioralData.impulsePurchases || ''}
                onValueChange={(value) => handleFieldChange('impulsePurchases', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Impulse buying tendency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_high">Very high - buy first, regret later</SelectItem>
                  <SelectItem value="moderate">Moderate - occasionally impulsive</SelectItem>
                  <SelectItem value="low">Low - usually think before buying</SelectItem>
                  <SelectItem value="very_low">Very low - always planned purchases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Psychology */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📊 Investment Psychology</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marketVolatilityReaction">Market Volatility Reaction</Label>
              <Select
                value={behavioralData.marketVolatilityReaction || ''}
                onValueChange={(value) => handleFieldChange('marketVolatilityReaction', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you react to market drops?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy_more">See opportunity, buy more</SelectItem>
                  <SelectItem value="stay_course">Stay the course</SelectItem>
                  <SelectItem value="worry_hold">Worry but hold</SelectItem>
                  <SelectItem value="sell_some">Sell some positions</SelectItem>
                  <SelectItem value="sell_all">Sell everything</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentResearchHabits">Investment Research</Label>
              <Select
                value={behavioralData.investmentResearchHabits || ''}
                onValueChange={(value) => handleFieldChange('investmentResearchHabits', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you research investments?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extensive_research">Extensive research</SelectItem>
                  <SelectItem value="basic_research">Basic research</SelectItem>
                  <SelectItem value="rely_advisors">Rely on advisors</SelectItem>
                  <SelectItem value="follow_trends">Follow trends/tips</SelectItem>
                  <SelectItem value="no_research">Little to no research</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lossVsGainSensitivity">Loss vs Gain Sensitivity</Label>
              <Select
                value={behavioralData.lossVsGainSensitivity || ''}
                onValueChange={(value) => handleFieldChange('lossVsGainSensitivity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What affects you more?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="losses_much_more">Losses affect me much more</SelectItem>
                  <SelectItem value="losses_somewhat_more">Losses affect me somewhat more</SelectItem>
                  <SelectItem value="about_equal">About equal</SelectItem>
                  <SelectItem value="gains_more_exciting">Gains more exciting than losses hurt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentTimeHorizonThinking">Time Horizon Thinking</Label>
              <Select
                value={behavioralData.investmentTimeHorizonThinking || ''}
                onValueChange={(value) => handleFieldChange('investmentTimeHorizonThinking', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Investment time perspective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_long_term">Very long-term (20+ years)</SelectItem>
                  <SelectItem value="long_term">Long-term (10-20 years)</SelectItem>
                  <SelectItem value="medium_term">Medium-term (5-10 years)</SelectItem>
                  <SelectItem value="short_term">Short-term (1-5 years)</SelectItem>
                  <SelectItem value="very_short_term">Very short-term (under 1 year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial History & Learning */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📚 Financial History & Learning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="financialEducationBackground">Financial Education</Label>
              <Select
                value={behavioralData.financialEducationBackground || ''}
                onValueChange={(value) => handleFieldChange('financialEducationBackground', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Financial education background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal_extensive">Formal education (finance/economics)</SelectItem>
                  <SelectItem value="self_taught_extensive">Self-taught, extensive reading</SelectItem>
                  <SelectItem value="self_taught_basic">Self-taught, basic knowledge</SelectItem>
                  <SelectItem value="minimal">Minimal financial education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="majorFinancialMistakes">Past Financial Mistakes</Label>
              <Select
                value={behavioralData.majorFinancialMistakes || ''}
                onValueChange={(value) => handleFieldChange('majorFinancialMistakes', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Past financial mistakes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investment_losses">Major investment losses</SelectItem>
                  <SelectItem value="debt_problems">Credit/debt problems</SelectItem>
                  <SelectItem value="missed_opportunities">Missed investment opportunities</SelectItem>
                  <SelectItem value="overspending">Chronic overspending</SelectItem>
                  <SelectItem value="minimal">Few major mistakes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialRoleModels">Financial Role Models</Label>
              <Select
                value={behavioralData.financialRoleModels || ''}
                onValueChange={(value) => handleFieldChange('financialRoleModels', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Who influences your financial thinking?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parents_positive">Parents (positive influence)</SelectItem>
                  <SelectItem value="parents_negative">Parents (learned what not to do)</SelectItem>
                  <SelectItem value="successful_investors">Successful investors (Buffett, etc.)</SelectItem>
                  <SelectItem value="financial_advisors">Financial advisors/professionals</SelectItem>
                  <SelectItem value="self_developed">Self-developed philosophy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moneyStressLevel">Money-Related Stress</Label>
              <Select
                value={behavioralData.moneyStressLevel || ''}
                onValueChange={(value) => handleFieldChange('moneyStressLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Current financial stress level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_high">Very high - keeps me awake</SelectItem>
                  <SelectItem value="high">High - frequent worry</SelectItem>
                  <SelectItem value="moderate">Moderate - occasional concern</SelectItem>
                  <SelectItem value="low">Low - generally confident</SelectItem>
                  <SelectItem value="very_low">Very low - rarely think about it</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="financialGoalMotivation">Primary Financial Motivation</Label>
            <Textarea
              id="financialGoalMotivation"
              placeholder="What drives your financial decisions? Security, freedom, legacy, status, etc."
              value={behavioralData.financialGoalMotivation || ''}
              onChange={(e) => handleFieldChange('financialGoalMotivation', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Biases */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎯 Behavioral Tendencies</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Which tendencies do you recognize in yourself? (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Overconfidence in investment picks',
                  'Following the crowd/herd mentality',
                  'Holding losing investments too long',
                  'Selling winning investments too early',
                  'Analysis paralysis',
                  'FOMO (fear of missing out)',
                  'Anchoring to recent performance',
                  'Confirmation bias'
                ].map(tendency => (
                  <div key={tendency} className="flex items-center space-x-2">
                    <Checkbox
                      id={tendency}
                      checked={(behavioralData.cognitiveBiases || []).includes(tendency)}
                      onCheckedChange={(checked) => handleArrayFieldChange('cognitiveBiases', tendency, !!checked)}
                    />
                    <Label htmlFor={tendency} className="text-sm">{tendency}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="changeAdaptability">Adaptability to Plan Changes</Label>
                <Select
                  value={behavioralData.changeAdaptability || ''}
                  onValueChange={(value) => handleFieldChange('changeAdaptability', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How do you handle plan changes?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_adaptable">Very adaptable</SelectItem>
                    <SelectItem value="somewhat_adaptable">Somewhat adaptable</SelectItem>
                    <SelectItem value="prefer_consistency">Prefer consistency</SelectItem>
                    <SelectItem value="resistant_change">Resistant to change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procrastinationTendency">Financial Procrastination</Label>
                <Select
                  value={behavioralData.procrastinationTendency || ''}
                  onValueChange={(value) => handleFieldChange('procrastinationTendency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tendency to delay financial tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rarely">Rarely procrastinate</SelectItem>
                    <SelectItem value="sometimes">Sometimes delay tasks</SelectItem>
                    <SelectItem value="often">Often procrastinate</SelectItem>
                    <SelectItem value="chronic">Chronic procrastinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Behavior Summary */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📝 Additional Insights</h3>
          
          <div className="space-y-2">
            <Label htmlFor="financialPersonalityInsights">Additional Financial Personality Insights</Label>
            <Textarea
              id="financialPersonalityInsights"
              placeholder="Any other patterns, habits, or insights about your relationship with money?"
              value={behavioralData.financialPersonalityInsights || ''}
              onChange={(e) => handleFieldChange('financialPersonalityInsights', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Behavioral Finance Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Self-awareness:</strong> Recognizing biases is the first step to overcoming them</li>
            <li>• <strong>Systematic approach:</strong> Automated investing reduces emotional decisions</li>
            <li>• <strong>Written plans:</strong> Having rules helps avoid impulsive choices</li>
            <li>• <strong>Regular review:</strong> Periodic check-ins keep you on track with goals</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}