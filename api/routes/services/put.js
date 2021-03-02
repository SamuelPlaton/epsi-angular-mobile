import { sqlInstance } from '../../index.js';
import express from 'express';
import { checkToken } from '../security/security.js';

export const routes = express.Router();

/**
 * @swagger
 *
 * /services/{id}:
 *   put:
 *     tags:
 *       - services
 *     produces:
 *       - application/json
 *     summary:
 *       - Update a service to the database
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            userId:
 *              type: string
 *            userToken:
 *              type: string
 *            worker:
 *              type: string
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            sector:
 *              type: integer
 *            exchangeType:
 *              type: string
 *            state:
 *              type: string
 *            example:
 *              userId: user Id
 *              userToken: user Token
 *              worker: worker id (optional)
 *              title: string
 *              description: string (optional)
 *              sector: sector Id
 *              exchangeType: mutual, coin or both
 *              state: waiting, in progress, finished or canceled
 *     responses:
 *      '200':
 *        description: Updated
 *      '400':
 *        description: Bad parameters
 *      '403':
 *        description: Wrong token
 */
routes.put('/services/:id', async (request, response) => {
  const {worker, title, description, state, sector, exchangeType, localization, userId, userToken} = request.body.data;
  if(!title || !description || !state || !sector || !exchangeType || !localization || !userId || !userToken){
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }
  // Token check
  const properToken = await checkToken(userToken, userId);
  if(!properToken){
    response.send('Wrong token');
    response.status(403).end();
    return;
  }

  const sql = "UPDATE SERVICES SET WORKER = ?, TITLE = ?, DESCRIPTION = ?, STATE = ?, SECTOR = ?, EXCHANGE_TYPE = ?, LOCALIZATION = ? WHERE ID = ?";
  sqlInstance.request(sql,
    [
      worker,
      title,
      description,
      state,
      sector,
      exchangeType,
      localization,
      request.params.id]).then(result => {
    response.send("");
    response.status(200).end();
  });
});