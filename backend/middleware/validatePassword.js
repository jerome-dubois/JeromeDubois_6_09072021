// Import du modèle de validation de mot de passe dans la variable passwordValidatorSchema
const passwordValidatorSchema = require('../models/Password-validator');

// Export de la fonction de validation du mot de passe dans l'application Express app.js
module.exports = (req, res, next) => {
    if (!passwordValidatorSchema.validate(req.body.password)) {
        res.writeHead(400, '{"message":"Le mot de passe doit contenir 8 caractères minimun, 100 caractères maximum, au moins 1 majuscule, au moins 1 minuscule, au moins 2 chiffres et ne doit contenir ni espace ni caractère spécial \' ni caractère spécial ="}', {
            'content-type': 'application/json'
        });
        res.end('Le mot de passe est invalide');
    } else {
        next();
    }
};