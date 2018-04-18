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
// post get email password
app.use("/api/authentification",function (req, res, next) {
   
   email=req.body.email;
   password=req.body.password;
    
    let sql="SELECT count(id_user),role FROM users WHERE email ='" + email + "' and password ='"+ password +"'";
    mysqlcnx.query(sql,function (err,result, fields) {
        if (err) 
        console.log(err.message);
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
       
       });
    });
// post 

    app.use("/api/Adduser",function (req, res, next)
       
       {
        
                      /* var  user = new User
                                (
                            
                                nom = req.body.nom,
                                prenom =req.body.prenom,
                                email =req.body.email,
                                password=req.body.password,
                                numTel=req.body.numTel,
                                adresse=req.body.adresse,
                                dateAjout=req.body.dateAjout,
                                role=req.body.role
                                
                                )*/
                                var postData = req.body; // post data is a json

                                // also tried passing JSON.stringify(postData) instead of postData below
                              
        //console.log([values]);

        var  user = [
            nom = req.body.nom,
            prenom =req.body.prenom,
            email =req.body.email,
            password=req.body.password,
            numTel=req.body.numTel,
            adresse=req.body.adresse,
            dateAjout=req.body.dateAjout,
            role=req.body.role                    
            ]  

        
        //let sql='INSERT INTO users (nom,prenom,email,password,numTel,adresse,dateAjout,role) VALUES (?)';
        mysqlcnx.query('INSERT INTO users (nom,prenom,email,password,numTel,adresse,dateAjout,role) VALUES (?)',[user],function(error,result) {
            if (error) {
                console.log("error insert");
                console.log(error.message);
            } else {
            console.log('success');    
            console.log("Number of records inserted: " +result.affectedRows);
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
            var pwd=req.body.password;
            var numTel=req.body.numTel;        
            var adresse=req.body.adresse;   
            console.log (email);
            console.log (pwd);
            console.log (numTel);
            console.log (adresse);
            console.log (id);
        let sql = 'UPDATE users  SET email = ? ,password = ? ,numTel = ?,adresse = ? WHERE id_user = ?';
            mysqlcnx.query(sql,[email,pwd,numTel,adresse,id],(error, results, fields) => {
                if (error) 
                {
                console.error(error.message);
                console.log('update ERRor...');
                }
                else
                console.log('updated Row(s):', results.affectedRows);
        });
    });
            








app.listen(port, function () {
    console.log("Express server running on port %d", port);
});

/*app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });*/
  
  
}
module.exports = UserService;