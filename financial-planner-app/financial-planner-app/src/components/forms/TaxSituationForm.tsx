'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { TaxSituation } from '@/types/financial';

interface TaxSituationFormProps {
  data?: TaxSituation;
  onUpdate: (data: TaxSituation) => void;
  onFieldUpdate: (field: keyof TaxSituation, value: any) => void;
}

export default function TaxSituationForm({ data, onUpdate, onFieldUpdate }: TaxSituationFormProps) {
  const taxData = data || {} as TaxSituation;

  const handleFieldChange = (field: keyof TaxSituation, value: any) => {
    const updatedData = {
      ...taxData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  const handleArrayFieldChange = (field: keyof TaxSituation, value: string, isChecked: boolean) => {
    const currentArray = (taxData[field] as string[]) || [];
    const updatedArray = isChecked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFieldChange(field, updatedArray);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="space-y-6">
      {/* Current Tax Situation */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📊 Current Tax Situation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filingStatus">Filing Status</Label>
              <Select
                value={taxData.filingStatus || ''}
                onValueChange={(value) => handleFieldChange('filingStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select filing status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
                  <SelectItem value="married_filing_separately">Married Filing Separately</SelectItem>
                  <SelectItem value="head_of_household">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentFederalTaxBracket">Current Federal Tax Bracket</Label>
              <Select
                value={taxData.currentFederalTaxBracket || ''}
                onValueChange={(value) => handleFieldChange('currentFederalTaxBracket', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax bracket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10%">10%</SelectItem>
                  <SelectItem value="12%">12%</SelectItem>
                  <SelectItem value="22%">22%</SelectItem>
                  <SelectItem value="24%">24%</SelectItem>
                  <SelectItem value="32%">32%</SelectItem>
                  <SelectItem value="35%">35%</SelectItem>
                  <SelectItem value="37%">37%</SelectItem>
                  <SelectItem value="dont_know">Don't Know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustedGrossIncome2023">2023 Adjusted Gross Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="adjustedGrossIncome2023"
                  type="number"
                  placeholder="85000"
                  value={taxData.adjustedGrossIncome2023 || ''}
                  onChange={(e) => handleFieldChange('adjustedGrossIncome2023', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalTaxLiability2023">2023 Total Tax Liability</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="totalTaxLiability2023"
                  type="number"
                  placeholder="12000"
                  value={taxData.totalTaxLiability2023 || ''}
                  onChange={(e) => handleFieldChange('totalTaxLiability2023', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Actual taxes owed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundOrOwed2023">2023 Refund/Amount Owed</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="refundOrOwed2023"
                  type="number"
                  placeholder="1500"
                  value={taxData.refundOrOwed2023 || ''}
                  onChange={(e) => handleFieldChange('refundOrOwed2023', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Positive for refund, negative if owed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stateIncomeTaxRate">State Income Tax Rate (%)</Label>
              <Input
                id="stateIncomeTaxRate"
                type="number"
                step="0.1"
                placeholder="0"
                value={taxData.stateIncomeTaxRate || ''}
                onChange={(e) => handleFieldChange('stateIncomeTaxRate', parseFloat(e.target.value) || 0)}
                max="15"
              />
              <p className="text-xs text-gray-500">Tennessee is 0%</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marginalVsEffectiveUnderstanding">Tax Rate Understanding</Label>
            <Select
              value={taxData.marginalVsEffectiveUnderstanding || ''}
              onValueChange={(value) => handleFieldChange('marginalVsEffectiveUnderstanding', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Do you understand the difference between marginal and effective tax rates?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="understand">Understand difference</SelectItem>
                <SelectItem value="somewhat">Somewhat understand</SelectItem>
                <SelectItem value="dont_understand">Don't understand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tax Withholding */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💰 Tax Withholding & Payments</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="w4AllowancesStatus">W-4 Current Election</Label>
              <Input
                id="w4AllowancesStatus"
                type="text"
                placeholder="e.g., Married, 2 allowances"
                value={taxData.w4AllowancesStatus || ''}
                onChange={(e) => handleFieldChange('w4AllowancesStatus', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalWithholding">Additional Withholding</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="additionalWithholding"
                  type="number"
                  placeholder="0"
                  value={taxData.additionalWithholding || ''}
                  onChange={(e) => handleFieldChange('additionalWithholding', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Extra per paycheck</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarterlyEstimatedPayments">Quarterly Estimated Payments</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="quarterlyEstimatedPayments"
                  type="number"
                  placeholder="0"
                  value={taxData.quarterlyEstimatedPayments || ''}
                  onChange={(e) => handleFieldChange('quarterlyEstimatedPayments', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">If self-employed/contractor</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withholdingAdequacy">Withholding Adequacy</Label>
              <Select
                value={taxData.withholdingAdequacy || ''}
                onValueChange={(value) => handleFieldChange('withholdingAdequacy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Typical tax outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large_refund">Get large refund</SelectItem>
                  <SelectItem value="break_even">About break even</SelectItem>
                  <SelectItem value="owe_money">Owe money</SelectItem>
                  <SelectItem value="dont_know">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax-Advantaged Accounts */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏦 Tax-Advantaged Account Strategy</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Tax-Advantaged Accounts (select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['401k', 'Traditional IRA', 'Roth IRA', 'HSA', '529 Plan', 'None'].map(account => (
                  <div key={account} className="flex items-center space-x-2">
                    <Checkbox
                      id={account}
                      checked={(taxData.currentTaxAdvantagedAccounts || []).includes(account)}
                      onCheckedChange={(checked) => handleArrayFieldChange('currentTaxAdvantagedAccounts', account, !!checked)}
                    />
                    <Label htmlFor={account} className="text-sm">{account}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rothVsTraditionalStrategy">Roth vs Traditional Strategy</Label>
                <Select
                  value={taxData.rothVsTraditionalStrategy || ''}
                  onValueChange={(value) => handleFieldChange('rothVsTraditionalStrategy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Account type preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_traditional">All traditional</SelectItem>
                    <SelectItem value="all_roth">All Roth</SelectItem>
                    <SelectItem value="mix_strategy">Mix based on strategy</SelectItem>
                    <SelectItem value="mix_no_strategy">Mix with no strategy</SelectItem>
                    <SelectItem value="unsure">Unsure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backdoorRothExperience">Backdoor Roth IRA Experience</Label>
                <Select
                  value={taxData.backdoorRothExperience || ''}
                  onValueChange={(value) => handleFieldChange('backdoorRothExperience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Backdoor Roth experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="use_regularly">Use regularly</SelectItem>
                    <SelectItem value="used_once">Used once</SelectItem>
                    <SelectItem value="interested">Never but interested</SelectItem>
                    <SelectItem value="not_interested">Never and not interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="megaBackdoorRothAvailable">Mega Backdoor Roth Available</Label>
                <Select
                  value={taxData.megaBackdoorRothAvailable || ''}
                  onValueChange={(value) => handleFieldChange('megaBackdoorRothAvailable', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mega backdoor Roth availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes_using">Yes and using</SelectItem>
                    <SelectItem value="yes_not_using">Yes but not using</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="dont_know">Don't know what this is</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Tax Strategies */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🧠 Advanced Tax Strategies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxLossHarvesting">Tax Loss Harvesting</Label>
              <Select
                value={taxData.taxLossHarvesting || ''}
                onValueChange={(value) => handleFieldChange('taxLossHarvesting', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tax loss harvesting experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="use_regularly">Use regularly</SelectItem>
                  <SelectItem value="occasionally">Occasionally use</SelectItem>
                  <SelectItem value="interested">Never used but interested</SelectItem>
                  <SelectItem value="never_used">Never used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="charitableGivingStrategy">Charitable Giving Tax Strategy</Label>
              <Select
                value={taxData.charitableGivingStrategy || ''}
                onValueChange={(value) => handleFieldChange('charitableGivingStrategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Charitable giving approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash_donations">Cash donations</SelectItem>
                  <SelectItem value="appreciated_assets">Donate appreciated assets</SelectItem>
                  <SelectItem value="bunching_strategies">Bunching strategies</SelectItem>
                  <SelectItem value="no_giving">No charitable giving</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemizedVsStandard">Itemized vs Standard Deduction</Label>
              <Select
                value={taxData.itemizedVsStandard || ''}
                onValueChange={(value) => handleFieldChange('itemizedVsStandard', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Deduction approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always_itemize">Always itemize</SelectItem>
                  <SelectItem value="sometimes_itemize">Sometimes itemize</SelectItem>
                  <SelectItem value="always_standard">Always standard</SelectItem>
                  <SelectItem value="dont_know">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="futureTaxRateExpectations">Future Tax Rate Expectations</Label>
              <Select
                value={taxData.futureTaxRateExpectations || ''}
                onValueChange={(value) => handleFieldChange('futureTaxRateExpectations', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Expected future tax rates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="will_be_higher">Will be higher</SelectItem>
                  <SelectItem value="same">Same</SelectItem>
                  <SelectItem value="lower">Lower</SelectItem>
                  <SelectItem value="dont_know">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDeductions">Business Deductions</Label>
            <Textarea
              id="businessDeductions"
              placeholder="If self-employed or have side business, describe deductions you take"
              value={taxData.businessDeductions || ''}
              onChange={(e) => handleFieldChange('businessDeductions', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Side Income & Additional Complexity */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💼 Side Income & Tax Complexity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income1099">1099 Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="income1099"
                  type="number"
                  placeholder="0"
                  value={taxData.income1099 || ''}
                  onChange={(e) => handleFieldChange('income1099', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Consulting, freelance, etc.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentalPropertyIncome">Rental Property Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="rentalPropertyIncome"
                  type="number"
                  placeholder="0"
                  value={taxData.rentalPropertyIncome || ''}
                  onChange={(e) => handleFieldChange('rentalPropertyIncome', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Net annual rental income</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentIncomeAmount">Investment Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="investmentIncomeAmount"
                  type="number"
                  placeholder="0"
                  value={taxData.investmentIncomeAmount || ''}
                  onChange={(e) => handleFieldChange('investmentIncomeAmount', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Dividends, interest, capital gains</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cryptoActivities">Cryptocurrency Activities</Label>
              <Select
                value={taxData.cryptoActivities || ''}
                onValueChange={(value) => handleFieldChange('cryptoActivities', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Crypto tax situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_activity">No activity</SelectItem>
                  <SelectItem value="occasional_trading">Occasional trading</SelectItem>
                  <SelectItem value="regular_trading">Regular trading</SelectItem>
                  <SelectItem value="mining_defi">Mining/DeFi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stateTaxConsiderations">State Tax Considerations</Label>
            <Textarea
              id="stateTaxConsiderations"
              placeholder="Multi-state issues, future relocation plans, state-specific considerations"
              value={taxData.stateTaxConsiderations || ''}
              onChange={(e) => handleFieldChange('stateTaxConsiderations', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Planning */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📋 Tax Planning Approach</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxProfessionalUsed">Tax Professional Used</Label>
              <Select
                value={taxData.taxProfessionalUsed || ''}
                onValueChange={(value) => handleFieldChange('taxProfessionalUsed', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tax preparation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpa">CPA</SelectItem>
                  <SelectItem value="ea">Enrolled Agent</SelectItem>
                  <SelectItem value="software_only">Software only</SelectItem>
                  <SelectItem value="family_friend">Family/friend</SelectItem>
                  <SelectItem value="dont_file">Don't file</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxPlanningVsPreparation">Tax Planning vs Preparation</Label>
              <Select
                value={taxData.taxPlanningVsPreparation || ''}
                onValueChange={(value) => handleFieldChange('taxPlanningVsPreparation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Planning approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="only_prepare">Only prepare returns</SelectItem>
                  <SelectItem value="some_planning">Some planning</SelectItem>
                  <SelectItem value="regular_planning">Regular planning</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive planning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxLawChangesImpact">Tax Law Changes Impact</Label>
            <Textarea
              id="taxLawChangesImpact"
              placeholder="How do recent tax law changes affect you? Any specific concerns or opportunities?"
              value={taxData.taxLawChangesImpact || ''}
              onChange={(e) => handleFieldChange('taxLawChangesImpact', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Tax Planning Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Tax planning vs preparation:</strong> Planning happens year-round, not just at tax time</li>
            <li>• <strong>Marginal vs effective:</strong> Your marginal rate is what you pay on the next dollar earned</li>
            <li>• <strong>Tax diversification:</strong> Having both traditional and Roth accounts provides flexibility</li>
            <li>• <strong>Withholding optimization:</strong> Large refunds mean you're giving the IRS an interest-free loan</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}