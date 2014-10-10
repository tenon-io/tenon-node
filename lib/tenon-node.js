/*
 * tenon-node
 * Node.js wrapper for the Tenon.io API
 *
 * https://github.com/poorgeek/tenon-node
 *
 * Copyright (c) 2014 Justin Stockton
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request'),
    extend = require('xtend');

var TENON_URL = 'http://beta.tenon.io/api/';

/**
 * Tenon.io API client
 * @param {string} apiKey Tenon.io API key
 */
var TenonIO = function(apiKey) {
    this.credentials = {
        key: apiKey
    };
};
module.exports = TenonIO;


TenonIO.prototype._validate = function(data, callback) {
    data = extend(data, this.credentials);

    request.post(TENON_URL, {form: data}, function (err, res, body) {
        if (err) {
            callback(err, {});
        }

        var result = JSON.parse(body);

        // Did Tenon.io return an error?
        if (result.status !== 200) {
            return callback(new Error(result.message), {});
        }

        callback(err, result || {});
    });
};


/**
 * Check a URL against the Tenon.io API
 *
 * @param {String} url to be checked
 * @return {Object} result from Tenon.io API
 */
TenonIO.prototype.checkUrl = function(url, callback) {
    if (url) {
        this._validate({url: url}, function(err, result) {
            callback(err, result);
        });
    } else {
        callback(new Error('You must specify a URL to be checked.'), {});
    }
};


/**
 * Check a block of HTML source code against the Tenon.io API
 *
 * @param {String} src code to be checked
 * @param {Function} callback
 * @return {Object} result from Tenon.io API
 */
TenonIO.prototype.checkSrc = function(src, callback) {
    if (src) {
        this._validate({src: src}, function(err, result) {
            callback(err, result);
        });
    } else {
        callback(new Error('You must specify a block of HTML source code to be checked.'), {});
    }
};
