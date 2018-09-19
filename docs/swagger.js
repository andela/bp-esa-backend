const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

dotenv.config();

// Swagger definition
const swaggerDefinition = {
  info: {
    title: 'REST API for Engagement Support Automation',
    version: '0.0.1',
    description: 'This is the REST API for Authors Haven',
  },
  host: process.env.DOC_HOST,
  // basePath: '/api',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: [
    './docs/**/*.yaml',
  ],
};
// initialize swagger-jsdoc
export default swaggerJSDoc(options);
