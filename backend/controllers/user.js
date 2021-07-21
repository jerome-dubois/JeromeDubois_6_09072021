// Import du package de chiffrement bcrypt
const bcrypt = require('bcrypt');

// Import du package pour pouvoir créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// Import du schéma de données User
const User = require('../models/User');

// Définition et export des différentes logiques métier correspondant à chacune des routes


// Définition et export de la logique métier de la route post qui chiffre le mot de passe de l'utilisateur,
// ajoute l'utilisateur à la base de données
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = User({
                email: req.body.email,
                password: hash
            });
            user.save()
              .then(() => res.status(201).json({ message: 'User created !' }))
              .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Définition et export de la logique métier de la route post qui vérifie les informations d'identification de l'utilisateur, 
// en renvoyant l'identifiant userID depuis la base de données et un jeton Web JSON signé (contenant également l'identifiant userID)
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found !' })
            }
            bcrypt.compare(req.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                    return res.status(401).json({ error: 'Password incorrect !' })
                   }
                   res.status(200).json({
                       userId: user._id,
                       token: jwt.sign(
                           { userId: user._id },
                           'RANDOM_TOKEN_SECRET',
                           { expiresIn: '24h' }
                       ) 
                   });
               })
               .catch(error => res.status(500).json({ error }));

        })
        .catch(error => res.status(500).json({ error }));

};