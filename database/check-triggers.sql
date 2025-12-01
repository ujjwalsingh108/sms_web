-- Quick check: Are database triggers enabled?
-- Run this to see if triggers exist

SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled,
  CASE 
    WHEN tgenabled = 'O' THEN '✅ Enabled'
    WHEN tgenabled = 'D' THEN '❌ Disabled'
    ELSE '⚠️ Unknown'
  END as status
FROM pg_trigger
WHERE tgname LIKE 'trigger_notify%';

-- If triggers exist and are enabled, we should DISABLE the manual notifications in the code
-- If no triggers exist, the manual notifications are needed
