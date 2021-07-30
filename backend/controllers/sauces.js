// Import du schéma de données Sauce
const Sauce = require('../models/Sauce');

// Import de 'file system' de Node pour la gestion des fichiers (dont le téléchargement)
const fs = require('fs');

// Définition et export des différentes logiques métier correspondant à chacune des routes

// Définition et export de la logique métier de la route post qui renvoie la sauce avec l'ID fourni
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce registered !'}))
        .catch(error => res.status(400).json({ error }));
};

// Définition et export de la logique métier de la route put qui met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, elle est capturée l'image URL des sauces mise à jour. Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande (req.body.name, req.body.heat etc). Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({message : 'Sauce modified !'}))
        .catch(error => res.status(400).json({ error }));
};

// Définition et export de la logique métier de la route get qui renvoie la sauce avec l'ID fourni
exports.getOneSauce = (req, res, next) => {
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Définition et export de la logique métier de la route delete qui supprime la sauce avec l'ID fourni
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            console.log(`images/${filename}`);
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({message : 'Sauce deleted !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));       
};


// Définition et export de la logique métier de la route get qui renvoie le tableau de toutes les sauces dans la base de données 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};