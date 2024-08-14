// controllers/classroomController.js
const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Create a classroom
exports.createClassroom = async (req, res) => {
  const { name, schedule } = req.body;
  
  // Ensure the user is a principal
  if (req.user.role !== 'principal') {
    return res.status(403).json({ message: 'User role not authorized' });
  }

  try {
    // Create a new classroom with provided details
    const classroom = new Classroom({
      name,
      schedule,
    });

    // Save the classroom to the database
    await classroom.save();

    // Send a success response
    res.status(201).json({ message: 'Classroom created successfully', classroom });
  } catch (error) {
    // Log the error for debugging
    console.error('Error creating classroom:', error);
    
    // Send an error response
    res.status(500).json({ message: 'Server error' });
  }
};
// Assign a teacher to a classroom
exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId, classroomId } = req.body;

    // Find the classroom by ID
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      console.log('Classroom not found for ID:', classroomId); // Log if classroom not found
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Assign the teacher to the classroom
    classroom.teacher = teacherId;
    await classroom.save();

    // Find the teacher by ID
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      console.log('Teacher not found for ID:', teacherId); // Log if teacher not found
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Assign the classroom to the teacher
    teacher.classroom = classroomId;
    await teacher.save();

    res.json({ message: 'Teacher assigned to classroom', classroom, teacher });
  } catch (error) {
    console.error('Error assigning teacher:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all classrooms
exports.getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate('teacher students');
    res.json(classrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a timetable for a classroom
exports.createTimetable = async (req, res) => {
  const { classroomId, timetable } = req.body; // timetable should be an array of timetable objects
  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      console.log('Classroom not found for ID:', classroomId); // Log if classroom not found
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Validate timetable periods here (e.g., check for overlaps, valid times, etc.)
    classroom.timetable.push(...timetable);
    await classroom.save();

    res.json({ message: 'Timetable created successfully', timetable: classroom.timetable });
  } catch (error) {
    console.error('Error creating timetable:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Get timetable for a specific classroom
exports.getTimetable = async (req, res) => {
  const { classroomId } = req.params;
  try {
    console.log('Fetching timetable for classroom ID:', classroomId); // Log the classroom ID
    const classroom = await Classroom.findById(classroomId).populate('students');
    if (!classroom) {
      console.log('Classroom not found for ID:', classroomId); // Log if classroom not found
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if the user is part of the classroom
    const isStudentInClassroom = classroom.students.some(student => student._id.equals(req.user._id));
    console.log('Is student in classroom:', isStudentInClassroom); // Log if student is in classroom
    console.log('User Role:', req.user.role); // Log the user role

    if (!isStudentInClassroom && req.user.role !== 'teacher' && req.user.role !== 'principal') {
      console.log('Access forbidden: not a part of this classroom'); // Log access forbidden
      return res.status(403).json({ message: 'Access forbidden: not a part of this classroom' });
    }

    res.json(classroom.timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign a student to a classroom
exports.assignStudent = async (req, res) => {
  try {
    const { studentId, classroomId } = req.body;

    // Find the classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      console.log('Classroom not found for ID:', classroomId); // Log if classroom not found
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Find the student
    const student = await User.findById(studentId);
    if (!student) {
      console.log('Student not found for ID:', studentId); // Log if student not found
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add student to the classroom
    if (!classroom.students.includes(studentId)) {
      classroom.students.push(studentId);
      await classroom.save();
      res.json({ message: 'Student assigned to classroom', classroom });
    } else {
      console.log('Student already in the classroom'); // Log if student already in classroom
      res.status(400).json({ message: 'Student already in the classroom' });
    }
  } catch (error) {
    console.error('Error assigning student:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Get students in a specific classroom
// controllers/classroomController.js
exports.getStudentsInClassroom = async (req, res) => {
  const { classroomId } = req.params;
  try {
    console.log('Fetching students for classroom ID:', classroomId);

    // Retrieve the classroom document and populate the students field
    const classroom = await Classroom.findById(classroomId).populate('students');

    if (!classroom) {
      console.log('Classroom not found for ID:', classroomId);
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Log retrieved classroom data to debug the issue
    console.log('Classroom document:', classroom);

    if (!classroom.students || classroom.students.length === 0) {
      console.log('No students found in classroom:', classroomId);
    } else {
      console.log('Found students:', classroom.students);
    }

    // If the user is a student and not in the classroom, deny access
    const isStudentInClassroom = classroom.students.some(student => student._id.equals(req.user._id));
    console.log('Is student in classroom:', isStudentInClassroom);

    if (req.user.role === 'student' && !isStudentInClassroom) {
      console.log('Access forbidden: student not part of this classroom');
      return res.status(403).json({ message: 'Access forbidden: not a part of this classroom' });
    }

    // Return the list of students
    res.json(classroom.students);
  } catch (error) {
    console.error('Error fetching students in classroom:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getTeachers = async (req, res) => {
  try {
    // Fetch all teachers from the database
    const teachers = await Teacher.find();
    
    // Send the list of teachers as a JSON response
    res.status(200).json(teachers);
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
