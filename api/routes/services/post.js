import { v4 as uuidv4 } from 'uuid';
import { sqlInstance } from '../../index.js';
import express from 'express';
import { checkToken } from '../security/security.js';

export const routes = express.Router();

/**
 * @swagger
 *
 * /services:
 *   post:
 *     tags:
 *       - services
 *     produces:
 *       - application/json
 *     summary:
 *       - Add a service to the database
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            applicant:
 *              type: string
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            sector:
 *              type: integer
 *            exchangeType:
 *              type: string
 *            token:
 *              type: string
 *            example:
 *              applicant: user Id
 *              title: string
 *              description: string
 *              sector: sector Id
 *              exchangeType: mutual, coin or both
 *              token: user token
 *     responses:
 *      '201':
 *        description: Posted
 *      '400':
 *        description: Bad parameters
 *      '403':
 *        description: Wrong token
 */
routes.post('/services', async (request, response) => {
  const params = request.body;
  const uuid = uuidv4();
  // Parameters check
  if(!params.applicant || !params.title || !params.description || !params.sector || !params.exchangeType || !params.localization || !params.token){
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }
  // Token check
  const properToken = await checkToken(params.token, params.applicant);
  if(!properToken){
    response.send('Wrong token');
    response.status(403).end();
    return;
  }
  // Do insertion
  const sql = "INSERT INTO SERVICES(ID, APPLICANT, TITLE, DESCRIPTION, SECTOR, EXCHANGE_TYPE, LOCALIZATION) VALUES(?, ?, ?, ?, ?, ?, ?)";
  sqlInstance.request(sql,
    [uuid,
      params.applicant,
      params.title,
      params.description,
      params.sector,
      params.exchangeType,
      params.localization]).then(result => {
    response.send("");
    response.status(201).end();
  });
});
