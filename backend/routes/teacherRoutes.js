import express from 'express';
import { 
  getTeachers, 
  createTeacher, 
  updateTeacher, 
  enterMarks,
  getTeacherProfile,
  getTeacherStudents,
  recordAttendance
} from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('Admin', 'SuperAdmin'), getTeachers)
  .post(protect, authorize('Admin', 'SuperAdmin'), createTeacher);

router.put('/:id', protect, authorize('Admin', 'SuperAdmin'), updateTeacher);

// Teacher Portal Actions
router.get('/profile', protect, authorize('Teacher'), getTeacherProfile);
router.get('/students', protect, authorize('Teacher'), getTeacherStudents);
router.post('/enter-marks', protect, authorize('Teacher'), enterMarks);
router.post('/attendance', protect, authorize('Teacher'), recordAttendance);

export default router;
