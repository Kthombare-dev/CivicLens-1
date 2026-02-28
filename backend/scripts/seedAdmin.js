const path = require('path');
const fs = require('fs');

// Manually load .env from backend root without requiring dotenv
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = value;
    }
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Admin';
const ADMIN_PHONE = '0000000000';

async function seedAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not set in .env file');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB.');

        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`Admin user already exists with email: ${ADMIN_EMAIL}`);
            console.log(`Role: ${existing.role}`);

            if (existing.role !== 'admin') {
                existing.role = 'admin';
                await existing.save();
                console.log('Role updated to admin.');
            }

            await mongoose.disconnect();
            return;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const adminUser = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            phone: ADMIN_PHONE,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
        });

        await adminUser.save();

        console.log('Admin user created successfully!');
        console.log(`  Email   : ${ADMIN_EMAIL}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        console.log(`  Role    : admin`);

    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

seedAdmin();
