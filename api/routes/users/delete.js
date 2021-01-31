import express from 'express';
import { sqlInstance } from '../../index.js';

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
 *     responses:
 *      '204':
 *        description: DELETED
 */
// todo: token security
routes.delete('/users/:id', (request, response) => {
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