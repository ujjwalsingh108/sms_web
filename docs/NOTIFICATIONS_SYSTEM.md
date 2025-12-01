# Notifications System - How It Works

## Overview
The notifications system is fully integrated with the database using PostgreSQL triggers and real-time subscriptions. Notifications are automatically created and displayed in real-time.

## Database Schema

### Notifications Table
- `id` - Unique identifier
- `user_id` - Links to auth.users (who receives the notification)
- `title` - Notification title
- `message` - Notification message
- `type` - Type of notification (school_created, school_updated, school_deleted, activity, system, info)
- `read` - Boolean flag (false = unread, true = read)
- `action_url` - Optional URL for "View" button
- `metadata` - JSONB field for additional context
- `created_at` - Timestamp

## Automatic Notification Triggers

### ✅ School Created
**Trigger:** `trigger_notify_school_created`
**When:** After INSERT on `school_instances` table
**Action:** Creates notification for all superadmins
**Message:** "A new school '{school_name}' has been added to the platform."
**Link:** /admin/schools

**How it works:**
1. User creates a school via create-school-form.tsx
2. Row is inserted into school_instances table
3. Database trigger automatically fires
4. notify_superadmins() function creates notification for each superadmin
5. Real-time subscription detects new notification
6. Bell icon updates with unread count
7. Notification appears in drawer

### ✅ School Updated
**Trigger:** `trigger_notify_school_updated`
**When:** After UPDATE on `school_instances` table (only if status, subscription_plan, or school_name changes)
**Action:** Creates notification for all superadmins
**Message:** "School '{school_name}' has been updated."
**Link:** /admin/schools

**How it works:**
1. User updates school via edit-school-form.tsx
2. Row is updated in school_instances table
3. Trigger checks if significant fields changed (status, plan, or name)
4. If yes, creates notification for all superadmins
5. Real-time subscription detects new notification
6. Notification appears in drawer

### ✅ School Deleted
**Trigger:** `trigger_notify_school_deleted`
**When:** BEFORE DELETE on `school_instances` table
**Action:** Creates notification for all superadmins
**Message:** "School '{school_name}' has been removed from the platform."
**Link:** /admin/schools

**How it works:**
1. User clicks Delete button in schools list
2. deleteSchool() server action is called
3. BEFORE DELETE trigger fires (captures OLD row data)
4. Creates notification with school details
5. Row is deleted
6. Real-time subscription detects new notification
7. Notification appears in drawer

### ⚠️ Activity Logs (Backup Only)
**Trigger:** `trigger_notify_important_activity`
**When:** After INSERT on `admin_activity_logs` table
**Action:** Only notifies for critical activities (SYSTEM_ERROR, SECURITY_ALERT, DATA_BREACH)
**Note:** School-related activities are already covered by school triggers, so this doesn't create duplicates

## Real-Time Updates

### Supabase Realtime Channel
The NotificationsDrawer component subscribes to database changes:

```typescript
const channel = supabase
  .channel("notifications")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "notifications",
  }, () => {
    fetchNotifications(); // Refresh notifications list
  })
  .subscribe();
```

**This means:**
- New notifications appear instantly without page refresh
- Unread count updates in real-time
- Multiple admins see notifications simultaneously
- No polling or manual refresh needed

## Row Level Security (RLS)

### Who Can See Notifications?
1. **Own Notifications:** Users can see their own notifications
2. **All Notifications:** Superadmins can see all notifications (for auditing)

### Who Can Modify Notifications?
1. **Mark as Read:** Users can update their own notifications
2. **Delete:** Users can delete their own notifications
3. **Insert:** System/triggers can insert notifications (open policy for triggers)

## Notification Features

### In the Drawer:
- ✅ Real-time updates (no refresh needed)
- ✅ Unread count badge on bell icon
- ✅ Color-coded by type (blue=created, yellow=updated, red=deleted, green=activity)
- ✅ Icons for each notification type
- ✅ "View" button with action_url
- ✅ Individual "Mark as Read" button
- ✅ "Mark All as Read" button
- ✅ Delete individual notifications
- ✅ Relative timestamps ("2 minutes ago")
- ✅ Empty state when no notifications
- ✅ Scrollable list (last 50 notifications)

### Notification Types:
- `school_created` - Blue school icon
- `school_updated` - Yellow school icon  
- `school_deleted` - Red school icon
- `activity` - Green activity icon
- `system` - Gray info icon
- `info` - Gray info icon

## Testing Checklist

### ✅ School Creation Flow
1. Go to /admin/schools/new
2. Fill in school details
3. Click "Create School"
4. **Expected:** Notification appears in bell icon drawer with "New School Created" message
5. **Expected:** Unread count increases by 1

### ✅ School Update Flow
1. Go to /admin/schools
2. Click "Manage" on any school
3. Change status, plan, or name
4. Click "Save Changes"
5. **Expected:** Notification appears with "School Updated" message
6. **Expected:** Only fires if status, subscription_plan, or school_name changed

### ✅ School Delete Flow
1. Go to /admin/schools
2. Click "Delete" on any school
3. Confirm deletion
4. **Expected:** Notification appears with "School Deleted" message
5. **Expected:** Includes school name and subdomain in metadata

### ✅ Real-Time Updates
1. Open admin portal in two browser windows (or tabs)
2. In window 1: Create a school
3. In window 2: **Expected:** Bell icon updates without refresh
4. In window 2: Open notifications drawer
5. **Expected:** New notification appears automatically

### ✅ Mark as Read
1. Open notifications drawer
2. Click checkmark on unread notification
3. **Expected:** Notification becomes semi-transparent
4. **Expected:** Unread count decreases by 1

### ✅ Mark All as Read
1. Have multiple unread notifications
2. Click "Mark all read" button
3. **Expected:** All notifications become semi-transparent
4. **Expected:** Unread count becomes 0

### ✅ Delete Notification
1. Open notifications drawer
2. Click X button on any notification
3. **Expected:** Notification disappears from list
4. **Expected:** If unread, count decreases by 1

## SQL Commands to Run

**In Supabase SQL Editor:**
1. Copy entire content of `database/notifications-schema.sql`
2. Paste into SQL Editor
3. Click "Run"
4. Verify tables and triggers created successfully

**Note:** Run this AFTER the admin-activity-logs-rls.sql and all other schema files.

## Troubleshooting

### Notifications not appearing?
1. Check if table exists: `SELECT * FROM notifications LIMIT 1;`
2. Check if triggers exist: `SELECT * FROM pg_trigger WHERE tgname LIKE 'trigger_notify%';`
3. Check RLS policies: User must be superadmin to receive notifications
4. Check browser console for Supabase errors

### Unread count not updating?
1. Check real-time subscription in browser Network tab
2. Verify Supabase Realtime is enabled in project settings
3. Check if notifications table has RLS enabled

### Notifications showing wrong user?
1. Verify user is logged in as superadmin
2. Check members table has correct role_id linked to 'superadmin' role
3. Check notify_superadmins() function is selecting correct users

## Architecture Summary

```
User Action (Create/Update/Delete School)
    ↓
Database Operation (INSERT/UPDATE/DELETE on school_instances)
    ↓
PostgreSQL Trigger Fires (trigger_notify_school_*)
    ↓
notify_superadmins() Function Executes
    ↓
INSERT into notifications table (one row per superadmin)
    ↓
Supabase Realtime broadcasts change
    ↓
NotificationsDrawer receives event via subscription
    ↓
fetchNotifications() called
    ↓
UI updates with new notification + unread count
```

## Performance Considerations

- Notifications limited to 50 most recent
- Indexes on user_id, created_at, and read for fast queries
- Real-time subscription auto-reconnects on disconnect
- Unread count calculated client-side from filtered array
- Database triggers are SECURITY DEFINER (bypass RLS for system operations)

## Future Enhancements (Not Implemented Yet)

- [ ] Email notifications for critical events
- [ ] Push notifications (PWA)
- [ ] Notification preferences (user can mute certain types)
- [ ] Notification history page (beyond 50 limit)
- [ ] Bulk delete/archive notifications
- [ ] Notification categories/filters
- [ ] Sound/desktop notifications
