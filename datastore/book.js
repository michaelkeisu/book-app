var books = [
	{ id: 98, author: 'Stephen King', title: 'The Shining', year: 1977 },
	{ id: 99, author: 'Jim Butcher', title: "Cold Days" }
]

var bookId = 100;


module.exports = {
	createBook: function (book) {
		book.id = bookId++;
		books.push(book);
	},
	getBooks: function () {
		return books;
	}, 
	findBook: function (id) {
		for (var i = 0; i < books.length; i++) {
			if (books[i].id == id) {
				return books[i];
			}
		}
		return null;
	},
	removeBook: function (id) {
		var bookIndex = 0;
		for (var i = 0; i < books.length; i++) {
			if (books[i].id == id) {
				bookIndex = i;
			}
		}
		books.splice(bookIndex, 1);
	}
}