import express from 'express';
import { authenticate, requireSelfOrHR } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { upload } from '../middleware/fileUpload';
import * as employeeDocumentController from '../controllers/employeeDocumentController';

const router = express.Router();

router.get('/:employeeId/documents', authenticate, requireSelfOrHR('employeeId'), asyncHandler(employeeDocumentController.getEmployeeDocuments));
router.post('/:employeeId/documents', authenticate, requireSelfOrHR('employeeId'), upload.single('file'), asyncHandler(employeeDocumentController.uploadDocument));
router.get('/documents/:documentId', authenticate, asyncHandler(employeeDocumentController.getDocument));
router.delete('/documents/:documentId', authenticate, asyncHandler(employeeDocumentController.deleteDocument));

export default router;
