import express from 'express';
import { authenticate, requireHR } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { auditLog } from '../middleware/auditLog';
import { upload } from '../middleware/fileUpload';
import * as policyController from '../controllers/policyController';

const router = express.Router();

router.get('/', authenticate, asyncHandler(policyController.getPolicies));
router.get('/:id', authenticate, asyncHandler(policyController.getPolicyById));
router.post('/upload-document', authenticate, requireHR, upload.single('file'), asyncHandler(policyController.uploadPolicyDocument));
router.post('/', authenticate, requireHR, auditLog('policies', 'create'), asyncHandler(policyController.createPolicy));
router.put('/:id', authenticate, requireHR, auditLog('policies', 'update'), asyncHandler(policyController.updatePolicy));
router.delete('/:id', authenticate, requireHR, auditLog('policies', 'delete'), asyncHandler(policyController.deletePolicy));

export default router;
