import { app, sqlInstance } from '..';
import { v4 as uuidv4 } from 'uuid';

// Method GET of all data of a user
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

  // Insert our user
  const sql = "INSERT INTO USERS(ID, FIRSTNAME, LASTNAME, GENDER, EMAIL, TOKEN, BIRTHDATE, PHONE, LOCALIZATION) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  sqlInstance.request(sql,
    [uuid,
    params.firstName,
    params.lastName,
    params.gender,
    params.email,
    params.password,
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
      sqlInstance.request("DELETE FROM USERS_SECTORS WHERE ID_SECTOR = ? AND ID_USER = ?", [sector, params.id]);
    }else if(sector.state == "add" ){
      sqlInstance.request("INSERT INTO USERS_SECTORS(ID_SECTOR, ID_USER) VALUES (?, ?)", [sector, params.id]);
    }
  })
});

// todo: method to change a password
// todo: make connexion