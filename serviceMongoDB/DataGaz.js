var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var Gaz = require("../model/GAZ");
var dbmongo;
/* create database
var url = "mongodb://localhost:27017/Gaz";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});*/
/* create collection
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Gaz");
    dbo.createCollection("info", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
  */
 
//connexion
 MongoClient.connect('mongodb://localhost:27017/Gaz', (err, Gaz) => {
   if (err) return console.log(err);
   dbmongo = Gaz.db('Gaz');// whatever your database name is
   console.log('You are now connected...');
   app.listen(8081, () => {
     console.log('listening on 8081');
   });
 });

//get 
 app.get('/listgaz', function(req, res) {
    dbmongo.collection('info').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.json(result);
      });
  });
// get with deviceid

app.use("/listgazuser/:iddevice",function (req, res, next) {

  var iddevice = req.params.iddevice; 
  console.log(iddevice);
  var query = { deviceID: iddevice };
  dbmongo.collection('info').find(query).toArray((err, result) => {
    if (err) return console.log(err);
    console.log(result);
    res.json(result);
  });
});

//post 
  app.post('/addinfo', function(req, res)  {
      var  gaz =  {
        TauxGaz :req.body.TauxGaz,
        date : req.body.date,
        deviceID :req.body.deviceID,
        
      }
    dbmongo.collection('info').save(gaz, (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/listgaz');
    });
  });
  
//delete rows
app.delete('/delinfogaz/:iddevice', (req, res) => {
  var iddevice = req.params.iddevice; 
  console.log(iddevice);
  var query = {deviceID: iddevice};
 dbmongo.collection('info').remove(query , (err, result) => {
    if (err) return console.log(err);
    res.redirect('/listgaz');
  })
})
