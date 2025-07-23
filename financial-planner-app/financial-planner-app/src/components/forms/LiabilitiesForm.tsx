'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { Liabilities, AutoLoan, CreditCard, StudentLoan } from '@/types/financial';

interface LiabilitiesFormProps {
  data?: Liabilities;
  onUpdate: (data: Liabilities) => void;
  onFieldUpdate: (field: keyof Liabilities, value: any) => void;
}

export default function LiabilitiesForm({ data, onUpdate, onFieldUpdate }: LiabilitiesFormProps) {
  const liabilitiesData = data || {} as Liabilities;

  const handleFieldChange = (field: keyof Liabilities, value: any) => {
    const updatedData = {
      ...liabilitiesData,
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

  // Auto Loan functions
  const addAutoLoan = () => {
    const currentLoans = liabilitiesData.autoLoans || [];
    const newLoan: AutoLoan = { balance: 0, rate: 0, term: '', description: '' };
    handleFieldChange('autoLoans', [...currentLoans, newLoan]);
  };

  const updateAutoLoan = (index: number, field: keyof AutoLoan, value: any) => {
    const currentLoans = liabilitiesData.autoLoans || [];
    const updatedLoans = [...currentLoans];
    updatedLoans[index] = { ...updatedLoans[index], [field]: value };
    handleFieldChange('autoLoans', updatedLoans);
  };

  const removeAutoLoan = (index: number) => {
    const currentLoans = liabilitiesData.autoLoans || [];
    const updatedLoans = currentLoans.filter((_, i) => i !== index);
    handleFieldChange('autoLoans', updatedLoans);
  };

  // Credit Card functions
  const addCreditCard = () => {
    const currentCards = liabilitiesData.creditCards || [];
    const newCard: CreditCard = { name: '', balance: 0, limit: 0, rate: 0 };
    handleFieldChange('creditCards', [...currentCards, newCard]);
  };

  const updateCreditCard = (index: number, field: keyof CreditCard, value: any) => {
    const currentCards = liabilitiesData.creditCards || [];
    const updatedCards = [...currentCards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    handleFieldChange('creditCards', updatedCards);
  };

  const removeCreditCard = (index: number) => {
    const currentCards = liabilitiesData.creditCards || [];
    const updatedCards = currentCards.filter((_, i) => i !== index);
    handleFieldChange('creditCards', updatedCards);
  };

  // Student Loan functions
  const addStudentLoan = () => {
    const currentLoans = liabilitiesData.studentLoans || [];
    const newLoan: StudentLoan = { balance: 0, rate: 0, servicer: '', type: '' };
    handleFieldChange('studentLoans', [...currentLoans, newLoan]);
  };

  const updateStudentLoan = (index: number, field: keyof StudentLoan, value: any) => {
    const currentLoans = liabilitiesData.studentLoans || [];
    const updatedLoans = [...currentLoans];
    updatedLoans[index] = { ...updatedLoans[index], [field]: value };
    handleFieldChange('studentLoans', updatedLoans);
  };

  const removeStudentLoan = (index: number) => {
    const currentLoans = liabilitiesData.studentLoans || [];
    const updatedLoans = currentLoans.filter((_, i) => i !== index);
    handleFieldChange('studentLoans', updatedLoans);
  };

  const getTotalDebt = () => {
    const mortgage = liabilitiesData.mortgageBalance || 0;
    const autoTotal = (liabilitiesData.autoLoans || []).reduce((sum, loan) => sum + (loan.balance || 0), 0);
    const creditTotal = (liabilitiesData.creditCards || []).reduce((sum, card) => sum + (card.balance || 0), 0);
    const studentTotal = (liabilitiesData.studentLoans || []).reduce((sum, loan) => sum + (loan.balance || 0), 0);
    return mortgage + autoTotal + creditTotal + studentTotal;
  };

  return (
    <div className="space-y-6">
      {/* Primary Mortgage */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">🏠 Primary Mortgage</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mortgageBalance">Mortgage Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="mortgageBalance"
                  type="number"
                  placeholder="350000"
                  value={liabilitiesData.mortgageBalance || ''}
                  onChange={(e) => handleFieldChange('mortgageBalance', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mortgageRate">Interest Rate (%)</Label>
              <Input
                id="mortgageRate"
                type="number"
                step="0.01"
                placeholder="3.50"
                value={liabilitiesData.mortgageRate || ''}
                onChange={(e) => handleFieldChange('mortgageRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mortgageYears">Years Remaining</Label>
              <Input
                id="mortgageYears"
                type="number"
                placeholder="25"
                value={liabilitiesData.mortgageYears || ''}
                onChange={(e) => handleFieldChange('mortgageYears', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto Loans */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">🚗 Auto Loans</h3>
            <Button onClick={addAutoLoan} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Auto Loan
            </Button>
          </div>

          {(liabilitiesData.autoLoans || []).map((loan, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">Auto Loan {index + 1}</Badge>
                <Button
                  onClick={() => removeAutoLoan(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">Balance</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={loan.balance || ''}
                      onChange={(e) => updateAutoLoan(index, 'balance', parseFloat(e.target.value) || 0)}
                      className="pl-6 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="4.5"
                    value={loan.rate || ''}
                    onChange={(e) => updateAutoLoan(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Term</Label>
                  <Input
                    type="text"
                    placeholder="60 months"
                    value={loan.term || ''}
                    onChange={(e) => updateAutoLoan(index, 'term', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Description</Label>
                  <Input
                    type="text"
                    placeholder="2020 Honda Civic"
                    value={loan.description || ''}
                    onChange={(e) => updateAutoLoan(index, 'description', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          {(!liabilitiesData.autoLoans || liabilitiesData.autoLoans.length === 0) && (
            <p className="text-gray-500 text-center py-4">No auto loans added. Click "Add Auto Loan" to get started.</p>
          )}
        </CardContent>
      </Card>

      {/* Credit Cards */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">💳 Credit Cards</h3>
            <Button onClick={addCreditCard} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Credit Card
            </Button>
          </div>

          {(liabilitiesData.creditCards || []).map((card, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">Credit Card {index + 1}</Badge>
                <Button
                  onClick={() => removeCreditCard(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">Card Name</Label>
                  <Input
                    type="text"
                    placeholder="Chase Sapphire"
                    value={card.name || ''}
                    onChange={(e) => updateCreditCard(index, 'name', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Balance</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="2500"
                      value={card.balance || ''}
                      onChange={(e) => updateCreditCard(index, 'balance', parseFloat(e.target.value) || 0)}
                      className="pl-6 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Credit Limit</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={card.limit || ''}
                      onChange={(e) => updateCreditCard(index, 'limit', parseFloat(e.target.value) || 0)}
                      className="pl-6 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">APR (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="18.99"
                    value={card.rate || ''}
                    onChange={(e) => updateCreditCard(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Utilization: {card.balance && card.limit ? 
                  `${Math.round((card.balance / card.limit) * 100)}%` : '0%'}
              </div>
            </div>
          ))}

          {(!liabilitiesData.creditCards || liabilitiesData.creditCards.length === 0) && (
            <p className="text-gray-500 text-center py-4">No credit cards added. Click "Add Credit Card" to get started.</p>
          )}
        </CardContent>
      </Card>

      {/* Student Loans */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">🎓 Student Loans</h3>
            <Button onClick={addStudentLoan} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Student Loan
            </Button>
          </div>

          {(liabilitiesData.studentLoans || []).map((loan, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">Student Loan {index + 1}</Badge>
                <Button
                  onClick={() => removeStudentLoan(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">Balance</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={loan.balance || ''}
                      onChange={(e) => updateStudentLoan(index, 'balance', parseFloat(e.target.value) || 0)}
                      className="pl-6 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="5.5"
                    value={loan.rate || ''}
                    onChange={(e) => updateStudentLoan(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Servicer</Label>
                  <Input
                    type="text"
                    placeholder="Navient"
                    value={loan.servicer || ''}
                    onChange={(e) => updateStudentLoan(index, 'servicer', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Type</Label>
                  <Select
                    value={loan.type || ''}
                    onValueChange={(value) => updateStudentLoan(index, 'type', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federal">Federal</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="parent_plus">Parent PLUS</SelectItem>
                      <SelectItem value="grad_plus">Grad PLUS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          {(!liabilitiesData.studentLoans || liabilitiesData.studentLoans.length === 0) && (
            <p className="text-gray-500 text-center py-4">No student loans added. Click "Add Student Loan" to get started.</p>
          )}
        </CardContent>
      </Card>

      {/* Debt Summary */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-red-900 mb-3">📊 Total Debt Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <p className="text-red-700 font-medium">Mortgage</p>
              <p className="text-red-900 font-bold">{formatCurrency(liabilitiesData.mortgageBalance || 0)}</p>
            </div>
            <div>
              <p className="text-red-700 font-medium">Auto Loans</p>
              <p className="text-red-900 font-bold">
                {formatCurrency((liabilitiesData.autoLoans || []).reduce((sum, loan) => sum + (loan.balance || 0), 0))}
              </p>
            </div>
            <div>
              <p className="text-red-700 font-medium">Credit Cards</p>
              <p className="text-red-900 font-bold">
                {formatCurrency((liabilitiesData.creditCards || []).reduce((sum, card) => sum + (card.balance || 0), 0))}
              </p>
            </div>
            <div>
              <p className="text-red-700 font-medium">Student Loans</p>
              <p className="text-red-900 font-bold">
                {formatCurrency((liabilitiesData.studentLoans || []).reduce((sum, loan) => sum + (loan.balance || 0), 0))}
              </p>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-red-700 font-medium">Total Debt</span>
              <span className="text-red-900 font-bold text-xl">{formatCurrency(getTotalDebt())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Debt Management Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>High-interest first:</strong> Pay off credit cards before other debt</li>
            <li>• <strong>Credit utilization:</strong> Keep credit card balances under 30% of limits</li>
            <li>• <strong>Student loans:</strong> Consider income-driven repayment plans</li>
            <li>• <strong>Mortgage:</strong> Extra principal payments can save thousands in interest</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}