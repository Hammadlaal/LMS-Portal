const express = require('express');
const router = express.Router();
const { addStudent, getMyStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addStudent)
    .get(protect, getMyStudents);

module.exports = router;
