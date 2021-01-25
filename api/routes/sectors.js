import express from 'express';
import { sqlInstance } from '../index.js';

export const routes = express.Router();

// Select all sectors
/**
 * @swagger
 *
 * /sectors:
 *   get:
 *     tags:
 *       - sectors
 *     produces:
 *       - application/json
 *     summary:
 *       - Get data from sectors
 *     responses:
 *      '200':
 *        description: Array of sectors
 */
routes.get('/sectors', (request, response) => {
  sqlInstance.request("SELECT * FROM SECTORS").then(result => {
    response.send(result);
  });
});

// Select selected sectors
// todo: check if it will be used
/**
 * @swagger
 *
 * /sectors/selected:
 *   get:
 *     tags:
 *       - sectors
 *     produces:
 *       - application/json
 *     summary:
 *       - Get a list of specific sectors
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sectors:
 *                type: array
 *            example:
 *              sectors: [1, 2, 3]
 *
 *     responses:
 *      '200':
 *        description: Array of sectors
 *
 *
 */
routes.get('/sectors/selected', (request, response) => {
  sqlInstance.request("SELECT * FROM SECTORS WHERE ID IN ?", [request.body.sectors]).then(result => {
    response.send(result);
  });
});
