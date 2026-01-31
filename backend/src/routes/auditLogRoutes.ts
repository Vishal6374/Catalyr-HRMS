import express from 'express';
import { authenticate } from '../middleware/auth';
import * as auditLogController from '../controllers/auditLogController';

const router = express.Router();

router.use(authenticate);

router.get('/', auditLogController.getAllLogs);
router.get('/:id', auditLogController.getLogDetails);

export default router;
