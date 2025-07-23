-- =============================================================================
-- COMPLETE SUPABASE SETUP FOR FINANCIAL PLANNING APPLICATION
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USER PROFILES & AUTHENTICATION
-- =============================================================================

-- Enhanced user profiles table
CREATE TABLE public.user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Personal Information
  name TEXT,
  date_of_birth DATE,
  marital_status TEXT,
  dependents INTEGER DEFAULT 0,
  dependent_ages TEXT,
  state TEXT,
  country TEXT DEFAULT 'United States',
  
  -- Professional Information
  employment_status TEXT,
  industry TEXT,
  profession TEXT,
  
  -- Communication Preferences
  communication_method TEXT DEFAULT 'email',
  meeting_frequency TEXT DEFAULT 'quarterly',
  communication_preferences JSONB DEFAULT '{}',
  
  -- Application Metadata
  onboarding_completed_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  financial_complexity_score INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- =============================================================================
-- 2. FINANCIAL QUESTIONNAIRE RESPONSES (JSONB STORAGE)
-- =============================================================================

CREATE TABLE public.financial_questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Form Management
  form_version TEXT NOT NULL DEFAULT '2024.1',
  questionnaire_data JSONB NOT NULL DEFAULT '{}',
  
  -- Progress Tracking
  completion_status TEXT DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed', 'submitted')),
  sections_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  overall_progress DECIMAL(5,2) DEFAULT 0.00,
  last_section_completed INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  
  UNIQUE(user_id)
);

-- =============================================================================
-- 3. NORMALIZED FINANCIAL DATA TABLES (FOR CALCULATIONS & REPORTING)
-- =============================================================================

-- Income Table
CREATE TABLE public.client_income (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Primary Income
  annual_gross DECIMAL(12,2),
  monthly_take_home DECIMAL(12,2),
  stability TEXT,
  growth_expectation TEXT,
  
  -- Additional Income Sources
  spouse_income DECIMAL(12,2) DEFAULT 0,
  business_income DECIMAL(12,2) DEFAULT 0,
  rental_income DECIMAL(12,2) DEFAULT 0,
  investment_income DECIMAL(12,2) DEFAULT 0,
  other_income DECIMAL(12,2) DEFAULT 0,
  other_income_description TEXT,
  
  -- Career Planning
  expected_retirement_age INTEGER,
  income_growth_rate DECIMAL(4,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Expenses Table
CREATE TABLE public.client_expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Housing
  housing_payment DECIMAL(10,2) DEFAULT 0,
  housing_type TEXT,
  utilities DECIMAL(8,2) DEFAULT 0,
  
  -- Living Expenses
  food_groceries DECIMAL(8,2) DEFAULT 0,
  transportation DECIMAL(8,2) DEFAULT 0,
  entertainment DECIMAL(8,2) DEFAULT 0,
  healthcare DECIMAL(8,2) DEFAULT 0,
  personal_care DECIMAL(8,2) DEFAULT 0,
  
  -- Calculated Fields
  total_monthly_expenses DECIMAL(10,2),
  essential_expenses DECIMAL(10,2),
  discretionary_expenses DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Assets Table
CREATE TABLE public.client_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Liquid Assets
  checking_balance DECIMAL(12,2) DEFAULT 0,
  savings_balance DECIMAL(12,2) DEFAULT 0,
  emergency_fund_target TEXT,
  
  -- Retirement Accounts
  retirement_401k DECIMAL(12,2) DEFAULT 0,
  ira_traditional DECIMAL(12,2) DEFAULT 0,
  ira_roth DECIMAL(12,2) DEFAULT 0,
  
  -- Investments
  taxable_accounts DECIMAL(12,2) DEFAULT 0,
  investment_property_value DECIMAL(12,2) DEFAULT 0,
  
  -- Real Estate
  primary_residence_value DECIMAL(12,2) DEFAULT 0,
  other_real_estate_value DECIMAL(12,2) DEFAULT 0,
  
  -- Other Assets
  business_value DECIMAL(12,2) DEFAULT 0,
  personal_property_value DECIMAL(12,2) DEFAULT 0,
  
  -- Calculated Fields
  total_liquid_assets DECIMAL(12,2),
  total_investment_assets DECIMAL(12,2),
  total_assets DECIMAL(12,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Liabilities Table
CREATE TABLE public.client_liabilities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Mortgage
  mortgage_balance DECIMAL(12,2) DEFAULT 0,
  mortgage_rate DECIMAL(5,3),
  mortgage_years_remaining INTEGER,
  mortgage_payment DECIMAL(10,2),
  
  -- Calculated Fields
  total_debt DECIMAL(12,2),
  monthly_debt_payments DECIMAL(10,2),
  debt_to_income_ratio DECIMAL(5,4),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Auto Loans (Multiple allowed)
CREATE TABLE public.auto_loans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  vehicle_description TEXT,
  balance DECIMAL(10,2) NOT NULL,
  rate DECIMAL(5,3) NOT NULL,
  monthly_payment DECIMAL(8,2),
  remaining_term_months INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Cards (Multiple allowed)
CREATE TABLE public.credit_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  card_name TEXT NOT NULL,
  balance DECIMAL(10,2) NOT NULL,
  credit_limit DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,3) NOT NULL,
  minimum_payment DECIMAL(8,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Loans (Multiple allowed)
CREATE TABLE public.student_loans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  servicer TEXT,
  loan_type TEXT, -- federal, private, etc.
  balance DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,3) NOT NULL,
  monthly_payment DECIMAL(8,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. FINANCIAL ANALYSIS & AI INTEGRATION
-- =============================================================================

-- Claude API Analysis Results
CREATE TABLE public.financial_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  questionnaire_id UUID REFERENCES financial_questionnaire_responses(id) ON DELETE CASCADE NOT NULL,
  
  -- Analysis Metadata
  analysis_type TEXT NOT NULL DEFAULT 'comprehensive',
  analysis_version TEXT DEFAULT '1.0',
  
  -- Claude API Data
  claude_request_data JSONB NOT NULL,
  claude_response JSONB NOT NULL,
  
  -- Structured Analysis Results
  analysis_summary TEXT,
  recommendations JSONB DEFAULT '[]',
  risk_assessment JSONB DEFAULT '{}',
  action_items JSONB DEFAULT '[]',
  
  -- Quality Metrics
  confidence_score DECIMAL(3,2),
  data_completeness_score DECIMAL(3,2),
  
  -- Status
  is_current BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. FINANCIAL TRACKING & SNAPSHOTS
-- =============================================================================

-- Financial Snapshots for Historical Tracking
CREATE TABLE public.financial_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Snapshot Date
  snapshot_date DATE DEFAULT CURRENT_DATE,
  
  -- Key Financial Metrics
  net_worth DECIMAL(15,2),
  liquid_assets DECIMAL(15,2),
  total_debt DECIMAL(15,2),
  
  -- Cash Flow Metrics
  monthly_income DECIMAL(12,2),
  monthly_expenses DECIMAL(12,2),
  monthly_surplus DECIMAL(12,2),
  
  -- Ratios and Percentages
  debt_to_income_ratio DECIMAL(5,4),
  savings_rate DECIMAL(5,4),
  emergency_fund_months DECIMAL(4,2),
  
  -- Goal Progress
  retirement_on_track BOOLEAN DEFAULT FALSE,
  emergency_fund_adequate BOOLEAN DEFAULT FALSE,
  
  -- Additional Calculated Data
  calculated_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. LOGGING & MONITORING TABLES
-- =============================================================================

-- Form Validation Logging
CREATE TABLE public.form_validation_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  section_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  validation_type TEXT NOT NULL CHECK (validation_type IN ('error', 'warning', 'info')),
  validation_message TEXT NOT NULL,
  field_value TEXT,
  
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claude API Usage Logging
CREATE TABLE public.claude_api_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  request_type TEXT NOT NULL,
  request_size INTEGER,
  response_size INTEGER,
  tokens_used INTEGER,
  cost_estimate DECIMAL(8,4),
  response_time_ms INTEGER,
  
  success BOOLEAN DEFAULT TRUE,
  error_code TEXT,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application Usage Analytics
CREATE TABLE public.usage_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  session_id UUID DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. PERFORMANCE INDEXES
-- =============================================================================

-- User Profile Indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_created ON user_profiles(created_at);

-- Questionnaire Response Indexes
CREATE INDEX idx_questionnaire_responses_user ON financial_questionnaire_responses(user_id);
CREATE INDEX idx_questionnaire_responses_status ON financial_questionnaire_responses(completion_status);
CREATE INDEX idx_questionnaire_responses_updated ON financial_questionnaire_responses(updated_at);

-- Financial Data Indexes
CREATE INDEX idx_client_income_user ON client_income(user_id);
CREATE INDEX idx_client_expenses_user ON client_expenses(user_id);
CREATE INDEX idx_client_assets_user ON client_assets(user_id);
CREATE INDEX idx_client_liabilities_user ON client_liabilities(user_id);

-- Debt Tables Indexes
CREATE INDEX idx_auto_loans_user ON auto_loans(user_id);
CREATE INDEX idx_credit_cards_user ON credit_cards(user_id);
CREATE INDEX idx_student_loans_user ON student_loans(user_id);

-- Analysis Indexes
CREATE INDEX idx_financial_analysis_user ON financial_analysis(user_id);
CREATE INDEX idx_financial_analysis_current ON financial_analysis(user_id, is_current) WHERE is_current = TRUE;
CREATE INDEX idx_financial_analysis_created ON financial_analysis(created_at);

-- Snapshot Indexes
CREATE INDEX idx_financial_snapshots_user_date ON financial_snapshots(user_id, snapshot_date);
CREATE INDEX idx_financial_snapshots_user_created ON financial_snapshots(user_id, created_at);

-- Logging Indexes
CREATE INDEX idx_claude_api_log_user_created ON claude_api_log(user_id, created_at);
CREATE INDEX idx_form_validation_user_created ON form_validation_log(user_id, created_at);
CREATE INDEX idx_usage_analytics_user_created ON usage_analytics(user_id, created_at);

-- JSONB Indexes for Efficient Querying
CREATE INDEX idx_questionnaire_data_gin ON financial_questionnaire_responses USING GIN (questionnaire_data);
CREATE INDEX idx_analysis_recommendations_gin ON financial_analysis USING GIN (recommendations);
CREATE INDEX idx_analysis_risk_gin ON financial_analysis USING GIN (risk_assessment);
CREATE INDEX idx_snapshots_calculated_gin ON financial_snapshots USING GIN (calculated_data);

-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_validation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_api_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for User Data Access
CREATE POLICY "Users can manage their own profile"
  ON user_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own questionnaire responses"
  ON financial_questionnaire_responses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own financial data"
  ON client_income FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own expense data"
  ON client_expenses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own asset data"
  ON client_assets FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own liability data"
  ON client_liabilities FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own auto loans"
  ON auto_loans FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own credit cards"
  ON credit_cards FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own student loans"
  ON student_loans FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own financial analysis"
  ON financial_analysis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own financial snapshots"
  ON financial_snapshots FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own validation logs"
  ON form_validation_log FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own API logs"
  ON claude_api_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Analytics policy (optional - for user behavior tracking)
CREATE POLICY "Users can insert their own analytics"
  ON usage_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 9. TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to relevant tables
CREATE TRIGGER set_timestamp_user_profiles
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_questionnaire_responses
  BEFORE UPDATE ON financial_questionnaire_responses
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_client_income
  BEFORE UPDATE ON client_income
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_client_expenses
  BEFORE UPDATE ON client_expenses
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_client_assets
  BEFORE UPDATE ON client_assets
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_client_liabilities
  BEFORE UPDATE ON client_liabilities
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_auto_loans
  BEFORE UPDATE ON auto_loans
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_credit_cards
  BEFORE UPDATE ON credit_cards
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_student_loans
  BEFORE UPDATE ON student_loans
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_financial_analysis
  BEFORE UPDATE ON financial_analysis
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Function to calculate financial metrics
CREATE OR REPLACE FUNCTION calculate_financial_metrics(user_data JSONB)
RETURNS JSONB AS $$
DECLARE
  metrics JSONB := '{}';
  monthly_income DECIMAL;
  monthly_expenses DECIMAL;
  total_assets DECIMAL;
  total_liabilities DECIMAL;
  net_worth DECIMAL;
  savings_rate DECIMAL;
BEGIN
  -- Extract key financial data
  monthly_income := COALESCE((user_data->'cashFlow'->>'takeHomePay')::DECIMAL, 0);
  monthly_expenses := COALESCE(
    (user_data->'cashFlow'->>'essentialExpenses')::DECIMAL + 
    (user_data->'cashFlow'->>'discretionaryExpenses')::DECIMAL, 0);
  
  -- Calculate savings rate
  IF monthly_income > 0 THEN
    savings_rate := (monthly_income - monthly_expenses) / monthly_income;
  ELSE
    savings_rate := 0;
  END IF;
  
  -- Build metrics JSON
  metrics := jsonb_build_object(
    'monthly_surplus', monthly_income - monthly_expenses,
    'savings_rate', savings_rate,
    'calculated_at', NOW(),
    'income_stability', COALESCE(user_data->'income'->>'stability', 'unknown'),
    'debt_level', CASE 
      WHEN monthly_expenses > monthly_income THEN 'concerning'
      WHEN savings_rate < 0.1 THEN 'high'
      WHEN savings_rate < 0.2 THEN 'moderate'
      ELSE 'low'
    END
  );
  
  RETURN metrics;
END;
$$ LANGUAGE plpgsql;

-- Function to update last login timestamp
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET last_login_at = NOW() 
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating last login
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE PROCEDURE update_user_last_login();

-- =============================================================================
-- 10. INITIAL DATA & CONFIGURATION
-- =============================================================================

-- Create application configuration table
CREATE TABLE public.app_configuration (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO app_configuration (config_key, config_value, description) VALUES
('questionnaire_version', '"2024.1"', 'Current questionnaire schema version'),
('analysis_expiry_days', '90', 'Days after which analysis results expire'),
('auto_save_interval', '2000', 'Auto-save interval in milliseconds'),
('max_claude_tokens', '4000', 'Maximum tokens per Claude API request'),
('feature_flags', '{"advanced_analysis": true, "beta_features": false}', 'Feature flags for the application');

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

-- Create a simple view to check setup completion
CREATE OR REPLACE VIEW setup_status AS
SELECT 
  'Database setup completed successfully' as status,
  NOW() as completed_at,
  (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'client_%' 
    OR table_name LIKE 'financial_%'
    OR table_name LIKE 'user_%'
  ) as tables_created;

-- Display setup status
SELECT * FROM setup_status;