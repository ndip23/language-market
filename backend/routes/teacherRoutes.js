const express = require('express');
const router = express.Router();
const { getTeachers, getTeacherById } = require('../controllers/teacherController');

// @route   GET /api/teachers
// @desc    Get all teachers (Search & Filter)
router.get('/', getTeachers);

// @route   GET /api/teachers/:id
// @desc    Get teacher profile by ID
router.get('/:id', getTeacherById);

module.exports = router;