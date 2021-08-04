// Appel du framework Express
const express = require('express');

// Création du routeur Express pour y enregistrer les différentes routes définies ci-après
const router = express.Router();

// Import du middleware d'authentification
const auth = require('../middleware/auth');

// Import du middleware de téléchargement des fichiers
const multer = require('../middleware/multer-config');


// Import du controller sauces.js avec déclaration de saucesCtrl
const saucesCtrl = require('../controllers/sauces');

// Implémentation des différentes routes avec, pour chaque route, authentification et configuration de la logique métier appropriée:

// Renvoie le tableau de toutes les sauces dans la base de données 
router.get('/', auth, saucesCtrl.getAllSauces);

// Renvoie la sauce avec l'ID fourni
router.get('/:id', auth, saucesCtrl.getOneSauce);

// Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères et l'enregistre dans la base de données, en définissant correctement son image URL. Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides.
router.post('/', auth, multer, saucesCtrl.createSauce);

// Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, elle est capturée l'image URL des sauces mise à jour. Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande (req.body.name, req.body.heat etc). Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// Supprime la sauce avec l'ID fourni.
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Gère les like/dislike sur la Sauce avec l'ID fourni
router.post('/:id/like', auth, saucesCtrl.likedislikeSauce);

// Enregistrement des différentes routes dans le routeur Express
module.exports = router;