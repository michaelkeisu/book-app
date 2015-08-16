var Book = require('../models/book');

module.exports = {
    createBook: function (req, res) {
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.year = req.body.year;
        book.save(function (err) {
            if (err) {
                status500Message(res);
            } else {
                res.status(201).json({message: 'Book successfully created!'});
            }
        });
    },
    findBook: function (req, res) {
        Book.findById(req.params.id, function (err, book) {
            if (err) {
                status500Message(res);
                return;
            }
            if (book) {
                res.status(200).json(book);
            } else {
                status404Message(res)
            }
        });
    },
    getBooks: function (req, res) {
        Book.find(function (err, books) {
            if (err) {
                status500Message(res);
            } else {
                res.status(200).json(books);
            }
        });
    },
    updateBook: function (req, res) {
        Book.findById(req.params.id, function (err, book) {
                if (err) {
                    status500Message(res);
                    return;
                }
                if (!book) {
                    status404message(res);
                    return;
                }
                var requestBook = req.body;
                if (requestBook.title) {
                    book.title = requestBook.title;
                }
                if (requestBook.author) {
                    book.author = requestBook.author;
                }
                if (requestBook.year) {
                    book.year = requestBook.year;
                }
                book.save(function (err) {
                    if (err) {
                        status500Message(res);
                    } else {
                        res.status(200).json(this); // TODO verify
                    }
                });
            }
        )
        ;
    },
    removeBook: function (req, res) {
        Book.remove({
            _id: req.params.id
        }, function (err) {
            if (err) {
                status500Message(res);
            } else {
                res.status(200).json({message: 'Book successfully deleted.'});
            }
        });
    }
};

function status500Message(res) {
    res.status(500).json({message: 'Something went very wrong. Contact site admin.'});
}
function status404Message(res) {
    res.status(404).json({message: 'Could not find any book with that id.'});
}
