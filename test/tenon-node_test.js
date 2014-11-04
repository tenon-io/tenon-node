/*global describe,it*/
'use strict';

var expect = require('must'),
    nock = require('nock'),
    tenonNode = require('../lib/tenon-node.js');

describe('tenon-node module:', function() {

    var API_URL = 'http://www.tenon.io';

    var api = new tenonNode('AN_API_KEY');

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
