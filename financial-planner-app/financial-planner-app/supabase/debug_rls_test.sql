-- Test RLS policies for debugging
-- Run this manually in Supabase SQL editor to test current state

-- Check current RLS status
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled,
  (SELECT count(*) FROM pg_policies WHERE schemaname = n.schemaname AND tablename = n.tablename) as policy_count
FROM pg_tables n
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'financial_questionnaire_responses', 'financial_analysis')
ORDER BY tablename;

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'financial_questionnaire_responses', 'financial_analysis')
ORDER BY tablename, policyname;

-- Test current auth state (run this when logged in)
SELECT 
  'Current auth state' as info,
  auth.uid() as current_user_id,
  current_user as database_user,
  session_user as session_user;

-- Test user_profiles access
SELECT 'user_profiles test' as test, count(*) as count FROM public.user_profiles;

-- Test financial_questionnaire_responses access  
SELECT 'financial_questionnaire_responses test' as test, count(*) as count FROM public.financial_questionnaire_responses;

-- Test financial_analysis access
SELECT 'financial_analysis test' as test, count(*) as count FROM public.financial_analysis;