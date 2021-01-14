import SQLInstance from './SQLInstance.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Define our swagger doc
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Api Documentation',
      description: 'This is our Angular App Mobile api doc',
      version: '1.0.0',
    },
  },
  apis: ['./entities/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);


// Create our express App
export const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Create our SQL Instance, then connect us to it
export const sqlInstance = new SQLInstance("localhost", "root", "", "compta");
sqlInstance.connect();

// Make our app listen to port 3000
app.listen(3000);
