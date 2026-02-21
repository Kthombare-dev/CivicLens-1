const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

async function runTests() {
    try {
        console.log('Starting User Update API Test...');

        // 1. Register a new user
        const timestamp = Date.now();
        const userData = {
            name: `Test User ${timestamp}`,
            email: `test${timestamp}@example.com`,
            phone: timestamp.toString().slice(-10), // Last 10 digits
            password: 'Password123!',
            area: 'Initial Area'
        };

        console.log('\nPlease ensure you have a fresh database or handle potential conflicts manually if running repeatedly.');

        try {
            console.log('1. Registering user...');
            const registerRes = await axios.post(`${BASE_URL}/auth/register`, userData);
            authToken = registerRes.data.data.token;
            userId = registerRes.data.data.user._id;
            console.log('✓ User registered successfully');
            console.log('Token:', authToken.substring(0, 20) + '...');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                console.log('User likely already exists, trying login...');
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email: userData.email,
                    password: userData.password
                });
                authToken = loginRes.data.data.token;
                console.log('✓ Logged in successfully');
            } else {
                throw error;
            }
        }

        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        // 2. Test PATCH /api/user/profile with all fields
        console.log('\n2. Testing PATCH /api/user/profile (All fields)...');
        const updateData1 = {
            name: `Updated Name ${timestamp}`,
            phone: (parseInt(userData.phone) + 1).toString(),
            address: '123 New Street, Verified City',
            area: 'Updated Area'
        };

        try {
            const updateRes1 = await axios.patch(`${BASE_URL}/user/profile`, updateData1, config);
            const user1 = updateRes1.data.data.user;

            if (user1.name === updateData1.name &&
                user1.phone === updateData1.phone &&
                user1.address === updateData1.address &&
                user1.area === updateData1.area) {
                console.log('✓ All fields updated successfully');
            } else {
                console.error('✗ Update failed verification:', user1);
            }
        } catch (error) {
            console.error('✗ Update passed failed:', error.response ? error.response.data : error.message);
        }

        // 3. Test PATCH /api/user/profile (Partial update - Address only)
        console.log('\n3. Testing PATCH /api/user/profile (Address only)...');
        const updateData2 = {
            address: '456 Another St, Partial City'
        };

        try {
            const updateRes2 = await axios.patch(`${BASE_URL}/user/profile`, updateData2, config);
            const user2 = updateRes2.data.data.user;

            if (user2.address === updateData2.address) {
                console.log('✓ Address updated successfully');
            } else {
                console.error('✗ Partial update failed verification:', user2);
            }
        } catch (error) {
            console.error('✗ Partial update failed:', error.response ? error.response.data : error.message);
        }

        // 4. Test PATCH /api/user/profile (Validation Error - Empty Body or invalid fields)
        console.log('\n4. Testing PATCH /api/user/profile (Validation Error)...');
        try {
            await axios.patch(`${BASE_URL}/user/profile`, {}, config);
            console.error('✗ Should have failed with validation error but succeeded');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Correctly rejected empty update');
            } else {
                console.error('✗ Unexpected error:', error.message);
            }
        }

    } catch (error) {
        console.error('Test execution failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

runTests();
