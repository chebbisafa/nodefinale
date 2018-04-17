var cli=require('ibmiotf');


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
//cyrine compte
var config = {
    "org" : "ik2dh6",
    "id":"a-ik2dh6-3nkeytdqv2",
    "authKey" : "!YBvKDr-C6jRbQFsCZ",
    "domain": "internetofthings.ibmcloud.com",
    "type" : "carteESP",
    "auth-method" : "token",
    "auth-token" : "123456789",
    "use-client-certs": "false",
    "mqtt_u_port": "1883"
};

var appClientConfig = {
    "org": 'y506aa',
    "id": 'myapp',
    "auth-key":'a-y506aa-trlj9pslcg',
    "auth-token": 'RTRol-np+(y5lG(2nL',
    "type " : "shared",
    
  };
var deviceC = new cli.IotfApplication(appClientConfig);

  deviceC.log.setLevel('debug');
  deviceC.connect();
  deviceC.on('connect', function(){
    
     console.log("connected");
   /*  
    var i=0;
       console.log("connected");
       setInterval(function function_name () {
           i++;*/
         //  deviceC.publish('status', 'json', '{"value":}', 2);
       /*},2000);*/
   //  console.log(deviceClient.publish("status","json",'{"d" : { "cpu" : 60, "mem" : 50 }}'));
 
  
 });

 deviceC.on('message',function(Topic,message){
    console.log("safa");
    console.log (message);
   
  });


 //Handle events from the device
 deviceC.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
    console.log("DeviceType " + deviceType + " deviceId " + deviceId + " eventType " + eventType + " format " + format);
    console.log("Json parsed payload: ", JSON.parse(payload))

 });
deviceC.on("error", function (err) {
    console.log("Error : "+err);
});


 


  