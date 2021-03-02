import express from 'express';
import { sqlInstance } from '../../index.js';
import { checkToken } from '../security/security.js';

export const routes = express.Router();

// Method DELETE for a user
/**
 * @swagger
 *
 * /users/{id}:
 *   delete:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Delete a user from the database (and his sectors and non solved services)
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            token:
 *              type: string
 *            example:
 *              token: string
 *     responses:
 *      '204':
 *        description: DELETED
 *      '400':
 *        description: Bad parameters
 *      '403':
 *        description: Unauthorized
 */
routes.delete('/users/:id', async (request, response) => {
  const { token } = request.body.data;

  if (!token) {
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }

  const properToken = await checkToken(token, request.params.id);
  if(!properToken){
    response.send('Wrong token');
    response.status(403).end();
    return;
  }

  try {
    // Delete users_sectors
    sqlInstance.request('DELETE FROM USERS_SECTORS WHERE ID_USER = ?', [request.params.id]);
    // Delete waiting services
    sqlInstance.request('DELETE FROM SERVICES WHERE APPLICANT = ? AND STATE != \'finished\'', [request.params.id]);
    // Delete user
    sqlInstance.request('DELETE FROM USERS WHERE ID = ?', [request.params.id, request.params.id]).then(result => {
      response.send('');
    });
  } catch (err) {
    throw new Error(err);
  }


});