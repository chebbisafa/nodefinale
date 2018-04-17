

exports.lister = function(req, res){

    req.getConnection(function(err,connection){
         
        var id = req.params.id;  
        let sql="SELECT device_id,organisation_id,device_type,Token,user_id_device,pwd_id,prix,statut FROM detecteur_gaz where id_user = (?)";
        mysqlcnx.query(sql,[id] ,function (err, result, fields) {
            if (err) 
            console.log("erreur get")
            res.send(JSON.stringify({
                "status": 200,
                "error": null,
                "response": result
            }));
           //console.log(query.sql);
      });
    
  });
}