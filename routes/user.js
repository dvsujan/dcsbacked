// USER INFO
const express = require('express');
const { modelNames } = require('mongoose');
const router = express.Router();
const multer = require('multer')
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../util/checkAuth');
const sharp = require('sharp');
const fs = require('fs');
const Mail = require('../util/SendMail');
const path = require('path');
require('dotenv').config()

const generateVerificationCode = () => {
	var minm = 100000;
	var maxm = 999999;
	const down = Math.floor(Math
		.random() * (maxm - minm + 1)) + minm;
	return down;
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './HQPost/');
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

const upload = multer({
	storage: storage,
	limit: {
		filesize: 1024 * 1024 * 20,
	},
	fileFilter: fileFilter,
})

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

router.get('/:id', (req, res, next) => {
	const id = req.params.id;
	User.findById(id)
		.then((user) => {
			resobj = {
				username: user.username,
				bio: user.bio,
				DP: user.DP,
				name: user.name,
			}
			res.status(200).json(resobj);
		})
		.catch((err) => {
			res.status(400).json({
				message: 'user not found',
			})
		})
});

router.post('/register', (req, res) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(409).json({
					message: "Mail exists"
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						console.log(err);
						return res.status(500).json({
							error: err
						});
					} else {
						const user = new User({
							email: req.body.email,
							password: hash,
							username: req.body.username.toLowerCase(),
							name: req.body.name,
							admin: req.body.admin,
						});
						user
							.save()
							.then(result => {
								const token = jwt.sign({
									email: result.email,
									userId: result._id
								}, process.env.JWT_TMP, {
									expiresIn: "1h"
								});
								Mail.sendMail(result.email, token);
								res.status(201).json({
									success: true,
									message: "User created",
								});
							})
							.catch(err => {
								console.log(err);
								if (err.code == 11000) {
									res.status(209).json({
										message: 'Username already Exists',
									})
								}
								else {
									res.status(500).json({
										error: err
									});
								}
							});
					}
				});
			}
		});
});


router.patch('/', checkAuth, upload.single('ProfileImage'), async (req, res) => {
	const userId = req.userData.userId;
	const name = req.body.name;
	const DP = req.file.path;
	User.findByIdAndUpdate(userId, { name: name, DP: DP }).then(() => {
		res.json.status(200)({ success: true, message: "done" });
	}
	).catch((err) => {
		console.log(err);
	}
	)
})

router.post("/login", (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(401).json({
					message: "Auth failed"
				});
			}
			else if (user[0].active == false) {
				return res.status(401).json({
					message: "Account Not Activated",
				})
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: "Auth failed"
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							email: user[0].email,
							userId: user[0]._id,
							username: user[0].username,
							admin: user[0].admin,
						},
						process.env.JWT_KEY,
						{
							expiresIn: "10d"
						}
					);

					return res.status(200).json({
						message: "Auth successful",
						token: token
					});
				}
				res.status(401).json({
					message: "Auth failed"
				});
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});


router.delete("/", checkAuth, (req, res, next) => {
	User.remove({ _id: req.userData.userId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "User deleted"
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});


router.get('/verify/:jwt', (req, res) => {
	const token = req.params.jwt;
	jwt.verify(token, process.env.JWT_TMP, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				message: "Auth failed"
			});
		}
		User.findOneAndUpdate({ email: decoded.email }, { active: true }).then(() => {
			res.sendFile(path.join(__dirname, '../verify.html'));
		})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			})
	})
})

module.exports = router; 