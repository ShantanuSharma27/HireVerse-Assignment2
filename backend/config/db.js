const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const dotenv=require('dotenv')
async function seedPrincipal() {
  try {
    const principalExists = await User.findOne({ email: 'principal@classroom.com' });
    if (!principalExists) {
      const hashedPassword = await bcrypt.hash('Admin', 10);
      const principal = new User({
        name: 'Principal',
        email: 'principal@classroom.com',
        password: hashedPassword,
        role: 'principal',
      });
      await principal.save();
      console.log('Principal account seeded');
    }
  } catch (error) {
    console.error('Error seeding principal account:', error);
  }
}
dotenv.config();
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    await seedPrincipal();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectDB;
