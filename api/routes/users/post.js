import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import cryptoJS from 'crypto-js';
import { sqlInstance } from '../../index.js';

export const routes = express.Router();

//Method POST for a user
/**
 * @swagger
 *
 * /users:
 *   post:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Add a user to the database
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
 *            password:
 *              type: string
 *            birthDate:
 *              type: string
 *            phone:
 *              type: string
 *            example:
 *              firstName: string
 *              lastName: string
 *              gender: male of female or other
 *              email: string
 *              password: string
 *              birthDate: Date
 *              phone: string optional
 *     responses:
 *      '201':
 *        description: Posted
 *      '403':
 *        description: Email or phone already exist
 *
 */
routes.post('/users', async (request, response) => {
  const params = request.body;
  const uuid = uuidv4();

  if (!params.firstName || !params.lastName || !params.gender || !params.email || !params.password || !params.birthDate) {
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }
  // Crypt password
  const token = cryptoJS.AES.encrypt(params.password, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41').toString();

  // Check if email or phone already exist
  const emailExist = await sqlInstance.request('SELECT * FROM USERS WHERE EMAIL = ?', [params.email]).then(result => {
    return result.length > 0;
  });
  const phoneExist = await sqlInstance.request('SELECT * FROM USERS WHERE PHONE = ?', [params.phone]).then(result => {
    return result.length > 0;
  });
  if(emailExist || phoneExist){
    emailExist && response.send('Email already exist');
    !emailExist && phoneExist && response.send('Phone already exist');
    response.status(403).end();
    return;
  }

  // Insert our user
  const sql = 'INSERT INTO USERS(ID, FIRSTNAME, LASTNAME, GENDER, EMAIL, TOKEN, BIRTH_DATE, PHONE) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
  sqlInstance.request(sql,
    [uuid,
      params.firstName,
      params.lastName,
      params.gender,
      params.email,
      token,
      params.birthDate,
      params.phone]).then(result => {
    response.send(token);
    response.status(201).end();
  });

});

// Method POST for a user login
/**
 * @swagger
 *
 * /users/login:
 *   post:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Login a user
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *            example:
 *              email: string
 *              password: string
 *     responses:
 *      '200':
 *        description: Success
 *      '400':
 *        description: Bad parameters
 *      '403':
 *        description: Wrong email or password
 */
routes.post('/users/login', async (request, response) => {
  const params = request.body;

  if (!params.email || !params.password) {
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }
  // Retrieve token if the email is found
  const tokenResult = await sqlInstance.request("SELECT TOKEN FROM USERS WHERE EMAIL = ? LIMIT 1",
    [params.email]).then(result => {
    return result;
  });
  if (tokenResult.length === 0) {
    response.send('Email not found');
    response.status(403).end();
    return;
  }

  // Encrypt then decrypt password
  const pwdToToken = cryptoJS.AES.encrypt(params.password, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41');
  const pwd = cryptoJS.AES.decrypt(pwdToToken, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41').toString();
  // Decrypt DB Token
  const tokenToPwd = cryptoJS.AES.decrypt(tokenResult[0]['TOKEN'], '22787802-a6e7-4c3d-8fc1-aab0ece1cb41').toString();
  // Handle connexion success or failure
  if(pwd === tokenToPwd){
    response.send(tokenResult[0]['TOKEN']);
    response.status(200).end();
  }else{
    response.send('Wrong password');
    response.status(403).end();
  }
});