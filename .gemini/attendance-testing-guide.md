# Attendance Management Feature - Testing Guide

## Prerequisites
- Backend server running on port 5000
- Frontend server running on port 5173
- Database connected and synced
- Logged in as HR user

## Test Scenarios

### 1. Configure Work Hours Settings

**Steps:**
1. Login as HR user
2. Navigate to Attendance page
3. Click "Settings" button in top right
4. You should see the Attendance Settings card
5. Set "Standard Work Hours" to 8
6. Set "Half Day Threshold" to 4
7. Click "Save Settings"
8. Verify success toast appears
9. Refresh page and verify settings are persisted

**Expected Result:**
- Settings saved successfully
- Toast notification shows success
- Settings persist after refresh

### 2. Test Automatic Status Calculation (Employee)

**Steps:**
1. Login as employee
2. Navigate to Attendance page
3. Click "Clock In" (note the time)
4. Wait or manually set time forward
5. Click "Clock Out" after different durations:
   - Test 1: 2 hours (should be Absent)
   - Test 2: 5 hours (should be Half Day)
   - Test 3: 8+ hours (should be Present)

**Expected Result:**
- Work hours calculated correctly
- Status matches the calculation rules
- Calendar shows correct status indicator

### 3. Edit Attendance as HR

**Steps:**
1. Login as HR user
2. Navigate to Attendance page
3. In "Today's Attendance" section, find an employee
4. Click the edit icon (pencil) next to their attendance
5. Edit Modal should open showing:
   - Employee information
   - Current date
   - Check-in time
   - Check-out time
   - Calculated work hours (real-time)
   - Auto-calculated status
6. Change check-in time to 09:00
7. Change check-out time to 17:00
8. Observe:
   - Work hours auto-calculate to 8.00
   - Status auto-suggests "PRESENT"
9. Add edit reason: "Correcting missed clock-out"
10. Click "Save Changes"

**Expected Result:**
- Modal shows all fields correctly
- Real-time calculation works
- Edit reason is required
- Changes save successfully
- Toast shows success message
- Attendance list updates immediately

### 4. Test Status Override

**Steps:**
1. As HR, edit an employee's attendance
2. Set check-in: 09:00, check-out: 13:00 (4 hours)
3. System should suggest "HALF_DAY"
4. Manually override status to "PRESENT"
5. Add reason: "Approved work from home"
6. Save changes

**Expected Result:**
- Manual override works
- Status saved as "PRESENT" despite 4 hours
- Edit reason captured

### 5. Test Different Work Hour Scenarios

Test these scenarios by editing attendance:

| Check In | Check Out | Expected Hours | Expected Status |
|----------|-----------|----------------|-----------------|
| 09:00 | 11:00 | 2.00 | Absent |
| 09:00 | 13:00 | 4.00 | Half Day |
| 09:00 | 13:30 | 4.50 | Half Day |
| 09:00 | 17:00 | 8.00 | Present |
| 09:00 | 18:30 | 9.50 | Present |
| 08:00 | 20:00 | 12.00 | Present |

### 6. Test Edit from Calendar Modal

**Steps:**
1. As HR, click on any date in the calendar
2. Modal opens showing all employees for that date
3. Find an employee with attendance
4. Click edit icon
5. Edit modal should open
6. Make changes and save

**Expected Result:**
- Calendar modal closes
- Edit modal opens
- Changes save correctly
- Can edit from calendar view

### 7. Test Edit Validation

**Steps:**
1. Try to edit attendance without providing reason
2. Try to set check-out before check-in
3. Try to set invalid hours

**Expected Result:**
- Validation prevents invalid data
- Error messages shown
- Form doesn't submit with invalid data

### 8. Test Settings Validation

**Steps:**
1. Try to set standard work hours > 24
2. Try to set half-day threshold > standard hours
3. Try to set negative values

**Expected Result:**
- Validation prevents invalid settings
- Error toast shown
- Settings not saved

### 9. Test Permissions

**Steps:**
1. Login as regular employee
2. Navigate to Attendance page
3. Verify:
   - No "Settings" button visible
   - No edit icons on attendance records
   - Can only clock in/out for self

**Expected Result:**
- Employees cannot access HR features
- Edit functionality hidden
- Settings button not visible

### 10. Test Edit History Tracking

**Steps:**
1. As HR, edit an attendance record
2. Check database `attendance_logs` table
3. Verify fields populated:
   - `edited_by` = HR user ID
   - `edit_reason` = reason provided
   - `updated_at` = current timestamp

**Expected Result:**
- Edit tracking fields populated
- Audit trail maintained

## API Testing (Optional)

### Get Settings
```bash
GET http://localhost:5000/api/attendance/settings
Authorization: Bearer <token>
```

### Update Settings
```bash
PUT http://localhost:5000/api/attendance/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "standard_work_hours": 8.5,
  "half_day_threshold": 4.25
}
```

### Update Attendance
```bash
PUT http://localhost:5000/api/attendance/update/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "check_in": "2026-01-22T09:00:00Z",
  "check_out": "2026-01-22T17:00:00Z",
  "edit_reason": "Correcting missed clock-out"
}
```

## Common Issues & Solutions

### Issue: Settings not saving
- **Solution**: Check if user is logged in as HR
- **Solution**: Check network tab for API errors
- **Solution**: Verify backend is running

### Issue: Work hours not calculating
- **Solution**: Ensure both check-in and check-out are set
- **Solution**: Verify check-out is after check-in
- **Solution**: Check browser console for errors

### Issue: Edit modal not opening
- **Solution**: Verify user is HR
- **Solution**: Check if attendance record exists
- **Solution**: Check browser console for errors

### Issue: Status not auto-calculating
- **Solution**: Verify settings are loaded
- **Solution**: Check if work hours are calculated
- **Solution**: Ensure settings API is working

## Success Criteria

✅ HR can configure work hours
✅ Settings persist in database
✅ Automatic status calculation works
✅ HR can edit any employee's attendance
✅ Real-time work hours calculation in edit modal
✅ Edit reason is mandatory
✅ Edit tracking works (who, when, why)
✅ Employees can only clock in/out for themselves
✅ Employees cannot access edit features
✅ Status calculation follows configured rules
✅ Manual status override works
✅ Validation prevents invalid data
✅ All changes reflected immediately in UI
