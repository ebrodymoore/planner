import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Check for error parameters that might be passed from Supabase
  const error = requestUrl.searchParams.get('error')
  const errorCode = requestUrl.searchParams.get('error_code')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If there are errors from Supabase, redirect to auth page with error info
  if (error) {
    console.error('Supabase auth error:', { error, errorCode, errorDescription })
    
    // Encode error details for URL
    const errorParams = new URLSearchParams({
      error: error,
      ...(errorCode && { error_code: errorCode }),
      ...(errorDescription && { error_description: errorDescription })
    })
    
    return NextResponse.redirect(
      new URL(`/?auth_error=true&${errorParams.toString()}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(
          new URL(`/?auth_error=true&error=exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
        )
      }
      
      // Redirect to questionnaire page for new users
      return NextResponse.redirect(new URL('/questionnaire', requestUrl.origin))
    } catch (error: any) {
      console.error('Email verification error:', error)
      
      // Redirect to error page with message
      return NextResponse.redirect(
        new URL(`/?auth_error=true&error=verification_failed&error_description=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }
  }

  // No code provided, redirect to questionnaire
  return NextResponse.redirect(new URL('/questionnaire', requestUrl.origin))
}