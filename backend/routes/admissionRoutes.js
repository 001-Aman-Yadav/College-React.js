import express from 'express';
import { applyAdmission, getAdmissions, approveAdmission, rejectAdmission } from '../controllers/admissionController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

const fields = [
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
  { name: 'transferCertificate', maxCount: 1 },
  { name: 'migrationCertificate', maxCount: 1 },
  { name: 'incomeCertificate', maxCount: 1 },
  { name: 'casteCertificate', maxCount: 1 },
];

router.post('/apply', upload.fields(fields), applyAdmission);
router.get('/', protect, authorize('Admin', 'SuperAdmin'), getAdmissions);
router.put('/:id/approve', protect, authorize('Admin', 'SuperAdmin'), approveAdmission);
router.put('/:id/reject', protect, authorize('Admin', 'SuperAdmin'), rejectAdmission);

export default router;
