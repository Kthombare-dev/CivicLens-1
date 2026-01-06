/**
 * Service configuration for AI and Location services
 */

const servicesConfig = {
  // Gemini AI Service Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    
    // Image processing limits
    maxImageSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    
    // Default values for fallback
    defaults: {
      category: 'Other',
      priority: 'Medium',
      department: 'General',
      confidence: {
        description: 0,
        category: 0,
        priority: 0
      }
    }
  },

  // Location Service Configuration
  location: {
    geocodingApiKey: process.env.GEOCODING_API_KEY,
    timeout: 10000, // 10 seconds
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    
    // Coordinate validation ranges
    coordinateRanges: {
      latitude: { min: -90, max: 90 },
      longitude: { min: -180, max: 180 }
    },
    
    // Service endpoints
    services: {
      nominatim: {
        url: 'https://nominatim.openstreetmap.org/reverse',
        requiresKey: false,
        userAgent: 'CivicLens-App/1.0'
      },
      google: {
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        requiresKey: true
      },
      ipGeolocation: {
        url: 'http://ip-api.com/json',
        requiresKey: false
      }
    }
  },

  // General service configuration
  general: {
    // Health check intervals
    healthCheckInterval: 5 * 60 * 1000, // 5 minutes
    
    // Logging configuration
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      enableServiceLogs: process.env.ENABLE_SERVICE_LOGS === 'true'
    },
    
    // Rate limiting
    rateLimiting: {
      enabled: process.env.ENABLE_RATE_LIMITING !== 'false',
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100 // per window
    }
  }
};

/**
 * Validate service configuration
 * @returns {Object} Validation results
 */
function validateConfig() {
  const validation = {
    valid: true,
    warnings: [],
    errors: []
  };

  // Check Gemini API key
  if (!servicesConfig.gemini.apiKey || servicesConfig.gemini.apiKey === 'your_gemini_api_key_here') {
    validation.warnings.push('Gemini API key not configured - AI features will use fallback responses');
  }

  // Check Google Geocoding API key
  if (!servicesConfig.location.geocodingApiKey || servicesConfig.location.geocodingApiKey === 'your_google_geocoding_api_key_here') {
    validation.warnings.push('Google Geocoding API key not configured - will use OpenStreetMap only');
  }

  // Validate timeout values
  if (servicesConfig.gemini.timeout < 5000) {
    validation.errors.push('Gemini timeout too low - minimum 5 seconds recommended');
    validation.valid = false;
  }

  if (servicesConfig.location.timeout < 3000) {
    validation.errors.push('Location service timeout too low - minimum 3 seconds recommended');
    validation.valid = false;
  }

  return validation;
}

/**
 * Get service configuration with environment overrides
 * @returns {Object} Complete service configuration
 */
function getConfig() {
  // Apply environment variable overrides
  const config = { ...servicesConfig };
  
  // Override timeouts if specified
  if (process.env.GEMINI_TIMEOUT) {
    config.gemini.timeout = parseInt(process.env.GEMINI_TIMEOUT);
  }
  
  if (process.env.LOCATION_TIMEOUT) {
    config.location.timeout = parseInt(process.env.LOCATION_TIMEOUT);
  }
  
  // Override retry settings
  if (process.env.MAX_RETRIES) {
    const maxRetries = parseInt(process.env.MAX_RETRIES);
    config.gemini.maxRetries = maxRetries;
    config.location.maxRetries = maxRetries;
  }
  
  return config;
}

module.exports = {
  servicesConfig,
  validateConfig,
  getConfig
};