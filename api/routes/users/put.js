import express from 'express';
import { sqlInstance } from '../../index.js';

export const routes = express.Router();

// Method PUT to modify a user
/**
 * @swagger
 *
 * /users:
 *   put:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Update a user to the database
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            gender:
 *              type: string
 *            email:
 *              type: string
 *            phone:
 *              type: string
 *            sectors:
 *              type: array
 *            localization:
 *              type: string
 *            example:
 *              firstName: string
 *              lastName: string
 *              gender: male of female or other
 *              email: string
 *              phone: string
 *              sectors: array of object containing state (delete or add) and a id
 *              localization: string
 *     responses:
 *      '200':
 *        description: Updated
 *
 *
 */
// todo: check && token security
routes.put('/users/:id', (request, response) => {
  const params = request.body;
  if (!params.firstName || !params.lastName || !params.gender || !params.email || !params.phone || !params.sectors || !params.localization) {
    throw new Error('Error in post parameters');
  }

  // Update our user
  const sql = 'UPDATE USERS SET FIRSTNAME = ?, LASTNAME = ?, GENDER = ?, EMAIL = ?, PHONE = ?, LOCALIZATION = ? WHERE ID = ?';
  sqlInstance.request(sql,
    [
      params.firstName,
      params.lastName,
      params.gender,
      params.email,
      params.phone,
      params.localization,
      params.id]).then(result => {
    response.send('');
    response.status(200).end();
  });

  // Update his sectors
  params.sectors.map(sector => {
    if (sector.state == 'delete') {
      sqlInstance.request('DELETE FROM USERS_SECTORS WHERE ID_SECTOR = ? AND ID_USER = ?', [sector.id, params.id]);
    } else if (sector.state == 'add') {
      sqlInstance.request('INSERT INTO USERS_SECTORS(ID_SECTOR, ID_USER) VALUES (?, ?)', [sector.id, params.id]);
    }
  });
});

// todo: route for user sectors especially && token security

// todo: method to change a password && token security