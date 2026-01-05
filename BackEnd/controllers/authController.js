const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

// Generate Token (Long Lived for simplicity)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new teacher
// @route   POST /api/teachers
// @access  Public
const registerTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const teacherExists = await Teacher.findOne({ email });

        if (teacherExists) {
            return res.status(400).json({ message: 'Teacher already exists' });
        }

        const teacher = await Teacher.create({
            name,
            email,
            password,
        });

        if (teacher) {
            res.status(201).json({
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                token: generateToken(teacher._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid teacher data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth teacher & get token
// @route   POST /api/teachers/login
// @access  Public
const loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });

        if (teacher && (await teacher.matchPassword(password))) {
            res.json({
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                token: generateToken(teacher._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerTeacher,
    loginTeacher,
};
