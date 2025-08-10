-- Drop all triggers temporarily to see if they're causing the issue
DROP TRIGGER IF EXISTS handle_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS handle_updated_at ON public.client_income;
DROP TRIGGER IF EXISTS handle_updated_at ON public.client_expenses;
DROP TRIGGER IF EXISTS handle_updated_at ON public.client_assets;
DROP TRIGGER IF EXISTS handle_updated_at ON public.client_liabilities;
DROP TRIGGER IF EXISTS handle_updated_at ON public.auto_loans;
DROP TRIGGER IF EXISTS handle_updated_at ON public.credit_cards;
DROP TRIGGER IF EXISTS handle_updated_at ON public.student_loans;
DROP TRIGGER IF EXISTS handle_updated_at ON public.client_goals;
DROP TRIGGER IF EXISTS handle_updated_at ON public.client_preferences;
DROP TRIGGER IF EXISTS handle_updated_at ON public.client_risk_assessment;
DROP TRIGGER IF EXISTS handle_updated_at ON public.financial_analyses;
DROP TRIGGER IF EXISTS handle_updated_at ON public.plan_implementations;

-- Also drop the function if it's problematic
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Check if this resolves the auth issue