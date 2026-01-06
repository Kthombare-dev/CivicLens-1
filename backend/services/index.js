/**
 * Service exports for easy access throughout the application
 */

const serviceFactory = require('./serviceFactory');

/**
 * Get initialized Gemini AI service
 * @returns {GeminiService} Gemini service instance
 */
function getGeminiService() {
  return serviceFactory.getGeminiService();
}

/**
 * Get initialized Location service
 * @returns {LocationService} Location service instance
 */
function getLocationService() {
  return serviceFactory.getLocationService();
}

/**
 * Check if services are initialized
 * @returns {boolean} True if services are initialized
 */
function areServicesInitialized() {
  return serviceFactory.initialized;
}

/**
 * Get service health status
 * @returns {Promise<Object>} Health status of all services
 */
async function getServiceHealth() {
  return await serviceFactory.performHealthCheck();
}

/**
 * Get service statistics
 * @returns {Object} Service statistics and configuration
 */
function getServiceStats() {
  return serviceFactory.getServiceStats();
}

module.exports = {
  getGeminiService,
  getLocationService,
  areServicesInitialized,
  getServiceHealth,
  getServiceStats,
  serviceFactory
};