-- =============================================================================
-- CHAT INFRASTRUCTURE FOR FINANCIAL PLANNING CHATBOT
-- =============================================================================
-- 
-- Purpose: Create database infrastructure to support ephemeral chatbot
--          conversations with comprehensive plan access control, rate limiting,
--          and usage analytics - WITHOUT storing conversation content.
--
-- Features:
-- - Session tracking without conversation storage
-- - Plan access validation and logging
-- - Rate limiting and abuse prevention  
-- - Enhanced API usage logging
-- - Automatic cleanup of old data
--
-- =============================================================================

-- =============================================================================
-- 1. CHAT SESSION MANAGEMENT (NO CONVERSATION STORAGE)
-- =============================================================================

-- Track chat sessions for analytics and rate limiting (no conversation content)
CREATE TABLE public.chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Session metadata
  session_started_at TIMESTAMPTZ DEFAULT NOW(),
  session_ended_at TIMESTAMPTZ,
  session_duration_seconds INTEGER,
  
  -- Usage tracking
  total_messages INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_cost_estimate DECIMAL(8,4) DEFAULT 0,
  
  -- Session status
  session_status TEXT DEFAULT 'active' CHECK (session_status IN ('active', 'ended', 'timeout', 'error')),
  
  -- Performance metrics
  avg_response_time_ms INTEGER,
  errors_encountered INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Client info (for debugging and analytics)
  user_agent TEXT,
  client_ip INET,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. ENHANCED API USAGE LOGGING (EXTEND EXISTING TABLE)
-- =============================================================================

-- Add chat-specific columns to existing claude_api_log table
DO $$
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'request_type_detail') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      request_type_detail TEXT; -- 'chat_message', 'chat_context', 'financial_analysis'
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'chat_session_id') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'message_count') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      message_count INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'conversation_turn') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      conversation_turn INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'topic_validation_passed') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      topic_validation_passed BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'stream_response') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      stream_response BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'context_tokens') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      context_tokens INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'response_tokens') THEN
    ALTER TABLE public.claude_api_log ADD COLUMN 
      response_tokens INTEGER DEFAULT 0;
  END IF;
END $$;

-- =============================================================================
-- 3. PLAN ACCESS VALIDATION AND LOGGING
-- =============================================================================

-- Track attempts to access premium features
CREATE TABLE public.plan_access_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Access attempt details
  feature_requested TEXT NOT NULL, -- 'chat', 'advanced_analysis', etc.
  plan_type TEXT NOT NULL, -- 'quick', 'comprehensive', 'none'
  access_granted BOOLEAN NOT NULL,
  access_denied_reason TEXT,
  
  -- Request context
  request_path TEXT,
  request_method TEXT,
  user_agent TEXT,
  client_ip INET,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. RATE LIMITING AND ABUSE PREVENTION
-- =============================================================================

-- Track API usage for rate limiting (prevents abuse)
CREATE TABLE public.chat_rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Time windows
  hour_window TIMESTAMPTZ NOT NULL, -- Rounded to hour
  day_window DATE NOT NULL,
  
  -- Usage counters
  messages_this_hour INTEGER DEFAULT 0,
  messages_this_day INTEGER DEFAULT 0,
  tokens_this_hour INTEGER DEFAULT 0,
  tokens_this_day INTEGER DEFAULT 0,
  
  -- Configurable limits (can be adjusted per user/plan)
  hourly_message_limit INTEGER DEFAULT 50,
  daily_message_limit INTEGER DEFAULT 200,
  hourly_token_limit INTEGER DEFAULT 50000,
  daily_token_limit INTEGER DEFAULT 200000,
  
  -- Status tracking
  is_rate_limited BOOLEAN DEFAULT FALSE,
  rate_limit_reset_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one record per user per time window
  UNIQUE(user_id, hour_window),
  UNIQUE(user_id, day_window)
);

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all new tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- Chat Sessions - Users can only access their own sessions
CREATE POLICY "Users can manage their own chat sessions"
  ON chat_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Plan Access Log - Users can view their access attempts, system can log
CREATE POLICY "Users can view their own access logs"
  ON plan_access_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can log access attempts"
  ON plan_access_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat Rate Limits - Users can view their limits, system can manage
CREATE POLICY "Users can view their own rate limits"
  ON chat_rate_limits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits"
  ON chat_rate_limits FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 6. DATABASE FUNCTIONS FOR CHAT OPERATIONS
-- =============================================================================

-- Function to validate chat access based on user's plan
CREATE OR REPLACE FUNCTION validate_chat_access(input_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  user_plan_type TEXT;
  access_result JSONB;
  questionnaire_exists BOOLEAN;
BEGIN
  -- Check if user has any questionnaire data
  SELECT EXISTS(
    SELECT 1 FROM financial_questionnaire_responses 
    WHERE user_id = input_user_id
  ) INTO questionnaire_exists;
  
  IF NOT questionnaire_exists THEN
    user_plan_type := 'none';
  ELSE
    -- Determine plan type based on questionnaire data
    SELECT 
      CASE 
        WHEN qr.questionnaire_data->'personal'->>'name' = 'Quick Plan User' THEN 'quick'
        WHEN (
          SELECT COUNT(*) 
          FROM jsonb_object_keys(qr.questionnaire_data) as keys(key)
          WHERE jsonb_typeof(qr.questionnaire_data->keys.key) = 'object'
            AND qr.questionnaire_data->keys.key != '{}'::jsonb
        ) < 7 THEN 'quick'
        ELSE 'comprehensive'
      END INTO user_plan_type
    FROM financial_questionnaire_responses qr
    WHERE qr.user_id = input_user_id;
  END IF;
  
  -- Build access result
  access_result := jsonb_build_object(
    'user_id', input_user_id,
    'plan_type', COALESCE(user_plan_type, 'none'),
    'chat_access', CASE WHEN user_plan_type = 'comprehensive' THEN true ELSE false END,
    'access_reason', CASE 
      WHEN user_plan_type = 'comprehensive' THEN 'comprehensive_plan_access'
      WHEN user_plan_type = 'quick' THEN 'upgrade_required'
      ELSE 'no_plan_found'
    END,
    'checked_at', NOW()
  );
  
  RETURN access_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limits before allowing chat message
CREATE OR REPLACE FUNCTION check_chat_rate_limit(input_user_id UUID, estimated_tokens INTEGER DEFAULT 1000)
RETURNS JSONB AS $$
DECLARE
  current_hour TIMESTAMPTZ;
  current_day DATE;
  rate_limit_record RECORD;
  is_limited BOOLEAN := FALSE;
  limit_reason TEXT := '';
BEGIN
  current_hour := date_trunc('hour', NOW());
  current_day := CURRENT_DATE;
  
  -- Ensure rate limit records exist for current time windows
  INSERT INTO chat_rate_limits (user_id, hour_window, day_window)
  VALUES (input_user_id, current_hour, current_day)
  ON CONFLICT (user_id, hour_window) DO NOTHING;
  
  INSERT INTO chat_rate_limits (user_id, hour_window, day_window)
  VALUES (input_user_id, current_hour, current_day)
  ON CONFLICT (user_id, day_window) DO NOTHING;
  
  -- Get current usage for this hour
  SELECT * INTO rate_limit_record
  FROM chat_rate_limits 
  WHERE user_id = input_user_id 
    AND hour_window = current_hour;
  
  -- Check various limits
  IF rate_limit_record.messages_this_hour >= rate_limit_record.hourly_message_limit THEN
    is_limited := TRUE;
    limit_reason := 'hourly_message_limit_exceeded';
  ELSIF rate_limit_record.messages_this_day >= rate_limit_record.daily_message_limit THEN
    is_limited := TRUE;
    limit_reason := 'daily_message_limit_exceeded';
  ELSIF rate_limit_record.tokens_this_hour + estimated_tokens > rate_limit_record.hourly_token_limit THEN
    is_limited := TRUE;
    limit_reason := 'hourly_token_limit_exceeded';
  ELSIF rate_limit_record.tokens_this_day + estimated_tokens > rate_limit_record.daily_token_limit THEN
    is_limited := TRUE;
    limit_reason := 'daily_token_limit_exceeded';
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', NOT is_limited,
    'reason', limit_reason,
    'current_hour_messages', rate_limit_record.messages_this_hour,
    'current_hour_tokens', rate_limit_record.tokens_this_hour,
    'current_day_messages', rate_limit_record.messages_this_day,
    'current_day_tokens', rate_limit_record.tokens_this_day,
    'hourly_message_limit', rate_limit_record.hourly_message_limit,
    'hourly_token_limit', rate_limit_record.hourly_token_limit,
    'daily_message_limit', rate_limit_record.daily_message_limit,
    'daily_token_limit', rate_limit_record.daily_token_limit
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update usage after successful chat message
CREATE OR REPLACE FUNCTION update_chat_usage(
  input_user_id UUID, 
  tokens_used INTEGER, 
  messages_count INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  current_hour TIMESTAMPTZ;
  current_day DATE;
BEGIN
  current_hour := date_trunc('hour', NOW());
  current_day := CURRENT_DATE;
  
  -- Update hourly usage
  UPDATE chat_rate_limits
  SET 
    messages_this_hour = messages_this_hour + messages_count,
    tokens_this_hour = tokens_this_hour + tokens_used,
    updated_at = NOW()
  WHERE user_id = input_user_id AND hour_window = current_hour;
  
  -- Update daily usage
  UPDATE chat_rate_limits
  SET 
    messages_this_day = messages_this_day + messages_count,
    tokens_this_day = tokens_this_day + tokens_used,
    updated_at = NOW()
  WHERE user_id = input_user_id AND day_window = current_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log plan access attempts
CREATE OR REPLACE FUNCTION log_plan_access(
  input_user_id UUID,
  feature_name TEXT,
  user_plan_type TEXT,
  was_granted BOOLEAN,
  denial_reason TEXT DEFAULT NULL,
  request_info JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO plan_access_log (
    user_id,
    feature_requested,
    plan_type,
    access_granted,
    access_denied_reason,
    request_path,
    request_method,
    user_agent
  ) VALUES (
    input_user_id,
    feature_name,
    user_plan_type,
    was_granted,
    denial_reason,
    request_info->>'path',
    request_info->>'method',
    request_info->>'user_agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 7. PERFORMANCE INDEXES
-- =============================================================================

-- Chat sessions indexes
CREATE INDEX idx_chat_sessions_user_active ON chat_sessions(user_id, session_status) WHERE session_status = 'active';
CREATE INDEX idx_chat_sessions_user_created ON chat_sessions(user_id, created_at);
CREATE INDEX idx_chat_sessions_status_activity ON chat_sessions(session_status, last_activity_at);

-- Plan access log indexes
CREATE INDEX idx_plan_access_log_user_created ON plan_access_log(user_id, created_at);
CREATE INDEX idx_plan_access_log_feature ON plan_access_log(feature_requested, access_granted);
CREATE INDEX idx_plan_access_log_created ON plan_access_log(created_at);

-- Rate limits indexes  
CREATE INDEX idx_chat_rate_limits_user_hour ON chat_rate_limits(user_id, hour_window);
CREATE INDEX idx_chat_rate_limits_user_day ON chat_rate_limits(user_id, day_window);
CREATE INDEX idx_chat_rate_limits_limited ON chat_rate_limits(is_rate_limited) WHERE is_rate_limited = true;

-- Enhanced claude_api_log indexes (only if columns exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'chat_session_id') THEN
    CREATE INDEX IF NOT EXISTS idx_claude_api_log_chat_session ON claude_api_log(chat_session_id) WHERE chat_session_id IS NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claude_api_log' AND column_name = 'request_type_detail') THEN
    CREATE INDEX IF NOT EXISTS idx_claude_api_log_request_type_detail ON claude_api_log(request_type_detail, created_at);
  END IF;
END $$;

-- =============================================================================
-- 8. AUTOMATIC CLEANUP FUNCTIONS
-- =============================================================================

-- Function to clean up old sessions and rate limit data
CREATE OR REPLACE FUNCTION cleanup_old_chat_data()
RETURNS VOID AS $$
BEGIN
  -- Mark sessions as ended if inactive for 2 hours
  UPDATE chat_sessions 
  SET 
    session_status = 'timeout',
    session_ended_at = NOW(),
    session_duration_seconds = EXTRACT(EPOCH FROM (NOW() - session_started_at))::INTEGER
  WHERE session_status = 'active' 
    AND last_activity_at < NOW() - INTERVAL '2 hours';
    
  -- Delete completed sessions older than 7 days
  DELETE FROM chat_sessions 
  WHERE session_ended_at < NOW() - INTERVAL '7 days'
    AND session_status IN ('ended', 'timeout', 'error');
  
  -- Clean up old rate limit records (keep 30 days)
  DELETE FROM chat_rate_limits 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Clean up old plan access logs (keep 90 days)
  DELETE FROM plan_access_log 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 9. SETUP VERIFICATION
-- =============================================================================

-- Create a view to verify the setup
CREATE OR REPLACE VIEW chat_infrastructure_status AS
SELECT 
  'Chat Infrastructure Setup' as component,
  NOW() as setup_completed_at,
  (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('chat_sessions', 'plan_access_log', 'chat_rate_limits')
  ) as tables_created,
  (
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_name = 'claude_api_log' 
    AND column_name IN ('chat_session_id', 'request_type_detail', 'stream_response')
  ) as api_log_columns_added,
  (
    SELECT COUNT(*) 
    FROM pg_proc 
    WHERE proname IN ('validate_chat_access', 'check_chat_rate_limit', 'update_chat_usage', 'cleanup_old_chat_data')
  ) as functions_created;

-- Display setup status
SELECT * FROM chat_infrastructure_status;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
--
-- This migration creates infrastructure for:
-- ✅ Ephemeral chat sessions (no conversation storage)
-- ✅ Plan access validation and logging
-- ✅ Rate limiting and abuse prevention
-- ✅ Enhanced API usage tracking
-- ✅ Automatic data cleanup
-- ✅ Performance optimization with indexes
-- ✅ Row-level security for all new tables
--
-- Next steps:
-- 1. Run this migration in Supabase SQL editor
-- 2. Verify setup with: SELECT * FROM chat_infrastructure_status;
-- 3. Set up cron job to run cleanup_old_chat_data() daily
-- 
-- =============================================================================