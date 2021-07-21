// Déclaration de l'outil de modélisation d'objet MongoDB via le package mongoose (facilite les échanges avec la base de données MongoBD grâce à une librairie de fonctions utiles)

const mongoose = require ('mongoose');

// Création du schéma de données sauceSchema à partir des différents attributs du modèle de données fourni dans la note de cadrage du projet
// Déclaration du type des attributs du schéma de données et leur caractère obligatoire

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type : String, required: true },
    manufacturer: { type : String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }
});

// Export du schéma de données en tant que modèle Mongoose appelé "Sauce" rendu disponible pour l'application Express app.js

module.exports = mongoose.model('Sauce', sauceSchema);