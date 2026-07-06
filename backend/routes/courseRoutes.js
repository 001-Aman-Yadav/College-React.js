import express from 'express';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, authorize('Admin', 'SuperAdmin'), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('Admin', 'SuperAdmin'), updateCourse)
  .delete(protect, authorize('Admin', 'SuperAdmin'), deleteCourse);

export default router;
