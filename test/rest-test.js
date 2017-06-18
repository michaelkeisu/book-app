const config = require('../config/config');
const expect = require('chai').expect;
const Book = require( '../models/book');
const User = require('../models/user');
const request = require('superagent');
const app = require('../server');

describe('Some basic Book CRUD', () => {
    before((done) => {
        const baseUrl = 'http://127.0.0.1:' + config.testPort + '/rest';
        global.server = app.listen(config.testPort);
        global.BOOK_URL = baseUrl + '/books/';
        request.post(baseUrl + '/users/signup')
            .send({username: 'janedoe', password: 'qwerty'})
            .end((err, res) => {
                expect(err).to.eql(null);
                expect(res.status).to.equal(201);
                request.post(baseUrl + '/users/authenticate')
                    .send({username: 'janedoe', password: 'qwerty'})
                    .end((err, res) => {
                        expect(err).to.eql(null);
                        expect(res.status).to.equal(200);
                        expect(res.token).not.to.eql(null);
                        global.token = res.body.token;
                        done();
                    });
            });

    });

    it('should find empty list of books before any are added', (done) => {
        request.get(BOOK_URL)
            .set('Authorization', token)
            .end((err, res) => {
                expect(err).to.eql(null);
                expect(res.status).to.equal(200);
                const books = res.body;
                expect(books.length).to.equal(0);
                done();
            })
    });

    it('should succeed adding book', (done) => {
        request.post(BOOK_URL)
            .set('Authorization', token)
            .send({title: 'The Art Of War', author: 'Sun Tzu', year: '500 BC'})
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body.message).to.equal('Book successfully created!');
                global.bookId = res.body.id;
                done();
            });
    });

    it('should succeed updating a book', (done) => {
        request.put(BOOK_URL + bookId)
            .set('Authorization', token)
            .send({year: '~500 BC'})
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Book successfully updated!');
                Book.findById(bookId, (err, book) => {
                    expect(err).to.eql(null);
                    expect(book.year).to.equal('~500 BC');
                    done();
                });
            })
    });

    it('should find a book with a given id', (done) => {
        request.get(BOOK_URL + bookId)
            .set('Authorization', token)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                const book = res.body;
                expect(err).to.eql(null);
                expect(book.title).to.equal('The Art Of War');
                expect(book.author).to.equal('Sun Tzu');
                expect(book.year).to.equal('~500 BC');
                done();
            })
    });

    it('should succeed deleting a book', (done) => {
        request.del(BOOK_URL + bookId)
            .set('Authorization', token)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Book successfully deleted!');
                Book.findById(bookId, (err, book) => {
                    expect(err).to.eql(null);
                    expect(book).to.eql(null);
                    done();
                });
            })
    });

    it('should fail to find deleted book', (done) => {
        request.get(BOOK_URL + bookId)
            .set('Authorization', token)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal('Could not find book with the given id.');
                done();
            })
    });

    it('should fail to delete non-existing book', (done) => {
        request.get(BOOK_URL + bookId)
            .set('Authorization', token)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal('Could not find book with the given id.');
                done();
            })
    });

    it('should fail to create a book without required parameters', (done) => {
        request.post(BOOK_URL)
            .set('Authorization', token)
            .send({year: '1987'})
            .end((err, res) => {
                expect(res.status).to.eql(400);
                expect(res.body.message).to.equal('Validation failed.');
                expect(res.body.errors.length).to.equal(2);
                expect(res.body.errors[0]).to.equal('Title is required.');
                expect(res.body.errors[1]).to.equal('Author is required.');
                done();
            })
    });

    after((done) => {
        server.close();
        Book.remove({}, (err) => {
            expect(err).to.eql(null);
        });
        User.remove({}, (err) => {
            expect(err).to.eql(null);
            done();
        })
    });
});