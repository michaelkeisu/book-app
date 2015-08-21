process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
    config = require('../config'),
    Browser = require('zombie');


describe('Adding, listing books', function () {
    beforeEach(function (done) {
        this.server = require('../server');
        this.browser = new Browser({site: 'http://127.0.0.1:' + config.testPort + '/', debug: false, silent: true});
        done();
    });

    it('should load page', function (done) {
        var browser = this.browser;
        browser.visit('/', function () {
            browser.wait(function () {
                expect(browser.text('title')).to.equal('Books');
                done()
            });
        });
    });

    afterEach(function () {
        this.server.close();
    });
});