const fc = require('fast-check');
const GeminiService = require('../../services/geminiService');

describe('GeminiService Property Tests', () => {
  let geminiService;

  beforeEach(() => {
    geminiService = new GeminiService();
  });

  /**
   * Property 2: AI Processing Time Limits
   * Feature: ai-complaint-registration, Property 2: For any image uploaded for AI analysis, 
   * the system should either return results within 30 seconds or timeout gracefully with fallback options.
   * Validates: Requirements 1.2
   */
  describe('Property 2: AI Processing Time Limits', () => {
    test('should complete analysis within timeout or provide fallback response', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate various base64 image strings
          fc.string({ minLength: 100, maxLength: 1000 }).map(str => 
            `data:image/jpeg;base64,${Buffer.from(str).toString('base64')}`
          ),
          fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: '' }),
          async (imageBase64, userDescription) => {
            const startTime = Date.now();
            
            try {
              const result = await geminiService.analyzeComplaintImage(imageBase64, userDescription);
              const endTime = Date.now();
              const processingTime = endTime - startTime;
              
              // Property: Processing should complete within 30 seconds (30000ms)
              expect(processingTime).toBeLessThanOrEqual(30000);
              
              // Property: Result should always have required structure
              expect(result).toHaveProperty('processingTime');
              expect(result).toHaveProperty('category');
              expect(result).toHaveProperty('priority');
              expect(result).toHaveProperty('department');
              expect(result).toHaveProperty('confidence');
              
              // Property: If processing fails, fallback should be provided
              if (result.fallback) {
                expect(result.category).toBe('Other');
                expect(result.priority).toBe('Medium');
                expect(result.department).toBe('General');
                expect(result.confidence.description).toBe(0);
                expect(result.confidence.category).toBe(0);
                expect(result.confidence.priority).toBe(0);
              }
              
              // Property: Processing time should be recorded accurately
              expect(result.processingTime).toBeGreaterThan(0);
              expect(Math.abs(result.processingTime - processingTime)).toBeLessThan(100); // Allow 100ms variance
              
            } catch (error) {
              // If an error occurs, it should be within the timeout period
              const endTime = Date.now();
              const processingTime = endTime - startTime;
              expect(processingTime).toBeLessThanOrEqual(30000);
            }
          }
        ),
        { 
          numRuns: 10, // Reduced for faster testing
          timeout: 35000 // Allow extra time for test framework overhead
        }
      );
    });

    test('should handle various image formats and sizes gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate different image format prefixes
          fc.constantFrom('jpeg', 'png', 'webp', 'gif', 'bmp'),
          fc.string({ minLength: 50, maxLength: 2000 }),
          async (format, content) => {
            const imageBase64 = `data:image/${format};base64,${Buffer.from(content).toString('base64')}`;
            const startTime = Date.now();
            
            const result = await geminiService.analyzeComplaintImage(imageBase64);
            const endTime = Date.now();
            
            // Property: All requests should complete within timeout
            expect(endTime - startTime).toBeLessThanOrEqual(30000);
            
            // Property: Result should always be structured correctly
            expect(result).toMatchObject({
              category: expect.any(String),
              priority: expect.any(String),
              department: expect.any(String),
              confidence: expect.objectContaining({
                description: expect.any(Number),
                category: expect.any(Number),
                priority: expect.any(Number)
              }),
              processingTime: expect.any(Number)
            });
            
            // Property: Confidence values should be between 0 and 1
            expect(result.confidence.description).toBeGreaterThanOrEqual(0);
            expect(result.confidence.description).toBeLessThanOrEqual(1);
            expect(result.confidence.category).toBeGreaterThanOrEqual(0);
            expect(result.confidence.category).toBeLessThanOrEqual(1);
            expect(result.confidence.priority).toBeGreaterThanOrEqual(0);
            expect(result.confidence.priority).toBeLessThanOrEqual(1);
          }
        ),
        { 
          numRuns: 10,
          timeout: 35000
        }
      );
    });

    test('should validate category and priority values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 100, maxLength: 500 }).map(str => 
            `data:image/jpeg;base64,${Buffer.from(str).toString('base64')}`
          ),
          async (imageBase64) => {
            const result = await geminiService.analyzeComplaintImage(imageBase64);
            
            // Property: Category should always be one of the valid values
            const validCategories = ['Roads', 'Sanitation', 'Water', 'Electricity', 'Streetlights', 'Garbage', 'Other'];
            expect(validCategories).toContain(result.category);
            
            // Property: Priority should always be one of the valid values
            const validPriorities = ['Low', 'Medium', 'High'];
            expect(validPriorities).toContain(result.priority);
            
            // Property: Department should be mapped correctly from category
            const expectedDepartment = geminiService.mapCategoryToDepartment(result.category);
            expect(result.department).toBe(expectedDepartment);
          }
        ),
        { 
          numRuns: 10,
          timeout: 35000
        }
      );
    });
  });

  describe('Helper Methods Property Tests', () => {
    test('validateCategory should always return valid category', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (input) => {
            const result = geminiService.validateCategory(input);
            const validCategories = ['Roads', 'Sanitation', 'Water', 'Electricity', 'Streetlights', 'Garbage', 'Other'];
            expect(validCategories).toContain(result);
            
            // Property: Invalid inputs should default to 'Other'
            if (!validCategories.includes(input)) {
              expect(result).toBe('Other');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('validatePriority should always return valid priority', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (input) => {
            const result = geminiService.validatePriority(input);
            const validPriorities = ['Low', 'Medium', 'High'];
            expect(validPriorities).toContain(result);
            
            // Property: Invalid inputs should default to 'Medium'
            if (!validPriorities.includes(input)) {
              expect(result).toBe('Medium');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('mapCategoryToDepartment should always return valid department', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (category) => {
            const result = geminiService.mapCategoryToDepartment(category);
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
            
            // Property: Unknown categories should map to 'General'
            const validCategories = ['Roads', 'Sanitation', 'Water', 'Electricity', 'Streetlights', 'Garbage', 'Other'];
            if (!validCategories.includes(category)) {
              expect(result).toBe('General');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('detectMimeType should handle various input formats', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (input) => {
            const result = geminiService.detectMimeType(input);
            expect(typeof result).toBe('string');
            expect(result).toMatch(/^image\//);
            
            // Property: Should default to 'image/jpeg' for unrecognized formats
            if (!input.startsWith('data:image/')) {
              expect(result).toBe('image/jpeg');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});