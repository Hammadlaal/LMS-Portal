const express = require('express');
const router = express.Router();
const { registerTeacher, loginTeacher } = require('../controllers/authController');

router.post('/', registerTeacher);
router.post('/login', loginTeacher);

module.exports = router;
