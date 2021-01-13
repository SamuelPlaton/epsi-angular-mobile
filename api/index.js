import SQLInstance from './SQLInstance.js';
import express from 'express';

// Create our express App
export const app = express();
app.use(express.json());

// Create our SQL Instance, then connect us to it
export const sqlInstance = new SQLInstance("localhost", "root", "", "troc");
sqlInstance.connect();


// Method GET of all sectors
app.get('/sectors', (request, response) => {
  sqlInstance.request("SELECT * FROM SECTORS").then(result => {
    response.send(result);
  });
});

// Method GET of all our user data
app.get('/users/:id', (request, response) => {
  sqlInstance.request("SELECT * FROM USERS WHERE ID = ?", [request.params.id]).then(result => {
    response.send(result);
  });
});

// Method GET of all of our books
app.get('/books', (request, response) => {
 sqlInstance.request("SELECT * FROM BOOKS").then(result => {
   response.send(result);
 });
});


// Method GET for one book
app.get('/books/:id', (request, response) => {
  sqlInstance.request("SELECT * FROM BOOKS WHERE ID = ?", [request.params.id]).then(result => {
    response.send(result[0]);
  });
});


// Method DELETE for one book
app.delete('/books/:id', (request, response) => {
  sqlInstance.request("DELETE FROM BOOKS WHERE ID = ?", [request.params.id]).then(result => {
    response.send("");
    response.status(200).end();
  });
});


// Method POST for a book
app.post('/books', (request, response) => {
  const params = request.body;

  if(!params.title || !params.content || !params.isbn){
    throw new Error('Error in post parameters');
  }

  const sql = "INSERT INTO BOOKS(TITLE, CONTENT, ISBN) VALUES(?, ?, ?)";
  sqlInstance.request(sql, [params.title, params.content, params.isbn]).then(result => {
    response.send("");
    response.status(201).end();
  });
});

// Method PUT for a book
app.put('/books/:id', (request, response) => {
  const params = request.body;

  if(!params.title && !params.content && !params.isbn){
    throw new Error('Error no parameters');
  }
  const sql = "UPDATE BOOKS SET TITLE = ?, CONTENT = ?, ISBN = ? WHERE ID = ?";

  sqlInstance.request(sql, [params.title, params.content, params.isbn, request.params.id]).then(result => {
    response.send("");
    response.status(200).end();
  });
});

app.listen(3000);
