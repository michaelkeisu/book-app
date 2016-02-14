var express = require('express')
    , books = require('./rest/books');


module.exports = (app) => {
    var restRouter = express.Router();
    var bookRouter = express.Router();
    app.use('/rest', restRouter);
    restRouter.use('/books', bookRouter);

    bookRouter.route('/')
        .post(books.createBook)
        .get(books.getBooks);
    bookRouter.route('/:id')
        .put(books.updateBook)
        .get(books.findBook)
        .delete(books.removeBook)

};