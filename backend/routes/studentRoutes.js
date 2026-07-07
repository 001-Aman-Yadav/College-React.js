import express from 'express';
import { 
  getStudentProfile, 
  getStudents, 
  updateStudent, 
  downloadIDCard, 
  downloadBonafide,
  applyStudentLeave,
  submitStudentComplaint,
  requestLibraryBook,
  applyJobDrive,
  getStudyMaterials
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getStudentProfile);
router.get('/', protect, authorize('Admin', 'SuperAdmin', 'Teacher'), getStudents);
router.put('/:id', protect, authorize('Admin', 'SuperAdmin'), updateStudent);

// PDF downloads
router.get('/:id/idcard', protect, downloadIDCard);
router.get('/:id/bonafide', protect, downloadBonafide);

// Student Actions
router.post('/leave', protect, authorize('Student'), applyStudentLeave);
router.post('/complaint', protect, authorize('Student'), submitStudentComplaint);
router.post('/library', protect, authorize('Student'), requestLibraryBook);
router.post('/placements/:driveId/apply', protect, authorize('Student'), applyJobDrive);
router.get('/study-materials', protect, authorize('Student'), getStudyMaterials);

export default router;
