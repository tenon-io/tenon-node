### Active maintenance of tenon-node has moved to [tenon-io/tenon-node](https://github.com/tenon-io/tenon-node).

# Node.js wrapper for the Tenon.io API

[![NPM](https://nodei.co/npm/@tenon-io/tenon-node.png)](https://nodei.co/npm/@tenon-io/tenon-node/)

[![Build Status](https://secure.travis-ci.org/tenon-io/tenon-node.png?branch=main)](http://travis-ci.org/tenon-io/tenon-node)


## Getting Started

Install the module with: `npm install @tenon-io/tenon-node`

```js
const tenonNode = require('tenon-node');

// Create an instance with your API key
const tenonApi = new tenonNode({
    key: 'YOUR_API_KEY_HERE',
    endPoint: 'http://tenon.io' // or your private tenon instance
});

tenonApi.analyze('http://www.example.com', function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log('Tenon.checkUrl', result);
    }
});

```

## Documentation

Each of the following methods takes an optional options object that can be
More information about available options can be found in the [Tenon API documentation](https://tenon.io/documentation/understanding-request-parameters.php).
### `analyze(string, [options,] callback)`

Tests a given url, code snippet or full HTML page for accessibility issues.

### `checkUrl(url, [options,] callback)`

Tests a given URL for accessibility issues.

### `checkSrc(src, [options,] callback)`

Tests a complete HTML document for accessibility issues.

**Note:** if you want to test a fragment, block or snippet of code against Tenon, then use `checkFragment()` or specify `fragment: '1'` in your options.

### `checkFragment(src, [options,] callback)`

Tests a fragment, block or snippet of code for accessibility issues.

## Examples

See `example/tenon-node_example.js`


## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Justin Stockton  
Licensed under the MIT license.
