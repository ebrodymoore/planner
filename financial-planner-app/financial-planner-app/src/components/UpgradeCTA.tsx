'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Star, Zap } from 'lucide-react';
import { getUpgradeMessage } from '@/hooks/usePlanType';

interface UpgradeCTAProps {
  sectionId: string;
  className?: string;
}

export default function UpgradeCTA({ sectionId, className = '' }: UpgradeCTAProps) {
  const router = useRouter();
  const { title, description } = getUpgradeMessage(sectionId);

  const handleUpgrade = () => {
    // Navigate to comprehensive questionnaire for upgrade
    router.push('/questionnaire/comprehensive');
  };

  return (
    <Card className={`border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-blue-50/80 backdrop-blur-sm ${className}`}>
      <CardContent className="p-8 text-center">
        {/* Lock Icon with Premium Badge */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200/50 shadow-sm">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full p-1">
            <Star className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Upgrade Message */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-6 max-w-md mx-auto">
          {description}
        </p>

        {/* Benefits List */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100/70 rounded-full text-sm text-emerald-700">
            <Zap className="w-3 h-3" />
            Detailed Analysis
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100/70 rounded-full text-sm text-blue-700">
            <Star className="w-3 h-3" />
            Personalized Advice
          </div>
        </div>

        {/* Upgrade Button */}
        <Button 
          onClick={handleUpgrade}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
        >
          Upgrade to Comprehensive Plan
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Value Proposition */}
        <p className="text-xs text-gray-500 mt-4">
          Complete our comprehensive questionnaire to unlock all features
        </p>
      </CardContent>
    </Card>
  );
}