import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ChatService } from '@/services/chatService';

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString();
  console.log(`💬 [CHAT-API-${requestId}] Chat request started`);
  
  try {
    // Enhanced request debugging
    console.log(`💬 [CHAT-API-${requestId}] Request headers:`, {
      'content-type': request.headers.get('content-type'),
      'user-agent': request.headers.get('user-agent'),
      'cookie': request.headers.get('cookie') ? 'Present (length: ' + request.headers.get('cookie')!.length + ')' : 'Missing',
      'authorization': request.headers.get('authorization') ? 'Present (Bearer token)' : 'Missing',
      'origin': request.headers.get('origin'),
      'referer': request.headers.get('referer'),
      'x-forwarded-for': request.headers.get('x-forwarded-for')
    });

    console.log(`💬 [CHAT-API-${requestId}] Creating Supabase client...`);
    const cookieStore = cookies();
    
    // Log available cookies (using proper Next.js cookies API)
    const cookieHeader = request.headers.get('cookie');
    const cookieEntries = cookieHeader ? cookieHeader.split(';').map(c => c.trim().split('=')) : [];
    console.log(`💬 [CHAT-API-${requestId}] Available cookies:`, {
      count: cookieEntries.length,
      hasCookieHeader: !!cookieHeader,
      cookieHeaderLength: cookieHeader?.length || 0,
      supabaseCookies: cookieEntries
        .filter(([name]) => name.includes('supabase'))
        .map(([name, value]) => ({
          name: name,
          valueLength: value?.length || 0,
          valuePreview: value ? value.substring(0, 50) + '...' : 'empty'
        }))
    });
    
    const supabase = createRouteHandlerClient({ cookies });
    
    console.log(`💬 [CHAT-API-${requestId}] Getting user session...`);
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    console.log(`💬 [CHAT-API-${requestId}] Session retrieval result:`, {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      sessionExpiry: session?.expires_at,
      authError: authError?.message,
      accessTokenLength: session?.access_token?.length,
      refreshTokenLength: session?.refresh_token?.length
    });
    
    let userId: string;
    let authMethod = 'cookie';

    // If cookie-based auth failed, try Authorization header
    if (authError || !session?.user) {
      console.log(`💬 [CHAT-API-${requestId}] Cookie auth failed, trying Authorization header...`);
      
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log(`💬 [CHAT-API-${requestId}] Found Bearer token, verifying...`);
        
        try {
          // Verify the token using supabase-server client
          const { supabaseServer } = await import('@/lib/supabase-server');
          if (supabaseServer) {
            const { data: { user }, error: tokenError } = await supabaseServer.auth.getUser(token);
            
            if (user && !tokenError) {
              console.log(`💬 [CHAT-API-${requestId}] Authorization header auth successful:`, user.id);
              userId = user.id;
              authMethod = 'bearer';
            } else {
              console.log(`💬 [CHAT-API-${requestId}] Bearer token validation failed:`, tokenError?.message);
              return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
              );
            }
          } else {
            throw new Error('Supabase server client not available');
          }
        } catch (tokenValidationError) {
          console.error(`💬 [CHAT-API-${requestId}] Token validation error:`, tokenValidationError);
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
      } else {
        console.log(`💬 [CHAT-API-${requestId}] No valid authentication method found`);
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    } else {
      userId = session.user.id;
    }

    console.log(`💬 [CHAT-API-${requestId}] User authenticated via ${authMethod}:`, userId);

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
    const sessionInfo = await ChatService.getSessionInfo(userId, sessionId ?? undefined);

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