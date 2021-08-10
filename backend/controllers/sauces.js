// Import du schéma de données Sauce
const Sauce = require('../models/Sauce');

// Import de 'file system' de Node pour la gestion des fichiers (dont le téléchargement)
const fs = require('fs');

// Définition et export des différentes logiques métier correspondant à chacune des routes

// Définition et export de la logique métier appliquée à la route post qui crée la sauce avec l'ID fourni
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);    
    console.log(req.body.sauce); 
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

/* Définition et export de la logique métier appliquée à la route put qui met à jour la sauce avec l'identifiant fourni. 
- Si une image est téléchargée, elle est capturée et l'image URL des sauces mise à jour.
- Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande (req.body.name, req.body.heat etc).
- Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.*/
exports.modifySauce = (req, res, next) => {
    
    // Si la modification de l'objet sauce implique un changement d'image
    if (req.file) {
        // Alors on recherche l'objet à modifier
        Sauce.findOne({ _id: req.params.id })
        // Puis on supprime l'ancienne image correspondante
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);  
        })
    }

    /* Puis, on définit sauceObject comme une concaténation des valeurs de la sauce modifiée avec une nouvelle valeur d'url pour la nouvelle image si elle existe sinon on y affecte les nouvelles valeurs de sauce mais avec la même valeur d'url en cas d'image non modifiée*/
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
    // Enfin, bien-sûr, on applique les modifications, dans les 2 cas, dans la base de données via le modèle de données Sauce et la méthode updateOne
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })        
        .then(() => res.status(200).json({message : 'Sauce modified !'}))
        .catch(error => res.status(400).json({ error }));  
        
};

// Définition et export de la logique métier appliquée à la route get qui renvoie la sauce avec l'ID fourni
exports.getOneSauce = (req, res, next) => {      
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
        
};

// Définition et export de la logique métier appliquée à la route delete qui supprime la sauce avec l'ID fourni
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({message : 'Sauce deleted !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));       
};


// Définition et export de la logique métier appliquée à la route get qui renvoie le tableau de toutes les sauces dans la base de données 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likedislikeSauce = (req, res, next) => {

    console.log(req.body.like);

    // On analyse la valeur like de la requête renvoyée par l'API 
    switch (req.body.like) {
    
    // Si like = 1, l'utilisateur aime la sauce
    case 1:
        // Dans ce cas, on utilise la méthode updateOne pour mettre à jour les propriétés de la sauce objet de la requête
        Sauce.updateOne({
            // On recherche d'abord la sauce objet de la requête
            _id: req.params.id
        }, {
            //Puis, on ajoute au tableau usersLiked de la sauce, la valeur de userId de l'utilisateur qui aime cette sauce
            $push:{
                usersLiked: req.body.userId
            },
            /* Enfin, on incrémente de 1 la valeur de la propriété likes de cette sauce 
            qui représente le nombre total d'utilisateurs qui aiment cette sauce */
            $inc:{
                likes: +1
            },
        })
        /* On affiche ensuite avec les méthodes then et catch appliquées à l'objet Promise
        renvoyé par Sauce.updateOne pour afficher les messages de réussite ou d'échec */
        .then(() => res.status(200).json({message : 'Like added !'}))
        .catch(error => res.status(400).json({ error }));
    break;    
    
    // Si like = -1, l'utilisateur n'aime la sauce
    case -1:
        // Dans ce cas, on utilise la méthode updateOne pour mettre à jour les propriétés de la sauce objet de la requête
        Sauce.updateOne({
            // On recherche d'abord la sauce objet de la requête
            _id: req.params.id
        }, {
            //Puis, on ajoute au tableau usersDisliked de la sauce, la valeur de userId de l'utilisateur qui n'aime cette sauce
            $push:{
                usersDisliked: req.body.userId
            },
            /* Enfin, on incrémente de 1 la valeur de la propriété dislikes de cette sauce 
            qui représente le nombre total d'utilisateurs qui n'aiment pas cette sauce */
            $inc:{
                dislikes: +1
            },
        })
        /* On affiche ensuite avec les méthodes then et catch appliquées à l'objet Promise
        renvoyé par Sauce.updateOne pour afficher les messages de réussite ou d'échec */
        .then(() => res.status(200).json({message : 'Diskike added !'}))
        .catch(error => res.status(400).json({ error }));
    break;
    
    /* Si like = 0, l'utilisateur a annulé l'action "j'aime" (likes) ou l'action "je n'aime pas" (dislikes) 
    ou n'a fait aucune action j'aime ou je n'aime pas */
    case 0:
        // Dans ce cas, on utilise la méthode findOne pour trouver la sauce objet de la requête
        Sauce.findOne({
            _id: req.params.id
        })
        /* Pour pouvoir ensuite exploiter le résultat de la promesse renvoyée (c'est à dire la sauce trouvée 
        dans la base de données) et y appliquer une fonction de callback qui élude 2 cas :
         1. si le tableau des utilisateurs aimant la sauce comprend déjà ou non l'userId de l'utilisateur en question 
         2. si le tableau des utilisateurs n'aimant pas la sauce comprend déjà ou non l'userId de l'utilisateur en question */
        .then((sauce) => {
            // Si le tableau des utilisateurs aimant la sauce comprend l'utilisateur dont like = 0
            if (sauce.usersLiked.includes(req.body.userId)) {
                // Alors supprime le like de l'utilisateur en question pour ladite sauce dans la base de données
                Sauce.updateOne({
                    _id: req.params.id
                }, {
                    // retire du tableau des utilisateurs aimant cette sauce, l'utilisateur en question (dont like = 0)
                    $pull:{
                        usersLiked: req.body.userId
                    },
                    // Décrémente de 1 le nombre total de likes pour cette sauce
                    $inc:{
                        likes: -1
                    },                   
                })
                .then(() => res.status(200).json({message : 'Like deleted !'}))
                .catch(error => res.status(400).json({ error }));
            }

            // On opére de la même manière mais pour les dislikes
            if (sauce.usersDisliked.includes(req.body.userId)) {
                // Alors supprime le dislike de l'utilisateur en question pour ladite sauce dans la base de données
                Sauce.updateOne({
                    _id: req.params.id
                }, {
                    // retire du tableau des utilisateurs n'aimant pas cette sauce, l'utilisateur en question (dont like = 0)
                    $pull:{
                        usersDisliked: req.body.userId
                    },
                    // Décrémente de 1 le nombre total de likes pour cette sauce
                    $inc:{
                        dislikes: -1
                    },                   
                })
                .then(() => res.status(200).json({message : 'Dislike deleted !'}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));

    break;

    default: console.error("Error");
    }

};