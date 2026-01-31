# Catalyr HRMS Implementation Plan - Phase 2

This plan outlines the steps to implement the new requirements requested by the user.

## 1. Leaves
- [ ] **Edit/Delete Requests**: Allow employees to edit or delete leave requests until they are approved by HR or Admin.
- [ ] **Fix Day Count Logic**: Update the logic to correctly count days (e.g., Jan 30 - Feb 2 should be 4 days).
- [ ] **"On Date" Option**: Add an "on date" option for single-day leave requests.
- [ ] **Leave Type Management**: Ensure all leave types (casual, sick, etc.) are editable and included in leave apply options.

## 2. Profile Management
- [ ] **Edit Time Limit**: Implement a 48-hour window for profile editing, switching to view-only mode afterwards.
- [ ] **New Fields**: Add an "Education" field to the profile.
- [ ] **Split Identity Fields**: Separate "Aadhaar" and "PAN" into individual fields.
- [ ] **Custom Fields**: Add an option for an additional custom field with a title and value.

## 3. Payroll
- [ ] **Rounding**: Implement rounding off for all payroll calculation values.

## 4. User Roles & Permissions
- [ ] **Restricted Role Creation**: Prevent HR from creating or editing users with Admin or HR roles. These options should be hidden in the UI for HR users.

## 5. File Handling
- [ ] **File Uploads**: Replace URL inputs with file upload fields for documents across the application. Use URL fields only for external links.

## 6. Tasks Module
- [ ] **Task Enhancements**:
    - Add "Task Status" field.
    - Add "Start Date" and "Start Time" (currently time only).
    - Add "Task Edit" functionality.
    - Implement auto-calculation of duration if "Override Hours" is not provided.

## 7. Dashboard & Widgets
- [ ] **Meeting Widget**: Add a small "Upcoming Meeting" widget to the dashboard, visible only to invited employees.

## 8. Logs Module
- [ ] **Visibility**: Make the "Logs" module visible to HR and Admin users.

## 9. Session Management
- [ ] **Extended Timeout**: Update session timeout to 12 days (from current 30 minutes).

---

### Implementation Progress Tracking
- [ ] 1. Leaves
- [ ] 2. Profile Management
- [ ] 3. Payroll
- [ ] 4. User Roles & Permissions
- [ ] 5. File Handling
- [ ] 6. Tasks Module
- [ ] 7. Dashboard & Widgets
- [ ] 8. Logs Module
- [ ] 9. Session Management
