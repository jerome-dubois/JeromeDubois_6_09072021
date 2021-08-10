// Déclaration de l'outil de modélisation d'objet MongoDB via le package mongoose (facilite les échanges avec la base de données MongoBD grâce à une librairie de fonctions utiles)
const mongoose = require ('mongoose');

// Import du middleware sauceValidator pour la validation des entrées du modèle Sauce.js
const sauceValidator = require('../middleware/sauceValidator');

// Création du schéma de données sauceSchema à partir des différents attributs du modèle de données fourni dans la note de cadrage du projet
// Déclaration du type des attributs du schéma de données et leur caractère obligatoire

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type : String, required: true, validate: sauceValidator},
    manufacturer: { type : String, required: true, validate: sauceValidator },
    description: { type: String, required: true, validate: sauceValidator },
    mainPepper: { type: String, required: true, validate: sauceValidator },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }
});

// // Implémentation du plugin sauceValidator permettant de valider les entrées du modèle Sauce
// sauceSchema.plugin(sauceValidator);

// Export du schéma de données en tant que modèle Mongoose appelé "Sauce" rendu disponible pour l'application Express app.js
module.exports = mongoose.model('Sauce', sauceSchema);