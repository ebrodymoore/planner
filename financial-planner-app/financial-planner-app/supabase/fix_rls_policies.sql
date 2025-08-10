-- First, temporarily disable RLS to allow testing
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_income DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_liabilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_risk_assessment DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_implementations DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view own income" ON public.client_income;
DROP POLICY IF EXISTS "Users can insert own income" ON public.client_income;
DROP POLICY IF EXISTS "Users can update own income" ON public.client_income;

DROP POLICY IF EXISTS "Users can view own expenses" ON public.client_expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON public.client_expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON public.client_expenses;

DROP POLICY IF EXISTS "Users can view own assets" ON public.client_assets;
DROP POLICY IF EXISTS "Users can insert own assets" ON public.client_assets;
DROP POLICY IF EXISTS "Users can update own assets" ON public.client_assets;

DROP POLICY IF EXISTS "Users can view own liabilities" ON public.client_liabilities;
DROP POLICY IF EXISTS "Users can insert own liabilities" ON public.client_liabilities;
DROP POLICY IF EXISTS "Users can update own liabilities" ON public.client_liabilities;

DROP POLICY IF EXISTS "Users can view own auto loans" ON public.auto_loans;
DROP POLICY IF EXISTS "Users can insert own auto loans" ON public.auto_loans;
DROP POLICY IF EXISTS "Users can update own auto loans" ON public.auto_loans;
DROP POLICY IF EXISTS "Users can delete own auto loans" ON public.auto_loans;

DROP POLICY IF EXISTS "Users can view own credit cards" ON public.credit_cards;
DROP POLICY IF EXISTS "Users can insert own credit cards" ON public.credit_cards;
DROP POLICY IF EXISTS "Users can update own credit cards" ON public.credit_cards;
DROP POLICY IF EXISTS "Users can delete own credit cards" ON public.credit_cards;

DROP POLICY IF EXISTS "Users can view own student loans" ON public.student_loans;
DROP POLICY IF EXISTS "Users can insert own student loans" ON public.student_loans;
DROP POLICY IF EXISTS "Users can update own student loans" ON public.student_loans;
DROP POLICY IF EXISTS "Users can delete own student loans" ON public.student_loans;

DROP POLICY IF EXISTS "Users can view own goals" ON public.client_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.client_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.client_goals;

DROP POLICY IF EXISTS "Users can view own preferences" ON public.client_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.client_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.client_preferences;

DROP POLICY IF EXISTS "Users can view own risk assessment" ON public.client_risk_assessment;
DROP POLICY IF EXISTS "Users can insert own risk assessment" ON public.client_risk_assessment;
DROP POLICY IF EXISTS "Users can update own risk assessment" ON public.client_risk_assessment;

DROP POLICY IF EXISTS "Users can view own analyses" ON public.financial_analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON public.financial_analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON public.financial_analyses;

DROP POLICY IF EXISTS "Users can view own implementations" ON public.plan_implementations;
DROP POLICY IF EXISTS "Users can insert own implementations" ON public.plan_implementations;
DROP POLICY IF EXISTS "Users can update own implementations" ON public.plan_implementations;