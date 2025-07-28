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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Goal Timeline
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your financial goals roadmap
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Financial Goals Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              Interactive goal timeline and tracking coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}