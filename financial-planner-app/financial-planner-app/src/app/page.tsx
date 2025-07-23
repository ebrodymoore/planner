'use client';

import OnboardingWizard from '@/components/OnboardingWizard';
import { FormData } from '@/types/financial';

export default function Home() {
  const handleComplete = async (data: FormData) => {
    console.log('Questionnaire completed:', data);
    // Here you would typically save to database and redirect to analysis
  };

  const handleSave = async (data: FormData) => {
    console.log('Auto-saving data:', data);
    // Here you would save to database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingWizard 
        onComplete={handleComplete}
        onSave={handleSave}
      />
    </div>
  );
}
