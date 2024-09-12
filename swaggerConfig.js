const swaggerJsdoc = require('swagger-jsdoc');
const { config } = require('./config/config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KADA APP',
      version: '1.0.0',
      description: 'API documentation for KADA',
    },
    servers: [
      {
        url: config.BASEURL || "http://localhost:3000/",
        description: 'Development server',
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./swaggerRoutes/*.js'], // Ensure this path matches your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
