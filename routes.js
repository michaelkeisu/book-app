var bookAPI = require('./rest-api/book');


module.exports =  function (app) {
	app.post('/books/', bookAPI.createBook);
	app.put('/books/:id', bookAPI.updateBook);
	app.get('/books', bookAPI.getBooks);
	app.get('/books/:id', bookAPI.findBook);
	app.delete('/books/:id', bookAPI.removeBook);
};