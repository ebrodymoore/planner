-- Fix the type cast direction - need to cast the TEXT column to UUID, not UUID to TEXT

-- First run the query to check data types (run this first)
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE column_name = 'user_id' 
AND table_schema = 'public'
ORDER BY table_name;

-- Fix financial_questionnaire_responses policy with correct cast direction
DROP POLICY IF EXISTS "Users can manage their own questionnaire responses" ON public.financial_questionnaire_responses;

-- If user_id is TEXT, cast it to UUID for comparison
CREATE POLICY "Users can manage their own questionnaire responses" ON public.financial_questionnaire_responses 
FOR ALL USING (auth.uid() = user_id::uuid);

-- Alternative: If the above still fails, try this version
-- CREATE POLICY "Users can manage their own questionnaire responses" ON public.financial_questionnaire_responses 
-- FOR ALL USING (auth.uid()::text = user_id);