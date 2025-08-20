import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ChatService } from '@/services/chatService';

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString();
  console.log(`💬 [CHAT-API-${requestId}] Chat request started`);
  
  try {
    console.log(`💬 [CHAT-API-${requestId}] Creating Supabase client...`);
    const supabase = createRouteHandlerClient({ cookies });
    
    console.log(`💬 [CHAT-API-${requestId}] Getting user session...`);
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      console.log(`💬 [CHAT-API-${requestId}] Authentication failed:`, authError?.message || 'No session');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log(`💬 [CHAT-API-${requestId}] User authenticated:`, userId);

    console.log(`💬 [CHAT-API-${requestId}] Parsing request body...`);
    const requestBody = await request.json();
    const { 
      message, 
      sessionId, 
      conversationHistory = [],
      context = {}
    } = requestBody;

    console.log(`💬 [CHAT-API-${requestId}] Request parsed:`, {
      hasMessage: !!message,
      messageLength: message?.length || 0,
      sessionId: sessionId || 'new',
      historyLength: conversationHistory.length,
      hasContext: Object.keys(context).length > 0
    });

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log(`💬 [CHAT-API-${requestId}] Validation failed: invalid message`);
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    console.log(`💬 [CHAT-API-${requestId}] Starting chat service processing...`);
    
    // Process the chat message through ChatService
    const chatResponse = await ChatService.processMessage({
      userId,
      message: message.trim(),
      sessionId,
      conversationHistory,
      context,
      clientInfo: {
        userAgent: request.headers.get('user-agent') || '',
        clientIp: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
      }
    });

    console.log(`💬 [CHAT-API-${requestId}] Chat service completed:`, {
      hasResponse: !!chatResponse,
      responseType: typeof chatResponse,
      responseKeys: chatResponse ? Object.keys(chatResponse) : 'null'
    });

    if (!chatResponse) {
      console.log(`💬 [CHAT-API-${requestId}] ERROR: Chat service returned null`);
      return NextResponse.json(
        { error: 'Failed to process chat message' },
        { status: 500 }
      );
    }

    console.log(`💬 [CHAT-API-${requestId}] Returning successful response`);
    return NextResponse.json(chatResponse);

  } catch (error) {
    console.error(`💬 [CHAT-API-${requestId}] CRITICAL ERROR:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: typeof error,
      errorDetails: error
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        requestId,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method for retrieving chat session information
export async function GET(request: NextRequest) {
  const requestId = Date.now().toString();
  console.log(`💬 [CHAT-INFO-${requestId}] Chat info request started`);
  
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    console.log(`💬 [CHAT-INFO-${requestId}] Getting chat session info:`, {
      userId,
      sessionId: sessionId || 'latest'
    });

    // Get chat session information
    const sessionInfo = await ChatService.getSessionInfo(userId, sessionId);

    return NextResponse.json(sessionInfo);

  } catch (error) {
    console.error(`💬 [CHAT-INFO-${requestId}] ERROR:`, error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        requestId,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}