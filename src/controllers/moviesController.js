const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
         .then(movie => {
                
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render("moviesAdd")
       },            
    create: function (req, res) {
        console.log("Esta es la fecha " + req.body.release_date)
        const {title, rating, awards, release_date, length} = req.body;
        db.Movie.create({
            title,
            rating: parseInt(rating),
            awards: parseInt(awards),
            release_date,
            length: parseInt(length),            
        })
        .then((movie)=>{
            res.redirect("/movies")
        })
        .catch(error=>{
            console.log(error);
        })
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
        .then(Movie => {
            let year = Movie.release_date.getFullYear() 
            let mes = (Movie.release_date.getMonth()+ 1) 
            let dia = Movie.release_date.getDate() 
            if(mes < 10){mes = "0" + mes}

            if(dia < 10){dia = "0" + dia }
            
            let fechaCorta = year + "-" + mes + "-" + dia    
            console.log(fechaCorta)                   
            res.render('moviesEdit', {Movie,fechaCorta});
        });
    },
    update : (req,res) =>{
        console.log("este es el body",req.body)
        console.log("este es params",req.params)

        db.Movie.update(
            {
                title : req.body.title,
                rating : req.body.rating,
                awards : req.body.awards,
                release_date : req.body.release_date,
                length : req.body.length
        
            },
            {
                where : {
                    id : req.params.id
                }
            })
            .then(movie =>{
                res.redirect("/movies")
        
            })
        
            },
            delete: function (req, res) {
                db.Movie.findByPk(req.params.id)
                    .then(Movie => {
                        res.render('moviesDelete.ejs', {Movie});
                    });
            },
            destroy: function (req, res) {
                db.Movie.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(()=>{
                    res.redirect("/movies")
                })
                .catch((error) =>{ console.log(error)})
                
            }
        
}

module.exports = moviesController;