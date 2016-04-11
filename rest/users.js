import User from '../models/user'
import config from '../config/config'
import jwt from 'jwt-simple'
import extractErrors from '../utils/extract-errors'

export default {
    authenticate: authenticate,
    signup: signup
}

function authenticate(req, res) {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) {
            return res.sendStatus(500);
        }
        if (!user) {
            return res.status(401).json({message: 'Authentication failed.'});
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                var token = jwt.encode(user, config.secret);
                res.status(200).json({token: 'JWT ' + token});
            } else {
                res.status(401).json({message: 'Authentication failed.'});
            }
        });
    });
}

function signup(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var user = new User({
        username: username,
        password: password
    });

    user.save((err) => {
        if (err) {
            if (err.code == '11000') {
                return res.status(400).json({message: 'An user with this username already exists'});
            }
            var validationErrors = extractErrors(err);
            if (validationErrors) {
                res.status(400).json({message: 'Validation failed.', validationErrors: validationErrors});
            } else {
                res.status(500).json({message: STATUS_500_MESSAGE});
            }
        } else {
            res.status(201).json({id: user._id})
        }
    });
}