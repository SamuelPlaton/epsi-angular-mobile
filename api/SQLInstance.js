import mysql from 'mysql';

export default class SQLInstance{

  // App constructor create a MYSQL Connection
  constructor(host, user, password, database) {
    this.con = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
    });
    console.log("SQL Connector created !");
  }

  // Connect our MYSQL Connection
  connect(){
    this.con.connect(function(err) {
      if (err) throw err;
      console.log("Connected to the database !");
    });
  }

  // Make a query and send result
  request(request, parameters = undefined){
    return new Promise((resolve, reject) => {
      this.con.query(request, parameters, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    })
  }

  // Close connection
  end(){
    this.con.end()
  }
}