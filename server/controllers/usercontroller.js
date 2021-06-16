const router = require('express').Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        const { username, passwordhash } = req.body.user;

        const newUser = await User.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 15)
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })

        res.status(201).json({
            message: 'User successfully registered',
            user: newUser,
            sessionToken: token
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to register user',
            Error: err
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, passwordhash } = req.body.user;

        const loginUser = await User.findOne({
            where: {
                username: username
            }
        })
        if (loginUser) {

            let passwordCompare = await bcrypt.compare(passwordhash, loginUser.passwordhash);

            if (passwordCompare) {
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })

                res.status(200).json({
                    user: loginUser,
                    message: 'User successfully logged in!',
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: 'Incorrect email or password'
                })
            }
        } else {
            res.status(401).json({
                message: 'Incorrect email or password'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Failed to log in user',
            Error: err
        })
    }
})

module.exports = router;