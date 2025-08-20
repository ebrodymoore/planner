-- =============================================================================
-- FIX RLS POLICIES FOR FINANCIAL_ANALYSIS TABLE
-- =============================================================================
-- 
-- Problem: financial_analysis table has RLS enabled but only has SELECT policy,
--          which prevents INSERT operations needed for saving analysis results.
--
-- Error: "new row violates row-level security policy for table financial_analysis"
--
-- Solution: Replace SELECT-only policy with comprehensive FOR ALL policy
--           that allows users to manage their own financial analysis records.
--
-- =============================================================================

-- Drop the existing SELECT-only policy
DROP POLICY IF EXISTS "Users can view their own financial analysis" ON financial_analysis;

-- Create comprehensive policy that allows users to manage their own financial analysis
CREATE POLICY "Users can manage their own financial analysis"
  ON financial_analysis FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verify the policy was created successfully
DO $$
BEGIN
  -- Check if the policy exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'financial_analysis' 
    AND policyname = 'Users can manage their own financial analysis'
  ) THEN
    RAISE NOTICE 'SUCCESS: RLS policy "Users can manage their own financial analysis" has been created for financial_analysis table';
  ELSE
    RAISE NOTICE 'ERROR: Failed to create RLS policy for financial_analysis table';
  END IF;
END $$;

-- Display current policies for verification
SELECT 
  'financial_analysis RLS policies' as info,
  policyname,
  cmd as allowed_operations,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'financial_analysis'
ORDER BY policyname;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
--
-- This migration fixes the RLS policy for financial_analysis table to allow:
-- ✅ INSERT - Users can save new analysis results
-- ✅ SELECT - Users can view their own analysis  
-- ✅ UPDATE - Users can update their analysis records
-- ✅ DELETE - Users can delete their analysis records
-- 
-- Security is maintained: Users can only access their own data via auth.uid() = user_id
-- 
-- =============================================================================