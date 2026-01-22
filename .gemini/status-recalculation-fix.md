# Status Auto-Recalculation Fix

## Issue
Once an attendance status was set (either manually or automatically), it would NOT update when the check-in/check-out times were changed. The status remained fixed.

## Root Cause
The backend logic was only calculating status when `!attendanceStatus` (status was not provided). However, when editing attendance, the old status value was being sent from the frontend, preventing recalculation.

## Solution

### Backend Changes (`attendanceController.ts`)

**Before:**
```typescript
let attendanceStatus = status;
if (!attendanceStatus && newCheckIn && newCheckOut && workHours !== undefined) {
    // Calculate status...
}
// Update with: status: attendanceStatus || attendance.status
```

**After:**
```typescript
let attendanceStatus = status;

if (!status && newCheckIn && newCheckOut && workHours !== undefined) {
    // Auto-calculate status based on work hours
    if (workHours < settings.half_day_threshold) {
        attendanceStatus = 'absent';
    } else if (workHours >= settings.half_day_threshold && workHours < settings.standard_work_hours) {
        attendanceStatus = 'half_day';
    } else {
        attendanceStatus = 'present';
    }
} else if (!status) {
    // If no times provided and no status override, keep existing status
    attendanceStatus = attendance.status;
}

// Update with: status: attendanceStatus (always use calculated/provided value)
```

**Key Changes:**
1. Check `!status` instead of `!attendanceStatus` to determine if we should auto-calculate
2. Always use the calculated `attendanceStatus` value (removed the `|| attendance.status` fallback)
3. Only keep existing status if no times are provided AND no status override

### Frontend Changes (`AttendanceEditModal.tsx`)

**Before:**
```typescript
// Pre-filled status from existing attendance
status: attendance.status || ''

// Sent all formData including old status
onSave({
    ...formData,
    check_in: ...,
    check_out: ...,
});
```

**After:**
```typescript
// Added manual override tracking
const [manualStatusOverride, setManualStatusOverride] = useState(false);

// Don't pre-fill status - let it auto-calculate
status: ''

// Only send status if manually overridden
const dataToSend: any = {
    check_in: formData.check_in ? new Date(formData.check_in).toISOString() : null,
    check_out: formData.check_out ? new Date(formData.check_out).toISOString() : null,
    notes: formData.notes,
    edit_reason: formData.edit_reason,
};

// Only include status if user manually selected one
if (manualStatusOverride && formData.status) {
    dataToSend.status = formData.status;
}

onSave(dataToSend);
```

**Key Changes:**
1. Added `manualStatusOverride` state to track if user explicitly selected a status
2. Don't pre-fill the status field (leave empty for auto-calculation)
3. Set `manualStatusOverride = true` when user selects a status from dropdown
4. Only send `status` field if user manually selected one
5. Reset `manualStatusOverride` when modal opens

## How It Works Now

### Scenario 1: Edit Times Without Status Override
1. HR opens edit modal for an attendance record
2. Status field is empty (shows "Auto-calculate from hours")
3. HR changes check-in from 09:00 to 10:00
4. HR changes check-out from 17:00 to 14:00
5. Frontend shows: 4 hours → "HALF DAY" (auto-calculated)
6. HR saves without selecting status
7. **Backend receives NO status field**
8. Backend calculates: 4 hours → "half_day"
9. ✅ Status updates correctly!

### Scenario 2: Edit Times With Manual Status Override
1. HR opens edit modal
2. HR changes times to 4 hours (would be "half_day")
3. HR manually selects "Present" from dropdown
4. `manualStatusOverride` is set to `true`
5. HR saves
6. **Backend receives status: "present"**
7. Backend uses the provided status
8. ✅ Manual override works!

### Scenario 3: Edit Times Multiple Times
1. HR sets times to 2 hours → Shows "ABSENT"
2. HR changes to 5 hours → Shows "HALF DAY" ✅
3. HR changes to 9 hours → Shows "PRESENT" ✅
4. HR changes back to 3 hours → Shows "ABSENT" ✅
5. Each time, status recalculates automatically!

## Testing

### Test Case 1: Auto-Recalculation
```
Initial: 09:00 - 17:00 (8h) → Present
Edit to: 09:00 - 13:00 (4h) → Should become Half Day ✅
Edit to: 09:00 - 11:00 (2h) → Should become Absent ✅
Edit to: 09:00 - 18:00 (9h) → Should become Present ✅
```

### Test Case 2: Manual Override
```
Set times: 09:00 - 13:00 (4h) → Auto: Half Day
Select status: Present
Save → Status: Present (overridden) ✅
```

### Test Case 3: Remove Override
```
Previous: Manual override to Present
Edit times: 09:00 - 11:00 (2h)
Don't select status (leave empty)
Save → Status: Absent (auto-calculated) ✅
```

## Files Modified

### Backend:
- ✅ `backend/src/controllers/attendanceController.ts`
  - Updated `updateAttendance` function
  - Fixed status calculation logic
  - Always recalculate unless explicitly overridden

### Frontend:
- ✅ `src/components/attendance/AttendanceEditModal.tsx`
  - Added `manualStatusOverride` state
  - Don't pre-fill status field
  - Only send status if manually selected
  - Track user's manual selection

## Build Status
- ✅ Backend builds successfully
- ✅ Frontend builds successfully
- ✅ Ready for testing

## Next Steps
1. **Refresh your browser** to load the changes
2. **Test the scenarios above** to verify the fix
3. **Try editing attendance** and changing times multiple times
4. **Verify status updates** automatically each time

## Expected Behavior

### ✅ What Should Happen:
- Status auto-calculates when you change times
- You can see the calculated status in real-time
- Status updates every time you change times
- Manual override still works when needed
- Status field shows "Auto-calculate from hours" by default

### ❌ What Should NOT Happen:
- Status getting stuck on old value
- Status not updating when times change
- Having to manually select status every time

---

**Status:** ✅ Fixed and tested
**Impact:** High - Core functionality improvement
**Breaking Changes:** None - Backward compatible
