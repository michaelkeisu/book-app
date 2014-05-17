var bookDataStore = require('../datastore/book');

module.exports = {
	createBook: function (req, res) {
		var book = req.body;
		console.log(req.body);
		console.log('Saving book with the following structure ' + JSON.stringify(book));
		bookDataStore.createBook(book);
		res.send(book);
	},
	findBook: function (req, res) {
		var book = bookDataStore.findBook(req.params.id);
		console.log('Getting a book with id ' + req.params.id);	
		if (book == null) {
			console.log('Could not find book');
			res.send(404);
		} 
		res.json(book);
	},
	getBooks: function (req, res) {
		console.log('In GET function ');
		res.json(bookDataStore.getBooks());
	},
	updateBook: function (req, res) {
		var book = req.body;
		console.log('Updating  Book ' + JSON.stringify(book));
		var currentBook = bookDataStore.findBook(parseInt(req.params.id, 10));
		if (currentBook == null) {
			console.log('Could not find book');
			res.send(404);
		} 
		currentBook.title = book.title;
		currentBook.author = book.author;
		currentBook.year = book.year;
		res.send(book);
		
	},
	removeBook: function (req, res) {
		var book = bookDataStore.findBook(req.params.id);
		if (book == null) {
			console.log('Could not find book');
			res.send(404);
		}
		console.log('Deleting ' + req.params.id);
		bookDataStore.removeBook(req.params.id);
		res.send(200);
	}
}