import { NextRequest, NextResponse } from 'next/server';
import { ClaudeFinancialAnalysis } from '@/services/claudeFinancialAnalysis';
import { FormData } from '@/types/financial';

export async function POST(request: NextRequest) {
  try {
    const { userId, formData }: { userId: string; formData: FormData } = await request.json();

    if (!userId || !formData) {
      return NextResponse.json(
        { error: 'Missing userId or formData' },
        { status: 400 }
      );
    }

    // Generate comprehensive financial analysis
    const analysis = await ClaudeFinancialAnalysis.generateComprehensiveAnalysis(
      userId,
      formData
    );

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('API Error generating analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}