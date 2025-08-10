import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      await supabase.auth.exchangeCodeForSession(code)
      
      // Redirect to success page
      return NextResponse.redirect(new URL('/', requestUrl.origin))
    } catch (error) {
      console.error('Email verification error:', error)
      
      // Redirect to error page with message
      return NextResponse.redirect(
        new URL('/?error=verification_failed', requestUrl.origin)
      )
    }
  }

  // No code provided, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}