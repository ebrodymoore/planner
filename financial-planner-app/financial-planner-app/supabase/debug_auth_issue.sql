-- Check for any triggers that might be failing
SELECT schemaname, tablename, triggername, procname 
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE n.nspname = 'public';

-- Check for any functions that might be called during auth
SELECT routinename, routinetype, data_type 
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Check if there are any foreign key constraint issues
SELECT conname, conrelid::regclass AS table_name, confrelid::regclass AS referenced_table
FROM pg_constraint 
WHERE contype = 'f' 
AND connamespace = 'public'::regnamespace;

-- Simple test to see if we can insert into auth.users (this will likely fail, but shows the error)
-- DO NOT RUN THIS - just for reference:
-- INSERT INTO auth.users (email) VALUES ('test@example.com');