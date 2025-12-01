# Notifications System - Quick Setup Guide

## 1. Run Database Migration

Open Supabase SQL Editor and run this file:
```
database/notifications-schema.sql
```

This will create:
- ✅ `notifications` table
- ✅ Indexes for performance
- ✅ RLS policies
- ✅ Helper functions (`notify_superadmins`, `mark_all_notifications_read`)
- ✅ Triggers for school create/update/delete
- ✅ Trigger for important activity logs

## 2. Verify Tables Created

Run this query in Supabase SQL Editor:
```sql
SELECT * FROM notifications LIMIT 1;
```

Should return empty result (no error).

## 3. Verify Triggers Created

Run this query:
```sql
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname LIKE 'trigger_notify%';
```

Should return 4 triggers:
- trigger_notify_school_created
- trigger_notify_school_updated  
- trigger_notify_school_deleted
- trigger_notify_important_activity

## 4. Test Notifications

### Test 1: Create a School
1. Go to http://localhost:3000/admin/schools/new
2. Fill in school details
3. Click "Create School"
4. ✅ Bell icon should show unread count
5. ✅ Click bell to see notification

### Test 2: Update a School
1. Go to http://localhost:3000/admin/schools
2. Click "Manage" on any school
3. Change the status or plan
4. Click "Save Changes"
5. ✅ New notification should appear

### Test 3: Delete a School
1. Go to http://localhost:3000/admin/schools
2. Click "Delete" on any school
3. Confirm deletion
4. ✅ Deletion notification should appear

### Test 4: Real-Time Updates
1. Open admin portal in two browser tabs
2. In tab 1: Create a school
3. In tab 2: ✅ Bell icon updates without refresh

## 5. Notification Features

- **Unread Badge:** Shows count of unread notifications
- **Real-Time:** Updates automatically via Supabase Realtime
- **Mark as Read:** Click checkmark icon
- **Mark All as Read:** Click "Mark all read" button
- **Delete:** Click X icon to remove notification
- **View Action:** Click "View" button to navigate to related page
- **Color Coded:** Different colors for create/update/delete

## 6. Troubleshooting

**No notifications appearing?**
```sql
-- Check if triggers exist
SELECT tgname FROM pg_trigger WHERE tgname LIKE 'trigger_notify%';

-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'notify_superadmins';

-- Manually insert test notification
INSERT INTO notifications (user_id, title, message, type)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Test Notification',
  'This is a test',
  'info'
);
```

**Unread count wrong?**
```sql
-- Check your notifications
SELECT * FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your@email.com')
ORDER BY created_at DESC;
```

**Not getting notifications for school actions?**
```sql
-- Test trigger manually
INSERT INTO school_instances (
  tenant_id, subdomain, school_name, status, subscription_plan, max_students, max_staff
) VALUES (
  (SELECT id FROM tenants LIMIT 1),
  'test-school-trigger',
  'Test Trigger School',
  'active',
  'basic',
  100,
  20
);

-- Check if notification was created
SELECT * FROM notifications WHERE type = 'school_created' ORDER BY created_at DESC LIMIT 1;
```

## 7. Production Deployment

Before deploying to production:
1. ✅ Run notifications-schema.sql in production Supabase
2. ✅ Enable Realtime on notifications table in Supabase dashboard
3. ✅ Verify triggers are enabled
4. ✅ Test with real user accounts

## 8. Next Steps

After setup is complete:
- Monitor notification performance in Activity Logs
- Consider adding email notifications for critical events
- Customize notification messages as needed
- Add notification preferences (allow users to mute types)
