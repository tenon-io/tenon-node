'use strict';

// Import the module
var tenonNode = require('../lib/tenon-node.js');

// Create an instance with your API key
var tenonApi = new tenonNode('YOUR_API_KEY_HERE');


// Examples

// Check a URL
tenonApi.checkUrl('http://www.google.com', function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tenon.checkUrl', result);
    }
});

// Check a block of HTML source code
tenonApi.checkSrc('<p>Test</p>', function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tenon.checkSrc', result);
    }
});
