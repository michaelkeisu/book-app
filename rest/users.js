const User = require('../models/user');
const config = require('../config/config');
const jwt = require('jwt-simple');
const extractErrors = require('../utils/extract-errors');

module.exports = {
    authenticate,
    signup
};

function authenticate(req, res) {
    User.findOne({
        username: req.body.username
    }).then((user) => {
        if (!user) {
            return res.status(401).json({message: 'Authentication failed.'});
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                const token = jwt.encode(user, config.secret);
                res.status(200).json({token: 'JWT ' + token});
            } else {
                res.status(401).json({message: 'Authentication failed.'});
            }
        });
    }).catch(() => {
        return res.sendStatus(500);
    });
}

function signup(req, res) {
    const {username, password} = req.body;

    const user = new User({
        username,
        password
    });

    user.save().then(() => {
        res.status(201).json({id: user._id})
    }).catch((err) => {
        if (err.code == '11000') {
            return res.status(400).json({message: 'An user with this username already exists'});
        }
        const validationErrors = extractErrors(err);
        if (validationErrors) {
            res.status(400).json({message: 'Validation failed.', validationErrors: validationErrors});
        } else {
            res.status(500).json({message: STATUS_500_MESSAGE});
        }
    });
}