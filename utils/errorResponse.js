/**
 * Custom error class for API responses
 * @extends Error
 */
class ErrorResponse extends Error {
    /**
     * Create a new ErrorResponse
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {Object} errors - Additional error details (optional)
     */
    constructor(message, statusCode, errors = null) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      this.success = false;
    }
  
    /**
     * Create a formatted response object
     * @returns {Object} - Formatted error response
     */
    toJSON() {
      const response = {
        success: this.success,
        error: this.message
      };
  
      if (this.errors) {
        response.errors = this.errors;
      }
  
      return response;
    }
  
    /**
     * Create a 400 Bad Request error
     * @param {string} message - Error message
     * @param {Object} errors - Validation errors (optional)
     * @returns {ErrorResponse} - Bad Request error
     */
    static badRequest(message = 'Bad Request', errors = null) {
      return new ErrorResponse(message, 400, errors);
    }
  
    /**
     * Create a 401 Unauthorized error
     * @param {string} message - Error message
     * @returns {ErrorResponse} - Unauthorized error
     */
    static unauthorized(message = 'Not authorized to access this route') {
      return new ErrorResponse(message, 401);
    }
  
    /**
     * Create a 403 Forbidden error
     * @param {string} message - Error message
     * @returns {ErrorResponse} - Forbidden error
     */
    static forbidden(message = 'Forbidden') {
      return new ErrorResponse(message, 403);
    }
  
    /**
     * Create a 404 Not Found error
     * @param {string} message - Error message
     * @returns {ErrorResponse} - Not Found error
     */
    static notFound(message = 'Resource not found') {
      return new ErrorResponse(message, 404);
    }
  
    /**
     * Create a 409 Conflict error
     * @param {string} message - Error message
     * @returns {ErrorResponse} - Conflict error
     */
    static conflict(message = 'Resource already exists') {
      return new ErrorResponse(message, 409);
    }
  
    /**
     * Create a 422 Unprocessable Entity error
     * @param {string} message - Error message
     * @param {Object} errors - Validation errors (optional)
     * @returns {ErrorResponse} - Unprocessable Entity error
     */
    static validationError(message = 'Validation error', errors = null) {
      return new ErrorResponse(message, 422, errors);
    }
  
    /**
     * Create a 500 Internal Server Error
     * @param {string} message - Error message
     * @returns {ErrorResponse} - Internal Server Error
     */
    static serverError(message = 'Server Error') {
      return new ErrorResponse(message, 500);
    }
  }
  
  module.exports = ErrorResponse;