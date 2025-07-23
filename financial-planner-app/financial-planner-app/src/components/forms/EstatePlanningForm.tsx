'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { EstatePlanning } from '@/types/financial';

interface EstatePlanningFormProps {
  data?: EstatePlanning;
  onUpdate: (data: EstatePlanning) => void;
  onFieldUpdate: (field: keyof EstatePlanning, value: any) => void;
}

export default function EstatePlanningForm({ data, onUpdate, onFieldUpdate }: EstatePlanningFormProps) {
  const estateData = data || {} as EstatePlanning;

  const handleFieldChange = (field: keyof EstatePlanning, value: any) => {
    const updatedData = {
      ...estateData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  const handleArrayFieldChange = (field: keyof EstatePlanning, value: string, isChecked: boolean) => {
    const currentArray = (estateData[field] as string[]) || [];
    const updatedArray = isChecked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFieldChange(field, updatedArray);
  };

  return (
    <div className="space-y-6">
      {/* Basic Estate Documents */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📜 Basic Estate Documents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="will">Will</Label>
              <Select
                value={estateData.will || ''}
                onValueChange={(value) => handleFieldChange('will', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Will status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_attorney">Current (attorney-drafted)</SelectItem>
                  <SelectItem value="current_online">Current (online/DIY)</SelectItem>
                  <SelectItem value="outdated">Outdated</SelectItem>
                  <SelectItem value="none">No will</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="willLastUpdated">Will Last Updated</Label>
              <Input
                id="willLastUpdated"
                type="date"
                value={estateData.willLastUpdated || ''}
                onChange={(e) => handleFieldChange('willLastUpdated', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="powerOfAttorney">Power of Attorney</Label>
              <Select
                value={estateData.powerOfAttorney || ''}
                onValueChange={(value) => handleFieldChange('powerOfAttorney', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="POA status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial_healthcare">Financial & Healthcare</SelectItem>
                  <SelectItem value="financial_only">Financial Only</SelectItem>
                  <SelectItem value="healthcare_only">Healthcare Only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceDirective">Advance Directive/Living Will</Label>
              <Select
                value={estateData.advanceDirective || ''}
                onValueChange={(value) => handleFieldChange('advanceDirective', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Advance directive status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="outdated">Outdated</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianshipDesignation">Guardianship for Minor Children</Label>
              <Select
                value={estateData.guardianshipDesignation || ''}
                onValueChange={(value) => handleFieldChange('guardianshipDesignation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Guardianship status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="designated">Designated in will</SelectItem>
                  <SelectItem value="needs_update">Needs updating</SelectItem>
                  <SelectItem value="not_applicable">No minor children</SelectItem>
                  <SelectItem value="none">Not designated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estatePlanningAttorney">Estate Planning Attorney</Label>
              <Select
                value={estateData.estatePlanningAttorney || ''}
                onValueChange={(value) => handleFieldChange('estatePlanningAttorney', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Attorney relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing_relationship">Ongoing relationship</SelectItem>
                  <SelectItem value="used_once">Used once</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Planning */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏦 Trust Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revocableTrust">Revocable Trust</Label>
              <Select
                value={estateData.revocableTrust || ''}
                onValueChange={(value) => handleFieldChange('revocableTrust', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Revocable trust status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funded">Fully funded</SelectItem>
                  <SelectItem value="unfunded">Created but unfunded</SelectItem>
                  <SelectItem value="interested">Interested in creating</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="irrevocableTrusts">Irrevocable Trusts</Label>
              <Select
                value={estateData.irrevocableTrusts || ''}
                onValueChange={(value) => handleFieldChange('irrevocableTrusts', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Irrevocable trusts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="life_insurance">Life insurance trust</SelectItem>
                  <SelectItem value="charitable">Charitable trust</SelectItem>
                  <SelectItem value="generation_skipping">Generation-skipping trust</SelectItem>
                  <SelectItem value="multiple">Multiple trusts</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trustBeneficiaries">Trust Beneficiaries</Label>
              <Textarea
                id="trustBeneficiaries"
                placeholder="Who are the intended beneficiaries of your trusts?"
                value={estateData.trustBeneficiaries || ''}
                onChange={(e) => handleFieldChange('trustBeneficiaries', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trustSuccessor">Successor Trustee</Label>
              <Input
                id="trustSuccessor"
                type="text"
                placeholder="Name of successor trustee"
                value={estateData.trustSuccessor || ''}
                onChange={(e) => handleFieldChange('trustSuccessor', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Planning */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💰 Estate Tax Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedNetWorth">Estimated Net Worth</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="estimatedNetWorth"
                  type="number"
                  placeholder="1000000"
                  value={estateData.estimatedNetWorth || ''}
                  onChange={(e) => handleFieldChange('estimatedNetWorth', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">For estate tax planning purposes</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estateTaxConcern">Estate Tax Concern</Label>
              <Select
                value={estateData.estateTaxConcern || ''}
                onValueChange={(value) => handleFieldChange('estateTaxConcern', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estate tax planning need" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major_concern">Major concern</SelectItem>
                  <SelectItem value="moderate_concern">Moderate concern</SelectItem>
                  <SelectItem value="minimal_concern">Minimal concern</SelectItem>
                  <SelectItem value="no_concern">No concern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="giftTaxStrategy">Gift Tax Strategy</Label>
              <Select
                value={estateData.giftTaxStrategy || ''}
                onValueChange={(value) => handleFieldChange('giftTaxStrategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gifting strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual_exclusion">Annual exclusion gifts</SelectItem>
                  <SelectItem value="lifetime_exemption">Using lifetime exemption</SelectItem>
                  <SelectItem value="educational_medical">Education/medical gifts</SelectItem>
                  <SelectItem value="none">No gifting strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="charitableGiving">Charitable Giving Plans</Label>
              <Select
                value={estateData.charitableGiving || ''}
                onValueChange={(value) => handleFieldChange('charitableGiving', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Charitable giving approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="substantial_lifetime">Substantial during lifetime</SelectItem>
                  <SelectItem value="substantial_death">Substantial at death</SelectItem>
                  <SelectItem value="modest">Modest amounts</SelectItem>
                  <SelectItem value="none">No planned giving</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Succession */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏢 Business Succession Planning</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="businessOwner"
                checked={estateData.businessOwner || false}
                onCheckedChange={(checked) => handleFieldChange('businessOwner', checked)}
              />
              <Label htmlFor="businessOwner">Business owner or significant ownership stake</Label>
            </div>

            {estateData.businessOwner && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={estateData.businessType || ''}
                    onValueChange={(value) => handleFieldChange('businessType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type of business" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="professional_practice">Professional Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessValue">Estimated Business Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <Input
                      id="businessValue"
                      type="number"
                      placeholder="500000"
                      value={estateData.businessValue || ''}
                      onChange={(e) => handleFieldChange('businessValue', parseFloat(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successionPlan">Succession Plan</Label>
                  <Select
                    value={estateData.successionPlan || ''}
                    onValueChange={(value) => handleFieldChange('successionPlan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Succession planning status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documented">Documented plan</SelectItem>
                      <SelectItem value="informal">Informal plan</SelectItem>
                      <SelectItem value="none">No plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyPersonInsurance">Key Person Insurance</Label>
                  <Select
                    value={estateData.keyPersonInsurance || ''}
                    onValueChange={(value) => handleFieldChange('keyPersonInsurance', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Key person coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequate">Adequate coverage</SelectItem>
                      <SelectItem value="insufficient">Insufficient coverage</SelectItem>
                      <SelectItem value="none">No coverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Digital Assets & Final Instructions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">💻 Digital Assets & Final Instructions</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Digital Asset Categories (select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Cryptocurrency',
                  'Online accounts',
                  'Digital photos',
                  'Social media',
                  'Cloud storage',
                  'Online business',
                  'Domain names',
                  'Digital collections'
                ].map(asset => (
                  <div key={asset} className="flex items-center space-x-2">
                    <Checkbox
                      id={asset}
                      checked={(estateData.digitalAssets || []).includes(asset)}
                      onCheckedChange={(checked) => handleArrayFieldChange('digitalAssets', asset, !!checked)}
                    />
                    <Label htmlFor={asset} className="text-sm">{asset}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="digitalExecutor">Digital Executor</Label>
                <Input
                  id="digitalExecutor"
                  type="text"
                  placeholder="Person responsible for digital assets"
                  value={estateData.digitalExecutor || ''}
                  onChange={(e) => handleFieldChange('digitalExecutor', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordManager">Password Manager</Label>
                <Select
                  value={estateData.passwordManager || ''}
                  onValueChange={(value) => handleFieldChange('passwordManager', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Password management" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with_emergency_contact">Yes, with emergency contact</SelectItem>
                    <SelectItem value="without_emergency">Yes, no emergency contact</SelectItem>
                    <SelectItem value="none">No password manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funeralPreferences">Funeral/Memorial Preferences</Label>
              <Textarea
                id="funeralPreferences"
                placeholder="Burial vs cremation, service preferences, specific instructions"
                value={estateData.funeralPreferences || ''}
                onChange={(e) => handleFieldChange('funeralPreferences', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="importantDocumentsLocation">Important Documents Location</Label>
              <Textarea
                id="importantDocumentsLocation"
                placeholder="Where family can find important documents, keys, etc."
                value={estateData.importantDocumentsLocation || ''}
                onChange={(e) => handleFieldChange('importantDocumentsLocation', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estate Planning Review */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">📋 Estate Planning Review</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastReviewDate">Last Comprehensive Review</Label>
              <Select
                value={estateData.lastReviewDate || ''}
                onValueChange={(value) => handleFieldChange('lastReviewDate', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="When last reviewed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="within_year">Within last year</SelectItem>
                  <SelectItem value="1_2_years">1-2 years ago</SelectItem>
                  <SelectItem value="3_5_years">3-5 years ago</SelectItem>
                  <SelectItem value="over_5_years">Over 5 years ago</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="majorLifeChanges">Recent Major Life Changes</Label>
              <Select
                value={estateData.majorLifeChanges || ''}
                onValueChange={(value) => handleFieldChange('majorLifeChanges', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Life changes affecting estate plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marriage_divorce">Marriage/Divorce</SelectItem>
                  <SelectItem value="new_child">New child/grandchild</SelectItem>
                  <SelectItem value="moved_states">Moved states</SelectItem>
                  <SelectItem value="wealth_increase">Significant wealth increase</SelectItem>
                  <SelectItem value="none">No major changes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estatePlanningConcerns">Primary Estate Planning Concerns</Label>
            <Textarea
              id="estatePlanningConcerns"
              placeholder="What are your main concerns or goals for estate planning?"
              value={estateData.estatePlanningConcerns || ''}
              onChange={(e) => handleFieldChange('estatePlanningConcerns', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Estate Planning Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Regular updates:</strong> Review estate plans after major life events</li>
            <li>• <strong>State law matters:</strong> Estate laws vary significantly by state</li>
            <li>• <strong>Tax thresholds:</strong> 2024 federal estate tax exemption is $13.61M per person</li>
            <li>• <strong>Digital assets:</strong> Don't forget online accounts and cryptocurrency</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}