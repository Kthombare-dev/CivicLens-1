const { promises: fs } = require('fs');
const path = require('path');
const serviceFactory = require('./serviceFactory');
const { getConfig } = require('../config/services');

const servicesConfig = getConfig();

const DEPARTMENTS = [
  'WASTE_MANAGEMENT',
  'ROAD_INFRASTRUCTURE',
  'STREETLIGHT_ELECTRICAL',
  'WATER_SEWERAGE',
  'SANITATION_PUBLIC_HEALTH',
  'PARKS_GARDENS',
  'ENCROACHMENT',
  'TRAFFIC_SIGNAGE',
  'GENERAL'
];

function isGeminiConfigured() {
  return !!(
    servicesConfig.gemini.apiKey &&
    servicesConfig.gemini.apiKey !== 'your_gemini_api_key_here'
  );
}

function normalizeDepartment(department) {
  const normalized = (department || '')
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const aliasMap = {
    WASTE: 'WASTE_MANAGEMENT',
    GARBAGE: 'WASTE_MANAGEMENT',
    WASTE_MANAGEMENT: 'WASTE_MANAGEMENT',
    ROAD: 'ROAD_INFRASTRUCTURE',
    ROADS: 'ROAD_INFRASTRUCTURE',
    ROAD_INFRASTRUCTURE: 'ROAD_INFRASTRUCTURE',
    STREETLIGHT: 'STREETLIGHT_ELECTRICAL',
    STREETLIGHTS: 'STREETLIGHT_ELECTRICAL',
    ELECTRICITY: 'STREETLIGHT_ELECTRICAL',
    ELECTRICAL: 'STREETLIGHT_ELECTRICAL',
    WATER: 'WATER_SEWERAGE',
    SEWER: 'WATER_SEWERAGE',
    SEWERAGE: 'WATER_SEWERAGE',
    LEAK: 'WATER_SEWERAGE',
    SANITATION: 'SANITATION_PUBLIC_HEALTH',
    HEALTH: 'SANITATION_PUBLIC_HEALTH',
    HYGIENE: 'SANITATION_PUBLIC_HEALTH',
    PARK: 'PARKS_GARDENS',
    PARKS: 'PARKS_GARDENS',
    GARDEN: 'PARKS_GARDENS',
    GARDENS: 'PARKS_GARDENS',
    ENCROACH: 'ENCROACHMENT',
    ENCROACHMENT: 'ENCROACHMENT',
    TRAFFIC: 'TRAFFIC_SIGNAGE',
    SIGNAGE: 'TRAFFIC_SIGNAGE',
    SIGNAL: 'TRAFFIC_SIGNAGE',
    SIGNALS: 'TRAFFIC_SIGNAGE',
    GENERAL: 'GENERAL'
  };

  if (aliasMap[normalized]) {
    return aliasMap[normalized];
  }

  if (DEPARTMENTS.includes(normalized)) {
    return normalized;
  }

  return 'GENERAL';
}

function buildFallback(userDescription = '') {
  const defaults = servicesConfig.gemini.defaults;
  return {
    description: userDescription || '',
    title: '',
    category: defaults.category,
    priority: defaults.priority,
    department: normalizeDepartment(defaults.department || 'GENERAL'),
    confidence: defaults.confidence,
    fallback: true
  };
}

async function fileToDataUrl(filePath, mimeType) {
  const buffer = await fs.readFile(filePath);
  const base64 = buffer.toString('base64');
  const detectedMime = mimeType || detectMimeFromPath(filePath);
  return `data:${detectedMime};base64,${base64}`;
}

function detectMimeFromPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'image/jpeg';
  }
}

/**
 * Analyze complaint image via Gemini with graceful fallback
 * @param {Object} params
 * @param {string} params.filePath - Local file path to the uploaded image
 * @param {string} params.mimeType - MIME type from upload
 * @param {string} [params.userDescription] - Optional user description/title
 * @returns {Promise<Object>} AI analysis result or fallback defaults
 */
async function analyzeComplaintImage({ filePath, mimeType, userDescription }) {
  if (!isGeminiConfigured()) {
    return buildFallback(userDescription);
  }

  try {
    const gemini = serviceFactory.getGeminiService();
    const dataUrl = await fileToDataUrl(filePath, mimeType);
    const ai = await gemini.analyzeComplaintImage(dataUrl, userDescription);
    return {
      ...ai,
      department: normalizeDepartment(ai.department)
    };
  } catch (error) {
    console.error('AI analysis failed, using fallback:', error.message);
    return buildFallback(userDescription);
  }
}

module.exports = {
  analyzeComplaintImage,
  normalizeDepartment,
  detectMimeFromPath
};

