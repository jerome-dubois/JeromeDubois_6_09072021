const validate = require('mongoose-validator');

module.exports = [validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Le nom de la sauce doit comprendre entre 3 et 50 caractères',
}), validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only',
  }),];