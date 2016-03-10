import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: {type: String, required: 'Username is required.', unique: 'Username must be unique.'},
    password: {type: String, required: 'Password is required.'}
});


// interestingly arrow function syntax does not work here.. find out why
UserSchema.pre('save', function(next) {
    var user = this;
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


UserSchema.methods.comparePassword = (password, callback) => {
    bcrypt.comparePassword(password, this.password, (err, isMatch) => {
        if(err) {
            callback(err);
        }
        callback(null, isMatch);
    });
};

export default mongoose.model('User', UserSchema)