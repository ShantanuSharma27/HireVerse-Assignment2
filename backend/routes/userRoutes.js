// routes/userRoutes.js
const express = require('express');
const { registerUser, getUsers, deleteUser,getTeachers,getStudents,updateStudent,getTeachersThroughId} = require('../controllers/userController');

// const { authorize } = require('../middleware/authMiddleware');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/', getUsers);
router.get('/teachers',getTeachers);
router.get('/teachers/:id',getTeachersThroughId);
router.get('/students',getStudents);
router.delete('/students/:id',protect,authorize('principal','teacher'),deleteUser);
router.put('/students/:id',protect,authorize('principal','teacher'),updateStudent);
router.delete('/teachers/:id', protect,authorize('principal'),deleteUser);
router.put('/teachers/:id',protect,authorize('principal'),updateStudent);

module.exports = router;
