import express from 'express';
import { 
  getTeachers, 
  createTeacher, 
  updateTeacher, 
  enterMarks,
  getTeacherProfile,
  getTeacherStudents,
  recordAttendance,
  uploadStudyMaterial,
  deleteStudyMaterial,
  getUploadedStudyMaterials,
  getTeacherSalarySlips,
  deleteTeacher
} from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('Admin', 'SuperAdmin'), getTeachers)
  .post(protect, authorize('Admin', 'SuperAdmin'), createTeacher);

router.route('/:id')
  .put(protect, authorize('Admin', 'SuperAdmin'), updateTeacher)
  .delete(protect, authorize('Admin', 'SuperAdmin'), deleteTeacher);

// Teacher Portal Actions
router.get('/profile', protect, authorize('Teacher'), getTeacherProfile);
router.get('/students', protect, authorize('Teacher'), getTeacherStudents);
router.post('/enter-marks', protect, authorize('Teacher'), enterMarks);
router.post('/attendance', protect, authorize('Teacher'), recordAttendance);

router.post('/study-materials', protect, authorize('Teacher'), uploadStudyMaterial);
router.delete('/study-materials/:id', protect, authorize('Teacher'), deleteStudyMaterial);
router.get('/study-materials', protect, authorize('Teacher'), getUploadedStudyMaterials);
router.get('/salary-slips', protect, authorize('Teacher'), getTeacherSalarySlips);

export default router;
