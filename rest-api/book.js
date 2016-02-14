'use strict';
var Book = require('../models/book');

module.exports = {
    createBook: function (req, res) {
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.year = req.body.year;
        book.save(function (err, book) {
            if (err) {
                res.status(500).json({errors: extractErrorMessages(err.errors)});
            } else {
                res.status(201).json({id: book._id, message: 'Book successfully created!'});
            }
        });
    },
    findBook: function (req, res) {
        Book.findById(req.params.id, function (err, book) {
            if (book) {
                res.status(200).json(book);
            } else if(!err && !book) {
                res.status(404).json({message: STATUS_404_MESSAGE});
            } else {
                res.status(500).json({message: STATUS_500_MESSAGE});
            }

        });
    },
    getBooks: function (req, res) {
        Book.find(function (err, books) {
            if (err) {
                res.status(500).json({message: STATUS_500_MESSAGE});
            } else {
                res.status(200).json(books);
            }
        });
    },
    updateBook: function (req, res) {
        Book.findById(req.params.id, function (err, book) {
                if (err) {
                    res.status(500).json({message: STATUS_500_MESSAGE});
                    return;
                }
                if (!book) {
                    res.status(404).json({message: STATUS_404_MESSAGE});
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
                        res.status(500).json({message: STATUS_500_MESSAGE});
                    } else {
                        res.sendStatus(200);
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
                res.status(500).json({message: STATUS_500_MESSAGE});
            } else {
                res.status(200).json({message: 'Book successfully deleted.'});
            }
        });
    }
};

function extractErrorMessages(pErrors) {
    var errors = [];
    Object.keys(pErrors).forEach(function (error) {
        if (pErrors.hasOwnProperty(error)) {
            errors.push({
                property: error,
                type: pErrors[error].name,
                message: pErrors[error].message
            })
        }
    });
    return errors;
}

const STATUS_500_MESSAGE = 'Something went very wrong. Contact site admin.';


const STATUS_404_MESSAGE = 'Could not find any book with the given id.';