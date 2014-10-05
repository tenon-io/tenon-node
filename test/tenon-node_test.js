/*global describe,it*/
'use strict';
var assert = require('assert'),
  tenonNode = require('../lib/tenon-node.js');

describe('tenon-node node module.', function() {
  it('must be awesome', function() {
    assert( tenonNode.awesome(), 'awesome');
  });
});
