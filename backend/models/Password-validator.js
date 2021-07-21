var passwordValidator = require('password-validator');
 
// Creation du schéma de validation de mot de passe
var passwordValidatorSchema = new passwordValidator();
 
// Ajout des propriétés à ce schéma de validation de mot de passe
passwordValidatorSchema
.is().min(8)                                            // Longueur minimum 8 caractères
.is().max(100)                                          // Longueur maximum 100 caractères
.has().uppercase()                                      // Doit avoir des lettres majuscules
.has().lowercase()                                      // Doit avoir des lettres minuscules
.has().digits(2)                                        // Doit avoir au moins 2 chiffres
.has().not().spaces()                                   // Ne devrait pas contenir des espaces
.is().not().oneOf(['motdepasse', 'password', '1234'])   // Invalide certaines valeurs
.has(/^((?!').)*$/gm)                                   // Ne contient pas le caractère spécial '
.has(/^((?!=).)*$/gm);                                  // Ne contient pas le caractère spécial =

// Export du schéma de validation de mot de passe rendu disponible pour l'application Express app.js
module.exports = passwordValidatorSchema;