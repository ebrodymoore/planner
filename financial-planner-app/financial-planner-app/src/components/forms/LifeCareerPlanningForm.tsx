'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { LifeCareer } from '@/types/financial';

interface LifeCareerPlanningFormProps {
  data?: LifeCareer;
  onUpdate: (data: LifeCareer) => void;
  onFieldUpdate: (field: keyof LifeCareer, value: any) => void;
}

export default function LifeCareerPlanningForm({ data, onUpdate, onFieldUpdate }: LifeCareerPlanningFormProps) {
  const lifeCareerData = data || {} as LifeCareer;

  const handleFieldChange = (field: keyof LifeCareer, value: any) => {
    const updatedData = {
      ...lifeCareerData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  const handleArrayFieldChange = (field: keyof LifeCareer, value: string, isChecked: boolean) => {
    const currentArray = (lifeCareerData[field] as string[]) || [];
    const updatedArray = isChecked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFieldChange(field, updatedArray);
  };

  return (
    <div className="space-y-6">
      {/* Career Development */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🚀 Career Development</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentCareerSatisfaction">Current Career Satisfaction</Label>
              <Select
                value={lifeCareerData.currentCareerSatisfaction || ''}
                onValueChange={(value) => handleFieldChange('currentCareerSatisfaction', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How satisfied are you with your career?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_satisfied">Very satisfied</SelectItem>
                  <SelectItem value="satisfied">Satisfied</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="dissatisfied">Dissatisfied</SelectItem>
                  <SelectItem value="very_dissatisfied">Very dissatisfied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedIncomeGrowthRate">Expected Annual Income Growth</Label>
              <Input
                id="expectedIncomeGrowthRate"
                type="number"
                placeholder="3"
                value={lifeCareerData.expectedIncomeGrowthRate || ''}
                onChange={(e) => handleFieldChange('expectedIncomeGrowthRate', parseFloat(e.target.value) || 0)}
                max="20"
              />
              <p className="text-xs text-gray-500">Percentage increase per year</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotionTimeline">Next Promotion Timeline</Label>
              <Select
                value={lifeCareerData.promotionTimeline || ''}
                onValueChange={(value) => handleFieldChange('promotionTimeline', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="When do you expect next advancement?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="within_year">Within 1 year</SelectItem>
                  <SelectItem value="1_2_years">1-2 years</SelectItem>
                  <SelectItem value="2_5_years">2-5 years</SelectItem>
                  <SelectItem value="5_plus_years">5+ years</SelectItem>
                  <SelectItem value="unlikely">Unlikely/at career peak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobSecurityLevel">Job Security Assessment</Label>
              <Select
                value={lifeCareerData.jobSecurityLevel || ''}
                onValueChange={(value) => handleFieldChange('jobSecurityLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How secure is your position?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_secure">Very secure</SelectItem>
                  <SelectItem value="secure">Secure</SelectItem>
                  <SelectItem value="somewhat_secure">Somewhat secure</SelectItem>
                  <SelectItem value="at_risk">At risk</SelectItem>
                  <SelectItem value="very_at_risk">Very at risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industryOutlook">Industry Outlook</Label>
              <Select
                value={lifeCareerData.industryOutlook || ''}
                onValueChange={(value) => handleFieldChange('industryOutlook', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How is your industry trending?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="growing_rapidly">Growing rapidly</SelectItem>
                  <SelectItem value="growing_steadily">Growing steadily</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="declining">Declining</SelectItem>
                  <SelectItem value="disrupted">Being disrupted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillsDevelopment">Skills Development Priority</Label>
              <Select
                value={lifeCareerData.skillsDevelopment || ''}
                onValueChange={(value) => handleFieldChange('skillsDevelopment', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What skills are you developing?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical_skills">Technical skills</SelectItem>
                  <SelectItem value="leadership_skills">Leadership/management</SelectItem>
                  <SelectItem value="soft_skills">Communication/soft skills</SelectItem>
                  <SelectItem value="industry_knowledge">Industry-specific knowledge</SelectItem>
                  <SelectItem value="new_field">Skills for new field</SelectItem>
                  <SelectItem value="minimal">Minimal development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="careerGoals">Career Goals (Next 5-10 Years)</Label>
            <Textarea
              id="careerGoals"
              placeholder="Describe your career aspirations, desired roles, income targets, etc."
              value={lifeCareerData.careerGoals || ''}
              onChange={(e) => handleFieldChange('careerGoals', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Family Planning */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">👨‍👩‍👧‍👦 Family Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            <div className="space-y-2">
              <Label htmlFor="plannedChildren">Additional Children Planned</Label>
              <Select
                value={lifeCareerData.plannedChildren || ''}
                onValueChange={(value) => handleFieldChange('plannedChildren', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Planning for more children?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No additional children</SelectItem>
                  <SelectItem value="1">1 more child</SelectItem>
                  <SelectItem value="2">2 more children</SelectItem>
                  <SelectItem value="3_plus">3+ more children</SelectItem>
                  <SelectItem value="unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="childcareStrategy">Childcare Strategy</Label>
              <Select
                value={lifeCareerData.childcareStrategy || ''}
                onValueChange={(value) => handleFieldChange('childcareStrategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you handle childcare?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daycare_full_time">Daycare/full-time care</SelectItem>
                  <SelectItem value="nanny_babysitter">Nanny/babysitter</SelectItem>
                  <SelectItem value="family_care">Family member care</SelectItem>
                  <SelectItem value="parent_stays_home">Parent stays home</SelectItem>
                  <SelectItem value="mixed_approach">Mixed approach</SelectItem>
                  <SelectItem value="not_applicable">Not applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="elderCareResponsibilities">Elder Care Responsibilities</Label>
              <Select
                value={lifeCareerData.elderCareResponsibilities || ''}
                onValueChange={(value) => handleFieldChange('elderCareResponsibilities', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Caring for aging parents?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none_currently">None currently</SelectItem>
                  <SelectItem value="minimal">Minimal support</SelectItem>
                  <SelectItem value="moderate">Moderate support</SelectItem>
                  <SelectItem value="significant">Significant support</SelectItem>
                  <SelectItem value="full_time">Full-time care</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyFinancialSupport">Family Financial Support</Label>
              <Select
                value={lifeCareerData.familyFinancialSupport || ''}
                onValueChange={(value) => handleFieldChange('familyFinancialSupport', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Do you support other family members?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No support provided</SelectItem>
                  <SelectItem value="occasional">Occasional support</SelectItem>
                  <SelectItem value="regular_minor">Regular minor support</SelectItem>
                  <SelectItem value="regular_significant">Regular significant support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Major Life Events */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🎯 Major Life Events Planning</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Anticipated Major Life Events (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Marriage/wedding',
                  'Having children',
                  'Buying a home',
                  'Career change',
                  'Starting a business',
                  'Returning to school',
                  'Geographic relocation',
                  'Retirement (early)',
                  'Caring for parents',
                  'Divorce/separation',
                  'Inheritance expected',
                  'None anticipated'
                ].map(event => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={event}
                      checked={(lifeCareerData.anticipatedLifeEvents || []).includes(event)}
                      onCheckedChange={(checked) => handleArrayFieldChange('anticipatedLifeEvents', event, !!checked)}
                    />
                    <Label htmlFor={event} className="text-sm">{event}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeOwnershipPlans">Home Ownership Plans</Label>
                <Select
                  value={lifeCareerData.homeOwnershipPlans || ''}
                  onValueChange={(value) => handleFieldChange('homeOwnershipPlans', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Home buying plans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="currently_own">Currently own</SelectItem>
                    <SelectItem value="buying_within_year">Planning to buy within 1 year</SelectItem>
                    <SelectItem value="buying_1_3_years">Planning to buy in 1-3 years</SelectItem>
                    <SelectItem value="buying_3_plus_years">Planning to buy in 3+ years</SelectItem>
                    <SelectItem value="prefer_renting">Prefer renting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="geographicMobilityWillingness">Geographic Mobility</Label>
                <Select
                  value={lifeCareerData.geographicMobilityWillingness || ''}
                  onValueChange={(value) => handleFieldChange('geographicMobilityWillingness', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Willingness to relocate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_willing">Very willing to relocate</SelectItem>
                    <SelectItem value="somewhat_willing">Somewhat willing</SelectItem>
                    <SelectItem value="limited_willingness">Limited willingness</SelectItem>
                    <SelectItem value="not_willing">Not willing to relocate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entrepreneurialInterests">Entrepreneurial Interests</Label>
                <Select
                  value={lifeCareerData.entrepreneurialInterests || ''}
                  onValueChange={(value) => handleFieldChange('entrepreneurialInterests', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Interest in starting a business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actively_planning">Actively planning</SelectItem>
                    <SelectItem value="strongly_interested">Strongly interested</SelectItem>
                    <SelectItem value="somewhat_interested">Somewhat interested</SelectItem>
                    <SelectItem value="not_interested">Not interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="educationalGoals">Educational Goals</Label>
                <Select
                  value={lifeCareerData.educationalGoals || ''}
                  onValueChange={(value) => handleFieldChange('educationalGoals', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Further education plans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="graduate_degree">Graduate degree</SelectItem>
                    <SelectItem value="professional_certification">Professional certification</SelectItem>
                    <SelectItem value="skills_training">Skills training</SelectItem>
                    <SelectItem value="no_plans">No current plans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retirement Planning */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏖️ Retirement Vision</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="retirementLocation">Retirement Location</Label>
              <Select
                value={lifeCareerData.retirementLocation || ''}
                onValueChange={(value) => handleFieldChange('retirementLocation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Where do you want to retire?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_location">Current location</SelectItem>
                  <SelectItem value="different_state">Different state</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="multiple_homes">Multiple homes</SelectItem>
                  <SelectItem value="undecided">Undecided</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirementLifestyle">Retirement Lifestyle</Label>
              <Select
                value={lifeCareerData.retirementLifestyle || ''}
                onValueChange={(value) => handleFieldChange('retirementLifestyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Desired retirement lifestyle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modest">Modest/simple lifestyle</SelectItem>
                  <SelectItem value="comfortable">Comfortable lifestyle</SelectItem>
                  <SelectItem value="luxurious">Luxurious lifestyle</SelectItem>
                  <SelectItem value="adventurous">Travel/adventure focused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirementActivities">Retirement Activities Priority</Label>
              <Select
                value={lifeCareerData.retirementActivities || ''}
                onValueChange={(value) => handleFieldChange('retirementActivities', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What's most important in retirement?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="family">Family time</SelectItem>
                  <SelectItem value="hobbies">Hobbies/interests</SelectItem>
                  <SelectItem value="volunteering">Volunteering</SelectItem>
                  <SelectItem value="part_time_work">Part-time work</SelectItem>
                  <SelectItem value="health_fitness">Health/fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legacyGoals">Legacy Goals</Label>
            <Textarea
              id="legacyGoals"
              placeholder="What kind of legacy do you want to leave? Financial, values, impact, etc."
              value={lifeCareerData.legacyGoals || ''}
              onChange={(e) => handleFieldChange('legacyGoals', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Health & Longevity */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏥 Health & Longevity Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthStatus">Current Health Status</Label>
              <Select
                value={lifeCareerData.healthStatus || ''}
                onValueChange={(value) => handleFieldChange('healthStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Current health assessment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very_good">Very good</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyHealthHistory">Family Health History</Label>
              <Select
                value={lifeCareerData.familyHealthHistory || ''}
                onValueChange={(value) => handleFieldChange('familyHealthHistory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Family health history" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Generally excellent</SelectItem>
                  <SelectItem value="good">Generally good</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="concerning">Some concerning conditions</SelectItem>
                  <SelectItem value="poor">Generally poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeExpectancyPlanning">Life Expectancy Planning</Label>
              <Select
                value={lifeCareerData.lifeExpectancyPlanning || ''}
                onValueChange={(value) => handleFieldChange('lifeExpectancyPlanning', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Planning life expectancy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="age_85">Plan to age 85</SelectItem>
                  <SelectItem value="age_90">Plan to age 90</SelectItem>
                  <SelectItem value="age_95">Plan to age 95</SelectItem>
                  <SelectItem value="age_100">Plan to age 100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthcareCostConcerns">Healthcare Cost Concerns</Label>
              <Select
                value={lifeCareerData.healthcareCostConcerns || ''}
                onValueChange={(value) => handleFieldChange('healthcareCostConcerns', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Level of concern about healthcare costs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_concerned">Very concerned</SelectItem>
                  <SelectItem value="somewhat_concerned">Somewhat concerned</SelectItem>
                  <SelectItem value="not_very_concerned">Not very concerned</SelectItem>
                  <SelectItem value="not_concerned">Not concerned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life Philosophy & Values */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💭 Life Philosophy & Values</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workLifeBalance">Work-Life Balance Priority</Label>
              <Select
                value={lifeCareerData.workLifeBalance || ''}
                onValueChange={(value) => handleFieldChange('workLifeBalance', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How important is work-life balance?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extremely_important">Extremely important</SelectItem>
                  <SelectItem value="very_important">Very important</SelectItem>
                  <SelectItem value="moderately_important">Moderately important</SelectItem>
                  <SelectItem value="not_very_important">Not very important</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalValues">Personal Values Priorities</Label>
              <Textarea
                id="personalValues"
                placeholder="What values are most important to you? (family, achievement, security, adventure, helping others, etc.)"
                value={lifeCareerData.personalValues || ''}
                onChange={(e) => handleFieldChange('personalValues', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeGoalsPriorities">Life Goals Beyond Finance</Label>
              <Textarea
                id="lifeGoalsPriorities"
                placeholder="What non-financial goals are most important to you?"
                value={lifeCareerData.lifeGoalsPriorities || ''}
                onChange={(e) => handleFieldChange('lifeGoalsPriorities', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Life Planning Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Align finances with values:</strong> Your money should support what matters most</li>
            <li>• <strong>Plan for flexibility:</strong> Life rarely goes exactly as planned</li>
            <li>• <strong>Review regularly:</strong> Life goals and priorities change over time</li>
            <li>• <strong>Consider all costs:</strong> Major life events often cost more than expected</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}