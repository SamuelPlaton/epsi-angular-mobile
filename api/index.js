import SQLInstance from './SQLInstance.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { routes as sectorRouter } from './routes/sectors.js';
import { routes as serviceRouter } from './routes/services.js';
import { routes as userRouter } from './routes/users.js';

// Enable .env config variables
dotenv.config();
// Setup our sql instance
export const sqlInstance = new SQLInstance(process.env.API_HOST, process.env.API_PORT, process.env.API_USER, process.env.API_PASSWORD, process.env.API_DATABASE);
sqlInstance.connect();

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
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

// Create our express App
export const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', sectorRouter);
app.use('/', serviceRouter);
app.use('/', userRouter);

// Make our app listen to port 3000
app.listen(3000);

