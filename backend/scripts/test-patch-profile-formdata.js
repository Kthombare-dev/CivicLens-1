const axios = require('axios');
const FormData = require('form-data'); // You might need to install this if not present, but usually available in node environment or we can simulate

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

async function runTests() {
    try {
        console.log('Starting User Update API Test (Form Data Support)...');

        // 1. Register a new user
        const timestamp = Date.now();
        const userData = {
            name: `Test User ${timestamp}`,
            email: `test_fd_${timestamp}@example.com`,
            phone: timestamp.toString().slice(-10),
            password: 'Password123!',
            area: 'Initial Area'
        };

        try {
            console.log('1. Registering user...');
            const registerRes = await axios.post(`${BASE_URL}/auth/register`, userData);
            authToken = registerRes.data.data.token;
            console.log('✓ User registered successfully');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // Try login if conflict (though unique email should prevent this in this script)
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

        const configKey = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        // 2. Test PATCH /api/user/profile with JSON (Legacy check)
        console.log('\n2. Testing JSON update...');
        try {
            await axios.patch(`${BASE_URL}/user/profile`, { area: 'JSON Area' }, configKey);
            console.log('✓ JSON update still works');
        } catch (error) {
            console.error('✗ JSON update failed:', error.message);
        }

        // 3. Test PATCH /api/user/profile with form-data
        console.log('\n3. Testing Multipart/Form-Data update...');
        const form = new FormData();
        form.append('name', `FormData Name ${timestamp}`);
        form.append('address', '123 FormData St');

        const configForm = {
            headers: {
                Authorization: `Bearer ${authToken}`,
                ...form.getHeaders()
            }
        };

        try {
            const updateRes = await axios.patch(`${BASE_URL}/user/profile`, form, configForm);
            const user = updateRes.data.data.user;

            if (user.name === `FormData Name ${timestamp}` &&
                user.address === '123 FormData St') {
                console.log('✓ Form-Data update successful');
            } else {
                console.error('✗ Form-Data update failed verification:', user);
            }
        } catch (error) {
            console.error('✗ Form-Data update failed:', error.response ? error.response.data : error.message);
        }

    } catch (error) {
        console.error('Test execution failed:', error.message);
    }
}

runTests();
