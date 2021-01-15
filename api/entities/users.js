import { app, sqlInstance } from '..';
import { v4 as uuidv4 } from 'uuid';
import { CryptoJS } from 'crypto-js';

// Method GET of all data of a user
/**
 * @swagger
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Get all data from a user
 *     responses:
 *      '200':
 *        description: A user and his sectors and services
 *
 *
 */
app.get('/users/:id', (request, response) => {
  // todo: don't retrieve tokens
  // Retrieve our Users, his sectors and services affiliated
  sqlInstance.request("SELECT * FROM USERS U, SECTORS S1, SERVICES S2 WHERE U.ID = ? " +
    "AND S1.ID IN (SELECT US.ID_SECTOR FROM USERS_SECTORS US WHERE US.ID_USER = ?) " +
    "AND (S2.APPLICANT = U.ID OR S2.WORKER = U.ID)"
    [request.params.id, request.params.id]).then(result => {
    response.send(result);
  });
});

// Method GET of all selected users data
/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     summary:
 *       - Get a list of users from the database
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ids:
 *                type: array
 *            example:
 *              ids: [1, 2, 3]
 *
 *     responses:
 *      '200':
 *        description: Array of users
 *
 *
 */
app.get('/users', (request, response) => {
  if(!request.body.ids){
    throw new Error('Error in parameters, ids missing');
  }
  sqlInstance.request("SELECT * FROM USERS WHERE ID IN ?", [request.body.ids]).then(result => {
    response.send(result);
  });
});

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
 *       - Delete a user from the database
 *     responses:
 *      '204':
 *        description: DELETED
 */
app.delete('/users/:id', (request, response) => {
  sqlInstance.request("DELETE FROM USERS WHERE ID = ?", [request.params.id]).then(result => {
    response.send("");
    response.status(204).end();
  });
});

// Method POST for a user
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
 *            sectors:
 *              type: array
 *            localization:
 *              type: string
 *            example:
 *              firstName: string
 *              lastName: string
 *              gender: male of female or other
 *              email: string
 *              password: string
 *              birthDate: Date
 *              phone: string
 *              sectors: array of ids
 *              localization: string
 *     responses:
 *      '201':
 *        description: Posted
 *
 *
 */
app.post('/users', (request, response) => {
  const params = request.body;
  const uuid = uuidv4();

  if(!params.firstName || !params.lastName || !params.gender || !params.email || !params.password || !params.birthDate || !params.phone || !params.sectors || !params.localization){
    throw new Error('Error in post parameters');
  }

  // Crypt password
  const token = CryptoJS.AES.encrypt(params.password, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41').toString();

  // Insert our user
  const sql = "INSERT INTO USERS(ID, FIRSTNAME, LASTNAME, GENDER, EMAIL, TOKEN, BIRTHDATE, PHONE, LOCALIZATION) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  sqlInstance.request(sql,
    [uuid,
    params.firstName,
    params.lastName,
    params.gender,
    params.email,
    token,
    params.birthDate,
    params.phone,
    params.localization]).then(result => {
    response.send("");
    response.status(201).end();
  });

  // Insert his sectors
  params.sectors.map(sector => {
    sqlInstance.request("INSERT INTO USERS_SECTORS(ID_SECTOR, ID_USER) VALUES (?, ?)", [sector, uuid]);
  })
});

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
app.put('/users/:id', (request, response) => {
  const params = request.body;
  if(!params.firstName || !params.lastName || !params.gender || !params.email || !params.phone || !params.sectors || !params.localization){
    throw new Error('Error in post parameters');
  }

  // Update our user
  const sql = "UPDATE USERS SET FIRSTNAME = ?, LASTNAME = ?, GENDER = ?, EMAIL = ?, PHONE = ?, LOCALIZATION = ? WHERE ID = ?";
  sqlInstance.request(sql,
    [
      params.firstName,
      params.lastName,
      params.gender,
      params.email,
      params.phone,
      params.localization,
      params.id]).then(result => {
    response.send("");
    response.status(200).end();
  });

  // Update his sectors
  params.sectors.map(sector => {
    if(sector.state == "delete"){
      sqlInstance.request("DELETE FROM USERS_SECTORS WHERE ID_SECTOR = ? AND ID_USER = ?", [sector.id, params.id]);
    }else if(sector.state == "add" ){
      sqlInstance.request("INSERT INTO USERS_SECTORS(ID_SECTOR, ID_USER) VALUES (?, ?)", [sector.id, params.id]);
    }
  })
});

// todo: method to change a password

// Method POST for a user
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
 *      '401':
 *        description: Fail
 */
app.post('/users/login', (request, response) => {
  const params = request.body;

  if(!params.email || !params.password ){
    throw new Error('Error in post parameters');
  }

  // Decrypt password
  const bytes  = CryptoJS.AES.decrypt(params.password, '22787802-a6e7-4c3d-8fc1-aab0ece1cb41');
  const token = bytes.toString(CryptoJS.enc.Utf8);

  // Select our user
  const sql = "SELECT TOKEN FROM USERS WHERE EMAIL = ? AND TOKEN = ? ";
  sqlInstance.request(sql,
    [params.email,
      token
      ]).then(result => {
        if(result != null){
          // Return result if login valid
          response.send(result);
          response.status(200).end();
        }else{
          // Return 401 if login failed
          response.send("");
          response.status(401).end();
        }
  });

  // Insert his sectors
  params.sectors.map(sector => {
    sqlInstance.request("INSERT INTO USERS_SECTORS(ID_SECTOR, ID_USER) VALUES (?, ?)", [sector, uuid]);
  })
});