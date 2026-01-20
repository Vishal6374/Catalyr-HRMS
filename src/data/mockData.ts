import { Department, Designation, Employee, AttendanceLog, LeaveRequest, LeaveBalance, PayrollBatch, SalarySlip, Reimbursement, Complaint, Policy, Holiday } from '@/types/hrms';

export const departments: Department[] = [
  { id: 'dept-1', name: 'Human Resources', code: 'HR', employeeCount: 5, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'dept-2', name: 'Engineering', code: 'ENG', employeeCount: 25, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'dept-3', name: 'Sales', code: 'SLS', employeeCount: 15, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'dept-4', name: 'Marketing', code: 'MKT', employeeCount: 8, isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'dept-5', name: 'Finance', code: 'FIN', employeeCount: 6, isActive: true, createdAt: new Date('2024-01-01') },
];

export const designations: Designation[] = [
  { id: 'des-1', name: 'HR Manager', departmentId: 'dept-1', level: 1, salaryRangeMin: 80000, salaryRangeMax: 120000, isActive: true },
  { id: 'des-2', name: 'HR Executive', departmentId: 'dept-1', level: 2, salaryRangeMin: 40000, salaryRangeMax: 60000, isActive: true },
  { id: 'des-3', name: 'Senior Software Engineer', departmentId: 'dept-2', level: 2, salaryRangeMin: 100000, salaryRangeMax: 150000, isActive: true },
  { id: 'des-4', name: 'Software Engineer', departmentId: 'dept-2', level: 3, salaryRangeMin: 60000, salaryRangeMax: 100000, isActive: true },
  { id: 'des-5', name: 'Engineering Manager', departmentId: 'dept-2', level: 1, salaryRangeMin: 140000, salaryRangeMax: 200000, isActive: true },
];

export const employees: Employee[] = [
  { id: '1', employeeId: 'EMP2026-0001', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', phone: '+1 555-0101', dateOfBirth: new Date('1988-03-15'), dateOfJoining: new Date('2020-01-15'), departmentId: 'dept-1', designationId: 'des-1', salary: 95000, role: 'hr', status: 'active', address: '123 Main St, New York, NY 10001', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: '2', employeeId: 'EMP2026-0015', name: 'John Smith', email: 'john.smith@company.com', phone: '+1 555-0102', dateOfBirth: new Date('1992-07-22'), dateOfJoining: new Date('2022-03-01'), departmentId: 'dept-2', designationId: 'des-3', salary: 120000, role: 'employee', status: 'active', address: '456 Oak Ave, San Francisco, CA 94102', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: '3', employeeId: 'EMP2026-0023', name: 'Emily Chen', email: 'emily.chen@company.com', phone: '+1 555-0103', dateOfBirth: new Date('1995-11-08'), dateOfJoining: new Date('2023-06-15'), departmentId: 'dept-2', designationId: 'des-4', salary: 85000, role: 'employee', status: 'active', address: '789 Pine Rd, Seattle, WA 98101', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  { id: '4', employeeId: 'EMP2026-0031', name: 'Michael Brown', email: 'michael.brown@company.com', phone: '+1 555-0104', dateOfBirth: new Date('1985-04-20'), dateOfJoining: new Date('2019-09-01'), departmentId: 'dept-3', designationId: 'des-5', salary: 110000, role: 'employee', status: 'active', address: '321 Elm St, Chicago, IL 60601', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
];

export const attendanceLogs: AttendanceLog[] = [];
export const leaveRequests: LeaveRequest[] = [
  { id: 'leave-1', employeeId: '2', leaveType: 'casual', startDate: new Date('2026-01-25'), endDate: new Date('2026-01-27'), days: 3, reason: 'Family function', status: 'pending', createdAt: new Date('2026-01-18') },
  { id: 'leave-2', employeeId: '3', leaveType: 'sick', startDate: new Date('2026-01-15'), endDate: new Date('2026-01-16'), days: 2, reason: 'Not feeling well', status: 'approved', approvedBy: '1', approvedAt: new Date('2026-01-14'), createdAt: new Date('2026-01-14') },
];

export const leaveBalances: LeaveBalance[] = employees.flatMap((emp) => [
  { employeeId: emp.id, leaveType: 'casual', total: 12, used: 3, remaining: 9, year: 2026 },
  { employeeId: emp.id, leaveType: 'sick', total: 10, used: 2, remaining: 8, year: 2026 },
  { employeeId: emp.id, leaveType: 'earned', total: 15, used: 4, remaining: 11, year: 2026 },
]);

export const payrollBatches: PayrollBatch[] = [
  { id: 'batch-1', month: 12, year: 2025, status: 'paid', totalEmployees: 4, totalAmount: 410000, processedBy: '1', processedAt: new Date('2025-12-28'), paidAt: new Date('2025-12-31') },
  { id: 'batch-2', month: 1, year: 2026, status: 'processed', totalEmployees: 4, totalAmount: 410000, processedBy: '1', processedAt: new Date('2026-01-15') },
];

export const salarySlips: SalarySlip[] = employees.map((emp) => ({
  id: `slip-${emp.id}-dec-2025`, employeeId: emp.id, batchId: 'batch-1', month: 12, year: 2025,
  basicSalary: emp.salary * 0.5, hra: emp.salary * 0.2, da: emp.salary * 0.1, reimbursements: 2000,
  deductions: { pf: emp.salary * 0.12, tax: emp.salary * 0.1, lossOfPay: 0, other: 0 },
  grossSalary: emp.salary * 0.8, netSalary: emp.salary * 0.58, status: 'paid', generatedAt: new Date('2025-12-28'),
}));

export const reimbursements: Reimbursement[] = [
  { id: 'reimb-1', employeeId: '2', category: 'travel', amount: 2500, description: 'Client meeting travel', status: 'approved', approvedBy: '1', approvedAt: new Date('2026-01-10'), createdAt: new Date('2026-01-08') },
  { id: 'reimb-2', employeeId: '3', category: 'equipment', amount: 15000, description: 'Laptop accessories', status: 'pending', createdAt: new Date('2026-01-15') },
];

export const complaints: Complaint[] = [
  { id: 'comp-1', employeeId: '3', subject: 'AC not working', description: 'The AC has been malfunctioning.', category: 'Facilities', priority: 'medium', status: 'in_progress', isAnonymous: false, createdAt: new Date('2026-01-12'), updatedAt: new Date('2026-01-14') },
  { id: 'comp-2', employeeId: '4', subject: 'Parking issue', description: 'Need dedicated parking.', category: 'Facilities', priority: 'low', status: 'open', isAnonymous: false, createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
];

export const policies: Policy[] = [
  { id: 'pol-1', title: 'Employee Handbook 2026', category: 'General', version: '3.0', documentUrl: '/policies/handbook.pdf', isActive: true, effectiveDate: new Date('2026-01-01'), createdAt: new Date('2025-12-15'), updatedAt: new Date('2025-12-15') },
  { id: 'pol-2', title: 'Leave Policy', category: 'HR', version: '2.1', documentUrl: '/policies/leave.pdf', isActive: true, effectiveDate: new Date('2026-01-01'), createdAt: new Date('2025-11-20'), updatedAt: new Date('2025-12-10') },
];

export const holidays: Holiday[] = [
  { id: 'hol-1', name: "New Year's Day", date: new Date('2026-01-01'), type: 'national', isOptional: false, year: 2026 },
  { id: 'hol-2', name: 'Independence Day', date: new Date('2026-07-04'), type: 'national', isOptional: false, year: 2026 },
  { id: 'hol-3', name: 'Christmas Day', date: new Date('2026-12-25'), type: 'national', isOptional: false, year: 2026 },
];

export const getDashboardStats = () => ({ presentToday: 3, absentToday: 1, onLeaveToday: 0, totalEmployees: 4, activeEmployees: 4, pendingLeaves: 1, pendingReimbursements: 1, activeComplaints: 2, payrollStatus: 'processed', totalPayroll: 410000 });
export const getEmployeeAttendance = (employeeId: string) => attendanceLogs.filter((a) => a.employeeId === employeeId);
export const getEmployeeLeaves = (employeeId: string) => leaveRequests.filter((l) => l.employeeId === employeeId);
export const getEmployeeReimbursements = (employeeId: string) => reimbursements.filter((r) => r.employeeId === employeeId);
export const getEmployeeSalarySlips = (employeeId: string) => salarySlips.filter((s) => s.employeeId === employeeId);
