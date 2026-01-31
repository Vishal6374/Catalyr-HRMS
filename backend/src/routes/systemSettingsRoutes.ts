import express from 'express';
import { getSystemSettings, updateSystemSettings } from '../controllers/systemSettingsController';
import { authenticate } from '../middleware/auth';

import { upload } from '../utils/fileUpload';

const router = express.Router();

// Public route to fetch settings (needed for login page)
router.get('/', getSystemSettings);

// Protected route to update settings (Admin only)
const uploadFields = upload.fields([
    { name: 'company_logo_url', maxCount: 1 },
    { name: 'sidebar_logo_url', maxCount: 1 },
    { name: 'favicon_url', maxCount: 1 },
    { name: 'login_logo_url', maxCount: 1 },
    { name: 'login_bg_url', maxCount: 1 },
    { name: 'payslip_logo_url', maxCount: 1 },
]);

router.put('/', authenticate, uploadFields, updateSystemSettings);

export default router;
