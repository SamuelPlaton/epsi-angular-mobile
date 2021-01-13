import SQLInstance from './SQLInstance.js';
import express from 'express';

// Create our express App
export const app = express();
app.use(express.json());

// Create our SQL Instance, then connect us to it
export const sqlInstance = new SQLInstance("localhost", "root", "", "troc");
sqlInstance.connect();

// Make our app listen to port 3000
app.listen(3000);
