const axios = require('axios');

class LocationService {
  constructor() {
    this.geocodingApiKey = process.env.GEOCODING_API_KEY;
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 second
    this.timeout = 10000; // 10 seconds
    
    // Fallback geocoding services
    this.geocodingServices = [
      {
        name: 'OpenStreetMap Nominatim',
        url: 'https://nominatim.openstreetmap.org/reverse',
        requiresKey: false
      },
      {
        name: 'Google Geocoding',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        requiresKey: true
      }
    ];
  }

  /**
   * Reverse geocode coordinates to human-readable address
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} Address information
   */
  async reverseGeocode(latitude, longitude) {
    const startTime = Date.now();
    
    try {
      // Validate coordinates first
      if (!this.validateCoordinates(latitude, longitude)) {
        throw new Error('Invalid coordinates provided');
      }

      let result = null;
      let lastError = null;

      // Try each geocoding service
      for (const service of this.geocodingServices) {
        try {
          if (service.requiresKey && !this.geocodingApiKey) {
            continue; // Skip services that require API key if not available
          }

          result = await this.executeWithRetry(async () => {
            return await this.callGeocodingService(service, latitude, longitude);
          });

          if (result) {
            break; // Success, exit loop
          }
        } catch (error) {
          lastError = error;
          console.warn(`Geocoding service ${service.name} failed:`, error.message);
        }
      }

      if (!result) {
        throw lastError || new Error('All geocoding services failed');
      }

      const processingTime = Date.now() - startTime;
      
      return {
        ...result,
        processingTime,
        coordinates: { latitude, longitude }
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      const processingTime = Date.now() - startTime;
      
      return this.getFallbackLocationResponse(latitude, longitude, processingTime, error.message);
    }
  }

  /**
   * Validate coordinate values
   * @param {number} latitude - Latitude value
   * @param {number} longitude - Longitude value
   * @returns {boolean} True if coordinates are valid
   */
  validateCoordinates(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false;
    }
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return false;
    }
    
    // Check coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return false;
    }
    
    if (longitude < -180 || longitude > 180) {
      return false;
    }
    
    return true;
  }

  /**
   * Get approximate location from IP address (fallback method)
   * @param {string} ipAddress - Client IP address
   * @returns {Promise<Object>} Approximate location data
   */
  async getLocationFromIP(ipAddress) {
    const startTime = Date.now();
    
    try {
      // Use a free IP geolocation service
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`, {
        timeout: this.timeout,
        params: {
          fields: 'status,message,country,regionName,city,lat,lon,timezone'
        }
      });

      if (response.data.status === 'success') {
        const processingTime = Date.now() - startTime;
        
        return {
          address: {
            formatted: `${response.data.city}, ${response.data.regionName}, ${response.data.country}`,
            components: {
              city: response.data.city,
              state: response.data.regionName,
              country: response.data.country
            }
          },
          coordinates: {
            latitude: response.data.lat,
            longitude: response.data.lon
          },
          processingTime,
          source: 'ip-geolocation',
          accuracy: 'approximate'
        };
      } else {
        throw new Error(response.data.message || 'IP geolocation failed');
      }
    } catch (error) {
      console.error('IP geolocation failed:', error);
      const processingTime = Date.now() - startTime;
      
      return {
        address: {
          formatted: 'Location unavailable',
          components: {}
        },
        coordinates: null,
        processingTime,
        error: error.message,
        source: 'fallback'
      };
    }
  }

  /**
   * Call specific geocoding service
   * @param {Object} service - Service configuration
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} Geocoding result
   */
  async callGeocodingService(service, latitude, longitude) {
    if (service.name === 'OpenStreetMap Nominatim') {
      return await this.callNominatimService(latitude, longitude);
    } else if (service.name === 'Google Geocoding') {
      return await this.callGoogleGeocodingService(latitude, longitude);
    }
    
    throw new Error(`Unknown geocoding service: ${service.name}`);
  }

  /**
   * Call OpenStreetMap Nominatim service
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} Geocoding result
   */
  async callNominatimService(latitude, longitude) {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      timeout: this.timeout,
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        addressdetails: 1,
        zoom: 18
      },
      headers: {
        'User-Agent': 'CivicLens-App/1.0'
      }
    });

    if (response.data && response.data.address) {
      const addr = response.data.address;
      
      return {
        address: {
          formatted: response.data.display_name,
          components: {
            street: this.extractStreetAddress(addr),
            city: addr.city || addr.town || addr.village || addr.municipality,
            state: addr.state || addr.region,
            pincode: addr.postcode,
            country: addr.country,
            landmark: addr.amenity || addr.building
          }
        },
        source: 'nominatim',
        accuracy: 'high'
      };
    }
    
    throw new Error('No address data returned from Nominatim');
  }

  /**
   * Call Google Geocoding service
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} Geocoding result
   */
  async callGoogleGeocodingService(latitude, longitude) {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      timeout: this.timeout,
      params: {
        latlng: `${latitude},${longitude}`,
        key: this.geocodingApiKey,
        result_type: 'street_address|route|neighborhood|locality'
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const components = this.parseGoogleAddressComponents(result.address_components);
      
      return {
        address: {
          formatted: result.formatted_address,
          components: {
            street: components.street_number && components.route 
              ? `${components.street_number} ${components.route}` 
              : components.route,
            city: components.locality || components.sublocality,
            state: components.administrative_area_level_1,
            pincode: components.postal_code,
            country: components.country,
            landmark: components.establishment || components.point_of_interest
          }
        },
        source: 'google',
        accuracy: 'high'
      };
    }
    
    throw new Error(`Google Geocoding failed: ${response.data.status}`);
  }

  /**
   * Extract street address from Nominatim address object
   * @param {Object} addr - Address object from Nominatim
   * @returns {string} Street address
   */
  extractStreetAddress(addr) {
    const parts = [];
    
    if (addr.house_number) parts.push(addr.house_number);
    if (addr.road) parts.push(addr.road);
    if (!addr.road && addr.pedestrian) parts.push(addr.pedestrian);
    if (!addr.road && !addr.pedestrian && addr.footway) parts.push(addr.footway);
    
    return parts.join(' ') || addr.neighbourhood || addr.suburb;
  }

  /**
   * Parse Google address components into structured format
   * @param {Array} components - Google address components
   * @returns {Object} Parsed components
   */
  parseGoogleAddressComponents(components) {
    const parsed = {};
    
    components.forEach(component => {
      const types = component.types;
      const value = component.long_name;
      
      if (types.includes('street_number')) {
        parsed.street_number = value;
      } else if (types.includes('route')) {
        parsed.route = value;
      } else if (types.includes('locality')) {
        parsed.locality = value;
      } else if (types.includes('sublocality')) {
        parsed.sublocality = value;
      } else if (types.includes('administrative_area_level_1')) {
        parsed.administrative_area_level_1 = value;
      } else if (types.includes('postal_code')) {
        parsed.postal_code = value;
      } else if (types.includes('country')) {
        parsed.country = value;
      } else if (types.includes('establishment')) {
        parsed.establishment = value;
      } else if (types.includes('point_of_interest')) {
        parsed.point_of_interest = value;
      }
    });
    
    return parsed;
  }

  /**
   * Execute function with retry logic
   * @param {Function} fn - Function to execute
   * @returns {Promise} Result of function execution
   */
  async executeWithRetry(fn) {
    let lastError;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), this.timeout);
        });
        
        const result = await Promise.race([fn(), timeoutPromise]);
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt < this.maxRetries - 1) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          console.log(`Location service retry attempt ${attempt + 1} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Get fallback location response when geocoding fails
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {number} processingTime - Processing time
   * @param {string} errorMessage - Error message
   * @returns {Object} Fallback response
   */
  getFallbackLocationResponse(latitude, longitude, processingTime, errorMessage) {
    return {
      address: {
        formatted: `Coordinates: ${latitude}, ${longitude}`,
        components: {
          coordinates: `${latitude}, ${longitude}`
        }
      },
      coordinates: { latitude, longitude },
      processingTime,
      source: 'fallback',
      accuracy: 'coordinates-only',
      error: errorMessage,
      fallback: true
    };
  }

  /**
   * Format address components into a readable string
   * @param {Object} components - Address components
   * @returns {string} Formatted address
   */
  formatAddress(components) {
    const parts = [];
    
    if (components.street) parts.push(components.street);
    if (components.city) parts.push(components.city);
    if (components.state) parts.push(components.state);
    if (components.pincode) parts.push(components.pincode);
    if (components.country) parts.push(components.country);
    
    return parts.join(', ');
  }

  /**
   * Get service health status
   * @returns {Promise<Object>} Health status of location services
   */
  async getServiceHealth() {
    const health = {
      nominatim: false,
      google: false,
      ipGeolocation: false
    };

    try {
      // Test Nominatim
      await axios.get('https://nominatim.openstreetmap.org/reverse', {
        timeout: 5000,
        params: {
          format: 'json',
          lat: 0,
          lon: 0
        }
      });
      health.nominatim = true;
    } catch (error) {
      console.warn('Nominatim health check failed:', error.message);
    }

    try {
      // Test Google (if API key available)
      if (this.geocodingApiKey) {
        await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          timeout: 5000,
          params: {
            latlng: '0,0',
            key: this.geocodingApiKey
          }
        });
        health.google = true;
      }
    } catch (error) {
      console.warn('Google Geocoding health check failed:', error.message);
    }

    try {
      // Test IP geolocation
      await axios.get('http://ip-api.com/json/8.8.8.8', {
        timeout: 5000
      });
      health.ipGeolocation = true;
    } catch (error) {
      console.warn('IP geolocation health check failed:', error.message);
    }

    return health;
  }
}

module.exports = LocationService;