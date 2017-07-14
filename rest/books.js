const Book = require('../models/book');
const extractErrors = require('../utils/extract-errors');

module.exports = {
    createBook,
    findBook,
    getBooks,
    updateBook,
    removeBook
};

function createBook(req, res) {
    const book = new Book();
    const {title, author, year} = req.body;
    book.title = title;
    book.author = author;
    book.year = year;
    book.save().then((book) => {
        res.status(201).json({id: book._id, message: 'Book successfully created!'});
    }).catch((err) => {
        const validationErrors = extractErrors(err);
        if (validationErrors) {
            return res.status(400).json({message: 'Validation failed.', errors: validationErrors});
        }
        res.status(500).json({message: STATUS_500_MESSAGE})
    });
}

function findBook(req, res) {
    Book.findById(req.params.id).then((book) => {
        if (!book) {
            return res.status(404).json({message: STATUS_404_MESSAGE});
        }
        res.status(200).json(book);
    }).catch(() => {
        res.status(500).json({message: STATUS_500_MESSAGE});
    })
}

function getBooks(req, res) {
    Book.find().then((books) => {
        res.status(200).json(books);
    }).catch(() => {
        res.status(500).json({message: STATUS_500_MESSAGE});
    })
}

function updateBook(req, res) {
    Book.findById(req.params.id).then((book) => {
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
            book.save().then(() => {
                res.status(200).json({message: 'Book successfully updated!'});
            }).catch(() => {
                res.status(500).json({message: STATUS_500_MESSAGE})
            });
        }
    ).catch(() => {
        res.status(500).json({message: STATUS_500_MESSAGE});
    });
}

function removeBook(req, res) {
    Book.remove({_id: req.params.id}).then((book) => {
        if (!book) {
            return res.status(404).json({message: STATUS_404_MESSAGE});
        }
        res.status(200).json({message: 'Book successfully deleted!'});
    }).catch(() => {
        res.status(500).json({message: STATUS_500_MESSAGE});
    });
}

const STATUS_500_MESSAGE = 'Something went very wrong. Contact site admin.';


const STATUS_404_MESSAGE = 'Could not find book with the given id.';