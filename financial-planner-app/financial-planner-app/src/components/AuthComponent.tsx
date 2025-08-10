'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowRight, Shield, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';

// Helper function to create user profile after signup
async function createUserProfile(userId: string, email: string) {
  console.log('🔧 [DEBUG] Creating user profile for:', { userId, email });
  
  try {
    // First check current auth state
    const { data: authData, error: authError } = await supabase.auth.getUser();
    console.log('🔧 [DEBUG] Current auth state:', { 
      user: authData?.user?.id, 
      error: authError?.message 
    });

    // Check if profile already exists
    const { data: existing, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    console.log('🔧 [DEBUG] Existing profile check:', { 
      existing, 
      checkError: checkError?.message,
      checkErrorCode: checkError?.code 
    });

    if (existing) {
      console.log('🔧 [DEBUG] Profile already exists, skipping creation');
      return null;
    }

    // Create profile with detailed logging
    const profileData = {
      user_id: userId,
      name: email.split('@')[0], // Use email prefix as default name
    };
    
    console.log('🔧 [DEBUG] Attempting to insert profile:', profileData);

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    console.log('🔧 [DEBUG] Profile creation result:', { 
      data, 
      error: error?.message,
      errorCode: error?.code,
      errorDetails: error?.details,
      errorHint: error?.hint 
    });

    return error;
  } catch (err) {
    console.error('🔧 [DEBUG] Exception in createUserProfile:', err);
    return err;
  }
}

export default function AuthComponent() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    console.log('🚀 [DEBUG] Starting authentication process:', { isSignUp, email });

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        console.log('🚀 [DEBUG] Calling supabase.auth.signUp...');
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL || 'https://planner-phi-jet.vercel.app'
          }
        });
        
        console.log('🚀 [DEBUG] SignUp response:', { 
          user: data?.user?.id, 
          session: data?.session?.access_token ? 'present' : 'null',
          error: error?.message,
          errorCode: error?.code,
          errorStatus: error?.status 
        });
        
        if (error) {
          console.error('🚀 [DEBUG] SignUp error details:', error);
          throw error;
        }
        
        // Create user profile after successful signup
        if (data.user) {
          console.log('🚀 [DEBUG] User created successfully, creating profile...');
          const profileError = await createUserProfile(data.user.id, email);
          if (profileError) {
            console.error('🚀 [DEBUG] Profile creation failed:', profileError);
            setError(`Account created but profile setup failed: ${(profileError as any)?.message || 'Unknown error'}`);
            return;
          } else {
            console.log('🚀 [DEBUG] Profile created successfully');
          }
        } else {
          console.warn('🚀 [DEBUG] No user data returned from signUp');
        }
        
        setMessage('Account created successfully! Redirecting to your dashboard...');
      } else {
        console.log('🚀 [DEBUG] Attempting sign in...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        console.log('🚀 [DEBUG] SignIn response:', { 
          user: data?.user?.id, 
          session: data?.session?.access_token ? 'present' : 'null',
          error: error?.message 
        });
        
        if (error) throw error;
        setMessage('Welcome back! Redirecting to your dashboard...');
      }
    } catch (error: any) {
      console.error('🚀 [DEBUG] Authentication error:', error);
      console.error('🚀 [DEBUG] Error stack:', error.stack);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form when switching between login/signup
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
  };

  if (isSignUp) {
    // SIGNUP SCREEN - More visual, benefit-focused
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ContextFi</span>
              </div>
              
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Get Your Financial Plan
              </CardTitle>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                Join thousands who've taken control of their financial future with personalized, AI-powered guidance.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Personalized plans</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>AI-powered insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Real-world scenarios</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Secure & private</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Choose a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="bg-green-900/50 border-green-500/50">
                    <AlertDescription className="text-green-200">{message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 text-lg rounded-xl"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Start My Financial Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  By signing up, you agree to our terms and privacy policy. Your financial data is encrypted and secure.
                </p>
              </form>

              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-center text-slate-400 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN - Clean, minimal, focused
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardHeader className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ContextFi</span>
            </div>
            
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            
            <p className="text-slate-300">
              Sign in to continue your financial planning journey
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <button 
                    type="button" 
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="bg-green-900/50 border-green-500/50">
                  <AlertDescription className="text-green-200">{message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                New to ContextFi?{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Create your account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}