// Test setup file
require('dotenv').config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test_gemini_key';
process.env.GEOCODING_API_KEY = process.env.GEOCODING_API_KEY || 'test_geocoding_key';

// Increase timeout for property-based tests
jest.setTimeout(30000);