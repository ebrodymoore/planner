import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key: string) => {
        if (typeof window === 'undefined') return null;
        return document.cookie
          .split('; ')
          .find(row => row.startsWith(key + '='))
          ?.split('=')[1] || null;
      },
      setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        document.cookie = `${key}=${value}; path=/; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
      },
      removeItem: (key: string) => {
        if (typeof window === 'undefined') return;
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Migrate existing localStorage sessions to cookies
const migrateSessionToCookies = async () => {
  if (typeof window === 'undefined') return;
  
  // Check if we have a localStorage session but no cookies
  const localStorageSession = localStorage.getItem('supabase.auth.token');
  const hasCookieSession = document.cookie.includes('supabase-auth-token');
  
  if (localStorageSession && !hasCookieSession) {
    console.log('🔐 [DEBUG] Migrating localStorage session to cookies...');
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Force a session refresh which will now use cookie storage
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
        
        if (refreshedSession && !error) {
          console.log('🔐 [DEBUG] Session successfully migrated to cookies');
          // Clear localStorage to prevent conflicts
          localStorage.removeItem('supabase.auth.token');
        } else {
          console.error('🔐 [DEBUG] Failed to migrate session:', error);
        }
      }
    } catch (error) {
      console.error('🔐 [DEBUG] Session migration error:', error);
    }
  }
};

// Add auth state debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 [DEBUG] Auth state change:', {
    event,
    user: session?.user?.id,
    session: session ? 'present' : 'null'
  });
  
  // Trigger migration on SIGNED_IN events
  if (event === 'SIGNED_IN') {
    setTimeout(migrateSessionToCookies, 1000);
  }
});

// Run migration check on load
if (typeof window !== 'undefined') {
  setTimeout(migrateSessionToCookies, 2000);
}

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string | null
          age: number | null
          marital_status: string | null
          dependents: number | null
          dependent_ages: number[] | null
          state: string | null
          employment_status: string | null
          industry: string | null
          profession: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          age?: number | null
          marital_status?: string | null
          dependents?: number | null
          dependent_ages?: number[] | null
          state?: string | null
          employment_status?: string | null
          industry?: string | null
          profession?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          age?: number | null
          marital_status?: string | null
          dependents?: number | null
          dependent_ages?: number[] | null
          state?: string | null
          employment_status?: string | null
          industry?: string | null
          profession?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      client_income: {
        Row: {
          id: string
          user_id: string
          annual_gross: number | null
          stability: string | null
          growth_expectation: string | null
          spouse_income: number | null
          rental_income: number | null
          investment_income: number | null
          expected_retirement_age: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          annual_gross?: number | null
          stability?: string | null
          growth_expectation?: string | null
          spouse_income?: number | null
          rental_income?: number | null
          investment_income?: number | null
          expected_retirement_age?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          annual_gross?: number | null
          stability?: string | null
          growth_expectation?: string | null
          spouse_income?: number | null
          rental_income?: number | null
          investment_income?: number | null
          expected_retirement_age?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      client_expenses: {
        Row: {
          id: string
          user_id: string
          housing_payment: number | null
          housing_type: string | null
          monthly_food_groceries: number | null
          monthly_utilities: number | null
          monthly_transportation: number | null
          monthly_entertainment: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          housing_payment?: number | null
          housing_type?: string | null
          monthly_food_groceries?: number | null
          monthly_utilities?: number | null
          monthly_transportation?: number | null
          monthly_entertainment?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          housing_payment?: number | null
          housing_type?: string | null
          monthly_food_groceries?: number | null
          monthly_utilities?: number | null
          monthly_transportation?: number | null
          monthly_entertainment?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      client_assets: {
        Row: {
          id: string
          user_id: string
          checking_balance: number | null
          savings_balance: number | null
          emergency_fund_target: string | null
          retirement_401k: number | null
          ira_balance: number | null
          taxable_accounts: number | null
          primary_residence_value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          checking_balance?: number | null
          savings_balance?: number | null
          emergency_fund_target?: string | null
          retirement_401k?: number | null
          ira_balance?: number | null
          taxable_accounts?: number | null
          primary_residence_value?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          checking_balance?: number | null
          savings_balance?: number | null
          emergency_fund_target?: string | null
          retirement_401k?: number | null
          ira_balance?: number | null
          taxable_accounts?: number | null
          primary_residence_value?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      client_liabilities: {
        Row: {
          id: string
          user_id: string
          mortgage_balance: number | null
          mortgage_rate: number | null
          mortgage_years_remaining: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mortgage_balance?: number | null
          mortgage_rate?: number | null
          mortgage_years_remaining?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mortgage_balance?: number | null
          mortgage_rate?: number | null
          mortgage_years_remaining?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      auto_loans: {
        Row: {
          id: string
          user_id: string
          balance: number
          rate: number
          term: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance: number
          rate: number
          term: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          rate?: number
          term?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      credit_cards: {
        Row: {
          id: string
          user_id: string
          name: string
          balance: number
          credit_limit: number
          rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          balance: number
          credit_limit: number
          rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          balance?: number
          limit?: number
          rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      student_loans: {
        Row: {
          id: string
          user_id: string
          balance: number
          rate: number
          servicer: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance: number
          rate: number
          servicer: string
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          rate?: number
          servicer?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      client_goals: {
        Row: {
          id: string
          user_id: string
          retirement_priority: number | null
          emergency_priority: number | null
          debt_priority: number | null
          retirement_target_age: number | null
          retirement_desired_income: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          retirement_priority?: number | null
          emergency_priority?: number | null
          debt_priority?: number | null
          retirement_target_age?: number | null
          retirement_desired_income?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          retirement_priority?: number | null
          emergency_priority?: number | null
          debt_priority?: number | null
          retirement_target_age?: number | null
          retirement_desired_income?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      client_preferences: {
        Row: {
          id: string
          user_id: string
          second_home_interest: string | null
          second_home_budget: number | null
          business_interest: string | null
          business_capital: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          second_home_interest?: string | null
          second_home_budget?: number | null
          business_interest?: string | null
          business_capital?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          second_home_interest?: string | null
          second_home_budget?: number | null
          business_interest?: string | null
          business_capital?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      client_risk_assessment: {
        Row: {
          id: string
          user_id: string
          experience_level: string | null
          largest_loss: string | null
          portfolio_drop_response: string | null
          investment_timeline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          experience_level?: string | null
          largest_loss?: string | null
          portfolio_drop_response?: string | null
          investment_timeline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          experience_level?: string | null
          largest_loss?: string | null
          portfolio_drop_response?: string | null
          investment_timeline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      financial_analyses: {
        Row: {
          id: string
          user_id: string
          analysis_date: string
          claude_response: any
          recommendations: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          analysis_date: string
          claude_response: any
          recommendations: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          analysis_date?: string
          claude_response?: any
          recommendations?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}