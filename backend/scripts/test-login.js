require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/click2leads');
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ email: 'admin@click2leads.co.uk' }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('User has password:', !!user.password);
      console.log('Password hash:', user.password);
      
      const isMatch = await bcrypt.compare('admin123', user.password);
      console.log('Password matches:', isMatch);
      
      const isMatchMethod = await user.matchPassword('admin123');
      console.log('Password matches (using method):', isMatchMethod);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();