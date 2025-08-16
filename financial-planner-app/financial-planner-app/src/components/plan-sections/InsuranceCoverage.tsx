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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Insurance Coverage Review
        </h2>
        <p className="text-gray-600 text-lg">
          Your protection portfolio analysis
        </p>
      </div>

      <Card className="bg-white backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg border border-emerald-500/30">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            Coverage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 backdrop-blur-sm border border-gray-200 rounded-full">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-gray-600">Coming Soon</span>
              </div>
            </div>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Comprehensive insurance review and protection gap analysis will be available in an upcoming release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}