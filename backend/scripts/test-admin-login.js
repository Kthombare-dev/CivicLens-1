const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_URL = `http://localhost:${process.env.PORT || 5000}/api/auth`;

const testAdminLogin = async () => {
    try {
        console.log('Testing Admin Login...');
        console.log(`URL: ${API_URL}/login`);
        console.log(`Email: ${process.env.ADMIN_EMAIL}`);

        const response = await axios.post(`${API_URL}/login`, {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });

        if (response.status === 200) {
            console.log('✓ Admin login successful');
            const { user, token } = response.data.data;
            console.log(`  User: ${user.name}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Token: ${token.substring(0, 20)}...`);

            if (user.role === 'admin') {
                console.log('✓ User has correct admin role');
            } else {
                console.error('✗ User does NOT have admin role');
            }
        } else {
            console.error(`✗ Login failed with status: ${response.status}`);
        }

    } catch (error) {
        console.error('✗ Test failed:');
        if (error.response) {
            console.error(`  Status: ${error.response.status}`);
            console.error(`  Message: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`  Error: ${error.message}`);
        }
    }
};

testAdminLogin();
