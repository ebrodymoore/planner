'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import LandingPage from '@/components/LandingPage';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { useUser } from '@supabase/auth-helpers-react';
import { FormData } from '@/types/financial';
import { AlertTriangle, Loader2 } from 'lucide-react';

function HomePage() {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Add a small delay to handle auth state transitions
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Small delay to let auth state settle
    const timer = setTimeout(() => setIsAuthReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Track user ID changes to detect auth state transitions
  useEffect(() => {
    const currentUserId = user?.id || null;
    
    if (currentUserId !== previousUserId) {
      console.log('🔄 [DEBUG] User state transition:', { 
        previous: previousUserId, 
        current: currentUserId,
        timestamp: new Date().toISOString()
      });
      
      setPreviousUserId(currentUserId);
      
      // If user just logged in, add a small delay to ensure data loading works properly
      if (!previousUserId && currentUserId) {
        console.log('🔄 [DEBUG] User just logged in, waiting for data hooks to settle');
        // Force a re-render after auth transition
        setTimeout(() => {
          console.log('🔄 [DEBUG] Auth transition complete, data should now load');
        }, 500);
      }
    }
  }, [user?.id, previousUserId]);
  const [currentView, setCurrentView] = useState<'landing'>(() => {
    // Initialize view state from URL parameter and handle legacy redirects
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view');
      
      // Handle legacy redirects
      if (view === 'quick-plan') {
        // Redirect to the new quick plan route
        window.location.href = '/questionnaire/quick';
        return 'landing'; // temporary while redirecting
      }
      if (view === 'questionnaire') {
        // Redirect to the new comprehensive route  
        window.location.href = '/questionnaire/comprehensive';
        return 'landing'; // temporary while redirecting
      }
      if (view === 'plan') {
        // Redirect to the new dashboard route
        window.location.href = '/dashboard';
        return 'landing'; // temporary while redirecting
      }
    }
    return 'landing';
  });
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  
  const {
    questionnaireData,
    analysisResults,
    isLoadingQuestionnaire,
    isLoadingAnalysis,
    isGeneratingAnalysis,
    generateNewAnalysis,
    saveQuestionnaireData,
    error,
    clearError
  } = useFinancialPlan();

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleGetStarted = () => {
    router.push('/questionnaire');
  };

  const handleDashboard = () => {
    // Always redirect to dashboard - it will handle redirecting to questionnaire if no data
    router.push('/dashboard');
  };


  // Check for auth errors in URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Check both URL params and hash params for auth errors
    const authErrorFlag = urlParams.get('auth_error') || hashParams.get('error');
    const errorParam = urlParams.get('error') || hashParams.get('error');
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
    
    if (authErrorFlag || errorParam) {
      let errorMessage = 'Authentication failed';
      
      if (errorDescription) {
        // Decode and format the error message
        const decodedError = decodeURIComponent(errorDescription);
        if (decodedError.includes('Database error granting user')) {
          errorMessage = 'Account creation failed due to a database error. Please try again or contact support if the issue persists.';
        } else if (decodedError.includes('server_error')) {
          errorMessage = 'Server error occurred during authentication. Please try again.';
        } else {
          errorMessage = decodedError;
        }
      } else if (errorParam === 'server_error') {
        errorMessage = 'Server error occurred during authentication. Please try again.';
      }
      
      // Navigate to sign-in with error info in URL
      const errorParams = new URLSearchParams({
        error: 'true',
        message: encodeURIComponent(errorMessage)
      });
      router.push(`/sign-in?${errorParams.toString()}`);
      
      // Clean up URL parameters
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('auth_error');
      cleanUrl.searchParams.delete('error');
      cleanUrl.searchParams.delete('error_code');
      cleanUrl.searchParams.delete('error_description');
      cleanUrl.hash = '';
      window.history.replaceState({}, '', cleanUrl.toString());
    }
  }, []);

  // Handle authentication and user flow
  React.useEffect(() => {
    console.log('🔄 [DEBUG] Navigation effect triggered:', {
      user: user?.id,
      hasQuestionnaireData: !!(questionnaireData && Object.keys(questionnaireData).length > 0),
      currentView,
      showSignupPrompt,
      isAuthReady
    });

    // Wait for auth to be ready before making navigation decisions
    if (!isAuthReady) {
      console.log('🔄 [DEBUG] Auth not ready yet, waiting...');
      return;
    }

    if (user && questionnaireData && Object.keys(questionnaireData).length > 0) {
      // Existing user with data - redirect to dashboard
      console.log('🔄 [DEBUG] User has data, redirecting to dashboard');
      if (currentView === 'landing') {
        router.push('/dashboard');
        return; // Exit early to prevent further navigation logic
      }
    } else if (!user && showSignupPrompt) {
      // Only redirect to sign-in when showSignupPrompt is true
      console.log('🔄 [DEBUG] Signup prompt triggered, redirecting to sign-in');
      router.push('/sign-in');
      setShowSignupPrompt(false);
    }
  }, [user, questionnaireData, currentView, showSignupPrompt, router, isAuthReady]);

  // Show loading state
  if (isLoadingQuestionnaire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Show error if exists
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={clearError} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen">
        <LandingPage 
          onGetStarted={handleGetStarted}
          user={user}
          onDashboard={handleDashboard}
        />
      </div>
    );
  }

  // Redirect to sign-in if showing signup prompt
  if (!user && showSignupPrompt) {
    router.push('/sign-in');
    setShowSignupPrompt(false);
    return null;
  }




  // Fallback - redirect to landing if no valid view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Redirecting to home...</p>
        <Button onClick={handleBackToLanding} variant="outline">
          Go to Home
        </Button>
      </div>
    </div>
  );
}

function HomeContent() {
  return <HomePage />;
}

export default function Home() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </SessionContextProvider>
  );
}
