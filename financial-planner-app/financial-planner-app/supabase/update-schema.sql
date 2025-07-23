-- =============================================================================
-- MINIMAL SCHEMA UPDATE FOR COMPLETE QUESTIONNAIRE
-- Only adds missing tables/columns - won't conflict with existing setup
-- =============================================================================

-- Enable extensions (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ADD MISSING CORE TABLE FOR QUESTIONNAIRE
-- =============================================================================

-- Financial Questionnaire Responses (JSONB Storage) - THE KEY TABLE
CREATE TABLE IF NOT EXISTS public.financial_questionnaire_responses (
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
-- 2. ADD MISSING ANALYSIS & LOGGING TABLES
-- =============================================================================

-- Claude API Analysis Results
CREATE TABLE IF NOT EXISTS public.financial_analysis (
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

-- Financial Snapshots for Historical Tracking
CREATE TABLE IF NOT EXISTS public.financial_snapshots (
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

-- Claude API Usage Logging
CREATE TABLE IF NOT EXISTS public.claude_api_log (
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

-- =============================================================================
-- 3. UPDATE EXISTING USER_PROFILES TABLE (SAFE ADDITIONS)
-- =============================================================================

-- Add missing columns to existing user_profiles (safe - won't conflict)
DO $$ 
BEGIN
    -- Add date_of_birth if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'date_of_birth') THEN
        ALTER TABLE public.user_profiles ADD COLUMN date_of_birth DATE;
    END IF;
    
    -- Add country if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'country') THEN
        ALTER TABLE public.user_profiles ADD COLUMN country TEXT DEFAULT 'United States';
    END IF;
    
    -- Add communication_preferences if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'communication_preferences') THEN
        ALTER TABLE public.user_profiles ADD COLUMN communication_preferences JSONB DEFAULT '{}';
    END IF;
    
    -- Add onboarding_completed_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed_at') THEN
        ALTER TABLE public.user_profiles ADD COLUMN onboarding_completed_at TIMESTAMPTZ;
    END IF;
    
    -- Add financial_complexity_score if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'financial_complexity_score') THEN
        ALTER TABLE public.user_profiles ADD COLUMN financial_complexity_score INTEGER DEFAULT 1;
    END IF;
END $$;

-- =============================================================================
-- 4. CREATE ESSENTIAL INDEXES (SAFE - ONLY IF NOT EXISTS)
-- =============================================================================

-- Core indexes for performance
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user ON financial_questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_status ON financial_questionnaire_responses(completion_status);
CREATE INDEX IF NOT EXISTS idx_financial_analysis_user ON financial_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_analysis_current ON financial_analysis(user_id, is_current) WHERE is_current = TRUE;
CREATE INDEX IF NOT EXISTS idx_financial_snapshots_user_date ON financial_snapshots(user_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_claude_api_log_user_created ON claude_api_log(user_id, created_at);

-- JSONB indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_questionnaire_data_gin ON financial_questionnaire_responses USING GIN (questionnaire_data);
CREATE INDEX IF NOT EXISTS idx_analysis_recommendations_gin ON financial_analysis USING GIN (recommendations);

-- =============================================================================
-- 5. ENABLE ROW LEVEL SECURITY (SAFE FOR NEW TABLES)
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE financial_questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_api_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (safe - only if not exists)
DO $$ 
BEGIN
    -- Questionnaire responses policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_questionnaire_responses' AND policyname = 'Users can manage their own questionnaire responses') THEN
        EXECUTE 'CREATE POLICY "Users can manage their own questionnaire responses" ON financial_questionnaire_responses FOR ALL TO authenticated USING (auth.uid() = user_id)';
    END IF;
    
    -- Financial analysis policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_analysis' AND policyname = 'Users can view their own financial analysis') THEN
        EXECUTE 'CREATE POLICY "Users can view their own financial analysis" ON financial_analysis FOR SELECT TO authenticated USING (auth.uid() = user_id)';
    END IF;
    
    -- Financial snapshots policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_snapshots' AND policyname = 'Users can view their own financial snapshots') THEN
        EXECUTE 'CREATE POLICY "Users can view their own financial snapshots" ON financial_snapshots FOR ALL TO authenticated USING (auth.uid() = user_id)';
    END IF;
    
    -- API log policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'claude_api_log' AND policyname = 'Users can view their own API logs') THEN
        EXECUTE 'CREATE POLICY "Users can view their own API logs" ON claude_api_log FOR SELECT TO authenticated USING (auth.uid() = user_id)';
    END IF;
END $$;

-- =============================================================================
-- 6. CREATE ESSENTIAL TRIGGERS (SAFE)
-- =============================================================================

-- Function to update timestamps (safe to recreate)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp trigger to questionnaire responses
DROP TRIGGER IF EXISTS set_timestamp_questionnaire_responses ON financial_questionnaire_responses;
CREATE TRIGGER set_timestamp_questionnaire_responses
  BEFORE UPDATE ON financial_questionnaire_responses
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Apply timestamp trigger to financial analysis
DROP TRIGGER IF EXISTS set_timestamp_financial_analysis ON financial_analysis;
CREATE TRIGGER set_timestamp_financial_analysis
  BEFORE UPDATE ON financial_analysis
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- =============================================================================
-- 7. VERIFICATION
-- =============================================================================

-- Check that essential tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('financial_questionnaire_responses', 'financial_analysis', 'user_profiles');
    
    IF table_count >= 3 THEN
        RAISE NOTICE 'SUCCESS: All essential tables are ready for questionnaire!';
        RAISE NOTICE 'You can now test your financial planning application.';
    ELSE
        RAISE NOTICE 'WARNING: Some tables may be missing. Expected at least 3, found %', table_count;
    END IF;
END $$;