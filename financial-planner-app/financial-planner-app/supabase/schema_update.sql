-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS public.plan_implementations;
DROP TABLE IF EXISTS public.financial_analyses;
DROP TABLE IF EXISTS public.client_risk_assessment;
DROP TABLE IF EXISTS public.client_preferences;
DROP TABLE IF EXISTS public.client_goals;
DROP TABLE IF EXISTS public.student_loans;
DROP TABLE IF EXISTS public.credit_cards;
DROP TABLE IF EXISTS public.auto_loans;
DROP TABLE IF EXISTS public.client_liabilities;
DROP TABLE IF EXISTS public.client_assets;
DROP TABLE IF EXISTS public.client_expenses;
DROP TABLE IF EXISTS public.client_income;
DROP TABLE IF EXISTS public.user_profiles;

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create user profiles table
create table public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text,
  age integer,
  marital_status text,
  dependents integer,
  dependent_ages integer[],
  state text,
  employment_status text,
  industry text,
  profession text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create income table
create table public.client_income (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  annual_gross decimal(12,2),
  stability text,
  growth_expectation text,
  spouse_income decimal(12,2),
  rental_income decimal(12,2),
  investment_income decimal(12,2),
  expected_retirement_age integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create expenses table
create table public.client_expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  housing_payment decimal(10,2),
  housing_type text,
  monthly_food_groceries decimal(10,2),
  monthly_utilities decimal(10,2),
  monthly_transportation decimal(10,2),
  monthly_entertainment decimal(10,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create assets table
create table public.client_assets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  checking_balance decimal(12,2),
  savings_balance decimal(12,2),
  emergency_fund_target text,
  retirement_401k decimal(12,2),
  ira_balance decimal(12,2),
  taxable_accounts decimal(12,2),
  primary_residence_value decimal(12,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create liabilities table (primary mortgage)
create table public.client_liabilities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  mortgage_balance decimal(12,2),
  mortgage_rate decimal(5,3),
  mortgage_years_remaining integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create auto loans table (multiple allowed)
create table public.auto_loans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  balance decimal(10,2) not null,
  rate decimal(5,3) not null,
  term text not null,
  description text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create credit cards table (multiple allowed) - FIXED: limit -> credit_limit
create table public.credit_cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  balance decimal(10,2) not null,
  credit_limit decimal(10,2) not null,
  rate decimal(5,3) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create student loans table (multiple allowed)
create table public.student_loans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  balance decimal(10,2) not null,
  rate decimal(5,3) not null,
  servicer text not null,
  type text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create financial goals table
create table public.client_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  retirement_priority integer,
  emergency_priority integer,
  debt_priority integer,
  retirement_target_age integer,
  retirement_desired_income decimal(12,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create client preferences table
create table public.client_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  second_home_interest text,
  second_home_budget decimal(12,2),
  business_interest text,
  business_capital decimal(12,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create risk assessment table
create table public.client_risk_assessment (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  experience_level text,
  largest_loss text,
  portfolio_drop_response text,
  investment_timeline text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Create financial analyses table
create table public.financial_analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  analysis_date timestamp with time zone default now(),
  claude_response jsonb,
  recommendations jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create plan implementations table
create table public.plan_implementations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  recommendation_id uuid references public.financial_analyses,
  status text default 'pending',
  target_date date,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.client_income enable row level security;
alter table public.client_expenses enable row level security;
alter table public.client_assets enable row level security;
alter table public.client_liabilities enable row level security;
alter table public.auto_loans enable row level security;
alter table public.credit_cards enable row level security;
alter table public.student_loans enable row level security;
alter table public.client_goals enable row level security;
alter table public.client_preferences enable row level security;
alter table public.client_risk_assessment enable row level security;
alter table public.financial_analyses enable row level security;
alter table public.plan_implementations enable row level security;

-- Create policies for user data access
create policy "Users can view own profile" on public.user_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.user_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = user_id);

create policy "Users can view own income" on public.client_income for select using (auth.uid() = user_id);
create policy "Users can insert own income" on public.client_income for insert with check (auth.uid() = user_id);
create policy "Users can update own income" on public.client_income for update using (auth.uid() = user_id);

create policy "Users can view own expenses" on public.client_expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on public.client_expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on public.client_expenses for update using (auth.uid() = user_id);

create policy "Users can view own assets" on public.client_assets for select using (auth.uid() = user_id);
create policy "Users can insert own assets" on public.client_assets for insert with check (auth.uid() = user_id);
create policy "Users can update own assets" on public.client_assets for update using (auth.uid() = user_id);

create policy "Users can view own liabilities" on public.client_liabilities for select using (auth.uid() = user_id);
create policy "Users can insert own liabilities" on public.client_liabilities for insert with check (auth.uid() = user_id);
create policy "Users can update own liabilities" on public.client_liabilities for update using (auth.uid() = user_id);

create policy "Users can view own auto loans" on public.auto_loans for select using (auth.uid() = user_id);
create policy "Users can insert own auto loans" on public.auto_loans for insert with check (auth.uid() = user_id);
create policy "Users can update own auto loans" on public.auto_loans for update using (auth.uid() = user_id);
create policy "Users can delete own auto loans" on public.auto_loans for delete using (auth.uid() = user_id);

create policy "Users can view own credit cards" on public.credit_cards for select using (auth.uid() = user_id);
create policy "Users can insert own credit cards" on public.credit_cards for insert with check (auth.uid() = user_id);
create policy "Users can update own credit cards" on public.credit_cards for update using (auth.uid() = user_id);
create policy "Users can delete own credit cards" on public.credit_cards for delete using (auth.uid() = user_id);

create policy "Users can view own student loans" on public.student_loans for select using (auth.uid() = user_id);
create policy "Users can insert own student loans" on public.student_loans for insert with check (auth.uid() = user_id);
create policy "Users can update own student loans" on public.student_loans for update using (auth.uid() = user_id);
create policy "Users can delete own student loans" on public.student_loans for delete using (auth.uid() = user_id);

create policy "Users can view own goals" on public.client_goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.client_goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.client_goals for update using (auth.uid() = user_id);

create policy "Users can view own preferences" on public.client_preferences for select using (auth.uid() = user_id);
create policy "Users can insert own preferences" on public.client_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own preferences" on public.client_preferences for update using (auth.uid() = user_id);

create policy "Users can view own risk assessment" on public.client_risk_assessment for select using (auth.uid() = user_id);
create policy "Users can insert own risk assessment" on public.client_risk_assessment for insert with check (auth.uid() = user_id);
create policy "Users can update own risk assessment" on public.client_risk_assessment for update using (auth.uid() = user_id);

create policy "Users can view own analyses" on public.financial_analyses for select using (auth.uid() = user_id);
create policy "Users can insert own analyses" on public.financial_analyses for insert with check (auth.uid() = user_id);
create policy "Users can update own analyses" on public.financial_analyses for update using (auth.uid() = user_id);

create policy "Users can view own implementations" on public.plan_implementations for select using (auth.uid() = user_id);
create policy "Users can insert own implementations" on public.plan_implementations for insert with check (auth.uid() = user_id);
create policy "Users can update own implementations" on public.plan_implementations for update using (auth.uid() = user_id);

-- Create functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_updated_at before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.client_income
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.client_expenses
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.client_assets
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.client_liabilities
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.auto_loans
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.credit_cards
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.student_loans
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.client_goals
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.client_preferences
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.client_risk_assessment
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.financial_analyses
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.plan_implementations
  for each row execute procedure public.handle_updated_at();