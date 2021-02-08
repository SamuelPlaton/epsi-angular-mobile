import { sqlInstance } from '../../index.js';
import { getDistanceFromLatLonInKm } from '../../helpers/distance.js';
import express from 'express';

export const routes = express.Router();


// Method GET of user recommended services
/**
 * @swagger
 *
 * /services/recommended:
 *   get:
 *     tags:
 *       - services
 *     produces:
 *       - application/json
 *     summary:
 *       - Get a list of recommended services (by state, sector and localization)
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sectorIds:
 *                type: array
 *              localization:
 *                type: string
 *              maxDistance:
 *                type: integer
 *            example:
 *              sectorIds: [1, 2, 3]
 *              localization: string
 *              maxDistance: int in km
 *
 *     responses:
 *      '200':
 *        description: Array of recommended services
 *      '400':
 *        description: Bad parameters
 *
 *
 */
routes.get('/services/recommended', (request, response) => {
  // Throw error if parameters are missing
  const params = request.body;
  if(!params.sectorIds || !params.localization || !params.maxDistance ){
    response.send('Bad parameters');
    response.status(400).end();
    return;
  }
  // Retrieve user localization
  const [ userLocX, userLocY ] = params.localization.split(",");
  // Start our request
  const closeServices = [];
  sqlInstance.request("SELECT * FROM SERVICES WHERE STATE = 'waiting' AND SECTOR IN (?) AND WORKER IS NULL",
      [params.sectorIds]).then(result => {
    result.map(service => {
      // Retrieve service localization
      const [ serviceLocX, serviceLocY ]= service.localization.split(",");
      // Get service distance
      const d = getDistanceFromLatLonInKm(parseFloat(userLocX), parseFloat(userLocY), parseFloat(serviceLocX), parseFloat(serviceLocY));
      // If distance is less than the max, we retrieve the service
      if (d <= params.maxDistance){
        closeServices.push(service);
      }
    });
    // Send all closes services
    response.send(closeServices);
  });
});

/**
 * @swagger
 *
 * /services/{id}:
 *   get:
 *     tags:
 *       - services
 *     produces:
 *       - application/json
 *     summary:
 *       - Get all data from a service
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *            serviceApplicant:
 *              type: string
 *            serviceWorker:
 *              type: string
 *            serviceSector:
 *              type: string
 *            example:
 *              serviceApplicant: true
 *              serviceWorker: true
 *              serviceSector: true
 *     responses:
 *      '200':
 *        description: Array containing the service and the sectors and users related
 */
routes.get('/services/:id', (request, response) => {
  // Retrieve our Service, his sectors and users affiliated
  const includes = request.body;
  // Default query
  sqlInstance.request("SELECT * FROM SERVICES WHERE ID = ?", [request.params.id]).then(result => {

    // Prepare optional query to retrieve results
    const query = [];
    const queryParams = [];
    // Our queries index result
    const idx = [null, null, null];
    let acc = 0;
    // Everytime an include is settled, we increment the index result
    if(includes){
      if(includes.serviceApplicant){
        query.push('SELECT * FROM USERS WHERE ID = ?');
        queryParams.push(result[0].applicant);
        idx[0] = acc;
        acc += 1;
      }
      if(includes.serviceWorker){
        query.push('SELECT * FROM USERS WHERE ID = ?');
        queryParams.push(result[0].worker);
        idx[1] = acc;
        acc += 1;
      }
      if(includes.serviceSector){
        query.push('SELECT * FROM SECTORS WHERE ID = ?');
        queryParams.push(result[0].sector);
        idx[2] = acc;
      }
      if(query.length === 0){
        response.send(result).end();
        return;
      }
      sqlInstance.request(query.join(';'), queryParams).then(optionalResult => {
        // We send formatted data
        response.send({
          service: result[0],
          serviceApplicant : optionalResult[idx[0]],
          serviceWorker: optionalResult[idx[1]],
          serviceSector: optionalResult[idx[2]],
        }).end();
      });
    }
  });
});
