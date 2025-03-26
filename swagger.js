const swaggerJsDoc = require('swagger-jsdoc');
const config = require('config');

// Swagger Options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.get('app.name') || 'S-Gen CRM & Accounting System API',
      version: config.get('app.version') || '1.0.0',
      description: 'API documentation for the S-Gen CRM & Accounting System',
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
      contact: {
        name: 'API Support',
        url: 'https://your-domain.com/support',
        email: 'support@your-domain.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.your-domain.com/api' 
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                    example: 'Field is required',
                  },
                  param: {
                    type: 'string',
                    example: 'name',
                  },
                  location: {
                    type: 'string',
                    example: 'body',
                  },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'employee', 'accountant'],
              example: 'admin',
            },
            dob: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
        },
        Company: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            name: {
              type: 'string',
              example: 'Sample Company',
            },
            registrationNumber: {
              type: 'string',
              example: 'REG12345',
            },
            address: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  example: '123 Main St',
                },
                city: {
                  type: 'string',
                  example: 'Sample City',
                },
                state: {
                  type: 'string',
                  example: 'Sample State',
                },
                zip: {
                  type: 'string',
                  example: '12345',
                },
                country: {
                  type: 'string',
                  example: 'Sample Country',
                },
              },
            },
            contact: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                  example: '123-456-7890',
                },
                email: {
                  type: 'string',
                  example: 'contact@company.com',
                },
                website: {
                  type: 'string',
                  example: 'www.company.com',
                },
              },
            },
            createdBy: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            projectId: {
              type: 'string',
              example: 'PROJ12345',
            },
            name: {
              type: 'string',
              example: 'Sample Project',
            },
            description: {
              type: 'string',
              example: 'A sample project',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2023-12-31',
            },
            status: {
              type: 'string',
              enum: ['active', 'pending', 'completed'],
              example: 'active',
            },
            company: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdBy: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
        },
        Expense: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            expenseId: {
              type: 'string',
              example: 'EXP12345',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2023-01-15',
            },
            amount: {
              type: 'number',
              example: 1500,
            },
            description: {
              type: 'string',
              example: 'Office supplies',
            },
            category: {
              type: 'string',
              enum: ['office', 'travel', 'supplies', 'equipment', 'salary', 'misc'],
              example: 'office',
            },
            referenceId: {
              type: 'string',
              example: 'INV12345',
            },
            project: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            company: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdBy: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            paymentId: {
              type: 'string',
              example: 'PAY12345',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2023-01-20',
            },
            amount: {
              type: 'number',
              example: 5000,
            },
            receivedFrom: {
              type: 'string',
              example: 'Client A',
            },
            reference: {
              type: 'string',
              example: 'INV54321',
            },
            description: {
              type: 'string',
              example: 'Initial payment',
            },
            project: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            company: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdBy: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
        },
        Manpower: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            role: {
              type: 'string',
              example: 'Developer',
            },
            hoursWorked: {
              type: 'number',
              example: 160,
            },
            wageRate: {
              type: 'number',
              example: 25,
            },
            totalPayable: {
              type: 'number',
              example: 4000,
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2023-01-31',
            },
            project: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            company: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdBy: {
              type: 'string',
              example: '60c72b2f9b1e8a001f3e5d4c',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './controllers/*.js',
    './routes/api/*.js',
    './models/*.js',
  ],
};

// Initialize Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;