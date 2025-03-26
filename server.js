const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const config = require('config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Security middleware
app.use(helmet()); // Security headers

// CORS configuration
const corsOptions = config.get('cors');
app.use(cors(corsOptions));

// Rate limiting
if (config.get('app.env') === 'production') {
    // Get rate limiter configuration from config
    const rateLimiterConfig = config.get('security.rateLimiter');
    
    // Create rate limiter middleware
    const limiter = rateLimit({
      windowMs: rateLimiterConfig.windowMs, // Time window in milliseconds
      max: rateLimiterConfig.max, // Maximum number of requests in the time window
      message: {
        success: false,
        message: 'Too many requests, please try again later.'
      }
    });
    
    // Apply rate limiter to all routes
    app.use(limiter);
  }

// Body parser middleware
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan(config.get('logging.level')));

// Mount API routes
app.use('/api', require('./routes'));

// Setup Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: `${config.get('app.name')} API Documentation`,
  }));
  
  // Create a route to serve the OpenAPI spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: config.get('app.env') === 'development' ? err.message : undefined
  });
});

// Set port
const PORT = process.env.PORT || config.get('server.port');
const HOST = process.env.HOST || config.get('server.host');

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`
    ===================================================
    🚀 ${config.get('app.name')} v${config.get('app.version')}
    📡 Server running in ${config.get('app.env')} mode
    🔌 Connect to http://${HOST}:${PORT}
    ===================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app; // Export for testing