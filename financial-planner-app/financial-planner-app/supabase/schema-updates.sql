-- Enhanced schema for comprehensive financial planning data capture

-- 1. Add JSONB storage for complete form responses
CREATE TABLE public.financial_questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  form_version TEXT NOT NULL DEFAULT '2024.1', -- Track schema versions
  questionnaire_data JSONB NOT NULL, -- Complete form responses
  completion_status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'submitted'
  sections_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- Track completed sections
  overall_progress DECIMAL(5,2) DEFAULT 0.00, -- Percentage complete
  last_section_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  UNIQUE(user_id) -- One active questionnaire per user
);

-- 2. Add analysis storage for Claude API responses
CREATE TABLE public.financial_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  questionnaire_id UUID REFERENCES financial_questionnaire_responses(id) NOT NULL,
  analysis_type TEXT NOT NULL, -- 'comprehensive', 'focused', 'update'
  claude_request_data JSONB NOT NULL, -- Data sent to Claude
  claude_response JSONB NOT NULL, -- Full Claude response
  analysis_summary TEXT, -- Key insights extracted
  recommendations JSONB, -- Structured recommendations
  risk_assessment JSONB, -- Risk analysis results
  action_items JSONB, -- Prioritized action items
  confidence_score DECIMAL(3,2), -- AI confidence in analysis (0-1)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'), -- Analysis freshness
  is_current BOOLEAN DEFAULT TRUE
);

-- 3. Enhanced user profiles with additional metadata
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS
  date_of_birth DATE,
  country TEXT DEFAULT 'United States',
  communication_preferences JSONB DEFAULT '{}',
  onboarding_completed_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  financial_complexity_score INTEGER DEFAULT 1; -- 1-10 scale

-- 4. Add comprehensive financial data tracking
CREATE TABLE public.financial_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  snapshot_date DATE DEFAULT CURRENT_DATE,
  net_worth DECIMAL(15,2),
  liquid_assets DECIMAL(15,2),
  monthly_income DECIMAL(12,2),
  monthly_expenses DECIMAL(12,2),
  debt_to_income_ratio DECIMAL(5,4),
  savings_rate DECIMAL(5,4),
  emergency_fund_months DECIMAL(4,2),
  retirement_on_track BOOLEAN,
  calculated_data JSONB, -- Additional calculated metrics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Form field validation tracking
CREATE TABLE public.form_validation_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  section_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  validation_type TEXT NOT NULL, -- 'error', 'warning', 'info'
  validation_message TEXT NOT NULL,
  field_value TEXT, -- The value that caused validation issue
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. API interaction logging
CREATE TABLE public.claude_api_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  request_type TEXT NOT NULL, -- 'analysis', 'follow_up', 'update'
  tokens_used INTEGER,
  cost_estimate DECIMAL(8,4), -- Estimated API cost
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_questionnaire_responses_user ON financial_questionnaire_responses(user_id);
CREATE INDEX idx_questionnaire_responses_status ON financial_questionnaire_responses(completion_status);
CREATE INDEX idx_financial_analysis_user ON financial_analysis(user_id);
CREATE INDEX idx_financial_analysis_current ON financial_analysis(user_id, is_current) WHERE is_current = TRUE;
CREATE INDEX idx_financial_snapshots_user_date ON financial_snapshots(user_id, snapshot_date);
CREATE INDEX idx_claude_api_log_user_created ON claude_api_log(user_id, created_at);

-- JSONB indexes for efficient querying
CREATE INDEX idx_questionnaire_data_gin ON financial_questionnaire_responses USING GIN (questionnaire_data);
CREATE INDEX idx_analysis_recommendations_gin ON financial_analysis USING GIN (recommendations);

-- Enable Row Level Security
ALTER TABLE financial_questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_validation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_api_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own questionnaire responses"
  ON financial_questionnaire_responses FOR ALL
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

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_questionnaire_responses
    BEFORE UPDATE ON financial_questionnaire_responses
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Functions for data processing
CREATE OR REPLACE FUNCTION calculate_financial_metrics(user_data JSONB)
RETURNS JSONB AS $$
DECLARE
  metrics JSONB := '{}';
  monthly_income DECIMAL;
  monthly_expenses DECIMAL;
  total_assets DECIMAL;
  total_liabilities DECIMAL;
BEGIN
  -- Extract key financial data and calculate metrics
  monthly_income := COALESCE((user_data->'income'->>'takeHomePay')::DECIMAL, 0);
  monthly_expenses := COALESCE((user_data->'expenses'->>'totalMonthly')::DECIMAL, 0);
  
  -- Build metrics JSON
  metrics := jsonb_build_object(
    'monthly_surplus', monthly_income - monthly_expenses,
    'savings_rate', CASE WHEN monthly_income > 0 THEN (monthly_income - monthly_expenses) / monthly_income ELSE 0 END,
    'calculated_at', NOW()
  );
  
  RETURN metrics;
END;
$$ LANGUAGE plpgsql;