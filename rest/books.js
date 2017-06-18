const Book = require('../models/book');
const extractErrors = require('../utils/extract-errors');

module.exports = {
    createBook: createBook,
    findBook: findBook,
    getBooks: getBooks,
    updateBook: updateBook,
    removeBook: removeBook
};

function createBook(req, res) {
    const book = new Book();
    const {title, author, year} = req.body;
    book.title = title;
    book.author = author;
    book.year = year;
    book.save((err, book) => {
        if (err) {
            const validationErrors = extractErrors(err);
            if (validationErrors) {
                res.status(400).json({message: 'Validation failed.', errors: validationErrors});
            } else {
                res.status(500).json({message: STATUS_500_MESSAGE})
            }
        } else {
            res.status(201).json({id: book._id, message: 'Book successfully created!'});
        }
    });
}

function findBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            res.status(500).json({message: STATUS_500_MESSAGE});
        } else if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({message: STATUS_404_MESSAGE});
        }
    });
}

function getBooks(req, res) {
    Book.find((err, books) => {
        if (err) {
            res.status(500).json({message: STATUS_500_MESSAGE});
        } else {
            res.status(200).json(books);
        }
    });
}

function updateBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
            if (err) {
                return res.status(500).json({message: STATUS_500_MESSAGE});
            }
            if (!book) {
                return res.status(404).json({message: STATUS_404_MESSAGE});
            }
            const {title, author, year} = req.body;
            if (title) {
                book.title = title;
            }
            if (author) {
                book.author = author;
            }
            if (year) {
                book.year = year;
            }
            book.save((err) => {
                if (err) {
                    res.status(500).json({message: STATUS_500_MESSAGE});
                } else {
                    res.status(200).json({message: 'Book successfully updated!'});
                }
            });
        }
    );
}

function removeBook(req, res) {
    Book.remove({_id: req.params.id}, (err, book) => {
        if (err) {
            res.status(500).json({message: STATUS_500_MESSAGE});
        } else if (book) {
            res.status(200).json({message: 'Book successfully deleted!'});
        } else {
            res.status(404).json({message: STATUS_404_MESSAGE});
        }
    });
}

const STATUS_500_MESSAGE = 'Something went very wrong. Contact site admin.';


const STATUS_404_MESSAGE = 'Could not find book with the given id.';