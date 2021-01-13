import { app, sqlInstance } from '../index';
import { v4 as uuidv4 } from 'uuid';
import { getDistanceFromLatLonInKm } from '../helpers/distance';

// Method GET of a service
app.get('/services/:id', (request, response) => {
  // todo: filter data to receive (on user)
  sqlInstance.request("SELECT * FROM SERVICES S1, SECTORS S2, USER U WHERE S1.ID = ? AND S2.ID = S1.SECTOR AND U.ID = S1.APPLICANT AND U.ID = S1.WORKER"
    [request.params.id]).then(result => {
    response.send(result);
  });
});

// Method GET of user recommended services
app.get('/services/recommended', (request, response) => {
  // Throw error if parameters are missing
  const params = request.body;
  if(!params.id || !params.localization || !params.maxDistance ){
    throw new Error('Error in post parameters');
  }
  // Retrieve user localization
  const { userLocX, userLocY } = params.localization.split(";");
  // Start our request
  const closeServices = [];
  sqlInstance.request("SELECT * FROM SERVICES S, USERS U " +
    "WHERE S.SECTOR IN (SELECT SECTORS FROM USER WHERE SECTORS.ID = ? AND SECTORS.STATE = 'waiting') " +
    "AND U.ID = S.APPLICANT"
    [params.id]).then(result => {
    result.map(service => {
      // Retrieve service localization
      const { serviceLocX, serviceLocY } = result.users[0].localization.split(";");
      const d = getDistanceFromLatLonInKm(userLocX, userLocY, serviceLocX, serviceLocY);
      if (d <= params.maxDistance){
        closeServices.push(service);
      }
    });
    // Send all closes services
    response.send(closeServices);
  });
});

// Method POST for a service
app.post('/services', (request, response) => {
  const params = request.body;
  const uuid = uuidv4();
  if(!params.applicant || !params.title || !params.description || !params.sector || !params.exchangeType ){
    throw new Error('Error in post parameters');
  }
  // todo: in database set default state
  const sql = "INSERT INTO SERVICES(ID, APPLICANT, TITLE, DESCRIPTION, SECTOR, EXCHANGE_TYPE) VALUES(?, ?, ?, ?, ?, ?)";
  sqlInstance.request(sql,
    [uuid,
      params.applicant,
      params.title,
      params.description,
      params.sector,
      params.exchangeType]).then(result => {
    response.send("");
    response.status(201).end();
  });
});

// Method PUT to modify a service
app.put('/services/:id', (request, response) => {
  const params = request.body;
  if(!params.worker || !params.title || !params.description || !params.state || !params.sector || !params.exchangeType || !params.id){
    throw new Error('Error in post parameters');
  }

  const sql = "UPDATE SERVICES SET WORKER = ?, TITLE = ?, DESCRIPTION = ?, STATE = ?, SECTOR = ?, EXCHANGE_TYPE = ? WHERE ID = ?";
  sqlInstance.request(sql,
    [
      params.worker,
      params.title,
      params.description,
      params.state,
      params.sector,
      params.exchangeType,
      params.id]).then(result => {
    response.send("");
    response.status(200).end();
  });
});