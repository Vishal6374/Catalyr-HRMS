import express from 'express';
import { authenticate, requireHR } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import * as leaveTypeController from '../controllers/leaveTypeController';

const router = express.Router();

router.get('/', authenticate, asyncHandler(leaveTypeController.getLeaveTypes));
router.post('/', authenticate, requireHR, asyncHandler(leaveTypeController.createLeaveType));
router.put('/:id', authenticate, requireHR, asyncHandler(leaveTypeController.updateLeaveType));
router.delete('/:id', authenticate, requireHR, asyncHandler(leaveTypeController.deleteLeaveType));

export default router;
