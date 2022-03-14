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


router.get('/:movieid', checkAuth, (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || 'release';
    const order = req.query.order || 'asc';
    const query = req.query.query || {};
    const offset = (page - 1) * limit;
    Review.find({ movieid: req.params.movieid })
        .sort({ [sort]: order })
        .skip(offset)
        .limit(limit)
        .exec((err, reviews) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: 'error or no reviews found'
                });
            }
            res.json.status(200)(
                {
                    success: true,
                    reviews: reviews
                }
            );
        });
});

router.post('/:movieId', checkAuth, (req, res) => {
    const reviewm = new Review({
        movieId: req.params.movieId,
        userid: req.userData.userid,
        review: req.body.review,
        rating: Number(req.body.rating)
    });
    Review.findOne({ movieid: req.params.movieId, userid: req.userData.userid }, (err, review) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            });
        }
        if (review) {
            return res.status(400).json({
                success: false,
                error: 'Review already exists'
            });
        }
        else {
            new Review(reviewm).save((err, review) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        error: err
                    });
                }
                res.status(200).json({
                    success: true,
                    data: review
                });
            }
            );
        }
    }
    );
});


router.patch('/:movieId', checkAuth, (req, res) => {
    const review = req.body.review;
    Review.updateOne({ movieid: req.params.movieId, userid: req.userData.userid }, { review: review }, (err, review) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                error: err
            });
        }
        res.status(200).json({
            success: true,
            data: review
        });
    }
    );
});


router.delete('/', checkAuth, (req, res) => {
    Review.deleteOne({ _id: req.body.id }, (err, review) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: 'error in deleting review'
            });
        }
        res.json({
            success: true
        });
    });
})

module.exports = router; 