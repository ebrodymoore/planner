'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { FormData } from '@/types/financial';

interface InsuranceCoverageProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

export default function InsuranceCoverage({ clientData }: InsuranceCoverageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Insurance Coverage Review
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your protection portfolio analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Coverage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive insurance review and recommendations coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}