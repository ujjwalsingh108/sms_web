-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('school_created', 'school_updated', 'school_deleted', 'activity', 'system', 'info')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Superadmins can view all notifications
CREATE POLICY "Superadmins can view all notifications"
  ON notifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert notifications
CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to create notification for all superadmins
CREATE OR REPLACE FUNCTION notify_superadmins(
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT,
  notification_action_url TEXT DEFAULT NULL,
  notification_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, action_url, metadata)
  SELECT m.user_id, notification_title, notification_message, notification_type, notification_action_url, notification_metadata
  FROM members m
  JOIN roles r ON m.role_id = r.id
  WHERE r.name = 'superadmin';
END;
$$;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET read = true
  WHERE user_id = target_user_id AND read = false;
END;
$$;

-- Trigger to create notifications when school is created
CREATE OR REPLACE FUNCTION notify_school_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM notify_superadmins(
    'New School Created',
    'A new school "' || NEW.school_name || '" has been added to the platform.',
    'school_created',
    '/admin/schools',
    jsonb_build_object('school_id', NEW.id, 'subdomain', NEW.subdomain)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_school_created
AFTER INSERT ON school_instances
FOR EACH ROW
EXECUTE FUNCTION notify_school_created();

-- Trigger to create notifications when school is updated
CREATE OR REPLACE FUNCTION notify_school_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify if significant fields changed
  IF (OLD.status IS DISTINCT FROM NEW.status) OR 
     (OLD.subscription_plan IS DISTINCT FROM NEW.subscription_plan) OR
     (OLD.school_name IS DISTINCT FROM NEW.school_name) THEN
    PERFORM notify_superadmins(
      'School Updated',
      'School "' || NEW.school_name || '" has been updated.',
      'school_updated',
      '/admin/schools',
      jsonb_build_object('school_id', NEW.id, 'subdomain', NEW.subdomain)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_school_updated
AFTER UPDATE ON school_instances
FOR EACH ROW
EXECUTE FUNCTION notify_school_updated();

-- Trigger to create notifications when school is deleted
CREATE OR REPLACE FUNCTION notify_school_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM notify_superadmins(
    'School Deleted',
    'School "' || OLD.school_name || '" has been removed from the platform.',
    'school_deleted',
    '/admin/schools',
    jsonb_build_object('school_name', OLD.school_name, 'subdomain', OLD.subdomain, 'status', OLD.status)
  );
  RETURN OLD;
END;
$$;

CREATE TRIGGER trigger_notify_school_deleted
BEFORE DELETE ON school_instances
FOR EACH ROW
EXECUTE FUNCTION notify_school_deleted();

-- Trigger to create notifications for important activity logs
CREATE OR REPLACE FUNCTION notify_important_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify for certain critical actions
  IF NEW.action IN ('CREATE_SCHOOL', 'DELETE_SCHOOL', 'UPDATE_SCHOOL') THEN
    -- Don't create duplicate notifications if school triggers already fired
    -- This is a backup in case triggers fail
    RETURN NEW;
  END IF;
  
  -- Notify for other important activities
  IF NEW.action IN ('SYSTEM_ERROR', 'SECURITY_ALERT', 'DATA_BREACH') THEN
    PERFORM notify_superadmins(
      'Important Activity: ' || NEW.action,
      'An important activity was logged. Please review.',
      'activity',
      '/admin/activity',
      jsonb_build_object('activity_id', NEW.id, 'action', NEW.action)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_important_activity
AFTER INSERT ON admin_activity_logs
FOR EACH ROW
EXECUTE FUNCTION notify_important_activity();
