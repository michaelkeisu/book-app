process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
    config = require('../config'),
    Book = require('../models/book'),
    request = require('superagent');


describe('Some basic Book CRUD', () => {
    before((done) => {
        this.server = require('../server').listen(config.testPort);
        this.URL = 'http://127.0.0.1:' + config.testPort + '/rest/books/';
        done();
    });

    it('should find empty list of books before any are added', (done) => {
        request.get(this.URL)
            .end((err, res) => {
                expect(err).to.eql(null);
                expect(res.status).to.equal(200);
                var books = res.body;
                expect(books.length).to.equal(0);
                done();
            })
    });

    it('should succeed adding book', (done) => {
        var scope = this;
        request.post(this.URL)
            .send({title: 'The Art Of War', author: 'Sun Tzu', year: '500 BC'})
            .end((err, res) => {
                expect(res.status).to.equal(201);
                console.log(res.body.message);
                expect(res.body.message).to.equal('Book successfully created!');
                scope.bookId = res.body.id;
                done();
            });
    });

    it('should succeed updating a book', (done) => {
        var id = this.bookId;
        request.put(this.URL + id)
            .send({year: '~500 BC'})
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Book successfully updated!');
                Book.findById(id, (err, book) => {
                    expect(err).to.eql(null);
                    expect(book.year).to.equal('~500 BC');
                    done();
                });
            })
    });

    it('should find a book with a given id', (done) => {
        var id = this.bookId;
        request.get(this.URL + id)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                var book = res.body;
                expect(err).to.eql(null);
                expect(book.title).to.equal('The Art Of War');
                expect(book.author).to.equal('Sun Tzu');
                expect(book.year).to.equal('~500 BC');
                done();
            })
    });

    it('should succeed deleting a book', (done) => {
        var id = this.bookId;
        request.del(this.URL + id)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Book successfully deleted!');
                Book.findById(id, (err, book) => {
                    expect(err).to.eql(null);
                    expect(book).to.eql(null);
                    done();
                });
            })
    });

    it('should fail to find deleted book', (done)  => {
        var id = this.bookId;
        request.get(this.URL + id)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal('Could not find any book with the given id.');
                done();
            })
    });

    it('should fail to delete non-existing book', (done)  => {
        var id = this.bookId;
        request.get(this.URL + id)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal('Could not find any book with the given id.');
                done();
            })
    });

    it('should fail to create a book without required parameters', (done) => {
        request.post(this.URL)
            .send({year: '1987'})
            .end((err, res) => {
                expect(res.status).to.eql(400);
                expect(res.body.errors.length).to.equal(2);
                expect(res.body.errors[0].message).to.equal('Title is required');
                expect(res.body.errors[1].message).to.equal('Author is required');
                done();
            })
    });

    // TODO: more tests

    after((done) => {
        this.server.close();
        Book.remove({}, (err) => {
            expect(err).to.eql(null);
            done();
        });
    });
});