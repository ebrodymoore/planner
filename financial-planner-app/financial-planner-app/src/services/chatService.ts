import { createClient } from '@supabase/supabase-js';
import { FinancialDataService } from './financialDataService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  userId: string;
  message: string;
  sessionId?: string;
  conversationHistory: ChatMessage[];
  context?: Record<string, any>;
  clientInfo: {
    userAgent: string;
    clientIp: string;
  };
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  messageId: string;
  tokensUsed?: number;
  responseTime: number;
  rateLimitInfo?: {
    remaining: number;
    resetTime: string;
  };
}

export interface SessionInfo {
  sessionId: string;
  status: 'active' | 'ended' | 'timeout' | 'error';
  messageCount: number;
  tokensUsed: number;
  startedAt: string;
  lastActivity: string;
  canSendMessage: boolean;
  rateLimitInfo: {
    hourlyRemaining: number;
    dailyRemaining: number;
    isLimited: boolean;
  };
}

export class ChatService {
  private static readonly CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
  private static readonly MAX_CONVERSATION_LENGTH = 10; // Keep last 10 messages for context

  /**
   * Process a chat message with full validation, rate limiting, and Claude integration
   */
  static async processMessage(request: ChatRequest): Promise<ChatResponse | null> {
    const startTime = Date.now();
    const requestId = `${request.userId}-${startTime}`;
    
    console.log(`🤖 [CHAT-${requestId}] Processing chat message`);
    
    try {
      // Step 1: Validate chat access based on user's plan
      console.log(`🤖 [CHAT-${requestId}] Step 1: Validating chat access...`);
      const accessValidation = await this.validateChatAccess(request.userId);
      
      if (!accessValidation.chat_access) {
        console.log(`🤖 [CHAT-${requestId}] Access denied:`, accessValidation.access_reason);
        
        // Log the access denial
        await this.logPlanAccess(
          request.userId,
          'chat',
          accessValidation.plan_type,
          false,
          accessValidation.access_reason,
          request.clientInfo
        );
        
        throw new Error(`Chat access denied: ${accessValidation.access_reason}`);
      }

      console.log(`🤖 [CHAT-${requestId}] Access granted for plan:`, accessValidation.plan_type);

      // Step 2: Check rate limits
      console.log(`🤖 [CHAT-${requestId}] Step 2: Checking rate limits...`);
      const rateLimitCheck = await this.checkRateLimit(request.userId);
      
      if (!rateLimitCheck.allowed) {
        console.log(`🤖 [CHAT-${requestId}] Rate limit exceeded:`, rateLimitCheck.reason);
        throw new Error(`Rate limit exceeded: ${rateLimitCheck.reason}`);
      }

      // Step 3: Create or update chat session
      console.log(`🤖 [CHAT-${requestId}] Step 3: Managing chat session...`);
      const sessionId = await this.createOrUpdateSession(
        request.userId,
        request.sessionId,
        request.clientInfo
      );

      // Step 4: Get user's financial context for personalized responses
      console.log(`🤖 [CHAT-${requestId}] Step 4: Loading financial context...`);
      const financialContext = await this.getFinancialContext(request.userId);

      // Step 5: Validate message content for financial relevance
      console.log(`🤖 [CHAT-${requestId}] Step 5: Validating message topic...`);
      const topicValidation = this.validateFinancialTopic(request.message);
      
      if (!topicValidation.isValid) {
        console.log(`🤖 [CHAT-${requestId}] Off-topic message detected`);
        return {
          message: "I'm here to help with your financial planning questions. Please ask me about your investments, retirement planning, debt management, tax strategies, or other financial topics related to your plan.",
          sessionId,
          messageId: `msg_${Date.now()}`,
          responseTime: Date.now() - startTime
        };
      }

      // Step 6: Build conversation context with history
      console.log(`🤖 [CHAT-${requestId}] Step 6: Building conversation context...`);
      const conversationContext = this.buildConversationContext(
        request.conversationHistory,
        request.message,
        financialContext
      );

      // Step 7: Call Claude API
      console.log(`🤖 [CHAT-${requestId}] Step 7: Calling Claude API...`);
      const claudeResponse = await this.callClaudeAPI(conversationContext);
      
      if (!claudeResponse) {
        throw new Error('Failed to get response from Claude API');
      }

      const responseContent = this.extractResponseContent(claudeResponse);
      const tokensUsed = claudeResponse.usage?.input_tokens + claudeResponse.usage?.output_tokens || 0;

      // Step 8: Update usage tracking
      console.log(`🤖 [CHAT-${requestId}] Step 8: Updating usage tracking...`);
      await this.updateUsageTracking(request.userId, tokensUsed, 1);

      // Step 9: Update session metrics
      await this.updateSessionMetrics(sessionId, tokensUsed, Date.now() - startTime);

      // Step 10: Log API usage
      await this.logAPIUsage(
        request.userId,
        sessionId,
        request.message,
        responseContent,
        tokensUsed,
        Date.now() - startTime,
        topicValidation.isValid
      );

      console.log(`🤖 [CHAT-${requestId}] Chat processing completed successfully`);

      return {
        message: responseContent,
        sessionId,
        messageId: `msg_${Date.now()}`,
        tokensUsed,
        responseTime: Date.now() - startTime,
        rateLimitInfo: {
          remaining: rateLimitCheck.current_hour_messages,
          resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        }
      };

    } catch (error) {
      console.error(`🤖 [CHAT-${requestId}] ERROR:`, error);
      
      // Log the error
      await this.logAPIUsage(
        request.userId,
        request.sessionId || 'unknown',
        request.message,
        '',
        0,
        Date.now() - startTime,
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      return null;
    }
  }

  /**
   * Validate user's access to chat feature based on their plan
   */
  private static async validateChatAccess(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('validate_chat_access', { input_user_id: userId });

      if (error) {
        console.error('Error validating chat access:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to validate chat access:', error);
      // Default to denying access if validation fails
      return {
        user_id: userId,
        plan_type: 'none',
        chat_access: false,
        access_reason: 'validation_failed'
      };
    }
  }

  /**
   * Check rate limits for the user
   */
  private static async checkRateLimit(userId: string, estimatedTokens: number = 1000): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('check_chat_rate_limit', { 
          input_user_id: userId,
          estimated_tokens: estimatedTokens 
        });

      if (error) {
        console.error('Error checking rate limit:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to check rate limit:', error);
      // Default to allowing if rate limit check fails
      return {
        allowed: true,
        reason: 'rate_limit_check_failed',
        current_hour_messages: 0
      };
    }
  }

  /**
   * Create new chat session or update existing one
   */
  private static async createOrUpdateSession(
    userId: string, 
    sessionId?: string,
    clientInfo?: { userAgent: string; clientIp: string }
  ): Promise<string> {
    try {
      if (sessionId) {
        // Update existing session
        const { error } = await supabase
          .from('chat_sessions')
          .update({
            last_activity_at: new Date().toISOString()
          })
          .eq('id', sessionId)
          .eq('user_id', userId);

        if (!error) {
          return sessionId;
        }
      }

      // Create new session
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          session_status: 'active',
          total_messages: 1,
          user_agent: clientInfo?.userAgent,
          client_ip: clientInfo?.clientIp
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating chat session:', error);
        throw error;
      }

      return data.id;
    } catch (error) {
      console.error('Failed to manage chat session:', error);
      // Return a fallback session ID
      return `fallback_${userId}_${Date.now()}`;
    }
  }

  /**
   * Get user's financial context for personalized responses
   */
  private static async getFinancialContext(userId: string): Promise<any> {
    try {
      // Get user's financial data
      const questionnaireResponse = await FinancialDataService.loadQuestionnaireResponse(userId);
      const formData = questionnaireResponse?.questionnaire_data;
      const analysis = await FinancialDataService.getCurrentAnalysis(userId);

      return {
        hasFinancialPlan: !!formData,
        hasAnalysis: !!analysis,
        personalInfo: formData?.personal || {},
        financialGoals: formData?.goals || {},
        currentAssets: formData?.assets || {},
        currentLiabilities: formData?.liabilities || {},
        lastAnalysisDate: analysis?.created_at
      };
    } catch (error) {
      console.error('Failed to load financial context:', error);
      return { hasFinancialPlan: false };
    }
  }

  /**
   * Validate if the message is related to financial planning
   */
  private static validateFinancialTopic(message: string): { isValid: boolean; confidence: number } {
    const financialKeywords = [
      // Investment terms
      'investment', 'portfolio', 'stocks', 'bonds', 'etf', 'mutual fund', 'asset allocation',
      '401k', 'ira', 'roth', 'retirement', 'pension',
      
      // Financial planning
      'budget', 'savings', 'debt', 'loan', 'mortgage', 'credit', 'insurance',
      'tax', 'financial plan', 'emergency fund', 'net worth',
      
      // Goals and strategies  
      'retire', 'goal', 'strategy', 'advice', 'recommendation', 'optimize',
      'diversify', 'rebalance', 'risk', 'return',
      
      // Personal finance
      'income', 'expense', 'cash flow', 'spending', 'save money', 'financial health'
    ];

    const messageLower = message.toLowerCase();
    const matchCount = financialKeywords.filter(keyword => 
      messageLower.includes(keyword)
    ).length;

    const confidence = Math.min(matchCount / 3, 1); // Max confidence at 3+ matches
    const isValid = confidence > 0.1 || messageLower.length < 50; // Short messages get benefit of doubt

    return { isValid, confidence };
  }

  /**
   * Build conversation context for Claude API
   */
  private static buildConversationContext(
    history: ChatMessage[],
    currentMessage: string,
    financialContext: any
  ): string {
    const contextSummary = this.buildFinancialContextSummary(financialContext);
    
    // Limit conversation history to prevent token overflow
    const recentHistory = history.slice(-this.MAX_CONVERSATION_LENGTH);
    
    const conversationText = recentHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    return `You are a professional Certified Financial Planner (CFP) providing personalized financial advice through a chat interface. You have access to the user's financial plan and should provide helpful, actionable advice.

FINANCIAL CONTEXT:
${contextSummary}

CONVERSATION GUIDELINES:
- Provide concise, actionable financial advice (2-3 sentences max)
- Reference the user's specific financial situation when relevant
- Ask clarifying questions to provide better advice
- Stay focused on financial planning topics
- Be encouraging and professional
- If asked about specific investments, remind them to consider their risk tolerance and timeline

RECENT CONVERSATION:
${conversationText}

USER'S CURRENT QUESTION:
${currentMessage}

Please provide a helpful, personalized response based on their financial context:`;
  }

  /**
   * Build financial context summary for Claude
   */
  private static buildFinancialContextSummary(context: any): string {
    if (!context.hasFinancialPlan) {
      return "User has not yet completed their financial questionnaire.";
    }

    const parts = [];
    
    if (context.personalInfo?.name) {
      parts.push(`Client: ${context.personalInfo.name}`);
    }
    
    if (context.personalInfo?.age) {
      parts.push(`Age: ${context.personalInfo.age}`);
    }
    
    if (context.financialGoals?.retirementAge) {
      parts.push(`Retirement goal: Age ${context.financialGoals.retirementAge}`);
    }
    
    if (context.currentAssets) {
      const totalAssets = Object.values(context.currentAssets)
        .reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0);
      if (totalAssets > 0) {
        parts.push(`Total assets: ~$${Math.round(totalAssets / 1000)}k`);
      }
    }
    
    if (context.hasAnalysis) {
      parts.push(`Has current financial analysis from ${context.lastAnalysisDate ? new Date(context.lastAnalysisDate).toDateString() : 'recent'}`);
    }

    return parts.length > 0 ? parts.join(', ') : "Basic financial information available.";
  }

  /**
   * Call Claude API with the conversation context
   */
  private static async callClaudeAPI(prompt: string): Promise<any> {
    const API_KEY = process.env.CLAUDE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Claude API key not configured');
    }

    const response = await fetch(this.CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000, // Shorter responses for chat
        temperature: 0.7, // Slightly more conversational
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Extract response content from Claude's response
   */
  private static extractResponseContent(claudeResponse: any): string {
    if (!claudeResponse.content || !Array.isArray(claudeResponse.content) || claudeResponse.content.length === 0) {
      throw new Error('Invalid Claude response structure');
    }

    return claudeResponse.content[0].text || 'I apologize, but I encountered an issue generating a response. Please try again.';
  }

  /**
   * Update usage tracking after successful message
   */
  private static async updateUsageTracking(userId: string, tokensUsed: number, messageCount: number): Promise<void> {
    try {
      await supabase.rpc('update_chat_usage', {
        input_user_id: userId,
        tokens_used: tokensUsed,
        messages_count: messageCount
      });
    } catch (error) {
      console.error('Failed to update usage tracking:', error);
      // Don't throw - this is non-critical
    }
  }

  /**
   * Update session metrics
   */
  private static async updateSessionMetrics(
    sessionId: string, 
    tokensUsed: number, 
    responseTime: number
  ): Promise<void> {
    try {
      // Get current session data
      const { data: currentSession } = await supabase
        .from('chat_sessions')
        .select('total_tokens_used, avg_response_time_ms')
        .eq('id', sessionId)
        .single();

      if (currentSession) {
        const newTotalTokens = (currentSession.total_tokens_used || 0) + tokensUsed;
        const newAvgResponseTime = currentSession.avg_response_time_ms 
          ? Math.round((currentSession.avg_response_time_ms + responseTime) / 2)
          : responseTime;

        await supabase
          .from('chat_sessions')
          .update({
            total_tokens_used: newTotalTokens,
            avg_response_time_ms: newAvgResponseTime,
            last_activity_at: new Date().toISOString()
          })
          .eq('id', sessionId);
      }
    } catch (error) {
      console.error('Failed to update session metrics:', error);
    }
  }

  /**
   * Log plan access attempt
   */
  private static async logPlanAccess(
    userId: string,
    feature: string,
    planType: string,
    granted: boolean,
    reason: string,
    clientInfo: { userAgent: string; clientIp: string }
  ): Promise<void> {
    try {
      await supabase.rpc('log_plan_access', {
        input_user_id: userId,
        feature_name: feature,
        user_plan_type: planType,
        was_granted: granted,
        denial_reason: granted ? null : reason,
        request_info: {
          user_agent: clientInfo.userAgent,
          path: '/api/chat',
          method: 'POST'
        }
      });
    } catch (error) {
      console.error('Failed to log plan access:', error);
    }
  }

  /**
   * Log API usage for analytics
   */
  private static async logAPIUsage(
    userId: string,
    sessionId: string,
    userMessage: string,
    assistantResponse: string,
    tokensUsed: number,
    responseTime: number,
    topicValid: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      await supabase
        .from('claude_api_log')
        .insert({
          user_id: userId,
          request_type: 'chat_message',
          request_type_detail: 'chat_message',
          chat_session_id: sessionId,
          message_count: 1,
          tokens_used: tokensUsed,
          response_time_ms: responseTime,
          topic_validation_passed: topicValid,
          success: !errorMessage,
          error_message: errorMessage || null,
          cost_estimate: (tokensUsed * 0.003) / 1000 // Rough estimate
        });
    } catch (error) {
      console.error('Failed to log API usage:', error);
    }
  }

  /**
   * Get session information for UI
   */
  static async getSessionInfo(userId: string, sessionId?: string): Promise<SessionInfo | null> {
    try {
      let query = supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId);

      if (sessionId) {
        query = query.eq('id', sessionId);
      } else {
        query = query
          .eq('session_status', 'active')
          .order('created_at', { ascending: false })
          .limit(1);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        return null;
      }

      // Get current rate limit info
      const rateLimitInfo = await this.checkRateLimit(userId);

      return {
        sessionId: data.id,
        status: data.session_status,
        messageCount: data.total_messages || 0,
        tokensUsed: data.total_tokens_used || 0,
        startedAt: data.created_at,
        lastActivity: data.last_activity_at,
        canSendMessage: rateLimitInfo.allowed,
        rateLimitInfo: {
          hourlyRemaining: rateLimitInfo.hourly_message_limit - rateLimitInfo.current_hour_messages,
          dailyRemaining: rateLimitInfo.daily_message_limit - rateLimitInfo.current_day_messages,
          isLimited: !rateLimitInfo.allowed
        }
      };
    } catch (error) {
      console.error('Failed to get session info:', error);
      return null;
    }
  }
}