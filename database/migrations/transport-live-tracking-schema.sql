-- =====================================================
-- TRANSPORT LIVE TRACKING SYSTEM - SCHEMA
-- =====================================================
-- This schema enables real-time vehicle tracking and student attendance monitoring

-- =====================================================
-- 1. VEHICLE GPS TRACKING
-- =====================================================

-- Table to store real-time GPS locations of vehicles
CREATE TABLE IF NOT EXISTS public.vehicle_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2) NULL,  -- Speed in km/h
  heading DECIMAL(5, 2) NULL,  -- Direction in degrees (0-360)
  altitude DECIMAL(8, 2) NULL,  -- Altitude in meters
  accuracy DECIMAL(6, 2) NULL,  -- GPS accuracy in meters
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_id TEXT NULL,  -- GPS device identifier
  battery_level INTEGER NULL,  -- Device battery percentage
  engine_status TEXT DEFAULT 'unknown'::TEXT,  -- running, stopped, idle
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT vehicle_locations_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_locations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_locations_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_locations_engine_status_check CHECK (engine_status = ANY (ARRAY['running'::TEXT, 'stopped'::TEXT, 'idle'::TEXT, 'unknown'::TEXT]))
) TABLESPACE pg_default;

-- Hypertable for time-series data (if using TimescaleDB extension)
-- SELECT create_hypertable('vehicle_locations', 'recorded_at');

-- Table to store current/latest location (for quick access)
CREATE TABLE IF NOT EXISTS public.vehicle_current_location (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2) NULL,
  heading DECIMAL(5, 2) NULL,
  altitude DECIMAL(8, 2) NULL,
  accuracy DECIMAL(6, 2) NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_id TEXT NULL,
  battery_level INTEGER NULL,
  engine_status TEXT DEFAULT 'unknown'::TEXT,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT vehicle_current_location_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_current_location_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_current_location_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_current_location_vehicle_id_unique UNIQUE (tenant_id, vehicle_id),
  CONSTRAINT vehicle_current_location_engine_status_check CHECK (engine_status = ANY (ARRAY['running'::TEXT, 'stopped'::TEXT, 'idle'::TEXT, 'unknown'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- 2. TRIP MANAGEMENT
-- =====================================================

-- Table to track daily trips (morning pickup, afternoon drop, etc.)
CREATE TABLE IF NOT EXISTS public.vehicle_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  route_id UUID NOT NULL,
  driver_id UUID NULL,  -- References staff table for driver
  trip_date DATE NOT NULL,
  trip_type TEXT NOT NULL,  -- morning_pickup, afternoon_drop, etc.
  scheduled_start_time TIMESTAMP WITH TIME ZONE NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE NULL,
  scheduled_end_time TIMESTAMP WITH TIME ZONE NULL,
  actual_end_time TIMESTAMP WITH TIME ZONE NULL,
  status TEXT DEFAULT 'scheduled'::TEXT,
  total_distance DECIMAL(8, 2) NULL,  -- Total distance covered in km
  fuel_consumed DECIMAL(8, 2) NULL,  -- Fuel consumed in liters
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT vehicle_trips_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_trips_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_trips_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_trips_route_id_fkey FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_trips_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES staff(id) ON DELETE SET NULL,
  CONSTRAINT vehicle_trips_trip_type_check CHECK (trip_type = ANY (ARRAY['morning_pickup'::TEXT, 'afternoon_drop'::TEXT, 'special'::TEXT, 'emergency'::TEXT])),
  CONSTRAINT vehicle_trips_status_check CHECK (status = ANY (ARRAY['scheduled'::TEXT, 'in_progress'::TEXT, 'completed'::TEXT, 'cancelled'::TEXT, 'delayed'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- 3. STUDENT BOARDING/ATTENDANCE
-- =====================================================

-- Table to track when students board/alight from vehicles
CREATE TABLE IF NOT EXISTS public.student_trip_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  trip_id UUID NOT NULL,
  student_id UUID NOT NULL,
  stop_id UUID NULL,
  boarding_time TIMESTAMP WITH TIME ZONE NULL,
  boarding_location_lat DECIMAL(10, 8) NULL,
  boarding_location_lng DECIMAL(11, 8) NULL,
  alighting_time TIMESTAMP WITH TIME ZONE NULL,
  alighting_location_lat DECIMAL(10, 8) NULL,
  alighting_location_lng DECIMAL(11, 8) NULL,
  status TEXT DEFAULT 'scheduled'::TEXT,
  marked_by UUID NULL,  -- Staff/driver who marked attendance
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT student_trip_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT student_trip_attendance_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT student_trip_attendance_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES vehicle_trips(id) ON DELETE CASCADE,
  CONSTRAINT student_trip_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT student_trip_attendance_stop_id_fkey FOREIGN KEY (stop_id) REFERENCES route_stops(id) ON DELETE SET NULL,
  CONSTRAINT student_trip_attendance_marked_by_fkey FOREIGN KEY (marked_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT student_trip_attendance_status_check CHECK (status = ANY (ARRAY['scheduled'::TEXT, 'boarded'::TEXT, 'alighted'::TEXT, 'absent'::TEXT, 'no_show'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- 4. GEOFENCING & ALERTS
-- =====================================================

-- Table to define geofences (virtual boundaries around stops, school, etc.)
CREATE TABLE IF NOT EXISTS public.geofences (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NULL,
  center_lat DECIMAL(10, 8) NOT NULL,
  center_lng DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER NOT NULL,  -- Radius in meters
  geofence_type TEXT NOT NULL,  -- school, stop, restricted, safe_zone
  related_stop_id UUID NULL,  -- If geofence is for a stop
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT geofences_pkey PRIMARY KEY (id),
  CONSTRAINT geofences_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT geofences_related_stop_id_fkey FOREIGN KEY (related_stop_id) REFERENCES route_stops(id) ON DELETE SET NULL,
  CONSTRAINT geofences_type_check CHECK (geofence_type = ANY (ARRAY['school'::TEXT, 'stop'::TEXT, 'restricted'::TEXT, 'safe_zone'::TEXT]))
) TABLESPACE pg_default;

-- Table to track geofence events (vehicle entering/exiting boundaries)
CREATE TABLE IF NOT EXISTS public.geofence_events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  geofence_id UUID NOT NULL,
  trip_id UUID NULL,
  event_type TEXT NOT NULL,  -- entered, exited
  event_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT geofence_events_pkey PRIMARY KEY (id),
  CONSTRAINT geofence_events_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT geofence_events_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT geofence_events_geofence_id_fkey FOREIGN KEY (geofence_id) REFERENCES geofences(id) ON DELETE CASCADE,
  CONSTRAINT geofence_events_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES vehicle_trips(id) ON DELETE SET NULL,
  CONSTRAINT geofence_events_event_type_check CHECK (event_type = ANY (ARRAY['entered'::TEXT, 'exited'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- 5. NOTIFICATIONS & ALERTS
-- =====================================================

-- Table to store transport-related notifications
CREATE TABLE IF NOT EXISTS public.transport_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  notification_type TEXT NOT NULL,  -- trip_started, student_boarded, student_alighted, delay, emergency, geofence_alert
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info'::TEXT,  -- info, warning, critical
  related_vehicle_id UUID NULL,
  related_trip_id UUID NULL,
  related_student_id UUID NULL,
  recipient_user_ids UUID[] NULL,  -- Array of user IDs to notify (parents, admins)
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT transport_notifications_pkey PRIMARY KEY (id),
  CONSTRAINT transport_notifications_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT transport_notifications_vehicle_id_fkey FOREIGN KEY (related_vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
  CONSTRAINT transport_notifications_trip_id_fkey FOREIGN KEY (related_trip_id) REFERENCES vehicle_trips(id) ON DELETE SET NULL,
  CONSTRAINT transport_notifications_student_id_fkey FOREIGN KEY (related_student_id) REFERENCES students(id) ON DELETE SET NULL,
  CONSTRAINT transport_notifications_type_check CHECK (notification_type = ANY (ARRAY['trip_started'::TEXT, 'trip_completed'::TEXT, 'student_boarded'::TEXT, 'student_alighted'::TEXT, 'delay'::TEXT, 'emergency'::TEXT, 'geofence_alert'::TEXT, 'speed_alert'::TEXT])),
  CONSTRAINT transport_notifications_severity_check CHECK (severity = ANY (ARRAY['info'::TEXT, 'warning'::TEXT, 'critical'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- 6. EMERGENCY & SOS
-- =====================================================

-- Table to track emergency/SOS alerts from vehicles
CREATE TABLE IF NOT EXISTS public.vehicle_sos_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  trip_id UUID NULL,
  alert_type TEXT NOT NULL,  -- panic_button, accident, breakdown, medical_emergency
  severity TEXT DEFAULT 'high'::TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  triggered_by UUID NULL,  -- Driver/staff who triggered
  alert_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_by UUID NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE NULL,
  resolved_by UUID NULL,
  resolved_at TIMESTAMP WITH TIME ZONE NULL,
  status TEXT DEFAULT 'active'::TEXT,
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT vehicle_sos_alerts_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_sos_alerts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_sos_alerts_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_sos_alerts_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES vehicle_trips(id) ON DELETE SET NULL,
  CONSTRAINT vehicle_sos_alerts_triggered_by_fkey FOREIGN KEY (triggered_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT vehicle_sos_alerts_acknowledged_by_fkey FOREIGN KEY (acknowledged_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT vehicle_sos_alerts_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT vehicle_sos_alerts_alert_type_check CHECK (alert_type = ANY (ARRAY['panic_button'::TEXT, 'accident'::TEXT, 'breakdown'::TEXT, 'medical_emergency'::TEXT, 'security_threat'::TEXT])),
  CONSTRAINT vehicle_sos_alerts_severity_check CHECK (severity = ANY (ARRAY['low'::TEXT, 'medium'::TEXT, 'high'::TEXT, 'critical'::TEXT])),
  CONSTRAINT vehicle_sos_alerts_status_check CHECK (status = ANY (ARRAY['active'::TEXT, 'acknowledged'::TEXT, 'resolved'::TEXT, 'false_alarm'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Vehicle Locations
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_id ON public.vehicle_locations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_recorded_at ON public.vehicle_locations(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_recorded ON public.vehicle_locations(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_current_location_vehicle_id ON public.vehicle_current_location(vehicle_id);

-- Trips
CREATE INDEX IF NOT EXISTS idx_vehicle_trips_vehicle_id ON public.vehicle_trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_trips_route_id ON public.vehicle_trips(route_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_trips_trip_date ON public.vehicle_trips(trip_date DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_trips_status ON public.vehicle_trips(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_trips_vehicle_date ON public.vehicle_trips(vehicle_id, trip_date DESC);

-- Student Attendance
CREATE INDEX IF NOT EXISTS idx_student_trip_attendance_trip_id ON public.student_trip_attendance(trip_id);
CREATE INDEX IF NOT EXISTS idx_student_trip_attendance_student_id ON public.student_trip_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_student_trip_attendance_status ON public.student_trip_attendance(status);

-- Geofences
CREATE INDEX IF NOT EXISTS idx_geofence_events_vehicle_id ON public.geofence_events(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_geofence_events_geofence_id ON public.geofence_events(geofence_id);
CREATE INDEX IF NOT EXISTS idx_geofence_events_event_time ON public.geofence_events(event_time DESC);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_transport_notifications_tenant_id ON public.transport_notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transport_notifications_created_at ON public.transport_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transport_notifications_is_read ON public.transport_notifications(is_read);

-- SOS Alerts
CREATE INDEX IF NOT EXISTS idx_vehicle_sos_alerts_vehicle_id ON public.vehicle_sos_alerts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_sos_alerts_status ON public.vehicle_sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_sos_alerts_alert_time ON public.vehicle_sos_alerts(alert_time DESC);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_current_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_trip_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_sos_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same pattern for all tables - tenant isolation)
CREATE POLICY "Users can view their tenant's vehicle locations"
  ON public.vehicle_locations FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can view their tenant's current vehicle locations"
  ON public.vehicle_current_location FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can manage their tenant's vehicle trips"
  ON public.vehicle_trips FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can manage their tenant's student trip attendance"
  ON public.student_trip_attendance FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

-- Parents can view their children's trip attendance
CREATE POLICY "Parents can view their children's trip attendance"
  ON public.student_trip_attendance FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT student_id FROM public.guardians
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their tenant's geofences"
  ON public.geofences FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can view their tenant's geofence events"
  ON public.geofence_events FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can manage their tenant's transport notifications"
  ON public.transport_notifications FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can manage their tenant's SOS alerts"
  ON public.vehicle_sos_alerts FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.vehicle_locations IS 'Stores historical GPS location data for all vehicles';
COMMENT ON TABLE public.vehicle_current_location IS 'Stores only the latest/current location of each vehicle for quick access';
COMMENT ON TABLE public.vehicle_trips IS 'Tracks individual trips/journeys made by vehicles';
COMMENT ON TABLE public.student_trip_attendance IS 'Records when students board and alight from vehicles during trips';
COMMENT ON TABLE public.geofences IS 'Defines virtual geographic boundaries for monitoring';
COMMENT ON TABLE public.geofence_events IS 'Logs when vehicles enter or exit geofenced areas';
COMMENT ON TABLE public.transport_notifications IS 'Stores notifications sent to parents/admins about transport events';
COMMENT ON TABLE public.vehicle_sos_alerts IS 'Emergency alerts triggered from vehicles requiring immediate attention';
