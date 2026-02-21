const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    try {
        console.log('Starting Complaint Address Fallback Test...');

        // 0. Setup: Create a dummy image for complaint upload
        const dummyImagePath = path.join(__dirname, 'test_image.jpg');
        if (!fs.existsSync(dummyImagePath)) {
            // Create a simple text file disguising as jpg for test purposes (multer might accept based on extension or mime check)
            // Actually middleware checks mime type. Let's try to create a 1x1 pixel jpg or just use a text file and hope 
            // the test environment allows it. 
            // Better: Check if there's any image in uploads folder or create a valid one.
            // For now, let's just write some bytes.
            fs.writeFileSync(dummyImagePath, 'fake image content');
        }

        // 1. Register a user with address and coordinates
        const timestamp = Date.now();
        const userData = {
            name: `Fallback User ${timestamp}`,
            email: `fallback_${timestamp}@example.com`,
            phone: timestamp.toString().slice(-10),
            password: 'Password123!',
            area: 'User Profile Area',
            address: 'User Profile Address',
            latitude: 22.123456,
            longitude: 75.123456
        };

        console.log('1. Registering user...');
        // First register (without coords/address as register endpoint might not take them directly, 
        // usually it takes name, email, phone, password, area. Address/Coords via PATCH)
        // Wait, current register logic in auth.js accepts "area". 
        // But address and coordinates are likely not in register body in auth.js
        // Let's register then PATCH.

        let authToken = '';
        try {
            const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                area: userData.area
            });
            authToken = registerRes.data.data.token;
            console.log('✓ User registered');
        } catch (e) {
            console.error('Registration failed:', e.response?.data || e.message);
            return;
        }

        // 2. Update profile with Address and Coordinates
        console.log('2. Updating profile with address and coordinates...');
        const patchData = {
            address: userData.address,
            latitude: userData.latitude,
            longitude: userData.longitude
        };

        try {
            await axios.patch(`${BASE_URL}/user/profile`, patchData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✓ Profile updated');
        } catch (e) {
            console.error('Profile update failed:', e.response?.data || e.message);
            return;
        }

        // 3. Create Complaint WITHOUT address/location
        console.log('3. Creating complaint WITHOUT address...');
        const form = new FormData();
        form.append('title', `Complaint ${timestamp}`);
        form.append('description', 'Test description');
        // Check if we need to append a file. Routes say "image" field required.
        // We need a file that passes fileFilter (mimetype). 
        // Our fake file might fail if multer checks magic numbers or extensions.
        // Middleware upload.js checks allowed formats. 
        // Let's try to simulate a valid file or handle error. 
        // Since we can't easily generate a valid binary JPG here without a library, 
        // we might fail here if strict validation is on.
        // Assuming loose validation or simulating just text might not work.
        // Let's rely on the fact that existing tests are running, maybe there are images.

        // Try to create a minimal valid PNG or similar? hard without headers.
        // Let's just try sending the buffer and say filename is test.jpg
        form.append('image', Buffer.from('fake image content'), { filename: 'test.jpg', contentType: 'image/jpeg' });

        try {
            const complaintRes = await axios.post(`${BASE_URL}/complaints`, form, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    ...form.getHeaders()
                }
            });

            const complaint = complaintRes.data;
            console.log('Complaint Created:', {
                address: complaint.address,
                area: complaint.area,
                coordinates: complaint.coordinates
            });

            // Verify Fallback
            if (complaint.address === userData.address) {
                console.log('✓ Address fallback worked');
            } else {
                console.error('✗ Address fallback failed. Expected:', userData.address, 'Got:', complaint.address);
            }

            if (complaint.area === userData.area) { // Note: register used "User Profile Area", update didn't change it.
                console.log('✓ Area fallback worked');
            } else {
                console.error('✗ Area fallback failed');
            }

            if (complaint.coordinates &&
                Math.abs(complaint.coordinates.coordinates[1] - userData.latitude) < 0.0001 &&
                Math.abs(complaint.coordinates.coordinates[0] - userData.longitude) < 0.0001) {
                console.log('✓ Coordinates fallback worked');
            } else {
                console.error('✗ Coordinates fallback failed');
            }

        } catch (e) {
            console.error('Complaint creation failed:', e.response?.data || e.message);
        }

        // Cleanup
        if (fs.existsSync(dummyImagePath)) fs.unlinkSync(dummyImagePath);

    } catch (error) {
        console.error('Test execution failed:', error.message);
    }
}

runTests();
