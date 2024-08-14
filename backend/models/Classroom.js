// // models/Classroom.js
// const mongoose = require('mongoose');
// const classroomSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   schedule: {
//     startTime: String,
//     endTime: String,
//     days: [String], // e.g., ['Monday', 'Tuesday']
//   },
// });
// module.exports = mongoose.model('Classroom', classroomSchema);

const mongoose = require('mongoose');

// Define a schema for the timetable
const timetableSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  startTime: { type: String, required: true }, // Use string for time
  endTime: { type: String, required: true },   // Use string for time
  daysOfWeek: [{ type: String, required: true }]  // e.g., ['Monday', 'Wednesday']
});

// Define the classroom schema
const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  schedule: {
    startTime: { type: String, required: true }, // e.g., '08:00'
    endTime: { type: String, required: true },   // e.g., '16:00'
    days: [String] // e.g., ['Monday', 'Tuesday']
  },
  timetable: [timetableSchema] // Add the timetable field
});

module.exports = mongoose.model('Classroom', classroomSchema);
