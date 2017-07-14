const passport = require('passport');
const passportJwt = require('passport-jwt');

const {
    Strategy,
    ExtractJwt
} = passportJwt;

const User = require('../models/user');
const config = require('./config');


const opts = {};

opts.secretOrKey = config.secret;
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

passport.use(new Strategy(opts, (jwtPayload, done) => {
    User.findOne({id: jwtPayload.id}).then((user) => {
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    }).catch((err) => {
        done(err);
    });
}));

module.exports = passport;