var mysql = require("mysql");

var mysqldb = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "iot_pfe"
});
mysqldb.connect(function(err) {
    if (err) console.log('Connection ERRor...');
    else 
    console.log('You are now connected...')
  
  });
  module.exports = mysqldb;
  

