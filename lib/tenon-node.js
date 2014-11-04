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

var TENON_URL = 'http://www.tenon.io/api/';


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

/**
 * Validate data against the TenonAPI
 * @param  {Object}   data     url or src to be validated
 * @param  {Object}   options  to control how results are returned
 * @param  {Function} callback
 * @return {Object}            Tenon.io results
 */
TenonIO.prototype._validate = function(data, options, callback) {

    data = extend(data, options, this.credentials);

    request.post(TENON_URL, {form: data}, function (err, res, body) {
        if (err) {
            callback(err, {});
        }

        var result;

        try {
            result = JSON.parse(body);
        } catch (err) {
            return callback(err, {});
        }

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
 * @param {Object} options to be sent
 * @return {Object} result from Tenon.io API
 */
TenonIO.prototype.checkUrl = function(url, options, callback) {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    url = args.shift();
    callback = args.pop();

    if (args.length > 0) { options = args.shift(); } else { options = {}; }

    if (url) {
        this._validate({url: url}, options, function(err, result) {
            callback(err, result);
        });
    } else {
        callback(new Error('You must specify a URL to be checked.'), {});
    }
};


/**
 * Check an HTML Document source code against the Tenon.io API
 *
 * @param {String} src code to be checked
 * @param {Object} options to be sent
 * @param {Function} callback
 * @return {Object} result from Tenon.io API
 */
TenonIO.prototype.checkSrc = function(src, options, callback) {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    src = args.shift();
    callback = args.pop();

    if (args.length > 0) { options = args.shift(); } else { options = {}; }

    if (src) {
        this._validate({src: src}, options, function(err, result) {
            callback(err, result);
        });
    } else {
        callback(new Error('You must specify a block of HTML source code to be checked.'), {});
    }
};


/**
 * Check an HTML fragment/block against the Tenon.io API
 *
 * @param {String} src code to be checked
 * @param {Object} options to be sent
 * @param {Function} callback
 * @return {Object} result from Tenon.io API
 */
TenonIO.prototype.checkFragment = function(src, options, callback) {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    src = args.shift();
    callback = args.pop();

    if (args.length > 0) { options = args.shift(); } else { options = {}; }

    if (src) {
        this._validate({src: src, fragment: '1'}, options, function(err, result) {
            callback(err, result);
        });
    } else {
        callback(new Error('You must specify a block of HTML source code to be checked.'), {});
    }
};
