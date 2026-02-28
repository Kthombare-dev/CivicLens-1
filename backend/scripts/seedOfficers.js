const path = require('path');
const fs   = require('fs');

// Load .env without requiring dotenv package
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key   = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = value;
    }
}

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

// Default password for all seeded officers
const DEFAULT_PASSWORD = 'Officer@123';

const OFFICERS = [
    {
        name:  'Ravi Kumar Sharma',
        email: 'ravi.sharma@civiclens.gov.in',
        phone: '9876543210',
        ward:  'Sanitation',
    },
    {
        name:  'Priya Mehta',
        email: 'priya.mehta@civiclens.gov.in',
        phone: '9123456780',
        ward:  'Water Supply',
    },
    {
        name:  'Suresh Yadav',
        email: 'suresh.yadav@civiclens.gov.in',
        phone: '9823456712',
        ward:  'Roads & Infrastructure',
    },
    {
        name:  'Anita Desai',
        email: 'anita.desai@civiclens.gov.in',
        phone: '9712345678',
        ward:  'Streetlight & Electricity',
    },
    {
        name:  'Rajiv Nair',
        email: 'rajiv.nair@civiclens.gov.in',
        phone: '9654321890',
        ward:  'Drainage & Sewage',
    },
    {
        name:  'Sunita Joshi',
        email: 'sunita.joshi@civiclens.gov.in',
        phone: '9543217890',
        ward:  'Parks & Gardens',
    },
    {
        name:  'Arvind Patel',
        email: 'arvind.patel@civiclens.gov.in',
        phone: '9432198765',
        ward:  'Solid Waste Management',
    },
    {
        name:  'Meena Kumari',
        email: 'meena.kumari@civiclens.gov.in',
        phone: '9321987654',
        ward:  'Field Operations',
    },
];

async function seedOfficers() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error('MONGODB_URI is not set in .env file');

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected.\n');

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        let created = 0;
        let skipped = 0;

        for (const officer of OFFICERS) {
            const existing = await User.findOne({ email: officer.email });

            if (existing) {
                // Ensure role is 'official' even if the user already exists
                if (existing.role !== 'official') {
                    existing.role = 'official';
                    existing.ward = officer.ward;
                    await existing.save();
                    console.log(`  ✔ Updated role → official  : ${officer.name} (${officer.email})`);
                    created++;
                } else {
                    console.log(`  – Already exists (skipped) : ${officer.name} (${officer.email})`);
                    skipped++;
                }
                continue;
            }

            await User.create({
                name:     officer.name,
                email:    officer.email,
                phone:    officer.phone,
                password: hashedPassword,
                role:     'official',
                ward:     officer.ward,
                isActive: true,
            });

            console.log(`  ✔ Created officer          : ${officer.name} | ${officer.ward}`);
            created++;
        }

        console.log('\n─────────────────────────────────────────────');
        console.log(`  Officers created/updated : ${created}`);
        console.log(`  Officers skipped         : ${skipped}`);
        console.log(`  Default password         : ${DEFAULT_PASSWORD}`);
        console.log('─────────────────────────────────────────────\n');

    } catch (error) {
        console.error('\nSeed failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

seedOfficers();
