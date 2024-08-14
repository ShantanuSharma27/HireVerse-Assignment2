// routes/classroomRoutes.js
const express = require('express');
const {
  createClassroom,
  assignTeacher,
  getClassrooms,
  createTimetable,
  getTimetable,
  assignStudent,
  getStudentsInClassroom,
  getTeachers
} = require('../controllers/classroomController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Only authenticated users can create a classroom
router.post('/create', protect, authorize('principal', 'teacher'), createClassroom);

// Assign teacher to a classroom
router.post('/assign-teacher', protect, authorize('principal'), assignTeacher);

// Get all classrooms (could be made available to different roles)
router.get('/',getClassrooms);

// Create a timetable for a classroom
router.post('/create-timetable', protect, authorize('principal', 'teacher'), createTimetable);

// Get timetable for a specific classroom
router.get('/timetable/:classroomId', protect, getTimetable);

// Assign a student to a classroom
router.post('/assign-student', protect, authorize('principal', 'teacher'), assignStudent);

// Get students in a specific classroom
router.get('/:classroomId/students', protect,authorize('principal', 'teacher','student'), getStudentsInClassroom);
router.get('/teachers',protect,authorize('principal'),getTeachers)
module.exports = router;
