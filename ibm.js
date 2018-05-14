//var dbmongo = require("./serviceMongoDB/cnx");
var mysqlcnx = require("./serviceMysql/connexion");
var clientibm=require('ibmiotf');
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.por || 3005;
var router = express.Router();
var obj;
var MongoClient = require('mongodb').MongoClient;
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 5000);
var dbmongo ;
var servicemongo= require("./serviceMongoDB/DataGaz.js");
var cors = require('cors');
/*safa compte
var config = {
    "org" : "y506aa",
    "id" : "123456789",
    "domain": "internetofthings.ibmcloud.com",
    "type" : "Test",
    "auth-method" : "token",
    "auth-token" : "09091994",
    "use-client-certs": "false",
    "mqtt_u_port": "1883"
};*/
function ibm(){



 /*app.use(cors({
    origin:'http://localhost:4200'
}))*/


var appClientConfig = {
    "org": 'y506aa',
    "id": 'myapp',
    "auth-key":'a-y506aa-trlj9pslcg',
    "auth-token": 'RTRol-np+(y5lG(2nL',
    "type " : "shared",
    
  };

// get device by id user et id_device selected 
app.use("/api/DeviceSelectedByUse",function (req, res, next) {
    device_id=req.body.device_id;
    id_user=req.body.id_user;
  console.log(req.body.device_id);
  console.log(id_user);
  let sql="SELECT device_id,organisation_id,device_type,Token FROM detecteur_gaz where id_user ="+id_user+" and device_id= '"+device_id+"'";
  mysqlcnx.query(sql ,function (err, result, fields) {
      if (err) 
      console.log("erreur get device")
      res.send(JSON.stringify({
          "status": 200,
          "error": null,
          "response": result
      }));
      console.log(result);
  });
  });

  var deviceId="123456789";
  var deviceType="Test";
  var eventType="+";
  var format="json";
  var payload="";
var appclient= new clientibm.IotfApplication(appClientConfig);

appclient.log.setLevel('debug');
appclient.connect();
appclient.on('connect', function(){
    
     console.log("connected");

     appclient.subscribeToDeviceEvents( deviceType, deviceId, "+", "json");
         console.log(`Subscribed to ${deviceId}`);

 });
//connexion
MongoClient.connect('mongodb://localhost:27017/Gaz', (err, Gaz) => {
  if (err) return console.log(err);
  dbmongo = Gaz.db('Gaz');// whatever your database name is
  console.log('You are now connected...');
  app.listen(8082, () => {
    console.log('listening on 8081');
  });
});

 //get data 
 appclient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
  //console.log("DeviceType " + deviceType + " deviceId " + deviceId + " eventType " + eventType + " format " + format);
 //console.log("Json parsed payload: ", JSON.parse(payload))
   objet=JSON.parse(payload);
   console.log(objet);
   valgaz=objet.d['data'];
   var date = new Date();
   obj={TauxGaz:valgaz,date:date,deviceID:deviceId};
   io.emit('message',obj);  
   console.log(obj);
   
 dbmongo.collection('info').save(obj, (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
    
    });

     // io.on('connection',(socket) => {
      
  
     
   // });

  
   //servicemongo.addinfo(obj);
  // console.log('saved to database');
      app.on("error",function (err) {
      console.log("Error :"+err);
 });
 });
 
 

 app.listen(port,function () {
  console.log("Express server running on port %d", port);
});

}

module.exports = ibm;

  