process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
    config = require('../config'),
    Book = require('../models/book'),
    request = require('superagent');


describe('Adding, listing books', function () {
    before(function (done) {
        this.server = require('../server').listen(config.testPort);
        this.URL = 'http://127.0.0.1:' + config.testPort + '/books/';
        done();
    });

    it('should succeed in adding book', function (done) {
        request.post(this.URL)
            .send({title: 'The Art Of War', author: 'Sun Tzu', year: '500 BC'})
            .end(function (err, res) {
                expect(res.status).to.equal(201);
                done();
            });
    });

    after(function (done) {
        this.server.close();
        Book.remove({}, function (err) {
            expect(err).to.eql(null);
            done();
        });
    });
});