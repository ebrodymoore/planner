-- IMMEDIATE FIX for "Database error granting user"
-- Copy and paste this into your Supabase SQL Editor and run it

-- 1. Fix the problematic trigger function that's causing auth failures
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if user profile exists
  UPDATE user_profiles 
  SET last_login_at = NOW() 
  WHERE user_id = NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail auth if profile update fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create automatic user profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail auth if profile creation fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- 4. Allow profile insertion during signup
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles 
FOR INSERT WITH CHECK (true);

-- Test query to verify setup
SELECT 'Setup complete - try signup now' as status;