# HR Harmony Implementation Plan - Remaining Gaps

This plan tracks the implementation of remaining requirements to align the project with the official HRMS Implementation Plan.

## 1. User Roles & Access Control
- [x] Implement 'admin' role in backend and frontend.
- [x] Verify `admin` role has full access to all HR functionalities.
- [ ] Audit logs implementation check for all critical modules (Attendance, Leave, Payroll).

## 2. Employee Management & Onboarding
- [x] Multi-step onboarding form for HR (AddEmployee.tsx).
- [x] Add `onboarding_status` to User model (`'pending'`, `'approved'`, `'locked'`).
- [x] Implement onboarding document upload logic for employees in Profile.
- [x] Implement HR approval workflow for employee onboarding data.
- [x] Implement field locking in Profile after HR approval.

## 3. Attendance Management & Regularization
- [x] Biometric-like automatic logs (current system).
- [x] Implement **Attendance Regularization Request** model and API.
- [x] UI for Employees to submit regularization requests.
- [x] UI for HR/Admin to approve/reject regularization requests.
- [x] Restrict manual 'Clock In/Out' based on company policy (configurable).

## 4. Time Entry / Daily Task Management
- [x] Create **Daily Tasks** model (Task Name, Description, Duration, Status).
- [x] API for logging multiple task entries per day.
- [x] Dashboard view for employees to manage their tasks.
- [x] HR view to monitor task entries across employees.

## 5. Meetings Module
- [x] Create **Meetings** model (Title, Date, Time, URL, Attendees).
- [x] API for scheduling meetings.
- [x] HR UI for meeting room/schedule management.
- [x] Employee UI for viewing and joining meetings.

## 6. Exit Management
- [x] Submit resignation (Employee).
- [x] Approve/Reject with Last Working Day (HR).
- [x] Status tracking in Profile.

## 7. Configuration & Compliance
- [ ] Verify salary structure automation logic.
- [ ] Ensure payslip download only for employees.
- [x] Add system info/branding configuration.

---

### Implementation Roadmap

| Phase | Module | Target Features | Status |
|-------|--------|-----------------|--------|
| **1** | **Base & Roles** | Role Migration (`admin`), Auth flow updates. | Done |
| **2** | **Onboarding** | New Employee Page, Bank Details, Document Upload. | Done |
| **3** | **Attendance** | Self-Clock-in Toggle, Regularization Request flow. | Done |
| **4** | **Exit Mgmt** | Resignation Module (Request + Approval flow). | Done |
| **5** | **Tasks/Meetings**| Activity Logger & Meeting Scheduler. | Done |
| **6** | **Polish** | Final QA, UI Consistency updates. | In Progress |
