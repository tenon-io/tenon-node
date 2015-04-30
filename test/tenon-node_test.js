/*global describe,it*/
'use strict';

var expect = require('must'),
    nock = require('nock'),
    tenonNode = require('../lib/tenon-node.js');

describe('tenon-node module:', function() {

    var API_URL = 'http://www.tenon.io';

    var api = new tenonNode({
        key: 'AN_API_KEY',
        baseUrl: 'http://tenon.io'
    });

    describe('tenonNode', function() {

        it('should accept a endPoint', function() {
            api.checkUrl('', function() {
                expect(api.configs.endPoint).to.equal('http://tenon.io/api/');
            });
        });

        it('should accept an API key', function() {
            api.checkUrl('', function() {
                expect(api.configs.key).to.equal('AN_API_KEY');
            });
        });
    });

    describe('_isHtmlPage', function (){

        it('should throw an Error when arguments are to not provided', function (){
            expect(api._isHtmlPage()).to.throw(Error);
        });

        it('should return true when passed an HTML Page', function () {
            expect(api._isHtmlPage('<html><p>foo</p></html>')).to.be.true();
        });

        it('should return false when passed an HTML Fragment', function () {
            expect(api._isHtmlPage('<p>foo</p>')).to.be.false();
        });

        it('should return false when passed an non-HTML string', function () {
            expect(api._isHtmlPage('foo')).to.be(false);
        });
    });

    describe('_isUrl', function (){

        it('should throw an Error when arguments are to not provided', function (){
            expect(api._isUrl()).to.throw(Error);
        });

        it('should return true when passed a Url', function (){
            expect(api._isUrl('http://example.com')).to.be.true();
        });

        it('should return false when passed a non-Url string', function (){
            expect(api._isUrl('foo')).to.be.false();
        });
    });

    describe('analyze', function(){
        it('should return an error if no URL or HTML is povided', function(){
            api.analyze('', function(err, result){
                expect(err.message).to.be('You must specify a URL or HTML to be checked.');
                expect(result).to.be.empty();
            });
        });

        it('should proccess a URL and return a JSON result object from the Tenon.api', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 200,
                    resultSet: 'success!'
                });

            api.analyze('http://www.example.com', {}, function(err, result) {
                expect(err).to.be.null();
                expect(result).to.not.be.empty();
            });
        });

        it('should proccess an HTML page and return a JSON result object from the Tenon.api', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 200,
                    resultSet: 'success!'
                });

            api.analyze('<html lang="en"><head><title>Test page</title><head><body><img src="test.jpg"></body></html>', function(err, result) {
                expect(err).to.be.null();
                expect(result).to.be.not.null();
            });
        });

        it('should proccess an HTML Fragment and return a JSON result object from the Tenon.api', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 200,
                    resultSet: 'success!'
                });

            api.checkSrc('<p>test</p>', function(err, result) {
                expect(err).to.be.null();
                expect(result).to.be.not.null();
            });
        });
    });

    describe('checkUrl', function() {
        it('should return an error if a URL is not specified', function() {
            api.checkUrl('', function(err, result) {
                expect(err.message).to.be('You must specify a URL to be checked.');
                expect(result).to.be.empty();
            });
        });

        it('should return an error if Tenon API returns an error message', function() {
            var url = 'http://www.example.com';

            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 999,
                    message: 'a message'
                });

            api.checkUrl(url, {}, function(err, result) {
                expect(err).to.be.not.null();
                expect(err.message).to.be('a message');
                expect(result).to.be.empty();
            });
        });

        it('should return a JSON result object from the Tenon.api', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 200,
                    resultSet: 'success!'
                });

            api.checkUrl('http://www.example.com', {}, function(err, result) {
                expect(err).to.be.null();
                expect(result).to.not.be.empty();
            });
        });
    });

    describe('checkSrc', function() {
        it('should return an error if an HTML page is not specified', function() {
            api.checkSrc('', function(err, result) {
                expect(err.message).to.be('You must specify a block of HTML source code to be checked.');
                expect(result).to.be.empty();
            });
        });

        it('should return an error from the API if something goes wrong', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 999,
                    message: 'a message'
                });

            api.checkSrc('<html lang="en"><head><title>Test page</title><head><body><img src="test.jpg"></body></html>', {}, function(err, result) {
                expect(err.message).to.be('a message');
                expect(result).to.be.empty();
            });
        });

        it('should return a JSON result object from the Tenon.api', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 200,
                    resultSet: 'success!'
                });

            api.checkSrc('<p>test</p>', function(err, result) {
                expect(err).to.be.null();
                expect(result).to.be.not.null();
            });
        });
    });

    describe('checkFragment', function() {
        it('should return an error if a block of HTML is not specified', function() {
            api.checkSrc('', function(err, result) {
                expect(err.message).to.be('You must specify a block of HTML source code to be checked.');
                expect(result).to.be.empty();
            });
        });

        it('should return an error from the API if something goes wrong', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 999,
                    message: 'a message'
                });

            api.checkSrc('<p>test</p>', {}, function(err, result) {
                expect(err.message).to.be('a message');
                expect(result).to.be.empty();
            });
        });

        it('should return a JSON result object from the Tenon.api', function() {
            nock(API_URL)
                .filteringRequestBody(function() {
                    return '*';
                })
                .post('/api/', '*')
                .reply(200, {
                    status: 200,
                    resultSet: 'success!'
                });

            api.checkSrc('<p>test</p>', function(err, result) {
                expect(err).to.be.null();
                expect(result).to.be.not.null();
            });
        });
    });
});
