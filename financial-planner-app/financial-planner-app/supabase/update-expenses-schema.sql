-- Update client_expenses table to match new expense categories
-- Since there's no existing data, we can safely drop and recreate columns

-- Drop old expense columns
ALTER TABLE public.client_expenses 
DROP COLUMN IF EXISTS housing_payment,
DROP COLUMN IF EXISTS monthly_food_groceries,
DROP COLUMN IF EXISTS monthly_utilities,
DROP COLUMN IF EXISTS monthly_transportation,
DROP COLUMN IF EXISTS monthly_entertainment;

-- Add new expense columns to match the updated Expenses interface
ALTER TABLE public.client_expenses 
ADD COLUMN housing decimal(10,2),
ADD COLUMN transportation decimal(10,2),
ADD COLUMN travel decimal(10,2),
ADD COLUMN recreation decimal(10,2),
ADD COLUMN food decimal(10,2),
ADD COLUMN healthcare decimal(10,2),
ADD COLUMN shopping decimal(10,2),
ADD COLUMN technology decimal(10,2),
ADD COLUMN personal_care decimal(10,2),
ADD COLUMN entertainment decimal(10,2),
ADD COLUMN fixed_vs_variable_ratio text,
ADD COLUMN seasonal_variations text,
ADD COLUMN recent_expense_changes text,
ADD COLUMN potential_reductions text;

-- Add comments for clarity
COMMENT ON COLUMN public.client_expenses.housing IS 'Mortgage + utilities + home expenses';
COMMENT ON COLUMN public.client_expenses.transportation IS 'Auto finance + gas + service + rideshare';
COMMENT ON COLUMN public.client_expenses.travel IS 'Flights and lodging';
COMMENT ON COLUMN public.client_expenses.recreation IS 'All recreation expenses';
COMMENT ON COLUMN public.client_expenses.food IS 'Groceries + dining';
COMMENT ON COLUMN public.client_expenses.healthcare IS 'Medical + pet care + insurance';
COMMENT ON COLUMN public.client_expenses.shopping IS 'Online + clothing';
COMMENT ON COLUMN public.client_expenses.technology IS 'Apps and subscriptions';
COMMENT ON COLUMN public.client_expenses.personal_care IS 'Haircuts, personal items';
COMMENT ON COLUMN public.client_expenses.entertainment IS 'Streaming services';