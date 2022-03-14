// USER INFO
const express = require('express');
const { modelNames } = require('mongoose');
const router = express.Router();
const multer = require('multer')
const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../util/checkAuth');
const checkAdmin = require('../util/checkAdmin');
const sharp = require('sharp');
const fs = require('fs');
require('dotenv').config()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Posters/');
    },
    filename: function (req, file, cb) {
        cb(null, makeid(10) + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
});

const addRating = async (movies) => {
    let moviesWithRating = [];
    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        let reviews = await Review.find({ movieId: movie._id });
        let sum = 0;
        for (let j = 0; j < reviews.length; j++) {
            sum += reviews[j].rating;
        }
        const average = sum / reviews.length ;
        if (reviews.length <= 0) {
            moviesWithRating.push(
                {
                    _id: movie._id,
                    name: movie.name,
                    poster: "http://"+process.env.APIURL+ "/" + movie.poster,
                    description: movie.description,
                    genre: movie.genre,
                    duration: movie.duration,
                    releaseDate: movie.release, 
                    rating: 0
                }
            );
        }
        else {
            moviesWithRating.push(
                {
                    _id: movie._id,
                    name: movie.name,
                    poster: "http://"+process.env.APIURL+ "/" + movie.poster,
                    description: movie.description,
                    genre: movie.genre,
                    duration: movie.duration,
                    releaseDate: movie.release, 
                    rating: average,
                    
                }
            );
        }
    }
    return moviesWithRating;
}


router.get('/', checkAuth, async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || 'release';
    const order = req.query.order || 'asc';
    const query = req.query.query || {};
    const offset = (page - 1) * limit;
     Movie.find(query)
        .sort({ [sort]: order })
        .skip(offset)
        .limit(limit)
        .exec((err, movies) => {
            if (err) {
                return res.status(400).json({
                    message: 'error occured',
                    error: err
                });
            }
            Movie.countDocuments(query, async (err, count) => {
                if (err) {
                    return res.status(400).json({
                        message: 'error occured',
                        error: err
                    });
                }
                addRating(movies).then(moviess => {
                    res.status(200).json({
                        success: true,
                        totalPages: Math.ceil(count / limit),
                        page: page,
                        totalcount: count,
                        movies: moviess
                    });
                }).catch(err => {
                    res.status(400).json({
                        message: 'error occured',
                        error: err
                    });
                }
                )
            })
        })
});

router.get('/:movieId', checkAuth, async (req, res) => {
    const movieId = req.params.movieId;
    Movie.findById(movieId, (err, movie) => {
        if (err) {
            return res.status(400).json({
                message: 'error occured',
                error: err
            });
        }
        if (!movie) {
            return res.status(400).json({
                message: 'movie not found'
            });
        }
        addRating([movie]).then(moviess => {
            res.status(200).json({
                success: true,
                movies: moviess
            });
        }).catch(err => {
            res.status(400).json({
                message: 'error occured',
                error: err
            });
        }
        )
    }
    )
});

router.post('/', checkAuth, checkAdmin, upload.single('Poster'), async (req, res) => {
    const movie = {
        name: req.body.name,
        description: req.body.description,
        release: req.body.release,
        poster: req.file.path,
        genre: req.body.genre,
        duration: Number(req.body.duration),
        date:req.body.date||Date.now(),
    }
    const newMovie = new Movie(movie);
    try {
        const savedMovie = await newMovie.save();
        res.status(201).json({
            success:true, 
            movie: savedMovie
        });
    } catch (err) {
        res.status(400).json({
            success:false, 
            message: 'error occured',
            error: err
        });
    }
})

router.patch('/:movieId', checkAuth, checkAdmin, async (req, res) => {
    try {

        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.status(404).json({
                message: 'movie not found'
            })
        }

        if (req.body.name) {
            movie.name = req.body.name;
        }

        if (req.body.description) {
            movie.description = req.body.description;
        }

        if (req.body.release) {
            movie.release = req.body.release;
        }

        if (req.body.genre) {
            movie.genre = req.body.genre;
        }

        if (req.body.duration) {
            movie.duration = Number(req.body.duration);
        }

        const savedMovie = await movie.save();
        res.status(200).json({
            success:true, 
            movie: savedMovie
        })
    } catch (err) {
        res.status(400).json({
            success:false, 
            message: 'error occured',
            error: err
        })
    }
});

router.delete('/:movieId', checkAuth, checkAdmin, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).json({
                message: 'movie not found'
            })
        }
        await movie.remove();
        res.status(200).json({
            success: true,
        })
    } catch (err) {
        res.status(400).json({
            success:false, 
            message: 'error occured',
            error: err
        })
    }
})

module.exports = router; 