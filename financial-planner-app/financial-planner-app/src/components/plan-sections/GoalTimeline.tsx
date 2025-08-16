'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { FormData } from '@/types/financial';

interface GoalTimelineProps {
  clientData: FormData;
  analysisResults?: any;
  onUpdateData?: (data: FormData) => void;
}

export default function GoalTimeline({ clientData }: GoalTimelineProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
          Goal Timeline
        </h2>
        <p className="text-gray-600 text-lg">
          Your financial goals roadmap
        </p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            Financial Goals Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/50 backdrop-blur-sm border border-gray-300/50 rounded-full">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Coming Soon</span>
              </div>
            </div>
            <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
              Interactive goal timeline and milestone tracking will be available in an upcoming release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}