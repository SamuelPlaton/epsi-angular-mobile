import express from 'express';
import { sqlInstance } from '../../index.js';
import { checkToken } from '../security/security.js';

export const routes = express.Router();

// Method PUT to modify a user
/**
 * @swagger
 *
 * /users/:id:
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
 *            localization:
 *              type: string
 *            token:
 *              type: string
 *            example:
 *              firstName: string
 *              lastName: string
 *              gender: male of female or other
 *              email: string
 *              phone: string
 *              localization: string
 *              token: string
 *     responses:
 *      '200':
 *        description: Updated
 *     '400':
 *        description: Bad parameters
 *     '403':
 *        description: Unauthorized
 *
 */
routes.put('/users/:id', async (request, response) => {
  const params = request.body;
  if (!params.firstName || !params.lastName || !params.gender || !params.birthDate || !params.email || !params.localization || !params.token) {
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }

  const properToken = await checkToken(params.token, request.params.id);
  if(!properToken){
    response.send('Wrong token');
    response.status(403).end();
    return;
  }

  // Update our user
  const sql = 'UPDATE USERS SET FIRSTNAME = ?, LASTNAME = ?, GENDER = ?, BIRTH_DATE = ?, EMAIL = ?, PHONE = ?, LOCALIZATION = ? WHERE ID = ?';
  sqlInstance.request(sql,
    [
      params.firstName,
      params.lastName,
      params.gender,
      params.birthDate,
      params.email,
      params.phone,
      params.localization,
      request.params.id]).then(result => {
    response.send('');
    response.status(200).end();
  });
});

// Method PUT to modify a user sectors
/**
 * @swagger
 *
 * /users/sectors/:id:
 *   put:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Update user sectors to the database
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            sectors:
 *              type: array
 *            token:
 *              type: string
 *            example:
 *              sectors: ["1", "2", "3"]
 *              token: string
 *     responses:
 *      '200':
 *        description: Updated
 *      '400':
 *        description: Bad parameters
 *      '403':
 *        description: Unauthorized
 *
 */
routes.put('/users/sectors/:id', async (request, response) => {
  const params = request.body;

  if (!params.sectors || !params.token) {
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }

  const properToken = await checkToken(params.token, request.params.id);
  if(!properToken){
    response.send('Wrong token');
    response.status(403).end();
    return;
  }

  // delete users sectors
  await sqlInstance.request('DELETE FROM USERS_SECTORS WHERE ID_USER = ?', [request.params.id]);

  // add users sectors
  params.sectors.map(sector => {
      sqlInstance.request('INSERT INTO USERS_SECTORS(ID_SECTOR, ID_USER) VALUES (?, ?)', [sector, request.params.id]);
  });
  response.send('');
  response.status(200).end();
});

// todo: method to change a password