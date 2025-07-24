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
          <Label htmlFor="state">State of Residence</Label>
          <Input
            id="state"
            type="text"
            placeholder="e.g., California, NY"
            value={personalData.state || ''}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={personalData.country || ''}
            onValueChange={(value) => handleFieldChange('country', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Contact Preferences */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Contact Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Communication Method */}
            <div className="space-y-2">
              <Label htmlFor="communicationMethod">Preferred Communication Method</Label>
              <Select
                value={personalData.communicationMethod || ''}
                onValueChange={(value) => handleFieldChange('communicationMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How would you like to be contacted?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="video_call">Video Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Frequency */}
            <div className="space-y-2">
              <Label htmlFor="meetingFrequency">Meeting Frequency Preference</Label>
              <Select
                value={personalData.meetingFrequency || ''}
                onValueChange={(value) => handleFieldChange('meetingFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How often would you like to meet?" />
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
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Why We Ask This</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Age & dependents:</strong> Help determine insurance needs and retirement timeline</li>
            <li>• <strong>Marital status:</strong> Affects tax strategies and estate planning</li>
            <li>• <strong>Employment:</strong> Influences income stability and benefit planning</li>
            <li>• <strong>Location:</strong> Important for state tax considerations and cost of living</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}