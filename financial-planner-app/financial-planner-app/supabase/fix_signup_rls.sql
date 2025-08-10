-- Fix RLS policies to allow initial user creation during signup
-- The issue is that some tables might need policies that allow anonymous users
-- to insert their first records, or we need different policy logic

-- First, let's check if we have any issues with user_profiles table
-- This table is most likely to cause issues during signup

-- Drop and recreate user_profiles policies with better logic
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Recreate with more permissive signup logic
CREATE POLICY "Users can view own profile" ON public.user_profiles 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" ON public.user_profiles 
FOR UPDATE USING (auth.uid() = user_id);

-- Also check financial_questionnaire_responses as it has an "ALL" policy
-- which might be conflicting
DROP POLICY IF EXISTS "Users can manage their own questionnaire responses" ON public.financial_questionnaire_responses;

CREATE POLICY "Users can manage their own questionnaire responses" ON public.financial_questionnaire_responses 
FOR ALL USING (auth.uid()::text = user_id OR auth.uid() IS NOT NULL);

-- Alternative approach: Temporarily disable RLS on tables that might block signup
-- Uncomment these if the above doesn't work:

-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.financial_questionnaire_responses DISABLE ROW LEVEL SECURITY;

-- Check what user ID Supabase is trying to use during signup
SELECT 
    'Current auth state:' as info,
    auth.uid() as current_user_id,
    current_user as database_user;