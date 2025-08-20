'use client';

import React from 'react';
import UpgradeCTA from './UpgradeCTA';
import { PlanType } from '@/hooks/usePlanType';

interface PlanUpgradeOverlayProps {
  children: React.ReactNode;
  sectionId: string;
  planType: PlanType;
  isAccessible: boolean;
  className?: string;
}

export default function PlanUpgradeOverlay({ 
  children, 
  sectionId, 
  planType, 
  isAccessible, 
  className = '' 
}: PlanUpgradeOverlayProps) {
  
  // If user has access or is on comprehensive plan, show normal content
  if (isAccessible || planType === 'comprehensive') {
    return <>{children}</>;
  }

  // Show gated content with frosted overlay and upgrade CTA
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Frosted/Blurred Content */}
      <div className="filter blur-[2px] opacity-30 pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-white/60 backdrop-blur-[1px]" />
      
      {/* Upgrade CTA positioned over the content */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <UpgradeCTA 
          sectionId={sectionId}
          className="w-full max-w-md mx-auto shadow-xl"
        />
      </div>
    </div>
  );
}