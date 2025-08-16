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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Tax Optimization Strategy
        </h2>
        <p className="text-gray-600 text-lg">
          Maximize your after-tax returns
        </p>
      </div>

      <Card className="bg-white backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-500/30">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            Tax Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 backdrop-blur-sm border border-gray-200 rounded-full">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-gray-600">Coming Soon</span>
              </div>
            </div>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Advanced tax planning strategies and optimization recommendations will be available in an upcoming release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}