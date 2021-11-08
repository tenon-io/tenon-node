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

var request = require('request');
var extend = require('xtend');

var TENON_URL = 'https://tenon.io/api/';

/**
 * Tenon.io API client
 * @param {string} apiKey Tenon.io API key
 */
var TenonIO = function(opts) {
  this.configs = {
    key: opts.key,
    endPoint: opts.endPoint || TENON_URL,
  };
};
module.exports = TenonIO;

/**
 * Determine if the string is full page markup
 * true is a full page
 * false is not a full page ie: probably a fragment
 * We're being very loose with what construes a code fragment
 * Tenon will assume it's markup and report back any issues
 * @param  {Object}   string    checks if a string is a HTML page
 * @return {Boolean}
 */
TenonIO.prototype._isHtmlPage = function(str) {
  if (typeof str === 'undefined') {
    return new Error('_isHtmlPage: no arguments provided');
  }

  return str.toLowerCase().indexOf('<html') !== -1;
};

/**
 * Regular Expression for URL validation
 * protocol is optional
 * @param  {Object}   data     string to be validated
 * @return {boolean}
 */
TenonIO.prototype._isUrl = function(str) {
  // pass --> http://google.com
  // pass --> ftp://google.com
  // pass --> google.com
  // pass --> localhost
  // pass --> 127.0.0.1
  // pass --> 1.1.1.1
  // pass --> http://127.0.0.1
  // pass --> http://localhost
  // fail --> foo
  // fail --> http://foo
  // pass --> http://
  // fail --> http:dfsdgfg.com
  // pass --> a.io
  //
  // Author: Diego Perini
  // Updated: 2010/12/05
  // License: MIT
  //
  // Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
  // https://gist.github.com/dperini/729294
  // modified by Asa Baylus to accomodate a wider range of URLs
  if (typeof str === 'undefined') {
    return new Error('_isUrl: no arguments provided');
  }
  /* eslint-disable max-len */
  return /^(?:(?:https?|ftp|):\/\/)?(localhost|127\.0\.0\.1)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)?(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))?(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(str);
};

/**
 * Validate data against the TenonAPI
 * @param  {Object}   data     url or src to be validated
 * @param  {Object}   options  to control how results are returned
 * @param  {Function} callback
 * @return {Object}            Tenon.io results
 */
TenonIO.prototype._validate = function(data, options, callback) {
  data = extend(data, options, this.configs);

  request.post(this.configs.endPoint, { form: data }, function(err, res, body) {
    if (err) {
      callback(err, {});
    }

    var result;

    try {
      result = JSON.parse(body);
    } catch (parseErr) {
      return callback(parseErr, {});
    }

    return callback(err, result || {});
  });
};

/**
 * Determines if test target is a URL of markup
 * Routes to the correct function checkUrl | Src | Fragment
 *
 * @param {String} url or html to be checked
 * @param {Object} options to be sent
 * @return {Object} result from Tenon.io API
 */
TenonIO.prototype.analyze = function(target, options, callback) {
  var args = [];
  for (var i = 0; i < arguments.length; i += 1) {
    args.push(arguments[i]);
  }

  target = args.shift();
  callback = args.pop();

  if (args.length > 0) { options = args.shift(); } else { options = {}; }

  if (target) {
    // route test to the appropriate check method
    if (this._isUrl(target)) {
      this.checkUrl(target, options, callback);
    } else if (this._isHtmlPage(target)) {
      this.checkSrc(target, options, callback);
    } else {
      this.checkFragment(target, options, callback);
    }
  } else {
    callback(new Error('You must specify a URL or HTML to be checked.'), {});
  }
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
  for (var i = 0; i < arguments.length; i += 1) {
    args.push(arguments[i]);
  }

  url = args.shift();
  callback = args.pop();

  if (args.length > 0) { options = args.shift(); } else { options = {}; }

  if (url) {
    this._validate({ url: url }, options, function(err, result) {
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
  for (var i = 0; i < arguments.length; i += 1) {
    args.push(arguments[i]);
  }

  src = args.shift();
  callback = args.pop();

  if (args.length > 0) { options = args.shift(); } else { options = {}; }

  if (src) {
    this._validate({ src: src }, options, function(err, result) {
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
  for (var i = 0; i < arguments.length; i += 1) {
    args.push(arguments[i]);
  }

  src = args.shift();
  callback = args.pop();

  if (args.length > 0) { options = args.shift(); } else { options = {}; }

  if (src) {
    this._validate({ src: src, fragment: '1' }, options, function(err, result) {
      callback(err, result);
    });
  } else {
    callback(new Error('You must specify a block of HTML source code to be checked.'), {});
  }
};
