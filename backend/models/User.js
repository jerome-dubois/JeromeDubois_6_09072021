// Déclaration de l'outil de modélisation d'objet MongoDB via le package mongoose (facilite les échanges avec la base de données MongoBD grâce à une librairie de fonctions utiles)
const mongoose = require ('mongoose');

// Déclaration du plugin mongoose-unique-validator qui ajoute une validation de pré-enregistrement pour les champs uniques dans un schéma Mongoose.
const uniqueValidator = require('mongoose-unique-validator');

// Déclaration de la bibliothèque de validation et de nettoyage des chaînes de caractères 
// const validator = require('validator');

// Création du schéma de données userSchema à partir des différents attributs du modèle de données fourni dans la note de cadrage du projet
// Déclaration du type des attributs du schéma de données et leur caractère obligatoire,  vérification de la validité du format de l'email

const userSchema = mongoose.Schema({
    // email: { type : String, required: true, unique: true, validate: [validator.isEmail, { error: 'Cette adresse est invalide' }] },
    email: { type : String, required: true, unique: true },
    password: { type : String, required: true },
});

// Implémentation du plugin uniqueValidator garantissant un email unique dans la base de données
userSchema.plugin(uniqueValidator);

// Export du schéma de données en tant que modèle Mongoose appelé "User" rendu disponible pour l'application Express app.js
module.exports = mongoose.model('User', userSchema);