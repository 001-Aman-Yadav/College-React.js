import express from 'express';
import { 
  getJobDrives, 
  createJobDrive, 
  deleteJobDrive, 
  updateApplicantStatus 
} from '../controllers/placementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getJobDrives)
  .post(protect, authorize('Admin', 'SuperAdmin'), createJobDrive);

router.delete('/:id', protect, authorize('Admin', 'SuperAdmin'), deleteJobDrive);
router.put('/:driveId/applicants/:studentId', protect, authorize('Admin', 'SuperAdmin'), updateApplicantStatus);

export default router;
