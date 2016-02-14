process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
    config = require('../config'),
    Book = require('../models/book'),
    request = require('superagent');


describe('Some basic Book CRUD', function () {
    before(function (done) {
        this.server = require('../server').listen(config.testPort);
        this.URL = 'http://127.0.0.1:' + config.testPort + '/books/';
        done();
    });

    it('should succeed adding book', function (done) {
        var scope = this;
        request.post(this.URL)
            .send({title: 'The Art Of War', author: 'Sun Tzu', year: '500 BC'})
            .end(function (err, res) {
                expect(res.status).to.equal(201);
                scope.bookId = res.body.id;
                done();
            });
    });

    it('should succeed updating a book', function (done) {
        var id = this.bookId;
        request.put(this.URL + id)
            .send({year: '~500 BC'})
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                Book.findById(id, function (err, book) {
                    expect(err).to.eql(null);
                    expect(book.year).to.equal('~500 BC');
                    done();
                });
            })
    });

    it('should find a book with a given id', function (done) {
        var id = this.bookId;
        request.get(this.URL + id)
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                var book = res.body;
                expect(err).to.eql(null);
                expect(book.title).to.equal('The Art Of War');
                expect(book.author).to.equal('Sun Tzu');
                expect(book.year).to.equal('~500 BC');
                done();
            })
    });

    it('should succeed deleting a book', function (done) {
        var id = this.bookId;
        request.del(this.URL + id)
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                var book = Book.findById(id, function (err, book) {
                    expect(err).to.eql(null);
                    expect(book).to.eql(null);
                    done();
                });
            })
    });

    it('should fail to post a book without required parameters', function (done) {
        request.post(this.URL)
            .send({year: '1987'})
            .end(function (err, res) {
                expect(res.status).to.eql(500);
                expect(res.body.errors.length).to.equal(2);
                expect(res.body.errors[0].type).to.equal('ValidatorError');
                expect(res.body.errors[1].type).to.equal('ValidatorError');
                expect(res.body.errors[0].message).to.equal('Title is required');
                expect(res.body.errors[1].message).to.equal('Author is required');
                done();
            })
    });

    it('should fail to find deleted book', function (done) {
        var id = this.bookId;
        request.get(this.URL + id)
            .end(function (err, res) {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal('Could not find any book with the given id.');
                done();
            })
    });


    // TODO: more tests

    after(function (done) {
        this.server.close();
        Book.remove({}, function (err) {
            expect(err).to.eql(null);
            done();
        });
    });
});