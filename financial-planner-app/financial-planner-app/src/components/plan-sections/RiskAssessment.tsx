'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { FormData } from '@/types/financial';

interface RiskAssessmentProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

export default function RiskAssessment({ clientData }: RiskAssessmentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Risk Assessment
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your risk profile and protection strategies
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive risk assessment and recommendations coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}