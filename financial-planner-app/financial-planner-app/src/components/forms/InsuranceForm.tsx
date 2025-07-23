'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Insurance } from '@/types/financial';

interface InsuranceFormProps {
  data?: Insurance;
  onUpdate: (data: Insurance) => void;
  onFieldUpdate: (field: keyof Insurance, value: any) => void;
}

export default function InsuranceForm({ data, onUpdate, onFieldUpdate }: InsuranceFormProps) {
  const insuranceData = data || {} as Insurance;

  const handleFieldChange = (field: keyof Insurance, value: any) => {
    const updatedData = {
      ...insuranceData,
      [field]: value
    };
    onUpdate(updatedData);
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
      {/* Health Insurance */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏥 Health Insurance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthInsuranceType">Health Insurance Type</Label>
              <Select
                value={insuranceData.healthInsuranceType || ''}
                onValueChange={(value) => handleFieldChange('healthInsuranceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employer_hdhp">Employer HDHP</SelectItem>
                  <SelectItem value="employer_ppo">Employer PPO</SelectItem>
                  <SelectItem value="employer_hmo">Employer HMO</SelectItem>
                  <SelectItem value="aca_marketplace">ACA Marketplace</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="medicare">Medicare</SelectItem>
                  <SelectItem value="medicaid">Medicaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthPremiumCost">Monthly Premium Cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="healthPremiumCost"
                  type="number"
                  placeholder="350"
                  value={insuranceData.healthPremiumCost || ''}
                  onChange={(e) => handleFieldChange('healthPremiumCost', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Your portion only</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualDeductible">Annual Deductible</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="annualDeductible"
                  type="number"
                  placeholder="2500"
                  value={insuranceData.annualDeductible || ''}
                  onChange={(e) => handleFieldChange('annualDeductible', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outOfPocketMax">Out-of-Pocket Maximum</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="outOfPocketMax"
                  type="number"
                  placeholder="8000"
                  value={insuranceData.outOfPocketMax || ''}
                  onChange={(e) => handleFieldChange('outOfPocketMax', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hsaEligible"
                checked={insuranceData.hsaEligible || false}
                onCheckedChange={(checked) => handleFieldChange('hsaEligible', checked)}
              />
              <Label htmlFor="hsaEligible">HSA Eligible</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="networkRestrictions">Network Restrictions</Label>
                <Select
                  value={insuranceData.networkRestrictions || ''}
                  onValueChange={(value) => handleFieldChange('networkRestrictions', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Network type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_restrictive">Very Restrictive</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="wide_network">Wide Network</SelectItem>
                    <SelectItem value="no_restrictions">No Restrictions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescriptionCoverage">Prescription Coverage</Label>
                <Select
                  value={insuranceData.prescriptionCoverage || ''}
                  onValueChange={(value) => handleFieldChange('prescriptionCoverage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Coverage quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life Insurance */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🛡️ Life Insurance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employerLifeInsurance">Employer Life Insurance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="employerLifeInsurance"
                  type="number"
                  placeholder="50000"
                  value={insuranceData.employerLifeInsurance || ''}
                  onChange={(e) => handleFieldChange('employerLifeInsurance', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Coverage amount</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privateLifeInsurance">Private Life Insurance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="privateLifeInsurance"
                  type="number"
                  placeholder="250000"
                  value={insuranceData.privateLifeInsurance || ''}
                  onChange={(e) => handleFieldChange('privateLifeInsurance', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">Outside of work coverage</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeInsuranceType">Life Insurance Type</Label>
              <Select
                value={insuranceData.lifeInsuranceType || ''}
                onValueChange={(value) => handleFieldChange('lifeInsuranceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Insurance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term">Term</SelectItem>
                  <SelectItem value="whole_life">Whole Life</SelectItem>
                  <SelectItem value="universal">Universal</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                  <SelectItem value="dont_know">Don't Know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaryUpdated">Beneficiaries Updated</Label>
              <Select
                value={insuranceData.beneficiaryUpdated || ''}
                onValueChange={(value) => handleFieldChange('beneficiaryUpdated', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="When last updated" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="within_year">Within last year</SelectItem>
                  <SelectItem value="1_2_years">1-2 years ago</SelectItem>
                  <SelectItem value="3_plus_years">3+ years ago</SelectItem>
                  <SelectItem value="never_set">Never set</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disability Insurance */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🦽 Disability Insurance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shortTermDisability">Short-term Disability</Label>
              <Select
                value={insuranceData.shortTermDisability || ''}
                onValueChange={(value) => handleFieldChange('shortTermDisability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="STD coverage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employer_provided">Employer Provided</SelectItem>
                  <SelectItem value="private_policy">Private Policy</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longTermDisability">Long-term Disability</Label>
              <Select
                value={insuranceData.longTermDisability || ''}
                onValueChange={(value) => handleFieldChange('longTermDisability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="LTD coverage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employer_provided">Employer Provided</SelectItem>
                  <SelectItem value="private_policy">Private Policy</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ltdCoveragePercentage">LTD Coverage Percentage</Label>
              <Input
                id="ltdCoveragePercentage"
                type="number"
                placeholder="60"
                value={insuranceData.ltdCoveragePercentage || ''}
                onChange={(e) => handleFieldChange('ltdCoveragePercentage', parseFloat(e.target.value) || 0)}
                max="100"
              />
              <p className="text-xs text-gray-500">% of income covered</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownVsAnyOccupation">Coverage Type</Label>
              <Select
                value={insuranceData.ownVsAnyOccupation || ''}
                onValueChange={(value) => handleFieldChange('ownVsAnyOccupation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Occupation coverage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="own_occupation">Own Occupation</SelectItem>
                  <SelectItem value="any_occupation">Any Occupation</SelectItem>
                  <SelectItem value="dont_know">Don't Know</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Insurance */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏠 Property Insurance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyInsuranceType">Property Insurance</Label>
              <Select
                value={insuranceData.propertyInsuranceType || ''}
                onValueChange={(value) => handleFieldChange('propertyInsuranceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Insurance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homeowners">Homeowners</SelectItem>
                  <SelectItem value="renters">Renters</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyInsurancePremium">Annual Premium</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="propertyInsurancePremium"
                  type="number"
                  placeholder="1200"
                  value={insuranceData.propertyInsurancePremium || ''}
                  onChange={(e) => handleFieldChange('propertyInsurancePremium', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="umbrellaPolicy"
                checked={insuranceData.umbrellaPolicy || false}
                onCheckedChange={(checked) => handleFieldChange('umbrellaPolicy', checked)}
              />
              <Label htmlFor="umbrellaPolicy">Umbrella liability policy</Label>
            </div>

            {insuranceData.umbrellaPolicy && (
              <div className="space-y-2">
                <Label htmlFor="umbrellaCoverageAmount">Umbrella Coverage Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="umbrellaCoverageAmount"
                    type="number"
                    placeholder="1000000"
                    value={insuranceData.umbrellaCoverageAmount || ''}
                    onChange={(e) => handleFieldChange('umbrellaCoverageAmount', parseFloat(e.target.value) || 0)}
                    className="pl-8"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Auto Insurance */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🚗 Auto Insurance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="autoInsurancePremium">Annual Premium</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="autoInsurancePremium"
                  type="number"
                  placeholder="1800"
                  value={insuranceData.autoInsurancePremium || ''}
                  onChange={(e) => handleFieldChange('autoInsurancePremium', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">All vehicles combined</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liabilityCoverage">Liability Coverage</Label>
              <Input
                id="liabilityCoverage"
                type="text"
                placeholder="100/300/100"
                value={insuranceData.liabilityCoverage || ''}
                onChange={(e) => handleFieldChange('liabilityCoverage', e.target.value)}
              />
              <p className="text-xs text-gray-500">e.g., 100/300/100</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comprehensiveDeductible">Comprehensive/Collision Deductible</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="comprehensiveDeductible"
                  type="number"
                  placeholder="500"
                  value={insuranceData.comprehensiveDeductible || ''}
                  onChange={(e) => handleFieldChange('comprehensiveDeductible', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uninsuredMotoristCoverage"
                  checked={insuranceData.uninsuredMotoristCoverage || false}
                  onCheckedChange={(checked) => handleFieldChange('uninsuredMotoristCoverage', checked)}
                />
                <Label htmlFor="uninsuredMotoristCoverage">Uninsured motorist coverage</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rentalCarCoverage"
                  checked={insuranceData.rentalCarCoverage || false}
                  onCheckedChange={(checked) => handleFieldChange('rentalCarCoverage', checked)}
                />
                <Label htmlFor="rentalCarCoverage">Rental car coverage</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Analysis */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📋 Insurance Analysis</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perceivedGaps">Perceived Insurance Gaps</Label>
              <Textarea
                id="perceivedGaps"
                placeholder="Areas where you feel underinsured or have coverage concerns"
                value={insuranceData.perceivedGaps || ''}
                onChange={(e) => handleFieldChange('perceivedGaps', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceReviewFrequency">Insurance Review Frequency</Label>
              <Select
                value={insuranceData.insuranceReviewFrequency || ''}
                onValueChange={(value) => handleFieldChange('insuranceReviewFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How often do you review?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="few_years">Every few years</SelectItem>
                  <SelectItem value="when_required">When required</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Insurance Planning Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Life insurance:</strong> General rule is 10-12x annual income</li>
            <li>• <strong>Disability insurance:</strong> Often more important than life insurance</li>
            <li>• <strong>Umbrella policy:</strong> Provides extra liability protection at low cost</li>
            <li>• <strong>Review annually:</strong> Life changes affect insurance needs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}