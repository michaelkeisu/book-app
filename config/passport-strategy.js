import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import User from '../models/user'
import config from  './config'


var opts = {};

opts.secretOrKey = config.secret;
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({id: jwtPayload.id}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));

export default passport