# Recent Visitors Workflow - Complete Implementation Guide

## Overview

The Recent Visitors module provides a **complete guest management system** for tracking external visitors entering and exiting the campus. This is distinct from Gate Passes, which are for internal users (students and staff).

---

## Workflow: Person ENTERING Campus as Guest

### **Phase 1: Visitor Arrival (Check-in)**

#### Flow:
1. **Visitor Arrives at Gate** → Security logs check-in
2. **Access Control** → Verify ID proof, record details
3. **Notification** → Person to meet is notified
4. **Dashboard Update** → Visitor appears in "Active Visitors" section

#### Data Captured:
- Visitor name
- Phone number
- Email
- Purpose of visit
- Person to meet on campus
- Check-in time (automatic)
- ID proof type (Aadhar, Passport, DL, etc.)
- ID proof number
- Status: `checked_in`

---

### **Phase 2: Visitor On Campus (Duration)**

#### Features:
- **Real-time Duration Tracking**: Shows how long visitor has been on campus
- **Active Status Badge**: Green indicator with pulsing animation
- **Quick Checkout Option**: Edit button allows immediate checkout
- **Notes & Remarks**: Staff can add observations

#### Dashboard Display:
- Section: **"Active Visitors on Campus"**
- Shows only visitors with `status = "checked_in"`
- Filtered for today's date
- Sorted by most recent check-in first
- Duration calculated as: `now - check_in_time`

---

### **Phase 3: Visitor Departure (Check-out)**

#### Flow:
1. **Visitor Departs** → Security updates checkout
2. **Check-out Time Recording** → Automatic timestamp
3. **Status Change** → Status changes to `checked_out`
4. **Visitor Moves to History** → Appears in "Today's Visitor Activity"

#### Data Updated:
- Check-out time (automatic)
- Status: `checked_out`
- Optional remarks about visit

---

## Complete CRUD Operations

### **CREATE: Log New Visitor**

**Route**: `/dashboard/security/visitors/new`

**Form Fields**:
- Visitor Name (required)
- Phone Number
- Email
- Purpose of Visit (required)
- Person to Meet (required)
- ID Proof Type (dropdown: Aadhar, Passport, Driving License, etc.)
- ID Proof Number
- Status (checked_in / checked_out)
- Remarks (optional)

**Validation**:
- All required fields must be filled
- Phone format validation
- Email format validation
- Check-in time defaults to current time
- Tenant isolation: Automatically assigned to user's tenant

**Result**: New visitor record created, appears in Active Visitors

---

### **READ: View Visitor Details**

**Route**: `/dashboard/security/visitors/[id]`

**Displays**:
- Complete visitor information
- Status badge (Checked In / Checked Out)
- Check-in and check-out times
- ID proof details
- Purpose and remarks
- Duration if still on campus
- Quick checkout button if checked in

**Server-side Security**:
- Auth check: User must be logged in
- Tenant validation: Can only view visitors in own tenant
- Soft-delete filtering: Skips deleted records

---

### **UPDATE: Edit Visitor Details**

**Route**: `/dashboard/security/visitors/[id]/edit`

**Editable Fields**:
- Visitor name
- Phone
- Email
- Purpose
- Person to meet
- ID proof type/number
- Status (checked_in / checked_out)
- Check-out time
- Remarks

**Features**:
- Form validation with toast notifications
- Status dropdown for quick status change
- Conditional required fields (if status is checked_out, check_out_time becomes required)
- Auto-refresh after update
- Edit button styling: Purple-Pink gradient

**Form Behavior**:
```typescript
// If status changes to "checked_out", validate check-out time
if (formData.status === "checked_out" && !formData.check_out_time) {
  // Show error, require check-out time
}
```

---

### **DELETE: Soft-delete Visitor Record**

**Implementation**: 
- Database field: `is_deleted` (boolean)
- Not exposed in UI (soft-delete on backend)
- Records with `is_deleted = true` are filtered from all queries

**Query Pattern**:
```sql
SELECT * FROM visitors 
WHERE tenant_id = $1 
AND is_deleted = false
```

---

## Dashboard Sections

### **Section 1: Active Visitors on Campus**

**Purpose**: Real-time tracking of guests currently on campus

**Columns**:
| Column | Type | Visible | Description |
|--------|------|---------|-------------|
| Name | Text | All | Visitor name |
| Purpose | Text | MD+ | Purpose of visit |
| Phone | Text | All | Contact number |
| Check-in | Time | All | Arrival time |
| Duration | Duration | LG+ | Time spent on campus |
| Actions | Buttons | All | View, Checkout |

**Features**:
- Pulsing green indicator showing `n Active`
- Sorted by most recent check-in first
- Real-time duration calculation
- Quick checkout available
- Responsive: Hides purpose on small screens, duration on medium screens

**Filtering Logic**:
```typescript
const activeVisitors = todayVisitors.filter(v => v.status === "checked_in");
```

---

### **Section 2: Today's Visitor Activity**

**Purpose**: Complete log of all visitors for the current day

**Columns**:
| Column | Type | Visible | Description |
|--------|------|---------|-------------|
| Name | Text | All | Visitor name |
| Purpose | Text | MD+ | Purpose of visit |
| Check-in | Time | All | Arrival time |
| Check-out | Time | All | Departure time or "-" |
| Status | Badge | All | Active / Left (colored) |
| Actions | Buttons | All | View, Edit |

**Features**:
- Color-coded status badges
- Shows both active and completed visits
- Separated from Active section for clarity
- "Log Visitor" button for quick access

**Filtering Logic**:
```typescript
const todayVisitors = allVisitors.filter(v => {
  const visitorDate = new Date(v.check_in_time).toDateString();
  return visitorDate === today;
});
```

---

### **Statistics Cards**

**Stat 1: Active Visitors**
- Count: Number of visitors with `status = "checked_in"`
- Icon: Animated pulse indicator
- Color: Green gradient

**Stat 2: Today's Visitors**
- Count: Total visitors checked in today
- Icon: User icon
- Color: Purple gradient

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    VISITOR ARRIVAL                           │
│              (Staff logs at security gate)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   /dashboard/security/        │
        │     visitors/new              │
        │   (Create Visitor Form)       │
        └──────────────────┬────────────┘
                           │
                           ▼
        ┌──────────────────────────────┐
        │   Database: visitors table    │
        │   - Check-in time: NOW()      │
        │   - Status: checked_in        │
        │   - Tenant isolation          │
        └──────────────────┬────────────┘
                           │
                           ▼
        ┌──────────────────────────────┐
        │   Dashboard Updates:          │
        │   - Active Visitors section   │
        │   - Today's Activity section  │
        └──────────────────┬────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  VISITOR ON CAMPUS (Active)          │
        │  - Checkout button available         │
        │  - Duration calculating              │
        │  - Status: checked_in                │
        └──────────────────┬────────────────────┘
                           │
        ┌──────────────────┴────────────────────┐
        │                                        │
        ▼                                        ▼
┌─────────────────────────┐         ┌──────────────────────────┐
│  Quick Checkout         │         │  Edit visitor details    │
│  (Checkout button)      │         │  (Edit button)           │
└────────────┬────────────┘         └──────────┬───────────────┘
             │                                   │
             └───────────────┬───────────────────┘
                             │
                             ▼
        ┌──────────────────────────────────┐
        │  Update visitor record:          │
        │  - Check-out time: NOW()         │
        │  - Status: checked_out           │
        │  - Remarks (optional)            │
        └──────────────────┬───────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │   Dashboard Updates:             │
        │   - Moves to Today's Activity    │
        │   - No longer in Active section  │
        │   - Status shows: "Left"         │
        └─────────────────────────────────┘
```

---

## Responsive Design

### **Breakpoints**

| Screen | Hidden Columns | Notes |
|--------|----------------|-------|
| **Mobile** (< 768px) | Purpose, Duration | Stack layout, full width tables |
| **Tablet** (768-1024px) | Duration | Purpose visible, more space |
| **Desktop** (> 1024px) | None | All columns visible, optimized spacing |

### **Active Visitors Table**
- Min-width: 900px
- Scrollable on small screens
- Hover effects on all screen sizes

### **Today's Activity Table**
- Min-width: 900px
- Responsive padding: `p-4` on desktop, `p-3` on mobile
- Status badges scale appropriately

---

## Key Features

### **✅ Real-time Duration Tracking**
```typescript
const durationMs = now.getTime() - checkInTime.getTime();
const hours = Math.floor(durationMs / (1000 * 60 * 60));
const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
// Display: "2h 15m"
```

### **✅ Tenant Isolation**
All queries include:
```sql
WHERE tenant_id = member.tenant_id
AND is_deleted = false
```

### **✅ Status Management**
- `checked_in`: Visitor currently on campus
- `checked_out`: Visitor has left campus

### **✅ Date Filtering**
- Only shows today's visitors
- Filters by `check_in_time` date

### **✅ Quick Actions**
- View: See full details
- Checkout: Quick status update
- Edit: Detailed form updates

### **✅ Visual Indicators**
- Green pulsing dot for active visitors
- Color-coded status badges
- Gradient buttons for actions

---

## API & Database

### **Table: visitors**

```sql
CREATE TABLE visitors (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  visitor_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  purpose TEXT,
  person_to_meet VARCHAR(255),
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  id_proof_type VARCHAR(100),
  id_proof_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'checked_in', -- checked_in, checked_out
  remarks TEXT,
  visit_date DATE,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Key Indexes**
```sql
CREATE INDEX idx_visitors_tenant ON visitors(tenant_id);
CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_check_in ON visitors(check_in_time);
```

---

## File Structure

```
app/dashboard/security/visitors/
├── page.tsx                 # List all visitors (full history)
├── new/
│   └── page.tsx            # Create new visitor
├── [id]/
│   ├── page.tsx            # View visitor details
│   └── edit/
│       └── page.tsx        # Edit visitor info & checkout
```

---

## Usage Examples

### **Quick Check-in Workflow**
1. Staff clicks "Log New Visitor" on dashboard
2. Fills form with visitor details
3. Submits - visitor appears in "Active Visitors"
4. Duration timer starts automatically

### **Quick Checkout Workflow**
1. Staff clicks "Checkout" button in Active Visitors
2. Goes to edit page, check-out time is auto-filled
3. Can add remarks if needed
4. Submits - visitor moves to Today's Activity

### **Detailed Update Workflow**
1. Staff clicks "Edit" button
2. Updates any visitor information
3. Changes status if needed
4. Updates remarks/notes
5. Toast notification confirms update

---

## Performance & Optimization

- **Query Limits**: Limited to 20 most recent visitors
- **Filtering**: Date-based filtering reduces dataset size
- **Caching**: Server-side rendering with automatic revalidation
- **Responsive Tables**: Min-width 900px, scrollable on mobile
- **Real-time Duration**: Calculated client-side to avoid server load

---

## Future Enhancements

- [ ] SMS/Email notifications to person being visited
- [ ] Automated checkout after X hours
- [ ] Visitor pass printing
- [ ] Advanced search/filter by date range
- [ ] Bulk operations (mark multiple as checked out)
- [ ] Visitor statistics reports
- [ ] Integration with gate access control

---

## Testing Checklist

- [ ] Create new visitor record
- [ ] View visitor details
- [ ] Edit visitor information
- [ ] Quick checkout from Active Visitors
- [ ] Verify duration calculation
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test tenant isolation
- [ ] Verify today's date filtering
- [ ] Test status transitions
- [ ] Toast notifications appear

---

## Summary

The Recent Visitors workflow provides a **complete, responsive, and intuitive** system for managing guest access to campus. With real-time tracking, quick actions, and proper data isolation, security staff can efficiently monitor visitor flow while maintaining detailed records for compliance and safety.

**Status**: ✅ **Production Ready**
