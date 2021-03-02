import express from 'express';
import { sqlInstance } from '../../index.js';
import { checkToken } from '../security/security.js';
import cryptoJS from "crypto-js";

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
 *            token:
 *              type: string
 *            example:
 *              firstName: string
 *              lastName: string
 *              gender: male of female or other
 *              email: string
 *              phone: string
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
  if (!params.firstName || !params.lastName || !params.gender || !params.birthDate || !params.email || !params.token) {
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

  // Check if email or phone already exist
  const emailExist = await sqlInstance.request('SELECT * FROM USERS WHERE EMAIL = ? AND ID != ?', [params.email, request.params.id]).then(result => {
    return result.length > 0;
  });
  const phoneExist = await sqlInstance.request('SELECT * FROM USERS WHERE PHONE = ? AND ID != ?', [params.phone, request.params.id]).then(result => {
    return result.length > 0;
  });
  if(emailExist || phoneExist){
    emailExist && response.send('Email already exist');
    !emailExist && phoneExist && response.send('Phone already exist');
    response.status(403).end();
    return;
  }

  // Update our user
  const sql = 'UPDATE USERS SET FIRSTNAME = ?, LASTNAME = ?, GENDER = ?, BIRTH_DATE = ?, EMAIL = ?, PHONE = ? WHERE ID = ?';
  sqlInstance.request(sql,
    [
      params.firstName,
      params.lastName,
      params.gender,
      params.birthDate,
      params.email,
      params.phone,
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

// Method PUT to modify a password user
/**
 * @swagger
 *
 * /users/password/:id:
 *   put:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Update a user password to the database
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            previousPassword:
 *              type: string
 *            newPassword:
 *            token:
 *              type: string
 *            example:
 *              previousPassword: string
 *              newPassword: string
 *              token: string
 *     responses:
 *      '200':
 *        description: Password Updated
 *     '400':
 *        description: Bad parameters
 *     '403':
 *        description: Unauthorized
 *
 */
routes.put('/users/password/:id', async (request, response) => {
  const params = request.body;
  if (!params.previousPassword || !params.newPassword || !params.token) {
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

  // Encrypt old password and compare it to token
  const pwdToToken = cryptoJS.AES.encrypt(params.previousPassword, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41');
  const pwd = cryptoJS.AES.decrypt(pwdToToken, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41').toString();
  // Decrypt DB Token
  const tokenToPwd = cryptoJS.AES.decrypt(params.token, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41').toString();

  if(pwd !== tokenToPwd){
    response.send('Wrong previous password');
    response.status(403).end();
    return;
  }
  // Crypt new password
  const newToken = cryptoJS.AES.encrypt(params.newPassword, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41').toString();

  // Update our user
  const sql = 'UPDATE USERS SET TOKEN = ? WHERE ID = ?';
  sqlInstance.request(sql,
      [
        newToken,
        request.params.id]).then(result => {
    response.send(newToken);
    response.status(200).end();
  });
});