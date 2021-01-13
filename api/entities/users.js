import { app, sqlInstance } from '..';
import { v4 as uuidv4 } from 'uuid';

// Method GET of all our connected user data combined to his sectors and services
app.get('/users/:id', (request, response) => {
  sqlInstance.request("SELECT * FROM USERS U, SECTORS S1, SERVICES S2  WHERE U.ID = ? AND S1.ID IN U.SECTORS AND " +
    "(S2.APPLICANT = U.ID OR S2.WORKER = U.ID)"
    [request.params.id]).then(result => {
    response.send(result);
  });
});

// Method GET of all selected users data
app.get('/users', (request, response) => {
  if(!params.ids){
    throw new Error('Error in parameters, ids missing');
  }
  sqlInstance.request("SELECT * FROM USERS WHERE ID IN ?", [request.body.id]).then(result => {
    response.send(result);
  });
});

// Method DELETE for a user
app.delete('/users/:id', (request, response) => {
  sqlInstance.request("DELETE FROM USERS WHERE ID = ?", [request.params.id]).then(result => {
    response.send("");
    response.status(200).end();
  });
});

// Method POST for a user
app.post('/users', (request, response) => {
  const params = request.body;
  const uuid = uuidv4();
  if(!params.firstName || !params.lastName || !params.gender || !params.email || !params.password || !params.birthDate || !params.phone || !params.sectors || !params.localization){
    throw new Error('Error in post parameters');
  }

  const sql = "INSERT INTO USERS(ID, FIRSTNAME, LASTNAME, GENDER, EMAIL, TOKEN, BIRTHDATE, PHONE, SECTORS, LOCALIZATION) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  sqlInstance.request(sql,
    [uuid,
    params.firstName,
    params.lastName,
    params.gender,
    params.email,
    params.password,
    params.birthDate,
    params.phone,
    JSON.stringify(params.sectors),
    params.localization]).then(result => {
    response.send("");
    response.status(201).end();
  });
});

// Method PUT to modify a user
app.put('/users/:id', (request, response) => {
  const params = request.body;
  if(!params.firstName || !params.lastName || !params.gender || !params.email || !params.phone || !params.sectors || !params.localization){
    throw new Error('Error in post parameters');
  }

  const sql = "UPDATE USERS SET FIRSTNAME = ?, LASTNAME = ?, GENDER = ?, EMAIL = ?, PHONE = ?, SECTORS = ?, LOCALIZATION = ? WHERE ID = ?";
  sqlInstance.request(sql,
    [
      params.firstName,
      params.lastName,
      params.gender,
      params.email,
      params.phone,
      JSON.stringify(params.sectors),
      params.localization,
      params.id]).then(result => {
    response.send("");
    response.status(200).end();
  });
});

// todo: method to change a password