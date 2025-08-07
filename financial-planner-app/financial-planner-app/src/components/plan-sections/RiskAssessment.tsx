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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
          Risk Assessment
        </h2>
        <p className="text-slate-400 text-lg">
          Your risk profile and protection strategies
        </p>
      </div>

      <Card className="bg-slate-700/30 backdrop-blur-sm border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full">
                <Shield className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-slate-300">Coming Soon</span>
              </div>
            </div>
            <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
              Comprehensive risk assessment and protection strategies will be available in an upcoming release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}