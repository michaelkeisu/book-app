const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {type: String, required: 'Username is required.', unique: 'Username must be unique.'},
    password: {type: String, required: 'Password is required.'}
});

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            callback(err);
        }
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema)