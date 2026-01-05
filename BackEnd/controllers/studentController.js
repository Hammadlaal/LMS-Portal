const Student = require('../models/Student');
const sendEmail = require('../config/mailer');
const crypto = require('crypto');

// @desc    Add a new student
// @route   POST /api/students
// @access  Private (Teacher only)
const addStudent = async (req, res) => {
    try {
        const { name, email } = req.body;

        const studentExists = await Student.findOne({ email });

        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Generate a random password
        const generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 characters

        const student = await Student.create({
            name,
            email,
            password: generatedPassword, // This triggers the pre-save hook to hash it
            addedBy: req.teacher._id, // From auth middleware
        });

        if (student) {
            // Send email with the CLEARTEXT password
            const emailSent = await sendEmail(
                email,
                'Your Student Account Credentials',
                `Hello ${name},\n\nYour account has been created by your teacher.\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${generatedPassword}\n\nPlease change your password after logging in.`
            );

            res.status(201).json({
                _id: student._id,
                name: student.name,
                email: student.email,
                addedBy: student.addedBy,
                emailSent: emailSent,
                message: emailSent ? 'Student added and email sent' : 'Student added but email failed to send'
            });
        } else {
            res.status(400).json({ message: 'Invalid student data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all students for the logged-in teacher
// @route   GET /api/students
// @access  Private
const getMyStudents = async (req, res) => {
    try {
        const students = await Student.find({ addedBy: req.teacher._id });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addStudent,
    getMyStudents,
};
