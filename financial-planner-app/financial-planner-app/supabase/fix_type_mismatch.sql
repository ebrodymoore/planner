-- Fix the type mismatch error in RLS policies
-- The error occurs because user_id columns have different types in different tables

-- First check what type user_id is in each table
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE column_name = 'user_id' 
AND table_schema = 'public'
ORDER BY table_name;

-- Fix financial_questionnaire_responses policy (user_id is likely TEXT)
DROP POLICY IF EXISTS "Users can manage their own questionnaire responses" ON public.financial_questionnaire_responses;

CREATE POLICY "Users can manage their own questionnaire responses" ON public.financial_questionnaire_responses 
FOR ALL USING (auth.uid()::text = user_id);

-- Fix any other policies that might have type mismatches
-- Most tables should have user_id as UUID, but some legacy tables might be TEXT