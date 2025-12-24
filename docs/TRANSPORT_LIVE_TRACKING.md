# Transport Live Tracking System - Implementation Guide

## Overview
Complete system for real-time vehicle tracking, student attendance monitoring, geofencing, and emergency alerts.

## Architecture

### 1. **Data Flow**
```
GPS Device/Mobile App → API → Supabase → Real-time Subscriptions → Dashboard
                                    ↓
                              Geofence Check
                                    ↓
                              Notifications/Alerts
```

### 2. **Components**

#### Database Tables (8 New Tables)
1. **vehicle_locations** - Historical GPS data
2. **vehicle_current_location** - Latest position (optimized for quick access)
3. **vehicle_trips** - Trip management
4. **student_trip_attendance** - Board/alight tracking
5. **geofences** - Virtual boundaries
6. **geofence_events** - Boundary crossing logs
7. **transport_notifications** - Alert system
8. **vehicle_sos_alerts** - Emergency system

## Implementation Steps

### Phase 1: Database Setup

#### Step 1.1: Run Migration
```sql
-- Execute in Supabase SQL Editor
database/migrations/transport-live-tracking-schema.sql
```

#### Step 1.2: Enable Realtime (Optional but Recommended)
```sql
-- Enable realtime on critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_current_location;
ALTER PUBLICATION supabase_realtime ADD TABLE student_trip_attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE transport_notifications;
```

### Phase 2: GPS Data Collection

#### Option A: Mobile App for Drivers (Recommended)
Create a driver mobile app using React Native/Flutter:

**Features:**
- Background GPS tracking
- Send location every 10-30 seconds
- Manual student check-in/check-out
- SOS button
- Trip start/end controls

**Example GPS Data Submission:**
```typescript
// lib/actions/transport-tracking.ts
export async function submitVehicleLocation(data: {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  engineStatus?: string;
}) {
  const supabase = await createClient();
  
  // Insert into historical table
  await supabase.from('vehicle_locations').insert({
    vehicle_id: data.vehicleId,
    latitude: data.latitude,
    longitude: data.longitude,
    speed: data.speed,
    heading: data.heading,
    accuracy: data.accuracy,
    engine_status: data.engineStatus,
    recorded_at: new Date().toISOString(),
  });
  
  // Upsert into current location table
  await supabase.from('vehicle_current_location')
    .upsert({
      vehicle_id: data.vehicleId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      heading: data.heading,
      accuracy: data.accuracy,
      engine_status: data.engineStatus,
      recorded_at: new Date().toISOString(),
    }, {
      onConflict: 'tenant_id,vehicle_id'
    });
}
```

#### Option B: Hardware GPS Devices
- GPS tracker devices (e.g., Teltonika, Queclink)
- Connect via Webhooks/API
- Parse NMEA/proprietary protocols
- Store in database

#### Option C: Mobile Web App (Simpler Alternative)
Driver accesses web app on phone:
```typescript
// Get GPS from browser
navigator.geolocation.watchPosition(
  async (position) => {
    await submitVehicleLocation({
      vehicleId: currentVehicle.id,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      heading: position.coords.heading,
      accuracy: position.coords.accuracy,
    });
  },
  (error) => console.error('GPS Error:', error),
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);
```

### Phase 3: Live Tracking Dashboard

#### Create Live Map Component
```typescript
// components/transport/live-tracking-map.tsx
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function LiveTrackingMap() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial positions
    fetchVehiclePositions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('vehicle-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_current_location'
        },
        (payload) => {
          console.log('Location update:', payload);
          updateVehiclePosition(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchVehiclePositions() {
    const { data } = await supabase
      .from('vehicle_current_location')
      .select(`
        *,
        vehicle:vehicle_id (
          id,
          vehicle_number,
          vehicle_type,
          driver_name
        )
      `);
    
    setVehicles(data || []);
  }

  function updateVehiclePosition(newLocation: any) {
    setVehicles(prev => {
      const index = prev.findIndex(v => v.vehicle_id === newLocation.vehicle_id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...newLocation };
        return updated;
      }
      return [...prev, newLocation];
    });
  }

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // India center
      zoom={6}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.latitude, vehicle.longitude]}
        >
          <Popup>
            <div>
              <h3>{vehicle.vehicle?.vehicle_number}</h3>
              <p>Driver: {vehicle.vehicle?.driver_name}</p>
              <p>Speed: {vehicle.speed} km/h</p>
              <p>Status: {vehicle.engine_status}</p>
              <p>Last Update: {new Date(vehicle.recorded_at).toLocaleTimeString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

#### Create Page
```typescript
// app/dashboard/transport/live-tracking/page.tsx
import { LiveTrackingMap } from '@/components/transport/live-tracking-map';

export default function LiveTrackingPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Live Vehicle Tracking</h1>
      <LiveTrackingMap />
    </div>
  );
}
```

### Phase 4: Student Boarding/Attendance System

#### Driver Mobile App - Student Check-in
```typescript
// components/transport/student-checkin.tsx
export async function markStudentBoarded(
  tripId: string,
  studentId: string,
  stopId: string,
  currentLocation: { lat: number; lng: number }
) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('student_trip_attendance')
    .update({
      status: 'boarded',
      boarding_time: new Date().toISOString(),
      boarding_location_lat: currentLocation.lat,
      boarding_location_lng: currentLocation.lng,
      marked_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq('trip_id', tripId)
    .eq('student_id', studentId);

  // Send notification to parents
  await sendNotificationToParents(studentId, 'student_boarded', {
    time: new Date(),
    location: currentLocation,
  });

  return { data, error };
}
```

#### Parent Portal - Track Child
```typescript
// app/parent-portal/transport/page.tsx
"use client";

export function MyChildTransport() {
  const [childLocation, setChildLocation] = useState(null);
  const [tripStatus, setTripStatus] = useState(null);

  useEffect(() => {
    // Get child's current trip
    fetchChildCurrentTrip();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('child-transport')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_trip_attendance',
          filter: `student_id=eq.${childId}`
        },
        (payload) => {
          updateTripStatus(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h2>Track Your Child</h2>
      {tripStatus?.status === 'boarded' && (
        <div className="alert alert-success">
          ✅ Child boarded the bus at {tripStatus.boarding_time}
        </div>
      )}
      {/* Show bus location on map */}
      <MapView vehicleId={tripStatus?.vehicle_id} />
    </div>
  );
}
```

### Phase 5: Geofencing & Alerts

#### Create Geofence Function
```typescript
// lib/actions/geofencing.ts
export async function checkGeofenceViolation(
  vehicleId: string,
  latitude: number,
  longitude: number
) {
  const supabase = await createClient();
  
  // Get all active geofences
  const { data: geofences } = await supabase
    .from('geofences')
    .select('*')
    .eq('is_active', true);

  for (const geofence of geofences || []) {
    const distance = calculateDistance(
      latitude,
      longitude,
      geofence.center_lat,
      geofence.center_lng
    );

    const wasInside = await checkPreviousState(vehicleId, geofence.id);
    const isInside = distance <= geofence.radius_meters;

    // Detect entry/exit
    if (!wasInside && isInside) {
      await logGeofenceEvent(vehicleId, geofence.id, 'entered', latitude, longitude);
      await sendGeofenceNotification(vehicleId, geofence, 'entered');
    } else if (wasInside && !isInside) {
      await logGeofenceEvent(vehicleId, geofence.id, 'exited', latitude, longitude);
      await sendGeofenceNotification(vehicleId, geofence, 'exited');
    }
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

### Phase 6: Emergency SOS System

#### SOS Button Component
```typescript
// components/transport/sos-button.tsx
export function SOSButton({ vehicleId, tripId }: { vehicleId: string, tripId?: string }) {
  const [isActive, setIsActive] = useState(false);

  async function triggerSOS(alertType: string) {
    const position = await getCurrentPosition();
    const supabase = await createClient();

    const { data } = await supabase.from('vehicle_sos_alerts').insert({
      vehicle_id: vehicleId,
      trip_id: tripId,
      alert_type: alertType,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      severity: 'high',
      status: 'active',
    }).select().single();

    // Send immediate notifications to admins
    await notifyEmergencyContacts(data);
    
    setIsActive(true);
  }

  return (
    <div>
      <button
        onClick={() => triggerSOS('panic_button')}
        className="bg-red-600 text-white px-6 py-3 rounded-lg"
        disabled={isActive}
      >
        🚨 EMERGENCY SOS
      </button>
      
      <div className="mt-4 space-x-2">
        <button onClick={() => triggerSOS('breakdown')}>
          Breakdown
        </button>
        <button onClick={() => triggerSOS('medical_emergency')}>
          Medical Emergency
        </button>
        <button onClick={() => triggerSOS('accident')}>
          Accident
        </button>
      </div>
    </div>
  );
}
```

## Deployment Checklist

### Prerequisites
- [ ] Supabase project with service role key
- [ ] Map API (OpenStreetMap is free, or use Google Maps)
- [ ] Mobile app or GPS device integration
- [ ] SSL certificate for secure GPS data transmission

### Database
- [ ] Run migration: `transport-live-tracking-schema.sql`
- [ ] Enable realtime on required tables
- [ ] Set up RLS policies
- [ ] Create indexes
- [ ] Set up data retention policy (delete old location data after X days)

### Backend
- [ ] Create API endpoints for GPS data ingestion
- [ ] Set up background jobs for geofence checking
- [ ] Configure notification service (email/SMS/push)
- [ ] Set up webhook for GPS device integration (if using hardware)

### Frontend
- [ ] Install mapping library: `npm install leaflet react-leaflet`
- [ ] Install types: `npm install -D @types/leaflet`
- [ ] Create live tracking dashboard
- [ ] Create driver mobile interface
- [ ] Create parent tracking portal
- [ ] Add SOS alert handling

### Testing
- [ ] Test GPS data ingestion
- [ ] Test real-time map updates
- [ ] Test student check-in/out flow
- [ ] Test geofence entry/exit detection
- [ ] Test SOS alert system
- [ ] Test parent notifications
- [ ] Load test with multiple vehicles

## Hardware Options

### GPS Tracking Devices
1. **Mobile Phones (Cheapest)**
   - Driver's phone with mobile app
   - Pros: No hardware cost, easy setup
   - Cons: Battery drain, phone dependency

2. **OBD-II GPS Trackers ($30-$100)**
   - Plugs into vehicle's OBD port
   - Examples: Vyncs, MOTOsafety
   - Pros: Automatic, no battery issues
   - Cons: Requires installation

3. **Professional Fleet Trackers ($100-$300)**
   - Hardwired GPS devices
   - Examples: Teltonika, Queclink
   - Pros: Reliable, tamper-proof
   - Cons: Installation cost

## Cost Breakdown

### Low Budget Setup (~$100/month)
- Mobile app for drivers (free)
- Supabase free tier
- OpenStreetMap (free)
- SMS notifications via Twilio (~$50/mo)
- Total: ~$100/month

### Professional Setup (~$500/month)
- GPS hardware ($100/vehicle one-time)
- Supabase Pro ($25/mo)
- Google Maps API (~$200/mo)
- SMS + Push notifications (~$100/mo)
- Mobile app development (~$5000 one-time)
- Total: ~$500/month + $5000 one-time

## Security Considerations

1. **Data Privacy**
   - Only store necessary location data
   - Implement data retention policies
   - Encrypt GPS data in transit (HTTPS)

2. **Access Control**
   - Parents can only see their child's bus
   - Drivers can only access assigned vehicles
   - Admins have full access

3. **SOS Authentication**
   - Verify SOS alerts before notifying
   - Log all SOS trigger events
   - Prevent false alarms

## Performance Optimization

1. **GPS Data Collection**
   - Send location every 15-30 seconds (not every second)
   - Batch updates when possible
   - Use lightweight payloads

2. **Database**
   - Archive old location data (> 30 days)
   - Use current_location table for real-time display
   - Index all foreign keys

3. **Frontend**
   - Implement map clustering for many vehicles
   - Use WebSocket for real-time updates
   - Lazy load historical data

## Next Steps

1. **Phase 1 (Week 1-2)**: Database setup + GPS data collection
2. **Phase 2 (Week 3-4)**: Live tracking dashboard
3. **Phase 3 (Week 5-6)**: Student attendance system
4. **Phase 4 (Week 7-8)**: Geofencing + notifications
5. **Phase 5 (Week 9-10)**: Parent portal + mobile app
6. **Phase 6 (Week 11-12)**: Testing + deployment

## Support Resources

- **Database Schema**: `database/migrations/transport-live-tracking-schema.sql`
- **Supabase Realtime Docs**: https://supabase.com/docs/guides/realtime
- **Leaflet Docs**: https://leafletjs.com/
- **React Leaflet**: https://react-leaflet.js.org/

## Troubleshooting

**GPS data not showing on map:**
- Check if location data is being inserted into database
- Verify RLS policies allow reading
- Check browser console for errors

**Real-time updates not working:**
- Enable realtime on Supabase tables
- Check subscription channel is active
- Verify WebSocket connection

**Geofence alerts not triggering:**
- Verify geofence radius is reasonable (>50m)
- Check geofence calculation function
- Ensure geofence checking runs on each location update

## Conclusion

This system provides enterprise-grade vehicle tracking with student safety features. Start with Phase 1 (database + basic GPS) and progressively add features based on your requirements and budget.
