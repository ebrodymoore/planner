'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { FormData } from '@/types/financial';

interface TaxStrategyProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

export default function TaxStrategy({ clientData }: TaxStrategyProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tax Optimization Strategy
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Maximize your after-tax returns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Tax Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              Advanced tax planning strategies and optimization coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}