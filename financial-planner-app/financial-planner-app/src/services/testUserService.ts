import { supabase } from '@/lib/supabase';
import { FormData } from '@/types/financial';

export class TestUserService {
  static async loginAsTestUser(): Promise<{ user: any; userData: FormData | null }> {
    try {
      // First try to sign in with test credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      if (authError) {
        // If user doesn't exist, create them
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'test@example.com',
          password: 'testpassword123',
        });

        if (signUpError) {
          throw new Error(`Failed to create test user: ${signUpError.message}`);
        }

        // Auto-confirm the user for testing
        if (signUpData.user) {
          await supabase.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'testpassword123'
          });
        }
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Failed to authenticate test user');
      }

      // Try to load existing data for EBM user
      const userData = await this.getTestUserData(user.id);
      
      return { user, userData };
    } catch (error) {
      console.error('Error in test user login:', error);
      throw error;
    }
  }

  static async getTestUserData(userId: string): Promise<FormData | null> {
    try {
      // Load all user data from database
      const [
        { data: personal },
        { data: income },
        { data: expenses }, 
        { data: assets },
        { data: liabilities },
        { data: autoLoans },
        { data: creditCards },
        { data: studentLoans },
        { data: goals },
        { data: preferences },
        { data: risk }
      ] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
        supabase.from('client_income').select('*').eq('user_id', userId).single(),
        supabase.from('client_expenses').select('*').eq('user_id', userId).single(),
        supabase.from('client_assets').select('*').eq('user_id', userId).single(),
        supabase.from('client_liabilities').select('*').eq('user_id', userId).single(),
        supabase.from('auto_loans').select('*').eq('user_id', userId),
        supabase.from('credit_cards').select('*').eq('user_id', userId),
        supabase.from('student_loans').select('*').eq('user_id', userId),
        supabase.from('client_goals').select('*').eq('user_id', userId).single(),
        supabase.from('client_preferences').select('*').eq('user_id', userId).single(),
        supabase.from('client_risk_assessment').select('*').eq('user_id', userId).single()
      ]);

      // If no data exists, create sample EBM data
      if (!personal) {
        await this.createSampleEBMData(userId);
        return await this.getTestUserData(userId); // Recursive call to get the created data
      }

      // Convert database format to FormData format
      const userData: FormData = {
        personal: personal ? {
          name: personal.name || 'EBM',
          dateOfBirth: '1989-01-01', // 35 years old
          maritalStatus: personal.marital_status || 'single',
          dependents: personal.dependents || 0,
          dependentAges: personal.dependent_ages?.join(', ') || '',
          state: personal.state || 'CA',
          country: 'USA',
          employmentStatus: personal.employment_status || 'employed',
          industry: personal.industry || 'Technology',
          profession: personal.profession || 'Software Engineer',
          communicationMethod: 'email',
          meetingFrequency: 'quarterly'
        } : undefined,

        income: income ? {
          annualIncome: income.annual_gross || 120000,
          stability: income.stability || 'stable',
          growthExpectation: income.growth_expectation || 'moderate',
          spouseIncome: income.spouse_income || 0,
          rentalIncome: income.rental_income || 0,
          businessIncome: 0,
          investmentIncome: income.investment_income || 2000,
          otherIncome: 0,
          otherIncomeDescription: '',
          retirementAge: income.expected_retirement_age || 65,
          majorIncomeChanges: 'none'
        } : undefined,

        expenses: expenses ? {
          housingType: expenses.housing_type || 'rent',
          housing: expenses.housing_payment || 2500,
          transportation: expenses.monthly_transportation || 400,
          travel: 500,
          recreation: 300,
          food: expenses.monthly_food_groceries || 600,
          healthcare: 200,
          shopping: 300,
          technology: 100,
          personalCare: 100,
          entertainment: expenses.monthly_entertainment || 300,
          fixedVsVariableRatio: '70/30',
          seasonalVariations: 'none',
          recentExpenseChanges: 'none',
          potentialReductions: 'dining out'
        } : undefined,

        assets: assets ? {
          checking: assets.checking_balance || 5000,
          savings: assets.savings_balance || 25000,
          emergencyTarget: assets.emergency_fund_target || '6_months',
          retirement401k: assets.retirement_401k || 45000,
          ira: assets.ira_balance || 15000,
          taxableAccounts: assets.taxable_accounts || 20000,
          homeValue: assets.primary_residence_value || 0
        } : undefined,

        liabilities: {
          mortgageBalance: liabilities?.mortgage_balance || 0,
          mortgageRate: liabilities?.mortgage_rate || 0,
          mortgageYears: liabilities?.mortgage_years_remaining || 0,
          autoLoans: autoLoans || [],
          creditCards: creditCards || [],
          studentLoans: studentLoans || []
        },

        goals: goals ? {
          retirementAge: goals.retirement_target_age || 65,
          retirementIncome: goals.retirement_desired_income || 80000,
          retirementPriority: goals.retirement_priority || 8,
          emergencyPriority: goals.emergency_priority || 9,
          debtPriority: goals.debt_priority || 7
        } : undefined,

        preferences: preferences ? {
          secondHome: preferences.second_home_interest || 'no',
          secondHomeBudget: preferences.second_home_budget || 0,
          businessInterest: preferences.business_interest || 'no',
          businessCapital: preferences.business_capital || 0
        } : undefined,

        risk: risk ? {
          experienceLevel: risk.experience_level || 'intermediate',
          largestLoss: risk.largest_loss || '10_20_percent',
          portfolioDrop: risk.portfolio_drop_response || 'buy_more',
          timeline: risk.investment_timeline || 'long_term'
        } : undefined
      };

      return userData;
    } catch (error) {
      console.error('Error loading test user data:', error);
      return null;
    }
  }

  static async createSampleEBMData(userId: string): Promise<void> {
    try {
      // Create sample data for EBM user
      await Promise.all([
        // User profile
        supabase.from('user_profiles').insert({
          user_id: userId,
          name: 'EBM', 
          age: 35,
          marital_status: 'single',
          dependents: 0,
          dependent_ages: [],
          state: 'CA',
          employment_status: 'employed',
          industry: 'Technology',
          profession: 'Software Engineer'
        }),

        // Income
        supabase.from('client_income').insert({
          user_id: userId,
          annual_gross: 120000,
          stability: 'stable',
          growth_expectation: 'moderate',
          spouse_income: 0,
          rental_income: 0,
          investment_income: 2000,
          expected_retirement_age: 65
        }),

        // Expenses
        supabase.from('client_expenses').insert({
          user_id: userId,
          housing_payment: 2500,
          housing_type: 'rent',
          monthly_food_groceries: 600,
          monthly_utilities: 200,
          monthly_transportation: 400,
          monthly_entertainment: 300
        }),

        // Assets
        supabase.from('client_assets').insert({
          user_id: userId,
          checking_balance: 5000,
          savings_balance: 25000,
          emergency_fund_target: '6_months',
          retirement_401k: 45000,
          ira_balance: 15000,
          taxable_accounts: 20000,
          primary_residence_value: 0
        }),

        // Liabilities
        supabase.from('client_liabilities').insert({
          user_id: userId,
          mortgage_balance: 0,
          mortgage_rate: 0,
          mortgage_years_remaining: 0
        }),

        // Goals
        supabase.from('client_goals').insert({
          user_id: userId,
          retirement_priority: 8,
          emergency_priority: 9,
          debt_priority: 7,
          retirement_target_age: 65,
          retirement_desired_income: 80000
        }),

        // Preferences
        supabase.from('client_preferences').insert({
          user_id: userId,
          second_home_interest: 'no',
          second_home_budget: 0,
          business_interest: 'no',
          business_capital: 0
        }),

        // Risk Assessment
        supabase.from('client_risk_assessment').insert({
          user_id: userId,
          experience_level: 'intermediate',
          largest_loss: '10_20_percent',
          portfolio_drop_response: 'buy_more',
          investment_timeline: 'long_term'
        }),

        // Sample Credit Cards
        supabase.from('credit_cards').insert([
          {
            user_id: userId,
            name: 'Chase Sapphire',
            balance: 2500,
            limit: 10000,
            rate: 18.99
          },
          {
            user_id: userId,
            name: 'Capital One',
            balance: 1200,
            limit: 5000,
            rate: 22.99
          }
        ]),

        // Sample Student Loan
        supabase.from('student_loans').insert({
          user_id: userId,
          balance: 25000,
          rate: 5.5,
          servicer: 'Nelnet',
          type: 'Federal Direct'
        })
      ]);

      console.log('Sample EBM data created successfully');
    } catch (error) {
      console.error('Error creating sample EBM data:', error);
      throw error;
    }
  }
}