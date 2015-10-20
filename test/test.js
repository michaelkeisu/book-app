process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
    config = require('../config'),
    Book = require('../models/book'),
    Browser = require('zombie');


describe('Adding, listing books', function () {
    before(function (done) {
        this.server = require('../server').listen(config.testPort);
        this.browser = new Browser({site: 'http://localhost:' + config.testPort});
        done();
    });

    it('should load page', function (done) {
        var browser = this.browser;
        browser.visit('/books').then(function () {
            expect(browser.success);
        }).then(done, done);
    });

    //it('should go to add page', function (done) {
    //    var browser = this.browser;
    //    browser.visit('/books').then(function () {
    //        expect(browser.success);
    //        expect(browser.text('title')).to.equal('Books');
    //        browser.clickLink('Add Book', function(e, browser, status) {
    //            console.log(status);
    //        })
    //    }).then(done, done);
    //});



    after(function (done) {
        this.server.close();
        Book.remove({});
        done();
    });
});