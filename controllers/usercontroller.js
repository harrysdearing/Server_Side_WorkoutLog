const router = require('express').Router();
const User = require('../database').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post("/register", (req, res) => {
    User.create({
            username: req.body.user.username,
            password: bcrypt.hashSync(req.body.user.password, 10),
        })
        .then((user) => {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24,
            });
            res.status(200).json({
                user: user,
                message: 'User successfully created',
                sessionToken: token,
            });
        })
        .catch((err) => res.status(500).json({ error: err }));
});


router.post('/login', function(req, res) {
    User.findOne({
            where: {
                username: req.body.user.username
            }
        })
        .then(function loginSuccess(user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, function(err, matches) {
                    if (matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 }); //if the user exists, create a token so they can use it
                        res.status(200).json({
                            user: user,
                            message: 'User successfully logged in',
                            sessionToken: token,
                        })
                    } else {
                        res.status(502).send({ error: 'Login Failed' })
                    }
                });
            } else {
                res.status(500).json({ error: 'User does not exist.' });
            }
        })
        .catch(err => res.status(500).json({ error: err }))
});

module.exports = router; //must export this to the app.js file so that it is included in our server (app.js is the only file read by the server)