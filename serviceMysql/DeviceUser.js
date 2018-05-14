var mysqlcnx = require("../serviceMysql/connexion");
var UserService = require("./UserService"); 
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.por || 3001;
var router = express.Router();
var User = require("../model/User");
var cors = require('cors');
var controller =require("../controller/DeviceController")


function DeviceUser(){
app.use(cors({
    origin:'http://localhost:4200'
}))

// get device by id user 
app.use("/api/AllDeviceUser/:id",function (req, res, next) {

var id = req.params.id;  
let sql="SELECT device_id,organisation_id,device_type,Token,statut,prix,id_user FROM detecteur_gaz where id_user = (?)";
mysqlcnx.query(sql,[id] ,function (err, result, fields) {
    if (err) 
    console.log("erreur get")
    res.send(JSON.stringify({
        "status": 200,
        "error": null,
        "response": result
    }));
});
});
// get iddevice by id user 
app.use("/api/idDeviceUser/:id",function (req, res, next) {

    var id = req.params.id;  
    let sql="SELECT device_id FROM detecteur_gaz where id_user = (?)";
    mysqlcnx.query(sql,[id] ,function (err, result, fields) {
        if (err) 
        console.log("erreur get")
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
    });
    });
// get All devices
app.use("/api/AllDevice",function (req, res, next) {
var id = req.params.id;  
let sql="SELECT * FROM detecteur_gaz INNER JOIN users ON detecteur_gaz.id_user=users.id_user ";
mysqlcnx.query(sql,function (err, result, fields) {
    if (err) 
    console.log("erreur get")
    res.send(JSON.stringify({
        "status": 200,
        "error": null,
        "response": result
    }));
});
});

//get device vendu 
app.use("/api/DeviceVendu",function (req, res, next) {
    var statut ="connecter";
    let sql="SELECT COUNT(device_id) FROM detecteur_gaz WHERE statut = ?"
    mysqlcnx.query(sql,statut,function (err, result, fields) {
        if (err) 
        console.log("erreur get")
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
    });
    });
// delete 

app.delete("/api/SupDevice/:id",function (request, res, next) {

var id = request.params.id ;     
//console.log( request.params.id);   
let sql = `DELETE FROM detecteur_gaz WHERE device_id = ?` ;
mysqlcnx.query(sql,[id], (error, results, fields) => {
if (error)
return console.error(error.message);
console.log('Deleted Row(s):', results.affectedRows);
res.send(id);
});
});

// post 
app.use("/api/AddDevice",function (req, res, next) {
    var id=0;
    email=req.body.email;
    mysqlcnx.query("SELECT id_user FROM users where email='"+email+"'", function(error , result) {
      
    console.log(result[0]['id_user']);
    this.id=result[0]['id_user'];
  

    var device  = [
       
        device_id=req.body.device_id,
        organisation_id=req.body.organisation_id,
        device_type=req.body.device_type,
        Token=req.body.Token,
       //user_id_device=req.body.user_id_device,
       // pwd_id=req.body.pwd_id,
        statut=req.body.statut,
        prix=req.body.prix,
        id_user=this.id,
        Mois_Vente=req.body.Mois_Vente,
        
    ]

    console.log(req.body);
    mysqlcnx.query('INSERT INTO detecteur_gaz (device_id,organisation_id,device_type,Token,statut,prix,id_user,Mois_Vente) VALUES (?)',[device], function(error , result) {
   
 let sql = 'UPDATE users  SET role = ?  WHERE email = ?';
 mysqlcnx.query(sql,["utilisateur",email],(error, results, fields) => {
     if (error) throw err;
     console.log('updated Row(s):', results.affectedRows);
});

 

    
        
        if (error) {
            console.log("error insert");
            console.log(error.message);
        } else {
            console.log('success');    
            console.log("Number of records inserted: " +result.affectedRows);
        }
        });
    });
});
//put
app.use("/api/Updatedevice", function (req, res, next)
{
   var  device_id=req.body.device_id;
   var  statut=req.body.statut;          
         console.log(req.body.device_id);
         console.log(req.body.statut);   
 let sql = 'UPDATE detecteur_gaz  SET  statut = ? WHERE device_id = ?';
     mysqlcnx.query(sql,[statut,device_id],(error, results, fields) => {
         if (error) 
         {
         console.error(error.message);
         console.log('update ERRor...');
         }
         else
         
         ;console.log('updated Row(s):', results.affectedRows)
 });
});
     

/*
// post 
app.use("/api/AddDevice",function (req, res, next) {


    var device  = [
       
        device_id=req.body.device_id,
        organisation_id=req.body.organisation_id,
        device_type=req.body.device_type,
        Token=req.body.Token,
        user_id_device=req.body.user_id_device,
        pwd_id=req.body.pwd_id,
        prix=req.body.prix,
        statut=req.body.statut,
        id_user=req.body.id_user
        
    ]
    console.log(req.body.Token);
    mysqlcnx.query('INSERT INTO detecteur_gaz (device_id,organisation_id,device_type,Token,user_id_device,pwd_id,prix,statut,id_user) VALUES (?)',[device], function(error , result) {
        if (error) {
            console.log("error insert");
            console.log(error.message);
        } else {
            console.log('success');    
            console.log("Number of records inserted: " +result.affectedRows);
        }
        });
    });

*/

//get nb device vendu par mois
app.use("/api/DeviceVenduParMois",function (req, res, next) {
    let sql="SELECT Mois_Vente,count(*) as  nb FROM detecteur_gaz GROUP by Mois_Vente ";
    mysqlcnx.query(sql,function (err, result, fields) {
        if (err) 
        console.log("erreur get")
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
    });
    });
//get nb device totale vendu
app.use("/api/NbDeviceTotaleVendu",function (req, res, next) {
    let sql="SELECT count(*) as  nb FROM detecteur_gaz";
    mysqlcnx.query(sql,function (err, result, fields) {
        if (err) 
        console.log("erreur get")
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
    });
    });

//get  device user connecter
var deviceUserConnecter=function(id)
{

    
    mysqlcnx.query(sql,id,function (err, result, fields) {
        if (err) 
        console.log("erreur get")
       return result;
    });
   
}





    app.listen(port, function () {
        console.log("Express server running on port %d", port);
    });
}
    module.exports = DeviceUser;








  