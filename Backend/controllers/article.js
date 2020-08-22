'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path')
var Article = require('../models/article');
const article = require('../models/article');
const { exists } = require('../models/article');
const { exec } = require('child_process');
var controller = {

    datosCurso: (req, res) => {

        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Pablo Solares',
            url: 'victorroblesweb.es',
            hola

        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        //RECOGER PARAMETROS POR POST
        var params = req.body;

        //VALIDAR DATOS CON LA LIBRERIA
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                mensaje: 'Faltan datos por enviar'
            });

        }
        if (validate_title && validate_content) {
            //CREAR EL OBJETO A GUARDAR
            var article = new Article();
            //ASIGNAR VALORES
            article.title = params.title;
            article.content = params.content;
            article.img = null;
            //GUARDAR ARTICULOS
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        mensaje: 'El articulo no se ha guardado!!!'
                    });
                }


                //DEVOLVER UNA RESPUESTA
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                menssaje: 'Los datos no son validos!!!'
            });
        }


    },

    getArticles: (req, res) => {

        var query = Article.find({})
        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //find
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos!!!'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar!!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
            
        });
    },

    getArticle: (req, res) => {
        //RECOGER EL ID DE LA URL

        var articleId = req.params.id;

        // COMPRABAR SI EXSISTE
        if (!article || article == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!!!'
            });
        }
        //BUSCAR EL ARTICULO

        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!!!'
                });
            }
            //DEVOLVER EL JSON

            return res.status(404).send({
                status: 'success',
                article
            });

        });

    },

    update: (req, res) => {
        //RECOGERE EL ID DEL ARTICULO POR AL URL
        var articleId = req.params.id;
        //RECOGER LOS DATOS 
        var params = req.body;

        //VALIDAR LOS DATOS
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!!'
            });
        }

        if (validate_title && validate_content) {
            Article.findOneAndUpdate({
                _id: articleId
            }, params, {
                new: true
            }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar!!!'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo!!!'
                    });
                }

                return res.status(404).send({
                    status: 'success',
                    article: articleUpdated
                });

            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'No existe el articulo!!!'
            });
        }
        //HACER UN FIND A UPDATE

    },
    
    delete: (req, res) => {
    
        //RECOGER EL ID DE LA URL
        var articleId = req.params.id;

        //FIND AND DELELTE

    },

     
     upload: (req,res) => {

        // Configurar el módulo del connect multiparty router/aritcle.js  (hecho)

        // Regoger el fichero de la petición

        
        if(!req.file){
            
            return res.status(404).send({
                
                status:'error',
                
                message: file_name
                
            });
            
        }
        
        // Conseguir el nombre y la extensión
        
        var file_path = req.file.path;
        var ext_split = req.file.originalname.split('\.');
        var file_ext = ext_split[1];
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        
        // Comprobar la extensión, sólo imágenes, si no es válida la extensión borrar fichero
        if(file_ext != 'png' && file_ext!='gif' && file_ext!= 'jpg'){
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extencion de la imagen no es valida !!!'
        
                });
            });
        }else{

            //sacando id de la url 
            var articleId = req.params.id;
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) =>{
                if(err || !articleUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de articulo!!!' 
                    });
                }
                
                
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated 
        
                });
            });
          
    
        }
        // Si todo es válido

        // Buscar el artículo, asignarle el nombre de la imágen y actualizarlo
     },

     getImage: (req,res) =>{
         var file = req.params.image;
         var path_file = './upload/articles/'+file; 

         fs.exists(path_file, (exists) => {
             
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }

         });
    
    },
     

    search: (req,res) => {
        //Sacar el string a buscar
        var searchString = req.params.search;  
        //find or
        Article.find({ "$or": [
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}},

        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion',
                });
            }
            if(!articles || articles.length <= 0){
                return res.status(500).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!!',
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });

        
    }


}; //end controller

module.exports = controller;