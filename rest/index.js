import express from 'express'
import passport from '../config/passport-strategy'
import books from './books'
import users from './users'

export default function (app) {
    var restRouter = express.Router(),
        bookRouter = express.Router(),
        userRouter = express.Router();

    app.use(passport.initialize());
    app.use('/rest', restRouter);

    restRouter.use(userRouter);
    userRouter.post('/users/signup', users.signup);
    userRouter.post('/users/authenticate', users.authenticate);

    restRouter.use(bookRouter);
    bookRouter.use(passport.authenticate('jwt', {session: false}));
    bookRouter.route('/books/')
        .post(books.createBook)
        .get(books.getBooks);
    bookRouter.route('/books/:id')
        .put(books.updateBook)
        .get(books.findBook)
        .delete(books.removeBook);
};