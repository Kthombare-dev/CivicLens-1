const GeminiService = require('./geminiService');
const LocationService = require('./locationService');
const { validateConfig, getConfig } = require('../config/services');

/**
 * Service Factory for managing AI and Location services
 */
class ServiceFactory {
  constructor() {
    this.geminiService = null;
    this.locationService = null;
    this.config = getConfig();
    this.initialized = false;
  }

  /**
   * Initialize all services
   * @returns {Promise<Object>} Initialization results
   */
  async initialize() {
    try {
      console.log('Initializing AI and Location services...');
      
      // Validate configuration
      const validation = validateConfig();
      if (!validation.valid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Log warnings
      validation.warnings.forEach(warning => {
        console.warn(`Service configuration warning: ${warning}`);
      });

      // Initialize services
      this.geminiService = new GeminiService();
      this.locationService = new LocationService();
      
      // Test service connectivity
      const healthCheck = await this.performHealthCheck();
      
      this.initialized = true;
      
      console.log('Services initialized successfully');
      return {
        success: true,
        services: {
          gemini: !!this.geminiService,
          location: !!this.locationService
        },
        health: healthCheck,
        warnings: validation.warnings
      };
    } catch (error) {
      console.error('Service initialization failed:', error);
      return {
        success: false,
        error: error.message,
        services: {
          gemini: false,
          location: false
        }
      };
    }
  }

  /**
   * Get Gemini AI service instance
   * @returns {GeminiService} Gemini service instance
   */
  getGeminiService() {
    if (!this.initialized) {
      throw new Error('Services not initialized. Call initialize() first.');
    }
    return this.geminiService;
  }

  /**
   * Get Location service instance
   * @returns {LocationService} Location service instance
   */
  getLocationService() {
    if (!this.initialized) {
      throw new Error('Services not initialized. Call initialize() first.');
    }
    return this.locationService;
  }

  /**
   * Perform health check on all services
   * @returns {Promise<Object>} Health check results
   */
  async performHealthCheck() {
    const health = {
      gemini: false,
      location: {
        nominatim: false,
        google: false,
        ipGeolocation: false
      },
      timestamp: new Date().toISOString()
    };

    try {
      // Check Gemini service (basic connectivity test)
      if (this.geminiService && this.config.gemini.apiKey && this.config.gemini.apiKey !== 'your_gemini_api_key_here') {
        // We can't easily test Gemini without making an actual API call
        // So we'll just check if the service is instantiated and has a valid API key
        health.gemini = true;
      }
    } catch (error) {
      console.warn('Gemini health check failed:', error.message);
    }

    try {
      // Check location services
      if (this.locationService) {
        const locationHealth = await this.locationService.getServiceHealth();
        health.location = locationHealth;
      }
    } catch (error) {
      console.warn('Location service health check failed:', error.message);
    }

    return health;
  }

  /**
   * Get service statistics
   * @returns {Object} Service statistics
   */
  getServiceStats() {
    return {
      initialized: this.initialized,
      services: {
        gemini: {
          available: !!this.geminiService,
          model: this.config.gemini.model,
          timeout: this.config.gemini.timeout,
          maxRetries: this.config.gemini.maxRetries
        },
        location: {
          available: !!this.locationService,
          timeout: this.config.location.timeout,
          maxRetries: this.config.location.maxRetries,
          services: Object.keys(this.config.location.services)
        }
      },
      config: {
        geminiConfigured: !!(this.config.gemini.apiKey && this.config.gemini.apiKey !== 'your_gemini_api_key_here'),
        geocodingConfigured: !!(this.config.location.geocodingApiKey && this.config.location.geocodingApiKey !== 'your_google_geocoding_api_key_here')
      }
    };
  }

  /**
   * Restart services (useful for configuration changes)
   * @returns {Promise<Object>} Restart results
   */
  async restart() {
    console.log('Restarting services...');
    
    // Reset services
    this.geminiService = null;
    this.locationService = null;
    this.initialized = false;
    
    // Reload configuration
    this.config = getConfig();
    
    // Reinitialize
    return await this.initialize();
  }

  /**
   * Graceful shutdown of services
   * @returns {Promise<void>}
   */
  async shutdown() {
    console.log('Shutting down services...');
    
    // Clean up any resources if needed
    this.geminiService = null;
    this.locationService = null;
    this.initialized = false;
    
    console.log('Services shut down successfully');
  }
}

// Create singleton instance
const serviceFactory = new ServiceFactory();

module.exports = serviceFactory;