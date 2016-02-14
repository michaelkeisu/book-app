var books = require('./rest/books');


module.exports = function (app) {
    app.post('/rest/books/', books.createBook);
    app.put('/rest/books/:id', books.updateBook);
    app.get('/rest/books', books.getBooks);
    app.get('/rest/books/:id', books.findBook);
    app.delete('/rest/books/:id', books.removeBook);
};