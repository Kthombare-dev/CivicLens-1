// Test script to verify MongoDB connection
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...\n');
console.log('MONGODB_URI from env:', process.env.MONGODB_URI ? 
    process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'NOT FOUND');

if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI not found in .env file');
    process.exit(1);
}

const uri = process.env.MONGODB_URI;
console.log('\nAttempting to connect...\n');

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✓ Connection successful!');
    process.exit(0);
})
.catch((err) => {
    console.error('✗ Connection failed!');
    console.error('\nError details:');
    console.error('  Name:', err.name);
    console.error('  Message:', err.message);
    
    if (err.message.includes('authentication')) {
        console.error('\n🔐 Authentication Error - Check:');
        console.error('  1. Username and password in MongoDB Atlas');
        console.error('  2. Make sure password special characters are URL-encoded');
        console.error('  3. Verify the database user exists and has permissions');
    }
    
    if (err.message.includes('timeout') || err.message.includes('ENOTFOUND')) {
        console.error('\n🌐 Network Error - Check:');
        console.error('  1. Your IP is whitelisted in Atlas Network Access');
        console.error('  2. You can access: https://cloud.mongodb.com');
        console.error('  3. Your internet connection is working');
    }
    
    process.exit(1);
});





