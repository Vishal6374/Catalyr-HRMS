# Attendance Management Feature Implementation Plan

## Overview
Implement a comprehensive attendance management system that allows HR to:
1. Configure work hours settings
2. Mark/edit employee clock in/out times
3. Automatically calculate attendance status based on work hours
4. View and manage attendance records

## Requirements

### 1. Work Hours Configuration (HR Only)
- HR can set standard work hours (e.g., 8 hours/day)
- HR can set half-day threshold (e.g., 4 hours)
- Settings stored in database and applied system-wide

### 2. Attendance Status Calculation (Automatic)
- **Absent**: Work hours < half-day threshold
- **Half Day**: Work hours >= half-day threshold but < full work hours
- **Present**: Work hours >= full work hours
- System automatically calculates based on check-in and check-out times

### 3. HR Attendance Management
- View all employee attendance for any date
- Edit check-in/check-out times for any employee
- Manual override of attendance status if needed
- Add notes/remarks to attendance records

### 4. Employee View
- Clock in/out functionality (existing)
- View own attendance history
- See calculated work hours

## Database Changes

### 1. Create AttendanceSettings Table
```sql
- id (UUID, primary key)
- standard_work_hours (DECIMAL, default: 8.00)
- half_day_threshold (DECIMAL, default: 4.00)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2. Update AttendanceLog Model
- Add `edited_by` field (UUID, nullable) - tracks who edited the record
- Add `edit_reason` field (TEXT, nullable) - reason for manual edit
- Existing fields: check_in, check_out, work_hours, status, notes

## Backend Implementation

### 1. AttendanceSettings Model
- Create model with standard_work_hours and half_day_threshold
- Add validation

### 2. AttendanceSettings Controller
- GET /api/attendance/settings - Get current settings
- PUT /api/attendance/settings - Update settings (HR only)

### 3. Update Attendance Controller
- Modify markAttendance to:
  - Accept check_in and check_out times
  - Calculate work_hours automatically
  - Determine status based on settings
  - Track who edited the record
- Add updateAttendance endpoint for HR edits
- Fetch settings when calculating status

### 4. Attendance Routes
- Add settings routes
- Add update route for HR

## Frontend Implementation

### 1. Attendance Settings Page (HR Only)
- Form to configure work hours
- Form to configure half-day threshold
- Save settings

### 2. Enhanced Attendance Page
- **HR View:**
  - Click on employee to edit attendance
  - Modal with:
    - Date picker
    - Time pickers for check-in/check-out
    - Calculated work hours (auto-update)
    - Calculated status (auto-update based on hours)
    - Manual status override option
    - Notes field
    - Save button
  - Show edit history (who edited, when)

- **Employee View:**
  - Existing clock in/out functionality
  - Display calculated work hours
  - Display attendance status

### 3. Attendance Edit Modal Component
- Employee selector (HR only)
- Date selector
- Check-in time picker
- Check-out time picker
- Work hours display (calculated)
- Status display (calculated)
- Manual status override toggle
- Notes/reason field
- Save and Cancel buttons

## API Endpoints

### Settings
- `GET /api/attendance/settings` - Get attendance settings
- `PUT /api/attendance/settings` - Update settings (HR only)

### Attendance
- `POST /api/attendance/mark` - Mark attendance (existing, enhanced)
- `PUT /api/attendance/update/:id` - Update attendance record (HR only)
- `GET /api/attendance` - Get attendance logs (existing)
- `GET /api/attendance/summary` - Get summary (existing)

## Calculation Logic

```javascript
function calculateAttendanceStatus(checkIn, checkOut, settings) {
  if (!checkIn || !checkOut) {
    return 'absent';
  }
  
  const workHours = calculateWorkHours(checkIn, checkOut);
  
  if (workHours < settings.half_day_threshold) {
    return 'absent';
  } else if (workHours >= settings.half_day_threshold && workHours < settings.standard_work_hours) {
    return 'half_day';
  } else {
    return 'present';
  }
}
```

## Implementation Steps

1. **Backend:**
   - Create AttendanceSettings model and migration
   - Create settings controller and routes
   - Update attendance controller with new logic
   - Add update endpoint for HR

2. **Frontend:**
   - Create AttendanceSettings component
   - Create AttendanceEditModal component
   - Update Attendance page with edit functionality
   - Add settings API service methods
   - Update attendance API service methods

3. **Testing:**
   - Test settings CRUD operations
   - Test automatic status calculation
   - Test HR edit functionality
   - Test employee clock in/out
   - Test edge cases (midnight shifts, etc.)

## UI/UX Considerations

- Clear visual indication of calculated vs manually set status
- Show who edited attendance and when
- Confirm before saving changes
- Real-time calculation preview
- Validation for time inputs (check-out must be after check-in)
- Toast notifications for success/error
