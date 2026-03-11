const jwt = require('jsonwebtoken');
require('dotenv').config({path: './.env'});
const http = require('http');

console.log("Secret length:", process.env.JWT_SECRET.length);

const payload = {
    user: {
        id: "67cf39a24b1295c55e7aeee8",
        role: "official"
    }
};

const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

console.log("Signed JWT manually.");

const compOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/officer/complaints',
    headers: {
    'Authorization': `Bearer ${token}`
    }
};

http.get(compOptions, (r2) => {
    let d2 = '';
    r2.on('data', chunk => d2 += chunk);
    r2.on('end', () => {
        console.log("COMPLAINTS API Output:");
        console.log(d2);
    });
});
