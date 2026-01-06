const { GoogleGenerativeAI } = require('@google/generative-ai');

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

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 second
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Analyze complaint image and generate description, category, and priority
   * @param {string} imageBase64 - Base64 encoded image
   * @param {string} userDescription - Optional user-provided description
   * @returns {Promise<Object>} Analysis results with description, category, priority, confidence, and processingTime
   */
  async analyzeComplaintImage(imageBase64, userDescription = '') {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildAnalysisPrompt(userDescription);
      const imagePart = this.prepareImagePart(imageBase64);
      
      const result = await this.executeWithRetry(async () => {
        return await this.model.generateContent([prompt, imagePart]);
      });

      const response = await result.response;
      const text = response.text();
      
      const analysis = this.parseAnalysisResponse(text);
      const processingTime = Date.now() - startTime;
      
      return {
        ...analysis,
        processingTime,
        aiServiceVersion: 'gemini-2.5-flash'
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('Gemini AI analysis failed:', error);
      
      return this.getFallbackResponse(processingTime, error.message);
    }
  }

  /**
   * Generate description from image only
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Promise<Object>} Description and confidence
   */
  async generateDescription(imageBase64) {
    const startTime = Date.now();
    
    try {
      const prompt = `Analyze this image of a civic issue and provide a clear, detailed description of what you see. 
      Focus on the specific problem, location details, and any relevant context that would help municipal authorities understand and address the issue.
      Respond with only the description text, no additional formatting.`;
      
      const imagePart = this.prepareImagePart(imageBase64);
      
      const result = await this.executeWithRetry(async () => {
        return await this.model.generateContent([prompt, imagePart]);
      });

      const response = await result.response;
      const description = response.text().trim();
      
      return {
        description,
        confidence: 0.8, // Default confidence for description generation
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Description generation failed:', error);
      return {
        description: '',
        confidence: 0,
        processingTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Categorize complaint based on description and image
   * @param {string} description - Complaint description
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Promise<Object>} Category, department, priority, and confidence
   */
  async categorizeComplaint(description, imageBase64) {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildCategorizationPrompt(description);
      const imagePart = this.prepareImagePart(imageBase64);
      
      const result = await this.executeWithRetry(async () => {
        return await this.model.generateContent([prompt, imagePart]);
      });

      const response = await result.response;
      const text = response.text();
      
      const categorization = this.parseCategorizationResponse(text);
      
      return {
        ...categorization,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Categorization failed:', error);
      return {
        category: 'Other',
        department: 'General',
        priority: 'Medium',
        confidence: {
          category: 0,
          priority: 0
        },
        processingTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Execute function with retry logic and exponential backoff
   * @param {Function} fn - Function to execute
   * @returns {Promise} Result of function execution
   */
  async executeWithRetry(fn) {
    let lastError;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        // Set timeout for the operation
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), this.timeout);
        });
        
        const result = await Promise.race([fn(), timeoutPromise]);
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt < this.maxRetries - 1) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          console.log(`Retry attempt ${attempt + 1} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Build analysis prompt for comprehensive complaint analysis
   * @param {string} userDescription - Optional user description
   * @returns {string} Formatted prompt
   */
  buildAnalysisPrompt(userDescription) {
    return `Analyze this image of a civic complaint and provide a comprehensive analysis in the following JSON format:
    {
      "description": "Detailed description of the issue visible in the image",
      "title": "Brief title summarizing the issue",
      "category": "One of: Roads, Sanitation, Water, Electricity, Streetlights, Garbage, Other",
      "priority": "One of: Low, Medium, High",
      "department": "One of: WASTE_MANAGEMENT, ROAD_INFRASTRUCTURE, STREETLIGHT_ELECTRICAL, WATER_SEWERAGE, SANITATION_PUBLIC_HEALTH, PARKS_GARDENS, ENCROACHMENT, TRAFFIC_SIGNAGE, GENERAL",
      "confidence": {
        "description": 0.0-1.0,
        "category": 0.0-1.0,
        "priority": 0.0-1.0
      },
      "metadata": {
        "detectedObjects": ["list", "of", "objects"],
        "sceneDescription": "Overall scene description",
        "issueType": "Type of civic issue identified"
      }
    }

    ${userDescription ? `Additional context from user: ${userDescription}` : ''}
    
    Guidelines:
    - Be specific and factual in descriptions
    - Consider severity when assigning priority
    - Use confidence scores to indicate certainty
    - Respond with valid JSON only`;
  }

  /**
   * Build categorization prompt
   * @param {string} description - Complaint description
   * @returns {string} Formatted prompt
   */
  buildCategorizationPrompt(description) {
    return `Based on this complaint description and image, categorize the issue:
    
    Description: ${description}
    
    Respond in JSON format:
    {
      "category": "One of: Roads, Sanitation, Water, Electricity, Streetlights, Garbage, Other",
      "department": "One of: WASTE_MANAGEMENT, ROAD_INFRASTRUCTURE, STREETLIGHT_ELECTRICAL, WATER_SEWERAGE, SANITATION_PUBLIC_HEALTH, PARKS_GARDENS, ENCROACHMENT, TRAFFIC_SIGNAGE, GENERAL",
      "priority": "One of: Low, Medium, High",
      "confidence": {
        "category": 0.0-1.0,
        "priority": 0.0-1.0
      }
    }
    
    Department mapping hints:
    - Roads/holes/potholes -> ROAD_INFRASTRUCTURE
    - Streetlights/electrical -> STREETLIGHT_ELECTRICAL
    - Garbage/waste -> WASTE_MANAGEMENT
    - Water/leak/sewer -> WATER_SEWERAGE
    - Sanitation/health/hygiene -> SANITATION_PUBLIC_HEALTH
    - Parks/greenery/trees -> PARKS_GARDENS
    - Encroachment/illegal stall -> ENCROACHMENT
    - Traffic signs/signals -> TRAFFIC_SIGNAGE
    - Otherwise -> GENERAL`;
  }

  /**
   * Prepare image part for Gemini API
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Object} Image part object
   */
  prepareImagePart(imageBase64) {
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    return {
      inlineData: {
        data: base64Data,
        mimeType: this.detectMimeType(imageBase64)
      }
    };
  }

  /**
   * Detect MIME type from base64 string
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {string} MIME type
   */
  detectMimeType(imageBase64) {
    if (imageBase64.startsWith('data:image/')) {
      const match = imageBase64.match(/data:image\/([a-z]+);base64,/);
      if (match) {
        return `image/${match[1]}`;
      }
    }
    
    // Default to JPEG if unable to detect
    return 'image/jpeg';
  }

  /**
   * Parse analysis response from Gemini
   * @param {string} text - Response text
   * @returns {Object} Parsed analysis
   */
  parseAnalysisResponse(text) {
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      const category = this.validateCategory(parsed.category);
      const priority = this.validatePriority(parsed.priority);
      const department = this.normalizeDepartment(parsed.department, category);

      return {
        description: parsed.description || '',
        title: parsed.title || '',
        category,
        priority,
        department,
        confidence: {
          description: Math.min(Math.max(parsed.confidence?.description || 0.5, 0), 1),
          category: Math.min(Math.max(parsed.confidence?.category || 0.5, 0), 1),
          priority: Math.min(Math.max(parsed.confidence?.priority || 0.5, 0), 1)
        },
        metadata: parsed.metadata || {}
      };
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Parse categorization response
   * @param {string} text - Response text
   * @returns {Object} Parsed categorization
   */
  parseCategorizationResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      const category = this.validateCategory(parsed.category);
      const priority = this.validatePriority(parsed.priority);
      const department = this.normalizeDepartment(parsed.department, category);

      return {
        category,
        department,
        priority,
        confidence: {
          category: Math.min(Math.max(parsed.confidence?.category || 0.5, 0), 1),
          priority: Math.min(Math.max(parsed.confidence?.priority || 0.5, 0), 1)
        }
      };
    } catch (error) {
      console.error('Failed to parse categorization response:', error);
      return {
        category: 'Other',
        department: 'General',
        priority: 'Medium',
        confidence: { category: 0, priority: 0 }
      };
    }
  }

  /**
   * Validate category against allowed values
   * @param {string} category - Category to validate
   * @returns {string} Valid category
   */
  validateCategory(category) {
    const validCategories = ['Roads', 'Sanitation', 'Water', 'Electricity', 'Streetlights', 'Garbage', 'Other'];
    return validCategories.includes(category) ? category : 'Other';
  }

  /**
   * Validate priority against allowed values
   * @param {string} priority - Priority to validate
   * @returns {string} Valid priority
   */
  validatePriority(priority) {
    const validPriorities = ['Low', 'Medium', 'High'];
    return validPriorities.includes(priority) ? priority : 'Medium';
  }

  /**
   * Normalize department to allowed enum with fallback to category mapping
   * @param {string} department - Department to normalize
   * @param {string} category - Category context for fallback
   * @returns {string} Normalized department
   */
  normalizeDepartment(department, category) {
    const fallback = this.mapCategoryToDepartment(category);
    if (!department) {
      return fallback;
    }

    const normalized = department
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

    return fallback;
  }

  /**
   * Map category to department
   * @param {string} category - Complaint category
   * @returns {string} Department name
   */
  mapCategoryToDepartment(category) {
    const mapping = {
      'roads': 'ROAD_INFRASTRUCTURE',
      'sanitation': 'SANITATION_PUBLIC_HEALTH',
      'water': 'WATER_SEWERAGE',
      'electricity': 'STREETLIGHT_ELECTRICAL',
      'streetlights': 'STREETLIGHT_ELECTRICAL',
      'garbage': 'WASTE_MANAGEMENT',
      'other': 'GENERAL'
    };
    const key = (category || '').toString().trim().toLowerCase();
    return mapping[key] || 'GENERAL';
  }

  /**
   * Get fallback response when AI processing fails
   * @param {number} processingTime - Time taken for processing
   * @param {string} errorMessage - Error message
   * @returns {Object} Fallback response
   */
  getFallbackResponse(processingTime, errorMessage) {
    return {
      description: '',
      title: '',
      category: 'Other',
      priority: 'Medium',
      department: 'GENERAL',
      confidence: {
        description: 0,
        category: 0,
        priority: 0
      },
      processingTime,
      aiServiceVersion: 'gemini-1.5-flash',
      error: errorMessage,
      fallback: true
    };
  }

  /**
   * Get default analysis when parsing fails
   * @returns {Object} Default analysis
   */
  getDefaultAnalysis() {
    return {
      description: '',
      title: '',
      category: 'Other',
      priority: 'Medium',
      department: 'GENERAL',
      confidence: {
        description: 0,
        category: 0,
        priority: 0
      },
      metadata: {}
    };
  }
}

module.exports = GeminiService;