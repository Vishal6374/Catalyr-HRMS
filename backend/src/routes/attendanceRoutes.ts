import express from 'express';
import { authenticate, requireHR } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { auditLog } from '../middleware/auditLog';
import * as attendanceController from '../controllers/attendanceController';
import * as attendanceSettingsController from '../controllers/attendanceSettingsController';

const router = express.Router();

// Attendance logs
router.get('/', authenticate, asyncHandler(attendanceController.getAttendanceLogs));
router.get('/summary', authenticate, asyncHandler(attendanceController.getAttendanceSummary));
router.post('/mark', authenticate, auditLog('attendance', 'mark'), asyncHandler(attendanceController.markAttendance));
router.put('/update/:id', authenticate, requireHR, auditLog('attendance', 'update'), asyncHandler(attendanceController.updateAttendance));
router.post('/lock', authenticate, requireHR, auditLog('attendance', 'lock'), asyncHandler(attendanceController.lockAttendance));

// Attendance settings
router.get('/settings', authenticate, asyncHandler(attendanceSettingsController.getAttendanceSettings));
router.put('/settings', authenticate, requireHR, auditLog('attendance_settings', 'update'), asyncHandler(attendanceSettingsController.updateAttendanceSettings));

export default router;

