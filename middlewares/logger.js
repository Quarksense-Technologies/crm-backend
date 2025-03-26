/**
 * Custom request logger middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logger = (req, res, next) => {
    // Get request method, protocol, host, and original URL
    const method = req.method;
    const protocol = req.protocol;
    const host = req.get('host');
    const url = req.originalUrl;
    const requestTime = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || 'Unknown';
    
    // Create log output
    const logOutput = `[${requestTime}] ${method} ${protocol}://${host}${url} - ${ip} - ${userAgent}`;
    
    // Log to console
    console.log(logOutput);
    
    // Add request time to request object
    req.requestTime = requestTime;
    
    // Continue with next middleware
    next();
  };
  
  module.exports = logger;