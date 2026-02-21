const User = require('../models/User');
const config = require('../config/env');
const bcrypt = require('bcryptjs');

/**
 * Seeds the admin user if it doesn't exist
 */
const seedAdminUser = async () => {
    try {
        console.log('Checking for admin user...');

        // Check if admin exists by email
        const existingAdmin = await User.findOne({ email: config.ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('✓ Admin user already exists');

            // Optional: Check if the existing user has admin role, update if not
            if (existingAdmin.role !== 'admin') {
                console.log('  Updating existing user role to admin...');
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('  ✓ User role updated to admin');
            }
            return;
        }

        console.log('Creating admin user...');

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, salt);

        // Create new admin user
        const newAdmin = new User({
            name: 'System Admin',
            email: config.ADMIN_EMAIL,
            password: hashedPassword,
            phone: config.ADMIN_PHONE, // Required by schema
            role: 'admin',
            isActive: true,
            area: 'Admin HQ' // Optional but good to have
        });

        await newAdmin.save();
        console.log('✓ Admin user created successfully');
        console.log(`  Email: ${config.ADMIN_EMAIL}`);
        console.log(`  Phone: ${config.ADMIN_PHONE}`);

    } catch (error) {
        console.error('✗ Failed to seed admin user:', error.message);
        // Don't exit process, just log error so server can still start
    }
};

module.exports = seedAdminUser;
