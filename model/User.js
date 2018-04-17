
function User(nom,prenom,email,password,numTel,adresse,dateAjout,role) {
        
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.numTel = numTel;
        this.adresse = adresse;
        this.dateAjout = dateAjout;
        this.role = role;
}


module.exports = User;
    
