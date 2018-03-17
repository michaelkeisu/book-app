const Book = require('../models/book');
const extractErrors = require('../utils/extract-errors');

module.exports = {
    createBook,
    findBook,
    getBooks,
    updateBook,
    removeBook
};

async function createBook(req, res) {
    try {
        const {title, author, year} = req.body;
        const b = new Book({title, author, year});
        b.title = title;
        b.author = author;
        b.year = year;
        const book = await b.save();
        res.status(201).json({id: book._id, message: 'Book successfully created!'});
    } catch (err) {
        const errors = extractErrors(err);
        if (errors) {
            return res.status(400).json({message: 'Validation failed.', errors});
        }
        res.status(500).json({message: STATUS_500_MESSAGE})
    }
}

async function findBook(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({message: STATUS_404_MESSAGE});
        }
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({message: STATUS_500_MESSAGE});
    }

}

async function getBooks(req, res) {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({message: STATUS_500_MESSAGE});
    }
}

async function updateBook(req, res) {
    try {
        const book = await Book.findById(req.params.id)
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
        await book.save();
        res.status(200).json({message: 'Book successfully updated!'});
    } catch (err) {
        res.status(500).json({message: STATUS_500_MESSAGE})
    }
}

async function removeBook(req, res) {
    try {
        const book = await Book.remove({_id: req.params.id});
        if (!book) {
            return res.status(404).json({message: STATUS_404_MESSAGE});
        }
        res.status(200).json({message: 'Book successfully deleted!'});
    } catch (error) {
        res.status(500).json({message: STATUS_500_MESSAGE});
    }
}

const STATUS_500_MESSAGE = 'Something went very wrong. Contact site admin.';


const STATUS_404_MESSAGE = 'Could not find book with the given id.';