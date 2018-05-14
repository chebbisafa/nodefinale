var mysqlcnx = require("../serviceMysql/connexion");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.por || 3000;
var router = express.Router();
var User = require("../model/User");
var cors = require('cors');
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
var DUser = require("./DeviceUser"); 

function UserService(){

app.use(cors({
    origin:'http://localhost:4200'
}))
// get 
    app.get("/api/Allusers",function (req, res, next) {
        mysqlcnx.query("SELECT * FROM users", function (err, result, fields) {
            if (err) throw err;
            res.send(JSON.stringify({
                "status": 200,
                "error": null,
                "response": result
            }));
        });
    });
    // get id user with email 
    function getid(email)
    {
    app.post("/api/idusers",function (req, res, next) {
        email=req.body.email;
        mysqlcnx.query("SELECT id_user FROM users where email='"+email+"'" , function (err, result, fields) {
            if (err) throw err;
            res.send(JSON.stringify(result));
        
    });
});
}

 // get nom prenom  user with id
 function getid(email)
 {
 app.post("/api/npusers",function (req, res, next) {
     email=req.body.id_user;
     mysqlcnx.query("SELECT nom,prenom FROM users where id_user='"+id_user+"'" , function (err, result, fields) {
         if (err) throw err;
         res.send(JSON.stringify(result));
     
 });
});
}

// post 

    app.use("/api/Adduser",function (req, res, next)
       
       {

        var  user = [
            nom = req.body.nom,
            prenom =req.body.prenom,
            email =req.body.email,
           // password=req.body.password,
            password=passwordHash.generate(req.body.password),
            numTel=req.body.numTel,
            adresse=req.body.adresse,
            dateAjout=req.body.dateAjout,
            role=req.body.role                    
            ]  

        
        //let sql='INSERT INTO users (nom,prenom,email,password,numTel,adresse,dateAjout,role) VALUES (?)';
        mysqlcnx.query('INSERT INTO users (nom,prenom,email,password,numTel,adresse,dateAjout,role) VALUES (?)',[user],function(error,result) {
            if (error) {
                res.send(JSON.stringify({
                    "status": 200,
                    "error": null,
                    "response": false,
                })); 
            } else {
            console.log('success');    
            console.log("Number of records inserted: " +result.affectedRows);
            res.send(JSON.stringify({
                "status": 200,
                "error": null,
                "response": true,
            })); 
            }
        });
    });
// delete 

    app.delete("/api/Supuser/:id",function (request, res, next)
   {
    var id = request.params.id ;  
    console.log(id);   
    let sql = `DELETE FROM users WHERE id_user = ?` ;
    mysqlcnx.query(sql,[id], (error, results, fields) => {
        if (error)
        return console.error(error.message);
        console.log('Deleted Row(s):', results.affectedRows);
        res.send(id);
        });
    });
       
//put
    app.use("/api/Updateuser", function (req, res, next)
       {
            
            var id=req.body.id_user;
            var email=req.body.email;
           // var pwd=req.body.password;
            var numTel=req.body.numTel;        
            var adresse=req.body.adresse;   
            console.log (email);
           // console.log (pwd);
            console.log (numTel);
            console.log (adresse);
            console.log (id);
        let sql = 'UPDATE users  SET email = ? ,numTel = ?,adresse = ? WHERE id_user = ?';
            mysqlcnx.query(sql,[email,numTel,adresse,id],(error, results, fields) => {
                if (error) 
                {
                console.error(error.message);
                console.log('update ERRor...');
                }
                else
                console.log('updated Row(s):', results.affectedRows);
        });
    });
            
// post get email  authentification
    app.use("/api/authentification",function (req, res, next) {
           
           email=req.body.email;
           password=req.body.password;
            let sql1="SELECT count(id_user),id_user,password,role,nom,prenom FROM users WHERE email ='" + email + "'";
            mysqlcnx.query(sql1,function (err,result, fields) {

            let sql2="SELECT device_id,organisation_id,device_type FROM detecteur_gaz where id_user ="+ result[0]['id_user'];
            mysqlcnx.query(sql2,function (err2,results, fields) {
              
            
                if(result[0]['password'] && passwordHash.verify(password, result[0]['password'])) 
        
                {
                   var token=jwt.sign({email},'key',{ expiresIn: '1h' });
                   // console.log(token);
                    res.send(JSON.stringify({
                        "status": 200,
                        "error": null, 
                        "response": true,result,token,results
                    }));  
                }
                
              else
              {
                res.send(JSON.stringify({
                    "status": 200,
                    "error": null,
                    "response": false,
                }));
                
            
        
               
              }
            });
            });
            });


//get nb totale user
app.use("/api/NbUsersTotale",function (req, res, next) {
    let sql="SELECT count(*) as  nb FROM users";
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







    app.listen(port,function () {
    console.log("Express server running on port %d", port);
});

  
}
module.exports = UserService;
