import express from 'express'
import books from './books'


export default function(app) {
    var bookRouter = express.Router();
    app.use('/rest/books', bookRouter);

    bookRouter.route('/')
        .post(books.createBook)
        .get(books.getBooks);
    bookRouter.route('/:id')
        .put(books.updateBook)
        .get(books.findBook)
        .delete(books.removeBook)

};