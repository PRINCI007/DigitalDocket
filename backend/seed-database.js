const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      
      // Update password if needed
      const updatePassword = process.argv[2]; // node create-admin.js newpassword
      if (updatePassword) {
        const hashedPassword = await bcrypt.hash(updatePassword, 12);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('✅ Password updated successfully');
      }
    } else {
      // Create new admin
      const password = process.argv[2] || 'admin123'; // Default password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const admin = new Admin({
        username: 'admin',
        email: 'admin@cyberwatch.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully');
      console.log('Username: admin');
      console.log('Password:', password);
    }
    
    // Test the login by verifying password
    const admin = await Admin.findOne({ username: 'admin' });
    const testPassword = process.argv[2] || 'admin123';
    const isValidPassword = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🧪 Password verification test:');
    console.log('Test password:', testPassword);
    console.log('Valid:', isValidPassword ? '✅ YES' : '❌ NO');
    
    if (!isValidPassword) {
      console.log('\n⚠️ Password verification failed! The stored password might be corrupted.');
      console.log('Run: node create-admin.js your_new_password');
    }
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Usage examples printed
console.log('🚀 Admin User Management Script');
console.log('');
console.log('Usage:');
console.log('  node create-admin.js                    # Creates admin with password "admin123"');
console.log('  node create-admin.js mypassword         # Creates/updates admin with custom password');
console.log('');

createAdmin();