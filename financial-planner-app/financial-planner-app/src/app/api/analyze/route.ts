import { NextRequest, NextResponse } from 'next/server';
import { ClaudeFinancialAnalysis } from '@/services/claudeFinancialAnalysis';
import { FormData } from '@/types/financial';

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString();
  console.log(`🚀 [API-${requestId}] Analysis request started`);
  
  try {
    console.log(`🚀 [API-${requestId}] Parsing request body...`);
    const requestBody = await request.json();
    const { userId, formData }: { userId: string; formData: FormData } = requestBody;
    
    console.log(`🚀 [API-${requestId}] Request parsed:`, {
      userId: userId ? 'present' : 'missing',
      formDataKeys: formData ? Object.keys(formData) : 'missing',
      formDataSize: formData ? JSON.stringify(formData).length : 0
    });

    if (!userId || !formData) {
      console.log(`🚀 [API-${requestId}] Validation failed: missing userId or formData`);
      return NextResponse.json(
        { error: 'Missing userId or formData' },
        { status: 400 }
      );
    }

    console.log(`🚀 [API-${requestId}] Starting Claude analysis generation...`);
    
    // Generate comprehensive financial analysis
    const analysis = await ClaudeFinancialAnalysis.generateComprehensiveAnalysis(
      userId,
      formData
    );

    console.log(`🚀 [API-${requestId}] Claude analysis completed:`, {
      analysisReceived: !!analysis,
      analysisType: typeof analysis,
      analysisKeys: analysis ? Object.keys(analysis) : 'null'
    });

    if (!analysis) {
      console.log(`🚀 [API-${requestId}] ERROR: Analysis generation returned null`);
      return NextResponse.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      );
    }

    console.log(`🚀 [API-${requestId}] Returning successful response`);
    return NextResponse.json(analysis);

  } catch (error) {
    console.error(`🚀 [API-${requestId}] CRITICAL ERROR:`, {
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