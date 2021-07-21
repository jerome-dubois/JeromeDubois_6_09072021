// Appel du framework Express
const express = require('express');

// Création du routeur Express pour y enregistrer les différentes routes définies ci-après
const router = express.Router();

// Import du controller user.js
const userCtrl = require('../controllers/user');

// Import du middleware validatePassword.js
const validatePassword = require('../middleware/validatePassword');

// Valide le mot de passe puis le chiffre et enfin seulement ajoute l'utilisateur à la base de données
router.post('/signup', validatePassword, userCtrl.signup);

// Vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis la base de données et un jeton Web JSON signé (contenant également l'identifiant userID)
router.post('/login', userCtrl.login);

// Enregistrement des différentes routes dans le routeur Express
module.exports = router;