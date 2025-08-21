'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersonalInfo } from '@/types/financial';

interface PersonalInfoFormProps {
  data?: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
  onFieldUpdate: (field: keyof PersonalInfo, value: any) => void;
}

export default function PersonalInfoForm({ data, onUpdate, onFieldUpdate }: PersonalInfoFormProps) {
  const personalData = data || {} as PersonalInfo;

  const handleFieldChange = (field: keyof PersonalInfo, value: string | number) => {
    const updatedData = {
      ...personalData,
      [field]: value
    };
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={personalData.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={personalData.dateOfBirth || ''}
            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select
            value={personalData.maritalStatus || ''}
            onValueChange={(value) => handleFieldChange('maritalStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
              <SelectItem value="domestic_partner">Domestic Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state">State of Residence *</Label>
          <Select
            value={personalData.state || ''}
            onValueChange={(value) => handleFieldChange('state', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AL">Alabama</SelectItem>
              <SelectItem value="AK">Alaska</SelectItem>
              <SelectItem value="AZ">Arizona</SelectItem>
              <SelectItem value="AR">Arkansas</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="CO">Colorado</SelectItem>
              <SelectItem value="CT">Connecticut</SelectItem>
              <SelectItem value="DE">Delaware</SelectItem>
              <SelectItem value="DC">District of Columbia</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="GA">Georgia</SelectItem>
              <SelectItem value="HI">Hawaii</SelectItem>
              <SelectItem value="ID">Idaho</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
              <SelectItem value="IN">Indiana</SelectItem>
              <SelectItem value="IA">Iowa</SelectItem>
              <SelectItem value="KS">Kansas</SelectItem>
              <SelectItem value="KY">Kentucky</SelectItem>
              <SelectItem value="LA">Louisiana</SelectItem>
              <SelectItem value="ME">Maine</SelectItem>
              <SelectItem value="MD">Maryland</SelectItem>
              <SelectItem value="MA">Massachusetts</SelectItem>
              <SelectItem value="MI">Michigan</SelectItem>
              <SelectItem value="MN">Minnesota</SelectItem>
              <SelectItem value="MS">Mississippi</SelectItem>
              <SelectItem value="MO">Missouri</SelectItem>
              <SelectItem value="MT">Montana</SelectItem>
              <SelectItem value="NE">Nebraska</SelectItem>
              <SelectItem value="NV">Nevada</SelectItem>
              <SelectItem value="NH">New Hampshire</SelectItem>
              <SelectItem value="NJ">New Jersey</SelectItem>
              <SelectItem value="NM">New Mexico</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="NC">North Carolina</SelectItem>
              <SelectItem value="ND">North Dakota</SelectItem>
              <SelectItem value="OH">Ohio</SelectItem>
              <SelectItem value="OK">Oklahoma</SelectItem>
              <SelectItem value="OR">Oregon</SelectItem>
              <SelectItem value="PA">Pennsylvania</SelectItem>
              <SelectItem value="RI">Rhode Island</SelectItem>
              <SelectItem value="SC">South Carolina</SelectItem>
              <SelectItem value="SD">South Dakota</SelectItem>
              <SelectItem value="TN">Tennessee</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="UT">Utah</SelectItem>
              <SelectItem value="VT">Vermont</SelectItem>
              <SelectItem value="VA">Virginia</SelectItem>
              <SelectItem value="WA">Washington</SelectItem>
              <SelectItem value="WV">West Virginia</SelectItem>
              <SelectItem value="WI">Wisconsin</SelectItem>
              <SelectItem value="WY">Wyoming</SelectItem>
              <SelectItem value="PR">Puerto Rico</SelectItem>
              <SelectItem value="VI">US Virgin Islands</SelectItem>
              <SelectItem value="GU">Guam</SelectItem>
              <SelectItem value="MP">Northern Mariana Islands</SelectItem>
              <SelectItem value="AS">American Samoa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={personalData.country || 'United States'}
            onValueChange={(value) => handleFieldChange('country', value)}
            disabled
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="United States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United States">United States</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Currently only available for US residents
          </p>
        </div>

        {/* Employment Status */}
        <div className="space-y-2">
          <Label htmlFor="employmentStatus">Employment Status</Label>
          <Select
            value={personalData.employmentStatus || ''}
            onValueChange={(value) => handleFieldChange('employmentStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed_full_time">Employed Full-time</SelectItem>
              <SelectItem value="employed_part_time">Employed Part-time</SelectItem>
              <SelectItem value="self_employed">Self-employed</SelectItem>
              <SelectItem value="contract_freelance">Contract/Freelance</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="homemaker">Homemaker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            type="text"
            placeholder="e.g., Technology, Healthcare, Finance"
            value={personalData.industry || ''}
            onChange={(e) => handleFieldChange('industry', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Profession */}
        <div className="space-y-2">
          <Label htmlFor="profession">Job Title/Profession</Label>
          <Input
            id="profession"
            type="text"
            placeholder="e.g., Software Engineer, Marketing Manager"
            value={personalData.profession || ''}
            onChange={(e) => handleFieldChange('profession', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Dependents Section */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Dependents Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Number of Dependents */}
            <div className="space-y-2">
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                type="number"
                placeholder="0"
                value={personalData.dependents || ''}
                onChange={(e) => handleFieldChange('dependents', parseInt(e.target.value) || 0)}
                min="0"
                max="10"
                className="w-full"
              />
            </div>

            {/* Dependent Ages */}
            <div className="space-y-2">
              <Label htmlFor="dependentAges">Dependent Ages</Label>
              <Input
                id="dependentAges"
                type="text"
                placeholder="e.g., 8, 12, 16 (comma separated)"
                value={personalData.dependentAges || ''}
                onChange={(e) => handleFieldChange('dependentAges', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Enter ages separated by commas if you have dependents
              </p>
            </div>
          </div>

        </CardContent>
      </Card>


      {/* Why We Ask For This Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Why We Ask For This</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Age & dependents:</strong> Help determine insurance needs and retirement timeline</li>
            <li>• <strong>Marital status:</strong> Affects tax strategies and estate planning</li>
            <li>• <strong>Employment:</strong> Influences income stability and benefit planning</li>
            <li>• <strong>State of residence:</strong> Important for state tax considerations and cost of living adjustments</li>
            <li>• <strong>Industry & profession:</strong> Helps assess income stability and career-specific benefits</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}