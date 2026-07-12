const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AssetFlow API Documentation',
    version: '1.0.0',
    description: 'Relational database asset catalog REST API endpoints. Secure requests using the Authorization header.',
    contact: {
      name: 'AssetFlow Support',
      email: 'support@assetflow.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Format: "Bearer {token}"'
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Targets JSDoc specs declared inside routes files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
