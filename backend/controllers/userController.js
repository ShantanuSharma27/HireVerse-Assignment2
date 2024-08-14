// controllers/userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Classroom=require('../models/Classroom')
// Register a new user (Teacher/Student)
exports.registerUser = async (req, res) => {
  const { name, email, password, role,classroom } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role,classroom });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all teachers and students
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['teacher', 'student'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getTeachers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['teacher'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getTeachersThroughId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Find the teacher by ID and ensure they have a 'teacher' role
    const teacher = await User.findById(teacherId).where({ role: 'teacher' });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Send the teacher's data as the response
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getStudents = async (req, res) => {
  try {
    // Query for users with the role of 'student'
    const users = await User.find({ role: { $in: ['student'] } });

    // Respond with the list of students
    res.json(users);
  } catch (error) {
    // Handle and respond to errors
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
const mongoose = require('mongoose');


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Received delete request for ID:', userId);

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid ID format');
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Check if the user is a teacher and remove their assignment from any classrooms
    if (user.role === 'teacher') {
      try {
        await Classroom.updateMany(
          { teacher: userId },
          { $unset: { teacher: "" } } // Remove the teacher assignment
        );
        console.log('Teacher removed from classrooms');
      } catch (err) {
        console.error('Error removing teacher from classrooms:', err);
        return res.status(500).json({ message: 'Error removing teacher from classrooms' });
      }
    }

    // Delete the user
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params; // Get the teacher ID from the URL params
    const updatedData = req.body; // Get the new data for the teacher from the request body


    // Find the teacher by ID and update with the new data
    const updatedTeacher = await User.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose validators on the new data
    });

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher updated successfully', updatedTeacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params; // Get the teacher ID from the URL params
    const updatedData = req.body; // Get the new data for the teacher from the request body


    // Find the teacher by ID and update with the new data
    const updatedStudent = await User.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose validators on the new data
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', updatedStudent });
  } catch (error) {
    console.error('Error updating Student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



