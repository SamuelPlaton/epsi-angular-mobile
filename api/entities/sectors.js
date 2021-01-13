import { app, sqlInstance } from '../index';

// Select all sectors
app.get('/sectors', (request, response) => {
  sqlInstance.request("SELECT * FROM SECTORS").then(result => {
    response.send(result);
  });
});

// Select selected sectors
app.get('/sectorsSelected', (request, response) => {
  sqlInstance.request("SELECT * FROM SECTORS WHERE ID IN ?", [request.body.sectors]).then(result => {
    response.send(result);
  });
});